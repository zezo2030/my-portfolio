import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  loading?: boolean
  loadingText?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = "default", 
    size = "default", 
    loading = false,
    loadingText = "Loading...",
    children,
    disabled,
    "aria-label": ariaLabel,
    ...props 
  }, ref) => {
    const baseClasses = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 touch-manipulation"
    
    const variantClasses = {
      default: "bg-primary text-primary-foreground shadow hover:bg-primary/90 active:scale-95 focus:bg-primary/90",
      outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
      secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 focus:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline focus:underline",
    }
    
    const sizeClasses = {
      default: "h-10 px-4 py-2 min-h-[44px]",
      sm: "h-8 rounded-md px-3 text-xs min-h-[32px]",
      lg: "h-11 rounded-md px-8 min-h-[48px]",
      icon: "h-10 w-10 min-h-[44px] min-w-[44px]",
    }

    const isDisabled = disabled || loading;

    return (
      <button
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        ref={ref}
        disabled={isDisabled}
        aria-label={loading ? loadingText : ariaLabel}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="sr-only">{loadingText}</span>
            {size !== "icon" && loadingText}
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button }