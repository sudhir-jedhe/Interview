export class DebouncedRateLimiter {
  private maxRequests: number;
  private interval: number;
  private queue: (() => Promise<any>)[];
  private timeout: NodeJS.Timeout | null;

  constructor(maxRequests: number, interval: number) {
    this.maxRequests = maxRequests;
    this.interval = interval;
    this.queue = [];
    this.timeout = null;
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

    const promises = requestsToProcess.map(apiCall => apiCall());

    try {
      const results = await Promise.all(promises);
      console.log('API call results:', results);
    } catch (error) {
      console.error('Error in API call:', error);
    }

    if (this.queue.length > 0) {
      this.debounceProcess();
    }
  }
}

