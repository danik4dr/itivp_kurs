<?php
require_once __DIR__ . "/../config.php";
if (!isset($_SESSION["user"])) {
    http_response_code(401);
    echo json_encode(["success" => false, "error" => "Auth required"]);
    exit();
}
