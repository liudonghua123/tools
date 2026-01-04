const std = @import("std");

pub fn main() !void {
    // Zig Basic: Collections
    // Arrays (size known at compile time)
    const array = [3]u32{ 1, 2, 3 };
    
    // Slices (pointer + length)
    const slice = array[0..2];
    
    std.debug.print("Array: {any}, Slice: {any}\n", .{array, slice});
    
    for (array, 0..) |item, i| {
        std.debug.print("Index {d}: {d}\n", .{i, item});
    }
}
