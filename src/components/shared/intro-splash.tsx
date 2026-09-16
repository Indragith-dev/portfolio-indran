"use client";
import { motion } from "motion/react";
import { useCallback, useState } from "react";
import BackgroundAnimation from "@/components/ui/background-gradient";
import { Logo } from "../ui/logo";
import { useTheme } from "next-themes";

export const IntroSplash = () => {
  const { resolvedTheme } = useTheme();
  const [daisyLoaded, setDaisyLoaded] = useState(false);
  const [logoDrawn, setLogoDrawn] = useState(false);
  const daisyRef = useCallback((node: HTMLImageElement | null) => {
    if (node?.complete) setDaisyLoaded(true);
  }, []);
  const daisyReady = daisyLoaded && logoDrawn;

  return (
    <motion.div
      className="relative top-0 z-20 size-full snap-start overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <BackgroundAnimation
        color={resolvedTheme === "light" ? "blue" : "ember"}
      />

      <motion.div
        className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-end gap-3 text-white"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
      >
        <Logo
          className="w-40 sm:w-48 md:w-64 @max-md:w-24"
          onAnimationEnd={() => setLogoDrawn(true)}
        />

        <motion.img
          ref={daisyRef}
          src="/daisy-indran.png"
          alt=""
          onLoad={() => setDaisyLoaded(true)}
          initial={{ opacity: 0, y: 14, rotate: 0 }}
          animate={
            daisyReady
              ? { opacity: 1, y: 14, rotate: 720 }
              : { opacity: 0, y: 14, rotate: 0 }
          }
          transition={{
            opacity: { duration: 0.4, ease: "easeOut" },
            rotate: { duration: 1.6, ease: "easeOut" },
          }}
          className="w-16 self-end sm:w-20 md:w-24"
        />
      </motion.div>

      <motion.div className="pointer-events-none absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center justify-center gap-2 font-semibold text-white @max-md:hidden">
        Scroll down
        <motion.div className="flex h-10 w-7 justify-center rounded-lg border-2 border-white/40 bg-white/20 backdrop-blur-2xl">
          <motion.div
            className="mx-auto w-1 rounded-xl bg-white/80 backdrop-blur-2xl @max-sm:w-0.5"
            animate={{
              y: [4, 12, 4],
              height: [4, 8, 4],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
