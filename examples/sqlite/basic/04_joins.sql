-- SQLite Basic: Joins
CREATE TABLE departments (
    id INTEGER PRIMARY KEY,
    name TEXT
);

CREATE TABLE employees (
    id INTEGER PRIMARY KEY,
    name TEXT,
    dept_id INTEGER,
    FOREIGN KEY (dept_id) REFERENCES departments(id)
);

INSERT INTO departments (name) VALUES ('HR'), ('Engineering');
INSERT INTO employees (name, dept_id) VALUES ('Alice', 1), ('Bob', 2), ('Charlie', 2);

-- Inner Join
SELECT 
    e.name as employee, 
    d.name as department
FROM employees e
JOIN departments d ON e.dept_id = d.id;
