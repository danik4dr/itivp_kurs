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
    echo json_encode(['success'=>false, 'error'=>'ID секции не указан']);
    exit;
}

$db = (new Database())->connect();

$fields = [];
$params = [];

if (!empty($data['name'])) { $fields[] = 'name=?'; $params[] = $data['name']; }
if (!empty($data['location'])) { $fields[] = 'location=?'; $params[] = $data['location']; }
if (!empty($data['schedule'])) { $fields[] = 'schedule=?'; $params[] = $data['schedule']; }
if (!empty($data['capacity'])) { $fields[] = 'capacity=?'; $params[] = $data['capacity']; }
if (!empty($data['course_id'])) { $fields[] = 'course_id=?'; $params[] = $data['course_id']; }

if (empty($fields)) {
    echo json_encode(['success'=>false, 'error'=>'Нет полей для обновления']);
    exit;
}

$params[] = $courseId;

try {
    $stmt = $db->prepare("UPDATE sections SET " . implode(', ', $fields) . " WHERE id=?");
    $stmt->execute($params);
    echo json_encode(['success'=>true]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success'=>false, 'error'=>$e->getMessage()]);
}
