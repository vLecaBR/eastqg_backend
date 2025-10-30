import fetch from 'node-fetch';
import { PING_URL } from '../config/config.js';
import { logInfo, logWarn } from './logger.js';

export function startKeepAlive() {
  setInterval(async () => {
    try {
      await fetch(PING_URL);
      logInfo('Keep-alive ping enviado ✅');
    } catch (err) {
      logWarn('Falha ao enviar keep-alive ping ⚠️');
    }
  }, 10 * 60 * 1000); // a cada 10 minutos
}
