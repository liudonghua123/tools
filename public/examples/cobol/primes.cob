       IDENTIFICATION DIVISION.
       PROGRAM-ID. PRIMES.
       DATA DIVISION.
       WORKING-STORAGE SECTION.
       01  MAX-NUM        PIC 9(3) VALUE 20.
       01  NUM            PIC 9(3).
       01  DIVISOR        PIC 9(3).
       01  REMAINDER-VAL  PIC 9(3).
       01  IS-PRIME       PIC X.
           88 PRIME       VALUE 'Y'.
           88 NOT-PRIME   VALUE 'N'.

       PROCEDURE DIVISION.
           DISPLAY "Prime Numbers up to " MAX-NUM ":".
           
           PERFORM VARYING NUM FROM 2 BY 1 UNTIL NUM > MAX-NUM
               SET PRIME TO TRUE
               PERFORM VARYING DIVISOR FROM 2 BY 1 
                 UNTIL DIVISOR > NUM / 2 OR NOT-PRIME
                   DIVIDE NUM BY DIVISOR GIVING REMAINDER-VAL 
                          REMAINDER REMAINDER-VAL
                   IF REMAINDER-VAL = 0
                       SET NOT-PRIME TO TRUE
                   END-IF
               END-PERFORM
               
               IF PRIME
                   DISPLAY NUM " is prime"
               END-IF
           END-PERFORM.

           STOP RUN.
