import { cn } from "@/lib/utils";

type BadgeVariant = "success" | "warning" | "error" | "info" | "neutral" | "primary";
type BadgeSize = "sm" | "md";

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

const variantMap: Record<BadgeVariant, string> = {
  success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  error: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  neutral: "bg-muted text-muted-foreground",
  primary: "bg-primary/10 text-primary dark:bg-primary/20",
};

const dotMap: Record<BadgeVariant, string> = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  error: "bg-red-500",
  info: "bg-blue-500",
  neutral: "bg-gray-500",
  primary: "bg-primary",
};

const sizeMap: Record<BadgeSize, string> = {
  sm: "text-xs px-2 py-0.5",
  md: "text-xs px-2.5 py-1",
};

export const Badge = ({
  variant = "neutral",
  size = "sm",
  dot = false,
  children,
  className,
}: BadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 font-medium rounded-full",
      variantMap[variant],
      sizeMap[size],
      className
    )}
  >
    {dot && (
      <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", dotMap[variant])} />
    )}
    {children}
  </span>
);
