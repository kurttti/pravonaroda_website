import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Юрист по мошенничеству в Москве — помощь пострадавшим",
  description:
    "Юридическая помощь пострадавшим от мошенничества в Москве: переводы, незаконные списания, кредиты без согласия и передача наличных курьерам. Честная оценка ситуации.",
  alternates: { canonical: "https://pravonaroda.ru/" },
};

const phone = "+79175844040";
const siteUrl = "https://pravonaroda.ru/";

const situations = [
  {
    number: "01",
    title: "Звонок от «службы безопасности»",
    text: "Вы сообщили код, установили приложение или перевели деньги на «безопасный счёт».",
    tag: "Социальная инженерия",
  },
  {
    number: "02",
    title: "Лжеброкер и инвестиции",
    text: "Платформа показывает прибыль, но требует новый платёж для вывода средств.",
    tag: "Фальшивые инвестиции",
  },
  {
    number: "03",
    title: "Покупка в интернете",
    text: "Продавец получил предоплату, товар не отправил и перестал выходить на связь.",
    tag: "Маркетплейсы и объявления",
  },
  {
    number: "04",
    title: "Кредит без вашего согласия",
    text: "Доступ к кабинету получили третьи лица и оформили заём или кредитную карту.",
    tag: "Чужой кредит",
  },
  {
    number: "05",
    title: "Наличные переданы курьеру",
    text: "Под давлением звонивших вы сняли сбережения и отдали деньги человеку с кодовым словом или «документом о приёме».",
    tag: "Курьеры и дропы",
  },
];

const legalServices = [
  {
    number: "01",
    mark: "Ю",
    title: "Юридическая консультация",
    text: "Подберём профильного юриста или адвоката в зависимости от задачи, изучим исходные данные и обозначим возможные шаги.",
    details: ["Разговор продолжительностью до одного часа", "Предварительная оценка документов и рисков"],
  },
  {
    number: "02",
    mark: "АП",
    title: "Защита по делам об административных правонарушениях",
    text: "Поможем сформировать правовую позицию и организовать защиту на нужной стадии производства по делу.",
    details: ["Анализ материалов и подготовка позиции", "Участие защитника и обжалование постановлений"],
  },
  {
    number: "03",
    mark: "ДУ",
    title: "Досудебное урегулирование споров",
    text: "Ищем возможность решить вопрос до суда и фиксируем договорённости так, чтобы они имели юридическое значение.",
    details: ["Претензии и жалобы", "Переговоры и проекты соглашений"],
  },
  {
    number: "04",
    mark: "УД",
    title: "Защита по уголовным делам",
    text: "Организуем участие адвоката и выстраиваем линию защиты с учётом стадии дела и процессуального статуса доверителя.",
    details: ["Доследственная проверка", "Предварительное следствие и суд"],
  },
  {
    number: "05",
    mark: "Д",
    title: "Составление документов",
    text: "Готовим документы под конкретную ситуацию, адресата и задачу — без формального копирования шаблонов.",
    details: ["Заявления, жалобы и ходатайства", "Претензии, договоры и процессуальные документы"],
  },
  {
    number: "06",
    mark: "Б",
    title: "Банкротство",
    text: "Сопровождаем отдельные вопросы, возникающие в делах о банкротстве граждан и организаций.",
    details: ["Сопровождение процедуры банкротства", "Оспаривание сделок", "Исключение имущества из конкурсной массы", "Споры с арбитражным управляющим"],
  },
];

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
      description: "Юридическая помощь пострадавшим от мошенничества: незаконные списания, спорные переводы и передача наличных курьерам в Москве.",
      telephone: phone,
      taxID: "775101196352",
      identifier: {
        "@type": "PropertyValue",
        name: "ОГРНИП",
        value: "326774600529055",
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: "Куликовская улица, дом 6, ТЦ «Алфавит», 1 этаж",
        addressLocality: "Москва",
        addressRegion: "Москва",
        addressCountry: "RU",
      },
      areaServed: { "@type": "City", name: "Москва" },
      knowsLanguage: "ru",
      knowsAbout: [
        "телефонное мошенничество",
        "незаконные банковские списания",
        "спорные денежные переводы",
        "лжеброкеры",
        "кредиты без согласия",
        "интернет-мошенничество",
        "передача наличных курьерам мошенников",
        "взыскание с курьеров и дропов",
        "досудебное урегулирование споров",
        "защита по уголовным делам",
        "защита по делам об административных правонарушениях",
        "составление юридических документов",
        "банкротство",
      ],
      hasMap: "https://yandex.ru/maps/?text=Москва%2C%20Куликовская%20улица%2C%206",
      makesOffer: [...situations, ...legalServices].map((item) => ({
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
    {
      "@type": "WebPage",
      "@id": `${siteUrl}#webpage`,
      url: siteUrl,
      name: "Юрист по мошенничеству в Москве — помощь пострадавшим",
      description: "Юридическая помощь пострадавшим от мошенничества в Москве: переводы, незаконные списания, кредиты без согласия и передача наличных курьерам.",
      isPartOf: { "@id": `${siteUrl}#website` },
      about: { "@id": `${siteUrl}#legal-service` },
      primaryImageOfPage: `${siteUrl}og.png`,
      inLanguage: "ru-RU",
    },
  ],
};

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <div className="urgent-bar">
        <div className="container urgent-inner">
          <span>Деньги ушли мошенникам?</span>
          <span className="urgent-copy">Прекратите контакт, сохраните доказательства и сообщите о случившемся.</span>
          <a href="#first-steps">План первых действий →</a>
        </div>
      </div>

      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="#top" aria-label="Народный юрист — на главную">
            <span className="brand-mark" aria-hidden="true">НЮ</span>
            <span>
              <strong>Народный юрист</strong>
              <small>Право на вашей стороне</small>
            </span>
          </a>
          <nav aria-label="Основная навигация">
            <a href="#situations">Мошенничество</a>
            <a href="#services">Услуги</a>
            <a href="#process">Как работаем</a>
            <a href="#office">Контакты</a>
          </nav>
          <div className="header-contact">
            <a className="phone-link" href={`tel:${phone}`}>+7 (917) 584-40-40</a>
            <span>Сегодня до 20:00</span>
          </div>
          <a className="button button-small" href={`tel:${phone}`}>Позвонить</a>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow"><span /> Юридическая помощь в Москве</div>
            <h1>Помогаем вернуть деньги после <em>мошенничества</em></h1>
            <p className="hero-lead">
              Разберём, как были похищены средства — переводом, списанием или через передачу наличных курьеру. Зафиксируем доказательства и выстроим правовой путь.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href={`tel:${phone}`}>Обсудить ситуацию</a>
              <a className="text-link" href="#process">Как проходит работа <span>↘</span></a>
            </div>
            <div className="hero-note">
              <span className="status-dot" aria-hidden="true" />
              Первичная оценка ситуации по телефону — без обещаний невозможного
            </div>
          </div>

          <aside className="action-card" aria-label="План первых действий">
            <div className="card-topline">
              <span>Первые 24 часа</span>
              <span className="live-label">важно</span>
            </div>
            <h2>Время работает<br />на доказательства</h2>
            <ol>
              <li><span>1</span><div><strong>Прекратите контакт</strong><p>Не передавайте больше деньги, ценности или документы</p></div></li>
              <li><span>2</span><div><strong>Сохраните всё</strong><p>Переписку, звонки, чеки и сведения о встрече с курьером</p></div></li>
              <li><span>3</span><div><strong>Зафиксируйте хищение</strong><p>Сообщите в полицию и получите номер КУСП</p></div></li>
            </ol>
            <a href="#first-steps">Скачать не нужно — инструкция ниже <span>↓</span></a>
          </aside>
        </div>
        <div className="container hero-stat-row">
          <div className="stat-intro">Почему важно действовать<br />системно и без промедления</div>
          <div className="stat-value">980 тыс.</div>
          <div className="stat-copy">
            операций без добровольного согласия клиентов с использованием карт зафиксировал Банк России в 2025 году
          </div>
          <a className="source-link" href="https://www.cbr.ru/analytics/ib/operations_survey/2025/" target="_blank" rel="noreferrer">Источник: Банк России ↗</a>
        </div>
      </section>

      <section className="intro-statement" aria-labelledby="intro-statement-title">
        <div className="container intro-statement-grid">
          <div className="intro-statement-label">
            <span>Если это произошло с вами</span>
            <strong>Не оставайтесь с проблемой один на один</strong>
          </div>
          <div className="intro-statement-copy">
            <h2 id="intro-statement-title">Стали жертвой мошенников? Деньги похищены, а надежда тает?</h2>
            <p>Мы знаем, как действовать. Поможем разобраться в ситуации, сохранить доказательства и выстроить правовую стратегию: от заявления в полицию и обращения в банк до требований к установленным получателям денег и суда.</p>
            <a href={`tel:${phone}`}>Обсудить ситуацию <span>→</span></a>
          </div>
        </div>
      </section>

      <section className="section section-light" id="situations">
        <div className="container">
          <div className="section-heading split-heading">
            <div>
              <div className="eyebrow dark"><span /> С чем обращаются</div>
              <h2>Обман меняется.<br />Право — остаётся.</h2>
            </div>
            <p>Неважно, перевели вы деньги сами, их списали без согласия или наличные забрал курьер. Важно быстро восстановить события и не потерять доказательства.</p>
          </div>
          <div className="situation-grid">
            {situations.map((item) => (
              <article className="situation-card" key={item.number}>
                <div className="situation-number">{item.number}</div>
                <div className="situation-arrow" aria-hidden="true">↗</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <span className="tag">{item.tag}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="courier-section" aria-labelledby="courier-title">
        <div className="container courier-grid">
          <div className="courier-heading">
            <div className="eyebrow"><span /> Отдельное направление</div>
            <h2 id="courier-title">Если деньги забрал курьер</h2>
            <p>Передача наличных из рук в руки не означает, что правовых вариантов нет. Здесь особенно важны скорость, точная фиксация встречи и установление человека, который получил деньги.</p>
          </div>
          <div className="courier-content">
            <h3>Как мы можем помочь</h3>
            <ul>
              <li><span>01</span><p><strong>Собрать следы передачи.</strong> Время и место встречи, приметы курьера, кодовое слово, телефон, автомобиль, упаковка, свидетели и камеры наблюдения.</p></li>
              <li><span>02</span><p><strong>Подготовить заявление.</strong> Изложить всю схему, обозначить доказательства и ходатайствовать об их своевременном истребовании.</p></li>
              <li><span>03</span><p><strong>Контролировать расследование.</strong> Следить за процессуальными решениями, добиваться признания потерпевшим и знакомиться с доступными материалами.</p></li>
              <li><span>04</span><p><strong>Оценить взыскание.</strong> Если курьер или другой получатель установлен, проверить основания для гражданского иска, включая требование о неосновательном обогащении.</p></li>
            </ul>
            <div className="courier-note">
              <strong>Важно:</strong> взыскание не происходит автоматически. Перспектива зависит от установления участников, доказательств, материалов дела и имущественного положения ответчика.
            </div>
            <div className="courier-sources">
              <span>Проверено по официальным материалам:</span>
              <a href="https://epp.genproc.gov.ru/ru/proc_77/activity/legal-education/fraud/e8577381/" target="_blank" rel="noreferrer">Прокуратура Москвы ↗</a>
              <a href="https://epp.genproc.gov.ru/ru/gprf/mass-media/news/regional/e8419764/" target="_blank" rel="noreferrer">пример судебного взыскания ↗</a>
            </div>
          </div>
        </div>
      </section>

      <section className="first-steps" id="first-steps">
        <div className="container first-steps-grid">
          <div className="steps-title">
            <div className="eyebrow"><span /> Экстренный порядок</div>
            <h2>Что сделать<br />прямо сейчас</h2>
            <p>Эти действия не заменяют индивидуальную консультацию, но помогают сохранить время и доказательства.</p>
          </div>
          <div className="steps-list">
            <article>
              <div className="big-number">01</div>
              <div><h3>Остановить дальнейшие действия</h3><p>Не выполняйте новые указания и ничего больше не передавайте. Если затронуты счёт, карта или банковское приложение, сразу позвоните в банк по официальному номеру. Если курьер ещё в пути — сообщите в полицию по номеру 112.</p></div>
            </article>
            <article>
              <div className="big-number">02</div>
              <div><h3>Сохранить доказательства</h3><p>Не удаляйте переписку и звонки. Запишите точное время и место передачи, приметы курьера, кодовое слово, номер автомобиля, свидетелей и расположение камер.</p></div>
            </article>
            <article>
              <div className="big-number">03</div>
              <div><h3>Обратиться в полицию</h3><p>Опишите всю хронологию и отдельно укажите передачу наличных или ценностей. Приложите доказательства, сохраните талон-уведомление и номер КУСП.</p></div>
            </article>
            <article>
              <div className="big-number">04</div>
              <div className="step-contact"><h3>Обратиться к нам</h3><p>Расскажите, как именно были переданы деньги. Юрист уточнит обстоятельства, подскажет, какие доказательства собрать в первую очередь, и предложит следующий правовой шаг.</p><a href={`tel:${phone}`}>Позвонить и обсудить ситуацию <span>→</span></a></div>
            </article>
          </div>
        </div>
      </section>

      <section className="section process-section" id="process">
        <div className="container">
          <div className="section-heading centered-heading">
            <div className="eyebrow dark"><span /> Как работаем</div>
            <h2>От хаоса — к понятному плану</h2>
            <p>Один специалист держит в фокусе документы, сроки и следующий шаг.</p>
          </div>
          <div className="process-line">
            <article><span>01</span><h3>Разбираем факты</h3><p>Восстанавливаем хронологию, суммы и участников.</p></article>
            <article><span>02</span><h3>Оцениваем варианты</h3><p>Проверяем основания и называем ограничения.</p></article>
            <article><span>03</span><h3>Готовим документы</h3><p>Обращения, заявления, претензии или иск.</p></article>
            <article><span>04</span><h3>Сопровождаем</h3><p>Контролируем ответы и корректируем стратегию.</p></article>
          </div>
        </div>
      </section>

      <section className="section services-section" id="services">
        <div className="container">
          <div className="section-heading split-heading services-heading">
            <div>
              <div className="eyebrow dark"><span /> Направления работы</div>
              <h2>Юридическая помощь<br />под вашу задачу</h2>
            </div>
            <p>От первой консультации и подготовки документов до участия адвоката и сопровождения сложного спора. Подберём профильного специалиста после короткого разговора.</p>
          </div>
          <div className="services-grid">
            {legalServices.map((item) => (
              <article className="service-card" key={item.number}>
                <div className="service-card-top">
                  <span className="service-number">{item.number}</span>
                  <span className="service-mark" aria-hidden="true">{item.mark}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <ul>
                  {item.details.map((detail) => <li key={detail}>{detail}</li>)}
                </ul>
                <a href={`tel:${phone}`}>Обсудить задачу <span>→</span></a>
              </article>
            ))}
          </div>
          <p className="services-note">Точный объём работы и условия сопровождения определяются после анализа задачи и документов.</p>
        </div>
      </section>

      <section className="section advantages-section">
        <div className="container advantages-grid">
          <div>
            <div className="eyebrow dark"><span /> Наш подход</div>
            <h2>По-человечески.<br />По закону. По шагам.</h2>
          </div>
          <div className="advantage-list">
            <article><span>01</span><div><h3>Честная оценка</h3><p>Не гарантируем возврат до анализа документов и не скрываем риски.</p></div></article>
            <article><span>02</span><div><h3>Комплексная работа</h3><p>Соединяем обращения в банк, работу с уголовным делом и гражданско-правовые требования к установленным получателям денег.</p></div></article>
            <article><span>03</span><div><h3>Понятный язык</h3><p>Объясняем, что делаем, зачем это нужно и какой ответ ожидаем.</p></div></article>
            <article><span>04</span><div><h3>Личный приём в Москве</h3><p>Можно встретиться в офисе или начать с разговора по телефону.</p></div></article>
          </div>
        </div>
      </section>

      <section className="consultation-section">
        <div className="container consultation-grid">
          <div>
            <div className="eyebrow"><span /> С чего начать</div>
            <h2>Расскажите, что произошло</h2>
          </div>
          <div className="consultation-copy">
            <p>Подготовьте дату, сумму, способ передачи денег, любые сохранившиеся контакты и описание курьера, если он был. Этого достаточно, чтобы начать разговор.</p>
            <div className="consultation-actions">
              <a className="button button-accent" href={`tel:${phone}`}>Позвонить юристу</a>
              <div><span>Телефон</span><a href={`tel:${phone}`}>+7 (917) 584-40-40</a></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section faq-section">
        <div className="container faq-grid">
          <div>
            <div className="eyebrow dark"><span /> Важно знать</div>
            <h2>Коротко о главном</h2>
          </div>
          <div className="faq-list">
            <details>
              <summary>Можно ли гарантировать возврат денег?<span>+</span></summary>
              <p>Нет. Итог зависит от способа списания, действий клиента и банка, получателя, сохранённых доказательств и процессуальных решений. До анализа обещать возврат некорректно.</p>
            </details>
            <details>
              <summary>Что взять на консультацию?<span>+</span></summary>
              <p>Выписку по счёту, чеки, переписку, ссылки, номера телефонов, ответы банка и полиции — всё, что помогает восстановить последовательность событий.</p>
            </details>
            <details>
              <summary>Если банк уже отказал, поздно обращаться?<span>+</span></summary>
              <p>Не обязательно. Нужно изучить основания отказа, порядок подтверждения операции и соблюдение банком обязательных процедур.</p>
            </details>
            <details>
              <summary>Если наличные передали курьеру, можно ли помочь?<span>+</span></summary>
              <p>Да, такую ситуацию нужно разбирать отдельно. Важно установить курьера, быстро получить записи камер и другие следы встречи, контролировать уголовное дело и оценить гражданские требования к установленным участникам. Возможность фактического возврата зависит от обстоятельств дела и не может быть гарантирована заранее.</p>
            </details>
            <details>
              <summary>Вы работаете только в Москве?<span>+</span></summary>
              <p>Офис находится в Москве. Возможность дистанционной работы по конкретному делу уточняется после первичного разговора.</p>
            </details>
          </div>
        </div>
      </section>

      <section className="office-section" id="office">
        <div className="container office-grid">
          <div className="office-info">
            <div className="eyebrow"><span /> Контакты</div>
            <h2>Будем на связи</h2>
            <div className="contact-row"><span>Телефон</span><a href={`tel:${phone}`}>+7 (917) 584-40-40</a></div>
            <div className="contact-row"><span>Адрес</span><p>г. Москва, ул. Куликовская, д. 6<br />ТЦ «Алфавит», 1 этаж</p></div>
            <a className="route-link" href="https://yandex.ru/maps/?text=Москва%2C%20Куликовская%20улица%2C%206" target="_blank" rel="noreferrer">Построить маршрут ↗</a>
          </div>
          <div className="map-card">
            <iframe
              className="yandex-map"
              src="https://yandex.ru/map-widget/v1/?mode=search&text=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0%2C%20%D0%9A%D1%83%D0%BB%D0%B8%D0%BA%D0%BE%D0%B2%D1%81%D0%BA%D0%B0%D1%8F%20%D1%83%D0%BB%D0%B8%D1%86%D0%B0%2C%206&z=16&lang=ru_RU"
              title="Яндекс Карта: ТЦ «Алфавит», Москва, Куликовская улица, 6"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <footer>
        <div className="container footer-top">
          <a className="brand footer-brand" href="#top" aria-label="Народный юрист — наверх">
            <span className="brand-mark">НЮ</span>
            <span><strong>Народный юрист</strong><small>Право на вашей стороне</small></span>
          </a>
          <p>Юридическая помощь пострадавшим<br />от мошенничества и денежных хищений</p>
          <a className="footer-phone" href={`tel:${phone}`}>+7 (917) 584-40-40</a>
        </div>
        <div className="container footer-bottom">
          <p>ИП Милевский Александр Александрович · ИНН 775101196352 · ОГРН 326774600529055</p>
          <p>Информация на сайте не является гарантией результата. © 2026</p>
        </div>
      </footer>
    </main>
  );
}
