/**
 * useStreaming.ts
 * Hook that exposes streaming state and helpers.
 * Consumers don't need to know whether it's a mock or real SSE stream.
 */
import { useRef, useCallback } from "react";
import { streamText } from "@/services/streamHandler";

interface UseStreamingOptions {
  onChunk: (text: string) => void;
  onComplete: () => void;
}

export function useStreaming({ onChunk, onComplete }: UseStreamingOptions) {
  const abortRef = useRef<AbortController | null>(null);

  const start = useCallback(
    async (fullText: string, charDelay = 18) => {
      // Cancel any ongoing stream
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      await streamText(fullText, {
        charDelay,
        onChunk,
        onComplete,
        signal: controller.signal,
      });
    },
    [onChunk, onComplete]
  );

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  return { start, cancel };
}
