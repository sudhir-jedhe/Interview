

DROP TABLE IF EXISTS basics.students;

CREATE TABLE basics.students (
    
    -- create an auto incrementing integer
    -- 1, -> 2, 3 and so on, 4, 5
    --  primary key simply means this col uniquely identifies each row

    id SERIAL PRIMARY KEY,

    -- text - string data
    --  not null means this col is required
    -- postgres is going to reject if this name valiue is not present

    name TEXT NOT NULL,
   
    -- unique means - no 2 students is going to have same email

    email TEXT NOT NULL UNIQUE,



    age INTEGER CHECK (age >= 18),

    -- TIMESTAMP -> stores date and time format 
    -- default means if u dont give any value it will take by default
    created_at TIMESTAMP DEFAULT NOW()
);


-- insert some data

INSERT INTO basics.students (name, email, age)
VALUES 
  ('Sangam', 'sangam@gmail.com', 55),
  ('John', 'john@gmail.com', 23);


