<?php
require_once "../config.php";
require_once "../database.php";
require_once "../middleware/admin_only.php";
$data = json_decode(file_get_contents("php://input"), true);
$trainer_id = (int)($data['trainer_id'] ?? 0);
$title = $data['title'] ?? '';
$description = $data['description'] ?? '';
$price = (float)($data['price'] ?? 0);

if (!$trainer_id || !$title) { 
    http_response_code(400); 
    echo json_encode(["success"=>false,"error"=>"Trainer and title required"]); 
    exit(); 
}

$db = (new Database())->connect();
$stmt = $db->prepare("INSERT INTO courses (trainer_id, title, description, price) VALUES (?, ?, ?, ?)");
$stmt->execute([$trainer_id, $title, $description, $price]);
echo json_encode(["success" => true, "id" => (int)$db->lastInsertId()]);
