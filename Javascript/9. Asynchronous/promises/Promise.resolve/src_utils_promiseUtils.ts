export function createDelayedPromise(value: number, delay: number): Promise<number> {
  return new Promise(resolve => {
    setTimeout(() => resolve(value), delay);
  });
}

