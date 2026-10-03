"use client";

import { Logo } from "@/components/ui/logo";
import { Github, Heart, Linkedin, Mail } from "lucide-react";
import dayjs from "dayjs";
import { motion } from "motion/react";
import { siteConfig } from "@/config/site";
import { profile } from "@/config/portfolio-data";

/** Lucide has no brand icon for WhatsApp, so it is drawn here at the same size. */
const WhatsApp = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
    <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.5h-.01a9.47 9.47 0 0 1-4.83-1.32l-.35-.2-3.59.94.96-3.5-.23-.36a9.45 9.45 0 0 1-1.45-5.04c0-5.23 4.26-9.49 9.5-9.49 2.54 0 4.92.99 6.71 2.79a9.43 9.43 0 0 1 2.78 6.71c0 5.23-4.26 9.48-9.49 9.48m8.08-17.56A11.35 11.35 0 0 0 12.05.6C5.75.6.63 5.72.63 12.01c0 2.01.52 3.97 1.52 5.7L.53 23.6l6.04-1.58a11.4 11.4 0 0 0 5.47 1.39h.01c6.29 0 11.41-5.12 11.42-11.41 0-3.05-1.19-5.92-3.34-8.07" />
  </svg>
);

const Footer = () => {
  const socialLinks = [
    {
      icon: Github,
      href: siteConfig.github,
      label: "GitHub",
    },
    {
      icon: Linkedin,
      href: siteConfig.linkedin,
      label: "LinkedIn",
    },
    {
      icon: WhatsApp,
      href: siteConfig.whatsapp,
      label: "WhatsApp",
    },
    {
      icon: Mail,
      href: `mailto:${siteConfig.email}`,
      label: "Email",
    },
  ];

  return (
    <footer className="border-t px-4 py-3.5 md:px-8">
      <div className="text-foreground/70 flex flex-col items-center justify-between gap-3 text-sm md:flex-row">
       
        <div className="inline-flex items-center gap-2">
          <Logo className="w-10" />
          <span>
            © {dayjs().year()} {profile.name}. All rights reserved.
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-2"
        >
          <span className="text-foreground/60 text-sm">Made with</span>
          <Heart className={`h-4 w-4 fill-red-400 text-red-400`} />
          <span className="text-foreground/60 text-sm">in Next.js</span>
        </motion.div>

     
        <div className="inline-flex items-center gap-4">
          {/* Social Links */}
          <div className="inline-flex overflow-hidden rounded-md border *:size-8 *:border-r last:*:border-r-0">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="text-foreground/60 hover:bg-muted/30 hover:text-foreground inline-flex items-center justify-center transition-colors"
              >
                <link.icon className="h-4 w-4" />
              </a>
            ))}
          </div>

       
          <motion.a
            href="#home"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="hover:bg-foreground/5 rounded-md border px-2 py-1 transition-all"
          >
            Back to top
          </motion.a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
