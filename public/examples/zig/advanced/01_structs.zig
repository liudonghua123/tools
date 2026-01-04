const std = @import("std");

const User = struct {
    name: []const u8,
    age: u8,

    pub fn introduce(self: User) void {
        std.debug.print("Hi, I'm {s}, {d} years old.\n", .{self.name, self.age});
    }
};

pub fn main() !void {
    const user = User{
        .name = "Alice",
        .age = 25,
    };
    user.introduce();
}
