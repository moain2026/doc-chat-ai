import { useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ConversationSidebar } from "@/components/chat/ConversationSidebar";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { useChatStore } from "@/stores/chatStore";
import { useUiStore } from "@/stores/uiStore";

export const ChatPage = () => {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const { setActiveConversation, activeConversationId, createConversation } = useChatStore();
  const { mobileSidebarOpen, setMobileSidebarOpen } = useUiStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (conversationId) {
      setActiveConversation(conversationId);
    } else if (!activeConversationId) {
      const id = createConversation();
      navigate(`/chat/${id}`, { replace: true });
    }
  }, [conversationId]);

  // Keyboard shortcuts: Ctrl/Cmd+N → new conversation, Escape → close mobile sidebar
  const handleKeyboard = useCallback(
    (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "n") {
        e.preventDefault();
        const id = createConversation();
        navigate(`/chat/${id}`);
      }
      if (e.key === "Escape" && mobileSidebarOpen) {
        setMobileSidebarOpen(false);
      }
    },
    [createConversation, mobileSidebarOpen, navigate, setMobileSidebarOpen]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyboard);
    return () => document.removeEventListener("keydown", handleKeyboard);
  }, [handleKeyboard]);

  return (
    <AppLayout title="Chat">
      <div className="flex h-full min-h-0 relative">
        {/* Desktop conversation sidebar */}
        <div className="hidden sm:flex h-full flex-shrink-0">
          <ConversationSidebar />
        </div>

        {/* Mobile drawer overlay */}
        <AnimatePresence>
          {mobileSidebarOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="sm:hidden fixed inset-0 bg-black/40 z-30 backdrop-blur-sm"
                onClick={() => setMobileSidebarOpen(false)}
              />
              {/* Drawer */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="sm:hidden fixed left-0 top-0 bottom-0 z-40 w-72 bg-card border-r border-border flex flex-col"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <span className="text-sm font-semibold text-foreground">Conversations</span>
                  <button
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <ConversationSidebar compact />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main chat area */}
        <div className="flex-1 min-w-0 relative flex flex-col h-full">
          <ChatContainer />
        </div>
      </div>
    </AppLayout>
  );
};
