import fetch from 'node-fetch';
import { getAccessToken } from './tokenService.js';
import { USER_ID } from '../config/config.js';

const BASE_URL = 'https://api.mercadolibre.com';

// 🔹 Função pra buscar o nome da categoria (não quebra se der erro)
async function getCategoryName(categoryId) {
  try {
    const res = await fetch(`${BASE_URL}/categories/${categoryId}`);
    if (!res.ok) return null;

    const data = await res.json();
    return data.name || null;
  } catch (error) {
    console.warn(`⚠️ Erro ao buscar categoria ${categoryId}:`, error);
    return null;
  }
}

// 🔹 Pega todos os produtos de um vendedor com category_name opcional
export async function getProductsBySeller(offset = 0, limit = 10) {
  const token = await getAccessToken();
  const url = `${BASE_URL}/users/${USER_ID}/items/search?offset=${offset}&limit=${limit}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();

  if (!res.ok) {
    console.error('❌ Erro ao buscar produtos:', data);
    throw new Error(data.message || 'Erro ao buscar produtos');
  }

  // Pega detalhes completos dos produtos, mas só adiciona category_name se conseguir
  const productDetails = await Promise.all(
    data.results.map(async (itemId) => {
      try {
        const productRes = await fetch(`${BASE_URL}/items/${itemId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const product = await productRes.json();

        if (!productRes.ok) return null;

        // Busca nome da categoria apenas se houver category_id
        let category_name = null;
        if (product.category_id) {
          category_name = await getCategoryName(product.category_id);
        }

        return {
          ...product,
          category_name // adicionado sem quebrar o resto
        };
      } catch (err) {
        console.warn(`⚠️ Erro ao buscar produto ${itemId}:`, err);
        return null;
      }
    })
  );

  return productDetails.filter(Boolean);
}

// 🔹 Pega detalhes de um único produto com category_name opcional
export async function getProductById(itemId) {
  const token = await getAccessToken();
  const url = `${BASE_URL}/items/${itemId}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const product = await res.json();

  if (!res.ok) {
    console.error('❌ Erro ao buscar item:', product);
    throw new Error(product.message || 'Erro ao buscar item');
  }

  let category_name = null;
  if (product.category_id) {
    category_name = await getCategoryName(product.category_id);
  }

  return {
    ...product,
    category_name
  };
}
