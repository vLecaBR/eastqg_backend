const cache = new Map();

export function setCache(key, data, ttl = 5 * 60 * 1000) {
  cache.set(key, { data, expires: Date.now() + ttl });
}

export function getCache(key) {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() > item.expires) {
    cache.delete(key);
    return null;
  }
  return item.data;
}
