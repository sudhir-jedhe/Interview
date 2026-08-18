

-- select * - returns every cols
-- select specific cols is going to return the cols that i want


-- SELECT * FROM products;

-- SELECT price
-- FROM products;

-- AS creates an alias for the output of that column name
-- makes the col name easier to read

SELECT 
  name AS product_name,
  price AS selling_price,
  stock AS available_quantity
FROM products;