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
    title: "Юридическая помощь при мошенничестве в Москве | Народный юрист",
    description: "Помощь, если мошенники похитили деньги или ценности, списали средства, убедили сделать перевод или передать наличные курьеру.",
    canonical: "https://pravonaroda.ru/",
  },
  {
    pathname: "/pomoshch-pri-moshennichestve/",
    output: "pomoshch-pri-moshennichestve/index.html",
    title: "Помощь при мошенничестве: деньги, наличные и ценности | Народный юрист",
    description: "Что делать после хищения денег или ценностей, перевода мошенникам, незаконного списания или передачи курьеру.",
    canonical: "https://pravonaroda.ru/pomoshch-pri-moshennichestve/",
  },
  {
    pathname: "/politika-konfidencialnosti/",
    output: "politika-konfidencialnosti/index.html",
    title: "Политика конфиденциальности | Народный юрист",
    description: "Политика обработки персональных данных посетителей сайта pravonaroda.ru.",
    canonical: "https://pravonaroda.ru/politika-konfidencialnosti/",
  },
];

for (const route of routes) {
  const rendered = template
    .replace("<!--app-html-->", render(route.pathname))
    .replace(/<title>.*?<\/title>/, `<title>${route.title}</title>`)
    .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/>/, `<meta name="description" content="${route.description}" />`)
    .replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/, `<meta property="og:title" content="${route.title}" />`)
    .replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/, `<meta property="og:description" content="${route.description}" />`)
    .replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/, `<link rel="canonical" href="${route.canonical}" />`)
    .replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/, `<meta property="og:url" content="${route.canonical}" />`);

  if (!rendered.includes('id="root"')) throw new Error(`Prerender failed for ${route.pathname}`);

  const outputPath = resolve("spaceweb-dist", route.output);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, rendered, "utf8");
}

console.log(`Static HTML generated for ${routes.length} SpaceWeb routes.`);
