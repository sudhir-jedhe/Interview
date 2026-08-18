## How many times does the result function run across these five dispatches?

```javascript
const selectUsers = (state) => state.users;
const selectPosts = (state) => state.posts;

const selectUserPostCounts = createSelector(
  [selectUsers, selectPosts],
  (users, posts) => {
    console.log('computing post counts');
    return users.map((u) => ({
      ...u,
      postCount: posts.filter((p) => p.authorId === u.id).length,
    }));
  }
);

// simplified reducer behavior for each action type, for context:
// 'users/added'  -> returns a NEW users array (with the new user appended)
// 'posts/added'  -> returns a NEW posts array
// 'ui/tabChanged' -> only touches state.ui, users and posts arrays are untouched (same references)

dispatch({ type: 'ui/tabChanged', payload: 'posts' });      // 1
dispatch({ type: 'users/added', payload: { id: 5 } });       // 2
dispatch({ type: 'ui/tabChanged', payload: 'users' });       // 3
dispatch({ type: 'posts/added', payload: { authorId: 5 } }); // 4
dispatch({ type: 'ui/tabChanged', payload: 'posts' });       // 5

// assume selectUserPostCounts(store.getState()) is called once after EVERY dispatch above
```

**Answer:** The result function runs **2** times — once after dispatch #2 (`users/added`) and once after dispatch #4 (`posts/added`). It does NOT run after dispatches #1, #3, or #5 (`ui/tabChanged`).

**Why:** `createSelector`'s memoization is keyed purely on whether `selectUsers(state)` and `selectPosts(state)`'s *outputs* changed by reference — it has no awareness of action types, only of whatever the input selectors return. `ui/tabChanged` reducers, per the problem's stated behavior, leave `state.users` and `state.posts` as the exact same array references they were before (only `state.ui` changes) — so calling `selectUserPostCounts` after such a dispatch sees both inputs unchanged and returns the cached result without recomputing. `users/added` and `posts/added`, by contrast, each produce a genuinely new array for the slice they touch (`users` and `posts` respectively), so each of those two dispatches causes exactly one cache miss and one recomputation. This demonstrates the practical payoff of memoized selectors in components that read derived cross-slice data: dispatching actions unrelated to the selector's actual dependencies is completely free from that selector's perspective, no matter how many other reducers or slices exist in the app.
