public class Main {
    public static void main(String[] args) {
        int score = 85;

        // If-Else
        if (score >= 90) {
            System.out.println("Grade: A");
        } else if (score >= 80) {
            System.out.println("Grade: B");
        } else {
            System.out.println("Grade: C");
        }

        // For loop
        System.out.println("Counting:");
        for (int i = 0; i < 3; i++) {
            System.out.println(i);
        }

        // Switch (since Java 14 can use ->)
        String day = "MONDAY";
        switch (day) {
            case "MONDAY": System.out.println("Start of week"); break;
            default: System.out.println("Other day");
        }
    }
}
