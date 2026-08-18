# Problem 1: Hand-Written Async Thunk With Loading/Error State and Cancellation

## Task

Without using `@reduxjs/toolkit`, implement:

1. A thunk `fetchArticle(id, { signal })` that dispatches `article/pending`, then `article/fulfilled` or `article/rejected`.
2. A reducer tracking `{ data, status, error }` for exactly one article at a time.
3. Support for cancellation: if the fetch is aborted (component unmounted), no `rejected` action should fire — the request should just quietly stop.

## Reference solution

```javascript
// articleThunks.js
export function fetchArticle(id, { signal } = {}) {
  return async function (dispatch, getState) {
    dispatch({ type: 'article/pending', payload: { id } });
    try {
      const res = await fetch(`/api/articles/${id}`, { signal });
      if (!res.ok) {
        throw new Error(`Failed to load article: ${res.status}`);
      }
      const data = await res.json();

      // guard against a slow, now-irrelevant response for a different article
      if (getState().article.requestedId !== id) return;

      dispatch({ type: 'article/fulfilled', payload: data });
    } catch (err) {
      if (err.name === 'AbortError') {
        // cancelled — not a real error, dispatch nothing (or optionally a 'cancelled' action)
        return;
      }
      if (getState().article.requestedId !== id) return;
      dispatch({ type: 'article/rejected', payload: err.message });
    }
  };
}

// articleReducer.js
const initialState = {
  requestedId: null,
  data: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

export default function articleReducer(state = initialState, action) {
  switch (action.type) {
    case 'article/pending':
      return {
        ...state,
        requestedId: action.payload.id,
        status: 'loading',
        error: null,
      };
    case 'article/fulfilled':
      return { ...state, status: 'succeeded', data: action.payload, error: null };
    case 'article/rejected':
      return { ...state, status: 'failed', error: action.payload };
    default:
      return state;
  }
}
```

```jsx
// ArticlePage.jsx — the cancellation wiring
function ArticlePage({ articleId }) {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((s) => s.article);

  useEffect(() => {
    const controller = new AbortController();
    dispatch(fetchArticle(articleId, { signal: controller.signal }));
    return () => controller.abort(); // fires on unmount or when articleId changes
  }, [articleId, dispatch]);

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'failed') return <p>Error: {error}</p>;
  if (status === 'succeeded') return <article>{data.title}</article>;
  return null;
}
```

## Why the `requestedId` guard is included even with `AbortController`

`AbortController` reliably stops *new* work triggered after abort (the fetch itself), but there's a narrow window where a response can already be in-flight and resolve essentially simultaneously with the abort signal firing — depending on browser/runtime timing, this isn't always perfectly atomic. Comparing `getState().article.requestedId` against the `id` this specific thunk call was invoked with is a cheap, deterministic second line of defense: even in a race, state is only ever updated by whichever request corresponds to the *currently requested* article, never a stale one — matching the interview-qa guidance in `../interview-qa/02-async-patterns-qa.md` about pairing cancellation with a staleness check rather than relying on either alone.
