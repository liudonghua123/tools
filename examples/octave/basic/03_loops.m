% Octave Basic: Control Flow

% For loop
disp("For loop from 1 to 5:");
for i = 1:5
  printf("  Iteration %d\n", i);
end

% While loop
disp("While loop:");
count = 3;
while count > 0
  printf("  Countdown: %d\n", count);
  count = count - 1;
end

% If-Else
x = 10;
if (x > 5)
  disp("x is greater than 5");
else
  disp("x is less than or equal to 5");
end
