

-- one post can have multiple tags
-- one tag can be associated with multiple posts

-- posts.id === post_tags.post_id
-- tags.id === post_tags.tag_id


-- show me every post with it's tag

SELECT 
   posts.title AS post_title,
   tags.name AS tag_name
FROM posts
INNER JOIN post_tags
  ON posts.id = post_tags.post_id
INNER JOIN tags
  ON post_tags.tag_id = tags.id
ORDER BY posts.title, tags.name;
   