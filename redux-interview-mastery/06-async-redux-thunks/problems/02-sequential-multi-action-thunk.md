# Problem 2: A Thunk That Dispatches Multiple Actions in Sequence, With Per-Step Error Handling

## Task

Implement a thunk `publishArticle(draftId)` that performs, in order:

1. Validate the draft (`api.validateDraft(draftId)`) — if invalid, stop immediately and report validation errors.
2. Upload any pending images (`api.uploadImages(draftId)`) — if this fails, stop; the article can't publish without its images.
3. Publish the article (`api.publish(draftId)`) — if this fails, stop, but note that images were already uploaded (so a retry shouldn't re-upload them).
4. Invalidate the local drafts cache (`api.markDraftPublished(draftId)`) — non-critical; log failure but still report overall success, since the article is already live.

Each step should dispatch a distinct action so the UI can show precisely which stage failed.

## Reference solution

```javascript
export function publishArticle(draftId) {
  return async (dispatch, getState) => {
    dispatch({ type: 'publish/started', payload: { draftId } });

    // Step 1: validation
    let validation;
    try {
      validation = await api.validateDraft(draftId);
      if (!validation.valid) {
        dispatch({ type: 'publish/validationFailed', payload: validation.errors });
        return;
      }
      dispatch({ type: 'publish/validated' });
    } catch (err) {
      dispatch({ type: 'publish/validationErrored', payload: err.message });
      return;
    }

    // Step 2: image upload — fatal, and safe to retry from scratch if it fails
    try {
      await api.uploadImages(draftId);
      dispatch({ type: 'publish/imagesUploaded' });
    } catch (err) {
      dispatch({ type: 'publish/imageUploadFailed', payload: err.message });
      return;
    }

    // Step 3: publish — fatal, but a retry must NOT re-upload images
    try {
      const article = await api.publish(draftId);
      dispatch({ type: 'publish/published', payload: article });
    } catch (err) {
      dispatch({
        type: 'publish/publishFailed',
        payload: { message: err.message, imagesAlreadyUploaded: true },
      });
      return;
    }

    // Step 4: cache invalidation — non-critical, article is already live
    try {
      await api.markDraftPublished(draftId);
      dispatch({ type: 'publish/draftCacheCleared' });
    } catch (err) {
      dispatch({ type: 'publish/draftCacheClearFailed', payload: err.message });
      // deliberately no `return` — this alone doesn't make the overall operation a failure
    }

    dispatch({ type: 'publish/completed', payload: { draftId } });
  };
}
```

## Why each step gets its own action instead of one generic failure

A single `catch` around the whole sequence collapses "which step failed" into one indistinguishable "publish failed" state, which is exactly the anti-pattern covered in `../scenarios/02-multi-step-checkout-flow.md`. Here, the failure mode genuinely differs by step: a validation failure means "fix your draft," an image-upload failure means "safe to just retry the whole thing," and a publish failure — critically — means "images are already uploaded, don't re-upload them on retry" (`imagesAlreadyUploaded: true` on the payload lets a "Retry" button skip straight to step 3). Treating the non-critical last step (`markDraftPublished`) as fire-and-forget-but-logged, rather than `return`ing early on its failure, correctly reflects that the article being live is the actual success criterion — a stale local cache entry is a minor, recoverable inconsistency, not something that should make the whole publish operation report as failed to the user.
