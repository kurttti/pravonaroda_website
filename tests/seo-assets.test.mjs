import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("sitemap lists only canonical pages intended for search", async () => {
  const sitemap = await readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8");

  assert.match(sitemap, /<loc>https:\/\/pravonaroda\.ru\/<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/pravonaroda\.ru\/pomoshch-pri-moshennichestve\/<\/loc>/);
  assert.doesNotMatch(sitemap, /politika-konfidencialnosti/);
  assert.equal((sitemap.match(/<url>/g) ?? []).length, 2);
  assert.equal((sitemap.match(/<lastmod>2026-08-30<\/lastmod>/g) ?? []).length, 2);
});

test("ships conventional high-resolution favicon fallbacks", async () => {
  const png = await readFile(new URL("../public/favicon-120.png", import.meta.url));
  const ico = await readFile(new URL("../public/favicon.ico", import.meta.url));

  assert.equal(png.toString("ascii", 1, 4), "PNG");
  assert.equal(png.readUInt32BE(16), 120);
  assert.equal(png.readUInt32BE(20), 120);
  assert.equal(ico.readUInt16LE(0), 0);
  assert.equal(ico.readUInt16LE(2), 1);
  assert.ok(ico.readUInt16LE(4) >= 1);
});
