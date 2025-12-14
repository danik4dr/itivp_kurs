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
$courseId = $data['id'] ?? null;

if (!$courseId) {
    http_response_code(400);
    echo json_encode(['success'=>false, 'error'=>'ID курса не указан']);
    exit;
}

$db = (new Database())->connect();

$fields = [];
$params = [];

if (!empty($data['title'])) { $fields[] = 'title=?'; $params[] = $data['title']; }
if (!empty($data['description'])) { $fields[] = 'description=?'; $params[] = $data['description']; }
if (!empty($data['price'])) { $fields[] = 'price=?'; $params[] = $data['price']; }
if (!empty($data['trainer_id'])) { $fields[] = 'trainer_id=?'; $params[] = $data['trainer_id']; }

if (empty($fields)) {
    echo json_encode(['success'=>false, 'error'=>'Нет полей для обновления']);
    exit;
}

$params[] = $courseId;

try {
    $stmt = $db->prepare("UPDATE courses SET " . implode(', ', $fields) . " WHERE id=?");
    $stmt->execute($params);
    echo json_encode(['success'=>true]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success'=>false, 'error'=>$e->getMessage()]);
}
