<?php
require_once "../config.php";
require_once "../database.php";

$data = json_decode(file_get_contents("php://input"), true);
$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';
$role = $data['role'] ?? 'user'; 

if (!$email || !$password) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Email and password required"]);
    exit();
}

$db = (new Database())->connect();

if ($role === 'admin') {
    $stmt = $db->prepare("SELECT COUNT(*) as cnt FROM users WHERE role = 'admin'");
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($row && $row['cnt'] > 0) {
        http_response_code(409);
        echo json_encode(["success" => false, "error" => "Admin is already exist"]);
        exit();
    }
}

try {
    $hash = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $db->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)");
    $stmt->execute([$name, $email, $hash, $role]);
    $id = $db->lastInsertId();

    $_SESSION['user'] = [
        "id" => (int)$id,
        "name" => $name,
        "email" => $email,
        "role" => $role
    ];

    echo json_encode(["success" => true, "user" => $_SESSION['user']]);
} catch (PDOException $e) {
    if ($e->getCode() == 23000) {
        http_response_code(409);
        echo json_encode(["success" => false, "error" => "This email is already exist"]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
}
