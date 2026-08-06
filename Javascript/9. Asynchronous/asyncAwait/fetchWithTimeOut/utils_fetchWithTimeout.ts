export const fetchWithTimeout = (url: string, options: RequestInit = {}, duration: number): Promise<any> => {
  return new Promise((resolve, reject) => {
    const controller = new AbortController();
    const { signal } = controller;
    const timeoutId = setTimeout(() => controller.abort(), duration);

    fetch(url, { ...options, signal })
      .then((response) => response.json())
      .then((data) => {
        clearTimeout(timeoutId);
        resolve(data);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        if (error.name === "AbortError") {
          reject(new Error("Request timed out"));
        } else {
          reject(error);
        }
      });
  });
};

