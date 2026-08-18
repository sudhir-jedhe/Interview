
-- left join keeps all rows from the left table 
-- if the right table has matching data, postgreSQL includes that
-- if its don't have any matching data it returns null

-- posts -> left table
-- comments -> right table

-- because not every posts is going have comments
-- some posts will have 100 comments and some will have 0

SELECT 
  posts.title AS post_title,
  comments.body AS comment_body
FROM posts
LEFT JOIN comments
  ON posts.id = comments.post_id
ORDER BY posts.title;