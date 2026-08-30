<?php require_once __DIR__.'/auth.php'; header('Content-Type: application/json'); echo json_encode(['authenticated'=>is_logged_in(),'user'=>$_SESSION['admin']??null]);
