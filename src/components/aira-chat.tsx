"use client";

import { Fragment, useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { MessageCircle, Send, X } from "lucide-react";
import { useAira, type AiraMessage } from "@/hooks/use-aira";
import { useSoundCustom } from "@/hooks/use-sound-custom";
import { handleAiraAction, type AiraAction } from "@/lib/aira";
import { cn } from "@/lib/utils";
import { RobotCharacter, type RobotState } from "@/components/ui/robot-character";
import SpeechBubble from "@/components/ui/speech-bubble";

const SUGGESTIONS = [
  "What has he built?",
  "What's his tech stack?",
  "How can I contact him?",
];

const BUBBLE_DELAY_MS = 1200;
/** Grace period so moving the mouse from the robot onto the bubble keeps it open. */
const HOVER_HIDE_DELAY_MS = 300;
const WALK_MS = 1100;
/** Walking back is slower: it's sad to go. */
const LEAVE_MS = 1700;
const GREETING_MS = 2200;
const SUCCESS_MS = 1200;
const SURPRISE_MS = 600;
/** Minimum gap between hover sounds, so sweeping the mouse doesn't spam it. */
const HOVER_SOUND_COOLDOWN_MS = 2000;
/** How far past the intro splash (in viewport heights) before AIRA shows up. */
const SHOW_AFTER_SCREENS = 0.6;

/**
 * hidden: off-screen while the portfolio intro is showing.
 * peek: leaning out from behind the right edge, waving with a speech bubble.
 * arriving / leaving: walking between the corner and its spot under the chat.
 * open: chat panel shown above the robot.
 */
type Phase = "hidden" | "peek" | "arriving" | "open" | "leaving";

/**
 * Poses for the robot button, which is pinned to the right edge (x is a
 * share of its own width). PEEK is enlarged, mostly behind the edge and
 * tilted so only the head and arms lean into view.
 */
const HIDDEN = { x: "260%", rotate: -32, scale: 1.8 };
const PEEK = { x: "120%", rotate: -32, scale: 1.8 };
const STAND = { x: "-18%", rotate: 0, scale: 1 };

const POSE: Record<Phase, typeof PEEK> = {
  hidden: HIDDEN,
  peek: PEEK,
  leaving: PEEK,
  arriving: STAND,
  open: STAND,
};

/**
 * AIRA chat for the portfolio page: a robot that peeks in from the
 * bottom-right once the intro is scrolled past, and walks out when clicked.
 */
export default function AiraChat({
  onAction = handleAiraAction,
}: {
  onAction?: (action: AiraAction) => void;
}) {
  const pathname = usePathname();
  // Only the main portfolio page, not the project detail pages under it.
  const onPortfolio = pathname === "/portfolio";
  const { messages, loading, send } = useAira(onAction);
  const [phase, setPhase] = useState<Phase>("hidden");
  const [input, setInput] = useState("");
  // Speech bubble: shown once AIRA has arrived and kept until its X is
  // pressed; after that it only shows while the robot or bubble is hovered.
  const [bubbleReady, setBubbleReady] = useState(false);
  const [bubbleDismissed, setBubbleDismissed] = useState(false);
  const [hovering, setHovering] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  // Short reactions that play on top of the chat-driven states.
  const [reaction, setReaction] = useState<"greeting" | "success" | "surprised" | null>(null);
  const reactionTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const wasLoading = useRef(false);
  const prevPhase = useRef<Phase>("hidden");
  const lastHoverSound = useRef(0);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const panelId = useId();

  // Muted by the navbar's sound toggle, like the site's other sounds.
  const [playRobo] = useSoundCustom("/robo/robo_sound.mp3", { volume: 0.5 });
  const [playWalk, { stop: stopWalk }] = useSoundCustom(
    "/robo/robo_walk_sound.mp3",
    { volume: 0.5 },
  );
  // play/stop change identity once the files load; read them through a ref so
  // the phase effect below only reacts to phase changes.
  const sounds = useRef({ playRobo, playWalk, stopWalk });
  sounds.current = { playRobo, playWalk, stopWalk };

  const open = phase === "open";
  const walking = phase === "arriving" || phase === "leaving";
  const walkMs = phase === "leaving" ? LEAVE_MS : WALK_MS;

  // Stay off-screen during the intro splash; peek in once the page starts.
  useEffect(() => {
    if (!onPortfolio) return;
    const el = document.querySelector<HTMLElement>(".portfolio-container");
    if (!el) return;

    const onScroll = () => {
      const pastIntro = el.scrollTop > window.innerHeight * SHOW_AFTER_SCREENS;
      setPhase((p) =>
        pastIntro && p === "hidden" ? "peek" : !pastIntro && p === "peek" ? "hidden" : p,
      );
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, [onPortfolio]);

  // Sounds and the speech bubble follow phase changes.
  useEffect(() => {
    const prev = prevPhase.current;
    prevPhase.current = phase;
    if (prev === phase) return;
    const { playRobo, playWalk, stopWalk } = sounds.current;

    if (prev === "arriving" || prev === "leaving") stopWalk();

    if (phase === "peek" && prev === "hidden") {
      playRobo();
      const t = setTimeout(() => setBubbleReady(true), BUBBLE_DELAY_MS);
      return () => clearTimeout(t);
    }
    if (phase === "hidden") {
      setBubbleReady(false);
      setHovering(false);
    }
    if (phase === "arriving") playWalk();
    if (phase === "leaving") {
      playRobo();
      playWalk();
    }
  }, [phase]);

  // Walk in, then open the chat; walk out, then peek again.
  useEffect(() => {
    if (!walking) return;
    const t = setTimeout(
      () => setPhase(phase === "arriving" ? "open" : "peek"),
      walkMs,
    );
    return () => clearTimeout(t);
  }, [phase, walking, walkMs]);

  const react = (kind: "greeting" | "success" | "surprised", ms: number) => {
    clearTimeout(reactionTimer.current);
    setReaction(kind);
    reactionTimer.current = setTimeout(() => setReaction(null), ms);
  };

  useEffect(
    () => () => {
      clearTimeout(reactionTimer.current);
      clearTimeout(hoverTimer.current);
    },
    [],
  );

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

  const showBubble =
    phase === "peek" && (bubbleDismissed ? hovering : bubbleReady);

  /** The bubble's X: hide it for good; from now on it only shows on hover. */
  const dismissBubble = () => {
    setBubbleDismissed(true);
    setHovering(false);
  };

  /** Hovering the peeking robot (or its bubble) says hi. */
  const onHoverStart = () => {
    clearTimeout(hoverTimer.current);
    // Standing under the open chat: wave hi (unless busy thinking or talking).
    if (phase === "open") {
      if (!loading) react("greeting", GREETING_MS);
      playHoverSound();
      return;
    }
    if (phase !== "peek") return;
    if (!showBubble) react("surprised", SURPRISE_MS);
    setHovering(true);
    playHoverSound();
  };

  const playHoverSound = () => {
    const now = Date.now();
    if (now - lastHoverSound.current > HOVER_SOUND_COOLDOWN_MS) {
      lastHoverSound.current = now;
      playRobo();
    }
  };

  const onHoverEnd = () => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setHovering(false), HOVER_HIDE_DELAY_MS);
  };

  const openChat = () => {
    setHovering(false);
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

  /** Single source of the robot's animation state. */
  const robotState: RobotState = walking
    ? phase === "leaving"
      ? "sad"
      : "walking"
    : phase === "peek"
      ? (reaction ?? (showBubble ? "greeting" : "idle"))
      : waiting
        ? "thinking"
        : loading
          ? "talking"
          : (reaction ?? "idle");

  if (!onPortfolio) return null;

  return (
    <div className="pointer-events-none fixed right-0 bottom-2 z-[60] flex flex-col items-end md:bottom-4">
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
            className="bg-background/95 pointer-events-auto mr-2 mb-1 flex md:mr-3 h-[min(520px,calc(100dvh-10rem))] w-[min(360px,calc(100vw-32px))] origin-bottom-right flex-col overflow-hidden rounded-xl border-2 shadow-2xl backdrop-blur-md"
          >
            {/* Header */}
            <div className="bg-muted/40 flex items-center gap-3 border-b px-4 py-3">
              <RobotCharacter
                state={robotState}
                className="size-9 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="font-mono text-sm font-bold tracking-wider">
                  AIRA
                </p>
                <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                  <span className="size-1.5 animate-pulse rounded-full bg-green-500" />
                  AI assistant
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
              className="no-scrollbar flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4"
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

      {/* Peeking sits a bit higher than standing, more so on desktop. */}
      <div
        style={{ transitionDuration: `${walkMs}ms` }}
        onMouseEnter={onHoverStart}
        onMouseLeave={onHoverEnd}
        className={cn(
          "relative transition-transform ease-in-out",
          (phase === "hidden" || phase === "peek" || phase === "leaving") &&
            "-translate-y-4 md:-translate-y-32",
        )}
      >
        <AnimatePresence>
          {showBubble && phase === "peek" && (
            <motion.div
              key="bubble"
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="pointer-events-auto absolute right-[5rem] bottom-[2rem] z-10 origin-bottom-right md:right-[5.5rem] md:bottom-[5rem]"
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
                    onClick={dismissBubble}
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
          disabled={walking || phase === "hidden"}
          aria-label={open ? "Close AIRA chat" : "Open AIRA chat"}
          aria-expanded={open}
          aria-controls={panelId}
          initial={HIDDEN}
          animate={POSE[phase]}
          transition={{
            x: { duration: walkMs / 1000, ease: "easeInOut" },
            scale: { duration: walkMs / 1000, ease: "easeInOut" },
            // Straighten up before walking out; lean back in after walking home.
            rotate: {
              duration: 0.35,
              delay: phase === "leaving" ? walkMs / 1000 - 0.35 : 0,
            },
          }}
          style={{ transformOrigin: "bottom right" }}
          className="pointer-events-auto block size-20 cursor-grab md:size-28"
        >
          <RobotCharacter
            state={robotState}
            // Mirrored so the waving arm is on the side facing the page.
            className="size-full -scale-x-100"
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
