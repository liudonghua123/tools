-- SQLite Advanced: Aggregates
CREATE TABLE sales (
    id INTEGER PRIMARY KEY,
    product TEXT,
    amount REAL
);

INSERT INTO sales (product, amount) VALUES 
('A', 100), ('B', 200), ('A', 50), ('C', 300), ('B', 150);

-- Aggregate query
SELECT 
    product, 
    COUNT(*) as count, 
    SUM(amount) as total, 
    AVG(amount) as average
FROM sales
GROUP BY product
HAVING total > 150
ORDER BY total DESC;
