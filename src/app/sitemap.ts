import type { MetadataRoute } from "next";
import { CALCULATORS } from "@/core/registry";

const BASE = "https://tools.smartqhse.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...CALCULATORS.map((c) => ({
      url: `${BASE}/${c.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
