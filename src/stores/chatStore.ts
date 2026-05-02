import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Conversation, Message, Source } from "@/types";
import { useDocumentStore } from "./documentStore";

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

const MOCK_RESPONSES: Record<string, string> = {
  policy:
    "Based on the **Company HR Policy 2025** document, here are the key policy highlights:\n\n1. **Working Hours**: Standard working hours are 8 AM to 5 PM, Sunday through Thursday.\n2. **Remote Work**: Employees may work remotely up to 2 days per week with manager approval.\n3. **Code of Conduct**: All employees are expected to maintain professional behavior and integrity at all times.\n\nFor the complete policy details, please refer to Section 3 of the HR Policy document.",
  leave:
    "According to the **Employee Handbook**, the leave policy is as follows:\n\n- **Annual Leave**: 21 working days per year (after 1 year of service)\n- **Sick Leave**: Up to 30 days with medical certificate\n- **Emergency Leave**: 3 days per incident\n- **Maternity Leave**: 90 days fully paid\n\n> **Note**: Leave requests must be submitted at least 3 days in advance through the HR portal.",
  salary:
    "Based on the **Salary Scale Q1 2025** document:\n\n| Grade | Salary Range |\n|-------|-------------|\n| Junior | SAR 8,000 – 12,000 |\n| Mid-level | SAR 13,000 – 18,000 |\n| Senior | SAR 19,000 – 28,000 |\n| Manager | SAR 29,000 – 45,000 |\n\nAnnual increments are based on performance reviews conducted in Q4 each year.",
  default:
    "Based on your uploaded documents, I found the following relevant information:\n\n**Key Points:**\n- Your documents contain comprehensive information about company policies and procedures\n- The HR handbook covers most common employee questions\n- For specific details, you can ask me about leave, salary, policies, or any other topic\n\n**Tip:** Try asking specific questions like:\n- \"What is the annual leave policy?\"\n- \"How is salary determined?\"\n- \"What are the remote work rules?\"",
};

const getMockResponse = (content: string): string => {
  const lower = content.toLowerCase();
  if (lower.includes("policy") || lower.includes("سياسة") || lower.includes("rule"))
    return MOCK_RESPONSES.policy;
  if (lower.includes("leave") || lower.includes("إجازة") || lower.includes("vacation"))
    return MOCK_RESPONSES.leave;
  if (lower.includes("salary") || lower.includes("راتب") || lower.includes("pay") || lower.includes("compensation"))
    return MOCK_RESPONSES.salary;
  return MOCK_RESPONSES.default;
};

const getMockSources = (): Source[] => {
  const docs = useDocumentStore.getState().documents.filter((d) => d.status === "ready");
  if (docs.length === 0) return [];
  const snippets = [
    "...employees are entitled to the following benefits as outlined in section 4.2...",
    "...all requests must be submitted in writing no later than 3 business days prior...",
    "...the performance review cycle begins in October of each fiscal year...",
  ];
  return docs.slice(0, Math.min(3, docs.length)).map((doc, i) => ({
    documentId: doc.id,
    documentName: doc.name,
    snippet: snippets[i] ?? snippets[0],
    relevance: parseFloat((0.95 - i * 0.12).toFixed(2)),
  }));
};

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
        content: MOCK_RESPONSES.policy,
        sources: [
          {
            documentId: "doc-1",
            documentName: "Company HR Policy 2025.pdf",
            snippet: "...remote work up to 2 days per week with manager approval...",
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

      setActiveConversation: (id: string) => {
        set({ activeConversationId: id });
      },

      getActiveConversation: () => {
        const { conversations, activeConversationId } = get();
        return conversations.find((c) => c.id === activeConversationId) ?? null;
      },

      deleteConversation: (id: string) => {
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

      sendMessage: async (content: string) => {
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

        await new Promise((r) => setTimeout(r, 600));

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

        const fullResponse = getMockResponse(content);
        let streamed = "";

        for (let i = 0; i < fullResponse.length; i++) {
          await new Promise((r) => setTimeout(r, 18));
          streamed += fullResponse[i];
          const snap = streamed;
          set((state) => ({
            conversations: state.conversations.map((c) =>
              c.id === activeConversationId
                ? {
                    ...c,
                    messages: c.messages.map((m) =>
                      m.id === assistantId ? { ...m, content: snap } : m
                    ),
                  }
                : c
            ),
          }));
        }

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
    }),
    {
      name: "chat-storage",
      partialize: (state) => ({ conversations: state.conversations }),
    }
  )
);
