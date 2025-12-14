<?php

session_start();

if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
     http_response_code(403);
     echo json_encode(["success" => false, "error" => "Admin required"]);
     exit();
}

return true;
