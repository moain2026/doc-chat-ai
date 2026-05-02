import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSend, disabled = false }: ChatInputProps) => {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  useEffect(() => { adjustHeight(); }, [value]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    if (ref.current) ref.current.style.height = "auto";
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div className="border-t border-border bg-card/50 backdrop-blur-sm p-3">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-end gap-2 bg-background border border-border rounded-xl px-3 py-2 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
          <textarea
            ref={ref}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask a question about your documents…"
            disabled={disabled}
            rows={1}
            className="flex-1 bg-transparent resize-none text-sm text-foreground placeholder:text-muted-foreground outline-none min-h-[36px] max-h-[120px] leading-relaxed disabled:opacity-60 py-1"
          />
          <div className="flex items-center gap-2 flex-shrink-0 pb-0.5">
            {value.length > 0 && (
              <span className={cn("text-[10px]", value.length > 900 ? "text-destructive" : "text-muted-foreground")}>
                {value.length}/1000
              </span>
            )}
            <motion.button
              whileTap={canSend ? { scale: 0.9 } : {}}
              onClick={handleSend}
              disabled={!canSend}
              className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center transition-all",
                canSend
                  ? "bg-primary text-white hover:bg-primary/90 shadow-sm shadow-primary/20"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
              aria-label="Send message"
            >
              <ArrowUp className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
        <p className="text-center text-[10px] text-muted-foreground mt-1.5">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};
