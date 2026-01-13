       IDENTIFICATION DIVISION.
       PROGRAM-ID. ARITHMETIC.
       DATA DIVISION.
       WORKING-STORAGE SECTION.
       01  NUM1           PIC 9(4) VALUE 100.
       01  NUM2           PIC 9(4) VALUE 50.
       01  RESULT         PIC 9(5).
       01  RESULT-FMT     PIC Z(4)9.

       PROCEDURE DIVISION.
           DISPLAY "--- Arithmetic Operations ---".
           
           ADD NUM1 TO NUM2 GIVING RESULT.
           MOVE RESULT TO RESULT-FMT.
           DISPLAY "ADD: " NUM1 " + " NUM2 " = " RESULT-FMT.

           SUBTRACT NUM2 FROM NUM1 GIVING RESULT.
           MOVE RESULT TO RESULT-FMT.
           DISPLAY "SUBTRACT: " NUM1 " - " NUM2 " = " RESULT-FMT.

           MULTIPLY NUM1 BY NUM2 GIVING RESULT.
           MOVE RESULT TO RESULT-FMT.
           DISPLAY "MULTIPLY: " NUM1 " * " NUM2 " = " RESULT-FMT.

           DIVIDE NUM1 BY NUM2 GIVING RESULT.
           MOVE RESULT TO RESULT-FMT.
           DISPLAY "DIVIDE: " NUM1 " / " NUM2 " = " RESULT-FMT.
           
           COMPUTE RESULT = (NUM1 + NUM2) * 2.
           MOVE RESULT TO RESULT-FMT.
           DISPLAY "COMPUTE: (" NUM1 " + " NUM2 ") * 2 = " RESULT-FMT.
           
           STOP RUN.
