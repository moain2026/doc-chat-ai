/**
 * chatStore.ts
 * Chat/conversation state. Delegates AI responses and streaming to mockApi/streamHandler.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Conversation, Message } from "@/types";
import { getMockResponse, getMockSources, delay } from "@/services/mockApi";
import { streamText } from "@/services/streamHandler";

interface ChatStore {
  conversations: Conversation[];
  activeConversationId: string | null;
  isGenerating: boolean;
  createConversation: () => string;
  sendMessage: (content: string) => Promise<void>;
  deleteConversation: (id: string) => void;
  setActiveConversation: (id: string) => void;
  getActiveConversation: () => Conversation | null;
}

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    title: "Policy questions",
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 86400000),
    messages: [
      {
        id: "msg-1",
        role: "user",
        content: "What is the remote work policy?",
        createdAt: new Date(Date.now() - 86400000),
      },
      {
        id: "msg-2",
        role: "assistant",
        content:
          "Based on the **Company HR Policy 2025** document:\n\n- **Remote Work**: Employees may work remotely up to **2 days per week** with manager approval.\n- Requests must be submitted via the HR portal at least 3 days in advance.\n- Remote work is not permitted during probationary periods.",
        sources: [
          {
            documentId: "doc-1",
            documentName: "Company HR Policy 2025.pdf",
            snippet: "…remote work arrangements require written approval from the direct line manager…",
            relevance: 0.97,
          },
        ],
        createdAt: new Date(Date.now() - 86400000 + 2000),
      },
    ],
  },
];

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      conversations: INITIAL_CONVERSATIONS,
      activeConversationId: null,
      isGenerating: false,

      createConversation: () => {
        const id = `conv-${Date.now()}`;
        const conv: Conversation = {
          id,
          title: "New Conversation",
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          conversations: [conv, ...state.conversations],
          activeConversationId: id,
        }));
        return id;
      },

      setActiveConversation: (id) => set({ activeConversationId: id }),

      getActiveConversation: () => {
        const { conversations, activeConversationId } = get();
        return conversations.find((c) => c.id === activeConversationId) ?? null;
      },

      deleteConversation: (id) => {
        set((state) => {
          const remaining = state.conversations.filter((c) => c.id !== id);
          return {
            conversations: remaining,
            activeConversationId:
              state.activeConversationId === id
                ? (remaining[0]?.id ?? null)
                : state.activeConversationId,
          };
        });
      },

      sendMessage: async (content) => {
        const { activeConversationId, conversations } = get();
        if (!activeConversationId) return;

        const userMsg: Message = {
          id: `msg-${Date.now()}`,
          role: "user",
          content,
          createdAt: new Date(),
        };

        const isFirstMessage =
          conversations.find((c) => c.id === activeConversationId)?.messages.length === 0;

        set((state) => ({
          isGenerating: true,
          conversations: state.conversations.map((c) =>
            c.id === activeConversationId
              ? {
                  ...c,
                  messages: [...c.messages, userMsg],
                  title: isFirstMessage ? content.slice(0, 40) : c.title,
                  updatedAt: new Date(),
                }
              : c
          ),
        }));

        // Simulated "thinking" delay
        await delay(600);

        const assistantId = `msg-${Date.now()}-ai`;
        const assistantMsg: Message = {
          id: assistantId,
          role: "assistant",
          content: "",
          isStreaming: true,
          createdAt: new Date(),
        };

        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === activeConversationId
              ? { ...c, messages: [...c.messages, assistantMsg] }
              : c
          ),
        }));

        // Stream response via streamHandler service
        const fullResponse = getMockResponse(content);

        await streamText(fullResponse, {
          charDelay: 18,
          onChunk: (text) => {
            set((state) => ({
              conversations: state.conversations.map((c) =>
                c.id === activeConversationId
                  ? {
                      ...c,
                      messages: c.messages.map((m) =>
                        m.id === assistantId ? { ...m, content: text } : m
                      ),
                    }
                  : c
              ),
            }));
          },
          onComplete: () => {
            const sources = getMockSources();
            set((state) => ({
              isGenerating: false,
              conversations: state.conversations.map((c) =>
                c.id === activeConversationId
                  ? {
                      ...c,
                      updatedAt: new Date(),
                      messages: c.messages.map((m) =>
                        m.id === assistantId
                          ? { ...m, isStreaming: false, sources }
                          : m
                      ),
                    }
                  : c
              ),
            }));
          },
        });
      },
    }),
    {
      name: "chat-storage",
      partialize: (state) => ({ conversations: state.conversations }),
    }
  )
);
