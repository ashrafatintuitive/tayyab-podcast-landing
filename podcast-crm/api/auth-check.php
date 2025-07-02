<?php
require_once __DIR__ . '/../config/config.php';

header('Content-Type: application/json');

echo json_encode([
    'authenticated' => isset($_SESSION['authenticated']) && $_SESSION['authenticated'] === true,
    'username' => $_SESSION['username'] ?? null
]);