<?php require_once __DIR__.'/auth.php'; header('Content-Type: application/json'); echo json_encode(['ok'=>true,'csrf'=>csrf_token()]);
