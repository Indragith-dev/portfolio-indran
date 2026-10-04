"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import SectionHeading from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { linkedinPosts, linkedinProfile, profile } from "@/config/portfolio-data";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ChevronLeft, ChevronRight, Linkedin } from "lucide-react";
import { motion } from "motion/react";

type Post = (typeof linkedinPosts)[number];

/** Gap between cards in px; matches gap-6 on the row. */
const GAP = 24;

const LinkedInPosts = () => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateArrows = useCallback(() => {
    const row = rowRef.current;
    if (!row) return;
    setCanPrev(row.scrollLeft > 4);
    setCanNext(row.scrollLeft + row.clientWidth < row.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    updateArrows();
    row.addEventListener("scroll", updateArrows, { passive: true });
    const ro = new ResizeObserver(updateArrows);
    ro.observe(row);
    return () => {
      row.removeEventListener("scroll", updateArrows);
      ro.disconnect();
    };
  }, [updateArrows]);

  /** Moves the row by one card. */
  const slide = (dir: 1 | -1) => {
    const row = rowRef.current;
    const card = row?.firstElementChild as HTMLElement | null;
    if (!row || !card) return;
    row.scrollBy({ left: dir * (card.offsetWidth + GAP), behavior: "smooth" });
  };

  return (
    <SectionHeading id="linkedin" text="LinkedIn">
      <div className="flex items-center justify-between gap-4 px-4 pt-14 md:px-12">
        <p className="text-muted-foreground text-sm md:text-base">
          Recent posts and updates from LinkedIn.
        </p>
        <div className="flex shrink-0 gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => slide(-1)}
            disabled={!canPrev}
            aria-label="Previous posts"
            className="border-2"
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => slide(1)}
            disabled={!canNext}
            aria-label="Next posts"
            className="border-2"
          >
            <ChevronRight />
          </Button>
        </div>
      </div>

      {/* 3 cards at a time on desktop, 2 on tablets, 1 on phones */}
      <div
        ref={rowRef}
        className="no-scrollbar flex snap-x snap-mandatory scroll-px-4 items-start gap-6 overflow-x-auto scroll-smooth px-4 py-8 md:scroll-px-12 md:px-12"
      >
        {linkedinPosts.map((post, i) => (
          <div
            key={post.url}
            className="w-full shrink-0 snap-start md:w-[calc((100%-1.5rem)/2)] xl:w-[calc((100%-3rem)/3)]"
          >
            <PostCard post={post} index={i} />
          </div>
        ))}
      </div>

      <div className="border-t py-8 text-center">
        <Button asChild variant="ghost" size="lg" className="group font-mono">
          <a href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer">
            <span className="bg-foreground/40 mr-2 inline-block h-px w-8 transition-all group-hover:w-12" />
            FOLLOW ON LINKEDIN
            <span className="bg-foreground/40 ml-2 inline-block h-px w-8 transition-all group-hover:w-12" />
          </a>
        </Button>
      </div>
    </SectionHeading>
  );
};

/** A LinkedIn post drawn with the site's theme instead of LinkedIn's white embed. */
function PostCard({ post, index }: { post: Post; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-card text-card-foreground flex flex-col overflow-hidden rounded-lg border-2"
    >
      {/* Author */}
      <header className="flex items-center gap-3 p-4">
        <img
          src={profile.avatar}
          alt=""
          className="size-11 shrink-0 rounded-full border object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{profile.name}</p>
          <p className="text-muted-foreground truncate text-xs">
            {linkedinProfile.headline}
          </p>
          <p className="text-muted-foreground font-mono text-[11px]">{post.date}</p>
        </div>
        <Linkedin className="size-5 shrink-0 text-[#0A66C2] dark:text-[#70B5F9]" />
      </header>

      {/* Text: collapsed to a few lines, like LinkedIn's "see more" */}
      <div className="px-4 pb-3 text-sm leading-relaxed">
        <p className={cn("whitespace-pre-line", !expanded && "line-clamp-5")}>
          {post.text}
        </p>
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="text-muted-foreground hover:text-foreground mt-1 text-xs font-medium"
          aria-expanded={expanded}
        >
          {expanded ? "Show less" : "…see more"}
        </button>
        <p className="mt-2 flex flex-wrap gap-x-2 text-xs text-[#0A66C2] dark:text-[#70B5F9]">
          {post.tags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </p>
      </div>

      {/* Photo */}
      <div className="bg-muted relative aspect-[4/5] overflow-hidden border-y-2">
        <img
          src={post.image}
          alt={post.imageAlt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
        />
      </div>

      <a
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-foreground group flex items-center justify-between px-4 py-3 font-mono text-xs transition-colors"
      >
        <span className="inline-flex items-center gap-2">
          <Linkedin className="size-3.5" />
          Read on LinkedIn
        </span>
        <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </a>
    </motion.article>
  );
}

export default LinkedInPosts;
