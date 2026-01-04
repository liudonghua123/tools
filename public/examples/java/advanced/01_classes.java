class Animal {
    private String name;
    
    public Animal(String name) {
        this.name = name;
    }
    
    public String getName() { return name; }
    public void speak() { System.out.println("..."); }
}

class Dog extends Animal {
    public Dog(String name) { super(name); }
    @Override
    public void speak() { System.out.println("Woof!"); }
}

public class Main {
    public static void main(String[] args) {
        Dog dog = new Dog("Buddy");
        System.out.print(dog.getName() + " says ");
        dog.speak();
    }
}
