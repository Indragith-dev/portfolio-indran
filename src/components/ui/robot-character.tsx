"use client";

import { AnimatePresence, motion, type Transition } from "motion/react";
import { cn } from "@/lib/utils";

export type RobotState =
  | "idle"
  | "greeting"
  | "thinking"
  | "talking"
  | "success"
  | "walking";

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

/** The dark display on the head, where the face is drawn. */
const SCREEN = { left: "33%", top: "29.4%", width: "36.6%", height: "23.4%" };

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
          <div className="absolute" style={SCREEN}>
            <Face state={state} />
          </div>
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

const EYE = "#ffffff";
const centered = { transformBox: "fill-box", transformOrigin: "center" } as const;

/** Expressions drawn on the robot's display, in a 100 x 60 box. */
function Face({ state }: { state: RobotState }) {
  const expression =
    state === "greeting" || state === "success"
      ? "happy"
      : state === "walking"
        ? "idle"
        : state;

  return (
    <svg
      viewBox="0 0 100 60"
      className="size-full overflow-visible"
      style={{ filter: `drop-shadow(0 0 3px ${EYE})` }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.g
          key={expression}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {expression === "idle" && <IdleEyes />}
          {expression === "happy" && <HappyEyes />}
          {expression === "thinking" && <ThinkingDots />}
          {expression === "talking" && <TalkingFace />}
        </motion.g>
      </AnimatePresence>
    </svg>
  );
}

function IdleEyes() {
  return (
    // Look right, blink, look left, blink.
    <motion.g
      animate={{ x: [0, 5, 5, 0, 0, -5, -5, 0, 0] }}
      transition={loop(7, { times: [0, 0.1, 0.3, 0.4, 0.55, 0.65, 0.85, 0.95, 1] })}
    >
      {[26, 62].map((x) => (
        <motion.rect
          key={x}
          x={x}
          y={18}
          width={12}
          height={24}
          rx={6}
          fill={EYE}
          style={centered}
          animate={{ scaleY: [1, 1, 0.1, 1, 1, 0.1, 1] }}
          transition={loop(7, { times: [0, 0.4, 0.45, 0.5, 0.92, 0.96, 1] })}
        />
      ))}
    </motion.g>
  );
}

function HappyEyes() {
  return (
    <motion.g
      initial={{ y: 4 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 12 }}
    >
      {[22, 58].map((x) => (
        <path
          key={x}
          d={`M ${x} 36 Q ${x + 10} 16 ${x + 20} 36`}
          fill="none"
          stroke={EYE}
          strokeWidth={6}
          strokeLinecap="round"
        />
      ))}
    </motion.g>
  );
}

function ThinkingDots() {
  return (
    <g>
      {[32, 50, 68].map((cx, i) => (
        <motion.circle
          key={cx}
          cx={cx}
          cy={32}
          r={5}
          fill={EYE}
          animate={{ y: [0, -7, 0], opacity: [0.4, 1, 0.4] }}
          transition={loop(0.9, { delay: i * 0.15 })}
        />
      ))}
    </g>
  );
}

function TalkingFace() {
  return (
    <g>
      {[28, 62].map((x) => (
        <rect key={x} x={x} y={12} width={10} height={18} rx={5} fill={EYE} />
      ))}
      <motion.rect
        x={38}
        y={40}
        width={24}
        height={10}
        rx={5}
        fill={EYE}
        style={centered}
        animate={{ scaleY: [0.3, 1, 0.5, 0.9, 0.3] }}
        transition={loop(0.6)}
      />
    </g>
  );
}
