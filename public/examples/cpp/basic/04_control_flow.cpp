#include <iostream>

int main() {
    int score = 85;

    // If-Else
    if (score >= 90) {
        std::cout << "Grade: A" << std::endl;
    } else if (score >= 80) {
        std::cout << "Grade: B" << std::endl;
    } else {
        std::cout << "Grade: C" << std::endl;
    }

    // Switch
    char grade = 'B';
    switch(grade) {
        case 'A': std::cout << "Excellent!" << std::endl; break;
        case 'B': std::cout << "Well done" << std::endl; break;
        default: std::cout << "Keep trying" << std::endl;
    }

    // Loops
    for (int i = 0; i < 3; ++i) {
        std::cout << "Count: " << i << std::endl;
    }

    return 0;
}
