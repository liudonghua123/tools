-- Lua Advanced: Functions

-- Multiple returns
local function swap(a, b)
    return b, a
end

local x, y = swap(10, 20)
print("Swapped:", x, y)

-- Variadic functions
local function sum(...)
    local s = 0
    for _, v in ipairs({...}) do
        s = s + v
    end
    return s
end

print("Sum:", sum(1, 2, 3, 4))

-- First-class functions
local square = function(n) return n * n end
print("Square of 4:", square(4))
