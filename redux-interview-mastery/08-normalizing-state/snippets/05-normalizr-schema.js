// Requires: normalizr
// Declaring a reusable schema so any endpoint returning "post-shaped" data normalizes the same way.

import { schema, normalize } from 'normalizr';

const authorSchema = new schema.Entity('authors');
const commentSchema = new schema.Entity('comments', { author: authorSchema });
const postSchema = new schema.Entity('posts', {
  author: authorSchema,
  comments: [commentSchema],
});

// Works for a single post...
const singlePostResponse = {
  id: 'p1',
  title: 'Redux tips',
  author: { id: 'u1', name: 'Ada' },
  comments: [{ id: 'c1', text: 'Nice!', author: { id: 'u1', name: 'Ada' } }],
};

const { entities, result } = normalize(singlePostResponse, postSchema);
console.log('result (root id):', result); // 'p1'
console.log('entities.authors:', entities.authors); // { u1: { id: 'u1', name: 'Ada' } }

// ...and for a list of posts, just by wrapping the schema in an array.
const listResponse = [singlePostResponse];
const normalizedList = normalize(listResponse, [postSchema]);
console.log('list result (array of ids):', normalizedList.result); // ['p1']
