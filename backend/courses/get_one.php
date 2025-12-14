<?php
require_once "../config.php";
require_once "../database.php";

$id = (int)($_GET['id'] ?? 0);
$db = (new Database())->connect();

$stmt = $db->prepare("SELECT * FROM courses WHERE id = ?");
$stmt->execute([$id]);

$course = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$course) {
    echo json_encode(["success" => false, "error" => "Course not found"]);
    exit();
}

echo json_encode($course);
