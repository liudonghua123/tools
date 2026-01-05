using System;
using System.Collections.Generic;
using System.Linq;

// LINQ (Language Integrated Query)
List<int> numbers = new List<int> { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };

// Filter even numbers
var evenNumbers = numbers.Where(n => n % 2 == 0);
Console.WriteLine("Even numbers:");
foreach (var num in evenNumbers)
{
    Console.WriteLine(num);
}

// Transform with Select
var squared = numbers.Select(n => n * n);
Console.WriteLine("\nSquared numbers:");
foreach (var num in squared)
{
    Console.WriteLine(num);
}

// Aggregate operations
int sum = numbers.Sum();
double average = numbers.Average();
int max = numbers.Max();

Console.WriteLine($"\nSum: {sum}");
Console.WriteLine($"Average: {average}");
Console.WriteLine($"Max: {max}");
