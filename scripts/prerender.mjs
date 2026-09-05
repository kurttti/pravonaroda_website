import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { seoRoutes } from "../app/seo-data.mjs";

const templatePath = resolve("spaceweb-dist/index.html");
const serverEntryPath = resolve(".spaceweb-ssr/entry-server.js");
const { render } = await import(pathToFileURL(serverEntryPath).href);
const template = await readFile(templatePath, "utf8");

for (const route of seoRoutes) {
  let rendered = template
    .replace("<!--app-html-->", render(route.pathname))
    .replace(/<title>.*?<\/title>/, `<title>${route.title}</title>`)
    .replace(/<meta\s+name="robots"\s+content="[^"]*"\s*\/>/, `<meta name="robots" content="${route.robots}" />`)
    .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/>/, `<meta name="description" content="${route.description}" />`)
    .replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/, `<meta property="og:title" content="${route.title}" />`)
    .replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/, `<meta property="og:description" content="${route.description}" />`)
    .replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${route.title}" />`)
    .replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${route.description}" />`)
    .replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/, `<link rel="canonical" href="${route.canonical}" />`)
    .replace(/<link\s+rel="alternate"\s+hreflang="ru-RU"\s+href="[^"]*"\s*\/>/, `<link rel="alternate" hreflang="ru-RU" href="${route.canonical}" />`)
    .replace(/<link\s+rel="alternate"\s+hreflang="x-default"\s+href="[^"]*"\s*\/>/, `<link rel="alternate" hreflang="x-default" href="${route.canonical}" />`)
    .replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/, `<meta property="og:url" content="${route.canonical}" />`);

  if (!route.socialImage) {
    rendered = rendered
      .replace(/\s*<meta\s+property="og:image(?::(?:width|height|alt))?"\s+content="[^"]*"\s*\/>/g, "")
      .replace(/\s*<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/>/g, "")
      .replace(/<meta\s+name="twitter:card"\s+content="[^"]*"\s*\/>/, '<meta name="twitter:card" content="summary" />');
  }

  if (!rendered.includes('id="root"')) throw new Error(`Prerender failed for ${route.pathname}`);

  const outputPath = resolve("spaceweb-dist", route.output);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, rendered, "utf8");
}

console.log(`Static HTML generated for ${seoRoutes.length} SpaceWeb routes.`);
