<?php
// Add CORS headers at the top of the PHP file
header("Access-Control-Allow-Origin: *"); // Allows requests from any domain
header("Access-Control-Allow-Methods: POST, GET, OPTIONS"); // Allow specific HTTP methods
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allow specific headers

// MySQL connection details
$host = 'localhost'; 
$db = 'travel_blog'; 
$user = 'root'; 
$password = ''; 

$conn = new mysqli($host, $user, $password, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Capture form data
$name = $_POST['name'];
$email = $_POST['email'];
$mobile = $_POST['mobile'];
$city = $_POST['city'];
$pickupLocation = $_POST['pickupLocation'];
$dropLocation = $_POST['dropLocation'];
$rating = $_POST['rating'];
$paymentMethod = $_POST['paymentMethod'];
$transactionId = isset($_POST['transactionId']) ? $_POST['transactionId'] : null;

// Insert data into the database
$stmt = $conn->prepare("INSERT INTO journey_ratings (name, email, mobile, city, pickup_location, drop_location, rating, payment_method, transaction_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssssssiss", $name, $email, $mobile, $city, $pickupLocation, $dropLocation, $rating, $paymentMethod, $transactionId);

if ($stmt->execute()) {
    echo json_encode(["message" => "Journey successfully rated!"]);
} else {
    echo json_encode(["error" => "Error: " . $conn->error]);
}

$stmt->close();
$conn->close();
?>
