# Ruby Advanced: Exceptions

begin
  # result = 10 / 0
  raise "Something went wrong!"
rescue => e
  puts "Caught error: #{e.message}"
ensure
  puts "This always runs"
end
