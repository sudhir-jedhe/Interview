// Helper function to chop array into chunks of a given size
function chop<T>(arr: T[], size: number): T[][] {
  const temp = [...arr];
  const output: T[][] = [];
  let i = 0;
  while (i < temp.length) {
    output.push(temp.slice(i, i + size));
    i += size;
  }
  return output;
}

// mapLimit function implementation
export const mapLimit = <T, R>(arr: T[], limit: number, fn: (item: T, callback: (err: any, value?: R) => void) => void): Promise<R[]> => {
  return new Promise((resolve, reject) => {
    let chunks = chop(arr, limit);
    
    const final = chunks.reduce((promiseChain, chunk) => {
      return promiseChain.then((result) => {
        return new Promise<R[]>((resolveChunk, rejectChunk) => {
          const results: R[] = [];
          let tasksCompleted = 0;

          chunk.forEach((item, index) => {
            fn(item, (err, value) => {
              if (err) {
                rejectChunk(new Error("Error in processing item"));
              } else {
                results[index] = value as R;
                tasksCompleted++;
                if (tasksCompleted === chunk.length) {
                  resolveChunk([...result, ...results]);
                }
              }
            });
          });
        });
      });
    }, Promise.resolve([] as R[]));

    final.then(resolve).catch(reject);
  });
};

