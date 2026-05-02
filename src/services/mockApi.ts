/**
 * mockApi.ts
 *
 * Centralized mock API service.
 * When the real backend is ready, replace ONLY this file with real API calls.
 * All stores import from here — nothing else changes.
 */

import type { Source, Message } from "@/types";
import { useDocumentStore } from "@/stores/documentStore";

// ─── Response Templates ────────────────────────────────────────────────────

const RESPONSES: Record<string, string> = {
  policy: `Based on the **Company HR Policy 2025** document, here are the key policy highlights:

1. **Working Hours**: Standard working hours are 8 AM to 5 PM, Sunday through Thursday.
2. **Remote Work**: Employees may work remotely up to 2 days per week with manager approval.
3. **Code of Conduct**: All employees are expected to maintain professional behavior and integrity at all times.
4. **Dress Code**: Business casual is the standard unless a client meeting requires formal attire.

> For the complete policy details, please refer to **Section 3** of the HR Policy document.`,

  leave: `According to the **Employee Handbook**, the leave policy is as follows:

- **Annual Leave**: 21 working days per year (after 1 year of service)
- **Sick Leave**: Up to 30 days with a valid medical certificate
- **Emergency Leave**: 3 days per incident (max 2 incidents per year)
- **Maternity Leave**: 90 days fully paid
- **Paternity Leave**: 3 days

**How to apply:**
1. Submit request via HR portal at least **3 business days** in advance
2. Get direct manager approval
3. HR will confirm within 24 hours

> **Note**: Unused annual leave can be carried over up to a maximum of 10 days.`,

  salary: `Based on the **Salary Scale Q1 2025** document:

| Grade | Title | Salary Range |
|-------|-------|-------------|
| G1 | Junior | SAR 8,000 – 12,000 |
| G2 | Mid-level | SAR 13,000 – 18,000 |
| G3 | Senior | SAR 19,000 – 28,000 |
| G4 | Manager | SAR 29,000 – 45,000 |
| G5 | Director | SAR 46,000 – 70,000 |

**Annual Increment Cycle:**
- Performance reviews are conducted in **Q4** each year
- Increments range from 3% to 15% based on performance rating
- Bonuses are awarded in January following the review period`,

  default: `Based on your uploaded documents, I found the following relevant information:

**Key Points:**
- Your documents contain comprehensive information about company policies and procedures
- The HR handbook covers most common employee questions
- For specific details, ask me about **leave**, **salary**, **policies**, or any other HR topic

**What I can help you with:**
- \`Leave policy\` — vacation days, sick leave, emergency leave
- \`Salary information\` — grades, ranges, increment cycles
- \`Company policies\` — remote work, dress code, conduct
- \`Benefits\` — health insurance, transportation, housing

Try asking something specific like: *"What is the annual leave policy?"*`,
};

// ─── Response Selector ─────────────────────────────────────────────────────

export function getMockResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();

  if (lower.includes("policy") || lower.includes("سياسة") || lower.includes("rule") || lower.includes("قاعدة")) {
    return RESPONSES.policy;
  }
  if (lower.includes("leave") || lower.includes("إجازة") || lower.includes("vacation") || lower.includes("أجازة")) {
    return RESPONSES.leave;
  }
  if (
    lower.includes("salary") || lower.includes("راتب") ||
    lower.includes("pay") || lower.includes("compensation") ||
    lower.includes("increment") || lower.includes("bonus")
  ) {
    return RESPONSES.salary;
  }

  return RESPONSES.default;
}

// ─── Mock Sources Generator ────────────────────────────────────────────────

export function getMockSources(): Source[] {
  const docs = useDocumentStore.getState().documents.filter((d) => d.status === "ready");
  if (docs.length === 0) return [];

  const snippets = [
    "…employees are entitled to the following benefits as outlined in section 4.2 of the HR Policy…",
    "…all requests must be submitted in writing no later than 3 business days prior to the intended date…",
    "…the performance review cycle begins in October of each fiscal year with final results by December…",
    "…remote work arrangements require written approval from the direct line manager on a case-by-case basis…",
  ];

  return docs.slice(0, Math.min(3, docs.length)).map((doc, i) => ({
    documentId: doc.id,
    documentName: doc.name,
    snippet: snippets[i % snippets.length] ?? snippets[0],
    relevance: parseFloat((0.97 - i * 0.11).toFixed(2)),
  }));
}

// ─── Mock Auth ─────────────────────────────────────────────────────────────

export async function mockLogin(email: string, password: string) {
  await delay(1000); // simulate network latency

  if (email === "demo@company.com" && password === "demo123") {
    return { id: "user-1", email, name: "Ahmed", avatarUrl: null };
  }
  if (email.includes("@") && email.includes(".") && password.length >= 6) {
    const name = email.split("@")[0] ?? "User";
    return {
      id: `user-${Date.now()}`,
      email,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      avatarUrl: null,
    };
  }

  throw new Error("Invalid email or password.");
}

export async function mockSignup(email: string, _password: string, name: string) {
  await delay(1200);
  return { id: `user-${Date.now()}`, email, name, avatarUrl: null };
}

// ─── Mock Upload ───────────────────────────────────────────────────────────

export async function* mockUploadProgress(
  onProgress: (p: number) => void
): AsyncGenerator<void> {
  for (let p = 0; p <= 100; p += 5) {
    await delay(100);
    onProgress(p);
    yield;
  }
}

export async function mockProcessDocument(): Promise<number> {
  await delay(3000);
  return Math.floor(Math.random() * 40) + 10; // chunk count
}

// ─── Utility ───────────────────────────────────────────────────────────────

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
