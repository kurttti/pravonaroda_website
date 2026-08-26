<?php

require __DIR__ . '/../src/bitrix24-crm.php';

$request = [
    'name' => 'Анна Иванова',
    'phone' => '+7 999 123-45-67',
    'message' => 'Передала деньги курьеру.',
];
$payload = build_bitrix24_lead_payload($request);

if ($payload['entityTypeId'] !== 1) {
    throw new RuntimeException('A CRM lead must use entityTypeId 1.');
}
if ($payload['fields']['name'] !== $request['name'] || $payload['fields']['comments'] !== $request['message']) {
    throw new RuntimeException('Lead fields were not mapped correctly.');
}
if ($payload['fields']['fm'][0]['typeId'] !== 'PHONE' || $payload['fields']['fm'][0]['value'] !== $request['phone']) {
    throw new RuntimeException('Phone must be sent as a CRM multifield.');
}

$capturedUrl = null;
$capturedPayload = null;
$leadId = send_bitrix24_lead($request, [
    'webhook_url' => 'https://example.bitrix24.ru/rest/7/test-token/',
], function ($url, array $body, $connectTimeout, $timeout) use (&$capturedUrl, &$capturedPayload) {
    $capturedUrl = $url;
    $capturedPayload = $body;
    if ($connectTimeout !== 5 || $timeout !== 12) {
        throw new RuntimeException('Default timeouts were not applied.');
    }
    return ['status' => 200, 'body' => '{"result":{"item":{"id":3465}}}'];
});

if ($leadId !== 3465 || $capturedUrl !== 'https://example.bitrix24.ru/rest/7/test-token/crm.item.add.json') {
    throw new RuntimeException('Successful Bitrix24 response was not handled correctly.');
}
if ($capturedPayload !== $payload) {
    throw new RuntimeException('Unexpected payload was sent to Bitrix24.');
}

foreach ([
    'http://example.bitrix24.ru/rest/1/token/',
    'https://example.bitrix24.ru/rest/1/token/profile.json',
    'https://example.bitrix24.ru/rest/1/token/?secret=leak',
] as $invalidUrl) {
    try {
        normalize_bitrix24_webhook_url($invalidUrl);
        throw new RuntimeException('Invalid webhook URL must be rejected.');
    } catch (InvalidArgumentException $expected) {
    }
}

try {
    parse_bitrix24_lead_response(['status' => 401, 'body' => '{"error":"NO_AUTH_FOUND","error_description":"Wrong authorization data"}']);
    throw new RuntimeException('Bitrix24 API errors must be rejected.');
} catch (RuntimeException $error) {
    if (strpos($error->getMessage(), 'NO_AUTH_FOUND') === false) {
        throw $error;
    }
}

echo "bitrix24-crm: ok\n";
