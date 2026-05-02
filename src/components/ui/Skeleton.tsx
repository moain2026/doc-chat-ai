import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circle" | "card" | "rectangle";
}

export const Skeleton = ({ className, variant = "rectangle" }: SkeletonProps) => (
  <div
    className={cn(
      "animate-pulse bg-muted/70 dark:bg-muted",
      variant === "circle" && "rounded-full",
      variant === "text" && "h-4 rounded-md w-full",
      variant === "card" && "rounded-xl h-32 w-full",
      variant === "rectangle" && "rounded-lg",
      className
    )}
  />
);
