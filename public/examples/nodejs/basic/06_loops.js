// Loops in Node.js

// for loop
console.log("For loop:");
for (let i = 0; i < 3; i++) {
    console.log("  i =", i);
}

// while loop
console.log("While loop:");
let count = 0;
while (count < 3) {
    console.log("  count =", count);
    count++;
}

// do...while loop
console.log("Do-while loop:");
let j = 0;
do {
    console.log("  j =", j);
    j++;
} while (j < 3);

// for...of (arrays)
console.log("For...of loop:");
const colors = ["red", "green", "blue"];
for (const color of colors) {
    console.log("  color:", color);
}

// for...in (objects)
console.log("For...in loop:");
const person = { name: "John", age: 30, city: "NYC" };
for (const key in person) {
    console.log(`  ${key}: ${person[key]}`);
}

// forEach
console.log("forEach:");
[10, 20, 30].forEach((num, idx) => {
    console.log(`  [${idx}] ${num}`);
});

// break and continue
console.log("Break example:");
for (let i = 0; i < 10; i++) {
    if (i === 5) break;
    console.log("  i =", i);
}