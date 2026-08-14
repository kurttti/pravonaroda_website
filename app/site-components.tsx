/* eslint-disable @next/next/no-html-link-for-pages */
import { fraudPath, phone, phoneDisplay } from "./site-data";

export function SiteHeader({ detail = false }: { detail?: boolean }) {
  return (
    <>
      <div className="urgent-bar">
        <div className="container urgent-inner">
          <span>Похищены деньги или ценности?</span>
          <span className="urgent-copy">Не продолжайте общение с мошенниками и сохраните все доказательства.</span>
          <a href={`tel:${phone}`}>Позвонить юристу →</a>
        </div>
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="/" aria-label="Народный юрист — на главную">
            <span><strong>Народный юрист</strong><small>Право на вашей стороне</small></span>
          </a>
          <nav aria-label="Основная навигация">
            <a href={fraudPath}>Помощь при мошенничестве</a>
            {!detail && <a href="#services">Услуги</a>}
            <a href={detail ? "/#request" : "#request"}>Написать</a>
            <a href={detail ? "/#office" : "#office"}>Контакты</a>
          </nav>
          <div className="header-contact">
            <a className="phone-link" href={`tel:${phone}`}>{phoneDisplay}</a>
            <span>Сегодня до 20:00</span>
          </div>
          <a className="button button-small" href={`tel:${phone}`}>Позвонить</a>
        </div>
      </header>
    </>
  );
}

export function OfficeSection() {
  return (
    <section className="office-section" id="office">
      <div className="container office-grid">
        <div className="office-info">
          <div className="eyebrow"><span /> Контакты</div>
          <h2>Будем на связи</h2>
          <div className="contact-row"><span>Телефон</span><a href={`tel:${phone}`}>{phoneDisplay}</a></div>
          <div className="contact-row"><span>Адрес</span><p>г. Москва, ул. Куликовская, д. 6<br />ТЦ «Алфавит», 1 этаж</p></div>
          <a className="route-link" href="https://yandex.ru/maps/?text=Москва%2C%20Куликовская%20улица%2C%206" target="_blank" rel="noreferrer">Построить маршрут ↗</a>
        </div>
        <div className="map-card">
          <iframe className="yandex-map" src="https://yandex.ru/map-widget/v1/?mode=search&text=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0%2C%20%D0%9A%D1%83%D0%BB%D0%B8%D0%BA%D0%BE%D0%B2%D1%81%D0%BA%D0%B0%D1%8F%20%D1%83%D0%BB%D0%B8%D1%86%D0%B0%2C%206&z=16&lang=ru_RU" title="Яндекс Карта: ТЦ «Алфавит», Москва, Куликовская улица, 6" loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" />
        </div>
      </div>
    </section>
  );
}

export function SiteFooter({ detail = false }: { detail?: boolean }) {
  return (
    <footer>
      <div className="container footer-top">
        <a className="brand footer-brand" href={detail ? "/" : "#top"} aria-label="Народный юрист — на главную">
          <span><strong>Народный юрист</strong><small>Право на вашей стороне</small></span>
        </a>
        <p>Юридическая помощь пострадавшим<br />от мошенничества и денежных хищений</p>
        <a className="footer-phone" href={`tel:${phone}`}>{phoneDisplay}</a>
      </div>
      <div className="container footer-bottom">
        <p>ИП Милевский Александр Александрович · ИНН 775101196352 · ОГРН 326774600529055</p>
        <p>Информация на сайте не является гарантией результата. © 2026</p>
      </div>
    </footer>
  );
}
