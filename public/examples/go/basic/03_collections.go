package main

import "fmt"

func main() {
    // Slices (dynamic arrays)
    fruits := []string{"apple", "banana"}
    fruits = append(fruits, "cherry")
    fmt.Println("Slices:", fruits)

    // Maps (Key-Value)
    ages := map[string]int{
        "Alice": 25,
        "Bob":   30,
    }
    fmt.Println("Alice's age:", ages["Alice"])

    // Iterating over collections
    for i, fruit := range fruits {
        fmt.Printf("Index %d: %s\n", i, fruit)
    }
}
