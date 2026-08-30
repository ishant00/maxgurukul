<?php
require_once __DIR__ . '/../admin/bootstrap.php';
function api_auth(){if(!is_logged_in()){http_response_code(401);header('Content-Type: application/json');echo json_encode(['error'=>'Authentication required']);exit;}}
