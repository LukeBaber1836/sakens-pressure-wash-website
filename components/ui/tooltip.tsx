"use client"

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"
import { cn } from "cn"

function TooltipProvider({ delay = 150, ...props }: TooltipPrimitive.Provider.Props) {
  return <TooltipPrimitive.Provider data-slot="tooltip-provider" delay={delay} {...props} />
}

function Tooltip(props: TooltipPrimitive.Root.Props) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />
}

function TooltipTrigger(props: TooltipPrimitive.Trigger.Props) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipContent({
  className,
  side = "top",
  sideOffset = 8,
  align = "center",
  children,
  ...props
}: TooltipPrimitive.Popup.Props &
  Pick<TooltipPrimitive.Positioner.Props, "side" | "sideOffset" | "align">) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        className="isolate z-50"
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(
            "max-w-64 origin-(--transform-origin) rounded-xl bg-brand-foreground px-3.5 py-2.5 text-sm leading-snug text-white shadow-[0_12px_30px_-12px_rgba(1,20,45,0.5)] duration-150 data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
          {...props}
        >
          {children}
          <TooltipPrimitive.Arrow className="data-[side=bottom]:top-[-7px] data-[side=left]:right-[-7px] data-[side=left]:rotate-90 data-[side=right]:left-[-7px] data-[side=right]:-rotate-90 data-[side=top]:bottom-[-7px] data-[side=top]:rotate-180">
            <svg width="14" height="7" viewBox="0 0 14 7" className="block fill-brand-foreground">
              <path d="M0 7 L7 0 L14 7 Z" />
            </svg>
          </TooltipPrimitive.Arrow>
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger }
