# Perl Basic: Hashes (%)

my %ages = (
    "Alice" => 25,
    "Bob"   => 30,
);

print "Alice is $ages{'Alice'} years old.\n";

# Adding a key
$ages{'Charlie'} = 35;

# Iterating keys
foreach my $name (keys %ages) {
    print "$name is $ages{$name}\n";
}
