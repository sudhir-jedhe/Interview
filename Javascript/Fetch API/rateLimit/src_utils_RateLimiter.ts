export class RateLimiter {
  private maxRequests: number;
  private interval: number;
  private queue: (() => Promise<any>)[];
  private currentRequests: number;
  private lastReset: number;

  constructor(maxRequests: number, interval: number) {
    this.maxRequests = maxRequests;
    this.interval = interval;
    this.queue = [];
    this.currentRequests = 0;
    this.lastReset = Date.now();
  }

  addRequest(apiCall: () => Promise<any>) {
    this.queue.push(apiCall);
    this.processQueue();
  }

  private async processQueue() {
    if (this.currentRequests >= this.maxRequests) {
      const timeToWait = this.interval - (Date.now() - this.lastReset);
      if (timeToWait > 0) {
        await this.sleep(timeToWait);
      }
      this.currentRequests = 0;
      this.lastReset = Date.now();
    }

    while (this.queue.length > 0 && this.currentRequests < this.maxRequests) {
      const apiCall = this.queue.shift();
      if (apiCall) {
        this.currentRequests++;
        try {
          const result = await apiCall();
          console.log('API call result:', result);
        } catch (error) {
          console.error('Error in API call:', error);
        }
      }
    }

    if (this.queue.length > 0) {
      this.processQueue();
    }
  }

  private sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

