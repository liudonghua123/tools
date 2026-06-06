// Error Handling in Node.js

// try...catch
try {
    // This will throw an error
    JSON.parse("invalid json{");
} catch (error) {
    console.log("Caught error:", error.message);
}

// Custom errors
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
    }
}

function validateAge(age) {
    if (typeof age !== "number") {
        throw new TypeError("Age must be a number");
    }
    if (age < 0 || age > 150) {
        throw new ValidationError("Age must be between 0 and 150");
    }
    return true;
}

try {
    validateAge(-5);
} catch (error) {
    console.log(`Error type: ${error.name}`);
    console.log(`Error message: ${error.message}`);
}

// Error handling in functions
function safeDivide(a, b) {
    try {
        if (b === 0) {
            throw new Error("Division by zero!");
        }
        return a / b;
    } catch (error) {
        console.log("Error in safeDivide:", error.message);
        return null;
    }
}

console.log("10 / 2 =", safeDivide(10, 2));
console.log("10 / 0 =", safeDivide(10, 0));

// finally block
try {
    console.log("Trying something...");
    throw new Error("Oops!");
} catch (error) {
    console.log("Caught:", error.message);
} finally {
    console.log("This always runs");
}