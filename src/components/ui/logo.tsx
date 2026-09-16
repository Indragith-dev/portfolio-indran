"use client";

import { motion, type Variants, useAnimationControls } from "motion/react";
import { cn } from "@/lib/utils";
import { useMemo, useRef, useState, useCallback, useEffect } from "react";
import Link from "next/link";

interface SVGPathData {
  d: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

type AnimationProps = {
  className?: string;
  animationTime?: number;
  hover?: boolean;
  onAnimationEnd?: () => void;
  loop?: boolean | number;
  paths: SVGPathData[];
  initialAnimation?: boolean;
  viewBox?: string;
};

export function Animation({
  className = "w-16",
  animationTime = 4,
  hover = false,
  onAnimationEnd,
  loop = false,
  paths,
  initialAnimation = true,
  viewBox = "0 0 377 193",
}: AnimationProps) {
  hover = loop ? false : hover;
  const controls = useAnimationControls();
  const [isAnimating, setIsAnimating] = useState(false);
  const currentLoopRef = useRef(0);
  const animationCompleteCountRef = useRef(0);

  const total = paths?.length ?? 0;
  const perPath = total > 0 ? Math.max(0, animationTime) / total : 0;

  const totalLoops = useMemo(() => {
    if (loop === true) return Infinity;
    if (typeof loop === "number") return Math.max(1, Math.floor(loop));
    return 1;
  }, [loop]);

  const pathVariants: Variants = useMemo(
    () => ({
      hidden: {
        pathLength: 0,
        fillOpacity: 0,
        strokeWidth: 1,
      },
      visible: (i: number) => ({
        pathLength: 1,
        fillOpacity: 1,
        strokeWidth: 0,
        transition: {
          delay: perPath * i,
          duration: perPath || 0.001,
          ease: "easeInOut",
        },
      }),
    }),
    [perPath],
  );

  const startAnimation = useCallback(async () => {
    if (isAnimating) return;

    setIsAnimating(true);
    animationCompleteCountRef.current = 0;
    currentLoopRef.current = 0;

    const runCycle = async () => {
      await controls.start("visible");
      currentLoopRef.current++;

      // Check if we need to loop
      if (currentLoopRef.current < totalLoops) {
        // Reset for next loop
        await controls.start("hidden");
        animationCompleteCountRef.current = 0;
        await runCycle();
      } else {
        // Animation fully complete
        setIsAnimating(false);
        onAnimationEnd?.();
      }
    };

    // Start from hidden state
    await controls.start("hidden");
    await runCycle();
  }, [controls, isAnimating, totalLoops, onAnimationEnd]);

  useEffect(() => {
    if (initialAnimation) {
      startAnimation();
    } else {
      controls.set("visible");
    }
  }, []);

  const handleHover = () => {
    if (hover && !isAnimating) {
      startAnimation();
    }
  };

  return (
    <div className={cn(className)} onMouseEnter={handleHover}>
      <motion.svg width="100%" height="100%" viewBox={viewBox}>
        {paths.map((pathData, i) => (
          <motion.path
            key={i}
            d={pathData.d}
            fill={pathData.fill || "currentColor"}
            stroke={pathData.stroke || "currentColor"}
            strokeWidth={pathData.strokeWidth ?? 1}
            initial="hidden"
            animate={controls}
            variants={pathVariants}
            custom={i}
            onAnimationComplete={() => {
              animationCompleteCountRef.current++;
            }}
          />
        ))}
      </motion.svg>
    </div>
  );
}

export function Logo({
  href,
  ...props
}: Partial<AnimationProps & { href?: string }>) {
  const paths: SVGPathData[] = [
    {
      d: "M9.22 10.37L9.22 10.37Q9.67 10.04 9.94 10.10Q10.21 10.16 10.40 10.41Q10.59 10.66 10.94 11.06Q11.29 11.46 11.25 11.58Q11.21 11.70 10.92 12.19Q10.63 12.68 11.00 12.84Q11.37 13.01 11.90 13.18Q12.44 13.36 12.87 13.69Q13.30 14.02 13.45 14.27Q13.59 14.51 13.61 14.83Q13.63 15.16 13.63 15.64Q13.63 16.13 13.28 15.79Q12.93 15.45 11.95 15.04Q10.98 14.63 10.21 14.52Q9.45 14.41 9.13 14.79Q8.81 15.18 8.56 15.61Q8.32 16.04 7.71 17.78Q7.09 19.53 6.85 20.05Q6.60 20.57 5.21 24.83Q3.83 29.10 4.45 29.48Q5.08 29.86 5.55 30.14Q6.02 30.41 5.99 30.70Q5.96 31.00 5.77 31.27Q5.59 31.54 4.40 31.51Q3.22 31.48 1.78 31.46Q0.33 31.43-0.05 31.60Q-0.43 31.78-0.50 31.67Q-0.57 31.56-0.60 31.08Q-0.63 30.61-0.59 30.50Q-0.55 30.39-0.42 30.20Q-0.29 30-0.03 29.98Q0.23 29.96 1.23 29.51Q2.23 29.06 2.51 27.81Q2.79 26.56 3.54 23.96Q4.28 21.35 4.63 20.17Q4.98 18.98 5.92 16.46Q6.86 13.95 5.97 14.18Q5.08 14.41 5.20 15.84Q5.31 17.27 5 16.32Q4.69 15.37 4.74 14.63Q4.79 13.89 5.12 13.43Q5.45 12.97 5.89 12.77Q6.33 12.58 6.95 12.52Q7.58 12.46 7.91 12.03Q8.24 11.60 8.52 11.14Q8.79 10.68 9.22 10.37Z",
    },
    {
      d: "M11.80 21.95L11.80 21.95Q12.21 21.76 12.84 22.03Q13.48 22.30 13.12 23.05Q12.75 23.79 11.93 25.50Q11.11 27.21 11.77 26.44Q12.42 25.66 13.35 24.86Q14.28 24.06 14.69 23.83Q15.10 23.59 15.58 23.48Q16.05 23.36 16.66 23.54Q17.27 23.71 17.70 24.52Q18.13 25.33 18.15 27.20Q18.18 29.06 19.07 29.02Q19.96 28.98 20.80 28.37Q21.64 27.75 22.05 27.12Q22.46 26.48 22.40 26.78Q22.34 27.07 21.95 27.64Q21.56 28.20 20.29 29.39Q19.02 30.59 18.10 30.61Q17.17 30.63 16.75 29.86Q16.33 29.10 16.20 27.43Q16.07 25.76 15.76 25.73Q15.45 25.70 14.39 26.36Q13.34 27.01 12.46 28.07Q11.58 29.12 11.03 29.85Q10.47 30.59 10.02 30.74Q9.57 30.90 9.29 30.51Q9.00 30.12 9.09 29.55Q9.18 28.98 9.43 27.81Q9.69 26.64 10.16 25.34Q10.63 24.04 9.94 24.49Q9.26 24.94 8.27 25.85Q7.29 26.76 8.97 24.99Q10.66 23.22 10.85 22.93Q11.04 22.64 11.21 22.39Q11.39 22.15 11.80 21.95Z",
    },
    {
      // two sub-paths: the tall ascender stroke + the bowl loop
      d: "M26.54 10.59L26.54 10.59Q26.78 10.25 27.19 10.28Q27.60 10.31 27.95 10.63Q28.30 10.96 28.70 11.56Q29.10 12.17 29.40 13.99Q29.71 15.82 29.50 17.49Q29.30 19.16 29.17 19.61Q29.04 20.06 29.55 20.57Q30.06 21.07 30.03 21.50Q30 21.93 29.63 22.21Q29.26 22.48 28.91 22.38Q28.55 22.29 28.10 23.46Q27.64 24.63 26.97 25.75Q26.31 26.88 25.76 27.64Q25.21 28.40 24.27 29.23Q23.32 30.06 22.79 30.18Q22.27 30.29 21.88 30.17Q21.48 30.04 21.15 29.51Q20.82 28.98 20.79 27.54Q20.76 26.09 21.64 24.69Q22.52 23.28 24.80 22.22Q27.09 21.15 26.36 21.46Q25.63 21.76 20.86 22.24Q16.09 22.71 21.30 22.01Q26.50 21.31 27.02 20.78Q27.54 20.25 27.76 19.05Q27.99 17.85 28.01 16.82Q28.03 15.78 27.87 14.74Q27.71 13.69 26.94 12.63Q26.17 11.56 26.25 11.23Q26.33 10.90 26.54 10.59ZM25.23 23.98L25.23 23.98Q24.82 24.16 24.02 24.94Q23.22 25.72 22.93 26.40Q22.64 27.07 22.77 27.47Q22.91 27.87 23.96 26.80Q25 25.72 25.32 25.03Q25.64 24.34 25.65 24.07Q25.66 23.81 25.23 23.98Z",
    },
    {
      d: "M31.13 24.30L31.13 24.30Q31.84 21.58 32.49 21.64Q33.14 21.70 33.48 22.23Q33.81 22.75 33.41 23.53Q33.01 24.30 33.33 24.25Q33.65 24.20 34.18 23.86Q34.71 23.52 35.19 23.31Q35.66 23.11 35.96 23.05Q36.25 22.99 37.08 23.24Q37.91 23.50 38.65 23.96Q39.39 24.41 40.62 24.03Q41.84 23.65 40.35 24.29Q38.87 24.92 37.31 24.88Q35.76 24.84 34.91 25.25Q34.06 25.66 33.48 26.16Q32.89 26.66 32.39 27.80Q31.89 28.95 31.63 29.73Q31.37 30.51 31.16 31.01Q30.96 31.50 30.32 31.53Q29.69 31.56 29.48 31.07Q29.28 30.59 29.38 30.44Q29.49 30.29 29.97 28.65Q30.45 27.01 31.13 24.30Z",
    },
    {
      d: "M45.21 21.66L45.21 21.66Q45.66 21.54 46.20 21.62Q46.74 21.70 47.06 21.95Q47.38 22.21 47.68 22.95Q47.97 23.69 47.41 23.95Q46.86 24.20 46.41 23.77Q45.96 23.34 45.47 23.59Q44.98 23.85 44.50 24.11Q44.02 24.38 43.32 24.94Q42.62 25.51 41.88 26.39Q41.13 27.27 41.05 27.51Q40.98 27.75 41.44 27.44Q41.89 27.13 42.84 26.49Q43.79 25.86 45.22 25.20Q46.66 24.53 47.04 24.68Q47.42 24.82 47.70 25.21Q47.97 25.61 48.01 25.89Q48.05 26.17 47.92 26.34Q47.79 26.50 47.63 27.09Q47.46 27.68 47.66 28.22Q47.85 28.77 48.15 28.97Q48.46 29.18 48.98 29.09Q49.51 29.00 50.28 28.29Q51.05 27.58 50.21 28.62Q49.38 29.67 48.89 29.95Q48.40 30.23 48.13 30.22Q47.85 30.21 47.41 30.05Q46.97 29.88 46.58 29.53Q46.19 29.18 45.97 28.67Q45.74 28.16 45.66 27.92Q45.59 27.68 45.30 27.38Q45.02 27.09 44.61 27.26Q44.20 27.42 43.17 28.16Q42.15 28.91 41.26 29.38Q40.37 29.86 39.67 30.05Q38.96 30.23 38.76 30.18Q38.55 30.12 38.31 29.74Q38.07 29.36 38.03 28.91Q37.99 28.46 38.15 28.00Q38.32 27.54 39.40 26.16Q40.49 24.79 41.49 23.91Q42.50 23.03 43.63 22.41Q44.77 21.80 45.21 21.66Z",
    },
    {
      d: "M52.87 21.95L52.87 21.95Q53.28 21.76 53.92 22.03Q54.55 22.30 54.19 23.05Q53.83 23.79 53.01 25.50Q52.19 27.21 52.84 26.44Q53.50 25.66 54.42 24.86Q55.35 24.06 55.76 23.83Q56.17 23.59 56.65 23.48Q57.13 23.36 57.73 23.54Q58.34 23.71 58.77 24.52Q59.20 25.33 59.23 27.20Q59.26 29.06 60.15 29.02Q61.04 28.98 61.88 28.37Q62.71 27.75 63.13 27.12Q63.54 26.48 63.48 26.78Q63.42 27.07 63.03 27.64Q62.64 28.20 61.37 29.39Q60.10 30.59 59.17 30.61Q58.24 30.63 57.82 29.86Q57.40 29.10 57.28 27.43Q57.15 25.76 56.84 25.73Q56.52 25.70 55.47 26.36Q54.41 27.01 53.54 28.07Q52.66 29.12 52.10 29.85Q51.54 30.59 51.09 30.74Q50.64 30.90 50.36 30.51Q50.08 30.12 50.17 29.55Q50.25 28.98 50.51 27.81Q50.76 26.64 51.23 25.34Q51.70 24.04 51.02 24.49Q50.33 24.94 49.35 25.85Q48.36 26.76 50.05 24.99Q51.74 23.22 51.92 22.93Q52.11 22.64 52.29 22.39Q52.46 22.15 52.87 21.95Z",
    },
  ];

  return href ? (
    <Link href={href}>
      <Animation {...props} paths={paths} />
    </Link>
  ) : (
    <Animation {...props} paths={paths} />
  );
}
