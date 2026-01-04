# Perl Basic: Arrays (@)

my @colors = ("red", "green", "blue");
push(@colors, "yellow"); # append

print "First color: $colors[0]\n";
print "All colors: ", join(", ", @colors), "\n";

# Array size
print "Number of colors: ", scalar @colors, "\n";

# Shift/Unshift
my $first = shift @colors;
print "Removed $first, remaining: ", join(", ", @colors), "\n";
