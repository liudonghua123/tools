-- SQLite Basic: Queries
CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    name TEXT,
    price REAL,
    category TEXT
);

INSERT INTO products (name, price, category) VALUES 
('Laptop', 1200, 'Electronics'),
('Phone', 800, 'Electronics'),
('Chair', 150, 'Furniture'),
('Desk', 300, 'Furniture');

-- Filter and Sort
SELECT * FROM products 
WHERE category = 'Electronics' 
AND price > 500
ORDER BY price DESC;
