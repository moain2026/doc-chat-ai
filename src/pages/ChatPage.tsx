import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { ConversationSidebar } from "@/components/chat/ConversationSidebar";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { useChatStore } from "@/stores/chatStore";

export const ChatPage = () => {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const { setActiveConversation, activeConversationId, createConversation } = useChatStore();

  useEffect(() => {
    if (conversationId) {
      setActiveConversation(conversationId);
    } else if (!activeConversationId) {
      createConversation();
    }
  }, [conversationId]);

  return (
    <AppLayout title="Chat">
      <div className="flex h-full min-h-0">
        {/* Conversation sidebar */}
        <div className="hidden sm:flex h-full">
          <ConversationSidebar />
        </div>

        {/* Chat area */}
        <div className="flex-1 min-w-0 relative">
          <ChatContainer />
        </div>
      </div>
    </AppLayout>
  );
};
