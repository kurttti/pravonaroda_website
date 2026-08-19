<?php

require __DIR__ . '/../src/request-validation.php';

function expect_true($condition, $message)
{
    if (!$condition) {
        throw new RuntimeException($message);
    }
}

$validInput = [
    'name' => 'Анна',
    'phone' => '+7 999 123 45 67',
    'message' => 'Передала наличные человеку, который представился курьером.',
    'consent' => '1',
    'website' => '',
];

$valid = validate_contact_request($validInput);
expect_true($valid['ok'] === true, 'Valid request must pass');
expect_true($valid['data']['phone'] === '+7 999 123 45 67', 'Phone must be preserved');

$withoutMessage = validate_contact_request(array_merge($validInput, ['message' => '']));
expect_true(isset($withoutMessage['errors']['message']), 'Message must be required');

$withoutConsent = validate_contact_request(array_merge($validInput, ['consent' => '0']));
expect_true(isset($withoutConsent['errors']['consent']), 'Consent must be required');

$shortPhone = validate_contact_request(array_merge($validInput, ['phone' => '+7 999 123']));
expect_true(isset($shortPhone['errors']['phone']), 'Phone must contain exactly ten subscriber digits');

$foreignPhone = validate_contact_request(array_merge($validInput, ['phone' => '+1 999 123 45 67']));
expect_true(isset($foreignPhone['errors']['phone']), 'Phone must use the Russian +7 country code');

$longPhone = validate_contact_request(array_merge($validInput, ['phone' => '+7 999 123 45 67 8']));
expect_true(isset($longPhone['errors']['phone']), 'Phone must reject extra digits');

$phoneWithLetters = validate_contact_request(array_merge($validInput, ['phone' => '+7 999 abc 12 34']));
expect_true(isset($phoneWithLetters['errors']['phone']), 'Phone must reject letters');

$longMessage = validate_contact_request(array_merge($validInput, ['message' => str_repeat('а', 4001)]));
expect_true(isset($longMessage['errors']['message']), 'Message must not exceed 4000 characters');

$bot = validate_contact_request(array_merge($validInput, ['website' => 'https://spam.example']));
expect_true($bot['bot'] === true && $bot['ok'] === false, 'Honeypot must reject bots');

echo "request-validation: ok\n";
