export default function promiseAll<T>(iterable: Iterable<T | PromiseLike<T>>): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const results: T[] = [];
    let unresolved = 0;
    let iterableArray: (T | PromiseLike<T>)[];

    if (typeof iterable[Symbol.iterator] === 'function') {
      iterableArray = [...iterable];
    } else {
      reject(new TypeError(`${typeof iterable} ${iterable} is not iterable`));
      return;
    }

    unresolved = iterableArray.length;

    if (unresolved === 0) {
      resolve(results);
      return;
    }

    iterableArray.forEach(async (item, index) => {
      try {
        const value = await item;
        results[index] = value;
        unresolved -= 1;

        if (unresolved === 0) {
          resolve(results);
        }
      } catch (err) {
        reject(err);
      }
    });
  });
}

