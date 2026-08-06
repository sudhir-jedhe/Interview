// Run tasks in series using async/await
export async function runTasksInSeries(tasks: (() => Promise<any>)[]) {
  const results = [];
  for (const task of tasks) {
    results.push(await task());
  }
  return results;
}

// Run tasks in series using reduce
export function asyncSeriesExecuter(tasks: (() => Promise<any>)[]) {
  return tasks.reduce((acc, curr) => {
    return acc.then((results) => {
      return curr().then(val => {
        results.push(val);
        return results;
      });
    });
  }, Promise.resolve([]));
}

// Run tasks in series using recursion
export function recursiveSeriesExecuter(tasks: (() => Promise<any>)[]): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const results: any[] = [];
    function executeNext() {
      if (tasks.length === 0) {
        resolve(results);
        return;
      }
      const task = tasks.shift()!;
      task()
        .then(result => {
          results.push(result);
          executeNext();
        })
        .catch(reject);
    }
    executeNext();
  });
}

// Fetch URLs in series
export async function fetchUrlsInSerial(urls: string[]) {
  if (!Array.isArray(urls) || !urls.every(url => typeof url === 'string')) {
    throw new TypeError('URLs should be an array of strings.');
  }

  const results = [];

  for (const url of urls) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    results.push(data);
  }

  return results;
}

