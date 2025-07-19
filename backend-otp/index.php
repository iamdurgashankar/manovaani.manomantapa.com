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
header('Access-Control-Allow-Methods: POST, OPTIONS, GET');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
// Error logging
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php_errors.log');
ini_set('display_errors', 0);

// Load environment variables from .env file
function loadEnv($path) {
    if (!file_exists($path)) {
        return false;
    }
    
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '=') !== false && strpos($line, '#') !== 0) {
            list($key, $value) = explode('=', $line, 2);
            $_ENV[trim($key)] = trim($value);
            putenv(trim($key) . '=' . trim($value));
        }
    }
    return true;
}

// Load environment variables
loadEnv(__DIR__ . '/.env');

// Remove Twilio Configuration and OTP endpoints

require_once __DIR__ . '/db.php';

$input = json_decode(file_get_contents('php://input'), true);
$method = $_SERVER['REQUEST_METHOD'];
$path = $_SERVER['REQUEST_URI'];
$path = parse_url($path, PHP_URL_PATH);

if ($method === 'POST') {
    if (strpos($path, '/update-user') !== false) {
        handleUpdateUser($input);
    } elseif (strpos($path, '/create-order') !== false) {
        handleCreateOrder($input);
    } elseif (strpos($path, '/verify-payment') !== false) {
        handleVerifyPayment($input);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Endpoint not found']);
    }
} elseif ($method === 'GET') {
    if (strpos($path, '/get-user') !== false) {
        handleGetUser($_GET);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Endpoint not found']);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}

/**
 * Handle updating user data
 */
function handleUpdateUser($input) {
    global $mysqli;
    $phone = $input['phone'] ?? '';
    $email = $input['email'] ?? '';
    $googleId = $input['google_id'] ?? '';
    $name = $input['name'] ?? '';
    $isSubscribed = isset($input['isSubscribed']) ? (bool)$input['isSubscribed'] : null;
    $subscriptionEndDate = $input['subscriptionEndDate'] ?? null;

    if (!$phone && !$email && !$googleId) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Phone, email, or google_id is required.']);
        return;
    }
    if (!$name && is_null($isSubscribed) && is_null($subscriptionEndDate)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Nothing to update.']);
        return;
    }

    // Build SET clause dynamically
    $fields = [];
    $params = [];
    $types = '';
    if ($name) {
        $fields[] = 'name = ?';
        $params[] = $name;
        $types .= 's';
    }
    if (!is_null($isSubscribed)) {
        $fields[] = 'isSubscribed = ?';
        $params[] = $isSubscribed;
        $types .= 'i';
    }
    if (!is_null($subscriptionEndDate)) {
        $fields[] = 'subscriptionEndDate = ?';
        $params[] = $subscriptionEndDate;
        $types .= 's';
    }
    if (empty($fields)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Nothing to update.']);
        return;
    }
    $setClause = implode(', ', $fields);

    // Build WHERE clause
    if ($email) {
        $where = 'email = ?';
        $params[] = $email;
        $types .= 's';
    } elseif ($phone) {
        $where = 'phone = ?';
        $params[] = $phone;
        $types .= 's';
    } elseif ($googleId) {
        $where = 'google_id = ?';
        $params[] = $googleId;
        $types .= 's';
    }

    $sql = "UPDATE users SET $setClause WHERE $where";
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param($types, ...$params);
    $stmt->execute();
    if ($stmt->affected_rows > 0) {
        // Fetch updated user
        if ($email) {
            $sel = $mysqli->prepare('SELECT * FROM users WHERE email = ?');
            $sel->bind_param('s', $email);
        } elseif ($phone) {
            $sel = $mysqli->prepare('SELECT * FROM users WHERE phone = ?');
            $sel->bind_param('s', $phone);
        } else {
            $sel = $mysqli->prepare('SELECT * FROM users WHERE google_id = ?');
            $sel->bind_param('s', $googleId);
        }
        $sel->execute();
        $result = $sel->get_result();
        $user = $result->fetch_assoc();
        echo json_encode(['success' => true, 'user' => $user]);
        $sel->close();
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'User not found or nothing changed.']);
    }
    $stmt->close();
}

/**
 * Handle creating a Razorpay order
 */
function handleCreateOrder($input) {
    $amount = $input['amount'] ?? 500; // Default amount in paise (e.g., 500 = ₹5.00)

    $url = 'https://api.razorpay.com/v1/orders';
    $data = [
        'amount' => $amount,
        'currency' => 'INR',
        'receipt' => 'receipt_' . time(),
    ];

    try {
        $response = makeRazorpayRequest($url, 'POST', $data);
        echo json_encode(['success' => true, 'order' => $response]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to create order: ' . $e->getMessage()]);
    }
}

/**
 * Handle verifying a Razorpay payment
 */
function handleVerifyPayment($input) {
    $phone = $input['phone'] ?? '';
    $razorpayPaymentId = $input['razorpay_payment_id'] ?? '';
    $razorpayOrderId = $input['razorpay_order_id'] ?? '';
    $razorpaySignature = $input['razorpay_signature'] ?? '';

    if (!$phone || !$razorpayPaymentId || !$razorpayOrderId || !$razorpaySignature) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing payment verification details.']);
        return;
    }

    // Verify the signature
    $generated_signature = hash_hmac('sha256', $razorpayOrderId . "|" . $razorpayPaymentId, RAZORPAY_KEY_SECRET);

    if ($generated_signature !== $razorpaySignature) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Payment verification failed: Invalid signature.']);
        return;
    }

    // Signature is correct, update user subscription status
    $users = getUsers();
    if (isset($users[$phone])) {
        $users[$phone]['isSubscribed'] = true;
        $users[$phone]['subscriptionEndDate'] = date('c', strtotime('+1 year')); // Subscription valid for 1 year
        $users[$phone]['razorpayOrderId'] = $razorpayOrderId;
        $users[$phone]['razorpayPaymentId'] = $razorpayPaymentId;
        saveUsers($users);

        echo json_encode(['success' => true, 'message' => 'Payment verified successfully.', 'user' => $users[$phone]]);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'User not found for subscription update.']);
    }
}

/**
 * Make HTTP request to Razorpay API
 */
function makeRazorpayRequest($url, $method = 'POST', $data = []) {
    $ch = curl_init();
    
    $options = [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_USERPWD => RAZORPAY_KEY_ID . ':' . RAZORPAY_KEY_SECRET,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_SSL_VERIFYPEER => true
    ];

    if ($method === 'POST') {
        $options[CURLOPT_POST] = true;
        $options[CURLOPT_POSTFIELDS] = json_encode($data);
        $options[CURLOPT_HTTPHEADER] = ['Content-Type: application/json'];
    }

    curl_setopt_array($ch, $options);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        throw new Exception('cURL error: ' . $error);
    }
    
    if ($httpCode >= 400) {
        $errorData = json_decode($response, true);
        $errorMessage = $errorData['error']['description'] ?? 'Razorpay API error: ' . $httpCode;
        throw new Exception($errorMessage);
    }
    
    return json_decode($response, true);
}

function handleGetUser($query) {
    global $mysqli;
    $phone = $query['phone'] ?? '';
    $email = $query['email'] ?? '';
    $googleId = $query['google_id'] ?? '';

    if (!$phone && !$email && !$googleId) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Phone, email, or google_id is required.']);
        return;
    }

    $sql = '';
    $param = '';
    $type = '';
    if ($email) {
        $sql = 'SELECT * FROM users WHERE email = ?';
        $param = $email;
        $type = 's';
    } elseif ($phone) {
        $sql = 'SELECT * FROM users WHERE phone = ?';
        $param = $phone;
        $type = 's';
    } elseif ($googleId) {
        $sql = 'SELECT * FROM users WHERE google_id = ?';
        $param = $googleId;
        $type = 's';
    }
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param($type, $param);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($user = $result->fetch_assoc()) {
        echo json_encode(['success' => true, 'user' => $user]);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'User not found.']);
    }
    $stmt->close();
}
?> 