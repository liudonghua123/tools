const std = @import("std");

pub fn main() !void {
    const score = 85;

    // If-Else
    if (score >= 90) {
        std.debug.print("Grade: A\n", .{});
    } else if (score >= 80) {
        std.debug.print("Grade: B\n", .{});
    } else {
        std.debug.print("Grade: C\n", .{});
    }

    // While loop
    var i: u32 = 0;
    while (i < 3) : (i += 1) {
        std.debug.print("i: {d}\n", .{i});
    }
}
