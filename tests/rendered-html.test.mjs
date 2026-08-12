import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renders the finished legal services page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="ru">/i);
  assert.match(html, /Народный юрист/);
  assert.match(html, /Стали жертвой мошенников/);
  assert.match(html, /Обратиться к нам/);
  assert.match(html, /Юридическая консультация/);
  assert.match(html, /Защита по уголовным делам/);
  assert.match(html, /Банкротство/);
  assert.doesNotMatch(html, /Типовые обращения/);
  assert.doesNotMatch(html, /codex-preview/);
});

test("ships discoverability and contact essentials", async () => {
  const response = await render();
  const html = await response.text();

  assert.match(html, /<link rel="canonical" href="https:\/\/pravonaroda\.ru"/i);
  assert.match(html, /application\/ld\+json/i);
  assert.match(html, /"@type":"LegalService"/);
  assert.match(html, /tel:\+79175844040/);
  assert.match(html, /id="services"/);
  assert.match(html, /yandex\.ru\/map-widget/);
});
