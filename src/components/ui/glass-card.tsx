import { cn } from '@/lib/utils'
import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const glassCardVariants = cva(
  'backdrop-blur-md border shadow-lg transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-white/12 hover:bg-white/18 border-white/20',
        elevated: 'bg-white/15 hover:bg-white/22 shadow-xl border-white/25',
        subtle: 'bg-white/8 hover:bg-white/12 border-white/15',
        frosted: 'bg-white/18 backdrop-blur-xl border-white/30',
      },
      size: {
        sm: 'p-3 rounded-lg',
        default: 'p-4 rounded-xl',
        lg: 'p-6 rounded-2xl',
        xl: 'p-8 rounded-3xl',
      },
      glow: {
        none: '',
        subtle: 'shadow-[0_0_20px_rgba(255,255,255,0.1)]',
        medium: 'shadow-[0_0_30px_rgba(255,255,255,0.15)]',
        strong: 'shadow-[0_0_40px_rgba(255,255,255,0.2)]',
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      glow: 'none',
    },
  }
)

export interface GlassCardProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassCardVariants> {
  animated?: boolean
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant, size, glow, animated = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          glassCardVariants({ variant, size, glow }),
          animated && 'hover:scale-[1.02] hover:-translate-y-1',
          className
        )}
        {...props}
      />
    )
  }
)
GlassCard.displayName = 'GlassCard'

export { GlassCard, glassCardVariants }