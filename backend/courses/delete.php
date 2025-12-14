<?php
require_once "../config.php";
require_once "../database.php";
require_once "../middleware/admin_only.php";

$data = json_decode(file_get_contents("php://input"), true);
$id = (int)($data['id'] ?? 0);
if (!$id) { http_response_code(400); echo json_encode(["success"=>false,"error"=>"ID required"]); exit(); }

$db = (new Database())->connect();
$stmt = $db->prepare("DELETE FROM courses WHERE id = ?");
$stmt->execute([$id]);
echo json_encode(["success" => true]);

