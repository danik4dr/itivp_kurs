<?php
require_once "../config.php";
require_once "../database.php";

$db = (new Database())->connect();
$stmt = $db->query("SELECT * FROM trainers ORDER BY name");
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($rows);
