# Problem 1: Normalize a Nested API Response by Hand

## Task

You're given the following API response for a blog's post list endpoint — an array of posts, each with an embedded author and an array of embedded comments, each comment with its own embedded author.

```javascript
const apiResponse = [
  {
    id: 'p1',
    title: 'Redux tips',
    author: { id: 'u1', name: 'Ada' },
    comments: [
      { id: 'c1', text: 'Nice!', author: { id: 'u1', name: 'Ada' } },
      { id: 'c2', text: 'Thanks for this', author: { id: 'u2', name: 'Grace' } },
    ],
  },
  {
    id: 'p2',
    title: 'Normalizing 101',
    author: { id: 'u2', name: 'Grace' },
    comments: [
      { id: 'c3', text: 'Great writeup', author: { id: 'u1', name: 'Ada' } },
    ],
  },
];
```

Implement `normalizePosts(apiResponse)` (no external libraries — plain JS) that returns:

```javascript
{
  posts: { byId: { p1: {...}, p2: {...} }, allIds: ['p1', 'p2'] },
  comments: { byId: { c1: {...}, c2: {...}, c3: {...} }, allIds: ['c1', 'c2', 'c3'] },
  authors: { byId: { u1: {...}, u2: {...} }, allIds: ['u1', 'u2'] }, // deduped!
}
```

Each `post` in `byId` should have `authorId` and `commentIds` instead of embedded objects. Each `comment` should have `authorId` instead of an embedded object. `authors.byId` must contain each unique author exactly once, even though Ada and Grace each appear multiple times in the source data.

## Solution

```javascript
function normalizePosts(apiResponse) {
  const postsById = {};
  const postIds = [];
  const commentsById = {};
  const commentIds = [];
  const authorsById = {};

  for (const post of apiResponse) {
    authorsById[post.author.id] = post.author;

    const thisPostCommentIds = [];
    for (const comment of post.comments) {
      authorsById[comment.author.id] = comment.author; // overwrite = dedupe by ID
      commentsById[comment.id] = {
        id: comment.id,
        text: comment.text,
        authorId: comment.author.id,
      };
      commentIds.push(comment.id);
      thisPostCommentIds.push(comment.id);
    }

    postsById[post.id] = {
      id: post.id,
      title: post.title,
      authorId: post.author.id,
      commentIds: thisPostCommentIds,
    };
    postIds.push(post.id);
  }

  return {
    posts: { byId: postsById, allIds: postIds },
    comments: { byId: commentsById, allIds: commentIds },
    authors: { byId: authorsById, allIds: Object.keys(authorsById) },
  };
}

// Verify:
const result = normalizePosts(apiResponse);
console.assert(Object.keys(result.authors.byId).length === 2, 'authors should be deduped to 2');
console.assert(result.posts.byId.p1.commentIds.length === 2, 'p1 should have 2 comment ids');
console.assert(result.comments.byId.c1.authorId === 'u1', 'c1 authorId should be u1');
console.log('All assertions passed.');
```

## Why this matters

This is the exact transformation you'd write inside an RTK Query `transformResponse` or a thunk's `.then()` handler for any relational API — interviewers use it to check that you understand normalization isn't magic, it's a straightforward tree walk with a dedup-by-object-key trick, and that you know where to draw entity boundaries (anything with a stable ID that could be referenced from more than one place becomes its own table).
