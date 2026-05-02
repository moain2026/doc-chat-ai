/**
 * useChat.ts
 * Convenient hook for the active conversation with derived helpers.
 */
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useChatStore } from "@/stores/chatStore";

export function useChat() {
  const {
    conversations,
    activeConversationId,
    isGenerating,
    sendMessage,
    createConversation,
    deleteConversation,
    setActiveConversation,
  } = useChatStore();

  const navigate = useNavigate();

  const activeConversation = conversations.find((c) => c.id === activeConversationId) ?? null;

  const handleNewConversation = useCallback(() => {
    const id = createConversation();
    navigate(`/chat/${id}`);
    return id;
  }, [createConversation, navigate]);

  const handleSwitchConversation = useCallback(
    (id: string) => {
      setActiveConversation(id);
      navigate(`/chat/${id}`);
    },
    [setActiveConversation, navigate]
  );

  return {
    conversations,
    activeConversation,
    activeConversationId,
    isGenerating,
    messages: activeConversation?.messages ?? [],
    sendMessage,
    newConversation: handleNewConversation,
    deleteConversation,
    switchConversation: handleSwitchConversation,
  };
}
