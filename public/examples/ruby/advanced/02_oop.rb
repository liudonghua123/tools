# Ruby Advanced: OOP

class Animal
  attr_accessor :name
  
  def initialize(name)
    @name = name
  end
  
  def speak
    "..."
  end
end

class Dog < Animal
  def speak
    "Woof!"
  end
end

dog = Dog.new("Buddy")
puts "#{dog.name} says #{dog.speak}"
