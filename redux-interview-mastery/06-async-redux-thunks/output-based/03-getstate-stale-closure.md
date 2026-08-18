## Does this thunk see the up-to-date state?

```javascript
function submitForm(formId) {
  return async (dispatch, getState) => {
    const initialFormData = getState().forms[formId];
    console.log('before save:', initialFormData.title);

    await api.autosaveDraft(initialFormData); // takes ~2 seconds

    // user kept typing during the 2 seconds this was in flight, dispatching
    // 'form/fieldChanged' actions that updated state.forms[formId].title

    console.log('after save, still using initialFormData:', initialFormData.title);
    console.log('after save, calling getState() again:', getState().forms[formId].title);

    dispatch({ type: 'form/submitted', payload: initialFormData }); // BUG?
  };
}
```

**Answer:** The first two logged values (`initialFormData.title`) are identical and reflect whatever the title was *at the moment the thunk started* — even though the user typed more in the meantime. The third log, calling `getState()` again, reflects the *current* title. The final dispatch submits the **stale** `initialFormData`, silently dropping whatever the user typed during the 2-second autosave.

**Why:** `getState()` always returns the live, current state at the moment you call it — there's nothing stale about `getState` itself. The bug is that `initialFormData` was captured once, early, into a local variable via destructuring/assignment, and JavaScript closures don't magically "refresh" a variable's value when the underlying state changes later — `initialFormData` is a snapshot, a plain object reference, not a live binding to the store. The store's actual current state has moved on, but the thunk's local variable hasn't. The fix is to call `getState()` again immediately before using the data for anything state-sensitive (as the third log line does), rather than trusting a value captured before an `await`: `dispatch({ type: 'form/submitted', payload: getState().forms[formId] })`. This is a very common class of async-Redux bug — anything captured from `getState()` before an `await` should be treated as a point-in-time snapshot, not a reference to live state.
