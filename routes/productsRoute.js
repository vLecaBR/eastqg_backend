import express from 'express';
import { getProductsBySeller, getProductById } from '../services/meliservice.js';

const router = express.Router();

// 🔹 Lista de produtos do vendedor (retorna produtos completos)
router.get('/products', async (req, res) => {
  try {
    const { offset = 0, limit = 10 } = req.query;
    const data = await getProductsBySeller(offset, limit);

    if (!data || !data.results || data.results.length === 0) {
      return res.json([]); // retorna array vazio se não houver produtos
    }

    // 🔸 Busca os detalhes de cada produto usando o getProductById
    const products = await Promise.all(
      data.results.map(async (id) => {
        const productData = await getProductById(id);

        // Monta um objeto simplificado pro front
        return {
          id: productData.id,
          title: productData.title,
          price: productData.price,
          image: productData.thumbnail || productData.pictures?.[0]?.secure_url,
          category: productData.category_id,
          description:
            productData.attributes?.find((a) => a.id === 'MODEL')?.value_name ||
            productData.title ||
            '',
          available_quantity: productData.available_quantity,
          condition: productData.condition,
          permalink: productData.permalink,
        };
      })
    );

    res.json(products);
  } catch (err) {
    console.error('Erro ao buscar produtos:', err);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

// 🔹 Detalhes de um produto específico
router.get('/product/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getProductById(id);
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
