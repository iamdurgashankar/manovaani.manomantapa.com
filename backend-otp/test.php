<?php
header('Content-Type: application/json');

// Test if the backend is accessible
echo json_encode([
    'success' => true,
    'message' => 'PHP OTP Backend is running successfully!',
    'timestamp' => date('Y-m-d H:i:s'),
    'php_version' => PHP_VERSION,
    'curl_enabled' => function_exists('curl_init'),
    'env_file_exists' => file_exists(__DIR__ . '/.env')
]);

// Check if .env file exists and has content
if (file_exists(__DIR__ . '/.env')) {
    $envContent = file_get_contents(__DIR__ . '/.env');
    $envLines = explode("\n", $envContent);
    $envVars = [];
    
    foreach ($envLines as $line) {
        if (strpos($line, '=') !== false && strpos($line, '#') !== 0) {
            list($key, $value) = explode('=', $line, 2);
            $envVars[trim($key)] = !empty(trim($value));
        }
    }
    
    echo "\n\nEnvironment Variables Status:\n";
    echo json_encode($envVars, JSON_PRETTY_PRINT);
}
?> 