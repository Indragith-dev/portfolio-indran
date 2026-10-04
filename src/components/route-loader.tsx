"use client";

import { memo, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { RobotCharacter } from "@/components/ui/robot-character";
import { useSoundCustom } from "@/hooks/use-sound-custom";
import { projects } from "@/config/portfolio-data";
import { useRouteLoader } from "@/store/use-route-loader";
import { cn } from "@/lib/utils";

/** Shown at least this long so the run is never just a flash. */
const MIN_VISIBLE_MS = 1300;
/** Pause at 100% for the celebration before fading out. */
const DONE_HOLD_MS = 650;
/** Give up waiting on slow images after this long. */
const READY_TIMEOUT_MS = 4000;
/** Never leave the overlay up if a navigation silently fails. */
const SAFETY_MS = 12000;
/** The bar eases to HOLD_AT% over this long, then waits there for the page. */
const RUN_MS = 2600;
const HOLD_AT = 90;
const RUN_EASING = "cubic-bezier(0.2, 0.7, 0.3, 1)";
const FINISH_MS = 300;

/** Translate for a full-width layer showing `pct`% of it (0 = hidden left). */
const at = (pct: number) => `translateX(${pct - 100}%)`;

/** "Portfolio", a project's title, or a generic fallback. */
function describe(path: string | null) {
  if (!path) return "page";
  if (path === "/") return "home page";
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
 * shown on every page change (links, programmatic navigation, back/forward)
 * until the next page is ready.
 */
export default function RouteLoader() {
  const pathname = usePathname();
  const { from, to, start, finish } = useRouteLoader();
  const active = from !== null;
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const startedAt = useRef(0);
  // Both move with the Web Animations API: transform animations run on the
  // compositor, so they stay smooth while the next page loads and renders.
  const laneRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  // Footsteps while running, muted by the site's sound toggle.
  const [playSteps, { stop: stopSteps }] = useSoundCustom(
    "/robo/robo_walk_sound.mp3",
    { volume: 0.4, loop: true },
  );
  const [playHop] = useSoundCustom("/robo/robo_sound.mp3", { volume: 0.4 });
  const sounds = useRef({ playSteps, stopSteps, playHop });
  sounds.current = { playSteps, stopSteps, playHop };

  // The page we're on, so back/forward knows where it came from.
  const currentPath = useRef(pathname);
  useEffect(() => {
    if (!active) currentPath.current = pathname;
  }, [pathname, active]);

  // Browser back/forward: the URL has already changed when popstate fires.
  useEffect(() => {
    const onPopState = () => {
      const here = window.location.pathname;
      if (here !== currentPath.current) start(currentPath.current, here);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [start]);

  // Catch in-site link clicks that go to another page.
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
      start(here, url.pathname);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [start]);

  // Start: run the lane and fill towards HOLD_AT% while the page loads.
  useEffect(() => {
    if (!active) return;
    startedAt.current = Date.now();
    setDone(false);
    setProgress(0);
    sounds.current.playSteps();

    const layers = [laneRef.current, fillRef.current].filter(
      (el): el is HTMLDivElement => el !== null,
    );
    for (const el of layers) {
      el.animate([{ transform: at(0) }, { transform: at(HOLD_AT) }], {
        duration: RUN_MS,
        easing: RUN_EASING,
        fill: "forwards",
      });
    }

    // The number and ruler follow the bar's real position.
    const readout = setInterval(() => {
      const fill = fillRef.current;
      if (!fill || !fill.offsetWidth) return;
      const x = new DOMMatrixReadOnly(getComputedStyle(fill).transform).m41;
      setProgress(Math.max(0, Math.min(100, 100 + (x / fill.offsetWidth) * 100)));
    }, 100);
    const safety = setTimeout(finish, SAFETY_MS);
    return () => {
      clearInterval(readout);
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
      // Glide from wherever the bar is to the end.
      for (const el of [laneRef.current, fillRef.current]) {
        if (!el) continue;
        const from = getComputedStyle(el).transform;
        el.getAnimations().forEach((a) => a.cancel());
        el.animate([{ transform: from }, { transform: at(100) }], {
          duration: FINISH_MS,
          easing: "ease-out",
          fill: "forwards",
        });
      }
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
          className="bg-background fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden"
        >
          {/* Striped side borders, same as the portfolio frame */}
          <div
            aria-hidden
            className="border-border absolute inset-y-0 left-0 w-12 border-r max-md:hidden"
            style={stripes("var(--color-border)", 5, -135)}
          />
          <div
            aria-hidden
            className="border-border absolute inset-y-0 right-0 w-12 border-l max-md:hidden"
            style={stripes("var(--color-border)", 5, 135)}
          />

          {/* Faint grid behind everything */}
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,.05)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.06)_1px,transparent_1px)]"
          />

          <div className="relative w-[min(720px,calc(100vw-3rem))]">
            {/* Heading: what we're loading + big percentage */}
            <div className="mb-6 flex items-end justify-between gap-4">
              <div className="min-w-0">
                <p className="text-muted-foreground font-mono text-[11px] tracking-[0.2em] uppercase">
                  {done ? "Ready" : "Loading"}
                </p>
                <p className="font-incognito line-clamp-2 text-lg leading-snug font-semibold md:text-2xl">
                  {done ? "Here we go!" : `AIRA is fetching the ${describe(to)}…`}
                </p>
              </div>
              <p className="font-incognito shrink-0 text-5xl leading-none font-bold tabular-nums md:text-6xl">
                {pct}
                <span className="text-muted-foreground text-2xl md:text-3xl">%</span>
              </p>
            </div>

            {/* Runway: AIRA runs along the top of the bar */}
            <div className="relative h-24 md:h-28">
              {/* Full-width lane that slides right; AIRA rides its right edge */}
              <div
                ref={laneRef}
                className="absolute inset-0 will-change-transform"
                style={{ transform: at(0) }}
              >
                <div className="absolute right-0 bottom-0 translate-x-1/2">
                  <RunningRobot done={done} />
                </div>
              </div>
            </div>

            {/* Track, framed like the project images */}
            <div className="relative">
              <div className="border-foreground/30 absolute -top-2 -left-2 h-5 w-5 border-t-2 border-l-2" />
              <div className="border-foreground/30 absolute -top-2 -right-2 h-5 w-5 border-t-2 border-r-2" />
              <div className="border-foreground/30 absolute -bottom-2 -left-2 h-5 w-5 border-b-2 border-l-2" />
              <div className="border-foreground/30 absolute -right-2 -bottom-2 h-5 w-5 border-r-2 border-b-2" />

              <div
                className="bg-background relative h-12 overflow-hidden border-2 md:h-14"
                style={stripes("var(--color-border)", 8, -135)}
              >
                {/* Filled part: bold stripes that keep marching */}
                <div
                  ref={fillRef}
                  className="absolute inset-0 will-change-transform"
                  style={{ transform: at(0) }}
                >
                  <div
                    className="aira-stripes-march bg-foreground/10 absolute inset-0"
                    style={stripes("var(--color-foreground)", 14, -135)}
                  />
                  {/* Bright leading edge */}
                  <div className="bg-foreground absolute inset-y-0 right-0 w-1 shadow-[0_0_14px_2px_var(--color-foreground)]" />
                </div>
              </div>
            </div>

            {/* Ruler */}
            <div className="relative mt-4 h-6" aria-hidden>
              {Array.from({ length: 21 }, (_, i) => i * 5).map((mark) => {
                const major = mark % 25 === 0;
                const reached = progress >= mark;
                return (
                  <div
                    key={mark}
                    className="absolute top-0 flex -translate-x-1/2 flex-col items-center"
                    style={{ left: `${mark}%` }}
                  >
                    <span
                      className={cn(
                        "w-px transition-colors",
                        major ? "h-2.5" : "h-1.5",
                        reached ? "bg-foreground" : "bg-border",
                      )}
                    />
                    {major && (
                      <span
                        className={cn(
                          "mt-1 font-mono text-[10px] transition-colors",
                          reached ? "text-foreground" : "text-muted-foreground",
                        )}
                      >
                        {mark}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * AIRA plus the dust it kicks up. Memoised so the progress readout re-rendering
 * every 100ms doesn't re-render the robot; the dust is plain CSS animation.
 */
const RunningRobot = memo(function RunningRobot({ done }: { done: boolean }) {
  return (
    <>
      {!done &&
        [0, 1, 2].map((i) => (
          <span
            key={i}
            aria-hidden
            className="aira-dust bg-muted-foreground/40 absolute bottom-1 left-3 size-2.5 rounded-full"
            style={{ animationDelay: `${i * 0.18}s` }}
          />
        ))}
      <RobotCharacter state={done ? "success" : "running"} className="size-24 md:size-28" />
    </>
  );
});

/** The diagonal stripe pattern used on the portfolio's side borders. */
function stripes(color: string, size: number, angle: number): React.CSSProperties {
  return {
    backgroundImage: `linear-gradient(${angle}deg, ${color} 25%, transparent 25%, transparent 50%, ${color} 50%, ${color} 75%, transparent 75%, transparent)`,
    backgroundSize: `${size}px ${size}px`,
  };
}
