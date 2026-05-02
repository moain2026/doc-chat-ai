# Setup Guide — DocChat AI

## Prerequisites

- Node.js 18+ (or 20+)
- pnpm 9+

---

## Local Development

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Start dev server (hot reload)
pnpm --filter @workspace/doc-chat run dev
```

App will be available at: `http://localhost:23495`

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_APP_NAME` | `DocChat AI` | Browser tab title |
| `VITE_APP_VERSION` | `1.0.0` | App version shown in footer |
| `VITE_STREAM_CHAR_DELAY_MS` | `18` | Typing speed in ms/char |
| `VITE_MAX_FILE_SIZE_MB` | `10` | Max upload size |
| `VITE_API_BASE_URL` | _(not set)_ | Real API base URL (for future backend) |

---

## Test Credentials

| Email | Password | Name |
|-------|----------|------|
| `demo@company.com` | `demo123` | Ahmed |
| Any valid email | Any 6+ char password | Derived from email |

---

## Build for Production

```bash
pnpm --filter @workspace/doc-chat run build
```

Output: `artifacts/doc-chat/dist/`

---

## Connecting a Real Backend

When the backend API is ready:

1. Set `VITE_API_BASE_URL=https://api.yourcompany.com` in `.env`
2. Replace `src/services/mockApi.ts` with `src/services/apiClient.ts`
3. Update imports in `authStore.ts`, `documentStore.ts`, `chatStore.ts` to use the real client
4. **All components, hooks, and pages stay unchanged**

---

## Supported File Types

| Type | Extension | Max Size |
|------|-----------|----------|
| PDF | `.pdf` | 10 MB |
| Word | `.docx`, `.doc` | 10 MB |
| Excel | `.xlsx`, `.xls` | 10 MB |
| Text | `.txt` | 10 MB |
