package main

import (
    "fmt"
    "time"
)

func say(s string, c chan string) {
    for i := 0; i < 3; i++ {
        time.Sleep(100 * time.Millisecond)
        fmt.Println(s)
    }
    c <- s + " done"
}

func main() {
    fmt.Println("Starting goroutines...")
    
    // Channel for communication
    messages := make(chan string)
    
    go say("world", messages)
    go say("hello", messages)
    
    // Wait for both to finish
    fmt.Println(<-messages)
    fmt.Println(<-messages)
}
