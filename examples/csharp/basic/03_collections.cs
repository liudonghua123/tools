using System;
using System.Collections.Generic;
using System.Linq;

// Arrays
int[] numbers = { 1, 2, 3, 4, 5 };
Console.WriteLine($"First number: {numbers[0]}");
Console.WriteLine($"Array length: {numbers.Length}");

// Lists
List<string> fruits = new List<string> { "Apple", "Banana", "Orange" };
fruits.Add("Grape");
Console.WriteLine($"Fruits count: {fruits.Count}");
foreach (var fruit in fruits)
{
    Console.WriteLine($"- {fruit}");
}

// Dictionaries
Dictionary<string, int> scores = new Dictionary<string, int>
{
    { "Alice", 95 },
    { "Bob", 87 },
    { "Charlie", 92 }
};
Console.WriteLine($"Alice's score: {scores["Alice"]}");
