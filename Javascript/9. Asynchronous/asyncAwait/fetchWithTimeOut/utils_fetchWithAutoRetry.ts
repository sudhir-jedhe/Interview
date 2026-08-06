export function fetchWithAutoRetry(fetcher: () => Promise<any>, maximumRetryCount: number): Promise<any> {
  return new Promise((resolve, reject) => {
    function attempt(count: number) {
      fetcher()
        .then(value => {
          resolve(value);
        })
        .catch(err => {
          if (count === maximumRetryCount) {
            reject(err);
          } else {
            console.log(`Retrying, attempts left: ${maximumRetryCount - count}`);
            attempt(count + 1);
          }
        });
    }
    attempt(0);
  });
}

