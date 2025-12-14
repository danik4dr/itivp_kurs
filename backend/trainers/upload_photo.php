<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
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

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Method not allowed"]);
    exit();
}

if (!isset($_FILES['photo'])) {
    echo json_encode(["success" => false, "error" => "No file"]);
    exit();
}

if ($_FILES['photo']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode([
        "success" => false,
        "error" => "Upload error",
        "code" => $_FILES['photo']['error']
    ]);
    exit();
}

$id = (int)($_POST['id'] ?? 0);
if (!$id) {
    echo json_encode(["success" => false, "error" => "Trainer ID required"]);
    exit();
}

try {
    $db = (new Database())->connect();
    
    // Получаем старое фото перед загрузкой нового
    $stmt = $db->prepare("SELECT photo_url FROM trainers WHERE id = ?");
    $stmt->execute([$id]);
    $trainer = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$trainer) {
        echo json_encode(["success" => false, "error" => "Trainer not found"]);
        exit();
    }
    
    $old_photo_url = $trainer['photo_url'];
    
    $upload_dir = $_SERVER['DOCUMENT_ROOT'] . '/backend/uploads/trainers/';

    if (!file_exists($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }

    if (!is_writable($upload_dir)) {
        chmod($upload_dir, 0777);
        
        if (!is_writable($upload_dir)) {
            $upload_dir = $_SERVER['DOCUMENT_ROOT'] . '/temp_uploads/trainers/';
            if (!file_exists($upload_dir)) {
                mkdir($upload_dir, 0777, true);
            }
        }
    }

    $ext = strtolower(pathinfo($_FILES['photo']['name'], PATHINFO_EXTENSION));
    $allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

    if (!in_array($ext, $allowed)) {
        echo json_encode(["success" => false, "error" => "Invalid file type"]);
        exit();
    }

    $filename = "trainer_{$id}_" . time() . "." . $ext;
    $target = $upload_dir . $filename;

    if (!is_uploaded_file($_FILES['photo']['tmp_name'])) {
        echo json_encode([
            "success" => false,
            "error" => "Temp file not valid",
            "tmp" => $_FILES['photo']['tmp_name']
        ]);
        exit();
    }

    if (!file_exists($_FILES['photo']['tmp_name'])) {
        echo json_encode([
            "success" => false,
            "error" => "Temp file does not exist",
            "tmp_path" => $_FILES['photo']['tmp_name']
        ]);
        exit();
    }

    if (!move_uploaded_file($_FILES['photo']['tmp_name'], $target)) {
        $error = error_get_last();
        echo json_encode([
            "success" => false, 
            "error" => "Failed to move file",
            "error_details" => $error,
            "from" => $_FILES['photo']['tmp_name'],
            "to" => $target,
            "upload_dir_writable" => is_writable($upload_dir)
        ]);
        exit();
    }

    if (!file_exists($target)) {
        echo json_encode([
            "success" => false, 
            "error" => "File was not saved",
            "target" => $target,
            "file_exists" => file_exists($target)
        ]);
        exit();
    }

    $relative_path = 'uploads/trainers/' . $filename;
    
    // Удаляем старое фото (если оно не no-photo.png)
    if ($old_photo_url && $old_photo_url !== 'uploads/trainers/no-photo.png') {
        $old_file_path = $_SERVER['DOCUMENT_ROOT'] . '/backend/' . $old_photo_url;
        if (file_exists($old_file_path)) {
            unlink($old_file_path);
        }
    }
    
    $update_stmt = $db->prepare("UPDATE trainers SET photo_url = ? WHERE id = ?");
    $update_stmt->execute([$relative_path, $id]);
    
    echo json_encode([
        "success" => true,
        "photo_url" => $relative_path
    ]);
    
} catch (Exception $e) {
    if (isset($target) && file_exists($target)) {
        unlink($target);
    }
    
    echo json_encode([
        "success" => false,
        "error" => "Database error",
        "message" => $e->getMessage()
    ]);
}