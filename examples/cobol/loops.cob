       IDENTIFICATION DIVISION.
       PROGRAM-ID. LOOPS.
       DATA DIVISION.
       WORKING-STORAGE SECTION.
       01  ICOUNT         PIC 9(2).
       01  TOTAL          PIC 9(3) VALUE 0.

       PROCEDURE DIVISION.
           DISPLAY "--- Loops (PERFORM VARYING) ---".
           
           PERFORM VARYING ICOUNT FROM 1 BY 1 UNTIL ICOUNT > 5
               DISPLAY "Iteration: " ICOUNT
               ADD ICOUNT TO TOTAL
           END-PERFORM.

           DISPLAY "Total Sum: " TOTAL.
           
           DISPLAY " ".
           DISPLAY "--- Simple Loop (PERFORM TIMES) ---".
           
           PERFORM 3 TIMES
               DISPLAY "Hello from simple loop!"
           END-PERFORM.

           STOP RUN.
