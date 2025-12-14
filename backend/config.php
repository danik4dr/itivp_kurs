<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();

if (isset($_SERVER['HTTP_ORIGIN'])) {
    $allowed_origins = ['http://localhost:5173', 'http://localhost:3000', 'http://localhost'];
    $origin = $_SERVER['HTTP_ORIGIN'];
    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: $origin"); 
    }
}

header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept");
header("Access-Control-Allow-Credentials: true"); 
header("Access-Control-Max-Age: 86400");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

header('Content-Type: application/json; charset=utf-8');

define('DB_HOST', 'localhost');
define('DB_NAME', 'sport_platforms');
define('DB_USER', 'root');
define('DB_PASS', '');

define('BASE_URL', 'http://' . $_SERVER['HTTP_HOST'] . '/backend');
define('UPLOAD_DIR', __DIR__ . '/uploads/');
