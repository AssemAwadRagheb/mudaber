<?php
// Simple script to save JSON from admin dashboard

header('Content-Type: application/json');

// Get the raw POST data
$rawData = file_get_contents("php://input");

if ($rawData) {
    // Basic verification
    $data = json_decode($rawData, true);
    
    if (json_last_error() === JSON_ERROR_NONE) {
        // Write the data to content.json
        if (file_put_contents('content.json', $rawData)) {
            echo json_encode(["status" => "success", "message" => "Content updated successfully."]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Failed to write to file. Check file permissions on server."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Invalid JSON data."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "No data provided."]);
}
?>
