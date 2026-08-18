# Output-Based: N+1 Hidden Behind a Loop

```js
const posts = await Post.findAll(); // 1 query, returns 100 posts
console.log('query count so far: 1');

let queryCount = 1;
for (const post of posts) {
  const author = await User.findByPk(post.authorId);
  queryCount++;
}
console.log('total queries:', queryCount);
```

**Answer:** `total queries: 101`

**Why:** The loop fires one additional `SELECT` per post to fetch its author, sequentially awaited — 100 posts means 100 extra round-trips on top of the original list query, for 101 total. This is the textbook N+1 problem: it "works," and each individual line looks innocuous, but it scales linearly with the number of parent rows instead of staying constant.
