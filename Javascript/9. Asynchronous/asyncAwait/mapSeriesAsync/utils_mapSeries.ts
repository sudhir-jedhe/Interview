export const mapSeries = <T, R>(arr: T[], fn: (item: T, callback: (error: any, result?: R) => void) => void): Promise<R[]> => {
  return new Promise((resolve, reject) => {
    const output: R[] = [];
    
    const final = arr.reduce((promiseChain, item) => {
      return promiseChain.then((accumulatedResults) => {
        return new Promise<R[]>((resolveItem, rejectItem) => {
          fn(item, (error, result) => {
            if (error) {
              rejectItem(error);
            } else {
              resolveItem([...accumulatedResults, result as R]);
            }
          });
        });
      });
    }, Promise.resolve([] as R[]));

    final
      .then((result) => {
        resolve(result);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

