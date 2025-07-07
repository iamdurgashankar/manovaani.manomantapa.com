<?php
$host = 'localhost'; // Usually 'localhost' on cPanel
$db   = 'i10163703_teb51'; // Your full database name
$user = 'i10163703_teb51'; // Your full database username
$pass = 'Manasiri-EST@2023';      // The password you set in cPanel

$mysqli = new mysqli($host, $user, $pass, $db);

if ($mysqli->connect_errno) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $mysqli->connect_error]);
    exit();
}
?> 