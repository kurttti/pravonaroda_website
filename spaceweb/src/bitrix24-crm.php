<?php

function normalize_bitrix24_webhook_url($webhookUrl)
{
    $webhookUrl = rtrim(trim((string)$webhookUrl), '/') . '/';
    $parts = parse_url($webhookUrl);

    if (
        $webhookUrl === '/' ||
        $parts === false ||
        !isset($parts['scheme'], $parts['host'], $parts['path']) ||
        strtolower($parts['scheme']) !== 'https' ||
        isset($parts['user']) ||
        isset($parts['pass']) ||
        isset($parts['query']) ||
        isset($parts['fragment']) ||
        !preg_match('#^/rest/[0-9]+/[A-Za-z0-9_-]+/$#', $parts['path'])
    ) {
        throw new InvalidArgumentException('Invalid Bitrix24 webhook configuration.');
    }

    return $webhookUrl;
}

function build_bitrix24_lead_payload(array $request)
{
    return [
        'entityTypeId' => 1,
        'fields' => [
            'title' => 'Заявка с pravonaroda.ru — ' . $request['name'],
            'name' => $request['name'],
            'comments' => $request['message'],
            'sourceDescription' => 'Форма на сайте pravonaroda.ru',
            'fm' => [
                [
                    'typeId' => 'PHONE',
                    'valueType' => 'WORK',
                    'value' => $request['phone'],
                ],
            ],
        ],
    ];
}

function call_bitrix24_webhook($methodUrl, array $payload, $connectTimeout, $timeout)
{
    if (!function_exists('curl_init')) {
        throw new RuntimeException('Bitrix24 transport is unavailable.');
    }

    $body = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($body === false) {
        throw new RuntimeException('Could not encode Bitrix24 request.');
    }

    $handle = curl_init($methodUrl);
    curl_setopt_array($handle, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            'Accept: application/json',
            'Content-Type: application/json',
        ],
        CURLOPT_POSTFIELDS => $body,
        CURLOPT_CONNECTTIMEOUT => $connectTimeout,
        CURLOPT_TIMEOUT => $timeout,
    ]);

    $responseBody = curl_exec($handle);
    $status = (int)curl_getinfo($handle, CURLINFO_HTTP_CODE);
    $transportFailed = $responseBody === false;
    curl_close($handle);

    if ($transportFailed) {
        throw new RuntimeException('Bitrix24 request failed during transport.');
    }

    return ['status' => $status, 'body' => $responseBody];
}

function parse_bitrix24_lead_response(array $response)
{
    $decoded = json_decode($response['body'], true);
    if (!is_array($decoded)) {
        throw new RuntimeException('Bitrix24 returned an invalid response.');
    }

    if (
        $response['status'] < 200 ||
        $response['status'] >= 300 ||
        isset($decoded['error'])
    ) {
        $errorCode = isset($decoded['error']) ? preg_replace('/[^A-Za-z0-9_-]/', '', (string)$decoded['error']) : '';
        throw new RuntimeException('Bitrix24 rejected the request' . ($errorCode !== '' ? ': ' . $errorCode : '.'));
    }

    if (!isset($decoded['result']['item']['id']) || (int)$decoded['result']['item']['id'] < 1) {
        throw new RuntimeException('Bitrix24 response did not contain a lead ID.');
    }

    return (int)$decoded['result']['item']['id'];
}

function send_bitrix24_lead(array $request, array $config, $transport = null)
{
    if (empty($config['webhook_url'])) {
        throw new RuntimeException('Missing Bitrix24 webhook configuration.');
    }

    $webhookUrl = normalize_bitrix24_webhook_url($config['webhook_url']);
    $methodUrl = $webhookUrl . 'crm.item.add.json';
    $payload = build_bitrix24_lead_payload($request);
    $connectTimeout = isset($config['connect_timeout']) ? (int)$config['connect_timeout'] : 5;
    $timeout = isset($config['timeout']) ? (int)$config['timeout'] : 12;

    if ($transport === null) {
        $transport = 'call_bitrix24_webhook';
    }

    return parse_bitrix24_lead_response($transport($methodUrl, $payload, $connectTimeout, $timeout));
}
