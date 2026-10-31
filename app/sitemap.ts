import type { MetadataRoute } from "next";
import { SITE_URL } from "./seo";

// Every public page. No lastModified: a build-time date would claim every page changed on each
// deploy, which teaches crawlers to ignore it.
const pages: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/services", priority: 0.9 },
  { path: "/contact", priority: 0.9 },
  { path: "/work", priority: 0.7 },
  { path: "/reviews", priority: 0.7 },
  { path: "/about", priority: 0.6 },
  { path: "/terms", priority: 0.2 },
  { path: "/privacy", priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map(({ path, priority }) => ({ url: `${SITE_URL}${path}`, priority }));
}
