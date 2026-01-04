<?php
// PHP Basic: Control Flow

$hour = 14;

if ($hour < 12) {
    echo "Good morning\n";
} else {
    echo "Good afternoon\n";
}

// Foreach is common for arrays
$fruits = ["apple", "banana"];
foreach ($fruits as $fruit) {
    echo "Fruit: $fruit\n";
}

// While loop
$i = 1;
while ($i <= 3) {
    echo "Number $i\n";
    $i++;
}
?>