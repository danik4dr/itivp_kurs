<?php
require_once "../config.php";
require_once "../database.php";
require_once "../middleware/auth_only.php";

$data = json_decode(file_get_contents("php://input"), true);
$id = (int)($data["id"] ?? 0);
$user_id = $_SESSION["user"]["id"];

if (!$id) {
    echo json_encode(["success" => false, "error" => "ID not found"]);
    exit();
}

$db = (new Database())->connect();

$stmt = $db->prepare("SELECT section_id FROM bookings WHERE id = ? AND user_id = ?");
$stmt->execute([$id, $user_id]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$row) {
    echo json_encode(["success" => false, "error" => "Booking not found"]);
    exit();
}

$db->prepare("DELETE FROM bookings WHERE id = ?")->execute([$id]);

$db->prepare("UPDATE sections SET capacity = capacity + 1 WHERE id = ?")
   ->execute([$row['section_id']]);

echo json_encode(["success" => true]);
