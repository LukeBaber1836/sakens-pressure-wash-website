"use client";

import {
  cloneElement,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentProps,
  type FormEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import {
  TbArrowLeft,
  TbArrowRight,
  TbBuildings,
  TbBuildingStore,
  TbCar,
  TbCheck,
  TbCircleCheckFilled,
  TbCloudRain,
  TbCrane,
  TbDroplets,
  TbFence,
  TbGasStation,
  TbGrill,
  TbHome,
  TbInfoCircle,
  TbParking,
  TbPencil,
  TbSpray,
  TbTrash,
  TbWalk,
  TbWindow,
} from "react-icons/tb";
import type { IconType } from "react-icons";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { commercialServices, houseServices } from "../components/services-breakdown-data";

type PropertyType = "residential" | "commercial";

type QuoteData = {
  propertyType: PropertyType | null;
  businessName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  zip: string;
  services: string[];
  details: string;
};

type Errors = Partial<Record<keyof QuoteData, string>>;

const initialData: QuoteData = {
  propertyType: null,
  businessName: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  street: "",
  city: "",
  zip: "",
  services: [],
  details: "",
};

const steps = [
  { title: "Type", heading: "What kind of property is it?" },
  { title: "Your info", heading: "Tell us about you" },
  { title: "Services", heading: "Which services do you need?" },
  { title: "Details", heading: "Anything else we should know?", optional: true },
  { title: "Review", heading: "Look it over" },
] as { title: string; heading: string; optional?: boolean }[];

const propertyTypes: { value: PropertyType; label: string; text: string; Icon: typeof TbHome }[] = [
  { value: "residential", label: "Residential", text: "Homes, driveways, fences", Icon: TbHome },
  {
    value: "commercial",
    label: "Commercial",
    text: "Storefronts, lots, job sites",
    Icon: TbBuildingStore,
  },
];

// Keyed by service id from services-breakdown-data; anything missing falls back to a droplet.
const serviceIcons: Record<string, IconType> = {
  roof: TbHome,
  siding: TbSpray,
  windows: TbWindow,
  gutters: TbCloudRain,
  fence: TbFence,
  patio: TbGrill,
  driveway: TbCar,
  sidewalk: TbWalk,
  building: TbBuildings,
  "gas-station": TbGasStation,
  "parking-lot": TbParking,
  "post-construction": TbCrane,
  "dumpster-pad": TbTrash,
};

// TEMP: lets the progress bar jump to any step, skipping validation, to preview each screen.
// Set to false (or delete it and the onSelect wiring) before launch.
const PREVIEW_STEPS = true;

const spring = { type: "spring", bounce: 0.1, visualDuration: 0.4 } as const;

function servicesFor(type: PropertyType | null) {
  return type === "commercial" ? commercialServices : houseServices;
}

function validate(step: number, data: QuoteData): Errors {
  const errors: Errors = {};
  if (step === 0 && !data.propertyType) errors.propertyType = "Choose residential or commercial.";
  if (step === 1) {
    if (data.propertyType === "commercial" && !data.businessName.trim())
      errors.businessName = "Enter your business name.";
    if (!data.firstName.trim()) errors.firstName = "Enter your first name.";
    if (!data.lastName.trim()) errors.lastName = "Enter your last name.";
    if (!/^\S+@\S+\.\S+$/.test(data.email.trim())) errors.email = "Enter a valid email.";
    if (data.phone.replace(/\D/g, "").length !== 10)
      errors.phone = "Enter a 10-digit phone number.";
    if (!data.street.trim()) errors.street = "Enter the property address.";
    if (!data.city.trim()) errors.city = "Enter the city.";
    if (!/^\d{5}$/.test(data.zip.trim())) errors.zip = "Enter a 5-digit ZIP.";
  }
  if (step === 2 && data.services.length === 0) errors.services = "Pick at least one service.";
  return errors;
}

// (903) 539-8960 as you type.
function formatPhone(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

/**
 * Multi-step quote request: residential or commercial, who you are, where the property is and what needs washing, any extra
 * notes, then a review screen. Each step validates before moving on.
 */
export function QuoteForm({ className }: { className?: string }) {
  const [step, setStep] = useState(0);
  // Slide direction for the step transition: 1 forward, -1 back.
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<QuoteData>(initialData);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);
  const advance = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(advance.current), []);

  // Move focus to the new step's heading so keyboard and screen reader users follow along.
  useEffect(() => {
    if (moved.current) headingRef.current?.focus({ preventScroll: true });
  }, [step, status]);

  function update<K extends keyof QuoteData>(key: K, value: QuoteData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function setPropertyType(type: PropertyType) {
    // The two property types offer different services, so a switch clears the old picks.
    setData((prev) =>
      prev.propertyType === type ? prev : { ...prev, propertyType: type, services: [] }
    );
    setErrors({});
    // The pick is the whole step, so move straight on once the selection has registered.
    clearTimeout(advance.current);
    advance.current = setTimeout(() => goTo(1), 280);
  }

  function goTo(next: number) {
    clearTimeout(advance.current);
    moved.current = true;
    setDirection(next > step ? 1 : -1);
    setErrors({});
    setStep(next);
  }

  function next() {
    const found = validate(step, data);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      const first = Object.keys(found)[0];
      document.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
      return;
    }
    goTo(step + 1);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (step < steps.length - 1) return next();
    setStatus("submitting");
    // TODO: send `data` to the quote inbox once the backend is wired up.
    await new Promise((resolve) => setTimeout(resolve, 600));
    moved.current = true;
    setStatus("done");
  }

  const isLast = step === steps.length - 1;

  return (
    <MotionConfig transition={spring} reducedMotion="user">
      <div className={className}>
        {status === "done" ? (
          <Success ref={headingRef} name={data.firstName} />
        ) : (
          <form noValidate onSubmit={handleSubmit}>
            <Progress step={step} onSelect={PREVIEW_STEPS ? goTo : undefined} />

            <div className="relative mt-10 sm:mt-12">
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={{
                    enter: (d: number) => ({ opacity: 0, x: d * 40 }),
                    center: { opacity: 1, x: 0 },
                    exit: (d: number) => ({ opacity: 0, x: d * -40 }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  <h2
                    ref={headingRef}
                    tabIndex={-1}
                    className="text-2xl font-bold text-brand-foreground outline-none sm:text-[28px]"
                  >
                    {steps[step].heading}
                    {steps[step].optional && (
                      <span className="ml-2 text-lg font-normal text-foreground/55 sm:text-xl">
                        (optional)
                      </span>
                    )}
                  </h2>

                  <div className="mt-7">
                    {step === 0 && (
                      <TypeStep data={data} errors={errors} onSelect={setPropertyType} />
                    )}
                    {step === 1 && <InfoStep data={data} errors={errors} update={update} />}
                    {step === 2 && <ServicesStep data={data} errors={errors} update={update} />}
                    {step === 3 && <DetailsStep data={data} update={update} />}
                    {step === 4 && <ReviewStep data={data} onEdit={goTo} />}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-10 flex items-center justify-between gap-3 border-t border-brand-foreground/10 pt-6">
              {step > 0 ? (
                <Button type="button" variant="ghost" onClick={() => goTo(step - 1)}>
                  <TbArrowLeft data-icon="inline-start" />
                  Back
                </Button>
              ) : (
                <span />
              )}
              <Button type="submit" variant="brand" size="lg" disabled={status === "submitting"}>
                {isLast ? (status === "submitting" ? "Sending…" : "Submit request") : "Continue"}
                {!isLast && <TbArrowRight data-icon="inline-end" />}
              </Button>
            </div>
          </form>
        )}
      </div>
    </MotionConfig>
  );
}

function Progress({ step, onSelect }: { step: number; onSelect?: (step: number) => void }) {
  return (
    <ol className="flex">
      {steps.map((s, i) => {
        const done = i < step;
        const current = i === step;
        return (
          <li
            key={s.title}
            aria-current={current ? "step" : undefined}
            className="relative flex flex-1 flex-col items-center gap-2"
          >
            {/* Connector to the previous step, filled once that step is complete. It stops short of
                both circles so it never shows through them. */}
            {i > 0 && (
              <span
                aria-hidden="true"
                className="absolute top-4 right-[calc(50%+1.5rem)] left-[calc(-50%+1.5rem)] h-0.5 -translate-y-1/2 rounded-full bg-brand-foreground/10"
              >
                <motion.span
                  initial={false}
                  animate={{ scaleX: i <= step ? 1 : 0 }}
                  className="block size-full origin-left rounded-full bg-brand"
                />
              </span>
            )}
            <span
              className={cn(
                "relative grid size-8 place-items-center rounded-full text-sm font-bold transition-colors duration-300",
                done && "bg-brand text-brand-foreground",
                current && "bg-brand-foreground text-white ring-4 ring-brand/30",
                !done &&
                  !current &&
                  "bg-white text-brand-foreground/40 ring-1 ring-brand-foreground/15"
              )}
            >
              {done ? <TbCheck className="size-4" strokeWidth={3} /> : i + 1}
            </span>
            <span
              className={cn(
                "text-center text-[11px] font-bold tracking-wider uppercase transition-colors duration-300 sm:text-xs",
                current ? "text-brand-foreground" : "text-brand-foreground/45"
              )}
            >
              {s.title}
            </span>
            {onSelect && (
              <button
                type="button"
                aria-label={`Go to ${s.title}`}
                onClick={() => onSelect(i)}
                className="absolute inset-0 z-10 rounded-xl"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

type StepProps = {
  data: QuoteData;
  errors: Errors;
  update: <K extends keyof QuoteData>(key: K, value: QuoteData[K]) => void;
};

function TypeStep({
  data,
  errors,
  onSelect,
}: Omit<StepProps, "update"> & { onSelect: (type: PropertyType) => void }) {
  return (
    <fieldset>
      <legend className="sr-only">Property type</legend>
      <div role="radiogroup" className="grid gap-4 sm:grid-cols-2">
        {propertyTypes.map(({ value, label, text, Icon }, i) => {
          const selected = data.propertyType === value;
          return (
            <label
              key={value}
              className={cn(
                "relative flex cursor-pointer flex-col items-center gap-4 rounded-3xl bg-white px-6 py-10 text-center ring-1 transition-all duration-200 has-focus-visible:ring-2 has-focus-visible:ring-brand",
                selected
                  ? "shadow-[0_20px_40px_-24px_rgba(1,20,45,0.4)] ring-2 ring-brand"
                  : "ring-brand-foreground/10 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-28px_rgba(1,20,45,0.35)] hover:ring-brand-foreground/25",
                errors.propertyType && "ring-destructive/60"
              )}
            >
              <input
                type="radio"
                name="propertyType"
                value={value}
                checked={selected}
                onChange={() => onSelect(value)}
                data-field={i === 0 ? "propertyType" : undefined}
                className="sr-only"
              />
              <TbCircleCheckFilled
                aria-hidden="true"
                className={cn(
                  "absolute top-4 right-4 size-6 text-brand transition-all duration-200",
                  selected ? "scale-100 opacity-100" : "scale-50 opacity-0"
                )}
              />
              <span
                className={cn(
                  "grid size-16 place-items-center rounded-2xl transition-colors duration-200",
                  selected ? "bg-brand text-brand-foreground" : "bg-tint text-brand-foreground/70"
                )}
              >
                <Icon className="size-8" />
              </span>
              <span className="flex flex-col gap-1">
                <span className="text-xl font-bold text-brand-foreground">{label}</span>
                <span className="text-[15px] text-foreground/65">{text}</span>
              </span>
            </label>
          );
        })}
      </div>
      <FieldError message={errors.propertyType} />
    </fieldset>
  );
}

function InfoStep({ data, errors, update }: StepProps) {
  return (
    <div className="flex flex-col gap-5">
      {data.propertyType === "commercial" && (
        <Field label="Business name" error={errors.businessName}>
          <Input
            data-field="businessName"
            autoComplete="organization"
            value={data.businessName}
            onChange={(e) => update("businessName", e.target.value)}
          />
        </Field>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="First name" error={errors.firstName}>
          <Input
            data-field="firstName"
            autoComplete="given-name"
            value={data.firstName}
            onChange={(e) => update("firstName", e.target.value)}
          />
        </Field>
        <Field label="Last name" error={errors.lastName}>
          <Input
            data-field="lastName"
            autoComplete="family-name"
            value={data.lastName}
            onChange={(e) => update("lastName", e.target.value)}
          />
        </Field>
        <Field label="Email" error={errors.email}>
          <Input
            data-field="email"
            type="email"
            autoComplete="email"
            value={data.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </Field>
        <Field label="Phone number" error={errors.phone}>
          <Input
            data-field="phone"
            type="tel"
            autoComplete="tel-national"
            inputMode="tel"
            placeholder="(903) 555-0123"
            value={data.phone}
            onChange={(e) => update("phone", formatPhone(e.target.value))}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-6">
        <Field label="Property address" error={errors.street} className="sm:col-span-6">
          <Input
            data-field="street"
            autoComplete="address-line1"
            value={data.street}
            onChange={(e) => update("street", e.target.value)}
          />
        </Field>
        <Field label="City" error={errors.city} className="sm:col-span-4">
          <Input
            data-field="city"
            autoComplete="address-level2"
            placeholder="Tyler"
            value={data.city}
            onChange={(e) => update("city", e.target.value)}
          />
        </Field>
        <Field label="ZIP" error={errors.zip} className="sm:col-span-2">
          <Input
            data-field="zip"
            autoComplete="postal-code"
            inputMode="numeric"
            maxLength={5}
            value={data.zip}
            onChange={(e) => update("zip", e.target.value.replace(/\D/g, ""))}
          />
        </Field>
      </div>
    </div>
  );
}

function ServicesStep({ data, errors, update }: StepProps) {
  const services = servicesFor(data.propertyType);

  function toggle(id: string) {
    update(
      "services",
      data.services.includes(id) ? data.services.filter((s) => s !== id) : [...data.services, id]
    );
  }

  return (
    <div>
      <fieldset>
        <legend className="sr-only">Services</legend>
        <TooltipProvider>
          <div className="grid gap-3 sm:grid-cols-2">
            {services.map((service, i) => {
              const checked = data.services.includes(service.id);
              const ServiceIcon = serviceIcons[service.id] ?? TbDroplets;
              return (
                <label
                  key={service.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-2xl p-4 ring-1 transition-all duration-200 has-focus-visible:ring-2 has-focus-visible:ring-brand",
                    checked
                      ? "bg-white ring-2 ring-brand"
                      : "bg-white ring-brand-foreground/15 hover:ring-brand-foreground/30"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(service.id)}
                    data-field={i === 0 ? "services" : undefined}
                    className="sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className={cn(
                      "grid size-5 shrink-0 place-items-center rounded-md transition-colors duration-200",
                      checked
                        ? "bg-brand text-brand-foreground"
                        : "bg-white ring-1 ring-brand-foreground/25"
                    )}
                  >
                    <TbCheck
                      className={cn(
                        "size-3.5 transition-transform duration-200",
                        checked ? "scale-100" : "scale-0"
                      )}
                      strokeWidth={3}
                    />
                  </span>
                  <ServiceIcon
                    aria-hidden="true"
                    className={cn("size-6 shrink-0 transition-colors duration-200", "text-brand")}
                  />
                  <span className="font-bold text-brand-foreground">{service.name}</span>
                  <Tooltip>
                    <TooltipTrigger
                      type="button"
                      aria-label={`About ${service.name}`}
                      // Keep the click from reaching the label and toggling the checkbox.
                      onClick={(e) => e.preventDefault()}
                      className="-m-1 grid size-7 shrink-0 place-items-center rounded-full text-brand-foreground/40 transition-colors outline-none hover:text-brand-foreground focus-visible:ring-2 focus-visible:ring-brand data-popup-open:text-brand-foreground"
                    >
                      <TbInfoCircle className="size-[18px]" />
                    </TooltipTrigger>
                    <TooltipContent>{service.description}</TooltipContent>
                  </Tooltip>
                </label>
              );
            })}
          </div>
        </TooltipProvider>
        <FieldError message={errors.services} />
      </fieldset>
    </div>
  );
}

function DetailsStep({ data, update }: Omit<StepProps, "errors">) {
  return (
    <div className="flex flex-col gap-2">
      <textarea
        aria-label="Notes for Saken (optional)"
        rows={6}
        value={data.details}
        onChange={(e) => update("details", e.target.value)}
        placeholder="Gate codes, problem spots, the best time to reach you, or anything else that would help."
        className={cn(inputClass, "h-auto resize-y py-3 leading-relaxed")}
      />
    </div>
  );
}

function ReviewStep({ data, onEdit }: { data: QuoteData; onEdit: (step: number) => void }) {
  const serviceNames = servicesFor(data.propertyType)
    .filter((s) => data.services.includes(s.id))
    .map((s) => s.name);

  return (
    <div className="flex flex-col gap-4">
      <ReviewCard title="Property type" onEdit={() => onEdit(0)}>
        <ReviewRow
          label="Type"
          value={data.propertyType === "commercial" ? "Commercial" : "Residential"}
        />
      </ReviewCard>
      <ReviewCard title="Your info" onEdit={() => onEdit(1)}>
        {data.propertyType === "commercial" && (
          <ReviewRow label="Business" value={data.businessName} />
        )}
        <ReviewRow label="Name" value={`${data.firstName} ${data.lastName}`} />
        <ReviewRow label="Email" value={data.email} />
        <ReviewRow label="Phone" value={data.phone} />
        <ReviewRow label="Address" value={`${data.street}, ${data.city}, TX ${data.zip}`} />
      </ReviewCard>
      <ReviewCard title="Services" onEdit={() => onEdit(2)}>
        <ReviewRow label="Services" value={serviceNames.join(", ")} />
      </ReviewCard>
      <ReviewCard title="Details" onEdit={() => onEdit(3)}>
        <p className="text-[15px] whitespace-pre-line text-foreground/80">
          {data.details.trim() || <span className="text-foreground/50">No extra notes.</span>}
        </p>
      </ReviewCard>
    </div>
  );
}

function ReviewCard({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-tint/60 p-5 ring-1 ring-brand-foreground/10">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-brand-foreground">{title}</h3>
        <Button type="button" variant="ghost" size="xs" onClick={onEdit}>
          <TbPencil data-icon="inline-start" />
          Edit
        </Button>
      </div>
      <dl className="mt-3 flex flex-col gap-2">{children}</dl>
    </section>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-0.5 text-[15px] sm:grid-cols-[7rem_1fr] sm:gap-4">
      <dt className="text-foreground/55">{label}</dt>
      <dd className="font-medium text-foreground/90">{value}</dd>
    </div>
  );
}

function Success({ ref, name }: { ref: Ref<HTMLHeadingElement>; name: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center px-6 py-16 text-center sm:px-10 sm:py-20"
    >
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", bounce: 0.45, visualDuration: 0.5, delay: 0.1 }}
        className="grid size-20 place-items-center rounded-full bg-brand text-brand-foreground"
      >
        <TbCheck className="size-10" strokeWidth={2.5} />
      </motion.span>
      <h2
        ref={ref}
        tabIndex={-1}
        className="mt-6 text-3xl font-extrabold tracking-[-0.02em] text-brand-foreground outline-none"
      >
        Thanks, {name}!
      </h2>
      <p className="mt-3 max-w-md text-[17px] leading-relaxed text-foreground/80">
        Your request is in. Saken will reach out shortly to set up your free estimate.
      </p>
    </motion.div>
  );
}

const inputClass =
  "h-12 w-full rounded-xl bg-white px-4 text-[15px] text-foreground ring-1 ring-brand-foreground/15 transition-shadow outline-none placeholder:text-foreground/35 hover:ring-brand-foreground/30 focus-visible:ring-2 focus-visible:ring-brand aria-invalid:ring-2 aria-invalid:ring-destructive/60";

function Input(props: ComponentProps<"input">) {
  return <input {...props} className={cn(inputClass, props.className)} />;
}

/** Label, control, and error message. The control is cloned with the matching id and aria props. */
function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: ReactElement<ComponentProps<"input">>;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  const control = cloneElement(children, {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
  });
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-[15px] font-semibold text-brand-foreground">
        {label}
      </label>
      {control}
      <FieldError id={errorId} message={error} />
    </div>
  );
}

function FieldError({ id, message }: { id?: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-sm font-medium text-destructive">
      {message}
    </p>
  );
}
