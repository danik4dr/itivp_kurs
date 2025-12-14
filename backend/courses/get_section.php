<?php
require_once "../config.php";
require_once "../database.php";
$id = (int)($_GET['id'] ?? 0);
$db = (new Database())->connect();
$stmt = $db->prepare("SELECT * FROM courses WHERE id = ?");
$stmt->execute([$id]);
$course = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$course) { echo json_encode(["success"=>false]); exit(); }
$stmt = $db->prepare("SELECT * FROM sections WHERE course_id = ? ORDER BY id DESC");
$stmt->execute([$id]);
$sections = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode(["success"=>true,"course"=>$course,"sections"=>$sections]);