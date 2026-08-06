type F = () => Promise<any>;

export async function promisePool(functions: F[], n: number): Promise<[number[], number]> {
  const results: number[] = [];
  let activePromises = 0;
  let index = 0;
  const startTime = Date.now();

  const executeNext = async () => {
    if (index < functions.length) {
      const currentIndex = index++;
      activePromises++;

      const taskStartTime = Date.now();
      await functions[currentIndex]();
      const taskEndTime = Date.now() - taskStartTime;
      results.push(taskEndTime);

      activePromises--;
      executeNext();
    }
  };

  for (let i = 0; i < Math.min(n, functions.length); i++) {
    executeNext();
  }

  await new Promise<void>(resolve => {
    const checkCompletion = setInterval(() => {
      if (activePromises === 0 && index === functions.length) {
        clearInterval(checkCompletion);
        resolve();
      }
    }, 50);
  });

  const totalTime = Date.now() - startTime;
  return [results, totalTime];
}

export const allAsync = async <T>(promises: Array<T | Promise<T>>): Promise<[T[], number]> => {
  const startTime = Date.now();
  const results: T[] = [];

  for (let promise of promises) {
    results.push(await promise);
  }

  const totalTime = Date.now() - startTime;
  return [results, totalTime];
};

export const allReduce = <T>(promises: Array<T | Promise<T>>): Promise<[T[], number]> => {
  const startTime = Date.now();
  return promises.reduce((accm, curr) => {
    return accm.then((results) =>
      Promise.resolve(curr).then((r) => [...results, r])
    );
  }, Promise.resolve([] as T[]))
    .then(results => {
      const totalTime = Date.now() - startTime;
      return [results, totalTime] as [T[], number];
    });
};

export const allParallel = <T>(promises: Array<T | Promise<T>>): Promise<[T[], number]> => {
  const startTime = Date.now();
  const _promises = promises.map((item) =>
    item instanceof Promise ? item : Promise.resolve(item)
  );

  if (_promises.length === 0) {
    return Promise.resolve([[], 0]);
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
            const totalTime = Date.now() - startTime;
            resolve([result, totalTime]);
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
};

