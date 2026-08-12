import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const outputPath = resolve("spaceweb-dist/index.html");
const serverEntryPath = resolve(".spaceweb-ssr/entry-server.js");
const { render } = await import(pathToFileURL(serverEntryPath).href);
const html = await readFile(outputPath, "utf8");
const renderedHtml = html.replace("<!--app-html-->", render());

if (renderedHtml === html) {
  throw new Error("Prerender marker was not found in the built HTML.");
}

await writeFile(outputPath, renderedHtml, "utf8");
console.log("Static HTML generated for SpaceWeb.");
