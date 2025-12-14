<?php
require_once '../config.php';
require_once '../database.php';
require_once '../middleware/auth_only.php';

if (isset($_SERVER['HTTP_ORIGIN'])) {
    $allowed = ['http://localhost:5173'];
    $origin = $_SERVER['HTTP_ORIGIN'];
    if (in_array($origin, $allowed)) header("Access-Control-Allow-Origin: $origin");
}
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header('Content-Type: application/json; charset=utf-8');

$data = json_decode(file_get_contents('php://input'), true);
$trainerId = $data['id'] ?? null;

if (!$trainerId) {
    echo json_encode(['success' => false, 'error' => 'ID тренера не указан']);
    exit;
}

$db = (new Database())->connect();

$fields = [];
$params = [];

if (isset($data['name'])) { $fields[] = 'name=?'; $params[] = $data['name']; }
if (isset($data['sport'])) { $fields[] = 'sport=?'; $params[] = $data['sport']; }
if (isset($data['experience'])) { $fields[] = 'experience=?'; $params[] = $data['experience']; }
if (isset($data['city'])) { $fields[] = 'city=?'; $params[] = $data['city']; }
if (isset($data['description'])) { $fields[] = 'description=?'; $params[] = $data['description']; }
if (array_key_exists('photo_url', $data)) { $fields[] = 'photo_url=?'; $params[] = $data['photo_url']; }

if (empty($fields)) {
    echo json_encode(['success' => false, 'error' => 'Нет полей для обновления']);
    exit;
}

$params[] = $trainerId;

try {
    $stmt = $db->prepare("UPDATE trainers SET " . implode(', ', $fields) . " WHERE id=?");
    $stmt->execute($params);
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
