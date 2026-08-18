

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP TABLE IF EXISTS products;


CREATE TABLE products (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name TEXT NOT NULL,

    category TEXT NOT NULL,

    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),

    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),

    is_active BOOLEAN NOT NULL DEFAULT true,

    sku TEXT UNIQUE,

    description TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);


INSERT INTO products (name, category, price, stock, is_active, sku, description)
  VALUES
  ('Mechanical Keyboard', 'electronics', 3499.00, 15, TRUE, 'ELEC-KEY-001', 'RGB keyboard with blue switches'),
  ('Wireless Mouse', 'electronics', 1299.00, 40, TRUE, 'ELEC-MOU-001', 'Ergonomic wireless mouse'),
  ('USB-C Cable', 'electronics', 399.00, 120, TRUE, 'ELEC-CAB-001', NULL),
  ('Office Chair', 'furniture', 7999.00, 8, TRUE, 'FURN-CHR-001', 'Comfortable chair for long work sessions'),
  ('Standing Desk', 'furniture', 15999.00, 3, TRUE, 'FURN-DSK-001', 'Height adjustable desk'),
  ('Notebook', 'stationery', 99.00, 200, TRUE, 'STAT-NOT-001', 'Ruled notebook for daily notes'),
  ('Gel Pen', 'stationery', 25.00, 500, TRUE, 'STAT-PEN-001', NULL),
  ('Old Monitor', 'electronics', 4999.00, 0, FALSE, 'ELEC-MON-OLD', 'Inactive old stock item');



SELECT * FROM products;