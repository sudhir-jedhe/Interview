export function createAsyncTask(duration: number) {
  return () => new Promise<string>((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.2) {
        resolve(`Task with ${duration}s`);
      } else {
        reject(`Error with duration ${duration}`);
      }
    }, duration * 1000);
  });
}

export function asyncParallel(tasks: (() => Promise<string>)[], callback: (errors: string[], results: string[]) => void) {
  const results: string[] = [];
  const errors: string[] = [];

  tasks.forEach((task, index) => {
    task()
      .then(result => {
        results[index] = result;
      })
      .catch(error => {
        errors[index] = error.toString();
      })
      .finally(() => {
        if (results.length + errors.length === tasks.length) {
          callback(errors, results);
        }
      });
  });
}

export function asyncParallelWithTimeout(tasks: (() => Promise<string>)[], callback: (errors: string[], results: string[]) => void) {
  const results: string[] = [];
  const errors: string[] = [];
  const TIMEOUT = 3000;

  tasks.forEach((task, index) => {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Task timed out")), TIMEOUT)
    );

    Promise.race([task(), timeoutPromise])
      .then(result => {
        results[index] = result as string;
      })
      .catch(error => {
        errors[index] = error.message || error.toString();
      })
      .finally(() => {
        if (results.length + errors.length === tasks.length) {
          callback(errors, results);
        }
      });
  });
}

export async function asyncParallelWithAwait(tasks: (() => Promise<string>)[]): Promise<string[]> {
  return await Promise.all(tasks.map(task => task()));
}

