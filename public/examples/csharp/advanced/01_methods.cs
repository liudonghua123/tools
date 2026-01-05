using System;

// Methods (Functions)
static int Add(int a, int b)
{
    return a + b;
}

static string Greet(string name = "Guest")
{
    return $"Hello, {name}!";
}

static void PrintInfo(string message)
{
    Console.WriteLine($"Info: {message}");
}

// Using methods
int sum = Add(5, 3);
Console.WriteLine($"5 + 3 = {sum}");

Console.WriteLine(Greet());
Console.WriteLine(Greet("Alice"));

PrintInfo("This is a void method");
