import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps {
  variant?: "solid" | "glass";
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const paddingMap = { none: "", sm: "p-3", md: "p-5", lg: "p-7" };

export const Card = ({
  variant = "solid",
  hover = false,
  padding = "md",
  className,
  children,
  onClick,
}: CardProps) => (
  <motion.div
    whileHover={hover ? { y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" } : {}}
    transition={{ duration: 0.2 }}
    onClick={onClick}
    className={cn(
      "rounded-xl border",
      variant === "solid" && "bg-card border-border",
      variant === "glass" && "glass",
      hover && "cursor-pointer",
      paddingMap[padding],
      className
    )}
  >
    {children}
  </motion.div>
);
