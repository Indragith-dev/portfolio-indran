"use client";

import SectionHeading from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import HeadingLine from "@/components/ui/heading-line";
import { awards } from "@/config/portfolio-data";
import { Award, Medal } from "lucide-react";
import { motion } from "motion/react";

const Awards = () => {
  const { featured, others } = awards;

  return (
    <SectionHeading id="awards" text="Awards">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="group relative grid lg:grid-cols-2"
      >
        {/* Photo side */}
        <div className="bg-muted/20 relative overflow-hidden border-b lg:border-r lg:border-b-0">
          {/* Cross pattern */}
          <div className="absolute inset-0">
            <div className="before:bg-border after:bg-border relative h-full w-full before:absolute before:top-1/2 before:left-0 before:h-0.5 before:w-full after:absolute after:top-0 after:left-1/2 after:h-full after:w-0.5" />
          </div>

          <div className="relative z-10 flex justify-center p-8 md:p-12 lg:p-16">
            <div className="relative w-full max-w-xs">
              {/* Frame corners */}
              <div className="border-foreground/20 absolute -top-2 -left-2 h-8 w-8 border-t-2 border-l-2 transition-all group-hover:-top-3 group-hover:-left-3" />
              <div className="border-foreground/20 absolute -top-2 -right-2 h-8 w-8 border-t-2 border-r-2 transition-all group-hover:-top-3 group-hover:-right-3" />
              <div className="border-foreground/20 absolute -bottom-2 -left-2 h-8 w-8 border-b-2 border-l-2 transition-all group-hover:-bottom-3 group-hover:-left-3" />
              <div className="border-foreground/20 absolute -right-2 -bottom-2 h-8 w-8 border-r-2 border-b-2 transition-all group-hover:-right-3 group-hover:-bottom-3" />

              <div className="bg-background relative overflow-hidden border-2">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={featured.image}
                    alt={featured.imageAlt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details side */}
        <div className="relative flex flex-col justify-center p-8 md:p-12 lg:p-16">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <time className="text-muted-foreground font-mono text-xs">
              {featured.year}
            </time>
            <div className="bg-border h-4 w-px" />
            <div className="inline-flex items-center gap-1.5">
              <Award className="size-3.5 text-amber-500" />
              <span className="text-muted-foreground font-mono text-xs uppercase">
                {featured.organisation}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-incognito text-3xl font-bold lg:text-4xl">
              {featured.title}
            </h3>
            <HeadingLine className="mt-3" />
          </div>

          <p className="text-muted-foreground mb-8 text-sm leading-relaxed md:text-base">
            {featured.description}
          </p>

          {/* Other recognitions */}
          <div className="border-foreground/20 border-t border-dashed pt-6">
            <p className="text-muted-foreground mb-4 font-mono text-xs tracking-wider uppercase">
              Also recognised as
            </p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {others.map((item, i) => (
                <motion.li
                  key={item.title + item.organisation}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  viewport={{ once: true }}
                  className="bg-muted/20 flex items-start gap-3 rounded-lg border p-3"
                >
                  <Medal className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{item.title}</p>
                    <Badge
                      variant="outline"
                      className="text-muted-foreground mt-1 border font-mono text-[10px]"
                    >
                      {item.organisation}
                    </Badge>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </SectionHeading>
  );
};

export default Awards;
