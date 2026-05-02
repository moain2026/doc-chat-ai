# Architecture Document — DocChat AI

## What This App Does
A web application where company employees can:
1. Log in to their account
2. Upload documents (PDF, Word, Excel, Text)
3. Chat with an AI and ask questions about their uploaded documents
4. The AI answers based on document content and cites the source document

---

## Tech Stack & Reasoning

| Layer | Library | Why |
|-------|---------|-----|
| UI Framework | React 18 | Industry standard, concurrent features, huge ecosystem |
| Build Tool | Vite 7 | Fastest HMR, ESM-native, minimal config |
| Language | TypeScript (strict) | Type safety prevents runtime bugs, self-documenting |
| Styling | TailwindCSS v4 | Utility-first, zero dead CSS, responsive-first |
| Animation | Framer Motion | Declarative, GPU-accelerated, exit animations |
| State Management | Zustand + persist | Lightweight, no boilerplate, localStorage sync |
| Forms | React Hook Form + Zod | Performant, schema-driven, composable validation |
| Routing | react-router-dom v6 | De facto standard, nested routes, lazy loading |
| File Upload | react-dropzone | Best DX, accessibility built-in, file type filtering |
| Markdown | react-markdown + remark-gfm | Safe rendering, tables, code blocks |
| Syntax Highlight | react-syntax-highlighter | Prism themes, SSR-safe |
| Date Formatting | date-fns | Tree-shakeable, functional API |
| Sanitization | DOMPurify | XSS prevention for AI-generated HTML |
| Icons | lucide-react | Consistent, tree-shakeable SVGs |

---

## Folder Structure

```
src/
├── components/
│   ├── auth/          # ProtectedRoute
│   ├── chat/          # ChatContainer, MessageBubble, MessageList, etc.
│   ├── documents/     # UploadZone, DocumentCard, DocumentList, UploadProgress
│   ├── layout/        # AppLayout, Sidebar, Header, PageWrapper
│   └── ui/            # Base design system: Button, Input, Card, Modal, Toast, ...
├── hooks/             # useAuth, useChat, useDocuments, useStreaming, useTheme, useDebounce
├── pages/             # LoginPage, SignupPage, DashboardPage, DocumentsPage, ChatPage
├── services/          # mockApi.ts (ALL mock logic), streamHandler.ts
├── stores/            # authStore, documentStore, chatStore, uiStore (Zustand)
├── types/             # index.ts — ALL TypeScript interfaces
├── utils/             # formatters.ts, validators.ts, cn.ts
├── styles/            # global.css, theme tokens
└── lib/               # utils.ts (cn helper)
```

---

## Component Hierarchy

```
App
├── ErrorBoundary
└── BrowserRouter
    └── Suspense (lazy pages)
        ├── /login        → LoginPage
        ├── /signup       → SignupPage
        └── ProtectedRoute
            ├── /dashboard → DashboardPage
            │   └── AppLayout
            │       ├── Sidebar
            │       ├── Header
            │       └── PageWrapper > DashboardContent
            ├── /documents → DocumentsPage
            │   └── AppLayout
            │       └── PageWrapper
            │           ├── UploadZone
            │           ├── UploadProgress
            │           └── DocumentList > DocumentCard[]
            └── /chat/:id → ChatPage
                └── AppLayout
                    ├── ConversationSidebar
                    └── ChatContainer
                        ├── MessageList > MessageBubble[] > SourceCard
                        ├── TypingIndicator
                        └── ChatInput
```

---

## Data Flow

```
User Action
    │
    ▼
React Component (e.g. ChatInput)
    │  calls hook
    ▼
Custom Hook (e.g. useChat)
    │  calls store action
    ▼
Zustand Store (chatStore)
    │  calls service
    ▼
Service Layer (mockApi.ts / streamHandler.ts)
    │  returns data / streams
    ▼
Store updates state
    │  triggers re-render
    ▼
Component re-renders with new data
```

---

## State Management Strategy

- **authStore** — user session, persisted to localStorage
- **documentStore** — uploaded documents list, persisted
- **chatStore** — conversations + messages, persisted
- **uiStore** — ephemeral UI state (sidebar open, theme) — NOT persisted (except theme)

All stores use Zustand's `persist` middleware for relevant slices.

---

## API Integration Strategy

The app is designed for easy backend migration:

1. **Now**: All mock logic lives in `src/services/mockApi.ts`
2. **Later**: Replace `mockApi.ts` with real `apiClient.ts` — no store or component changes needed
3. The `streamHandler.ts` abstracts SSE/WebSocket streaming — swap implementation without touching consumers

---

## Performance Decisions

- `React.lazy + Suspense` — each page is a separate JS chunk
- `useDebounce(300ms)` — search input doesn't fire on every keystroke
- `React.memo` — expensive list items are memoized
- `AnimatePresence` — exit animations don't block navigation
