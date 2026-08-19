<?php

function validate_contact_request(array $input)
{
    $name = trim((string)($input['name'] ?? ''));
    $phone = trim((string)($input['phone'] ?? ''));
    $message = trim((string)($input['message'] ?? ''));
    $consent = (string)($input['consent'] ?? '');
    $website = trim((string)($input['website'] ?? ''));
    $errors = [];

    if ($website !== '') {
        return [
            'ok' => false,
            'data' => [],
            'errors' => [],
            'bot' => true,
        ];
    }

    $nameLength = mb_strlen($name, 'UTF-8');
    if ($nameLength < 2 || $nameLength > 80) {
        $errors['name'] = 'Укажите имя длиной от 2 до 80 символов.';
    }

    if (!preg_match('/^\+7 [0-9]{3} [0-9]{3} [0-9]{2} [0-9]{2}$/', $phone)) {
        $errors['phone'] = 'Укажите российский номер: +7 и 10 цифр.';
    }

    $messageLength = mb_strlen($message, 'UTF-8');
    if ($messageLength < 10 || $messageLength > 4000) {
        $errors['message'] = 'Описание должно содержать от 10 до 4000 символов.';
    }

    if ($consent !== '1') {
        $errors['consent'] = 'Необходимо согласие на обработку персональных данных.';
    }

    return [
        'ok' => count($errors) === 0,
        'data' => [
            'name' => $name,
            'phone' => $phone,
            'message' => $message,
            'consent' => $consent,
        ],
        'errors' => $errors,
        'bot' => false,
    ];
}
