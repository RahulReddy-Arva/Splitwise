import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const glassTabsListVariants = cva(
  "inline-flex items-center justify-center rounded-xl p-1 backdrop-blur-md border transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-white/10 border-white/20",
        elevated: "bg-white/15 border-white/30 shadow-lg",
        outline: "bg-transparent border-white/30",
        filled: "bg-white/20 border-white/40",
      },
      size: {
        sm: "h-8 text-xs",
        default: "h-10 text-sm",
        lg: "h-12 text-base",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const glassTabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "text-white/70 hover:text-white data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:shadow-sm",
        elevated: "text-white/70 hover:text-white data-[state=active]:bg-white/30 data-[state=active]:text-white data-[state=active]:shadow-md",
        outline: "text-white/70 hover:text-white data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-white/30",
        filled: "text-white/70 hover:text-white data-[state=active]:bg-white/25 data-[state=active]:text-white",
      },
      size: {
        sm: "h-6 px-2 text-xs",
        default: "h-8 px-3 text-sm",
        lg: "h-10 px-4 text-base",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const GlassTabs = TabsPrimitive.Root

const GlassTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> &
    VariantProps<typeof glassTabsListVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(glassTabsListVariants({ variant, size }), className)}
    {...props}
  />
))
GlassTabsList.displayName = TabsPrimitive.List.displayName

const GlassTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> &
    VariantProps<typeof glassTabsTriggerVariants> & {
      icon?: React.ReactNode
      badge?: string | number
    }
>(({ className, variant, size, icon, badge, children, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(glassTabsTriggerVariants({ variant, size }), className)}
    {...props}
  >
    <div className="flex items-center gap-2">
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
      {badge && (
        <span className="ml-1 bg-white/20 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1rem] h-4 flex items-center justify-center">
          {badge}
        </span>
      )}
    </div>
  </TabsPrimitive.Trigger>
))
GlassTabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const GlassTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> & {
    animated?: boolean
  }
>(({ className, animated = true, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2",
      animated && "data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:zoom-in-95 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0 data-[state=inactive]:zoom-out-95",
      className
    )}
    {...props}
  />
))
GlassTabsContent.displayName = TabsPrimitive.Content.displayName

// Vertical Tabs variant
const GlassVerticalTabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <TabsPrimitive.Root
    ref={ref}
    orientation={orientation}
    className={cn("flex gap-4", className)}
    {...props}
  />
))
GlassVerticalTabs.displayName = "GlassVerticalTabs"

const GlassVerticalTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> &
    VariantProps<typeof glassTabsListVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "flex flex-col items-stretch justify-start rounded-xl p-1 backdrop-blur-md border transition-all duration-300",
      variant === "default" && "bg-white/10 border-white/20",
      variant === "elevated" && "bg-white/15 border-white/30 shadow-lg",
      variant === "outline" && "bg-transparent border-white/30",
      variant === "filled" && "bg-white/20 border-white/40",
      size === "sm" && "min-w-[120px]",
      size === "default" && "min-w-[140px]",
      size === "lg" && "min-w-[160px]",
      className
    )}
    {...props}
  />
))
GlassVerticalTabsList.displayName = "GlassVerticalTabsList"

const GlassVerticalTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> &
    VariantProps<typeof glassTabsTriggerVariants> & {
      icon?: React.ReactNode
      badge?: string | number
    }
>(({ className, variant, size, icon, badge, children, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      glassTabsTriggerVariants({ variant, size }),
      "justify-start w-full mb-1 last:mb-0",
      className
    )}
    {...props}
  >
    <div className="flex items-center gap-3 w-full">
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="flex-1 text-left">{children}</span>
      {badge && (
        <span className="bg-white/20 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1rem] h-4 flex items-center justify-center">
          {badge}
        </span>
      )}
    </div>
  </TabsPrimitive.Trigger>
))
GlassVerticalTabsTrigger.displayName = "GlassVerticalTabsTrigger"

export {
  GlassTabs,
  GlassTabsList,
  GlassTabsTrigger,
  GlassTabsContent,
  GlassVerticalTabs,
  GlassVerticalTabsList,
  GlassVerticalTabsTrigger,
  glassTabsListVariants,
  glassTabsTriggerVariants,
}