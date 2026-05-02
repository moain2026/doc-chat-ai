/**
 * MessageList.tsx
 * Renders messages grouped by date ("Today", "Yesterday", or full date).
 * Shows skeleton loading state and empty state with suggested questions.
 */
import { useMemo } from "react";
import { format, isToday, isYesterday } from "date-fns";
import { motion } from "framer-motion";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { SuggestedQuestions } from "./SuggestedQuestions";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Message } from "@/types";

interface MessageListProps {
  messages: Message[];
  isGenerating: boolean;
  isLoading?: boolean;
  onSuggestedQuestion: (q: string) => void;
}

function getDateLabel(date: Date): string {
  const d = new Date(date);
  if (isToday(d)) return "Today";
  if (isYesterday(d)) return "Yesterday";
  return format(d, "MMMM d, yyyy");
}

interface GroupedMessages {
  label: string;
  messages: Message[];
}

function groupByDate(messages: Message[]): GroupedMessages[] {
  const map = new Map<string, Message[]>();
  for (const msg of messages) {
    const label = getDateLabel(msg.createdAt);
    const existing = map.get(label) ?? [];
    map.set(label, [...existing, msg]);
  }
  return Array.from(map.entries()).map(([label, msgs]) => ({ label, messages: msgs }));
}

export const MessageList = ({
  messages,
  isGenerating,
  isLoading = false,
  onSuggestedQuestion,
}: MessageListProps) => {
  const grouped = useMemo(() => groupByDate(messages), [messages]);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`flex gap-3 ${i % 2 === 0 ? "flex-row-reverse" : ""}`}>
            <Skeleton className="h-7 w-7 rounded-full flex-shrink-0" />
            <div className="space-y-2 max-w-sm">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (messages.length === 0) {
    return <SuggestedQuestions onSelect={onSuggestedQuestion} />;
  }

  return (
    <div className="max-w-3xl mx-auto py-4">
      {grouped.map((group) => (
        <div key={group.label}>
          {/* Date separator */}
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground font-medium px-2 py-1 bg-muted/50 rounded-full">
              {group.label}
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {group.messages.map((msg, i) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              delay={i === group.messages.length - 1 ? 0 : 0}
            />
          ))}
        </div>
      ))}

      <TypingIndicator show={isGenerating && !messages.at(-1)?.isStreaming} />
    </div>
  );
};
