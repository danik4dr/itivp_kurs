<?php
require_once "../config.php";
require_once "../database.php";
require_once "../middleware/auth_only.php";

header("Content-Type: application/json; charset=utf-8");

$data = json_decode(file_get_contents("php://input"), true);
$userId = $_SESSION['user']['id'];

$fields = [];
$params = [];

if (!empty($data['name'])) {
    $fields[] = "name = ?";
    $params[] = $data['name'];
}
if (!empty($data['email'])) {
    $fields[] = "email = ?";
    $params[] = $data['email'];
}
if (!empty($data['password'])) {
    $fields[] = "password = ?";
    $params[] = password_hash($data['password'], PASSWORD_DEFAULT);
}

if (empty($fields)) {
    echo json_encode(["success" => false, "error" => "No fields to update"]);
    exit();
}

$params[] = $userId;

try {
    $db = (new Database())->connect();
    $sql = "UPDATE users SET " . implode(", ", $fields) . " WHERE id = ?";
    $stmt = $db->prepare($sql);
    $stmt->execute($params);

    if (!empty($data['name'])) $_SESSION['user']['name'] = $data['name'];
    if (!empty($data['email'])) $_SESSION['user']['email'] = $data['email'];

    echo json_encode(["success" => true, "user" => $_SESSION['user']]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
