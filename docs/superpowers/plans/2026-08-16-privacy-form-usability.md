# Privacy Policy and Contact Form Usability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Исправить пересечение заголовка политики, удалить дату публикации, сделать комментарий необязательным и показывать русские сообщения браузерной валидации.

**Architecture:** Сохранить существующую структуру React/CSS/PHP. Проверить публичное поведение через статический рендер, вынести русские тексты браузерной валидации в чистую функцию, а правило необязательного комментария одинаково применить в React-форме и PHP-валидаторе.

**Tech Stack:** React 19, TypeScript, CSS, PHP 7.1+, Node test runner, vinext/Vite.

## Global Constraints

- Слово «конфиденциальности» не переносится и не перекрывает правую колонку.
- Поле `message` необязательно, но заполненное значение ограничено 4000 символами.
- Имя, телефон и согласие остаются обязательными.
- Пользовательские сообщения браузерной валидации выводятся на русском.
- Подпись с датой публикации удаляется.

---

### Task 1: Зафиксировать новое публичное поведение формы и политики

**Files:**
- Modify: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: HTML, сформированный текущими страницами.
- Produces: регрессионные проверки необязательного `message`, русских текстов валидации, отсутствия даты и безопасной разметки заголовка.

- [ ] **Step 1: Write the failing render tests**

Добавить проверки, что `textarea[name="message"]` не содержит `required` и `minlength`, дата публикации отсутствует, а заголовок размечен двумя `span`. Проверить наличие русских `data-validation-message` у обязательных полей; форма использует эти значения как реальные тексты `setCustomValidity()`.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`

Expected: FAIL, потому что текущий комментарий обязателен, дата присутствует, а локализованные сообщения и отдельные строки заголовка ещё не добавлены.

- [ ] **Step 3: Leave implementation to Tasks 2 and 3**

Не изменять ожидания после подтверждённого RED.

### Task 2: Сделать комментарий необязательным и локализовать браузерную валидацию

**Files:**
- Modify: `app/contact-form.tsx`
- Modify: `spaceweb/tests/request-validation-test.php`
- Modify: `spaceweb/src/request-validation.php`

**Interfaces:**
- Produces: обязательные поля с русским `data-validation-message`, который обработчик `onInvalid` передаёт в `setCustomValidity()`.
- Produces: `validate_contact_request()` принимает пустой `message` и отклоняет заполненный текст длиннее 4000 символов.

- [ ] **Step 1: Write the failing PHP test**

Добавить вызов `validate_contact_request(array_merge($validInput, ['message' => '']))` и ожидание `ok === true` и сохранённого пустого значения.

- [ ] **Step 2: Run the PHP test to verify it fails**

Run: `php spaceweb/tests/request-validation-test.php`

Expected: FAIL with `Empty optional message must pass`.

- [ ] **Step 3: Implement optional server-side message validation**

Проверять ошибку только при `$messageLength > 4000`; сообщение ошибки — `Описание не должно превышать 4000 символов.`.

- [ ] **Step 4: Implement localized client validation**

Добавить обязательным полям соответствующие атрибуты:

```ts
data-validation-message="Укажите ваше имя — не менее 2 символов."
data-validation-message="Укажите номер телефона."
data-validation-message="Подтвердите согласие на обработку персональных данных."
```

Подключить обработчики `onInvalid`, очищать `setCustomValidity("")` на `onInput`/`onChange`, удалить у `textarea` атрибуты `required` и `minLength`.

- [ ] **Step 5: Run focused tests**

Run: `php spaceweb/tests/request-validation-test.php && npm test`

Expected: PHP test passes; render test can оставаться красным только по ещё не реализованной странице политики.

### Task 3: Исправить композицию политики и актуализировать текст

**Files:**
- Modify: `app/politika-konfidencialnosti/page.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Produces: двухстрочный `h1` с классами `.legal-title-line` и `.legal-title-long`.
- Produces: политика, в которой описание ситуации обозначено как необязательное.

- [ ] **Step 1: Update policy markup and copy**

Разметить заголовок двумя строками, удалить дату и заменить утверждения об обязательном описании на формулировки «описание ситуации, если пользователь решил его указать» и «Без имени, телефона и согласия...».

- [ ] **Step 2: Add responsive title sizing**

Сделать строки блочными, для длинной строки задать `white-space: nowrap` и размер через container-relative `clamp()`/медиазапрос так, чтобы она помещалась в колонку; на ширине до 760px вернуть обычный адаптивный размер без горизонтального переполнения.

- [ ] **Step 3: Run all tests**

Run: `npm test && for test_file in spaceweb/tests/*-test.php; do php "$test_file"; done`

Expected: all Node and PHP tests pass.

### Task 4: Финальная проверка и сборка для SpaceWeb

**Files:**
- Verify: all modified files

**Interfaces:**
- Produces: готовые артефакты основной сборки и `spaceweb-dist`.

- [ ] **Step 1: Run static checks**

Run: `npm run lint && git diff --check`

Expected: exit 0 without errors.

- [ ] **Step 2: Build SpaceWeb package**

Run: `npm run build:spaceweb`

Expected: exit 0 and staged backend included.

- [ ] **Step 3: Commit the implementation**

```bash
git add app/contact-form.tsx app/politika-konfidencialnosti/page.tsx app/globals.css tests/rendered-html.test.mjs spaceweb/src/request-validation.php spaceweb/tests/request-validation-test.php docs/superpowers/plans/2026-08-16-privacy-form-usability.md
git commit -m "Improve privacy page and contact form usability"
```
