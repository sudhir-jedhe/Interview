## In what order do the subscriber logs fire?

```javascript
store.subscribe(() => console.log('subscriber saw:', store.getState().status));

function doWork() {
  return (dispatch, getState) => {
    console.log('thunk start, status is', getState().status);
    dispatch({ type: 'work/pending' }); // synchronous
    console.log('right after dispatching pending, status is', getState().status);

    setTimeout(() => {
      dispatch({ type: 'work/done' });
    }, 0);
  };
}

console.log('before dispatch');
store.dispatch(doWork());
console.log('after dispatch call returns');
```

Assume the reducer sets `status` to `'pending'` on `work/pending` and `'done'` on `work/done`, starting from `'idle'`.

**Answer:**
```
before dispatch
thunk start, status is idle
subscriber saw: pending
right after dispatching pending, status is pending
after dispatch call returns
subscriber saw: done
```

**Why:** `store.dispatch(doWork())` synchronously calls the thunk function. The thunk itself runs synchronously up until the `setTimeout` call — there's no `await` before it — so `dispatch({ type: 'work/pending' })` executes immediately and synchronously within that same call stack. Redux's `dispatch` is itself synchronous: reducers run and subscribers are notified before `dispatch` returns, which is why `'subscriber saw: pending'` logs *before* `'right after dispatching pending...'`'s `console.log` even finishes its own statement's evaluation — the subscriber callback fires as a side effect of the `dispatch(...)` call, in the middle of the thunk's execution, before control returns to the thunk's next line. Only the `work/done` dispatch, deferred via `setTimeout(..., 0)`, is pushed to the macrotask queue — it runs after the current synchronous call stack (including `'after dispatch call returns'`) has fully unwound. The key insight: dispatching a synchronous action inside a thunk has zero delay — it's not "eventually consistent," it happens immediately, in-line, exactly like calling `dispatch` from anywhere else.
