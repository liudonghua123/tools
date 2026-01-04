<?php
// PHP Advanced: OOP

class Animal
{
    public $name;

    public function __construct($name)
    {
        $this->name = $name;
    }

    public function speak()
    {
        return "...";
    }
}

class Dog extends Animal
{
    public function speak()
    {
        return "Woof!";
    }
}

$dog = new Dog("Buddy");
echo $dog->name . " says " . $dog->speak() . "\n";
?>