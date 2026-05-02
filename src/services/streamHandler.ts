/**
 * streamHandler.ts
 *
 * Handles character-by-character streaming of AI responses.
 * When real backend streaming (SSE / WebSocket) is ready,
 * replace this service — all consumers stay unchanged.
 */

export interface StreamOptions {
  /** Milliseconds between each character. Default: 18 */
  charDelay?: number;
  /** Called with each accumulated chunk of text */
  onChunk: (text: string) => void;
  /** Called when streaming is complete */
  onComplete: () => void;
  /** Signal to cancel the stream */
  signal?: AbortSignal;
}

/**
 * Streams a string character-by-character with a simulated typing effect.
 */
export async function streamText(fullText: string, options: StreamOptions): Promise<void> {
  const { charDelay = 18, onChunk, onComplete, signal } = options;

  let accumulated = "";

  for (let i = 0; i < fullText.length; i++) {
    if (signal?.aborted) break;

    await delay(charDelay);

    accumulated += fullText[i];
    onChunk(accumulated);
  }

  onComplete();
}

/**
 * Streams words instead of characters for longer texts (better perf).
 */
export async function streamWords(fullText: string, options: StreamOptions): Promise<void> {
  const { charDelay = 40, onChunk, onComplete, signal } = options;
  const words = fullText.split(" ");
  let accumulated = "";

  for (const word of words) {
    if (signal?.aborted) break;
    await delay(charDelay);
    accumulated += (accumulated ? " " : "") + word;
    onChunk(accumulated);
  }

  onComplete();
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
