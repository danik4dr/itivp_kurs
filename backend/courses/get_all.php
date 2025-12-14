<?php
require_once "../config.php";
require_once "../database.php";
$db = (new Database())->connect();
$stmt = $db->query("SELECT * FROM courses ORDER BY id DESC");
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
