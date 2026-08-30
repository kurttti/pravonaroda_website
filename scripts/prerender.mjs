import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const templatePath = resolve("spaceweb-dist/index.html");
const serverEntryPath = resolve(".spaceweb-ssr/entry-server.js");
const { render } = await import(pathToFileURL(serverEntryPath).href);
const template = await readFile(templatePath, "utf8");

const routes = [
  {
    pathname: "/",
    output: "index.html",
    title: "Народный юрист — помощь при мошенничестве в Москве",
    description: "Народный юрист в Москве: юридическая помощь при мошенничестве, незаконных списаниях, переводах, кредитах и передаче денег или ценностей курьеру.",
    canonical: "https://pravonaroda.ru/",
    robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    socialImage: true,
  },
  {
    pathname: "/pomoshch-pri-moshennichestve/",
    output: "pomoshch-pri-moshennichestve/index.html",
    title: "Помощь при мошенничестве: деньги, наличные и ценности | Народный юрист",
    description: "Что делать после хищения денег или ценностей, перевода мошенникам, незаконного списания или передачи курьеру. Юридическая помощь в Москве.",
    canonical: "https://pravonaroda.ru/pomoshch-pri-moshennichestve/",
    robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    socialImage: false,
  },
  {
    pathname: "/politika-konfidencialnosti/",
    output: "politika-konfidencialnosti/index.html",
    title: "Политика конфиденциальности | Народный юрист",
    description: "Политика обработки персональных данных сайта «Народный юрист».",
    canonical: "https://pravonaroda.ru/politika-konfidencialnosti/",
    robots: "noindex, follow",
    socialImage: false,
  },
];

for (const route of routes) {
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

console.log(`Static HTML generated for ${routes.length} SpaceWeb routes.`);
