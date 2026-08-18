# The N+1 Query Problem

Fetching a list of N parent records, then lazily fetching related data for each one individually, results in 1 + N queries instead of 2 (or 1 with a join).

```js
// N+1 BUG: 1 query for posts, then N queries — one per post — for its author
const posts = await Post.findAll();
for (const post of posts) {
  post.author = await User.findByPk(post.authorId); // fires a query EVERY iteration
}
```
```js
// FIX: eager-load the association in a single query (Sequelize)
const posts = await Post.findAll({ include: User });

// Prisma equivalent
const posts = await prisma.post.findMany({ include: { author: true } });

// Mongoose equivalent
const posts = await Post.find().populate('author');
```
ORMs make this bug easy to write by accident because lazy-loading an association *looks* like a harmless property access or a simple loop — the N extra round-trips are invisible unless you're watching query logs (`sequelize` has a `logging` option; Prisma has query event logging) or using an APM tool.

## Why eager loading doesn't need a second query on access

Once an association is eager-loaded via `include`/`populate`, accessing the related field afterward (e.g. `posts[0].author.email`) is a plain synchronous property read — no additional query fires. The N+1 problem specifically arises when the association is accessed *lazily* (a separate awaited call inside a loop), not when it's `include`d up front.

## How to catch this class of bug before production

Enable query logging in development (`logging: console.log` in Sequelize, Prisma's query event logging) so an unexpectedly high query count per request is visible immediately, and consider an APM tool that flags requests issuing an unusually large number of queries — treat "one request, dozens of near-identical single-row queries" as a code-review red flag on sight.
