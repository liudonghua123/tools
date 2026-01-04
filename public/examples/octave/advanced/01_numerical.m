% Octave Advanced: Numerical Methods
% Solving linear systems A*x = b

% System of 3 equations
A = [3, 2, -1; 
     2, -2, 4; 
    -1, 0.5, -1];
b = [1; -2; 0];

disp("Matrix A:");
disp(A);
disp("Vector b:");
disp(b);

% Use backslash operator for efficient solving
x = A \ b;

disp("Solution x:");
disp(x);

% Verify solution
residual = A*x - b;
disp("Verification (A*x - b):");
disp(residual);
