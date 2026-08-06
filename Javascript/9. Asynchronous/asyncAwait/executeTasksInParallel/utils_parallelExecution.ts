export async function executeTasksInParallel(tasks: (() => Promise<string>)[]) {
  if (!Array.isArray(tasks) || !tasks.every(task => typeof task === 'function')) {
    throw new TypeError('Tasks should be an array of functions that return promises.');
  }

  const promises = tasks.map(task => task());
  return await Promise.all(promises);
}

export async function fetchUrlsInParallel(urls: string[]) {
  if (!Array.isArray(urls) || !urls.every(url => typeof url === 'string')) {
    throw new TypeError('URLs should be an array of strings.');
  }

  const fetchPromises = urls.map(url => 
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .catch(error => ({ error: error.message }))
  );

  return await Promise.all(fetchPromises);
}

