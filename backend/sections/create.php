<?php
require_once "../config.php";
require_once "../database.php";
require_once "../middleware/admin_only.php";
$data = json_decode(file_get_contents("php://input"), true);
$course_id = (int)($data['course_id'] ?? 0);
$name = $data['name'] ?? '';
$location = $data['location'] ?? '';
$schedule = $data['schedule'] ?? '';
$capacity = (int)($data['capacity'] ?? 0);

if (!$course_id || !$name) { 
    http_response_code(400); 
    echo json_encode(["success"=>false,"error"=>"Course and name required"]); 
    exit(); 
}

$db = (new Database())->connect();
$stmt = $db->prepare("INSERT INTO sections (course_id, name, location, schedule, capacity) VALUES (?, ?, ?, ?, ?)");
$stmt->execute([$course_id, $name, $location, $schedule, $capacity]);
echo json_encode(["success" => true, "id" => (int)$db->lastInsertId()]);
