"use client";

export default function ContactForm() {
  return (
    <form className="contact-form" aria-describedby="form-status">
      <label>
        <span>Ваше имя</span>
        <input type="text" name="name" autoComplete="name" placeholder="Как к вам обращаться" required />
      </label>
      <label>
        <span>Номер телефона</span>
        <input type="tel" name="phone" autoComplete="tel" inputMode="tel" placeholder="+7 900 000-00-00" required />
      </label>
      <label>
        <span>Расскажите, что произошло</span>
        <textarea name="message" rows={5} placeholder="Кратко опишите ситуацию: что и когда произошло, как были переданы деньги или ценности" required />
      </label>
      <button type="submit" disabled aria-disabled="true">Отправить заявку</button>
      <p className="form-status" id="form-status">Отправку на почту подключим после создания рабочего адреса. Пока быстрее всего позвонить нам.</p>
    </form>
  );
}
