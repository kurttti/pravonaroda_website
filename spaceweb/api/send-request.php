<?php

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

$respond = function ($status, array $payload) {
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
};

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    $respond(405, ['ok' => false, 'message' => 'Метод запроса не поддерживается.']);
}

$allowedOrigins = [
    'https://pravonaroda.ru',
    'https://www.pravonaroda.ru',
];
$requestOrigin = isset($_SERVER['HTTP_ORIGIN']) ? rtrim($_SERVER['HTTP_ORIGIN'], '/') : '';

if ($requestOrigin === '' && !empty($_SERVER['HTTP_REFERER'])) {
    $referer = parse_url($_SERVER['HTTP_REFERER']);
    if (isset($referer['scheme'], $referer['host'])) {
        $requestOrigin = $referer['scheme'] . '://' . $referer['host'];
    }
}

if ($requestOrigin !== '' && !in_array($requestOrigin, $allowedOrigins, true)) {
    $respond(403, ['ok' => false, 'message' => 'Запрос отклонён. Обновите страницу и попробуйте снова.']);
}

try {
    $projectRoot = dirname(__DIR__, 2);
    require $projectRoot . '/app/bootstrap.php';
    $mailConfig = require $projectRoot . '/private/mail-config.php';
    $validation = validate_contact_request($_POST);

    if ($validation['bot']) {
        $respond(200, ['ok' => true, 'message' => 'Заявка отправлена. Мы свяжемся с вами по указанному номеру.']);
    }

    if (!$validation['ok']) {
        $respond(422, [
            'ok' => false,
            'message' => 'Проверьте заполненные поля.',
            'errors' => $validation['errors'],
        ]);
    }

    $remoteAddress = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : 'unknown';
    if (!contact_rate_limit_allow($remoteAddress, $projectRoot . '/runtime')) {
        $respond(429, ['ok' => false, 'message' => 'Слишком много попыток. Попробуйте снова через 15 минут.']);
    }

    $deliverySucceeded = false;
    $deliveryErrors = [];

    $crmConfigPath = $projectRoot . '/private/bitrix24-config.php';
    if (is_file($crmConfigPath)) {
        try {
            $crmConfig = require $crmConfigPath;
            send_bitrix24_lead($validation['data'], $crmConfig);
            $deliverySucceeded = true;
        } catch (Throwable $crmError) {
            $deliveryErrors[] = 'CRM: ' . $crmError->getMessage();
        }
    }

    try {
        send_contact_email($validation['data'], $mailConfig);
        $deliverySucceeded = true;
    } catch (Throwable $mailError) {
        $deliveryErrors[] = 'Email: ' . $mailError->getMessage();
    }

    if ($deliverySucceeded && count($deliveryErrors) > 0) {
        $partialIncidentId = bin2hex(random_bytes(6));
        record_contact_incident($projectRoot, $partialIncidentId, implode(' | ', $deliveryErrors));
        error_log('Contact form partial delivery incident ' . $partialIncidentId . ': ' . implode(' | ', $deliveryErrors));
    }

    if (!$deliverySucceeded) {
        throw new RuntimeException('All contact delivery channels failed.');
    }

    $respond(200, ['ok' => true, 'message' => 'Заявка отправлена. Мы свяжемся с вами по указанному номеру.']);
} catch (Throwable $error) {
    $incidentId = bin2hex(random_bytes(6));
    if (isset($projectRoot)) {
        record_contact_incident($projectRoot, $incidentId, $error->getMessage());
    }
    error_log('Contact form incident ' . $incidentId . ': ' . $error->getMessage());
    $respond(500, [
        'ok' => false,
        'message' => 'Не удалось отправить заявку. Позвоните нам или повторите попытку позже. Код ошибки: ' . $incidentId,
    ]);
}
