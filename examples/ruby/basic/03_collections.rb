# Ruby Basic: Collections

# Array
fruits = ["apple", "banana"]
fruits << "cherry" # append
puts "Fruits: #{fruits.inspect}"

# Hash (Key-Value)
person = { name: "Alice", age: 25 }
puts "Person: #{person[:name]}"

# Iterating
fruits.each do |fruit|
  puts "I like #{fruit}"
end
