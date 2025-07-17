import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const glassButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 backdrop-blur-md border",
  {
    variants: {
      variant: {
        default: "bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/30 hover:shadow-lg",
        primary: "bg-blue-500/20 text-blue-100 border-blue-400/30 hover:bg-blue-500/30 hover:border-blue-400/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]",
        secondary: "bg-gray-500/10 text-gray-100 border-gray-400/20 hover:bg-gray-500/20 hover:border-gray-400/30",
        success: "bg-green-500/20 text-green-100 border-green-400/30 hover:bg-green-500/30 hover:border-green-400/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]",
        warning: "bg-yellow-500/20 text-yellow-100 border-yellow-400/30 hover:bg-yellow-500/30 hover:border-yellow-400/50 hover:shadow-[0_0_20px_rgba(234,179,8,0.3)]",
        danger: "bg-red-500/20 text-red-100 border-red-400/30 hover:bg-red-500/30 hover:border-red-400/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]",
        ghost: "border-transparent text-white/70 hover:bg-white/10 hover:text-white hover:border-white/10",
        outline: "border-white/30 text-white bg-transparent hover:bg-white/10 hover:border-white/50",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-2xl px-8 text-base",
        xl: "h-14 rounded-2xl px-10 text-lg",
        icon: "h-10 w-10",
      },
      glow: {
        none: "",
        subtle: "hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]",
        medium: "hover:shadow-[0_0_25px_rgba(255,255,255,0.15)]",
        strong: "hover:shadow-[0_0_35px_rgba(255,255,255,0.2)]",
      },
      animation: {
        none: "",
        scale: "hover:scale-105 active:scale-95",
        lift: "hover:-translate-y-1 active:translate-y-0",
        pulse: "hover:animate-pulse",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      glow: "none",
      animation: "scale",
    },
  }
)

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
  asChild?: boolean
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant, size, glow, animation, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(glassButtonVariants({ variant, size, glow, animation, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
GlassButton.displayName = "GlassButton"

export { GlassButton, glassButtonVariants }