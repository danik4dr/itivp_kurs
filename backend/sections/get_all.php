<?php
require_once "../config.php";
require_once "../database.php";

try {
    $db = (new Database())->connect();
    $stmt = $db->query("SELECT * FROM sections ORDER BY id DESC");
    $sections = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        "success" => true,
        "sections" => $sections
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage(),
        "sections" => []
    ]);
}
?>