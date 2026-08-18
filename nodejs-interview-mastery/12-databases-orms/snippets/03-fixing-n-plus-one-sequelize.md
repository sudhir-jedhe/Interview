# Snippet: Fixing an N+1 Query with Eager Loading (Sequelize)

```js
const { Post, User } = require('./models');

// BAD: N+1 — one query per post to fetch its author
async function getPostsSlow() {
  const posts = await Post.findAll();
  for (const post of posts) post.author = await User.findByPk(post.authorId);
  return posts;
}

// GOOD: single query with a JOIN via `include`
async function getPostsFast() {
  return Post.findAll({ include: { model: User, as: 'author' } });
}
```

**Explanation:** `getPostsSlow` issues 1 query for the post list, then 1 additional query *per post* inside the loop — for 100 posts, that's 101 total queries. `getPostsFast` instead tells Sequelize to generate a single `JOIN` query up front via `include`, hydrating each post's `author` association at load time — 1 query total, regardless of how many posts are returned. This is the standard fix for N+1: replace the lazy per-item fetch with an eager, single-query join.
