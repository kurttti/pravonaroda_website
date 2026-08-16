<?php

require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/../src/contact-mailer.php';

$exampleConfig = require __DIR__ . '/../config/mail-config.example.php';
if ($exampleConfig['smtp_port'] !== 465 || $exampleConfig['smtp_encryption'] !== 'smtps') {
    throw new RuntimeException('SpaceWeb SMTP must use encrypted port 465.');
}

if (resolve_contact_smtp_encryption($exampleConfig) !== PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS) {
    throw new RuntimeException('SMTPS configuration was not resolved correctly.');
}

$content = build_contact_email_content([
    'name' => 'Анна Иванова',
    'phone' => '+7 999 123-45-67',
    'message' => "Передала деньги курьеру.\nЕсть номер телефона.",
], 1786879800);

if ($content['subject'] !== 'Новая заявка с pravonaroda.ru') {
    throw new RuntimeException('Subject must be fixed and must not contain user input');
}

foreach (['Анна Иванова', '+7 999 123-45-67', 'Передала деньги курьеру.', 'Есть номер телефона.', 'по московскому времени'] as $expected) {
    if (strpos($content['body'], $expected) === false) {
        throw new RuntimeException('Message body is missing: ' . $expected);
    }
}

echo "contact-mailer: ok\n";
