# DocChat AI

> A production-grade AI Document Chat application built with React 18, TypeScript (strict), TailwindCSS v4, and Framer Motion.

---

## Pages

| Page | Path | Description |
|------|------|-------------|
| Login | `/login` | Glassmorphism login card with validation |
| Signup | `/signup` | Registration with password strength indicator |
| Dashboard | `/dashboard` | Stats, quick actions, recent items |
| Documents | `/documents` | Upload, manage, and search documents |
| Chat | `/chat` | AI chat with streaming responses and source citations |

---

## Getting Started

```bash
pnpm install
cp .env.example .env
pnpm --filter @workspace/doc-chat run dev
```

Visit `http://localhost:23495`

**Test credentials:**
- Email: `demo@company.com` | Password: `demo123`
- Or any valid email + 6+ character password

---

## Tech Stack

| Category | Library |
|----------|---------|
| Framework | React 18 + Vite 7 |
| Language | TypeScript (strict, no `any`) |
| Styling | TailwindCSS v4 with HSL tokens |
| Animation | Framer Motion |
| State | Zustand with `persist` |
| Forms | React Hook Form + Zod |
| Routing | react-router-dom v6 |
| Upload | react-dropzone |
| Markdown | react-markdown + remark-gfm |
| Syntax | react-syntax-highlighter (Prism) |
| Dates | date-fns |
| Sanitization | DOMPurify |
| Icons | lucide-react |

---

## Folder Structure

```
src/
├── components/
│   ├── auth/          # ProtectedRoute
│   ├── chat/          # ChatContainer, MessageList, MessageBubble, SourceCard, …
│   ├── documents/     # UploadZone, DocumentCard, DocumentList, UploadProgress
│   ├── layout/        # AppLayout, Sidebar, Header, PageWrapper
│   └── ui/            # Button, Input, Card, Modal, Badge, Avatar, Spinner, …
├── hooks/             # useAuth, useChat, useDocuments (debounced), useStreaming, …
├── pages/             # LoginPage, SignupPage, DashboardPage, DocumentsPage, ChatPage
├── services/          # mockApi.ts (all mock logic), streamHandler.ts
├── stores/            # authStore, documentStore, chatStore, uiStore (Zustand)
├── types/             # index.ts — all TypeScript interfaces
└── utils/             # formatters.ts, constants.ts
```

---

## Connecting a Real Backend

When the backend API is ready, **replace only `src/services/mockApi.ts`** with real API calls.
All stores, hooks, and components stay unchanged.

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + N` | New conversation |
| `Enter` | Send message |
| `Shift + Enter` | New line in message |
| `Escape` | Close mobile sidebar |

---

## Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — Tech choices, component hierarchy, data flow
- [`docs/SETUP.md`](docs/SETUP.md) — Environment variables, build, backend migration
- [`docs/COMPONENTS.md`](docs/COMPONENTS.md) — Component API reference
- [`workflow-logs/PROGRESS.md`](workflow-logs/PROGRESS.md) — Build progress log
- [`workflow-logs/DECISIONS.md`](workflow-logs/DECISIONS.md) — Decision rationale
