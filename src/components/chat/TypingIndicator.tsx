import { motion, AnimatePresence } from "framer-motion";
import { Bot } from "lucide-react";

interface TypingIndicatorProps {
  show: boolean;
}

export const TypingIndicator = ({ show }: TypingIndicatorProps) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        className="flex items-end gap-2 px-4 py-1"
      >
        <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Bot className="h-4 w-4 text-primary" />
        </div>
        <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
              className="h-2 w-2 rounded-full bg-primary/60"
            />
          ))}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);
