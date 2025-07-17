import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden border-2 border-white/20 transition-all duration-200",
  {
    variants: {
      size: {
        xs: "h-6 w-6 text-xs",
        sm: "h-8 w-8 text-sm",
        default: "h-10 w-10 text-base",
        lg: "h-12 w-12 text-lg",
        xl: "h-16 w-16 text-xl",
        "2xl": "h-20 w-20 text-2xl",
        "3xl": "h-24 w-24 text-3xl",
      },
      shape: {
        circle: "rounded-full",
        square: "rounded-lg",
        rounded: "rounded-xl",
      },
      variant: {
        default: "bg-muted",
        glass: "bg-white/10 backdrop-blur-md border-white/30",
        gradient: "bg-gradient-to-br from-blue-500 to-purple-600",
        outline: "bg-transparent border-2 border-border",
      },
      status: {
        none: "",
        online: "ring-2 ring-green-500",
        offline: "ring-2 ring-gray-400",
        busy: "ring-2 ring-red-500",
        away: "ring-2 ring-yellow-500",
      }
    },
    defaultVariants: {
      size: "default",
      shape: "circle",
      variant: "default",
      status: "none",
    },
  }
)

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string
  alt?: string
  fallback?: string
  showStatus?: boolean
  statusPosition?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left'
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ 
    className, 
    size, 
    shape, 
    variant, 
    status, 
    src, 
    alt, 
    fallback, 
    showStatus = false,
    statusPosition = 'bottom-right',
    ...props 
  }, ref) => {
    const [imageError, setImageError] = React.useState(false)
    
    const statusPositionClasses = {
      'top-right': 'top-0 right-0',
      'bottom-right': 'bottom-0 right-0',
      'top-left': 'top-0 left-0',
      'bottom-left': 'bottom-0 left-0',
    }

    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ size, shape, variant, status, className }))}
        {...props}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={alt}
            className="aspect-square h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted font-medium text-muted-foreground">
            {fallback || (alt ? alt.charAt(0).toUpperCase() : '?')}
          </div>
        )}
        
        {showStatus && status !== 'none' && (
          <span 
            className={cn(
              "absolute h-3 w-3 rounded-full border-2 border-background",
              statusPositionClasses[statusPosition],
              {
                'bg-green-500': status === 'online',
                'bg-gray-400': status === 'offline',
                'bg-red-500': status === 'busy',
                'bg-yellow-500': status === 'away',
              }
            )}
          />
        )}
      </div>
    )
  }
)
Avatar.displayName = "Avatar"

// Avatar Group Component for displaying multiple avatars
export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number
  size?: VariantProps<typeof avatarVariants>['size']
  shape?: VariantProps<typeof avatarVariants>['shape']
  variant?: VariantProps<typeof avatarVariants>['variant']
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, max = 5, size, shape, variant, children, ...props }, ref) => {
    const childrenArray = React.Children.toArray(children)
    const visibleChildren = childrenArray.slice(0, max)
    const remainingCount = childrenArray.length - max

    return (
      <div
        ref={ref}
        className={cn("flex -space-x-2", className)}
        {...props}
      >
        {visibleChildren.map((child, index) => (
          <div key={index} className="ring-2 ring-background">
            {React.isValidElement(child) 
              ? React.cloneElement(child, { size, shape, variant } as any)
              : child
            }
          </div>
        ))}
        {remainingCount > 0 && (
          <Avatar
            size={size}
            shape={shape}
            variant={variant}
            fallback={`+${remainingCount}`}
            className="ring-2 ring-background"
          />
        )}
      </div>
    )
  }
)
AvatarGroup.displayName = "AvatarGroup"

export { Avatar, AvatarGroup, avatarVariants }