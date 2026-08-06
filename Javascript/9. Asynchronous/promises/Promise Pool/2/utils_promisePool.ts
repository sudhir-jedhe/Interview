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

