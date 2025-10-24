import fetch from 'node-fetch';
import { getAccessToken } from './tokenService.js';
import { USER_ID } from '../config/config.js';

const BASE_URL = 'https://api.mercadolibre.com';

// 🔹 Função para buscar o nome da categoria
async function getCategoryName(categoryId) {
  try {
    const res = await fetch(`${BASE_URL}/categories/${categoryId}`);
    if (!res.ok) return null;

    const data = await res.json();
    return data.name || null;
  } catch (error) {
    console.error(`⚠️ Erro ao buscar categoria ${categoryId}:`, error);
    return null;
  }
}

// 🔹 Função para pegar todos os produtos de um vendedor
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

  if (!data.results || data.results.length === 0) {
    console.log('⚠️ Nenhum produto encontrado para este usuário.');
    return [];
  }

  // 🔹 Buscar detalhes completos de cada produto
  const productDetails = await Promise.all(
    data.results.map(async (itemId) => {
      try {
        const productRes = await fetch(`${BASE_URL}/items/${itemId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const product = await productRes.json();

        if (!product.id) return null; // evita nulos

        const categoryName = product.category_id
          ? await getCategoryName(product.category_id)
          : null;

        return {
          id: product.id,
          title: product.title,
          price: product.price,
          condition: product.condition,
          link: product.permalink,
          image: product.thumbnail,
          category_id: product.category_id,
          category_name: categoryName,
          seller_id: product.seller_id,
          domain_id: product.domain_id,
          warranty: product.warranty,
          attributes: product.attributes || []
        };
      } catch (err) {
        console.error(`⚠️ Erro ao buscar produto ${itemId}:`, err);
        return null;
      }
    })
  );

  // filtra produtos nulos
  return productDetails.filter(Boolean);
}

// 🔹 Função para pegar detalhes de um único produto
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

  const categoryName = product.category_id
    ? await getCategoryName(product.category_id)
    : null;

  return {
    id: product.id,
    title: product.title,
    price: product.price,
    condition: product.condition,
    link: product.permalink,
    image: product.thumbnail,
    category_id: product.category_id,
    category_name: categoryName,
    seller_id: product.seller_id,
    domain_id: product.domain_id,
    warranty: product.warranty,
    attributes: product.attributes || []
  };
}
