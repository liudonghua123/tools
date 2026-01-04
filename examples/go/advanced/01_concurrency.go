package main

import (
    "fmt"
    "time"
)

func worker(id int, c chan int) {
    fmt.Printf("Worker %d starting\n", id)
    time.Sleep(time.Millisecond * 100)
    fmt.Printf("Worker %d done\n", id)
    c <- id
}

func main() {
    c := make(chan int)
    for i := 1; i <= 3; i++ {
        go worker(i, c)
    }
    for i := 1; i <= 3; i++ {
        <-c
    }
    fmt.Println("All workers finished")
}
