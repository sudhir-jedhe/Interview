export function timeLimit<T>(asyncFunc: (...args: any[]) => Promise<T>, limit: number): (...args: any[]) => Promise<T> {
  return function (...args: any[]) {
    return new Promise<T>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject("Time Limit Exceeded");
      }, limit);

      asyncFunc(...args)
        .then((result) => {
          clearTimeout(timeoutId);
          resolve(result);
        })
        .catch((error) => {
          clearTimeout(timeoutId);
          reject(error);
        });
    });
  };
}

