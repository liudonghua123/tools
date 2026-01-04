% Octave Basic: Plotting
% Note: Plotting in WASM might be limited depending on the implementation.
% This example shows the syntax.

x = 0:0.1:2*pi;
y = sin(x);

disp("Calculating sine wave data...");
disp("Points 1 to 5:");
disp([x(1:5); y(1:5)]);

% Plotting command
% plot(x, y);
% title('Sine Wave');
% xlabel('x');
% ylabel('sin(x)');
