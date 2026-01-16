import { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kviewo.com";

// Supported locales
const locales = ["en", "ko", "zh"];

// Static routes that should be in the sitemap
const staticRoutes = [
  "",
  "/campaigns",
  "/community",
  "/search",
  "/support",
  "/inquiry",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Generate sitemap entries for all locales and routes
  const routes: MetadataRoute.Sitemap = [];

  locales.forEach((locale) => {
    staticRoutes.forEach((route) => {
      routes.push({
        url: `${SITE_URL}/${locale}${route}`,
        lastModified: now,
        changeFrequency: route === "" ? "daily" : "weekly",
        priority: route === "" ? 1.0 : 0.8,
      });
    });
  });

  return routes;
}
