# Perl Basic: Control Flow

my $score = 85;

if ($score >= 90) {
    print "Grade: A\n";
} elsif ($score >= 80) {
    print "Grade: B\n";
} else {
    print "Grade: C\n";
}

# 'unless' is the opposite of 'if'
my $debug = 0;
print "Production mode\n" unless $debug;

# For loop
foreach my $i (1..3) {
    print "Count: $i\n";
}
