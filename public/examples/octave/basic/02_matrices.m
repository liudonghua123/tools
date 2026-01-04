% Octave Basic: Matrices
% Matrices are the core of Octave/MATLAB

% Define a 2x3 matrix
A = [1, 2, 3; 
     4, 5, 6];

% Transpose
B = A';

disp("Matrix A:");
disp(A);

disp("Transpose B:");
disp(B);

% Matrix multiplication
C = A * B;
disp("A multiplied by its transpose:");
disp(C);

% Element-wise operations
D = A .* 2;
disp("A multiplied by 2 (element-wise):");
disp(D);
