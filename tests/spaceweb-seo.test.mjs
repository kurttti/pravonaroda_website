import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("SpaceWeb home output promotes the brand and preferred HTTPS URL", async () => {
  const html = await readFile(new URL("../spaceweb-dist/index.html", import.meta.url), "utf8");

  assert.match(html, /<title>Народный юрист — помощь при мошенничестве в Москве<\/title>/);
  assert.match(html, /<meta name="description" content="Помогаем вернуть деньги, похищенные мошенниками\. Народный юрист в Москве: помощь при списаниях, переводах, кредитах и передаче денег или ценностей курьеру\."/);
  assert.match(html, /<meta property="og:description" content="Помогаем вернуть деньги, похищенные мошенниками\./);
  assert.match(html, /Помогаем вернуть деньги, похищенные мошенниками\./);
  assert.match(html, /<link rel="canonical" href="https:\/\/pravonaroda\.ru\/"/);
  assert.match(html, /<meta name="robots" content="index, follow/);
  assert.match(html, /<link rel="icon" href="\/favicon-120\.png" sizes="120x120" type="image\/png"/);
});

test("SpaceWeb policy output is crawlable but excluded from search", async () => {
  const html = await readFile(new URL("../spaceweb-dist/politika-konfidencialnosti/index.html", import.meta.url), "utf8");

  assert.match(html, /<meta name="robots" content="noindex, follow"/);
  assert.match(html, /<link rel="canonical" href="https:\/\/pravonaroda\.ru\/politika-konfidencialnosti\/"/);
});

test("SpaceWeb fraud page has route-specific social metadata", async () => {
  const html = await readFile(new URL("../spaceweb-dist/pomoshch-pri-moshennichestve/index.html", import.meta.url), "utf8");

  assert.match(html, /<meta property="og:title" content="Помощь при мошенничестве: деньги, наличные и ценности \| Народный юрист"/);
  assert.match(html, /<meta name="twitter:title" content="Помощь при мошенничестве: деньги, наличные и ценности \| Народный юрист"/);
  assert.match(html, /<link rel="alternate" hreflang="ru-RU" href="https:\/\/pravonaroda\.ru\/pomoshch-pri-moshennichestve\/"/);
  assert.doesNotMatch(html, /<meta property="og:image"/);
  assert.doesNotMatch(html, /<meta name="twitter:image"/);
});

test("SpaceWeb installs one Yandex Metrika counter on every public route", async () => {
  const routes = [
    "../spaceweb-dist/index.html",
    "../spaceweb-dist/pomoshch-pri-moshennichestve/index.html",
    "../spaceweb-dist/politika-konfidencialnosti/index.html",
  ];

  for (const route of routes) {
    const html = await readFile(new URL(route, import.meta.url), "utf8");

    assert.equal((html.match(/mc\.yandex\.ru\/metrika\/tag\.js\?id=112086779/g) ?? []).length, 1);
    assert.equal((html.match(/ym\(112086779,["']init["']/g) ?? []).length, 1);
    assert.equal((html.match(/mc\.yandex\.ru\/watch\/112086779/g) ?? []).length, 1);
  }
});

test("SpaceWeb keeps directory canonical redirects on HTTPS", async () => {
  const htaccess = await readFile(new URL("../spaceweb-dist/.htaccess", import.meta.url), "utf8");
  const directoryRedirect = [
    "RewriteCond %{REQUEST_FILENAME} -d",
    "RewriteCond %{REQUEST_URI} !/$",
    "RewriteRule ^ https://pravonaroda.ru%{REQUEST_URI}/ [R=301,L]",
  ].join("\n");

  assert.match(htaccess, new RegExp(directoryRedirect.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.ok(
    htaccess.indexOf(directoryRedirect) < htaccess.indexOf("RewriteCond %{HTTPS} off"),
    "the directory redirect must run before the generic HTTPS redirect",
  );
});
