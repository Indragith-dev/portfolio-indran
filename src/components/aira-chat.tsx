"use client";

import { Fragment, useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Send, X } from "lucide-react";
import { useAira, type AiraMessage } from "@/hooks/use-aira";
import { handleAiraAction, type AiraAction } from "@/lib/aira";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  "What has he built?",
  "What's his tech stack?",
  "How can I contact him?",
];

const TEASER_KEY = "aira_teaser_dismissed";

/** Floating AIRA chat, bottom-right. */
export default function AiraChat({
  onAction = handleAiraAction,
}: {
  onAction?: (action: AiraAction) => void;
}) {
  const pathname = usePathname();
  const { messages, loading, send } = useAira(onAction);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [showTeaser, setShowTeaser] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const panelId = useId();

  // The home page has its own buttons in the bottom-right corner.
  const isHome = pathname === "/";

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(TEASER_KEY) === "1";
    } catch {}
    if (dismissed) return;
    const t = setTimeout(() => setShowTeaser(true), 2500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, open]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const dismissTeaser = () => {
    setShowTeaser(false);
    try {
      localStorage.setItem(TEASER_KEY, "1");
    } catch {}
  };

  const toggle = () => {
    dismissTeaser();
    setOpen((o) => !o);
  };

  const submit = (text: string) => {
    if (loading || !text.trim()) return;
    send(text);
    setInput("");
  };

  const last = messages[messages.length - 1];
  const waiting = loading && last.role === "assistant" && !last.content;
  const showSuggestions = messages.length === 1 && !loading;

  return (
    <div
      className={cn(
        "pointer-events-none fixed right-4 z-[60] flex flex-col items-end gap-3",
        isHome ? "bottom-16 md:bottom-20" : "bottom-4 md:bottom-6",
      )}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            id={panelId}
            role="dialog"
            aria-label="Chat with AIRA"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="bg-background/95 pointer-events-auto flex h-[min(520px,calc(100dvh-9rem))] w-[min(360px,calc(100vw-32px))] origin-bottom-right flex-col overflow-hidden rounded-xl border-2 shadow-2xl backdrop-blur-md"
          >
            {/* Header */}
            <div className="bg-muted/40 flex items-center gap-3 border-b px-4 py-3">
              <RobotAvatar className="size-9" />
              <div className="min-w-0 flex-1">
                <p className="font-mono text-sm font-bold tracking-wider">
                  AIRA
                </p>
                <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                  <span className="size-1.5 animate-pulse rounded-full bg-green-500" />
                  Indran&apos;s AI assistant
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-md p-1.5 transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={listRef}
              aria-live="polite"
              className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4"
            >
              {messages.map((m, i) =>
                m.role === "assistant" && !m.content ? null : (
                  <Bubble key={i} message={m} />
                ),
              )}

              {waiting && (
                <div className="bg-muted text-muted-foreground w-fit rounded-2xl rounded-bl-sm px-4 py-2.5">
                  <span className="sr-only">AIRA is typing</span>
                  <span aria-hidden className="flex gap-1">
                    {[0, 1, 2].map((d) => (
                      <motion.span
                        key={d}
                        className="size-1.5 rounded-full bg-current"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: d * 0.2,
                        }}
                      />
                    ))}
                  </span>
                </div>
              )}

              {showSuggestions && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => submit(s)}
                      className="hover:bg-muted rounded-full border px-3 py-1 font-mono text-xs transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit(input);
              }}
              className="flex items-center gap-2 border-t p-3"
            >
              <label htmlFor={inputId} className="sr-only">
                Ask AIRA about Indran
              </label>
              <input
                ref={inputRef}
                id={inputId}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={500}
                placeholder="Ask about Indran…"
                autoComplete="off"
                className="border-foreground/20 placeholder:text-muted-foreground focus:border-primary/60 focus:ring-primary/20 min-w-0 flex-1 rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send"
                className="bg-primary text-primary-foreground hover:bg-primary/90 flex size-9 shrink-0 items-center justify-center rounded-md transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="size-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-end gap-2">
        <AnimatePresence>
          {showTeaser && !open && (
            <motion.div
              key="teaser"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              className="bg-background pointer-events-auto relative mb-3 flex items-center gap-2 rounded-xl rounded-br-sm border-2 py-2 pr-2 pl-3 text-sm shadow-lg max-sm:hidden"
            >
              <button type="button" onClick={toggle} className="font-medium">
                Hi! Ask me about Indran 👋
              </button>
              <button
                type="button"
                onClick={dismissTeaser}
                aria-label="Dismiss"
                className="text-muted-foreground hover:text-foreground rounded p-0.5"
              >
                <X className="size-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={toggle}
          aria-label={open ? "Close AIRA chat" : "Open AIRA chat"}
          aria-expanded={open}
          aria-controls={panelId}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className="pointer-events-auto relative flex flex-col items-center"
        >
          <motion.span
            animate={open ? { y: 0 } : { y: [0, -4, 0] }}
            transition={
              open
                ? { duration: 0.2 }
                : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
            }
            className="block"
          >
            <RobotAvatar className="size-14 shadow-[0_0_24px_rgba(255,255,255,0.15)] md:size-16" />
          </motion.span>
          <span className="bg-foreground text-background -mt-2 rounded-full px-2 py-0.5 font-mono text-[10px] font-bold tracking-widest">
            AIRA
          </span>
        </motion.button>
      </div>
    </div>
  );
}

/** robot-2d.webp is a dark robot with wide margins, so crop it onto a light disc. */
function RobotAvatar({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative block shrink-0 overflow-hidden rounded-full border-2 border-black/80 bg-white",
        className,
      )}
    >
      <img
        src="/robot-2d.webp"
        alt=""
        draggable={false}
        className="size-full scale-[1.55] object-cover"
      />
    </span>
  );
}

function Bubble({ message }: { message: AiraMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed break-words whitespace-pre-wrap",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-muted text-foreground rounded-bl-sm",
        )}
      >
        {isUser ? message.content : <Linkified text={message.content} />}
      </div>
    </div>
  );
}

const LINK_RE = /(https?:\/\/[^\s)]+[^\s).,!?]|[\w.+-]+@[\w-]+\.[\w.-]*\w)/g;

/** Turns URLs and email addresses in AIRA's replies into links. */
function Linkified({ text }: { text: string }) {
  return text.split(LINK_RE).map((part, i) => {
    if (i % 2 === 0) return <Fragment key={i}>{part}</Fragment>;
    const href = part.includes("@") && !part.startsWith("http") ? `mailto:${part}` : part;
    return (
      <a
        key={i}
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel="noopener noreferrer"
        className="underline underline-offset-2 hover:opacity-80"
      >
        {part}
      </a>
    );
  });
}
