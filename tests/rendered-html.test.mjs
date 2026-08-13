import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renders a concise conversion-focused home page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Похитили деньги/);
  assert.match(html, /или ценности/);
  assert.match(html, /Позвонить нам/);
  assert.match(html, /href="#request">Написать/);
  assert.match(html, /name="name"/);
  assert.match(html, /name="phone"/);
  assert.match(html, /name="message"/);
  assert.match(html, /Отправку на почту подключим/);
  assert.doesNotMatch(html, /Обман меняется/);
  assert.doesNotMatch(html, /Если деньги или ценности забрал курьер/);
  assert.doesNotMatch(html, /От хаоса — к понятному плану/);
  assert.doesNotMatch(html, /По-человечески/);
});

test("moves detailed fraud guidance to a dedicated page", async () => {
  const response = await render("/pomoshch-pri-moshennichestve");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /Юридическая помощь/);
  assert.match(html, /Что сделать/);
  assert.match(html, /Разные схемы/);
  assert.match(html, /Если деньги или ценности забрал курьер/);
  assert.match(html, /От хаоса — к понятному плану/);
  assert.match(html, /По-человечески/);
  assert.match(html, /href="\/#request">Написать/);
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
