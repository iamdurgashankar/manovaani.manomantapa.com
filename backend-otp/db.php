<?php
// Production credentials for deployment:
$host = '118.139.183.156';
$db   = 'i10163703_teb51';
$user = 'i10163703_teb51';
$pass = 'Manasiri-EST@2023';

$mysqli = new mysqli($host, $user, $pass, $db);

if ($mysqli->connect_errno) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $mysqli->connect_error]);
    exit();
}
?> 