"use client";

import * as SelectPrimitive from "@animate-ui/react/primitives/radix-ui/select";
import type {
  SelectContentProps,
  SelectItemProps,
  SelectTriggerProps,
} from "@animate-ui/react/primitives/radix-ui/select";
import type { ComponentProps } from "react";
import { AnimateUIProvider } from "@animate-ui/react/provider";
import { TbCheck, TbChevronDown } from "react-icons/tb";
import { cn } from "@/lib/utils";

/**
 * Animate UI's Radix select, styled for the site: a white field matching the form inputs, opening
 * onto a white panel with a tinted highlight and an orange check on the chosen item.
 */
// Twice Animate UI's default pace, so the panel and its items' staggered entrance take half as long.
function Select(props: ComponentProps<typeof SelectPrimitive.Root>) {
  return (
    <AnimateUIProvider tempo={0.5}>
      <SelectPrimitive.Root {...props} />
    </AnimateUIProvider>
  );
}

const SelectValue = SelectPrimitive.Value;
const SelectGroup = SelectPrimitive.Group;

function SelectTrigger({ className, children, ...props }: SelectTriggerProps) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "group/select flex h-12 w-full items-center justify-between gap-2 rounded-xl bg-white px-4 text-left text-[15px] text-foreground ring-1 ring-brand-foreground/15 transition-shadow outline-none hover:ring-brand-foreground/30 focus-visible:ring-2 focus-visible:ring-brand aria-invalid:ring-2 aria-invalid:ring-destructive/60 data-[placeholder]:text-foreground/35 data-[state=open]:ring-2 data-[state=open]:ring-brand",
        className,
      )}
      {...props}
    >
      <span className="truncate">{children}</span>
      <SelectPrimitive.Icon asChild>
        <TbChevronDown
          aria-hidden="true"
          className="size-4 shrink-0 text-brand-foreground/50 transition-transform duration-200 group-data-[state=open]/select:rotate-180"
        />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = "popper",
  sideOffset = 6,
  ...props
}: SelectContentProps) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        position={position}
        sideOffset={sideOffset}
        className={cn(
          // Matches the trigger's width and stays within the room left on screen. Animate UI's highlight
          // glides between items; it's hidden so the item's own tint shows the moment it's hovered.
          "z-50 **:data-[slot=item-highlight]:hidden max-h-[min(18rem,var(--radix-select-content-available-height))] w-(--radix-select-trigger-width) min-w-40 overflow-hidden rounded-xl bg-white text-[15px] text-foreground shadow-[0_18px_40px_-16px_rgba(1,20,45,0.35)] ring-1 ring-brand-foreground/10",
          className,
        )}
        {...props}
      >
        <SelectPrimitive.Viewport className="max-h-[inherit] p-1.5">
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectItem({ className, children, ...props }: SelectItemProps) {
  return (
    <SelectPrimitive.Item
      className={cn(
        // The fill sits on a pseudo-element: Animate UI clears an item's own background so it can draw
        // its gliding highlight, and with that hidden the fill has to live somewhere it won't touch.
        "relative isolate flex cursor-pointer items-center rounded-lg py-2 pr-9 pl-3 outline-none select-none before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-tint before:opacity-0 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:text-brand-foreground data-[highlighted]:before:opacity-100 data-[state=checked]:font-semibold data-[state=checked]:text-brand-foreground",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="absolute right-3 flex items-center">
        <TbCheck
          className="size-4 text-brand"
          strokeWidth={3}
          aria-hidden="true"
        />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
};
