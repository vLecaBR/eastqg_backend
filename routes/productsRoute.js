import express from 'express';
import { getProductsBySeller, getProductById } from '../services/meliservice.js';

const router = express.Router();

// 🔹 Lista de produtos do vendedor
router.get('/products', async (req, res) => {
  try {
    const { offset = 0, limit = 10 } = req.query;
    const data = await getProductsBySeller(offset, limit);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
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
