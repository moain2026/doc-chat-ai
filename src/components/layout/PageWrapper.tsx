/**
 * PageWrapper.tsx
 * Wraps every page with consistent padding, max-width,
 * and a fade+slide entrance transition.
 */
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  /** Remove max-width constraint (e.g. for full-width chat layout) */
  fluid?: boolean;
}

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
};

export const PageWrapper = ({ children, className, fluid = false }: PageWrapperProps) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.25, ease: "easeOut" }}
    className={cn(
      "w-full h-full",
      !fluid && "max-w-5xl mx-auto px-4 py-6",
      className
    )}
  >
    {children}
  </motion.div>
);
