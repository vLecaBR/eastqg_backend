import fetch from 'node-fetch';
import { getAccessToken } from './token.service.js';
import { USER_ID } from '../config/config.js';
import { getCache, setCache } from '../utils/cache.js';
import { logInfo, logError } from '../utils/logger.js';

export async function getProductsBySeller(offset = 0, limit = 10) {
  const cacheKey = `products_${offset}_${limit}`;
  const cached = getCache(cacheKey);
  if (cached) {
    logInfo('Retornando produtos do cache 🧠');
    return cached;
  }

  const token = await getAccessToken();
  const url = `https://api.mercadolibre.com/users/${USER_ID}/items/search?offset=${offset}&limit=${limit}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json();

  if (!res.ok) {
    logError('Erro ao buscar produtos', data);
    throw new Error(data.message || 'Erro ao buscar produtos');
  }

  setCache(cacheKey, data, 5 * 60 * 1000);
  return data;
}

export async function getProductById(itemId) {
  const cacheKey = `product_${itemId}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const token = await getAccessToken();
  const url = `https://api.mercadolibre.com/items/${itemId}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json();

  if (!res.ok) {
    logError('Erro ao buscar item', data);
    throw new Error(data.message || 'Erro ao buscar item');
  }

  setCache(cacheKey, data, 5 * 60 * 1000);
  return data;
}
