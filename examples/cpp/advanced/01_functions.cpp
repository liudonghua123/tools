#include <iostream>

// Standard function
int add(int a, int b) {
    return a + b;
}

// Function overloading
double add(double a, double b) {
    return a + b;
}

int main() {
    std::cout << "Sum (int): " << add(5, 10) << std::endl;
    std::cout << "Sum (double): " << add(2.5, 3.5) << std::endl;
    
    return 0;
}
