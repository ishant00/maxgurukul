<?php require_once __DIR__.'/../admin/bootstrap.php'; admin_logout(); header('Content-Type: application/json'); echo json_encode(['ok'=>true]);
