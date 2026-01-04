# Ruby Basic: Control Flow

# If / Unless
rainy = false
puts "Go outside" unless rainy

# Case statement
grade = "A"
case grade
when "A"
  puts "Excellent"
when "B"
  puts "Good"
else
  puts "Try harder"
end

# Loop
3.times { |i| puts "Iteration #{i}" }
