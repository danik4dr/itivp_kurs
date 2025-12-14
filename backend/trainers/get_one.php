<?php
require_once "../config.php";
require_once "../database.php";

$id = (int)($_GET['id'] ?? 0);

$db = (new Database())->connect();
$stmt = $db->prepare("SELECT * FROM trainers WHERE id = ?");
$stmt->execute([$id]);
echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
