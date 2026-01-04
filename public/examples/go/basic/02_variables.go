package main

import "fmt"

func main() {
    // Standard declaration
    var name string = "Alice"
    var age int = 25
    
    // Short declaration (inside functions only)
    pi := 3.14
    isHappy := true
    
    fmt.Printf("Name: %s, Age: %d, Pi: %f, Happy: %t\n", name, age, pi, isHappy)
    
    // Zero values
    var x int
    fmt.Println("Zero value of int:", x)
}
