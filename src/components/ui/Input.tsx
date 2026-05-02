import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type InputVariant = "default" | "error" | "success";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helper?: string;
  error?: string;
  variant?: InputVariant;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<InputVariant, string> = {
  default: "border-border focus:border-primary focus:ring-primary/20",
  error: "border-destructive focus:border-destructive focus:ring-destructive/20",
  success: "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/20",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helper, error, variant = "default", leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputVariant = error ? "error" : variant;
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-muted-foreground flex-shrink-0">{leftIcon}</span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full h-10 bg-background text-foreground placeholder:text-muted-foreground",
              "rounded-lg border px-3 text-sm",
              "focus:outline-none focus:ring-2 transition-all duration-150",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              variantStyles[inputVariant],
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 text-muted-foreground flex-shrink-0">{rightIcon}</span>
          )}
        </div>
        {error && (
          <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-1">{error}</p>
        )}
        {!error && helper && (
          <p className="text-xs text-muted-foreground">{helper}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
