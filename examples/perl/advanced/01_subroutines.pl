# Perl Advanced: Subroutines

sub greet {
    my ($name, $msg) = @_;
    $msg //= "Hello"; # default if undef
    return "$msg, $name!";
}

print greet("Bob") . "\n";
print greet("Alice", "Hi") . "\n";

# Anonymous sub
my $square = sub {
    my $n = shift;
    return $n * $n;
};

print "Square of 5: " . &$square(5) . "\n";
