# Python Advanced: Functional Tools

numbers = [1, 2, 3, 4, 5]

# List comprehension
squares = [n * n for n in numbers]
print("Squares:", squares)

# Filter
evens = list(filter(lambda x: x % 2 == 0, numbers))
print("Evens:", evens)

# Map
double = list(map(lambda x: x * 2, numbers))
print("Double:", double)
