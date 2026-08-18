

-- INSERT INTO products (name, category, price, stock, sku, description)
-- VALUES ('temp product to be deleted', 'electronics', 345.45, 45, 'ELEC-TEMP-013','temp product desc');


SELECT name, category, sku
FROM products
WHERE sku = 'ELEC-TEMP-013';

DELETE FROM products
WHERE sku = 'ELEC-TEMP-013';

SELECT name, category, sku
FROM products
WHERE sku = 'ELEC-TEMP-013';