"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type Transition } from "motion/react";
import { cn } from "@/lib/utils";
import { Eyes } from "@/components/ui/robot-eyes";

export type RobotState =
  | "idle"
  | "greeting"
  | "thinking"
  | "talking"
  | "success"
  | "surprised"
  | "walking"
  | "sad";

const SRC = "/robot-2d.webp";

/**
 * The robot is one image cut into layers with clip-path, so each part can move
 * on its own while keeping the original artwork. Regions are in % of the
 * 1024px source and were measured from its alpha channel; update them if the
 * image changes. Insets are top, right, bottom, left.
 */
const PARTS = {
  head: { clip: "inset(21.5% 21.5% 41.6% 21.5%)", origin: "50.5% 58%" },
  body: { clip: "inset(57.5% 37.5% 29.7% 40.6%)", origin: "50% 70%" },
  leftArm: { clip: "inset(58.4% 59.4% 29.7% 32%)", origin: "40.6% 59.5%" },
  rightArm: { clip: "inset(58.4% 31.4% 29.7% 62.5%)", origin: "64% 59.5%" },
  leftLeg: { clip: "inset(70.3% 50% 20% 37%)", origin: "43% 70.3%" },
  rightLeg: { clip: "inset(70.3% 36.5% 20% 50%)", origin: "58% 70.3%" },
} as const;

/**
 * The dark display on the head, where the face is drawn. Same geometry as the
 * screen in components/ui/robot.tsx (centre 51.35% / 40.95%, 36% wide,
 * 446:278), so both robots look alike.
 */
const SCREEN = { left: "33.35%", top: "29.73%", width: "36%", height: "22.44%" };

const loop = (duration: number, extra: Transition = {}): Transition => ({
  duration,
  repeat: Infinity,
  ease: "easeInOut",
  ...extra,
});

type Pose = {
  animate: Record<string, number | string | number[] | string[]>;
  transition: Transition;
};

const STILL: Pose = { animate: { rotate: 0 }, transition: { duration: 0.3 } };

const POSES: Record<
  RobotState,
  {
    whole: Pose;
    head: Pose;
    leftArm: Pose;
    rightArm: Pose;
    legs?: { left: Pose; right: Pose };
  }
> = {
  idle: {
    whole: { animate: { y: ["0%", "-3%", "0%"] }, transition: loop(2.6) },
    head: { animate: { rotate: [0, 2, 0, -2, 0] }, transition: loop(6) },
    leftArm: { animate: { rotate: [0, 4, 0] }, transition: loop(2.6) },
    rightArm: { animate: { rotate: [0, -4, 0] }, transition: loop(2.6) },
  },
  greeting: {
    whole: { animate: { y: ["0%", "-6%", "0%"] }, transition: loop(0.9) },
    head: { animate: { rotate: [0, -6, 0] }, transition: loop(1.8) },
    leftArm: { animate: { rotate: 0 }, transition: { duration: 0.3 } },
    // Wave: raise the arm overhead from the shoulder, swing it, lower it.
    rightArm: {
      animate: { rotate: [0, -135, -100, -135, -100, -135, 0] },
      transition: loop(2.2, { times: [0, 0.2, 0.35, 0.5, 0.65, 0.8, 1] }),
    },
  },
  thinking: {
    whole: { animate: { y: "0%" }, transition: { duration: 0.4 } },
    head: { animate: { rotate: [-9, -6, -9] }, transition: loop(1.6) },
    // Hand to "chin".
    leftArm: { animate: { rotate: [-28, -24, -28] }, transition: loop(1.6) },
    rightArm: { animate: { rotate: 0 }, transition: { duration: 0.3 } },
  },
  talking: {
    whole: { animate: { y: ["0%", "-2%", "0%"] }, transition: loop(0.7) },
    head: { animate: { rotate: [0, 3, 0, -3, 0] }, transition: loop(1.4) },
    leftArm: { animate: { rotate: [0, 14, 0] }, transition: loop(1.1) },
    rightArm: { animate: { rotate: [0, -10, 0] }, transition: loop(1.3, { delay: 0.3 }) },
  },
  walking: {
    whole: { animate: { y: ["0%", "-4%", "0%"] }, transition: loop(0.3) },
    head: { animate: { rotate: [-3, 3, -3] }, transition: loop(0.6) },
    leftArm: { animate: { rotate: [14, -14, 14] }, transition: loop(0.6) },
    rightArm: { animate: { rotate: [-14, 14, -14] }, transition: loop(0.6) },
    legs: {
      left: { animate: { rotate: [-16, 16, -16] }, transition: loop(0.6) },
      right: { animate: { rotate: [16, -16, 16] }, transition: loop(0.6) },
    },
  },
  // Sad to go: slumped, slow shuffle, head drooping, arms hanging.
  sad: {
    whole: { animate: { y: ["2%", "0%", "2%"] }, transition: loop(0.5) },
    head: { animate: { rotate: [7, 10, 7] }, transition: loop(1.4) },
    leftArm: { animate: { rotate: [-3, 3, -3] }, transition: loop(1) },
    rightArm: { animate: { rotate: [3, -3, 3] }, transition: loop(1) },
    legs: {
      left: { animate: { rotate: [-8, 8, -8] }, transition: loop(1) },
      right: { animate: { rotate: [8, -8, 8] }, transition: loop(1) },
    },
  },
  surprised: {
    whole: {
      animate: { y: ["0%", "-8%", "0%"] },
      transition: { duration: 0.4, ease: "easeOut" },
    },
    head: { animate: { rotate: [0, 5, 0] }, transition: { duration: 0.4 } },
    leftArm: { animate: { rotate: 22 }, transition: { duration: 0.2 } },
    rightArm: { animate: { rotate: -22 }, transition: { duration: 0.2 } },
  },
  success: {
    whole: {
      animate: { y: ["0%", "-12%", "0%", "-6%", "0%"] },
      transition: { duration: 0.9, ease: "easeOut" },
    },
    head: { animate: { rotate: 0 }, transition: { duration: 0.3 } },
    leftArm: { animate: { rotate: [0, 45, 30] }, transition: { duration: 0.6 } },
    rightArm: { animate: { rotate: [0, -45, -30] }, transition: { duration: 0.6 } },
  },
};

/**
 * Animated AIRA robot built from public/robot-2d.webp.
 * The box is sized by `className`; the robot fills it edge to edge, and arms
 * may swing slightly outside it.
 */
export function RobotCharacter({
  state = "idle",
  className,
}: {
  state?: RobotState;
  className?: string;
}) {
  const pose = POSES[state];

  return (
    <div aria-hidden className={cn("pointer-events-none relative aspect-square", className)}>
      {/* The source has wide transparent margins; enlarge it so the robot fills the box. */}
      <motion.div
        className="absolute -inset-[38%]"
        animate={pose.whole.animate}
        transition={pose.whole.transition}
      >
        <Part {...PARTS.leftLeg} pose={pose.legs?.left ?? STILL} />
        <Part {...PARTS.rightLeg} pose={pose.legs?.right ?? STILL} />
        <Part {...PARTS.body} />
        <Part {...PARTS.leftArm} pose={pose.leftArm} />
        <Part {...PARTS.head} pose={pose.head}>
          <Screen state={state} />
        </Part>
        {/* Above the head so the waving hand stays visible. */}
        <Part {...PARTS.rightArm} pose={pose.rightArm} />
      </motion.div>
    </div>
  );
}

function Part({
  clip,
  origin,
  pose,
  children,
}: {
  clip: string;
  origin: string;
  pose?: Pose;
  children?: React.ReactNode;
}) {
  return (
    <motion.div
      className="absolute inset-0"
      style={{ transformOrigin: origin }}
      animate={pose?.animate}
      transition={pose?.transition}
    >
      <img
        src={SRC}
        alt=""
        draggable={false}
        className="size-full select-none"
        style={{ clipPath: clip }}
      />
      {children}
    </motion.div>
  );
}

/** Eyes and glow from the site's shared robot eyes component. */
const EYES = {
  size: "lg",
  eyeColor: "#fff",
  glow: { level: 2, color: "#fff", animated: true },
} as const;

/** Faint film grain so the display reads as a lit screen, not a black hole. */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.14 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/**
 * Size of the face as designed (matches the other robot's screen at full
 * size); it is scaled to whatever size the screen actually renders at.
 */
const FACE_W = 132;
const FACE_H = 82;

/** The robot's display: grainy dark screen with an expression for each state. */
function Screen({ state }: { state: RobotState }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) =>
      setScale(entry.contentRect.width / FACE_W),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="absolute flex items-center justify-center overflow-hidden rounded-[12%/18%] bg-[#1a1a1a]"
      style={{ ...SCREEN, backgroundImage: GRAIN, backgroundSize: "35% auto" }}
    >
      <div
        className="flex shrink-0 items-center justify-center"
        style={{ width: FACE_W, height: FACE_H, transform: `scale(${scale})` }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={state}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.15 }}
            className="flex flex-col items-center justify-center"
          >
            <Expression state={state} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Expression({ state }: { state: RobotState }) {
  switch (state) {
    case "greeting":
    case "success":
      // Happy, slightly bouncing eyes.
      return (
        <motion.div animate={{ y: [0, -3, 0] }} transition={loop(0.6)}>
          <Eyes {...EYES} shape="happy" />
        </motion.div>
      );

    case "surprised":
      return <Eyes {...EYES} shape="surprised" />;

    case "thinking":
      // Squinting up and to the side, with dots ticking away below.
      return (
        <>
          <motion.div
            animate={{ x: [4, 7, 4], y: -6 }}
            transition={{ x: loop(1.6), y: { duration: 0.3 } }}
          >
            <Eyes {...EYES} shape="sleepy" />
          </motion.div>
          <div className="mt-2 flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="size-1.5 rounded-full bg-white shadow-[0_0_4px_#fff]"
                animate={{ opacity: [0.25, 1, 0.25] }}
                transition={loop(0.9, { delay: i * 0.2 })}
              />
            ))}
          </div>
        </>
      );

    case "talking":
      // Eyes plus a mouth that moves while the reply streams in.
      return (
        <>
          <Eyes {...EYES} lookAround={{ enabled: true, duration: 4 }} />
          <motion.span
            className="mt-2.5 h-2 w-6 rounded-full bg-white shadow-[0_0_6px_#fff]"
            animate={{ scaleY: [0.3, 1, 0.5, 0.9, 0.3], scaleX: [1, 0.8, 1, 0.85, 1] }}
            transition={loop(0.6)}
          />
        </>
      );

    case "sad":
      // Droopy eyes looking down, a tear and a little frown.
      return (
        <motion.div
          className="relative flex flex-col items-center"
          initial={{ y: 0 }}
          animate={{ y: 5 }}
          transition={{ duration: 0.3 }}
        >
          <Eyes {...EYES} shape="sleepy" />
          <motion.span
            className="absolute top-3 left-1 h-2.5 w-1.5 rounded-b-full rounded-t-[40%] bg-sky-200 shadow-[0_0_4px_#bae6fd]"
            animate={{ y: [0, 14], opacity: [0, 1, 0] }}
            transition={loop(1.1, { ease: "easeIn" })}
          />
          <svg viewBox="0 0 24 10" className="mt-2 h-2.5 w-6 overflow-visible">
            <path
              d="M3 8 Q12 0 21 8"
              fill="none"
              stroke="#fff"
              strokeWidth={2.5}
              strokeLinecap="round"
              style={{ filter: "drop-shadow(0 0 2px #fff)" }}
            />
          </svg>
        </motion.div>
      );

    case "walking":
      // Focused on where it's going.
      return <Eyes {...EYES} classes={{ container: "translate-x-1.5" }} />;

    default:
      // Idle: look around and blink, like the site's other robot.
      return <Eyes {...EYES} lookAround={{ enabled: true, duration: 6 }} />;
  }
}
