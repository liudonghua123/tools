// Rust (Rune) Basic: Control Flow

pub fn main() {
    let score = 85;

    if score >= 90 {
        println!("Grade: A");
    } else if score >= 80 {
        println!("Grade: B");
    } else {
        println!("Grade: C");
    }

    println!("Looping:");
    for i in 0..3 {
        println!("i: {}", i);
    }
}
