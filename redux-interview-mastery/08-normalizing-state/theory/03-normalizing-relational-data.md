# Normalizing Relational API Data

Most real APIs hand you deeply nested JSON because it's convenient for a single screen: a blog post endpoint embeds its comments, and each comment embeds its author, because that's exactly what the "post detail" page needs in one round trip. The mistake is storing that shape directly in Redux. The fix is to normalize it once, at the boundary — right when the response arrives — so the rest of your app never has to think about nesting again.

## The nested payload

```javascript
// GET /posts/p1 response
const apiResponse = {
  id: 'p1',
  title: 'Redux tips',
  author: { id: 'u1', name: 'Ada' },
  comments: [
    { id: 'c1', text: 'Nice!', author: { id: 'u1', name: 'Ada' } },
    { id: 'c2', text: 'Thanks', author: { id: 'u2', name: 'Grace' } },
  ],
};
```

## Normalizing it by hand

The mechanical process: walk the tree, and every time you encounter an object that represents an "entity" (has a stable ID and could plausibly be referenced from more than one place), pull it out into its own table and replace it in the parent with just its ID.

```javascript
function normalizePost(post) {
  const authors = {};
  const comments = {};

  authors[post.author.id] = post.author;

  const commentIds = post.comments.map((comment) => {
    authors[comment.author.id] = comment.author; // dedupes automatically via object key
    comments[comment.id] = { id: comment.id, text: comment.text, authorId: comment.author.id };
    return comment.id;
  });

  const posts = {
    [post.id]: { id: post.id, title: post.title, authorId: post.author.id, commentIds },
  };

  return { posts, comments, authors };
}

const { posts, comments, authors } = normalizePost(apiResponse);
// authors === { u1: { id: 'u1', name: 'Ada' } }  <- deduped automatically,
// even though Ada appeared as both the post author and a commenter.
```

Notice the dedup happens for free: writing `authors[comment.author.id] = comment.author` twice with the same ID just overwrites the same key with (in this case) identical data. If Ada's name were updated on the server between the post's author field and a comment's author field arriving in the same response, the second write wins — a real normalization library like `normalizr` handles merge conflicts more carefully, but for most apps "last write wins" during ingestion is fine because the entities describe the same real-world thing.

## Using `normalizr` instead of hand-rolling it

For anything beyond a couple of relationship levels, hand-rolled normalization gets repetitive and error-prone (forgetting to dedupe, forgetting an ID field). The `normalizr` library lets you declare the shape once as a schema and reuses it for any response with that shape.

```javascript
import { schema, normalize } from 'normalizr';

const authorSchema = new schema.Entity('authors');
const commentSchema = new schema.Entity('comments', { author: authorSchema });
const postSchema = new schema.Entity('posts', {
  author: authorSchema,
  comments: [commentSchema],
});

const normalized = normalize(apiResponse, postSchema);
// normalized.entities === { posts: {...}, comments: {...}, authors: {...} }
// normalized.result === 'p1' (or an array of IDs, for a list endpoint)
```

## Where this happens in a real app

Do this normalization in exactly one place: the boundary where data enters Redux — inside a thunk after the fetch resolves, or (more commonly today) inside an RTK Query `transformResponse`. Never normalize in a component or in a selector on every render; normalize once on ingestion, store the flat shape, and let selectors handle the (cheap) job of re-assembling a denormalized view for rendering. See `04-create-entity-adapter.md` for how RTK's `createEntityAdapter` gives you the `byId`/`allIds` (there: `entities`/`ids`) tables and their setters without writing this normalization and reducer logic by hand.
