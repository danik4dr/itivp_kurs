<?php
require_once "../config.php";
require_once "../database.php";
require_once "../middleware/auth_only.php";

$user_id = $_SESSION['user']['id'];
$db = (new Database())->connect();

$stmt = $db->prepare("
  SELECT 
      b.id,
      s.id AS section_id,
      c.id AS course_id,
      c.title AS course_name,
      s.name AS section_name,
      s.capacity AS capacity_remaining,
      t.id AS trainer_id,
      t.name AS trainer_name
  FROM bookings b
  JOIN sections s ON s.id = b.section_id
  JOIN courses c ON c.id = s.course_id
  JOIN trainers t ON t.id = c.trainer_id
  WHERE b.user_id = ?
");
$stmt->execute([$user_id]);

echo json_encode([
  "success" => true,
  "bookings" => $stmt->fetchAll(PDO::FETCH_ASSOC)
]);
