import { useCallback, useEffect, useRef, useState } from "react";
import { AIRA_URL, type AiraAction } from "@/lib/aira";

export type AiraMessage = { role: "user" | "assistant"; content: string };

const GREETING: AiraMessage = {
  role: "assistant",
  content:
    "Hi, I'm AIRA, Indran's AI assistant. Ask me about his projects, skills or experience.",
};

/**
 * Chat state for AIRA. Streams the reply from `${AIRA_URL}/api/chat` (NDJSON)
 * and passes any actions to `onAction`.
 */
export function useAira(onAction: (action: AiraAction) => void) {
  const [messages, setMessages] = useState<AiraMessage[]>([GREETING]);
  const [loading, setLoading] = useState(false);
  const messagesRef = useRef(messages);
  const onActionRef = useRef(onAction);
  const abortRef = useRef<AbortController | null>(null);

  messagesRef.current = messages;
  onActionRef.current = onAction;

  useEffect(() => () => abortRef.current?.abort(), []);

  const send = useCallback(async (text: string) => {
    const content = text.trim().slice(0, 500);
    if (!content) return;

    const history = [...messagesRef.current, { role: "user" as const, content }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setLoading(true);

    const append = (chunk: string) =>
      setMessages((prev) => {
        const copy = [...prev];
        const last = copy[copy.length - 1];
        copy[copy.length - 1] = { ...last, content: last.content + chunk };
        return copy;
      });

    const handleLine = (line: string) => {
      if (!line.trim()) return;
      try {
        const evt = JSON.parse(line);
        if (evt.type === "text") append(evt.text);
        else if (evt.type === "action")
          onActionRef.current({ name: evt.name, args: evt.args ?? {} });
        else if (evt.type === "error") append(evt.message);
      } catch {
        // Ignore a malformed line rather than dropping the whole reply.
      }
    };

    try {
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      const res = await fetch(`${AIRA_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.slice(1) }), // skip the greeting
        signal: abortRef.current.signal,
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        append(data?.error || "Something went wrong. Please try again.");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        lines.forEach(handleLine);
      }
      handleLine(buffer + decoder.decode());
    } catch (e) {
      if ((e as Error).name !== "AbortError")
        append("Connection problem. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  return { messages, loading, send };
}
