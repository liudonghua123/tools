// Rust (Rune) Basic: Collections

pub fn main() {
    // Lists
    let fruits = ["apple", "banana"];
    
    // Objects (HashMaps)
    let person = #{ "name": "Alice", "age": 25 };
    
    println!("Fruits: {:?}", fruits);
    println!("Person name: {}", person["name"]);
    
    for fruit in fruits {
        println!("Fruit: {}", fruit);
    }
}
