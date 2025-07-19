<?php
// CORS: Allow only the subdomain https://manovaani.manomantapa.com
$allowed_origins = [
    'https://manovaani.manomantapa.com',
    'http://localhost:3000', // Allow React dev server
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin && in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
}
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php_errors.log');
ini_set('display_errors', 0);
require __DIR__ . '/db.php';
$input = json_decode(file_get_contents('php://input'), true);
$email = $input['email'] ?? '';
$plan = $input['plan'] ?? '';
if (!$email || !$plan) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email and plan are required.']);
    exit();
}
$stmt = $mysqli->prepare('UPDATE users SET subscription_plan = ? WHERE email = ?');
$stmt->bind_param('ss', $plan, $email);
if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Subscription updated.']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to update subscription.']);
}
$stmt->close();
$mysqli->close(); 