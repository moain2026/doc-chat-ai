import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import { SUGGESTED_QUESTIONS } from "@/utils/constants";

interface SuggestedQuestionsProps {
  onSelect: (q: string) => void;
}

export const SuggestedQuestions = ({ onSelect }: SuggestedQuestionsProps) => (
  <div className="flex flex-col items-center gap-6 py-12 px-4 max-w-xl mx-auto text-center">
    <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
      <Bot className="h-8 w-8 text-primary" />
    </div>
    <div>
      <h2 className="text-lg font-semibold text-foreground">Ask your documents anything</h2>
      <p className="text-sm text-muted-foreground mt-1">
        I'll search through your uploaded documents and provide answers with source citations.
      </p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
      {SUGGESTED_QUESTIONS.map((sq, i) => (
        <motion.button
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07, duration: 0.3 }}
          whileHover={{ y: -2, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
          onClick={() => onSelect(sq.question)}
          className="flex items-start gap-3 p-3.5 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-primary/3 text-left transition-colors"
        >
          <span className="text-xl flex-shrink-0">{sq.icon}</span>
          <span className="text-sm text-foreground leading-snug">{sq.question}</span>
        </motion.button>
      ))}
    </div>
  </div>
);
