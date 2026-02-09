'use client';

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

// ==========================================
// BUTTON DESIGN SYSTEM - WCAG 2.1 AA Compliant
// ==========================================

const buttonVariants = cva(
  // Base styles with proper focus management and transitions
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        // Default: Alias for primary (backward compatibility)
        default:
          "bg-[#003366] text-white shadow-md hover:bg-[#004080] hover:shadow-lg hover:shadow-blue-900/20 active:bg-[#002244] focus-visible:ring-blue-600 border border-[#003366]",
        
        // Primary: Main CTA - High contrast 4.5:1
        primary:
          "bg-[#003366] text-white shadow-md hover:bg-[#004080] hover:shadow-lg hover:shadow-blue-900/20 active:bg-[#002244] focus-visible:ring-blue-600 border border-[#003366]",
        
        // Secondary: Alternative action
        secondary:
          "bg-[#F0F5FF] text-[#003366] border border-[#003366] shadow-sm hover:bg-[#E6F0FF] hover:border-[#004080] active:bg-[#D6E6FF] focus-visible:ring-blue-500",
        
        // Outline: Subtle action
        outline:
          "border-2 border-slate-300 bg-transparent text-slate-700 hover:border-[#003366] hover:text-[#003366] hover:bg-slate-50 active:bg-slate-100 focus-visible:ring-slate-400",
        
        // Ghost: Minimal emphasis
        ghost: 
          "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200 focus-visible:ring-slate-400",
        
        // Danger: Destructive actions - High contrast
        danger:
          "bg-red-600 text-white shadow-md hover:bg-red-700 hover:shadow-lg hover:shadow-red-900/20 active:bg-red-800 focus-visible:ring-red-500 border border-red-600",
        
        // Destructive: Alias for danger (backward compatibility with shadcn)
        destructive:
          "bg-red-600 text-white shadow-md hover:bg-red-700 hover:shadow-lg hover:shadow-red-900/20 active:bg-red-800 focus-visible:ring-red-500 border border-red-600",
        
        // Success: Positive actions
        success:
          "bg-emerald-600 text-white shadow-md hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-900/20 active:bg-emerald-800 focus-visible:ring-emerald-500 border border-emerald-600",
        
        // Glass: Modern translucent (for dark backgrounds)
        glass: 
          "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 active:bg-white/30 focus-visible:ring-white/50",
        
        // Link: Text-only action
        link: 
          "text-[#003366] underline-offset-4 hover:underline focus-visible:ring-blue-500 bg-transparent shadow-none",
      },
      
      // Size system with consistent height and padding
      size: {
        xs: "h-8 px-3 text-xs gap-1.5 rounded-md",
        sm: "h-10 px-4 text-sm gap-2 rounded-md",
        md: "h-12 px-6 text-base gap-2 rounded-lg",
        lg: "h-14 px-8 text-lg gap-3 rounded-lg",
        xl: "h-16 px-10 text-xl gap-3 rounded-xl",
        icon: "h-10 w-10 p-0 rounded-lg",
        "icon-sm": "h-8 w-8 p-0 rounded-md",
        "icon-lg": "h-12 w-12 p-0 rounded-lg",
      },
      
      // Full width option
      fullWidth: {
        true: "w-full",
        false: "",
      },
      
      // Icon positioning
      iconPosition: {
        left: "flex-row",
        right: "flex-row-reverse",
        only: "p-0 aspect-square",
      },
    },
    
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
      iconPosition: "left",
    },
    
    // Compound variants for specific combinations
    compoundVariants: [
      {
        size: "icon",
        iconPosition: "only",
        class: "px-0",
      },
    ],
  }
);

// ==========================================
// TYPES & INTERFACES
// ==========================================

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  ariaLabel?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  iconOnly?: React.ReactNode;
}

// ==========================================
// BUTTON COMPONENT
// ==========================================

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    fullWidth, 
    iconPosition,
    asChild = false, 
    isLoading, 
    loadingText,
    children, 
    disabled,
    ariaLabel,
    leftIcon,
    rightIcon,
    iconOnly,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    // Determine effective icon position
    const effectiveIconPosition = iconOnly ? "only" : rightIcon ? "right" : "left";
    
    // Loading spinner component
    const LoadingSpinner = () => (
      <Loader2 
        className={cn(
          "animate-spin",
          size === "xs" && "h-3 w-3",
          size === "sm" && "h-4 w-4",
          (size === "md" || !size) && "h-5 w-5",
          size === "lg" && "h-5 w-5",
          size === "xl" && "h-6 w-6"
        )} 
        aria-hidden="true" 
      />
    );

    // Icon sizing helper
    const getIconSize = () => {
      switch (size) {
        case "xs": return "h-3.5 w-3.5";
        case "sm": return "h-4 w-4";
        case "lg": return "h-5 w-5";
        case "xl": return "h-6 w-6";
        default: return "h-5 w-5";
      }
    };

    return (
      <Comp
        className={cn(buttonVariants({ 
          variant, 
          size, 
          fullWidth, 
          iconPosition: effectiveIconPosition,
          className 
        }))}
        ref={ref}
        disabled={isLoading || disabled}
        aria-disabled={isLoading || disabled}
        aria-busy={isLoading}
        aria-label={ariaLabel || (iconOnly && typeof children === 'string' ? children : undefined)}
        {...props}
      >
        {/* Loading State */}
        {isLoading && (
          <>
            <LoadingSpinner />
            {loadingText && <span>{loadingText}</span>}
          </>
        )}
        
        {/* Icon Only Mode */}
        {!isLoading && iconOnly && (
          <span className={cn("flex items-center justify-center", getIconSize())}>
            {iconOnly}
          </span>
        )}
        
        {/* Standard Content with Icons */}
        {!isLoading && !iconOnly && (
          <>
            {leftIcon && (
              <span className={cn("flex items-center justify-center", getIconSize())}>
                {leftIcon}
              </span>
            )}
            {children}
            {rightIcon && (
              <span className={cn("flex items-center justify-center", getIconSize())}>
                {rightIcon}
              </span>
            )}
          </>
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

// ==========================================
// ICON BUTTON COMPONENT (Convenience)
// ==========================================

interface IconButtonProps extends Omit<ButtonProps, "iconOnly" | "leftIcon" | "rightIcon" | "children"> {
  icon: React.ReactNode;
  label: string;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, label, size = "md", ...props }, ref) => (
    <Button
      ref={ref}
      iconOnly={icon}
      ariaLabel={label}
      size={size}
      {...props}
    />
  )
);
IconButton.displayName = "IconButton";

export { Button, IconButton, buttonVariants };
