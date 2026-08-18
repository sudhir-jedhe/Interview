
-- NOT NULL, UNIQUE, DEFAULT, CHECK
-- app, script, developer

DROP TABLE IF EXISTS basics.accounts;

CREATE TABLE basics.accounts (

    id SERIAL PRIMARY KEY,

    full_name TEXT NOT NULL,

    email TEXT NOT NULL UNIQUE,

    is_active BOOLEAN DEFAULT true,

    age INTEGER CHECK (age >= 18),

    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO basics.accounts (full_name, email, age)
VALUES ('sangam mukherjee', 'sangam@gmail.com', 20);

-- SELECT * FROM basics.accounts;

-- INSERT INTO basics.accounts (email, age)
-- VALUES ('missingname@gmail.com', 20);

INSERT INTO basics.accounts (full_name, email, age)
VALUES ('duplicate email user', 'sangam1@gmail.com', 5);
