type PromiseOrValue<T> = T | Promise<T>;

export function promiseAll<T>(promises: PromiseOrValue<T>[]): Promise<T[]> {
  const _promises = promises.map((item) =>
    item instanceof Promise ? item : Promise.resolve(item)
  );

  if (_promises.length === 0) {
    return Promise.resolve([]);
  }

  return new Promise((resolve, reject) => {
    const result: T[] = [];
    let fulfilledCount = 0;
    let isErrored = false;

    _promises.forEach((promise, index) => {
      promise.then(
        (value) => {
          if (isErrored) return;
          result[index] = value;

          fulfilledCount += 1;
          if (fulfilledCount === _promises.length) {
            resolve(result);
          }
        },
        (error) => {
          if (isErrored) return;
          isErrored = true;
          reject(error);
        }
      );
    });
  });
}

