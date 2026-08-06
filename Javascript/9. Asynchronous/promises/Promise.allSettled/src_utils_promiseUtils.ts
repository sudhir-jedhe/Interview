export function customAllSettled<T>(promises: Array<T | PromiseLike<T>>): Promise<Array<PromiseSettledResult<T>>> {
  return Promise.all(promises.map(p => Promise.resolve(p).then(
    value => ({ status: 'fulfilled' as const, value }),
    reason => ({ status: 'rejected' as const, reason })
  )));
}

export function createPromise<T>(value: T, delay: number, shouldReject = false): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldReject) {
        reject(value);
      } else {
        resolve(value);
      }
    }, delay);
  });
}

