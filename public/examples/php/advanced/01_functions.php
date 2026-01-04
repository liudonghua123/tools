<?php
// PHP Advanced: Functions

function greet($name, $greeting = "Hello")
{
    return "$greeting, $name!";
}

echo greet("Bob") . "\n";

// Typed parameters (PHP 7+)
function addNumbers(int $a, int $b): int
{
    return $a + $b;
}

echo "Sum: " . addNumbers(5, 10) . "\n";

// Anonymous function
$square = function ($n) {
    return $n * $n;
};
echo "Square of 4: " . $square(4) . "\n";
?>