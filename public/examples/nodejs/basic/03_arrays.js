// Arrays in Node.js

// Create array
let fruits = ["Apple", "Banana", "Orange"];

// Access elements
console.log("First fruit:", fruits[0]);
console.log("Array length:", fruits.length);

// Add elements
fruits.push("Grape");
console.log("After push:", fruits);

// Remove last
let removed = fruits.pop();
console.log("Removed:", removed);
console.log("After pop:", fruits);

// Map
let numbers = [1, 2, 3, 4, 5];
let doubled = numbers.map(x => x * 2);
console.log("Doubled:", doubled);

// Filter
let evens = numbers.filter(x => x % 2 === 0);
console.log("Evens:", evens);

// Reduce
let sum = numbers.reduce((acc, x) => acc + x, 0);
console.log("Sum:", sum);

// Find
let found = numbers.find(x => x > 3);
console.log("Found > 3:", found);

// ForEach
console.log("ForEach:");
numbers.forEach(n => console.log("  -", n));