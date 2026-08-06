export function simulateTask(taskId: string, duration: number, successRate: number = 0.8) {
  return new Promise<string>((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < successRate) {
        resolve(`Task ${taskId} completed`);
      } else {
        reject(`Task ${taskId} failed`);
      }
    }, duration);
  });
}

export function fetchWithTimeout(url: string, timeout: number) {
  return Promise.race([
    fetch(url).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    }),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), timeout))
  ]);
}

