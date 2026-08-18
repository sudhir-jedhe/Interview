-- returning usually returns back the rows immediately after insert, UPDATE & delete



-- INSERT INTO products (name, category, price, stock, sku, description)
-- VALUES ('webcam camera', 'electronics', 456.67, 56, 'ELEC-WEB-009', 'webcam camera description')
-- RETURNING id, name, category, price, stock, created_at;


-- UPDATE products
-- SET stock = stock + 11
-- WHERE sku = 'ELEC-WEB-009'
-- RETURNING id, name, stock;

DELETE FROM products
WHERE sku = 'ELEC-WEB-009'
RETURNING id, name, sku;

SELECT name, sku
FROM products
WHERE sku = 'ELEC-WEB-009';