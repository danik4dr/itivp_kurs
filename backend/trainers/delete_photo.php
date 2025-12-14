<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once "../config.php";
require_once "../database.php";

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Method not allowed. Use POST or DELETE"]);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);
$id = (int)($data['id'] ?? 0);

if (!$id) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Trainer ID required"]);
    exit();
}

try {
    $db = (new Database())->connect();

    $stmt = $db->prepare("SELECT photo_url FROM trainers WHERE id = ?");
    $stmt->execute([$id]);
    $trainer = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$trainer) {
        http_response_code(404);
        echo json_encode(["success" => false, "error" => "Trainer not found"]);
        exit();
    }
    
    $photo_url = $trainer['photo_url'];

    if ($photo_url && $photo_url !== 'uploads/trainers/no-photo.png') {
        $file_path = $_SERVER['DOCUMENT_ROOT'] . '/backend/' . $photo_url;
        
        if (file_exists($file_path)) {
            if (unlink($file_path)) {

            } else {
                error_log("Failed to delete file: $file_path");
            }
        }
    }

    $update_stmt = $db->prepare("UPDATE trainers SET photo_url = NULL WHERE id = ?");
    $update_stmt->execute([$id]);
    
    echo json_encode([
        "success" => true,
        "message" => "Photo deleted successfully",
        "trainer_id" => $id
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Database error",
        "message" => $e->getMessage()
    ]);
}