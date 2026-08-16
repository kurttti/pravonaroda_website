<?php

function record_contact_incident($projectRoot, $incidentId, $message)
{
    $runtimeDirectory = rtrim($projectRoot, '/') . '/runtime';
    if (!is_dir($runtimeDirectory) && !mkdir($runtimeDirectory, 0700, true) && !is_dir($runtimeDirectory)) {
        return false;
    }

    $safeIncidentId = preg_replace('/[^a-zA-Z0-9_-]/', '', (string)$incidentId);
    $safeMessage = trim(preg_replace('/[\r\n]+/', ' ', (string)$message));
    $line = date('c') . ' [' . $safeIncidentId . '] ' . $safeMessage . PHP_EOL;
    $logPath = $runtimeDirectory . '/contact-form.log';
    $written = file_put_contents($logPath, $line, FILE_APPEND | LOCK_EX);

    if ($written !== false) {
        @chmod($logPath, 0600);
    }

    return $written !== false;
}
