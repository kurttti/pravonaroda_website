# SMTP Contact Form Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enable the existing contact form and deliver validated client requests to `support@pravonaroda.ru` through authenticated SpaceWeb SMTP.

**Architecture:** The React form posts JSON-compatible form data to a PHP endpoint on the primary SpaceWeb domain. Public PHP delegates validation, rate limiting, and PHPMailer SMTP delivery to code deployed above `public_html`; the SMTP password lives in a separate private config that is uploaded once and never committed. The static Sites build remains deployable, while live form delivery is owned by `pravonaroda.ru` on SpaceWeb.

**Tech Stack:** React 19, TypeScript, Vinext/Vite, PHP 7.1-compatible syntax, PHPMailer 6.12.0, SpaceWeb SMTP over SSL/465, Node test runner, GitHub Actions, lftp.

## Global Constraints

- SMTP host is `smtp.spaceweb.ru`, port is `465`, encryption is SSL, and authentication is required.
- SMTP username, From address, and recipient are all `support@pravonaroda.ru`.
- The password must never enter Git, `public_html`, client JavaScript, build logs, or user-facing error messages.
- The private production config path is `/pravonaroda_ru/private/mail-config.php`.
- Accept names of 2–80 characters, phones containing 7–20 digits, and descriptions of 10–4000 characters.
- Allow at most five submission attempts per hashed IP during any 15-minute window.
- Store no request body on disk; the rate limiter stores only a hash and timestamps.
- Require explicit personal-data consent and link to `/politika-konfidencialnosti/`.
- Keep all PHP syntax compatible with PHP 7.1.

---

## File Map

- Create `spaceweb/composer.json` and `spaceweb/composer.lock`: pin PHPMailer 6.12.0.
- Create `spaceweb/src/request-validation.php`: normalize and validate form input.
- Create `spaceweb/src/rate-limiter.php`: file-backed hashed-IP attempt limiter.
- Create `spaceweb/src/contact-mailer.php`: configure PHPMailer and send the message.
- Create `spaceweb/bootstrap.php`: load dependencies and private modules.
- Create `spaceweb/api/send-request.php`: public HTTP boundary and JSON responses.
- Create `spaceweb/config/mail-config.example.php`: safe config shape without secrets.
- Create `spaceweb/tests/request-validation-test.php` and `spaceweb/tests/rate-limiter-test.php`: CLI behavior tests.
- Create `scripts/stage-spaceweb-backend.mjs`: stage public and private PHP artifacts.
- Modify `package.json`: include backend staging in `build:spaceweb`.
- Modify `.github/workflows/deploy-spaceweb.yml`: install/test PHP and upload private application code separately.
- Modify `.gitignore`: ignore Composer vendor and private build output.
- Modify `app/contact-form.tsx`: enable asynchronous submission and accessible states.
- Modify `app/globals.css`: consent, honeypot, status, and loading styles.
- Modify `app/page.tsx`: replace the obsolete “after connecting mail” copy.
- Create `app/politika-konfidencialnosti/page.tsx`: privacy page.
- Modify `src/entry-client.tsx`, `src/entry-server.tsx`, and `scripts/prerender.mjs`: route and prerender the privacy page.
- Modify `public/sitemap.xml`: publish the privacy URL.
- Modify `tests/rendered-html.test.mjs`: assert the live form and privacy route.

---

### Task 1: Pure Request Validation

**Files:**
- Create: `spaceweb/tests/request-validation-test.php`
- Create: `spaceweb/src/request-validation.php`

**Interfaces:**
- Produces: `validate_contact_request(array $input): array` returning `['ok' => bool, 'data' => array, 'errors' => array, 'bot' => bool]`.
- Produces normalized data keys: `name`, `phone`, `message`, `consent`.

- [ ] **Step 1: Install a local PHP CLI when `php` is unavailable**

Run:

```bash
brew install php
php -v
```

Expected: a PHP CLI version is printed. Production compatibility remains enforced separately by CI on PHP 7.1.

- [ ] **Step 2: Write the failing validation test**

Create a dependency-free test harness and assertions for valid input, missing consent, a six-digit phone, a 4,001-character message, and a filled `website` honeypot:

```php
<?php
require __DIR__ . '/../src/request-validation.php';

function expect_true($condition, $message) {
    if (!$condition) {
        throw new RuntimeException($message);
    }
}

$valid = validate_contact_request([
    'name' => 'Анна',
    'phone' => '+7 (999) 123-45-67',
    'message' => 'Передала наличные человеку, который представился курьером.',
    'consent' => '1',
    'website' => '',
]);
expect_true($valid['ok'] === true, 'Valid request must pass');
expect_true($valid['data']['phone'] === '+7 (999) 123-45-67', 'Phone must be preserved');

$withoutConsent = validate_contact_request(array_merge($valid['data'], ['consent' => '0']));
expect_true(isset($withoutConsent['errors']['consent']), 'Consent must be required');

$shortPhone = validate_contact_request(array_merge($valid['data'], ['phone' => '123456']));
expect_true(isset($shortPhone['errors']['phone']), 'Phone must contain at least seven digits');

$longMessage = validate_contact_request(array_merge($valid['data'], ['message' => str_repeat('а', 4001)]));
expect_true(isset($longMessage['errors']['message']), 'Message must not exceed 4000 characters');

$bot = validate_contact_request(array_merge($valid['data'], ['website' => 'https://spam.example']));
expect_true($bot['bot'] === true && $bot['ok'] === false, 'Honeypot must reject bots');

echo "request-validation: ok\n";
```

- [ ] **Step 3: Run the test and verify RED**

Run: `php spaceweb/tests/request-validation-test.php`

Expected: FAIL because `spaceweb/src/request-validation.php` does not exist.

- [ ] **Step 4: Implement minimal validation**

Implement `validate_contact_request()` with `trim`, `mb_strlen`, digit counting via `preg_replace('/\D+/', '', $phone)`, exact limits from Global Constraints, and field-specific Russian error messages. Treat a non-empty `website` value as `bot: true` and never include it in normalized data.

```php
function validate_contact_request(array $input) {
    $name = trim((string)($input['name'] ?? ''));
    $phone = trim((string)($input['phone'] ?? ''));
    $message = trim((string)($input['message'] ?? ''));
    $consent = (string)($input['consent'] ?? '');
    $website = trim((string)($input['website'] ?? ''));
    $errors = [];

    if ($website !== '') {
        return ['ok' => false, 'data' => [], 'errors' => [], 'bot' => true];
    }
    if (mb_strlen($name, 'UTF-8') < 2 || mb_strlen($name, 'UTF-8') > 80) {
        $errors['name'] = 'Укажите имя длиной от 2 до 80 символов.';
    }
    $digitCount = strlen(preg_replace('/\D+/', '', $phone));
    if ($digitCount < 7 || $digitCount > 20 || strlen($phone) > 40) {
        $errors['phone'] = 'Укажите корректный номер телефона.';
    }
    if (mb_strlen($message, 'UTF-8') < 10 || mb_strlen($message, 'UTF-8') > 4000) {
        $errors['message'] = 'Описание должно содержать от 10 до 4000 символов.';
    }
    if ($consent !== '1') {
        $errors['consent'] = 'Необходимо согласие на обработку персональных данных.';
    }

    return [
        'ok' => count($errors) === 0,
        'data' => compact('name', 'phone', 'message', 'consent'),
        'errors' => $errors,
        'bot' => false,
    ];
}
```

- [ ] **Step 5: Verify GREEN and syntax compatibility**

Run:

```bash
php spaceweb/tests/request-validation-test.php
php -l spaceweb/src/request-validation.php
```

Expected: `request-validation: ok` and `No syntax errors detected`.

- [ ] **Step 6: Commit**

```bash
git add spaceweb/src/request-validation.php spaceweb/tests/request-validation-test.php
git commit -m "Add contact request validation"
```

---

### Task 2: Rate Limiting and SMTP Delivery Boundary

**Files:**
- Create: `spaceweb/tests/rate-limiter-test.php`
- Create: `spaceweb/src/rate-limiter.php`
- Create: `spaceweb/src/contact-mailer.php`
- Create: `spaceweb/bootstrap.php`
- Create: `spaceweb/api/send-request.php`
- Create: `spaceweb/config/mail-config.example.php`
- Create: `spaceweb/composer.json`
- Create: `spaceweb/composer.lock`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: `validate_contact_request(array $input): array`.
- Produces: `contact_rate_limit_allow(string $ip, string $runtimeDir, int $now): bool`.
- Produces: `send_contact_email(array $request, array $config): void`, throwing on SMTP failure.
- Produces: `POST /api/send-request.php` JSON `{ok: true, message: string}` or `{ok: false, message: string, errors?: object}`.

- [ ] **Step 1: Write the failing rate-limit test**

Use a unique temporary directory, assert five allowed calls, a blocked sixth call, and a new allowed call after 901 seconds. Remove only the created temporary files at test teardown.

```php
<?php
require __DIR__ . '/../src/rate-limiter.php';
$dir = sys_get_temp_dir() . '/pravonaroda-rate-' . bin2hex(random_bytes(6));
mkdir($dir, 0700, true);
for ($i = 0; $i < 5; $i++) {
    if (!contact_rate_limit_allow('203.0.113.10', $dir, 1700000000)) {
        throw new RuntimeException('First five attempts must pass');
    }
}
if (contact_rate_limit_allow('203.0.113.10', $dir, 1700000000)) {
    throw new RuntimeException('Sixth attempt must be blocked');
}
if (!contact_rate_limit_allow('203.0.113.10', $dir, 1700000901)) {
    throw new RuntimeException('Expired attempts must be discarded');
}
echo "rate-limiter: ok\n";
```

- [ ] **Step 2: Run the test and verify RED**

Run: `php spaceweb/tests/rate-limiter-test.php`

Expected: FAIL because `spaceweb/src/rate-limiter.php` does not exist.

- [ ] **Step 3: Implement the rate limiter**

Hash the IP with SHA-256, use one JSON file per hash, lock it with `flock(LOCK_EX)`, retain timestamps newer than `$now - 900`, append the current attempt only when fewer than five remain, and write with `ftruncate`, `rewind`, and `fwrite`. Create `$runtimeDir` as `0700` if missing.

- [ ] **Step 4: Verify rate-limit GREEN**

Run:

```bash
php spaceweb/tests/rate-limiter-test.php
php -l spaceweb/src/rate-limiter.php
```

Expected: `rate-limiter: ok` and no syntax errors.

- [ ] **Step 5: Pin PHPMailer and install it**

Create:

```json
{
  "require": { "phpmailer/phpmailer": "6.12.0" },
  "config": {
    "sort-packages": true,
    "platform": { "php": "7.1.0" }
  }
}
```

Run:

```bash
composer update --working-dir=spaceweb --no-dev --prefer-dist --no-interaction
```

Add `/spaceweb/vendor/` and `/spaceweb-private-dist/` to `.gitignore`; commit `composer.lock`, not `vendor`.

- [ ] **Step 6: Implement the mailer and bootstrap**

`contact-mailer.php` must configure PHPMailer with `isSMTP()`, `Host`, `SMTPAuth = true`, `SMTPSecure = PHPMailer::ENCRYPTION_SMTPS`, port 465, UTF-8, From/To `support@pravonaroda.ru`, From name `Сайт «Народный юрист»`, and a plain-text body containing Moscow timestamp, name, phone, and message. No user value may set From, To, Reply-To, or transport fields.

`bootstrap.php` must require Composer autoload plus the three focused source files. `mail-config.example.php` must return the exact non-secret shape:

```php
<?php
return [
    'smtp_host' => 'smtp.spaceweb.ru',
    'smtp_port' => 465,
    'smtp_username' => 'support@pravonaroda.ru',
    'smtp_password' => 'replace-outside-git',
    'from_email' => 'support@pravonaroda.ru',
    'to_email' => 'support@pravonaroda.ru',
];
```

- [ ] **Step 7: Implement the public endpoint**

The endpoint must:

1. set `Content-Type: application/json; charset=utf-8`, `Cache-Control: no-store`, and `X-Content-Type-Options: nosniff`;
2. return 405 for non-POST requests;
3. reject an explicitly foreign `Origin` or `Referer` with 403 while accepting `https://pravonaroda.ru` and `https://www.pravonaroda.ru`;
4. locate project root with `dirname(__DIR__, 2)` and load `/app/bootstrap.php` plus `/private/mail-config.php`;
5. validate `$_POST`, silently return success for a honeypot hit, enforce the rate limit in `/runtime`, and return 422 field errors when validation fails;
6. call `send_contact_email()` and return 200 on success;
7. catch `Throwable`, log only a generated incident ID plus the internal exception message to the server error log, and return a generic 500 message with the incident ID.

- [ ] **Step 8: Verify PHP files and tests**

Run:

```bash
php spaceweb/tests/request-validation-test.php
php spaceweb/tests/rate-limiter-test.php
find spaceweb -name '*.php' -not -path '*/vendor/*' -exec php -l {} \;
```

Expected: two `ok` lines and no syntax errors.

- [ ] **Step 9: Commit**

```bash
git add .gitignore spaceweb
git commit -m "Add secure SpaceWeb SMTP endpoint"
```

---

### Task 3: Stage and Deploy the PHP Application

**Files:**
- Create: `scripts/stage-spaceweb-backend.mjs`
- Modify: `package.json`
- Modify: `.github/workflows/deploy-spaceweb.yml`

**Interfaces:**
- Consumes: `spaceweb/api`, `spaceweb/bootstrap.php`, `spaceweb/src`, and `spaceweb/vendor`.
- Produces: `spaceweb-dist/api/send-request.php` and `spaceweb-private-dist/{bootstrap.php,src,vendor}`.

- [ ] **Step 1: Write a failing artifact assertion**

Run the current build and prove the backend is absent:

```bash
npm run build:spaceweb
test -f spaceweb-dist/api/send-request.php
```

Expected: the `test` command exits non-zero.

- [ ] **Step 2: Implement deterministic staging**

Create a Node script using `fs/promises` that deletes only `spaceweb-private-dist`, recreates destination directories, copies the public endpoint into `spaceweb-dist/api`, and recursively copies bootstrap, `src`, and Composer `vendor` into `spaceweb-private-dist`. Throw a clear error if `spaceweb/vendor/autoload.php` is missing.

Change the script to:

```json
"build:spaceweb": "vite build --config vite.spaceweb.config.ts && vite build --config vite.spaceweb.config.ts --ssr src/entry-server.tsx --outDir .spaceweb-ssr && node scripts/prerender.mjs && node scripts/stage-spaceweb-backend.mjs"
```

- [ ] **Step 3: Verify artifact GREEN and secret absence**

Run:

```bash
npm run build:spaceweb
test -f spaceweb-dist/api/send-request.php
test -f spaceweb-private-dist/vendor/autoload.php
test ! -e spaceweb-dist/mail-config.php
test ! -e spaceweb-private-dist/mail-config.php
rg -n "smtp_password|support@pravonaroda.ru" spaceweb-dist spaceweb-private-dist
```

Expected: artifacts exist, no config file exists, and matches contain only source/config keys or public mailbox values—never the real password.

- [ ] **Step 4: Update GitHub Actions**

Before the Node build, add `shivammathur/setup-php@v2` with PHP `7.1`, `mbstring`, `openssl`, and Composer `v2.2`; run Composer install plus both PHP tests. After the existing `public_html` mirror, add a second lftp mirror:

```bash
mirror --reverse --delete --verbose spaceweb-private-dist/ /pravonaroda_ru/app/;
```

Do not mirror or delete `/pravonaroda_ru/private/` or `/pravonaroda_ru/runtime/`.

- [ ] **Step 5: Commit**

```bash
git add package.json scripts/stage-spaceweb-backend.mjs .github/workflows/deploy-spaceweb.yml
git commit -m "Stage PHP backend for SpaceWeb deployment"
```

---

### Task 4: Privacy Page and Route

**Files:**
- Create: `app/politika-konfidencialnosti/page.tsx`
- Modify: `src/entry-client.tsx`
- Modify: `src/entry-server.tsx`
- Modify: `scripts/prerender.mjs`
- Modify: `public/sitemap.xml`
- Modify: `tests/rendered-html.test.mjs`

**Interfaces:**
- Produces: `/politika-konfidencialnosti/` with operator, purposes, data categories, processing basis, retention rule, security statement, and withdrawal address.

- [ ] **Step 1: Write the failing rendered-route test**

Add a test that renders `/politika-konfidencialnosti/` and asserts status 200 plus the strings `Политика конфиденциальности`, `ИП Милевский Александр Александрович`, `support@pravonaroda.ru`, and `отозвать согласие`.

- [ ] **Step 2: Verify RED**

Run: `npm test`

Expected: FAIL because the current entry router returns the home page for the new path.

- [ ] **Step 3: Implement the privacy page and routing**

Create a static page using `SiteHeader` and `SiteFooter`. State that the form processes name, phone, message, consent, technical request time, and a one-way IP hash used only for abuse prevention; purpose is responding to the request; retention lasts until the purpose is fulfilled or consent is withdrawn unless law requires otherwise; withdrawal is sent to `support@pravonaroda.ru`.

Add the route to both entry files, add its title, description, canonical URL, and output file to `scripts/prerender.mjs`, and add the canonical URL to the sitemap.

- [ ] **Step 4: Verify GREEN**

Run: `npm test`

Expected: all rendered HTML tests pass.

- [ ] **Step 5: Commit**

```bash
git add app/politika-konfidencialnosti src/entry-client.tsx src/entry-server.tsx scripts/prerender.mjs public/sitemap.xml tests/rendered-html.test.mjs
git commit -m "Add contact form privacy policy"
```

---

### Task 5: Enable the Accessible React Form

**Files:**
- Modify: `app/contact-form.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Modify: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: `POST /api/send-request.php`.
- Produces: form states `idle | submitting | success | error` and a same-page accessible status message.

- [ ] **Step 1: Write failing markup assertions**

Assert that home HTML contains `action="/api/send-request.php"`, `method="post"`, `name="consent"`, the privacy URL, and no disabled submit button. Assert the obsolete sentence `После подключения рабочей почты` is absent.

- [ ] **Step 2: Verify RED**

Run: `npm test`

Expected: FAIL on the missing action, consent, and enabled button.

- [ ] **Step 3: Implement client behavior**

Use `useState` and a typed `onSubmit`. Send `new FormData(form)` through `fetch(form.action, {method: 'POST', body, headers: {Accept: 'application/json'}})`. During submission, disable only the button; on success reset the form; on error preserve values. Render status in `<p role="status" aria-live="polite">` and include the phone fallback on error.

The form element must retain normal `action` and `method` attributes for progressive enhancement. Add the off-screen honeypot input named `website`, the required consent checkbox with value `1`, and a link opening the policy in the same tab.

- [ ] **Step 4: Update copy and styles**

Replace the paragraph under “Коротко расскажите” with: `Оставьте имя, телефон и краткое описание ситуации. Заявка поступит специалисту на защищённую рабочую почту.`

Style the consent line, status variants, honeypot, focus states, and loading button. Preserve the existing grid and mobile layout.

- [ ] **Step 5: Verify GREEN**

Run:

```bash
npm test
npm run lint
npm run build:spaceweb
```

Expected: all tests pass and both lint/build exit 0.

- [ ] **Step 6: Commit**

```bash
git add app/contact-form.tsx app/page.tsx app/globals.css tests/rendered-html.test.mjs
git commit -m "Enable SMTP contact request form"
```

---

### Task 6: Configure Production Secret, Publish, and Verify Delivery

**Files:**
- Read only: `.openai/креды sweb.ru`
- Create temporarily outside repository: a `mail-config.php` file under `/tmp`
- No secret-bearing file is committed.

**Interfaces:**
- Consumes credential file lines 1–2 for FTP and lines 4–5 for mailbox/password.
- Produces `/pravonaroda_ru/private/mail-config.php` on SpaceWeb.

- [ ] **Step 1: Run fresh full verification**

Run:

```bash
php spaceweb/tests/request-validation-test.php
php spaceweb/tests/rate-limiter-test.php
npm test
npm run lint
npm run build:spaceweb
git diff --check
```

Expected: every command exits 0.

- [ ] **Step 2: Audit for leaked credentials**

Extract the real mailbox password into a shell variable without printing it, then search tracked and built files for that exact byte sequence. The search must return no matches. Also verify `.openai/креды sweb.ru` remains ignored with `git check-ignore`.

- [ ] **Step 3: Upload the private SMTP config once**

Create a mode-600 temporary PHP config with `mktemp`, populate it from the ignored credential file without echoing values, upload it with lftp to `/pravonaroda_ru/private/mail-config.php`, and remove the temporary file through a shell `trap`. Upload using the existing SpaceWeb FTP login and passive mode; never put credentials in the repository or command output.

- [ ] **Step 4: Push the commits and wait for SpaceWeb deployment**

Push `main` to GitHub. Confirm the `Deploy to SpaceWeb` workflow for the pushed commit succeeds before testing the endpoint.

- [ ] **Step 5: Verify invalid production requests**

Run a POST with missing fields and `Accept: application/json` against `https://pravonaroda.ru/api/send-request.php`.

Expected: HTTP 422 JSON, no SMTP message, and no PHP source disclosure.

- [ ] **Step 6: Send one synthetic production request**

Submit:

```text
Имя: Тест сайта
Телефон: +7 999 000-00-00
Описание: Техническая проверка формы pravonaroda.ru. Это не обращение клиента.
Согласие: 1
```

Expected: HTTP 200 JSON and one message delivered to `support@pravonaroda.ru` with subject `Новая заявка с pravonaroda.ru`.

- [ ] **Step 7: Publish the validated Sites version**

Follow `sites:sites-hosting`: push the exact validated source to the configured Sites repository, package it, save one version, deploy privately, poll to `succeeded`, and open the returned Sites URL.

- [ ] **Step 8: Final user-facing check**

Open `https://pravonaroda.ru/#request`, confirm the enabled button and consent UI render, and report that a synthetic test message was sent. Ask the user only to confirm receipt in the mailbox if inbox access is not available to the agent.
