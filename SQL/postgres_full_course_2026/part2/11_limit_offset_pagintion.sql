

-- limit -> how many rows you want to return
-- offset -> how many rows we want to skip

-- SELECT name, price
-- FROM products
-- ORDER BY price DESC
-- LIMIT 5;


SELECT name, price
FROM products
ORDER BY name ASC
LIMIT 5 OFFSET 0;


SELECT name, price
FROM products
ORDER BY name ASC
LIMIT 5 OFFSET 5;


--  (page - 1) * limit
-- (2 - 1) * 5 -> 5
-- (3 - 1) * 5 -> 10

SELECT name, price
FROM products
ORDER BY name ASC
LIMIT 5 OFFSET 10;
