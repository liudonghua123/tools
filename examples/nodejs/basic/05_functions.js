// Functions in Node.js

// Regular function
function greet(name) {
    return "Hello, " + name + "!";
}
console.log(greet("World"));

// Function expression
const add = function(a, b) {
    return a + b;
};
console.log("2 + 3 =", add(2, 3));

// Arrow function
const multiply = (a, b) => a * b;
console.log("4 * 5 =", multiply(4, 5));

// Arrow with single parameter (no parentheses needed)
const square = x => x * x;
console.log("6^2 =", square(6));

// Default parameters
function greetWithDefault(name = "Guest") {
    return "Hello, " + name + "!";
}
console.log(greetWithDefault());
console.log(greetWithDefault("Alice"));

// Rest parameters
function sumAll(...numbers) {
    return numbers.reduce((a, b) => a + b, 0);
}
console.log("Sum of 1,2,3,4,5:", sumAll(1, 2, 3, 4, 5));

// Higher-order function
function applyOperation(fn, a, b) {
    return fn(a, b);
}
const result = applyOperation((x, y) => x * y, 3, 4);
console.log("applyOperation result:", result);