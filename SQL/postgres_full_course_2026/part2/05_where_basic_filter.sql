
-- /products?category=electronics

-- SELECT name, category, price
-- FROM products
-- WHERE category = 'electronics';

-- find products where the price > 1000

-- SELECT name, price
-- FROM products
-- WHERE price > 1000;

-- find products which are not active

SELECT name, is_active
FROM products
WHERE is_active = FALSE;