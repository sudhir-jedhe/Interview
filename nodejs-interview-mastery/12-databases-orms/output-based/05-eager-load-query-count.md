# Output-Based: Sequelize Eager Load Changes Query Count but Not Correctness of Naive Code

```js
// Model has Post.belongsTo(User, { as: 'author' })

const posts = await Post.findAll({ include: { model: User, as: 'author' } });
console.log(posts[0].author.email); // does this need another query?
```

**Answer:** No additional query — `posts[0].author.email` is already populated and accessing it is a plain synchronous property read.

**Why:** `include` tells Sequelize to generate a single `JOIN` query up front and hydrate the association eagerly, attaching the related `author` object to each `Post` instance at load time. This is the whole point of eager loading — the N+1 problem specifically arises when the association is accessed *lazily* (a separate `await post.getAuthor()` call, or a naive manual loop), not when it's `include`d.
