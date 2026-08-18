# Problem: Design a Blog API (Posts + Comments) with Pagination

## Problem statement

Design and implement REST endpoints for a simple blog with posts and comments. Comments belong to a post. The post-list endpoint needs pagination, since a busy blog can accumulate thousands of posts.

## Requirements

- `GET /posts` — list posts, paginated
- `GET /posts/:id` — get a single post
- `POST /posts` — create a post
- `GET /posts/:postId/comments` — list comments for a post
- `POST /posts/:postId/comments` — add a comment to a post
- Pick **either** offset-based or cursor-based pagination for `GET /posts` and justify the choice
- Consistent `{ data, meta }` / `{ error }` response envelope

## Design choice: cursor-based pagination

A public-facing blog list is read far more often than it's written, but posts are still inserted continuously (new posts, occasional deletes for moderation), and a blog's post list is a classic "infinite scroll" / "load more" UX rather than "jump to page 40." Cursor pagination keeps queries fast at any depth (indexed range lookup, not `OFFSET`) and avoids the classic bug where offset pagination shows duplicate or skipped posts because new posts were inserted between page loads. The tradeoff — no "jump to page N" — is an acceptable loss for a blog feed.

## Worked solution

```js
// db.js — in-memory store standing in for a real database, ordered by id
const posts = new Map();      // id -> { id, title, body, createdAt }
const comments = new Map();   // id -> { id, postId, author, body, createdAt }
let nextPostId = 1;
let nextCommentId = 1;

module.exports = { posts, comments, nextPostId: () => nextPostId++, nextCommentId: () => nextCommentId++ };
```

```js
// routes/posts.js
const express = require('express');
const router = express.Router();
const { posts, comments, nextPostId, nextCommentId } = require('../db');

function ok(res, data, meta) { return res.json(meta ? { data, meta } : { data }); }
function fail(res, status, message, code) { return res.status(status).json({ error: { message, code } }); }

// GET /posts?after=<cursor>&limit=20 — cursor-based pagination
router.get('/posts', (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const after = req.query.after ? Number(req.query.after) : 0;

  const sorted = [...posts.values()]
    .filter(p => p.id > after)
    .sort((a, b) => a.id - b.id)
    .slice(0, limit);

  const nextCursor = sorted.length === limit ? sorted[sorted.length - 1].id : null;
  ok(res, sorted, { nextCursor, limit });
});

router.get('/posts/:id', (req, res) => {
  const post = posts.get(Number(req.params.id));
  if (!post) return fail(res, 404, 'Post not found', 'POST_NOT_FOUND');
  ok(res, post);
});

router.post('/posts', (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) return fail(res, 400, 'title and body are required', 'VALIDATION_ERROR');

  const id = nextPostId();
  const post = { id, title, body, createdAt: new Date().toISOString() };
  posts.set(id, post);
  res.status(201).json({ data: post });
});

router.get('/posts/:postId/comments', (req, res) => {
  const postId = Number(req.params.postId);
  if (!posts.has(postId)) return fail(res, 404, 'Post not found', 'POST_NOT_FOUND');

  const postComments = [...comments.values()].filter(c => c.postId === postId);
  ok(res, postComments);
});

router.post('/posts/:postId/comments', (req, res) => {
  const postId = Number(req.params.postId);
  if (!posts.has(postId)) return fail(res, 404, 'Post not found', 'POST_NOT_FOUND');

  const { author, body } = req.body;
  if (!author || !body) return fail(res, 400, 'author and body are required', 'VALIDATION_ERROR');

  const id = nextCommentId();
  const comment = { id, postId, author, body, createdAt: new Date().toISOString() };
  comments.set(id, comment);
  res.status(201).json({ data: comment });
});

module.exports = router;
```

```js
// app.js
const express = require('express');
const app = express();
app.use(express.json());
app.use('/', require('./routes/posts'));
app.listen(3000, () => console.log('listening on 3000'));
```

Every list response returns a `nextCursor` in `meta` — the client passes it back as `?after=<nextCursor>` to fetch the next page, and a `null` cursor signals the end of the list.
