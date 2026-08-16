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

    $phoneDigits = preg_replace('/\D+/', '', $phone);
    $digitCount = strlen($phoneDigits);
    if ($digitCount < 7 || $digitCount > 20 || strlen($phone) > 40) {
        $errors['phone'] = 'Укажите корректный номер телефона.';
    }

    $messageLength = mb_strlen($message, 'UTF-8');
    if ($messageLength > 4000) {
        $errors['message'] = 'Описание не должно превышать 4000 символов.';
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
