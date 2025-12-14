<?php
require_once "../config.php";
require_once "../database.php";
require_once "../middleware/auth_only.php";

$data = json_decode(file_get_contents("php://input"), true);
$user_id = $_SESSION['user']['id'];
$section_id = (int)($data['section_id'] ?? 0);

if (!$section_id) { 
    http_response_code(400); 
    echo json_encode(["success"=>false,"error"=>"Секция не выбрана"]); 
    exit();
}

$db = (new Database())->connect();

$check = $db->prepare("SELECT id FROM bookings WHERE user_id=? AND section_id=?");
$check->execute([$user_id, $section_id]);
if ($check->fetch()) {
    echo json_encode(["success"=>false, "error"=>"Вы уже зарегистрированы на эту секцию"]);
    exit();
}

$q = $db->prepare("SELECT capacity, course_id FROM sections WHERE id=? LIMIT 1");
$q->execute([$section_id]);
$section = $q->fetch();

if (!$section) {
    echo json_encode(["success"=>false,"error"=>"Секция не найдена"]);
    exit();
}

if ($section['capacity'] <= 0) {
    echo json_encode(["success"=>false,"error"=>"Нет свободных мест на этой секции"]);
    exit();
}

$stmt = $db->prepare("INSERT INTO bookings (user_id, section_id) VALUES (?, ?)");
$stmt->execute([$user_id, $section_id]);

$upd = $db->prepare("UPDATE sections SET capacity = capacity - 1 WHERE id=?");
$upd->execute([$section_id]);

echo json_encode([
    "success" => true,
    "id" => (int)$db->lastInsertId(),
    "new_capacity" => $section['capacity'] - 1
]);
