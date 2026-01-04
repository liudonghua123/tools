<?php
// PHP Basic: Arrays

// Indexed array
$colors = ["red", "green", "blue"];
$colors[] = "yellow"; // append
print_r($colors);

// Associative array
$ages = [
    "Alice" => 25,
    "Bob" => 30
];
echo "Alice's age: " . $ages["Alice"] . "\n";

// Count elements
echo "Total colors: " . count($colors) . "\n";
?>