export function formatRussianPhone(value) {
  let digits = String(value ?? "").replace(/\D/g, "");
  const hasVisibleCountryCode = /^\s*\+7/.test(String(value ?? ""));

  if (hasVisibleCountryCode || (digits.length > 10 && (digits.startsWith("7") || digits.startsWith("8")))) {
    digits = digits.slice(1);
  }

  const subscriberDigits = digits.slice(0, 10);
  const groups = [
    subscriberDigits.slice(0, 3),
    subscriberDigits.slice(3, 6),
    subscriberDigits.slice(6, 8),
    subscriberDigits.slice(8, 10),
  ].filter(Boolean);

  return `+7${groups.length ? ` ${groups.join(" ")}` : " "}`;
}
