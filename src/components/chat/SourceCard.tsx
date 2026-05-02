import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, ChevronDown } from "lucide-react";
import type { Source } from "@/types";
import { cn } from "@/lib/utils";

interface SourceCardProps {
  sources: Source[];
}

export const SourceCard = ({ sources }: SourceCardProps) => {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  if (sources.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="mt-3 rounded-xl border border-border bg-muted/30 overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
      >
        <FileText className="h-3.5 w-3.5 text-primary" />
        <span>Sources ({sources.length})</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="ml-auto">
          <ChevronDown className="h-3.5 w-3.5" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-2">
              {sources.map((s) => (
                <div key={s.documentId} className="rounded-lg border border-border bg-card">
                  <button
                    onClick={() => setExpanded(expanded === s.documentId ? null : s.documentId)}
                    className="w-full flex items-center gap-2 p-2.5 text-left hover:bg-muted/30 rounded-lg transition-colors"
                  >
                    <FileText className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                    <span className="text-xs font-medium text-foreground flex-1 truncate">{s.documentName}</span>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <div className="h-1.5 w-10 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${s.relevance * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground">{Math.round(s.relevance * 100)}%</span>
                    </div>
                  </button>
                  <AnimatePresence>
                    {expanded === s.documentId && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden px-3 pb-2.5"
                      >
                        <p className="text-xs text-muted-foreground italic border-l-2 border-primary/30 pl-2 leading-relaxed">
                          {s.snippet}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
