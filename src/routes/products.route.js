import express from 'express';
import { getProductsBySeller, getProductById } from '../services/meli.service.js';

const router = express.Router();

router.get('/products', async (req, res, next) => {
  try {
    const { offset = 0, limit = 10 } = req.query;
    const data = await getProductsBySeller(offset, limit);

    if (!data?.results?.length) return res.json([]);

    const products = await Promise.all(
      data.results.map(async (id) => {
        const p = await getProductById(id);
        return {
          id: p.id,
          title: p.title,
          price: p.price,
          image: p.thumbnail || p.pictures?.[0]?.secure_url,
          category: p.category_id,
          description: p.attributes?.find((a) => a.id === 'MODEL')?.value_name || p.title || '',
          available_quantity: p.available_quantity,
          condition: p.condition,
          permalink: p.permalink,
        };
      })
    );

    res.json(products);
  } catch (err) {
    next(err);
  }
});

router.get('/product/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await getProductById(id);
    res.json(product);
  } catch (err) {
    next(err);
  }
});

export default router;
