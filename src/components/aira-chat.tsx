"use client";

import { Fragment, useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { MessageCircle, Send, X } from "lucide-react";
import { useAira, type AiraMessage } from "@/hooks/use-aira";
import { handleAiraAction, type AiraAction } from "@/lib/aira";
import { cn } from "@/lib/utils";
import { RobotCharacter, type RobotState } from "@/components/ui/robot-character";
import SpeechBubble from "@/components/ui/speech-bubble";

const SUGGESTIONS = [
  "What has he built?",
  "What's his tech stack?",
  "How can I contact him?",
];

const BUBBLE_KEY = "aira_bubble_dismissed";
const BUBBLE_DELAY_MS = 1500;
const WALK_MS = 1100;
const GREETING_MS = 2200;
const SUCCESS_MS = 1200;

/**
 * peek: leaning out from behind the right edge, waving with a speech bubble.
 * arriving / leaving: walking between the corner and its spot under the chat.
 * open: chat panel shown above the robot.
 */
type Phase = "peek" | "arriving" | "open" | "leaving";

/** Where the robot stands, as a share of its own width (it is pinned to the right edge). */
const PEEK = { x: "30%", rotate: -22 };
const STAND = { x: "-18%", rotate: 0 };

/** AIRA chat: a robot peeking from the bottom-right that walks out when clicked. */
export default function AiraChat({
  onAction = handleAiraAction,
}: {
  onAction?: (action: AiraAction) => void;
}) {
  const pathname = usePathname();
  const { messages, loading, send } = useAira(onAction);
  const [phase, setPhase] = useState<Phase>("peek");
  const [input, setInput] = useState("");
  const [showBubble, setShowBubble] = useState(false);
  // Short reactions that play on top of the chat-driven states.
  const [reaction, setReaction] = useState<"greeting" | "success" | null>(null);
  const reactionTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const wasLoading = useRef(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const panelId = useId();

  const open = phase === "open";
  // The home page has its own buttons in the bottom-right corner.
  const isHome = pathname === "/";

  // Say hi once per visit, unless the bubble was dismissed in this tab.
  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem(BUBBLE_KEY) === "1";
    } catch {}
    if (dismissed) return;
    const t = setTimeout(() => setShowBubble(true), BUBBLE_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  // Walk in, then open the chat; walk out, then peek again.
  useEffect(() => {
    if (phase !== "arriving" && phase !== "leaving") return;
    const t = setTimeout(
      () => setPhase(phase === "arriving" ? "open" : "peek"),
      WALK_MS,
    );
    return () => clearTimeout(t);
  }, [phase]);

  const react = (kind: "greeting" | "success", ms: number) => {
    clearTimeout(reactionTimer.current);
    setReaction(kind);
    reactionTimer.current = setTimeout(() => setReaction(null), ms);
  };

  useEffect(() => () => clearTimeout(reactionTimer.current), []);

  // Wave when the chat opens.
  useEffect(() => {
    if (open) react("greeting", GREETING_MS);
  }, [open]);

  // Little celebration when a reply finishes.
  useEffect(() => {
    if (wasLoading.current && !loading) react("success", SUCCESS_MS);
    wasLoading.current = loading;
  }, [loading]);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, open]);

  const close = () => setPhase((p) => (p === "open" ? "leaving" : p));

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const hideBubble = () => {
    setShowBubble(false);
    try {
      sessionStorage.setItem(BUBBLE_KEY, "1");
    } catch {}
  };

  const openChat = () => {
    hideBubble();
    setPhase((p) => (p === "peek" ? "arriving" : p));
  };

  const toggle = () => (open ? close() : openChat());

  const submit = (text: string) => {
    if (loading || !text.trim()) return;
    send(text);
    setInput("");
  };

  const last = messages[messages.length - 1];
  const waiting = loading && last.role === "assistant" && !last.content;
  const showSuggestions = messages.length === 1 && !loading;
  const walking = phase === "arriving" || phase === "leaving";

  /** Single source of the robot's state; hook sounds to this later. */
  const robotState: RobotState = walking
    ? "walking"
    : phase === "peek"
      ? showBubble
        ? "greeting"
        : "idle"
      : waiting
        ? "thinking"
        : loading
          ? "talking"
          : (reaction ?? "idle");

  return (
    <div
      className={cn(
        "pointer-events-none fixed right-0 z-[60] flex flex-col items-end",
        isHome ? "bottom-16 md:bottom-20" : "bottom-2 md:bottom-4",
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
            className="bg-background/95 pointer-events-auto mr-4 mb-1 flex h-[min(520px,calc(100dvh-10rem))] w-[min(360px,calc(100vw-32px))] origin-bottom-right flex-col overflow-hidden rounded-xl border-2 shadow-2xl backdrop-blur-md"
          >
            {/* Header */}
            <div className="bg-muted/40 flex items-center gap-3 border-b px-4 py-3">
              <RobotCharacter
                state={robotState}
                className="size-9 shrink-0 drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]"
              />
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
                onClick={close}
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

      <div className="relative">
        <AnimatePresence>
          {showBubble && phase === "peek" && (
            <motion.div
              key="bubble"
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="pointer-events-auto absolute right-[65%] bottom-[85%] origin-bottom-right"
            >
              <SpeechBubble
                direction="right"
                borderColor="#000000"
                bg="#ffffff"
                textColor="#000000"
                className="w-max max-w-[220px] cursor-default"
              >
                <p className="mb-3 text-sm leading-snug font-bold">
                  Hi, I&apos;m AIRA! 👋
                  <br />
                  Need help?
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={openChat}
                    className="flex h-8 flex-1 items-center justify-center gap-2 bg-black px-3 font-bold text-white hover:bg-black/80"
                  >
                    <MessageCircle className="size-4" />
                    <span className="text-xs uppercase">Ask me</span>
                  </button>
                  <button
                    type="button"
                    onClick={hideBubble}
                    aria-label="Dismiss"
                    className="flex size-8 items-center justify-center bg-red-500 text-white hover:bg-red-600"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </SpeechBubble>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={toggle}
          disabled={walking}
          aria-label={open ? "Close AIRA chat" : "Open AIRA chat"}
          aria-expanded={open}
          aria-controls={panelId}
          initial={PEEK}
          animate={phase === "peek" || phase === "leaving" ? PEEK : STAND}
          transition={{
            x: { duration: WALK_MS / 1000, ease: "easeInOut" },
            // Straighten up before walking out; lean back in after walking home.
            rotate: {
              duration: 0.35,
              delay: phase === "leaving" ? WALK_MS / 1000 - 0.35 : 0,
            },
          }}
          style={{ transformOrigin: "bottom right" }}
          className="pointer-events-auto block size-20 md:size-28"
        >
          <RobotCharacter
            state={robotState}
            // Mirrored so the waving arm is on the side facing the page.
            className="size-full -scale-x-100 drop-shadow-[0_0_10px_rgba(255,255,255,0.25)]"
          />
        </motion.button>
      </div>
    </div>
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
