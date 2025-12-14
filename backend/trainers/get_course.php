<?php
require_once "../config.php";
require_once "../database.php";

$id = (int)($_GET['id'] ?? 0);
$db = (new Database())->connect();

$stmt = $db->prepare("SELECT * FROM trainers WHERE id = ?");
$stmt->execute([$id]);
$trainer = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$trainer) {
    echo json_encode(["success" => false, "error" => "Trainer not found"]);
    exit();
}

$stmt = $db->prepare("SELECT id, title, price FROM courses WHERE trainer_id = ? ORDER BY id DESC");
$stmt->execute([$id]);
$courses = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(["success" => true, "trainer" => $trainer, "courses" => $courses]);
