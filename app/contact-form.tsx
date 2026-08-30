"use client";

import { ClipboardEvent, FormEvent, useState } from "react";
import { formatRussianPhone } from "./phone-format.js";

type FormStatus = "idle" | "submitting" | "success" | "error";

type ApiResponse = {
  ok?: boolean;
  message?: string;
};

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    setStatus("submitting");
    setStatusMessage("");

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      const payload = (await response.json().catch(() => ({}))) as ApiResponse;

      if (!response.ok || !payload.ok) {
        throw new Error(payload.message || "Не удалось отправить заявку.");
      }

      form.reset();
      setStatus("success");
      setStatusMessage(payload.message || "Заявка отправлена. Мы свяжемся с вами в ближайшее рабочее время.");
    } catch (error) {
      setStatus("error");
      setStatusMessage(error instanceof Error ? error.message : "Не удалось отправить заявку.");
    }
  }

  function handleInvalid(event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) {
    event.currentTarget.setCustomValidity(event.currentTarget.dataset.validationMessage || "Проверьте правильность заполнения поля.");
  }

  function clearValidationMessage(event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) {
    event.currentTarget.setCustomValidity("");
  }

  function handlePhoneInput(event: FormEvent<HTMLInputElement>) {
    event.currentTarget.value = formatRussianPhone(event.currentTarget.value);
    clearValidationMessage(event);
  }

  function handlePhonePaste(event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    event.currentTarget.value = formatRussianPhone(event.clipboardData.getData("text"));
    event.currentTarget.setCustomValidity("");
  }

  return (
    <form className="contact-form ym-disable-submit" action="/api/send-request.php" method="post" onSubmit={handleSubmit}>
      <label className="form-honeypot" aria-hidden="true">
        <span>Ваш сайт</span>
        <input className="ym-disable-keys" type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <label>
        <span>Ваше имя</span>
        <input
          className="ym-disable-keys"
          type="text"
          name="name"
          autoComplete="name"
          minLength={2}
          maxLength={80}
          placeholder="Как к вам обращаться"
          data-validation-message="Укажите ваше имя — не менее 2 символов."
          onInvalid={handleInvalid}
          onInput={clearValidationMessage}
          required
        />
      </label>
      <label>
        <span>Номер телефона</span>
        <input
          className="ym-disable-keys"
          type="tel"
          name="phone"
          autoComplete="tel"
          inputMode="numeric"
          defaultValue="+7 "
          maxLength={16}
          pattern={String.raw`\+7 [0-9]{3} [0-9]{3} [0-9]{2} [0-9]{2}`}
          data-validation-message="Укажите российский номер: +7 и 10 цифр."
          onInvalid={handleInvalid}
          onInput={handlePhoneInput}
          onPaste={handlePhonePaste}
          required
        />
      </label>
      <label>
        <span>Расскажите, что произошло</span>
        <textarea
          className="ym-disable-keys"
          name="message"
          rows={5}
          minLength={10}
          maxLength={4000}
          placeholder="Кратко опишите ситуацию: что и когда произошло, как были переданы деньги или ценности"
          data-validation-message="Кратко опишите, что произошло — не менее 10 символов."
          onInvalid={handleInvalid}
          onInput={clearValidationMessage}
          required
        />
      </label>
      <label className="form-consent">
        <input
          type="checkbox"
          name="consent"
          value="1"
          data-validation-message="Подтвердите согласие на обработку персональных данных."
          onInvalid={handleInvalid}
          onInput={clearValidationMessage}
          required
        />
        <span>
          Я согласен на обработку персональных данных в соответствии с{" "}
          <a href="/politika-konfidencialnosti/" target="_blank" rel="noreferrer">политикой конфиденциальности</a>.
        </span>
      </label>
      <button type="submit" disabled={status === "submitting"} aria-disabled={status === "submitting"}>
        {status === "submitting" ? "Отправляем…" : "Отправить заявку"}
      </button>
      {status !== "idle" && status !== "submitting" ? (
        <p className={`form-status form-status-${status}`} role="status" aria-live="polite">
          {statusMessage}{status === "error" ? <> Позвоните нам: <a href="tel:+79175844040">+7 (917) 584-40-40</a>.</> : null}
        </p>
      ) : null}
    </form>
  );
}
