import type { CacheEntry } from './types';

export const CACHE_TTL = 7 * 60 * 1000; // 7 minutes

export async function getCache<T>(key: string): Promise<T | null> {
  const result = await chrome.storage.local.get(key);
  const entry: CacheEntry<T> | undefined = result[key];
  if (!entry) return null;
  if (Date.now() - entry.timestamp > entry.ttl) {
    await chrome.storage.local.remove(key);
    return null;
  }
  return entry.data;
}

export async function setCache<T>(key: string, data: T, ttl: number = CACHE_TTL): Promise<void> {
  const entry: CacheEntry<T> = {
    data,
    timestamp: Date.now(),
    ttl
  };
  await chrome.storage.local.set({ [key]: entry });
}

export class RequestQueue {
  private queue: (() => Promise<void>)[] = [];
  private processing = false;

  add(request: () => Promise<void>): void {
    this.queue.push(request);
    this.process();
  }

  private async process(): Promise<void> {
    if (this.processing || this.queue.length === 0) return;
    this.processing = true;
    while (this.queue.length > 0) {
      const request = this.queue.shift()!;
      await request();
      // Randomized delay 300-1000ms
      const delay = Math.random() * 700 + 300;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    this.processing = false;
  }
}

export const requestQueue = new RequestQueue();

export function getErrorMessage(error: any): string {
  if (error.message?.includes('401')) return 'Please log in to LinkedIn.';
  if (error.message?.includes('403')) return 'Authentication failed. Please log in to LinkedIn and ensure cookies are enabled.';
  if (error.message?.includes('429')) return 'Rate limit exceeded. Please try again later.';
  if (error.message?.startsWith('5')) return 'LinkedIn server error. Try again later.';
  if (error instanceof TypeError && error.message.includes('fetch')) return 'Network error. Check your connection and LinkedIn login.';
  return 'An error occurred while fetching data.';
}
