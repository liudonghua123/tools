// Async/Await in Node.js

// Promise example
function delay(ms) {
    return new Promise(resolve => setTimeout(() => resolve(ms), ms));
}

async function runAsync() {
    console.log("Starting async operations...");

    // Wait for a delay
    await delay(100);
    console.log("Waited 100ms");

    // Multiple async operations
    const results = await Promise.all([
        delay(50).then(() => "First"),
        delay(100).then(() => "Second"),
        delay(75).then(() => "Third")
    ]);
    console.log("Results:", results);

    // Error handling in async functions
    try {
        await Promise.reject(new Error("Something went wrong"));
    } catch (error) {
        console.log("Caught error:", error.message);
    }

    console.log("Async operations complete!");
}

runAsync().then(() => {
    console.log("All done!");
});