"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import HeadingLine from "@/components/ui/heading-line";
import { Logo } from "@/components/ui/logo";
import { BackgroundNoise } from "@/components/shared/backgrounds";
import { profile, tagColors, type Project } from "@/config/portfolio-data";
import { cn } from "@/lib/utils";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

/** Full page for one work project, linked from the Projects section. */
export default function ProjectDetail({
  project,
  prev,
  next,
}: {
  project: Project;
  prev: Project;
  next: Project;
}) {
  return (
    <div className="relative min-h-screen">
      <BackgroundNoise className="z-50" />

      {/* Same striped side borders as the portfolio page */}
      <main className="before:border-border after:border-border relative z-10 min-h-screen before:absolute before:top-0 before:left-0 before:h-full before:w-12 before:border-r before:bg-[linear-gradient(-135deg,_var(--color-border)_25%,_transparent_25%,_transparent_50%,_var(--color-border)_50%,_var(--color-border)_75%,_transparent_75%,_transparent)] before:bg-[length:5px_5px] after:absolute after:top-0 after:right-0 after:h-full after:w-12 after:border-l after:bg-[linear-gradient(135deg,_var(--color-border)_25%,_transparent_25%,_transparent_50%,_var(--color-border)_50%,_var(--color-border)_75%,_transparent_75%,_transparent)] after:bg-[length:5px_5px] max-md:before:hidden max-md:after:hidden md:px-12">
        {/* Top bar */}
        <nav className="flex items-center justify-between border-b px-4 py-2.5 md:px-8">
          <Link href="/portfolio" aria-label="Back to portfolio">
            <Logo className="w-14" hover />
          </Link>
          <Button asChild variant="outline" size="sm" className="group border-2 font-mono text-xs">
            <Link href="/portfolio#projects">
              <ArrowLeft className="transition-transform group-hover:-translate-x-0.5" />
              All projects
            </Link>
          </Button>
        </nav>

        <div className="md:px-8">
          <div className="md:border-r md:border-l">
            {/* Header */}
            <motion.header
              {...fadeUp}
              transition={{ duration: 0.5 }}
              className="border-b px-4 py-12 md:px-12 md:py-16"
            >
              <div className="mb-6 flex flex-wrap items-center gap-3 font-mono text-xs">
                {project.company && (
                  <>
                    <span className="text-muted-foreground uppercase">{project.company}</span>
                    <div className="bg-border h-4 w-px" />
                  </>
                )}
                {project.date && (
                  <>
                    <time className="text-muted-foreground">{project.date}</time>
                    <div className="bg-border h-4 w-px" />
                  </>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className={cn(
                      "h-2 w-2 animate-pulse rounded-full",
                      project.status === "completed" ? "bg-green-500" : "bg-yellow-500",
                    )}
                  />
                  <span className="text-muted-foreground uppercase">{project.status}</span>
                </span>
              </div>

              <h1 className="font-incognito max-w-4xl text-4xl font-bold md:text-5xl">
                {project.title}
              </h1>
              <HeadingLine className="mt-4" />

              <p className="text-muted-foreground mt-6 max-w-3xl text-base leading-relaxed md:text-lg">
                {project.summary}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className={cn("border font-mono text-xs", tagColors[tag])}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </motion.header>

            {/* Cover */}
            <div className="bg-muted/20 relative border-b p-6 md:p-12">
              <div className="relative mx-auto max-w-4xl">
                <div className="border-foreground/20 absolute -top-2 -left-2 h-8 w-8 border-t-2 border-l-2" />
                <div className="border-foreground/20 absolute -top-2 -right-2 h-8 w-8 border-t-2 border-r-2" />
                <div className="border-foreground/20 absolute -bottom-2 -left-2 h-8 w-8 border-b-2 border-l-2" />
                <div className="border-foreground/20 absolute -right-2 -bottom-2 h-8 w-8 border-r-2 border-b-2" />
                <img
                  src={project.image}
                  alt={`${project.title} cover`}
                  className="bg-background aspect-video w-full border-2 object-cover"
                />
              </div>
            </div>

            {/* Body */}
            <div className="grid lg:grid-cols-3">
              <div className="space-y-12 px-4 py-12 md:px-12 lg:col-span-2 lg:border-r">
                <Block title="Overview">
                  <p className="text-muted-foreground leading-relaxed">{project.overview}</p>
                </Block>

                <Block title="My role">
                  <p className="text-muted-foreground leading-relaxed">{project.role}</p>
                </Block>

                <Block title="Key highlights">
                  <ul className="space-y-3">
                    {project.highlights.map((item, i) => (
                      <motion.li
                        key={item}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
                        className="flex gap-3"
                      >
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-500" />
                        <span className="text-muted-foreground leading-relaxed">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </Block>

                {project.gallery && project.gallery.length > 0 && (
                  <Block title="Gallery">
                    <div className="grid gap-6 sm:grid-cols-2">
                      {project.gallery.map((photo) => (
                        <figure key={photo.src} className="overflow-hidden rounded-lg border-2">
                          <img
                            src={photo.src}
                            alt={photo.caption}
                            loading="lazy"
                            className="aspect-[4/5] w-full object-cover"
                          />
                          <figcaption className="text-muted-foreground border-t-2 px-4 py-3 text-xs">
                            {photo.caption}
                          </figcaption>
                        </figure>
                      ))}
                    </div>
                  </Block>
                )}
              </div>

              {/* Sidebar */}
              <aside className="space-y-8 border-t px-4 py-12 md:px-12 lg:border-t-0 lg:px-8">
                <Block title="Tech stack">
                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="bg-muted/30 rounded-md border px-2.5 py-1 font-mono text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </Block>

                <Block title="Details">
                  <dl className="divide-y rounded-lg border text-sm">
                    {project.company && <Detail label="Company" value={project.company} />}
                    {project.date && <Detail label="Year" value={project.date} />}
                    <Detail label="Status" value={project.status} />
                  </dl>
                </Block>

                <div className="bg-muted/20 flex gap-3 rounded-lg border-2 border-dashed p-4 text-sm">
                  <Lock className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                  <p className="text-muted-foreground leading-relaxed">
                    Built for a company and its clients, so the code and live demo
                    are private. Happy to walk through the details in a call.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <Button asChild size="lg" className="group border-2 font-medium">
                    <Link href="/portfolio#contact">
                      Talk about this project
                      <ArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-2 font-medium">
                    <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                      View resume
                    </a>
                  </Button>
                </div>
              </aside>
            </div>

            {/* Previous / next */}
            <div className="grid border-t sm:grid-cols-2">
              <ProjectLink project={prev} direction="prev" />
              <ProjectLink project={next} direction="next" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-muted-foreground mb-4 font-mono text-xs tracking-wider uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium capitalize">{value}</dd>
    </div>
  );
}

function ProjectLink({
  project,
  direction,
}: {
  project: Project;
  direction: "prev" | "next";
}) {
  const isNext = direction === "next";
  return (
    <Link
      href={`/portfolio/projects/${project.id}`}
      className={cn(
        "group hover:bg-muted/20 flex flex-col gap-1 px-4 py-8 transition-colors md:px-12",
        isNext ? "sm:items-end sm:border-l sm:text-right" : "max-sm:border-b",
      )}
    >
      <span className="text-muted-foreground inline-flex items-center gap-2 font-mono text-xs uppercase">
        {!isNext && <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />}
        {isNext ? "Next project" : "Previous project"}
        {isNext && <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />}
      </span>
      <span className="font-incognito text-lg font-semibold">{project.title}</span>
    </Link>
  );
}
