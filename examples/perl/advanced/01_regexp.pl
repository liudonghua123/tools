my $text = "The quick brown fox jumps over the lazy dog";
if ($text =~ /quick (.*) fox/) {
    print "Found animal: $1\n";
}

$text =~ s/dog/cat/;
print "Updated text: $text\n";
