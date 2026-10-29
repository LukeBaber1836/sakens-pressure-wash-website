import {
  commercialServices,
  houseServices,
} from "../components/services-breakdown-data";

// Shared by the quote form and the server action that sends it, so both check submissions the same way.

export type PropertyType = "residential" | "commercial";

export type QuoteData = {
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

export type Errors = Partial<Record<keyof QuoteData, string>>;

type ServiceOption = { id: string; name: string; description: string };

// Offered on the form but not pinned on the homepage illustration, so it's defined here rather than
// with the hotspots in services-breakdown-data.
const hoaPackage: ServiceOption = {
  id: "hoa",
  name: "HOA cleaning package",
  description:
    "Neighborhood entrances, sidewalks, common areas, and amenities cleaned together as one package for your HOA.",
};

const commercialOptions: ServiceOption[] = [...commercialServices, hoaPackage];

export function servicesFor(type: PropertyType | null): ServiceOption[] {
  return type === "commercial" ? commercialOptions : houseServices;
}

export function validate(step: number, data: QuoteData): Errors {
  const errors: Errors = {};
  if (step === 0 && !data.propertyType)
    errors.propertyType = "Choose residential or commercial.";
  if (step === 1) {
    if (data.propertyType === "commercial" && !data.businessName.trim())
      errors.businessName = "Enter your business name.";
    if (!data.firstName.trim()) errors.firstName = "Enter your first name.";
    if (!data.lastName.trim()) errors.lastName = "Enter your last name.";
    if (!/^\S+@\S+\.\S+$/.test(data.email.trim()))
      errors.email = "Enter a valid email.";
    if (data.phone.replace(/\D/g, "").length !== 10)
      errors.phone = "Enter a 10-digit phone number.";
    if (!data.street.trim()) errors.street = "Enter the property address.";
    if (!data.city.trim()) errors.city = "Enter the city.";
    if (!/^\d{5}$/.test(data.zip.trim())) errors.zip = "Enter a 5-digit ZIP.";
  }
  if (step === 2 && data.services.length === 0)
    errors.services = "Pick at least one service.";
  return errors;
}
