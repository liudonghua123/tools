# Python Advanced: Functions

# Standard function
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

print(greet("Bob"))
print(greet("Alice", greeting="Hi"))

# Args and Kwargs
def sum_all(*args, **kwargs):
    s = sum(args)
    label = kwargs.get("label", "Sum")
    return f"{label}: {s}"

print(sum_all(1, 2, 3, 4, label="Total"))

# Lambda function
square = lambda x: x * x
print("Square of 5:", square(5))
