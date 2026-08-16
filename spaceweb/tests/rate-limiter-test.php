<?php

require __DIR__ . '/../src/rate-limiter.php';

$runtimeDir = sys_get_temp_dir() . '/pravonaroda-rate-' . bin2hex(random_bytes(6));
mkdir($runtimeDir, 0700, true);

try {
    for ($attempt = 0; $attempt < 5; $attempt++) {
        if (!contact_rate_limit_allow('203.0.113.10', $runtimeDir, 1700000000)) {
            throw new RuntimeException('First five attempts must pass');
        }
    }

    if (contact_rate_limit_allow('203.0.113.10', $runtimeDir, 1700000000)) {
        throw new RuntimeException('Sixth attempt must be blocked');
    }

    if (!contact_rate_limit_allow('203.0.113.10', $runtimeDir, 1700000901)) {
        throw new RuntimeException('Expired attempts must be discarded');
    }

    if (!contact_rate_limit_allow('203.0.113.11', $runtimeDir, 1700000000)) {
        throw new RuntimeException('A different IP must have a separate allowance');
    }
} finally {
    foreach (glob($runtimeDir . '/*.json') as $file) {
        unlink($file);
    }
    rmdir($runtimeDir);
}

echo "rate-limiter: ok\n";
