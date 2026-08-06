export class APIBatchRequester {
  private batchSize: number;
  private interval: number;
  private requestsQueue: (() => Promise<any>)[];
  private isProcessing: boolean;
  private maxQueueSize: number;

  constructor(batchSize: number, interval: number, maxQueueSize = Infinity) {
    this.batchSize = batchSize;
    this.interval = interval;
    this.requestsQueue = [];
    this.isProcessing = false;
    this.maxQueueSize = maxQueueSize;
  }

  addRequest(apiCall: () => Promise<any>) {
    if (this.requestsQueue.length >= this.maxQueueSize) {
      console.warn("Request queue is full. Dropping oldest request.");
      this.requestsQueue.shift();
    }

    this.requestsQueue.push(apiCall);
    this.processQueue();
  }

  private async processQueue() {
    if (this.isProcessing) return;

    this.isProcessing = true;

    while (this.requestsQueue.length > 0) {
      const batch = this.requestsQueue.splice(0, this.batchSize);
      await this.executeBatch(batch);

      if (this.requestsQueue.length > 0) await this.sleep(this.interval);
    }

    this.isProcessing = false;
  }

  private async executeBatch(batch: (() => Promise<any>)[]) {
    const promises = batch.map(apiCall => this.retryRequest(apiCall, 3));

    try {
      const results = await Promise.allSettled(promises);
      console.log("Batch results:", results);
      return results;
    } catch (error) {
      console.error("Error in batch execution:", error);
      throw error;
    }
  }

  private async retryRequest(apiCall: () => Promise<any>, retries: number) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await apiCall();
      } catch (error) {
        if (attempt === retries) {
          console.error(`Request failed after ${retries} retries:`, error);
          throw error;
        }
        console.warn(`Retrying request... Attempt ${attempt} of ${retries}`);
        await this.sleep(1000);
      }
    }
  }

  private sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

