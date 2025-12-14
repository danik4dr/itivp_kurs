<?php
session_start();
require_once "../config.php";
require "../database.php";
header("Content-Type: application/json; charset=utf-8");

if (!isset($_SESSION["user_id"])) {
    echo json_encode(["auth" => false]);
    exit;
}

$id = $_SESSION["user_id"];
$stmt = $pdo->prepare("SELECT id, name, email, role FROM users WHERE id=?");
$stmt->execute([$id]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

echo json_encode(["auth" => true, "user" => $user]);
