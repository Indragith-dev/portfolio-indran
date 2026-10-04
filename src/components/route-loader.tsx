"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { RobotCharacter } from "@/components/ui/robot-character";
import { useSoundCustom } from "@/hooks/use-sound-custom";
import { projects } from "@/config/portfolio-data";
import { LOADER_FROM_PATHS, useRouteLoader } from "@/store/use-route-loader";

/** Shown at least this long so the run is never just a flash. */
const MIN_VISIBLE_MS = 1300;
/** Pause at 100% for the celebration before fading out. */
const DONE_HOLD_MS = 650;
/** Give up waiting on slow images after this long. */
const READY_TIMEOUT_MS = 4000;
/** Never leave the overlay up if a navigation silently fails. */
const SAFETY_MS = 12000;

/** "Portfolio", a project's title, or a generic fallback. */
function describe(path: string | null) {
  if (!path) return "page";
  if (path === "/portfolio") return "portfolio";
  const slug = path.match(/^\/portfolio\/projects\/([^/?#]+)/)?.[1];
  const project = projects.find((p) => p.id === slug);
  return project ? project.title.split(" — ")[0] : "page";
}

/** Resolves once fonts and the images in view have loaded (or after a cap). */
function pageReady(): Promise<void> {
  const images = Array.from(document.images).filter((img) => {
    if (img.complete) return false;
    const r = img.getBoundingClientRect();
    return r.bottom > 0 && r.top < window.innerHeight;
  });
  const imagesLoaded = Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          img.addEventListener("load", () => resolve(), { once: true });
          img.addEventListener("error", () => resolve(), { once: true });
        }),
    ),
  );
  return Promise.race([
    Promise.all([document.fonts.ready, imagesLoaded]).then(() => undefined),
    new Promise<void>((resolve) => setTimeout(resolve, READY_TIMEOUT_MS)),
  ]);
}

/**
 * Full-screen transition loader: a progress bar with AIRA running along it,
 * shown when navigating away from the console page until the next page is
 * ready.
 */
export default function RouteLoader() {
  const pathname = usePathname();
  const { from, to, start, finish } = useRouteLoader();
  const active = from !== null;
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const startedAt = useRef(0);

  // Footsteps while running, muted by the site's sound toggle.
  const [playSteps, { stop: stopSteps }] = useSoundCustom(
    "/robo/robo_walk_sound.mp3",
    { volume: 0.4, loop: true },
  );
  const [playHop] = useSoundCustom("/robo/robo_sound.mp3", { volume: 0.4 });
  const sounds = useRef({ playSteps, stopSteps, playHop });
  sounds.current = { playSteps, stopSteps, playHop };

  // Catch in-site link clicks that leave a loader page.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.("a");
      if (!link || link.hasAttribute("download")) return;
      if (link.target && link.target !== "_self") return;

      const url = new URL(link.href, window.location.href);
      const here = window.location.pathname;
      if (url.origin !== window.location.origin || url.pathname === here) return;
      if (!LOADER_FROM_PATHS.includes(here)) return;
      start(here, url.pathname);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [start]);

  // Start: reset the bar and creep towards 90% while the page loads.
  useEffect(() => {
    if (!active) return;
    startedAt.current = Date.now();
    setDone(false);
    setProgress(8);
    sounds.current.playSteps();

    const trickle = setInterval(() => {
      setProgress((p) => (p < 90 ? p + Math.max(0.6, (90 - p) * 0.09) : p));
    }, 120);
    const safety = setTimeout(finish, SAFETY_MS);
    return () => {
      clearInterval(trickle);
      clearTimeout(safety);
      sounds.current.stopSteps();
    };
  }, [active, finish]);

  // Finish: once the new route has rendered and its content is ready.
  useEffect(() => {
    if (!active || pathname === from) return;
    let cancelled = false;
    let hold: ReturnType<typeof setTimeout>;

    (async () => {
      await pageReady();
      const wait = MIN_VISIBLE_MS - (Date.now() - startedAt.current);
      if (wait > 0) await new Promise((r) => setTimeout(r, wait));
      if (cancelled) return;
      setProgress(100);
      setDone(true);
      sounds.current.stopSteps();
      sounds.current.playHop();
      hold = setTimeout(finish, DONE_HOLD_MS);
    })();

    return () => {
      cancelled = true;
      clearTimeout(hold);
    };
  }, [active, pathname, from, finish]);

  const pct = Math.round(progress);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="route-loader"
          role="status"
          aria-live="polite"
          aria-label={`Loading ${describe(to)}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.35 } }}
          transition={{ duration: 0.15 }}
          className="bg-background fixed inset-0 z-[10000] flex items-center justify-center"
        >
          {/* Faint grid, like the rest of the site */}
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,.05)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.06)_1px,transparent_1px)]"
          />

          <div className="relative w-[min(560px,calc(100vw-4rem))]">
            {/* Runway: AIRA runs along the top of the bar */}
            <div className="relative h-24 md:h-28">
              <motion.div
                className="absolute bottom-0"
                style={{ x: "-50%" }}
                animate={{ left: `${progress}%` }}
                transition={{ ease: "linear", duration: done ? 0.3 : 0.15 }}
              >
                {/* Dust kicked up behind */}
                {!done &&
                  [0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      aria-hidden
                      className="bg-muted-foreground/40 absolute bottom-1 left-2 size-2 rounded-full"
                      animate={{ x: [0, -22], y: [0, -6], opacity: [0.8, 0], scale: [0.6, 1.4] }}
                      transition={{ duration: 0.55, repeat: Infinity, delay: i * 0.18, ease: "easeOut" }}
                    />
                  ))}
                <RobotCharacter
                  state={done ? "success" : "running"}
                  className="size-20 md:size-24"
                />
              </motion.div>
            </div>

            {/* Bar */}
            <div className="bg-muted/40 relative h-3 overflow-hidden rounded-full border-2">
              <motion.div
                className="from-foreground/60 to-foreground absolute inset-y-0 left-0 rounded-full bg-gradient-to-r"
                animate={{ width: `${progress}%` }}
                transition={{ ease: "linear", duration: done ? 0.3 : 0.15 }}
              />
              {/* Moving sheen */}
              <motion.div
                aria-hidden
                className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ left: ["-20%", "110%"] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>

            {/* Label */}
            <div className="mt-4 flex items-baseline justify-between font-mono text-xs md:text-sm">
              <span className="text-muted-foreground">
                {done ? "Ready!" : `AIRA is fetching the ${describe(to)}…`}
              </span>
              <span className="tabular-nums">{pct}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
