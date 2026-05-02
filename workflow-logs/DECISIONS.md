# Decision Log — DocChat AI

## D001 — Zustand over Redux / TanStack Query
**Decision**: Zustand for all client state  
**Reasoning**: Redux has too much boilerplate for this scale. TanStack Query is excellent for server state but we're using mock/local data. Zustand is ~1KB, composable, works with localStorage via `persist` middleware, and has a clean API.  
**Trade-off**: If the app grows to need complex server cache invalidation, TanStack Query should be added alongside Zustand (not replace it).

## D002 — TailwindCSS v4 with HSL tokens
**Decision**: Tailwind v4 with CSS custom properties for theme colors  
**Reasoning**: v4 uses a CSS-first config approach with `@theme` directives. HSL tokens allow dark/light mode with a single variable change per color. No runtime JS for theming.

## D003 — Mock API as a separate service layer
**Decision**: All mock logic in `src/services/mockApi.ts`  
**Reasoning**: When the real backend is ready, we replace ONE file. Stores import from `mockApi.ts` — no component or store changes needed. This is the key architectural decision for maintainability.

## D004 — react-dropzone over custom drag/drop
**Decision**: react-dropzone  
**Reasoning**: Handles all edge cases: multiple file selection, OS-level drag, keyboard accessibility, MIME type filtering. Custom implementation would take 3x longer and miss edge cases.

## D005 — react-markdown over dangerouslySetInnerHTML
**Decision**: react-markdown + DOMPurify  
**Reasoning**: AI responses may contain Markdown. Using `dangerouslySetInnerHTML` is an XSS risk. `react-markdown` renders Markdown safely as React elements. DOMPurify is added as a second layer for any raw HTML.

## D006 — React.lazy for all pages
**Decision**: Code-split every page with `React.lazy`  
**Reasoning**: Initial bundle size matters for first-load performance. Each page is loaded only when the user navigates to it. The `Suspense` fallback shows a spinner — no blank screen.

## D007 — AnimatePresence for route transitions
**Decision**: Framer Motion's `AnimatePresence` wrapping the route switch  
**Reasoning**: Without `AnimatePresence`, exit animations don't run (component is unmounted immediately). Wrapping `<Routes>` with `<AnimatePresence mode="wait">` ensures the outgoing page animates out before the new page animates in.

## D008 — useDebounce(300ms) for search
**Decision**: 300ms debounce on document search input  
**Reasoning**: Without debounce, every keystroke triggers a filter/re-render. 300ms is the standard UX sweet spot — responsive without being jarring.

## D009 — Barrel index.ts exports
**Decision**: `index.ts` in every component and hook folder  
**Reasoning**: Allows clean imports: `import { Button, Card } from '@/components/ui'` instead of `import { Button } from '@/components/ui/Button'`. Easier refactoring when file names change.

## D010 — Class-based ErrorBoundary
**Decision**: Class component for ErrorBoundary  
**Reasoning**: React's `getDerivedStateFromError` and `componentDidCatch` lifecycle methods are only available in class components. There is no hook equivalent. This is the only class component in the codebase.

## D011 — streamHandler abstraction
**Decision**: `streamHandler.ts` abstraction with `onChunk`/`onComplete` callbacks  
**Reasoning**: When the real backend uses SSE (Server-Sent Events) or WebSockets, we only replace the implementation inside `streamHandler.ts`. The `chatStore` just calls `streamText()` — it doesn't care how the text arrives.

## D012 — Inter font via Google Fonts
**Decision**: Inter font loaded via CSS `@import`  
**Reasoning**: Inter is the best legibility font for data-dense UIs (as used by Linear, Vercel, Notion). Google Fonts CDN has 99%+ global cache hit rate. The `@import` MUST be the first line in CSS (before Tailwind's `@import`) or it will be ignored.
