<?php

function build_contact_email_content(array $request, $timestamp = null)
{
    $sentAt = new DateTime('@' . ($timestamp === null ? time() : (int)$timestamp));
    $sentAt->setTimezone(new DateTimeZone('Europe/Moscow'));

    $lines = [
        'Новая заявка с сайта pravonaroda.ru',
        '',
        'Дата: ' . $sentAt->format('d.m.Y H:i') . ' по московскому времени',
        'Имя: ' . $request['name'],
        'Телефон: ' . $request['phone'],
        '',
        'Описание ситуации:',
        $request['message'],
    ];

    return [
        'subject' => 'Новая заявка с pravonaroda.ru',
        'body' => implode("\n", $lines),
    ];
}

function send_contact_email(array $request, array $config)
{
    $requiredKeys = [
        'smtp_host',
        'smtp_port',
        'smtp_username',
        'smtp_password',
        'from_email',
        'to_email',
    ];

    foreach ($requiredKeys as $key) {
        if (!isset($config[$key]) || $config[$key] === '') {
            throw new RuntimeException('Missing mail configuration: ' . $key);
        }
    }

    $content = build_contact_email_content($request);
    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = $config['smtp_host'];
    $mail->Port = (int)$config['smtp_port'];
    $mail->SMTPAuth = true;
    $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS;
    $mail->Username = $config['smtp_username'];
    $mail->Password = $config['smtp_password'];
    $mail->CharSet = PHPMailer\PHPMailer\PHPMailer::CHARSET_UTF8;
    $mail->Timeout = 20;
    $mail->setFrom($config['from_email'], 'Сайт «Народный юрист»');
    $mail->addAddress($config['to_email']);
    $mail->Subject = $content['subject'];
    $mail->Body = $content['body'];
    $mail->isHTML(false);
    $mail->send();
}
