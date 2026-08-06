Processing promises in Batch
```js

export async function processPromisesBatch(
    items: Array<any>,
    limit: number,
    fn: (item: any) => Promise<any>,
  ): Promise<any> {
    let results = [];
    for (let start = 0; start < items.length; start += limit) {
      const end = start + limit > items.length ? items.length : start + limit;
  
      const slicedResults = await Promise.all(items.slice(start, end).map(fn));
  
      results = [
        ...results,
        ...slicedResults,
      ]
    }
  
    return results;
  }



  /*************************************** */

  export async function* batchTasks(tasks, limit, taskCallback = (r) => r) {
    // iterate over tasks
    for (let i = 0; i < tasks.length; i = i + limit) {
      // grab the batch of tasks for current iteration
      const batch = tasks.slice(i, i + limit);
      // wait for them to resolve concurrently
      const result = await Promise.all(
        // optionally attach callback to perform any side effects  
        batch.map((task) => task().then((r) => taskCallback(r)))
      );
      // yield the batched result and let consumer know
      yield result;
    }
  }