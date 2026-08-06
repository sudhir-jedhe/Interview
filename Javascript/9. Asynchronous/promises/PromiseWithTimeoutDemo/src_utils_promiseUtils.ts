export function promiseWithTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`Promise timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    promise.then(resolve, reject).finally(() => clearTimeout(timeoutId));
  });
}

export function createDelayedPromise(delay: number): Promise<string> {
  return new Promise(resolve => {
    setTimeout(() => resolve('Success!'), delay);
  });
}

