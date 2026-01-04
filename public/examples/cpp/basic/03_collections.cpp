#include <iostream>
#include <vector>
#include <map>

int main() {
    // Vector (Dynamic array)
    std::vector<std::string> fruits = {"apple", "banana"};
    fruits.push_back("cherry");
    
    std::cout << "Fruits:" << std::endl;
    for (const auto& fruit : fruits) {
        std::cout << "- " << fruit << std::endl;
    }

    // Map (Dictionary)
    std::map<std::string, int> ages;
    ages["Alice"] = 25;
    ages["Bob"] = 30;
    
    std::cout << "Alice's age: " << ages["Alice"] << std::endl;
    
    return 0;
}
