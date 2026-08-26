import type { Metadata } from "next";
import ContactForm from "./contact-form";
import { OfficeSection, SiteFooter, SiteHeader } from "./site-components";
import { legalServices, phone, siteUrl } from "./site-data";

export const metadata: Metadata = {
  title: "Юридическая помощь при мошенничестве в Москве",
  description: "Помощь, если мошенники похитили деньги или ценности, списали средства, убедили сделать перевод или передать наличные курьеру.",
  alternates: { canonical: siteUrl },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LegalService",
      "@id": `${siteUrl}#legal-service`,
      name: "Народный юрист",
      legalName: "ИП Милевский Александр Александрович",
      url: siteUrl,
      logo: `${siteUrl}apple-touch-icon.png`,
      image: `${siteUrl}og.png`,
      description: "Юридическая помощь при мошенничестве и хищении денег или ценностей в Москве.",
      telephone: phone,
      taxID: "775101196352",
      identifier: { "@type": "PropertyValue", name: "ОГРНИП", value: "326774600529055" },
      address: {
        "@type": "PostalAddress",
        streetAddress: "Куликовская улица, дом 6, ТЦ «Алфавит», 1 этаж",
        addressLocality: "Москва",
        addressRegion: "Москва",
        addressCountry: "RU",
      },
      areaServed: { "@type": "City", name: "Москва" },
      knowsLanguage: "ru",
      makesOffer: legalServices.map((item) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: item.title,
          description: item.text,
          areaServed: { "@type": "City", name: "Москва" },
          provider: { "@id": `${siteUrl}#legal-service` },
        },
      })),
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}#website`,
      url: siteUrl,
      name: "Народный юрист",
      inLanguage: "ru-RU",
      publisher: { "@id": `${siteUrl}#legal-service` },
    },
  ],
};

export default function Home() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <SiteHeader />

      <section className="hero hero-simple" id="top">
        <div className="container hero-simple-grid">
          <div className="hero-copy">
            <div className="eyebrow"><span /> Наше профильное направление</div>
            <h1>Юридическая помощь при <em>мошенничестве</em></h1>
            <p className="hero-lead">Стали жертвой мошенников? Деньги похищены, а надежда тает? Мы знаем, как действовать. Мы специализируемся на возврате похищенных мошенниками денег — и делаем это профессионально. Поможем разобраться в ситуации, выстроить стратегию и пройти все этапы: от заявления в полицию до взыскания средств. Вернём то, что принадлежит вам по праву.</p>
            <div className="hero-actions">
              <a className="button button-primary" href={`tel:${phone}`}>Позвонить нам</a>
              <a className="button button-outline-light" href="#request">Написать</a>
            </div>
            <div className="hero-note"><span className="status-dot" aria-hidden="true" /> Оцениваем перспективы только после изучения обстоятельств — без обещаний невозможного</div>
          </div>

          <aside className="hero-scope" aria-label="С какими ситуациями можно обратиться">
            <div className="hero-scope-heading">
              <span className="hero-scope-kicker">Обратитесь к нам, если</span>
            </div>
            <ul>
              <li><span>01</span><strong>Деньги списали со счёта без вашего согласия</strong></li>
              <li><span>02</span><strong>Вы перевели средства мошенникам под влиянием обмана</strong></li>
              <li><span>03</span><strong>Курьер забрал наличные, украшения или другие ценности</strong></li>
            </ul>
            <a href="/pomoshch-pri-moshennichestve/">Подробнее о юридической помощи <span>→</span></a>
          </aside>
        </div>
      </section>

      <section className="section services-section" id="services">
        <div className="container">
          <div className="section-heading split-heading services-heading">
            <div>
              <div className="eyebrow dark"><span /> Чем можем помочь</div>
              <h2>Юридическая помощь<br />под вашу задачу</h2>
            </div>
            <p>Главное направление — помощь пострадавшим от мошенничества. Также сопровождаем другие юридические задачи и подбираем профильного специалиста.</p>
          </div>
          <div className="services-grid services-grid-compact">
            {legalServices.map((item) => (
              <article className="service-card service-card-compact" key={item.number}>
                <div className="service-card-top"><span className="service-number">{item.number}</span></div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <a href={item.href}>{item.linkText} <span>→</span></a>
              </article>
            ))}
          </div>
          <p className="services-note">Точный объём работы и условия сопровождения определяются после анализа задачи и документов.</p>
        </div>
      </section>

      <section className="request-section" id="request">
        <div className="container request-grid">
          <div className="request-copy">
            <div className="eyebrow"><span /> Напишите нам</div>
            <h2>Коротко расскажите,<br />что произошло</h2>
            <p>Оставьте имя, телефон и краткое описание ситуации. Заявка поступит специалисту на защищённую рабочую почту.</p>
            <a href={`tel:${phone}`}>Нужна помощь сейчас? Позвонить →</a>
          </div>
          <ContactForm />
        </div>
      </section>

      <OfficeSection />
      <SiteFooter />
    </main>
  );
}
