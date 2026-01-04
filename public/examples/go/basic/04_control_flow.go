package main

import "fmt"

func main() {
    score := 85

    // If-Else
    if score >= 90 {
        fmt.Println("Grade: A")
    } else if score >= 80 {
        fmt.Println("Grade: B")
    } else {
        fmt.Println("Grade: C")
    }

    // Switch
    switch {
    case score > 80:
        fmt.Println("Well done!")
    default:
        fmt.Println("Keep trying.")
    }

    // For loop (the only loop in Go)
    fmt.Println("Counting:")
    for i := 0; i < 3; i++ {
        fmt.Println(i)
    }
}
