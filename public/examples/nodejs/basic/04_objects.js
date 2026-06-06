// Objects in Node.js

// Create object
let person = {
    name: "John",
    age: 30,
    city: "New York"
};

// Access properties
console.log("Name:", person.name);
console.log("Age:", person["age"]);

// Add property
person.email = "john@example.com";
console.log("Email:", person.email);

// Object methods
let user = {
    firstName: "Jane",
    lastName: "Doe",
    getFullName: function() {
        return this.firstName + " " + this.lastName;
    }
};
console.log("Full name:", user.getFullName());

// Object.keys, values, entries
console.log("Keys:", Object.keys(person));
console.log("Values:", Object.values(person));
console.log("Entries:", Object.entries(person));

// Destructuring
const { name, age } = person;
console.log(`Destructured: ${name}, ${age}`);

// Spread operator
let obj1 = { a: 1, b: 2 };
let obj2 = { c: 3, ...obj1 };
console.log("Spread:", obj2);

// JSON
let jsonStr = JSON.stringify(person);
console.log("JSON:", jsonStr);