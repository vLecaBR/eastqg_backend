import fetch from 'node-fetch';
import { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN } from '../config/config.js';

let currentAccessToken = null;
let currentRefreshToken = REFRESH_TOKEN;
let expiresAt = 0;

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

  console.log('✅ Novo access_token obtido! expira em ~6h');
  return currentAccessToken;
}

export async function getAccessToken() {
  if (!currentAccessToken || Date.now() >= expiresAt) {
    return await refreshAccessToken();
  }
  return currentAccessToken;
}
