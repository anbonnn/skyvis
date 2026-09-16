import type { MetadataRoute } from "next";

const SITE = "https://skyvis.mn";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${SITE}/assessment`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];
}
