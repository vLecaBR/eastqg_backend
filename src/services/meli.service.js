// src/services/meli.service.js
import fetch from 'node-fetch';
import { getAccessToken } from './token.service.js';
import { USER_ID } from '../config/config.js';
import { getCache, setCache } from '../utils/cache.js';
import { logInfo, logError } from '../utils/logger.js';

/**
 * Função genérica para fazer fetch na API do ML tratando token expirado
 */
async function mlFetch(url) {
  try {
    const token = await getAccessToken();
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();

    if (!res.ok) {
      logError('Erro na chamada ML', data);
      throw new Error(data.message || 'Erro na chamada ML');
    }

    return data;
  } catch (err) {
    logError('Erro ao chamar ML API', err);
    throw err;
  }
}

/**
 * Retorna produtos do seller com cache
 */
export async function getProductsBySeller(offset = 0, limit = 10) {
  const cacheKey = `products_${offset}_${limit}`;
  const cached = getCache(cacheKey);
  if (cached) {
    logInfo('Retornando produtos do cache 🧠');
    return cached;
  }

  const url = `https://api.mercadolibre.com/users/${USER_ID}/items/search?offset=${offset}&limit=${limit}`;
  const data = await mlFetch(url);

  setCache(cacheKey, data, 5 * 60 * 1000); // cache 5 minutos
  return data;
}

/**
 * Retorna produto por ID com cache
 */
export async function getProductById(itemId) {
  const cacheKey = `product_${itemId}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const url = `https://api.mercadolibre.com/items/${itemId}`;
  const data = await mlFetch(url);

  setCache(cacheKey, data, 5 * 60 * 1000); // cache 5 minutos
  return data;
}
