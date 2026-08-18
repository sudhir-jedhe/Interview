

SELECT name, price, stock, sku
FROM products
WHERE sku = 'ELEC-KEY-001';

UPDATE products
SET price = 1199.50,
    stock = 23
WHERE sku = 'ELEC-KEY-001';

SELECT name, price, stock, sku
FROM products
WHERE sku = 'ELEC-KEY-001';