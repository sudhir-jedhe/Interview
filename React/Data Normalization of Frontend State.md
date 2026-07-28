// State management has become a critical task in modern frontend applications, especially in the decoupled and stateless architecture where the data is pulled from the server and stored in the browser, which will be later used for rendering the user interface and handling user interactions.

// In order to keep the application performant, it is very important how you handle the data. Servers return the data in a complex structure that can have duplicates, which makes them bulky, redundant, and extremely complex to process them.

// This data can be normalized to remove duplicates and simplify its structure, making it easier to process and analyze.

```js
const blogPosts = [
    {
      id: 'post-1',
      author: { id: "user-1", username: 'user1', email: 'user-1@gmail.com' },
      body: '......',
      comments: [
        {
          id: 'comment1',
          author: { id: "user-2", username: 'user2', email: 'user-2@gmail.com' },
          body: '.....'
        },
        {
          id: 'comment2',
          author: { id: "user-3", username: 'user3', email: 'user-3@gmail.com' },
          body: '.....'
        }
      ]
    },
  ];


//   There are two major problems with this data.

// It becomes more challenging to update the records in the state.
// The data is very nested, which will make it complex to get the desired information efficiently.
// This data can be normalizaed to make it is easier, to update, store, and modifiy the records.

// This is similar to the CRUD (Create, Read, Update, and Delete) that we perform in the databases, but here because we are dealing with the local state, we don’t create a record, rather we just update, store, or modify them.


// The process of normalizing the state is also similar to how we normalize the database table in the RDBMS.


// For each entity, we want them to have a single source of truth, which means they can be updated in only one place and will be referenced in other places.

// We can adhere to this principle of RDBMS for normalizing the state’s data.

// Each entity should be stored separately representing a table.
// It is best to store a group of similar entities together as an object, with the objects themselves serving as the values and object identifiers as the keys.
// An independent array with just identifiers in it should define the data order in this object.
// Only identifiers should be used to refer to one another in data.
// Using this, we can create a byIds and allIds hierarchical structure. This hierarchical structure allows for efficient data retrieval and manipulation.


const blogPosts = {
    posts: {
      byIds: {
        post-1: {
          id: 'post-1',
          author: 'user-1',
          body: '......',
          comments: ['comment-1', 'comment-2'],
        },
        post-2: {
          id: 'post-2',
          author: 'user-2',
          body: '......',
          comments: [],
        },
      },
      allIds: ['post-1', 'post-2'],
    },
    comments: {
      byIds: {
        "comment-1": {
          id: 'comment-1',
          author: 'user-2',
          comment: '.....',
        },
        "comment-2": {
          id: 'comment-2',
          author: 'user-3',
          comment: '.....',
        },
      },
      allIds: ['comment-1', 'comment-2'],
    },
    users: {
      byIds: {
        "user-1": {
          id: 'user-1',
          username: 'user1',
          email: 'user-1@gmail.com',
        },
        "user-2": {
          id: 'user-2',
          username: 'user-2',
          email: 'user-2@gmail.com',
        },
        "user-3": {
          id: 'user-3',
          username: 'user-3',
          email: 'user-3@gmail.com',
        },
      },
      allIds: ['user-1', 'user-2', 'user-3'],
    }
  }


//   Here we have grouped each entity and converted it to an object, using the id (unique identifier) as the key and the entity as the value.

// Also, in each entity group, we have the ids array, which makes it easier to iterate rather than retrieving the object keys every time.

// With this structure, it has now become easier to update any record or create a new one; all the operations will take place in constant or linear time.

const addNewComment = (postId, comment) => {
    // create a new comment
    const {id: commentId} = comment;
    blogPosts.comments.byIds[commentId] = comment;
    blogPosts.comments.ids = [...blogPosts.comments.ids, commentId];

    //update the post with the comment
    blogPosts.posts.byIds[postId].comments = [...blogPosts.posts.byIds[postId].comments, commentId];
  }



  const getAllCommentsForThePost = (postId) => {
    const mappedComments = blogPosts.posts.byIds[postId].comments.map((commentId) => {
      // get the comment details
      const comment = blogPosts.comments.byIds[commentId];

      // get the author details
      const user = blogPosts.users.byIds[comment.author];

      // get the comment along with the  author details
      return {...comment, author: user};
    });

    return mappedComments
  };
```
