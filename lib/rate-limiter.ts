import { LRUCache } from "lru-cache";

const rateLimiter = new LRUCache<string, number>({
  max: 1000,
  ttl: 1000 * 60,
});

export function isRateLimited(key: string, limit: number): boolean {
  const hits = rateLimiter.get(key) || 0;
  if (hits >= limit) return true;
  rateLimiter.set(key, hits + 1);
  return false;
}
