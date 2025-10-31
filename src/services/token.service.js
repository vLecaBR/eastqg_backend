import fetch from 'node-fetch';
import { logInfo, logError } from '../utils/logger.js';
import { ML_CLIENT_ID, ML_CLIENT_SECRET, ML_REFRESH_TOKEN } from '../config/config.js';

let currentAccessToken = null;
let currentRefreshToken = ML_REFRESH_TOKEN;
let expiresAt = 0;
let refreshTimer = null;

async function refreshAccessToken() {
  logInfo('Renovando access token...');
  const url = 'https://api.mercadolibre.com/oauth/token';
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: ML_CLIENT_ID,
    client_secret: ML_CLIENT_SECRET,
    refresh_token: currentRefreshToken
  });

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  });

  const data = await res.json();
  if (!res.ok) {
    logError('Erro ao renovar token', data);
    throw new Error(data.error_description || 'Erro ao atualizar token');
  }

  currentAccessToken = data.access_token;
  currentRefreshToken = data.refresh_token;
  expiresAt = Date.now() + data.expires_in * 1000;

  // Agenda próxima renovação 1 min antes do fim
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(refreshAccessToken, data.expires_in * 1000 - 60 * 1000);

  logInfo('Novo access_token obtido!');
  return currentAccessToken;
}

export async function getAccessToken() {
  if (!currentAccessToken || Date.now() >= expiresAt) {
    return await refreshAccessToken();
  }
  return currentAccessToken;
}
