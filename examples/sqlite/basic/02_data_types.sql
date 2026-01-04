-- SQLite Basic: Data Types
CREATE TABLE demo (
    val_null BLOB,
    val_int INTEGER,
    val_real REAL,
    val_text TEXT
);

INSERT INTO demo VALUES (NULL, 42, 3.14, 'Hello');

SELECT 
    val_null, 
    val_int, 
    val_real, 
    val_text,
    TYPEOF(val_int) as type_int,
    TYPEOF(val_real) as type_real
FROM demo;
