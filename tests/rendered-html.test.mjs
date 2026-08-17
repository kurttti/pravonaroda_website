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
  assert.match(html, /Юридическая помощь при/);
  assert.match(html, /Стали жертвой мошенников/);
  assert.match(html, /специализируемся на возврате похищенных мошенниками денег/);
  assert.match(html, /Вернём то, что принадлежит вам по праву/);
  assert.match(html, /Курьер забрал наличные, украшения или другие ценности/);
  assert.match(html, /Позвонить нам/);
  assert.match(html, /href="#request">Написать/);
  assert.match(html, /name="name"/);
  assert.match(html, /name="phone"/);
  assert.match(html, /name="message"/);
  assert.match(html, /action="\/api\/send-request\.php"/);
  assert.match(html, /method="post"/);
  assert.match(html, /name="consent"/);
  assert.match(html, /href="\/politika-konfidencialnosti\/"/);
  assert.doesNotMatch(html, /<button[^>]*\sdisabled(?:=|\s|>)/);
  assert.doesNotMatch(html, /Отправку на почту подключим/);
  assert.doesNotMatch(html, /После подключения рабочей почты/);
  assert.doesNotMatch(html, /Обман меняется/);
  assert.doesNotMatch(html, /Если деньги или ценности забрал курьер/);
  assert.doesNotMatch(html, /От хаоса — к понятному плану/);
  assert.doesNotMatch(html, /По-человечески/);
  assert.doesNotMatch(html, /specialization-strip/);
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
  assert.doesNotMatch(html, /Обратиться в полицию/);
  assert.match(html, /<div class="big-number">03<\/div><div class="step-contact"><h3>Связаться с нами<\/h3>/);
  assert.doesNotMatch(html, /<div class="big-number">04<\/div>/);
});

test("renders the personal data policy", async () => {
  const response = await render("/politika-konfidencialnosti");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /Политика конфиденциальности/);
  assert.match(html, /ИП Милевский Александр Александрович/);
  assert.match(html, /support@pravonaroda\.ru/);
  assert.match(html, /отозвать согласие/i);
  assert.match(html, /class="legal-title-line"[^>]*>Политика</);
  assert.match(html, /class="legal-title-line legal-title-long"[^>]*>конфиденциальности</);
  assert.doesNotMatch(html, /Дата публикации:/);
  assert.doesNotMatch(html, /описание ситуации при желании/i);
  assert.match(html, /Без имени, телефона, описания ситуации и согласия/);
});

test("requires the contact comment and keeps validation messages in Russian", async () => {
  const response = await render();
  const html = await response.text();
  const messageField = html.match(/<textarea\b[^>]*name="message"[^>]*>/i)?.[0] ?? "";

  assert.ok(messageField, "message textarea must be rendered");
  assert.match(messageField, /\srequired(?:=|\s|>)/i);
  assert.match(messageField, /\sminLength="10"/i);
  assert.doesNotMatch(html, /Расскажите, что произошло — необязательно/);
  assert.match(html, /data-validation-message="Укажите ваше имя — не менее 2 символов\."/);
  assert.match(html, /data-validation-message="Укажите номер телефона\."/);
  assert.match(html, /data-validation-message="Кратко опишите, что произошло — не менее 10 символов\."/);
  assert.match(html, /data-validation-message="Подтвердите согласие на обработку персональных данных\."/);
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
