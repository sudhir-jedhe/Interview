export function createRandomRejectingPromise(): Promise<number> {
  return new Promise((resolve, reject) => {
    const shouldResolve = Math.random() < 0.3;
    setTimeout(() => {
      if (shouldResolve) {
        resolve(10);
      } else {
        reject("Random promise error");
      }
    }, 1000);
  });
}

export function rejectPromise(reason: string): Promise<never> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(reason);
    }, 1000);
  });
}

