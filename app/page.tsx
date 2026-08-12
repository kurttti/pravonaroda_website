import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Народный юрист — помощь пострадавшим от мошенничества",
  description:
    "Юридическая помощь при мошенничестве, незаконных списаниях и спорных переводах. Москва, ул. Куликовская, д. 6. Телефон +7 (917) 584-40-40.",
};

const phone = "+79175844040";

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
];

const scenarios = [
  {
    label: "Типовая ситуация 01",
    title: "Перевод по СБП после звонка",
    text: "Фиксируем разговор и движение денег, направляем обращения в банк и полицию, оцениваем основания для претензии и взыскания.",
  },
  {
    label: "Типовая ситуация 02",
    title: "Деньги остались у лжеброкера",
    text: "Проверяем договоры, сайт и получателей платежей, собираем цифровые доказательства и выбираем российский правовой маршрут.",
  },
  {
    label: "Типовая ситуация 03",
    title: "Списание после удалённого доступа",
    text: "Анализируем способ подтверждения операций, действия банка и признаки компрометации устройства — без шаблонных обещаний.",
  },
];

export default function Home() {
  return (
    <main>
      <div className="urgent-bar">
        <div className="container urgent-inner">
          <span>Деньги списали только что?</span>
          <span className="urgent-copy">Сначала заблокируйте карту и сообщите банку об операции.</span>
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
            <a href="#situations">С чем помогаем</a>
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
              Разберём, куда ушли средства, зафиксируем доказательства и выстроим правовой путь: банк, полиция, претензия или суд.
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
              <li><span>1</span><div><strong>Свяжитесь с банком</strong><p>Заблокируйте карту и оспорьте операцию</p></div></li>
              <li><span>2</span><div><strong>Сохраните всё</strong><p>Чеки, номера, переписку и адрес сайта</p></div></li>
              <li><span>3</span><div><strong>Зафиксируйте хищение</strong><p>Подайте заявление и получите номер КУСП</p></div></li>
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

      <section className="section section-light" id="situations">
        <div className="container">
          <div className="section-heading split-heading">
            <div>
              <div className="eyebrow dark"><span /> С чем обращаются</div>
              <h2>Обман меняется.<br />Право — остаётся.</h2>
            </div>
            <p>Неважно, как именно вас убедили расстаться с деньгами. Важно быстро определить юридически значимые факты и не потерять следы операции.</p>
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
              <div><h3>Позвонить в банк</h3><p>Используйте номер с обратной стороны карты или официальный сайт. Попросите заблокировать карту, доступ в приложение и зафиксировать несогласие с операцией.</p></div>
            </article>
            <article>
              <div className="big-number">02</div>
              <div><h3>Не удалять переписку</h3><p>Сделайте скриншоты, сохраните чеки, номера телефонов, ссылки, записи звонков и точное время событий.</p></div>
            </article>
            <article>
              <div className="big-number">03</div>
              <div><h3>Обратиться в полицию</h3><p>Опишите хронологию и приложите доказательства. Сохраните талон-уведомление и номер регистрации заявления.</p></div>
            </article>
            <article>
              <div className="big-number">04</div>
              <div><h3>Не платить «за возврат» незнакомцам</h3><p>Повторные мошенники часто обещают компенсацию за комиссию. Проверяйте исполнителя и не переводите деньги под давлением.</p></div>
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

      <section className="section cases-section">
        <div className="container">
          <div className="section-heading split-heading cases-heading">
            <div>
              <div className="eyebrow"><span /> Типовые обращения</div>
              <h2>Ситуации, в которых<br />нужна точная стратегия</h2>
            </div>
            <p>Это собирательные примеры, а не обещание результата. Конкретный маршрут зависит от документов, скорости обращения и обстоятельств перевода.</p>
          </div>
          <div className="cases-grid">
            {scenarios.map((item) => (
              <article className="case-card" key={item.label}>
                <span>{item.label}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <a href={`tel:${phone}`}>Описать похожий случай →</a>
              </article>
            ))}
          </div>
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
            <article><span>02</span><div><h3>Комплексная работа</h3><p>Соединяем обращения в банк, правоохранительные органы и гражданско-правовые инструменты.</p></div></article>
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
            <p>Подготовьте дату, сумму, название банка и любые сохранившиеся контакты. Этого достаточно, чтобы начать разговор.</p>
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
          <div className="map-card" aria-label="Ориентир офиса">
            <div className="map-grid" />
            <div className="map-ring ring-one" />
            <div className="map-ring ring-two" />
            <div className="map-road road-one" />
            <div className="map-road road-two" />
            <div className="map-pin"><span>НЮ</span></div>
            <div className="map-label"><strong>ТЦ «Алфавит»</strong><span>Куликовская, 6</span></div>
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
