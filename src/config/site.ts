import { profile, siteMeta, social } from "./portfolio-data";

/**
 * Thin view over portfolio-data.ts, kept so existing imports keep working.
 * Edit the values in portfolio-data.ts, not here.
 */
export const siteConfig = {
  title: siteMeta.title,
  description: siteMeta.description,
  url: siteMeta.url,
  name: profile.name,
  twitter: social.twitter,
  linkedin: social.linkedin,
  github: social.github,
  email: social.email,
  whatsapp: social.whatsapp,
};
