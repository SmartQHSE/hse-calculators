import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://tools.smartqhse.com/sitemap.xml",
    host: "https://tools.smartqhse.com",
  };
}
