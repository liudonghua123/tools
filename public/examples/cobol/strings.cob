       IDENTIFICATION DIVISION.
       PROGRAM-ID. STRINGS.
       DATA DIVISION.
       WORKING-STORAGE SECTION.
       01  FIRST-NAME     PIC X(10) VALUE "JOHN".
       01  LAST-NAME      PIC X(10) VALUE "DOE".
       01  FULL-NAME      PIC X(25) VALUE SPACES.
       01  SENTENCE       PIC X(50) VALUE "COBOL IS INTERESTING".
       01  COUNT-I        PIC 9(2) VALUE 0.

       PROCEDURE DIVISION.
           DISPLAY "--- String Handling ---".
           
           DISPLAY "First Name: " FIRST-NAME.
           DISPLAY "Last Name:  " LAST-NAME.

           STRING FIRST-NAME DELIMITED BY SPACE
                  " " DELIMITED BY SIZE
                  LAST-NAME DELIMITED BY SPACE
                  INTO FULL-NAME.
           
           DISPLAY "Full Name:  " FULL-NAME.

           DISPLAY " ".
           DISPLAY "Original: " SENTENCE.
           
           INSPECT SENTENCE TALLYING COUNT-I FOR ALL "I".
           DISPLAY "Count of 'I': " COUNT-I.
           
           INSPECT SENTENCE REPLACING ALL "INTERESTING" BY "POWERFUL   ".
           DISPLAY "Replaced: " SENTENCE.

           STOP RUN.
