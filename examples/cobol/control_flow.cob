       IDENTIFICATION DIVISION.
       PROGRAM-ID. CONTROL-FLOW.
       DATA DIVISION.
       WORKING-STORAGE SECTION.
       01  NUM            PIC 9(3) VALUE 55.
       01  GRADE          PIC X VALUE 'B'.

       PROCEDURE DIVISION.
           DISPLAY "--- Control Flow ---".
           DISPLAY "Number is " NUM.

           IF NUM > 50
               DISPLAY "Result: Number is greater than 50"
           ELSE
               DISPLAY "Result: Number is less than or equal to 50"
           END-IF.

           DISPLAY " ".
           DISPLAY "Grade is " GRADE.
           
           EVALUATE GRADE
               WHEN 'A'
                   DISPLAY "Result: Excellent!"
               WHEN 'B'
                   DISPLAY "Result: Good job"
               WHEN 'C'
                   DISPLAY "Result: Fair"
               WHEN 'D'
                   DISPLAY "Result: Poor"
               WHEN 'F'
                   DISPLAY "Result: Fail"
               WHEN OTHER
                   DISPLAY "Result: Invalid grade"
           END-EVALUATE.

           STOP RUN.
