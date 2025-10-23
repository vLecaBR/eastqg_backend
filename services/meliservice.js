import fetch from 'node-fetch';
import { getAccessToken } from './tokenService.js';
import { USER_ID } from '../config/config.js';

export async function getProductsBySeller(offset = 0, limit = 10) {
  const token = await getAccessToken();
  const url = `https://api.mercadolibre.com/users/${USER_ID}/items/search?offset=${offset}&limit=${limit}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();

  if (!res.ok) {
    console.error('❌ Erro ao buscar produtos:', data);
    throw new Error(data.message || 'Erro ao buscar produtos');
  }

  return data;
}

// 🔹 Função pra pegar detalhes de 1 item
export async function getProductById(itemId) {
  const token = await getAccessToken();
  const url = `https://api.mercadolibre.com/items/${itemId}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();

  if (!res.ok) {
    console.error('❌ Erro ao buscar item:', data);
    throw new Error(data.message || 'Erro ao buscar item');
  }

  return data;
}
