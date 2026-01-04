<?php
$numbers = range(1, 10);
$squares = array_map(fn($n) => $n * $n, $numbers);
echo "Squares: " . implode(", ", $squares) . "\n";
?>