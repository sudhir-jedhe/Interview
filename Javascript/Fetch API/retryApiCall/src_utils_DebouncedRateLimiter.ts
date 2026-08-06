export class DebouncedRateLimiter {
  private maxRequests: number;
  private interval: number;
  private maxRetries: number;
  private queue: (() => Promise<any>)[];
  private timeout: NodeJS.Timeout | null;
  private onProgress: (progress: number) => void;

  constructor(maxRequests: number, interval: number, maxRetries: number, onProgress: (progress: number) => void) {
    this.maxRequests = maxRequests;
    this.interval = interval;
    this.maxRetries = maxRetries;
    this.queue = [];
    this.timeout = null;
    this.onProgress = onProgress;
  }

  addRequest(apiCall: () => Promise<any>) {
    this.queue.push(apiCall);
    this.debounceProcess();
  }

  private debounceProcess() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
      this.processQueue();
    }, this.interval);
  }

  private async processQueue() {
    const requestsToProcess = this.queue.splice(0, this.maxRequests);

    if (requestsToProcess.length === 0) return;

    const promises = requestsToProcess.map(apiCall => this.retryRequest(apiCall, this.maxRetries));

    try {
      const results = await Promise.all(promises);
      this.onProgress(this.queue.length);
      return results;
    } catch (error) {
      console.error('Error in API call:', error);
    }

    if (this.queue.length > 0) {
      this.debounceProcess();
    }
  }

  private async retryRequest(apiCall: () => Promise<any>, retries: number) {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        return await apiCall();
      } catch (error) {
        if (attempt === retries - 1) {
          throw error;
        }
        console.warn(`Retrying request... Attempt ${attempt + 1}`);
        await this.sleep(1000);
      }
    }
  }

  private sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

