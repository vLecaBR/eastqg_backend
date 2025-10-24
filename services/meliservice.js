import fetch from 'node-fetch';
import { getAccessToken } from './tokenService.js';
import { USER_ID } from '../config/config.js';

// 🔹 Função para buscar o nome da categoria (retorna null se falhar)
async function getCategoryName(categoryId) {
  try {
    const res = await fetch(`https://api.mercadolibre.com/categories/${categoryId}`);
    if (!res.ok) return null;

    const data = await res.json();
    return data.name || null;
  } catch (error) {
    console.error(`⚠️ Erro ao buscar categoria ${categoryId}:`, error);
    return null;
  }
}

// 🔹 Pega todos os produtos de um vendedor
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

  // 🔹 Se quiser incluir o category_name em cada produto
  const productsWithCategoryName = await Promise.all(
    data.results.map(async (product) => {
      if (product.category) {
        const category_name = await getCategoryName(product.category);
        return { ...product, category_name };
      }
      return product;
    })
  );

  return productsWithCategoryName; // ✅ agora retorna category_name opcional
}

// 🔹 Pega detalhes de um único produto
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

  // 🔹 Adiciona category_name se houver category_id
  let category_name = null;
  if (data.category_id) {
    category_name = await getCategoryName(data.category_id);
  }

  return { ...data, category_name }; // ✅ sem quebrar nada do retorno original
}
