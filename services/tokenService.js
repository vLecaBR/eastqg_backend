import fs from 'fs';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const ENV_PATH = '.env';
const CLIENT_ID = process.env.ML_CLIENT_ID;
const CLIENT_SECRET = process.env.ML_CLIENT_SECRET;

let currentAccessToken = null;
let currentRefreshToken = process.env.ML_REFRESH_TOKEN;
let expiresAt = 0;

/**
 * Atualiza o valor do ML_REFRESH_TOKEN dentro do .env
 */
function updateEnvRefreshToken(newToken) {
  try {
    const envData = fs.readFileSync(ENV_PATH, 'utf-8');
    const newEnvData = envData.replace(
      /^ML_REFRESH_TOKEN=.*$/m,
      `ML_REFRESH_TOKEN=${newToken}`
    );
    fs.writeFileSync(ENV_PATH, newEnvData);
    console.log('💾 Novo ML_REFRESH_TOKEN salvo no .env!');
  } catch (err) {
    console.error('⚠️ Erro ao atualizar o .env:', err);
  }
}

export async function refreshAccessToken() {
  console.log('🔄 Renovando access token...');
  const url = 'https://api.mercadolibre.com/oauth/token';
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    refresh_token: currentRefreshToken
  });

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  });

  const data = await res.json();

  if (!res.ok) {
    console.error('❌ Erro ao renovar token:', data);
    throw new Error(data.error_description || 'Erro ao atualizar token');
  }

  currentAccessToken = data.access_token;
  currentRefreshToken = data.refresh_token;
  expiresAt = Date.now() + data.expires_in * 1000;

  // Atualiza o refresh token no .env
  updateEnvRefreshToken(currentRefreshToken);

  console.log('✅ Novo access_token obtido! expira em ~6h');
  return currentAccessToken;
}

export async function getAccessToken() {
  if (!currentAccessToken || Date.now() >= expiresAt) {
    return await refreshAccessToken();
  }
  return currentAccessToken;
}
