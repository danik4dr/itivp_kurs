<?php
require_once "../config.php";
require_once "../database.php";
require_once "../middleware/admin_only.php";

$data = json_decode(file_get_contents("php://input"), true);

$name = $data['name'] ?? '';
$sport = $data['sport'] ?? '';
$experience = (int)($data['experience'] ?? 0);
$city = $data['city'] ?? '';
$description = $data['description'] ?? '';
$photo_url = $data['photo_url'] ?? null;

if (!$name) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Name required"]);
    exit();
}

$db = (new Database())->connect();
$stmt = $db->prepare("INSERT INTO trainers (name, sport, experience, city, description, photo_url) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->execute([$name, $sport, $experience, $city, $description, $photo_url]);

echo json_encode(["success" => true, "id" => (int)$db->lastInsertId()]);
