# Ruby Advanced: Enumerable (Functional)

numbers = [1, 2, 3, 4, 5]

# Map
squares = numbers.map { |n| n * n }
puts "Squares: #{squares}"

# Select (Filter)
evens = numbers.select { |n| n.even? }
puts "Evens: #{evens}"

# Reduce
sum = numbers.reduce(0) { |acc, n| acc + n }
puts "Sum: #{sum}"
