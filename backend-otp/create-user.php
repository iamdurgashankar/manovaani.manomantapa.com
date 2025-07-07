<?php
// CORS: Allow only the subdomain https://manovaani.manomantapa.com
$allowed_origins = [
    'https://manovaani.manomantapa.com',
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
// Error logging
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php_errors.log');
ini_set('display_errors', 0);

require __DIR__ . '/db.php';

$input = json_decode(file_get_contents('php://input'), true);
$email = $input['email'] ?? '';
$name = $input['name'] ?? '';
$googleId = $input['googleId'] ?? '';

if (!$email) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email is required.']);
    exit();
}
if (!$name) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Name is required.']);
    exit();
}

// Check if user exists (by email)
$stmt = $mysqli->prepare('SELECT * FROM users WHERE email = ?');
$stmt->bind_param('s', $email);
$stmt->execute();
$result = $stmt->get_result();
if ($user = $result->fetch_assoc()) {
    echo json_encode(['success' => true, 'user' => $user, 'message' => 'User already exists.']);
    exit();
}
$stmt->close();

// Insert new user
$stmt = $mysqli->prepare('INSERT INTO users (email, name, google_id) VALUES (?, ?, ?)');
$stmt->bind_param('sss', $email, $name, $googleId);
if ($stmt->execute()) {
    $userId = $stmt->insert_id;
    $user = [
        'id' => $userId,
        'email' => $email,
        'name' => $name,
        'google_id' => $googleId,
        'created_at' => date('c')
    ];
    echo json_encode(['success' => true, 'user' => $user, 'message' => 'User created successfully.']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to create user.']);
}
$stmt->close();
$mysqli->close(); 