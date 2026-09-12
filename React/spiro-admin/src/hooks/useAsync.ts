/**
 * useAsync — data fetching with the three bugs fixed.
 *
 *   1. RACE CONDITIONS  a slow earlier request must not overwrite a fast
 *                       later one (type "a" then "ab").
 *   2. CANCELLATION     unmounting aborts the in-flight request.
 *   3. DEPENDENCY LOOP  an inline fetcher must not re-run the effect every
 *                       render — it lives in a ref.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

export interface AsyncState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isFetching: boolean;
}

export interface UseAsyncOptions<T> {
  enabled?: boolean;
  initialData?: T | null;
}

export function useAsync<T>(
  fetcher: (opts: { signal: AbortSignal }) => Promise<T>,
  deps: unknown[] = [],
  options: UseAsyncOptions<T> = {}
) {
  const { enabled = true, initialData = null } = options;

  const [state, setState] = useState<AsyncState<T>>({
    data: initialData,
    error: null,
    isLoading: enabled,
    isFetching: false,
  });

  // The fetcher is almost always an inline arrow. Keeping it in a ref means
  // it never has to be a dependency, which is what breaks the render loop.
  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  const [nonce, setNonce] = useState(0);
  const refetch = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    if (!enabled) {
      setState((s) => ({ ...s, isLoading: false }));
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    setState((s) => ({ ...s, isFetching: true, error: null }));

    fetcherRef
      .current({ signal: controller.signal })
      .then((data) => {
        if (cancelled) return;
        setState({ data, error: null, isLoading: false, isFetching: false });
      })
      .catch((error: Error) => {
        // We aborted on purpose — that is not an error state.
        if (cancelled || error.name === 'AbortError') return;
        setState((s) => ({ ...s, error, isLoading: false, isFetching: false }));
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, enabled, nonce]);

  return { ...state, refetch, isError: state.error !== null };
}

/** For user-triggered work (submit, toggle) where an effect is wrong. */
export function useAsyncAction<Args extends unknown[], R>(
  action: (...args: Args) => Promise<R>
) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const actionRef = useRef(action);
  useEffect(() => {
    actionRef.current = action;
  });

  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const run = useCallback(async (...args: Args): Promise<R | undefined> => {
    setIsPending(true);
    setError(null);

    try {
      const result = await actionRef.current(...args);
      if (mounted.current) setIsPending(false);
      return result;
    } catch (err) {
      if (mounted.current) {
        setError(err as Error);
        setIsPending(false);
      }
      return undefined;
    }
  }, []);

  return { run, isPending, error };
}
