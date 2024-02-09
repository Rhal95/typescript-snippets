export class MemCache<T> {
  cacheEntry: CacheEntry<T> | undefined = undefined;

  constructor(
    private timeout: number,
    private load: (() => Promise<T>) | undefined,
  ) {
  }

  put(data: T) {
    this.cacheEntry = {
      data,
      timestamp: Date.now(),
    };
  }

  private isExpired(): boolean {
    return this.cacheEntry?.data === undefined ||
      this.cacheEntry?.timestamp === undefined ||
      (Date.now() - this.cacheEntry?.timestamp) >= this.timeout;
  }

  async get(): Promise<T> {
    if (this.cacheEntry === undefined || this.isExpired()) {
      if (this.load === undefined) throw new Error("No load function provided");
      this.put(await this.load());
    }
    return this.cacheEntry!.data;
  }
}

type CacheEntry<T> = { data: T; timestamp: number };
