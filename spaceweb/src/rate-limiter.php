<?php

function contact_rate_limit_allow($ip, $runtimeDir, $now = null)
{
    $limit = 5;
    $windowSeconds = 900;
    $currentTime = $now === null ? time() : (int)$now;

    if (!is_dir($runtimeDir) && !mkdir($runtimeDir, 0700, true) && !is_dir($runtimeDir)) {
        throw new RuntimeException('Unable to create rate-limit directory.');
    }

    $key = hash('sha256', (string)$ip);
    $path = rtrim($runtimeDir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $key . '.json';
    $handle = fopen($path, 'c+');

    if ($handle === false) {
        throw new RuntimeException('Unable to open rate-limit state.');
    }

    chmod($path, 0600);

    try {
        if (!flock($handle, LOCK_EX)) {
            throw new RuntimeException('Unable to lock rate-limit state.');
        }

        rewind($handle);
        $contents = stream_get_contents($handle);
        $stored = $contents === '' ? [] : json_decode($contents, true);
        $timestamps = is_array($stored) ? $stored : [];
        $cutoff = $currentTime - $windowSeconds;
        $active = [];

        foreach ($timestamps as $timestamp) {
            if (is_numeric($timestamp) && (int)$timestamp >= $cutoff) {
                $active[] = (int)$timestamp;
            }
        }

        $allowed = count($active) < $limit;
        if ($allowed) {
            $active[] = $currentTime;
        }

        rewind($handle);
        ftruncate($handle, 0);
        fwrite($handle, json_encode($active));
        fflush($handle);
        flock($handle, LOCK_UN);

        return $allowed;
    } finally {
        fclose($handle);
    }
}
