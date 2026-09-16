"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Robot } from "@/components/ui/robot";
import { Eyes } from "@/components/ui/robot-eyes";
import SpeechBubble from "@/components/ui/speech-bubble";
import { X, MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useLocalStorage } from "@uidotdev/usehooks";
import dynamic from "next/dynamic";

const FloatingAvatar = () => {
  const pathname = usePathname();
  const [hasScrolledPast, setHasScrolledPast] = useState(false);
  const [isMinimized, setIsMinimized] = useLocalStorage(
    "floating_avatar_minimized",
    false,
  );

  useEffect(() => {
    if (!pathname.startsWith("/portfolio")) {
      setHasScrolledPast(false);
      return;
    }
    const el = document.querySelector(".portfolio-container");
    const handleScroll = () => {
      const scrolled = el?.scrollTop ?? 0;

      if (!hasScrolledPast) {
        setHasScrolledPast(scrolled > window.innerHeight * 2);
      }
    };

    el?.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => el?.removeEventListener("scroll", handleScroll);
  }, [pathname, hasScrolledPast]);

  const isVisible = pathname.startsWith("/portfolio") && hasScrolledPast;

  const handleMinimize = () => setIsMinimized(true);
  const handleExpand = () => setIsMinimized(false);

  if (!isVisible) return null;

  return (
    <AnimatePresence mode="wait">
      {isMinimized ? (
        <motion.button
          key="peek"
          onClick={handleExpand}
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -80, opacity: 0 }}
          whileHover={{ x: 20 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="fixed bottom-36 left-0 z-50 flex h-16 w-12 -translate-x-5 items-center justify-center rounded-r-2xl border border-white/20 bg-[#1a1a1a] shadow-[0_0_24px_rgba(255,255,255,0.15)] sm:h-20 sm:w-14 sm:-translate-x-6"
          aria-label="Open chat"
        >
          <Eyes
            size="sm"
            eyeColor="#fff"
            lookAround={{
              enabled: true,
              duration: 6,
            }}
            glow={{
              level: 2,
              color: "#fff",
              animated: true,
            }}
          />
        </motion.button>
      ) : (
        <motion.div
          key="full"
          className="fixed bottom-36 -left-40 z-50 sm:-left-46 md:-left-58"
        >
          <div className="relative flex items-end gap-4">
            {/* Robot  */}
            <motion.div
              initial={{ x: -20, rotate: 0 }}
              animate={{
                x: 0,
                rotate: 32,
              }}
              exit={{
                x: -20,
                rotate: 0,
              }}
              transition={{
                x: {
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                  duration: 0.8,
                },
              }}
              className="relative z-10 origin-bottom-left"
            >
              <Robot className="w-64 sm:w-72 md:w-92">
                <div className="flex h-full w-full items-center justify-center bg-[#1a1a1a]">
                  <Eyes
                    size="lg"
                    eyeColor="#fff"
                    lookAround={{
                      enabled: true,
                      duration: 6,
                    }}
                    glow={{
                      level: 2,
                      color: "#fff",
                      animated: true,
                    }}
                  />
                </div>
              </Robot>
            </motion.div>

            {/* Speech Bubble  */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{
                delay: 0.5,
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              className="absolute top-20 left-58 z-20 sm:top-28 sm:left-64 md:top-36 md:left-80"
            >
              <SpeechBubble
                direction="left"
                borderColor={"#000000"}
                bg={"#fff"}
                textColor={"#000000"}
                className="max-w-[280px] min-w-[240px]"
              >
                <p className="mb-4 text-sm leading-relaxed font-bold">
                  Psst... Would you like to chat personally?
                </p>

                <div className="flex gap-2">
                  <a
                    href={siteConfig.whatsapp}
                    target="_blank"
                    rel="noopener,noreferrer"
                    className="group flex h-8 flex-1 items-center justify-center gap-2 bg-[#25D366] font-bold text-white"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-xs uppercase">Chat</span>
                  </a>

                  <motion.button
                    onClick={handleMinimize}
                    whileTap={{ scale: 0.95 }}
                    className="flex size-8 items-center justify-center bg-red-500 p-2 font-bold text-white transition-all hover:bg-red-600"
                    aria-label="Close"
                  >
                    <X className="size-8" />
                  </motion.button>
                </div>
              </SpeechBubble>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default dynamic(() => Promise.resolve(FloatingAvatar), {
  ssr: false,
});
