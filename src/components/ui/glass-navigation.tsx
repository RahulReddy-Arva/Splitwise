import * as React from "react"
import { cn } from "@/lib/utils"
import { GlassCard } from "./glass-card"
import { cva, type VariantProps } from "class-variance-authority"

const glassNavigationVariants = cva(
  "backdrop-blur-xl border-white/10 transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-white/5",
        elevated: "bg-white/10 shadow-xl",
        transparent: "bg-transparent border-transparent",
      },
      position: {
        top: "fixed top-0 left-0 right-0 z-40",
        bottom: "fixed bottom-0 left-0 right-0 z-40",
        sidebar: "fixed left-0 top-0 bottom-0 z-40",
        floating: "fixed z-40",
      },
      blur: {
        none: "backdrop-blur-none",
        sm: "backdrop-blur-sm",
        default: "backdrop-blur-md",
        lg: "backdrop-blur-lg",
        xl: "backdrop-blur-xl",
      }
    },
    defaultVariants: {
      variant: "default",
      position: "top",
      blur: "default",
    },
  }
)

export interface GlassNavigationProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof glassNavigationVariants> {
  sticky?: boolean
}

const GlassNavigation = React.forwardRef<HTMLElement, GlassNavigationProps>(
  ({ className, variant, position, blur, sticky = false, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        className={cn(
          glassNavigationVariants({ variant, position, blur }),
          sticky && "sticky",
          className
        )}
        {...props}
      />
    )
  }
)
GlassNavigation.displayName = "GlassNavigation"

// Navigation Item Component
export interface GlassNavItemProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean
  disabled?: boolean
  icon?: React.ReactNode
  badge?: string | number
}

const GlassNavItem = React.forwardRef<HTMLDivElement, GlassNavItemProps>(
  ({ className, active, disabled, icon, badge, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer font-geist",
          active 
            ? "bg-white/20 text-black shadow-lg" 
            : "text-gray-700 hover:text-black hover:bg-white/10",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          className
        )}
        {...props}
      >
        {icon && (
          <span className="flex-shrink-0">
            {icon}
          </span>
        )}
        <span className="flex-1">{children}</span>
        {badge && (
          <span className="flex-shrink-0 bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
            {badge}
          </span>
        )}
      </div>
    )
  }
)
GlassNavItem.displayName = "GlassNavItem"

// Navigation Brand/Logo Component
export interface GlassNavBrandProps extends React.HTMLAttributes<HTMLDivElement> {
  logo?: React.ReactNode
}

const GlassNavBrand = React.forwardRef<HTMLDivElement, GlassNavBrandProps>(
  ({ className, logo, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-3 px-4 py-3 text-lg font-bold text-black font-geist",
          className
        )}
        {...props}
      >
        {logo && (
          <span className="flex-shrink-0">
            {logo}
          </span>
        )}
        <span>{children}</span>
      </div>
    )
  }
)
GlassNavBrand.displayName = "GlassNavBrand"

// Navigation Section Component
export interface GlassNavSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
}

const GlassNavSection = React.forwardRef<HTMLDivElement, GlassNavSectionProps>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("space-y-1", className)}
        {...props}
      >
        {title && (
          <div className="px-4 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider font-geist">
            {title}
          </div>
        )}
        {children}
      </div>
    )
  }
)
GlassNavSection.displayName = "GlassNavSection"

export { 
  GlassNavigation, 
  GlassNavItem, 
  GlassNavBrand, 
  GlassNavSection,
  glassNavigationVariants 
}