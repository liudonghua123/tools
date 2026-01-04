import java.util.ArrayList;
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        // ArrayList (Dynamic array)
        ArrayList<String> fruits = new ArrayList<>();
        fruits.add("apple");
        fruits.add("banana");
        System.out.println("Fruits: " + fruits);

        // HashMap (Key-Value pairs)
        HashMap<String, Integer> ages = new HashMap<>();
        ages.put("Alice", 25);
        ages.put("Bob", 30);
        System.out.println("Alice's age: " + ages.get("Alice"));

        // Iterating
        for (String fruit : fruits) {
            System.out.println("Fruit: " + fruit);
        }
    }
}
