import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors'; // 🧠 importa o cors
import { PORT } from './config/config.js';
import productsRouter from './routes/productsRoute.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 🔥 habilita CORS pro front (localhost:5173)
app.use(cors({
  origin: 'https://eastqg.vercel.app/', // endereço do teu front Vite/React http://localhost:5173
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// serve arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// rotas da API
app.use('/api', productsRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
