using System;

// If-Else Statement
int score = 85;
if (score >= 90)
{
    Console.WriteLine("Grade: A");
}
else if (score >= 80)
{
    Console.WriteLine("Grade: B");
}
else
{
    Console.WriteLine("Grade: C");
}

// For Loop
Console.WriteLine("\nCounting 1 to 5:");
for (int i = 1; i <= 5; i++)
{
    Console.WriteLine(i);
}

// While Loop
Console.WriteLine("\nCountdown:");
int count = 3;
while (count > 0)
{
    Console.WriteLine(count);
    count--;
}

// Switch Statement
string day = "Monday";
switch (day)
{
    case "Monday":
        Console.WriteLine("\nStart of the week!");
        break;
    case "Friday":
        Console.WriteLine("\nAlmost weekend!");
        break;
    default:
        Console.WriteLine("\nRegular day");
        break;
}
