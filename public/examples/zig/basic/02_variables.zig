const std = @import("std");

pub fn main() !void {
    // Zig Basic: Variables
    // const for immutable, var for mutable
    const pi = 3.14159;
    var age: u8 = 25;
    
    age += 1;
    
    std.debug.print("Age: {d}, Pi: {d}\n", .{age, pi});
    
    // String literals are null-terminated byte arrays
    const name = "Alice";
    std.debug.print("Name: {s}\n", .{name});
}
