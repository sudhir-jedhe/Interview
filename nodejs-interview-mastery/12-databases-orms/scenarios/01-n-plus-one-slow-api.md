# Scenario: Your API Is Slow Because of N+1 Queries from an ORM

The `GET /posts` endpoint takes 3+ seconds once the `posts` table has a few hundred rows. APM traces show one query to fetch the posts, followed by hundreds of near-identical single-row queries fetching each post's author.

**Approach:**
This is the textbook N+1 problem — the code is lazily fetching the association inside a loop instead of eager-loading it in the original query. Fix it by using the ORM's `include`/`populate` option so the author data comes back in one JOIN (or one additional batched query), then add query logging in development so this class of bug is visible before it reaches production.

```js
// BEFORE — N+1: 1 query for posts, then 1 per post for its author
async function getPostsSlow() {
  const posts = await Post.findAll();
  for (const post of posts) {
    post.author = await User.findByPk(post.authorId); // fires every iteration
  }
  return posts;
}

// AFTER — single query with a JOIN
async function getPostsFast() {
  return Post.findAll({ include: { model: User, as: 'author' } });
}

// enable query logging in dev so N+1 patterns are visible immediately
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});
```
As a longer-term safeguard, add an APM tool (or Sequelize's `benchmark: true`) that flags requests issuing an unusually high number of queries, so a new N+1 bug gets caught in code review or staging rather than discovered in a production latency alert.
