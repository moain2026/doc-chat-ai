import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import DOMPurify from "dompurify";
import { SourceCard } from "./SourceCard";
import { formatTime } from "@/utils/formatters";
import type { Message } from "@/types";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: Message;
  delay?: number;
}

export const MessageBubble = ({ message, delay = 0 }: MessageBubbleProps) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = () => {
    void navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sanitized = DOMPurify.sanitize(message.content);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, type: "spring", damping: 25 }}
      className={cn("flex items-end gap-2 px-4 py-1 group", isUser && "flex-row-reverse")}
    >
      {/* Avatar */}
      <div className={cn(
        "h-7 w-7 rounded-full flex-shrink-0 flex items-center justify-center mb-1",
        isUser ? "bg-primary text-white" : "bg-primary/10 text-primary"
      )}>
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      <div className={cn("max-w-[75%] min-w-0", isUser ? "items-end" : "items-start", "flex flex-col")}>
        {/* Bubble */}
        <div
          className={cn(
            "relative px-4 py-3 rounded-2xl text-sm leading-relaxed",
            isUser
              ? "bg-primary text-primary-foreground rounded-br-sm"
              : "bg-card border border-border text-foreground rounded-bl-sm"
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className={cn("prose prose-sm max-w-none dark:prose-invert", message.isStreaming && "streaming-cursor")}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className ?? "");
                    const isBlock = match !== null;
                    return isBlock ? (
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-lg text-xs !mt-2 !mb-2"
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code className="bg-muted px-1 py-0.5 rounded text-xs" {...props}>
                        {children}
                      </code>
                    );
                  },
                  table({ children }) {
                    return (
                      <div className="overflow-x-auto">
                        <table className="border-collapse text-xs w-full">{children}</table>
                      </div>
                    );
                  },
                }}
              >
                {sanitized}
              </ReactMarkdown>
            </div>
          )}

          {/* Copy button */}
          {!message.isStreaming && (
            <button
              onClick={handleCopy}
              className={cn(
                "absolute -top-2 opacity-0 group-hover:opacity-100 transition-opacity",
                "p-1.5 rounded-lg bg-card border border-border shadow-sm text-muted-foreground hover:text-foreground",
                isUser ? "left-0 -translate-x-8" : "right-0 translate-x-8"
              )}
              aria-label="Copy message"
            >
              {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
            </button>
          )}
        </div>

        {/* Sources */}
        {!isUser && !message.isStreaming && message.sources && message.sources.length > 0 && (
          <div className="w-full mt-1">
            <SourceCard sources={message.sources} />
          </div>
        )}

        {/* Timestamp */}
        <span className="text-[10px] text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity px-1">
          {formatTime(message.createdAt)}
        </span>
      </div>
    </motion.div>
  );
};
