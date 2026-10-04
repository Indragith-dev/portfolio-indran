"use client";

import { useState } from "react";
import SectionHeading from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { linkedinPosts, linkedinProfile, profile } from "@/config/portfolio-data";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Linkedin } from "lucide-react";
import { motion } from "motion/react";

type Post = (typeof linkedinPosts)[number];

const LinkedInPosts = () => {
  return (
    <SectionHeading id="linkedin" text="LinkedIn">
      <p className="text-muted-foreground px-4 pt-14 text-sm md:px-12 md:text-base">
        Recent posts and updates from LinkedIn.
      </p>

      <div className="grid items-start gap-6 px-4 py-8 md:grid-cols-2 md:px-12 xl:grid-cols-3">
        {linkedinPosts.map((post, i) => (
          <PostCard key={post.url} post={post} index={i} />
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
