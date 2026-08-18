

-- foreign key is a col that points to the primary key of another tab

-- users.id - parent key
-- posts.user_id - foreign key
-- every post u will create that must belong to an existing users

SELECT id, name
FROM users;

SELECT id, user_id, title
FROM posts;