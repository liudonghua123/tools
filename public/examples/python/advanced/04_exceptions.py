# Python Advanced: Exception Handling

def divide(a, b):
    try:
        result = a / b
    except ZeroDivisionError:
        print("Error: Cannot divide by zero!")
        return None
    except TypeError as e:
        print(f"Error: Invalid input! {e}")
        return None
    else:
        print("Success! Division performed.")
        return result
    finally:
        print("Cleaning up operation...")

print("Result 1:", divide(10, 2))
print("Result 2:", divide(10, 0))
