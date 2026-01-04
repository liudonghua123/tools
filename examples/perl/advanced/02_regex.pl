# Perl Advanced: Regular Expressions

my $text = "The quick brown fox jumps over the lazy dog";

# Matching
if ($text =~ /fox/) {
    print "Found fox!\n";
}

# Substitution
$text =~ s/lazy/sleepy/;
print "New text: $text\n";

# Capture groups
if ("2026-01-04" =~ /(\d{4})-(\d{2})-(\d{2})/) {
    print "Year: $1, Month: $2, Day: $3\n";
}
