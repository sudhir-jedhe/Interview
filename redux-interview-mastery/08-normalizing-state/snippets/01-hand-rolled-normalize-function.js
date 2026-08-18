// Runnable with plain Node: `node 01-hand-rolled-normalize-function.js`
// A self-contained normalize() that turns a nested post payload into flat tables.

const apiResponse = {
  id: 'p1',
  title: 'Redux tips',
  author: { id: 'u1', name: 'Ada' },
  comments: [
    { id: 'c1', text: 'Nice!', author: { id: 'u1', name: 'Ada' } },
    { id: 'c2', text: 'Thanks', author: { id: 'u2', name: 'Grace' } },
  ],
};

function normalizePost(post) {
  const authors = {};
  const comments = {};

  authors[post.author.id] = post.author;

  const commentIds = post.comments.map((comment) => {
    authors[comment.author.id] = comment.author;
    comments[comment.id] = { id: comment.id, text: comment.text, authorId: comment.author.id };
    return comment.id;
  });

  return {
    posts: {
      byId: { [post.id]: { id: post.id, title: post.title, authorId: post.author.id, commentIds } },
      allIds: [post.id],
    },
    comments: { byId: comments, allIds: commentIds },
    authors: { byId: authors, allIds: Object.keys(authors) },
  };
}

const normalized = normalizePost(apiResponse);
console.log(JSON.stringify(normalized, null, 2));
// authors.byId only has 2 keys (u1, u2) even though Ada appears twice in the source.
