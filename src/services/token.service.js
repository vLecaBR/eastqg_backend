import fetch from 'node-fetch';
import { logInfo, logError } from '../utils/logger.js';

// Variáveis de ambiente obrigatórias no Render
const CLIENT_ID = process.env.ML_CLIENT_ID;
const CLIENT_SECRET = process.env.ML_CLIENT_SECRET;
let currentRefreshToken = process.env.ML_REFRESH_TOKEN;

if (!CLIENT_ID || !CLIENT_SECRET || !currentRefreshToken) {
  throw new Error(
    'Variáveis de ambiente ML_CLIENT_ID, ML_CLIENT_SECRET e ML_REFRESH_TOKEN são obrigatórias!'
  );
}

let currentAccessToken = null;
let expiresAt = 0;
let refreshTimer = null;

/**
 * Renova o access token e atualiza o refresh token em memória
 */
async function refreshAccessToken() {
  logInfo('Renovando access token do Mercado Livre...');

  const url = 'https://api.mercadolibre.com/oauth/token';
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    refresh_token: currentRefreshToken
  });

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body
    });

    const data = await res.json();

    if (!res.ok) {
      logError('Erro ao renovar access token', data);
      throw new Error(data.error_description || 'Erro ao atualizar token do ML');
    }

    currentAccessToken = data.access_token;
    currentRefreshToken = data.refresh_token;
    expiresAt = Date.now() + data.expires_in * 1000;

    logInfo(`Novo access_token obtido! Expira em ~${Math.round(data.expires_in / 60)} minutos`);

    // agenda próxima renovação 1 minuto antes do expiry
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(refreshAccessToken, data.expires_in * 1000 - 60 * 1000);

    return currentAccessToken;
  } catch (err) {
    logError('Falha ao renovar token do Mercado Livre', err);
    throw err;
  }
}

/**
 * Retorna o access token atual. Renova se expirou.
 */
export async function getAccessToken() {
  if (!currentAccessToken || Date.now() >= expiresAt) {
    return await refreshAccessToken();
  }
  return currentAccessToken;
}

/**
 * Para debug ou logs, retorna info do token
 */
export function getTokenInfo() {
  return {
    accessToken: currentAccessToken,
    refreshToken: currentRefreshToken,
    expiresAt: new Date(expiresAt).toISOString()
  };
}
