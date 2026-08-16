<?php

require __DIR__ . '/../src/incident-log.php';

$root = sys_get_temp_dir() . '/pravonaroda-incident-' . bin2hex(random_bytes(4));
$incidentId = 'abc123';
$message = "SMTP failed\nsecond line";

if (!record_contact_incident($root, $incidentId, $message)) {
    throw new RuntimeException('Incident was not recorded.');
}

$logPath = $root . '/runtime/contact-form.log';
$contents = file_get_contents($logPath);

if ($contents === false || strpos($contents, $incidentId) === false || strpos($contents, 'SMTP failed second line') === false) {
    throw new RuntimeException('Incident log contents are invalid.');
}

if (substr_count(trim($contents), "\n") !== 0) {
    throw new RuntimeException('Incident message must be stored on one line.');
}

unlink($logPath);
rmdir(dirname($logPath));
rmdir($root);

echo "incident-log: ok\n";
