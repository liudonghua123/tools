package main

import "fmt"

// Multiple returns
func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, fmt.Errorf("cannot divide by zero")
    }
    return a / b, nil
}

func main() {
    result, err := divide(10, 2)
    if err != nil {
        fmt.Println("Error:", err)
    } else {
        fmt.Println("Result:", result)
    }
    
    // Anonymous function
    square := func(x int) int {
        return x * x
    }
    fmt.Println("Square of 4:", square(4))
}
