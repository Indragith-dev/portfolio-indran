"use client";

import { useState } from "react";
import {
  Terminal,
  TypingAnimation,
  AnimatedSpan,
} from "@/components/ui/terminal";
import { Button } from "@/components/ui/button";
import { Send, X } from "lucide-react";
import SectionHeading from "@/components/section-heading";
import { AIRA_URL } from "@/lib/aira";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_MESSAGE = 10;

/** Sends the message to the aira-api backend, which emails it to Indran. */
export default function Contact() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  // Hidden honeypot: real visitors never see it, bots fill it in.
  const [website, setWebsite] = useState("");
  const [step, setStep] = useState<number>(0); // 0: email, 1: name, 2: message
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  // Enabled as soon as there is a message; onSubmit explains anything missing.
  const canSend = message.trim().length > 0;

  const fail = (text: string) => {
    setError(text);
    setStatus("error");
  };

  const clearStatus = () => {
    if (status !== "idle" && status !== "sending") setStatus("idle");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    if (!EMAIL_RE.test(email.trim())) return fail("Please enter a valid email address.");
    if (!name.trim()) return fail("Please tell me your name.");
    if (message.trim().length < MIN_MESSAGE)
      return fail(`Your message should be at least ${MIN_MESSAGE} characters.`);

    setStatus("sending");
    try {
      const res = await fetch(`${AIRA_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, website }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        return fail(data?.error || "Something went wrong. Please try again.");
      }
      setEmail("");
      setName("");
      setMessage("");
      setStep(0);
      setStatus("sent");
    } catch {
      fail("Connection problem. Please check your internet and try again.");
    }
  };

  const onReset = () => {
    setStep(0);
    setEmail("");
    setName("");
    setMessage("");
    setStatus("idle");
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    if (step === 0 && !EMAIL_RE.test(email.trim()))
      return fail("Please enter a valid email address.");
    if (step === 1 && !name.trim()) return fail("Please tell me your name.");
    clearStatus();
    setStep((step) => step + 1);
  };

  return (
    <SectionHeading
      id="contact"
      text="Contact"
      className="px-4 py-12 md:px-8 md:py-16"
    >
      <div className="absolute inset-0 size-full">
        <div className="before:bg-border after:bg-border relative h-full w-full before:absolute before:top-1/2 before:left-0 before:h-0.5 before:w-full after:absolute after:top-0 after:left-1/2 after:h-full after:w-0.5" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="">
          <form onSubmit={onSubmit} className="w-full">
            {/* Honeypot: hidden from people and screen readers, must stay empty.
                Its name is deliberately meaningless so browser autofill and
                password managers leave it alone (it is sent as `website`). */}
            <input
              type="text"
              name="aira_hp_7f3"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              data-1p-ignore
              data-lpignore="true"
              data-form-type="other"
              aria-hidden="true"
              className="absolute -left-[9999px] size-px opacity-0"
            />
            <Terminal className="max-h-none w-full max-w-none">
              {step >= 0 && (
                <>
                  {" "}
                  {/* Q1 */}
                  <div className="text-foreground/90 flex items-start gap-2 font-mono">
                    <span className="text-emerald-400">$</span>
                    <TypingAnimation startOnView duration={26}>
                      Could you share your email with
                      me?
                    </TypingAnimation>
                  </div>
                  {/* A1 */}
                  <AnimatedSpan className="grid gap-2">
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-emerald-400">↪</span>
                      <input
                        type="email"
                        required
                        placeholder="you@domain.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          clearStatus();
                        }}
                        onKeyDown={handleEnter}
                        disabled={status === "sending"}
                        maxLength={200}
                        autoComplete="email"
                        className="border-foreground/20 text-foreground placeholder:text-foreground/40 w-full rounded-md border bg-transparent px-3 py-2 outline-none focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/30"
                      />
                    </div>
                  </AnimatedSpan>
                </>
              )}

              {step >= 1 && (
                <>
                  {/* Q2 */}
                  <div className="text-foreground/90 flex items-start gap-2 font-mono">
                    <span className="text-sky-400">$</span>
                    <TypingAnimation duration={26}>
                      Great! And may i know your name?
                    </TypingAnimation>
                  </div>

                  {/* A2 */}
                  <AnimatedSpan className="grid gap-2">
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-sky-400">↪</span>
                      <input
                        type="text"
                        placeholder="Your name"
                        value={name}
                        required
                        onChange={(e) => {
                          setName(e.target.value);
                          clearStatus();
                        }}
                        onKeyDown={handleEnter}
                        disabled={status === "sending"}
                        maxLength={100}
                        autoComplete="name"
                        className="border-foreground/20 text-foreground placeholder:text-foreground/40 w-full rounded-md border bg-transparent px-3 py-2 outline-none focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/30"
                      />
                    </div>
                  </AnimatedSpan>
                </>
              )}

              {/* Q3 */}
              {step >= 2 && (
                <>
                  <div className="text-foreground/90 flex items-start gap-2 font-mono">
                    <span className="text-amber-400">$</span>
                    <TypingAnimation duration={26}>
                      Awesome, now tell us how we can assist you today.
                    </TypingAnimation>
                  </div>

                  {/* A3 */}
                  <AnimatedSpan className="grid gap-2">
                    <div className="flex items-start gap-2 font-mono">
                      <span className="mt-2 text-amber-400">↪</span>
                      <textarea
                        required
                        rows={4}
                        placeholder="Tell me about your project, timeline, and goals…"
                        value={message}
                        onChange={(e) => {
                          setMessage(e.target.value);
                          clearStatus();
                        }}
                        disabled={status === "sending"}
                        maxLength={3000}
                        className="border-foreground/20 text-foreground placeholder:text-foreground/40 w-full resize-y rounded-md border bg-transparent px-3 py-2 outline-none focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/30"
                      />
                    </div>
                  </AnimatedSpan>
                  {/* Footer actions */}
                  <AnimatedSpan className="mt-2">
                    <div className="border-foreground/20 border-t border-dashed pt-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={onReset}
                          className="border-foreground/20 bg-foreground/5 hover:bg-foreground/10 font-mono text-xs"
                        >
                          <X className="mr-1 h-3.5 w-3.5" />
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={!canSend || status === "sending"}
                          className="border-foreground/20 bg-primary/10 text-foreground hover:bg-primary/20 border-2 font-mono text-xs disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <Send className="mr-1 h-3.5 w-3.5" />
                          {status === "sending" ? "Sending…" : "Send"}
                        </Button>
                      </div>
                    </div>
                  </AnimatedSpan>
                </>
              )}

              {status === "sent" && (
                <AnimatedSpan className="font-mono text-emerald-400/90">
                  ✓ Thanks! Your message is on its way. Indran will get back to
                  you soon.
                </AnimatedSpan>
              )}
              {status === "error" && (
                <AnimatedSpan className="font-mono text-red-400/90">
                  ⚠ {error}
                </AnimatedSpan>
              )}
            </Terminal>
          </form>
        </div>
      </div>
    </SectionHeading>
  );
}
