const FAILURE_COUNT = 10;
const LATENCY = 200;

function getRandomBool(n: number): boolean {
  const threshold = 1000;
  if (n > threshold) n = threshold;
  return Math.floor(Math.random() * threshold) % n === 0;
}

export function getSuggestions(text: string): Promise<string[]> {
  const pre = 'pre';
  const post = 'post';
  const results: string[] = [];
  if (getRandomBool(2)) {
    results.push(pre + text);
  }
  if (getRandomBool(2)) {
    results.push(text);
  }
  if (getRandomBool(2)) {
    results.push(text + post);
  }
  if (getRandomBool(2)) {
    results.push(pre + text + post);
  }
  return new Promise((resolve, reject) => {
    const randomTimeout = Math.random() * LATENCY;
    setTimeout(() => {
      if (getRandomBool(FAILURE_COUNT)) {
        reject(new Error('Random failure'));
      } else {
        resolve(results);
      }
    }, randomTimeout);
  });
}

