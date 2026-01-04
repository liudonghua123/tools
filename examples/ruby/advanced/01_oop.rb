class Shape
  def area
    0
  end
end

class Circle < Shape
  def initialize(radius)
    @radius = radius
  end

  def area
    Math::PI * @radius**2
  end
end

puts "Area of circle with radius 5: #{Circle.new(5).area}"
