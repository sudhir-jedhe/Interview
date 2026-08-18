

INSERT INTO products (name, category, price, stock, sku, description)
VALUES 
('laptop stand 5', 'electronics', 100, 45, 'ELEC-LAP-100', 'laptop stand 5 desc'),
('laptop stand 6', 'electronics', 100, 45, 'ELEC-LAP-101', 'laptop stand 6 desc'),
('laptop stand 7', 'electronics', 100, 45, 'ELEC-LAP-102', 'laptop stand 7 desc');


SELECT name, category, price, stock, sku
FROM products
WHERE sku IN ('ELEC-LAP-100','ELEC-LAP-101', 'ELEC-LAP-102');
