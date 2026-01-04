const std = @import("std");

// Zig Basic: Introduction
// Single line comments start with //

pub fn main() !void {
    // print to stderr (std.debug.print) - common for debugging
    std.debug.print("Hello {s}!\n", .{"Zig"});
}
