/* eslint-disable @next/next/no-html-link-for-pages */
import type { Metadata } from "next";
import { MessageIcon, SiteFooter, SiteHeader } from "../site-components";
import { fraudPath, phone, situations, siteUrl } from "../site-data";

export const metadata: Metadata = {
  title: "Помощь при мошенничестве: деньги, наличные и ценности",
  description: "Что делать после хищения денег или ценностей, перевода мошенникам, незаконного списания или передачи курьеру. Юридическая помощь в Москве.",
  alternates: { canonical: `${siteUrl}${fraudPath.slice(1)}` },
};

export default function FraudHelpPage() {
  return (
    <main>
      <SiteHeader detail />

      <section className="detail-hero" id="top">
        <div className="container detail-hero-grid">
          <div>
            <div className="eyebrow"><span /> Профильное направление</div>
            <h1>Юридическая помощь<br />при <em>мошенничестве</em></h1>
          </div>
          <div className="detail-hero-copy">
            <p>Помогаем, если деньги списали без согласия, вы перевели их под влиянием обмана или передали наличные, украшения и другие ценности курьеру.</p>
            <div className="hero-actions">
              <a className="button button-primary" href={`tel:${phone}`}>Позвонить нам</a>
              <a className="button button-outline-light button-message" href="/#request"><MessageIcon />Написать</a>
            </div>
          </div>
        </div>
      </section>

      <section className="first-steps" id="first-steps">
        <div className="container first-steps-grid">
          <div className="steps-title">
            <div className="eyebrow"><span /> Первые действия</div>
            <h2>Что сделать<br />прямо сейчас</h2>
            <p>Эти действия не заменяют индивидуальную консультацию, но помогают сохранить время и доказательства.</p>
          </div>
          <div className="steps-list">
            <article><div className="big-number">01</div><div><h3>Остановить дальнейшие действия</h3><p>Не выполняйте новые указания и ничего больше не передавайте. Если затронуты счёт, карта или банковское приложение, сразу позвоните в банк по официальному номеру.</p></div></article>
            <article><div className="big-number">02</div><div><h3>Сохранить доказательства</h3><p>Не удаляйте переписку и звонки. Сохраните чеки, номера телефонов, ссылки, время событий и сведения о встрече с курьером.</p></div></article>
            <article><div className="big-number">03</div><div className="step-contact"><h3>Связаться с нами</h3><p>Юрист уточнит обстоятельства, подскажет, какие материалы собрать в первую очередь, и предложит следующий правовой шаг.</p><a href={`tel:${phone}`}>Позвонить и обсудить ситуацию <span>→</span></a></div></article>
          </div>
        </div>
      </section>

      <section className="section section-light" id="situations">
        <div className="container">
          <div className="section-heading split-heading">
            <div><div className="eyebrow dark"><span /> С чем обращаются</div><h2>Разные схемы.<br />Одна задача.</h2></div>
            <p>Восстановить события, сохранить доказательства и выбрать правовой путь с учётом способа хищения.</p>
          </div>
          <div className="situation-grid">
            {situations.map((item) => (
              <article className="situation-card" key={item.number}>
                <div className="situation-number">{item.number}</div><div className="situation-arrow" aria-hidden="true">↗</div>
                <h3>{item.title}</h3><p>{item.text}</p><span className="tag">{item.tag}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="courier-section" aria-labelledby="courier-title">
        <div className="container courier-grid">
          <div className="courier-heading">
            <div className="eyebrow"><span /> Наличные и ценности</div>
            <h2 id="courier-title">Если деньги или ценности забрал курьер</h2>
            <p>Передача из рук в руки не означает, что правовых вариантов нет. Здесь особенно важны скорость, точная фиксация встречи и установление получателя.</p>
          </div>
          <div className="courier-content">
            <h3>Как мы можем помочь</h3>
            <ul>
              <li><span>01</span><p><strong>Собрать следы передачи.</strong> Время и место встречи, приметы курьера, кодовое слово, телефон, автомобиль, упаковка, свидетели и камеры.</p></li>
              <li><span>02</span><p><strong>Подготовить заявление.</strong> Изложить схему, обозначить доказательства и ходатайствовать об их своевременном истребовании.</p></li>
              <li><span>03</span><p><strong>Контролировать расследование.</strong> Следить за решениями, добиваться признания потерпевшим и знакомиться с доступными материалами.</p></li>
              <li><span>04</span><p><strong>Оценить взыскание.</strong> Если получатель установлен, проверить основания для гражданского иска.</p></li>
            </ul>
            <div className="courier-note"><strong>Важно:</strong> взыскание не происходит автоматически. Перспектива зависит от доказательств, материалов дела и имущественного положения ответчика.</div>
          </div>
        </div>
      </section>

      <section className="section process-section" id="process">
        <div className="container">
          <div className="section-heading centered-heading"><div className="eyebrow dark"><span /> Как работаем</div><h2>От хаоса — к понятному плану</h2><p>Один специалист держит в фокусе документы, сроки и следующий шаг.</p></div>
          <div className="process-line">
            <article><span>01</span><h3>Разбираем факты</h3><p>Восстанавливаем хронологию, суммы и участников.</p></article>
            <article><span>02</span><h3>Оцениваем варианты</h3><p>Проверяем основания и называем ограничения.</p></article>
            <article><span>03</span><h3>Готовим документы</h3><p>Обращения, заявления, претензии или иск.</p></article>
            <article><span>04</span><h3>Сопровождаем</h3><p>Контролируем ответы и корректируем стратегию.</p></article>
          </div>
        </div>
      </section>

      <section className="section advantages-section">
        <div className="container advantages-grid">
          <div><div className="eyebrow dark"><span /> Наш подход</div><h2>По-человечески.<br />По закону.<br />По шагам.</h2></div>
          <div className="advantage-list">
            <article><span>01</span><div><h3>Честная оценка</h3><p>Не гарантируем возврат до анализа документов и не скрываем риски.</p></div></article>
            <article><span>02</span><div><h3>Комплексная работа</h3><p>Соединяем обращения в банк, уголовное дело и гражданско-правовые требования.</p></div></article>
            <article><span>03</span><div><h3>Понятный язык</h3><p>Объясняем, что делаем, зачем это нужно и какой ответ ожидаем.</p></div></article>
            <article><span>04</span><div><h3>Личный приём в Москве</h3><p>Можно встретиться в офисе или начать с разговора по телефону.</p></div></article>
          </div>
        </div>
      </section>

      <section className="detail-cta">
        <div className="container detail-cta-inner"><div><span>Готовы обсудить ситуацию?</span><h2>Начнём с короткого разговора</h2></div><div><a className="button button-accent" href={`tel:${phone}`}>Позвонить юристу</a><a href="/#request">Оставить заявку →</a></div></div>
      </section>

      <SiteFooter detail />
    </main>
  );
}
