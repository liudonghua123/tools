#include <iostream>
#include <string>

int main() {
    // Standard data types
    int age = 25;
    double pi = 3.14159;
    std::string name = "Alice";
    bool isHappy = true;
    
    // Type inference (C++11+)
    auto status = "Learning";
    
    std::cout << "Name: " << name << ", Age: " << age << std::endl;
    std::cout << "Status: " << status << std::endl;
    
    return 0;
}
