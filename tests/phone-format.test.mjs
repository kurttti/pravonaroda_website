import assert from "node:assert/strict";
import test from "node:test";

test("formats ten Russian subscriber digits into readable groups", async () => {
  const { formatRussianPhone } = await import("../app/phone-format.js");

  assert.equal(formatRussianPhone("9199998877"), "+7 919 999 88 77");
  assert.equal(formatRussianPhone("+7 (919) 999-88-77"), "+7 919 999 88 77");
  assert.equal(formatRussianPhone("8 919 999 88 77"), "+7 919 999 88 77");
});

test("drops letters and digits beyond the Russian phone length", async () => {
  const { formatRussianPhone } = await import("../app/phone-format.js");

  assert.equal(formatRussianPhone("43к4232342323"), "+7 434 232 34 23");
  assert.equal(formatRussianPhone("+7 919 999 88 77 12345"), "+7 919 999 88 77");
  assert.equal(formatRussianPhone(""), "+7 ");
});
