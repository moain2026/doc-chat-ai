import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { SuggestedQuestions } from "./SuggestedQuestions";
import { ChatInput } from "./ChatInput";
import { useChatStore } from "@/stores/chatStore";
import { Skeleton } from "@/components/ui/Skeleton";

export const ChatContainer = () => {
  const { conversations, activeConversationId, isGenerating, sendMessage, createConversation } = useChatStore();
  const activeConv = conversations.find((c) => c.id === activeConversationId);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const scrollToBottom = (smooth = true) => {
    bottomRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
  };

  useEffect(() => { scrollToBottom(); }, [activeConv?.messages.length, isGenerating]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 80);
  };

  const handleSend = async (content: string) => {
    if (!activeConversationId) createConversation();
    await sendMessage(content);
  };

  const handleSuggest = async (q: string) => {
    if (!activeConversationId) createConversation();
    await sendMessage(q);
  };

  const showEmpty = !activeConv || activeConv.messages.length === 0;

  return (
    <div className="flex flex-col h-full min-h-0">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto py-4"
      >
        {showEmpty ? (
          <SuggestedQuestions onSelect={handleSuggest} />
        ) : (
          <div className="max-w-3xl mx-auto">
            {activeConv.messages.map((msg, i) => (
              <MessageBubble key={msg.id} message={msg} delay={i === activeConv.messages.length - 1 ? 0 : 0} />
            ))}
            <TypingIndicator show={isGenerating && !activeConv.messages.at(-1)?.isStreaming} />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <AnimatePresence>
        {showScrollBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => scrollToBottom()}
            className="absolute bottom-24 right-6 h-8 w-8 rounded-full bg-card border border-border shadow-md flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors z-10"
            aria-label="Scroll to bottom"
          >
            <ChevronDown className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>

      <ChatInput onSend={handleSend} disabled={isGenerating} />
    </div>
  );
};
