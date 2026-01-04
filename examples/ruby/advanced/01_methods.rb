# Ruby Advanced: Methods & Blocks

def greet(name, greeting = "Hello")
  "#{greeting}, #{name}!"
end

puts greet("Bob")

# Blocks and Yield
def wrap_in_tags
  print "<html>"
  yield # Execute the block passed to the method
  print "</html>\n"
end

wrap_in_tags { print "Hello World" }
