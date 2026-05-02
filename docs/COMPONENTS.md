# Component API Documentation — DocChat AI

## UI Components (`src/components/ui/`)

### `<Button>`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `primary \| secondary \| ghost \| danger \| outline` | `primary` | Visual style |
| `size` | `sm \| md \| lg` | `md` | Size variant |
| `loading` | `boolean` | `false` | Shows spinner, disables click |
| `leftIcon` | `ReactNode` | — | Icon before label |
| `rightIcon` | `ReactNode` | — | Icon after label |
| `className` | `string` | — | Additional classes |

### `<Input>`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Label above input |
| `error` | `string` | — | Error message (red) |
| `helperText` | `string` | — | Helper text below |
| `leftIcon` | `ReactNode` | — | Icon inside left |
| `rightIcon` | `ReactNode` | — | Icon inside right |
| All native `<input>` props | | | Forwarded via `React.forwardRef` |

### `<Card>`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `default \| glass` | `default` | `glass` adds backdrop-blur |
| `padding` | `sm \| md \| lg \| none` | `md` | Inner padding |
| `hover` | `boolean` | `false` | Subtle lift on hover |
| `className` | `string` | — | Additional classes |

### `<Modal>`
| Prop | Type | Description |
|------|------|-------------|
| `isOpen` | `boolean` | Controls visibility |
| `onClose` | `() => void` | Called on backdrop click or Escape |
| `title` | `string` | Modal heading |
| `size` | `sm \| md \| lg` | Modal width |

### `<Badge>`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `success \| warning \| error \| info \| neutral` | `neutral` | Color |
| `size` | `sm \| md` | `sm` | Size |
| `dot` | `boolean` | `false` | Show colored dot prefix |

### `<Spinner>`
| Prop | Type | Default |
|------|------|---------|
| `size` | `sm \| md \| lg` | `md` |
| `className` | `string` | — |

### `<Avatar>`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | — | Image URL |
| `name` | `string` | `?` | Fallback initials source |
| `size` | `sm \| md \| lg \| xl` | `md` | Size |
| `online` | `boolean` | `false` | Green dot indicator |

### `<Skeleton>`
| Prop | Type | Default |
|------|------|---------|
| `variant` | `text \| circle \| card \| rectangle` | `rectangle` |
| `className` | `string` | — |

---

## Layout Components (`src/components/layout/`)

### `<AppLayout>`
Wraps all protected pages. Renders `<Sidebar>` + `<Header>` + `children`.
| Prop | Description |
|------|-------------|
| `title` | Sets Header title and document `<title>` |
| `children` | Page content |

### `<PageWrapper>`
Adds consistent padding, max-width, and fade+slide entrance.
| Prop | Type | Default |
|------|------|---------|
| `fluid` | `boolean` | `false` — set `true` for full-width (chat) |
| `className` | `string` | — |

### `<Sidebar>`
Collapsible navigation. Auto-collapses on mobile.

### `<Header>`
Top bar with mobile hamburger, theme toggle, and user dropdown.

---

## Chat Components (`src/components/chat/`)

### `<ChatContainer>`
Full-height chat area. Manages auto-scroll and passes messages to `<MessageList>`.

### `<MessageBubble>`
Renders a single message. User messages → right-aligned. Assistant → left-aligned with Markdown support.

### `<MessageList>`
Groups messages by date label (Today / Yesterday / full date). Shows empty state or skeleton.

### `<SourceCard>`
Collapsible source citations below AI messages. Shows document name, snippet, relevance bar.

### `<ConversationSidebar>`
Scrollable list of conversations. New chat button. Delete with confirmation.

### `<TypingIndicator>`
Three bouncing dots. Shown while AI is "thinking" before streaming starts.

### `<SuggestedQuestions>`
Four question cards shown in empty chat state. Clicking sends that question.

### `<ChatInput>`
Auto-growing textarea. Enter to send, Shift+Enter for new line. Character counter.

---

## Document Components (`src/components/documents/`)

### `<UploadZone>`
Drag-and-drop area. Validates file type and size. Uses `react-dropzone`.

### `<DocumentCard>`
Card for one document. Shows status badge, progress bar (uploading), delete button.

### `<DocumentList>`
Grid of `<DocumentCard>` components. Handles empty state and skeleton loading.

### `<UploadProgress>`
Floating bar shown while upload is in progress. File name + animated progress bar.

---

## Hooks (`src/hooks/`)

| Hook | Returns | Description |
|------|---------|-------------|
| `useAuth()` | `{ user, login, logout, ... }` | Auth state + initials |
| `useChat()` | `{ conversations, sendMessage, ... }` | Chat actions + active conversation |
| `useDocuments()` | `{ documents, search, sort, ... }` | Filtered document list with debounced search |
| `useStreaming()` | `{ start, cancel }` | Stream control (mock or real SSE) |
| `useTheme()` | `{ isDark, toggle }` | Dark/light mode |
| `useDebounce(value, delay)` | `T` | Debounced value |
