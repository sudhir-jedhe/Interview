export class RateLimiter {
  private capacity: number;
  private tokens: number;
  private refillRate: number;
  private interval: number;
  private lastRefillTime: number;
  private timer: NodeJS.Timeout;

  constructor(capacity: number, refillRate: number, interval: number) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.refillRate = refillRate;
    this.interval = interval;
    this.lastRefillTime = Date.now();
    this.timer = setInterval(() => this.refillTokens(), this.interval);
  }

  allowRequest(): boolean {
    this.refillTokens();
    if (this.tokens > 0) {
      this.tokens--;
      return true;
    } else {
      return false;
    }
  }

  private refillTokens(): void {
    const currentTime = Date.now();
    const elapsedTime = currentTime - this.lastRefillTime;
    const tokensToAdd = Math.floor(elapsedTime * (this.refillRate / 1000));
    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefillTime = currentTime;
  }

  stopRefill(): void {
    clearInterval(this.timer);
  }

  getTokens(): number {
    return this.tokens;
  }
}

