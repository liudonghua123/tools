-- Lua Basic: Control Flow

local score = 85

if score >= 90 then
    print("Grade: A")
elseif score >= 80 then
    print("Grade: B")
else
    print("Grade: C")
end

-- While loop
local count = 3
while count > 0 do
    print("Counting:", count)
    count = count - 1
end

-- For loop (start, end, step)
print("Range for:")
for i = 1, 3 do
    print(i)
end
