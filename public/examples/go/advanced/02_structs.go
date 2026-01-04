package main

import "fmt"

type Person struct {
    Name string
    Age  int
}

// Method with pointer receiver
func (p *Person) Greet() {
    fmt.Printf("Hello, my name is %s and I am %d years old.\n", p.Name, p.Age)
}

func main() {
    p := Person{Name: "Alice", Age: 25}
    p.Greet()
    
    // Inline struct
    car := struct {
        Make  string
        Model string
    }{Make: "Tesla", Model: "Model 3"}
    fmt.Println("Car:", car.Make, car.Model)
}
