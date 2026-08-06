// Synchronous operation
export function syncOperation(iterations: number): number {
  let result = 0;
  for (let i = 0; i < iterations; i++) {
    result += Math.random();
  }
  return result;
}

// Asynchronous operation using Promise
export function asyncOperation(iterations: number): Promise<number> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = 0;
      for (let i = 0; i < iterations; i++) {
        result += Math.random();
      }
      resolve(result);
    }, 0);
  });
}

// Simulated API call
export function simulateAPICall(delay: number): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`API call completed after ${delay}ms`);
    }, delay);
  });
}

