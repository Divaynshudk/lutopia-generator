
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "default",
      size = "default",
      isLoading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(
          "relative inline-flex items-center justify-center font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:opacity-50 disabled:pointer-events-none",
          "active:scale-[0.98] transform",
          {
            "bg-primary text-primary-foreground hover:bg-primary/90 shadow-subtle": variant === "default",
            "border border-input bg-background hover:bg-secondary hover:text-accent": variant === "outline",
            "hover:bg-secondary hover:text-accent": variant === "ghost",
            "text-primary underline-offset-4 hover:underline": variant === "link",
            "text-sm px-4 py-2 rounded-lg": size === "default",
            "text-xs px-3 py-1.5 rounded-md": size === "sm",
            "text-base px-6 py-3 rounded-lg": size === "lg",
            "h-10 w-10 rounded-lg p-0 flex items-center justify-center": size === "icon",
          },
          className
        )}
        ref={ref}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <div className="loader w-5 h-5"></div>
          </span>
        )}
        <span className={cn({ "opacity-0": isLoading })}>{children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
