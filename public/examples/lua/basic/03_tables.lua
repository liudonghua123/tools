-- Lua Basic: Tables
-- Tables are the only data structure in Lua

-- As an array (1-indexed!)
local fruits = {"apple", "banana"}
table.insert(fruits, "cherry")
print("First fruit:", fruits[1])

-- As a dictionary (associative array)
local person = {
    name = "Alice",
    age = 25
}
print("Name:", person.name)
print("Age:", person["age"])

-- Iterating
print("Fruits:")
for i, v in ipairs(fruits) do
    print(i, v)
end
