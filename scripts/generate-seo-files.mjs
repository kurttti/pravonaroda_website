import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { seoRoutes } from "../app/seo-data.mjs";

const entries = seoRoutes
  .filter((route) => route.includeInSitemap)
  .map((route) => `  <url>\n    <loc>${route.canonical}</loc>\n    <lastmod>${route.lastModified}</lastmod>\n  </url>`)
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;

await writeFile(resolve("public/sitemap.xml"), sitemap, "utf8");
console.log(`Sitemap generated for ${seoRoutes.filter((route) => route.includeInSitemap).length} routes.`);
