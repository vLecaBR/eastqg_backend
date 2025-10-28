import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { PORT } from './config/config.js';
import productsRouter from './routes/productsRoute.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Habilita CORS dinamicamente (funciona local e em produção)
const allowedOrigins = [
  'http://localhost:5173',       // dev
  'https://eastqg.vercel.app'    // produção
];

app.use(cors({
  origin: (origin, callback) => {
    // permite sem origin (ex: curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS bloqueado: origem não permitida'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON
app.use(express.json());

// Serve arquivos estáticos da pasta /public
app.use(express.static(path.join(__dirname, 'public')));

// Rotas da API
app.use('/api', productsRouter);

// Porta dinâmica pro Render (usa process.env.PORT)
const port = process.env.PORT || PORT || 3000;

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${port}`);
});
