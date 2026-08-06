type F = () => Promise<any>;

export function promisePool(functions: F[], n: number): Promise<[number[], number]> {
  const results: number[] = [];
  const inProgress = new Set<Promise<void>>();
  const queue = [...functions];
  const startTime = Date.now();

  return new Promise((resolve) => {
    const runTask = async () => {
      if (queue.length === 0 && inProgress.size === 0) {
        const totalTime = Date.now() - startTime;
        resolve([results, totalTime]);
        return;
      }

      while (queue.length > 0 && inProgress.size < n) {
        const task = queue.shift()!;
        const taskStartTime = Date.now();
        const promise = task().then(() => {
          const taskEndTime = Date.now() - taskStartTime;
          results.push(taskEndTime);
          inProgress.delete(promise);
          runTask();
        });
        inProgress.add(promise);
      }
    };

    runTask();
  });
}

