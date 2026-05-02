import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, MessageSquare } from "lucide-react";
import { useChatStore } from "@/stores/chatStore";
import { useUiStore } from "@/stores/uiStore";
import { formatRelativeTime, truncate } from "@/utils/formatters";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";

export const ConversationSidebar = () => {
  const { conversations, activeConversationId, createConversation, deleteConversation, setActiveConversation } = useChatStore();
  const { addToast } = useUiStore();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleNew = () => { createConversation(); };
  const handleDelete = () => {
    if (!deleteId) return;
    deleteConversation(deleteId);
    addToast("success", "Conversation deleted.");
    setDeleteId(null);
  };

  return (
    <>
      <div className="flex flex-col w-64 flex-shrink-0 border-r border-border bg-card h-full">
        <div className="p-3 border-b border-border">
          <Button onClick={handleNew} size="sm" className="w-full" leftIcon={<Plus className="h-3.5 w-3.5" />}>
            New Chat
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center px-4">
              <MessageSquare className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-xs text-muted-foreground">No conversations yet</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {conversations.map((conv) => (
                <motion.div
                  key={conv.id}
                  layout
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "group flex items-start gap-2 px-3 py-2.5 rounded-lg cursor-pointer mb-0.5 transition-colors",
                    activeConversationId === conv.id
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted/50 text-foreground"
                  )}
                  onClick={() => setActiveConversation(conv.id)}
                >
                  <MessageSquare className={cn("h-4 w-4 flex-shrink-0 mt-0.5", activeConversationId === conv.id ? "text-primary" : "text-muted-foreground")} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{truncate(conv.title, 28)}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{formatRelativeTime(conv.updatedAt)}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteId(conv.id); }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded text-muted-foreground hover:text-destructive transition-all flex-shrink-0"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Conversation">
        <p className="text-sm text-muted-foreground mb-5">
          Are you sure you want to delete this conversation? All messages will be lost.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </>
  );
};
