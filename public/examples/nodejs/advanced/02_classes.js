// Classes in Node.js

// Basic class
class Animal {
    constructor(name) {
        this.name = name;
    }

    speak() {
        console.log(`${this.name} makes a noise.`);
    }
}

const dog = new Animal("Dog");
dog.speak();

// Inheritance
class Dog extends Animal {
    constructor(name, breed) {
        super(name);
        this.breed = breed;
    }

    speak() {
        console.log(`${this.name} barks!`);
    }

    fetch() {
        console.log(`${this.name} fetches the ball!`);
    }
}

const buddy = new Dog("Buddy", "Golden Retriever");
buddy.speak();
buddy.fetch();

// Getters and Setters
class Rectangle {
    constructor(width, height) {
        this._width = width;
        this._height = height;
    }

    get width() {
        return this._width;
    }

    set width(value) {
        if (value > 0) this._width = value;
    }

    get area() {
        return this._width * this._height;
    }
}

const rect = new Rectangle(10, 5);
console.log("Width:", rect.width);
console.log("Area:", rect.area);
rect.width = 20;
console.log("New area:", rect.area);

// Static methods
class MathHelper {
    static add(a, b) {
        return a + b;
    }

    static PI = 3.14159;
}

console.log("PI:", MathHelper.PI);
console.log("2 + 3 =", MathHelper.add(2, 3));