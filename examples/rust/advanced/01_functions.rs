// Rust (Rune) Advanced: Functions

fn add(a, b) {
    a + b
}

pub fn main() {
    let result = add(10, 20);
    println!("Sum: {}", result);
    
    // Closures
    let square = |x| x * x;
    println!("Square of 5: {}", square(5));
}
