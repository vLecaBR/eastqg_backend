export function logInfo(msg) {
  console.log(`🟢 [INFO] ${new Date().toISOString()} - ${msg}`);
}

export function logWarn(msg) {
  console.warn(`🟡 [WARN] ${new Date().toISOString()} - ${msg}`);
}

export function logError(msg, err) {
  console.error(`🔴 [ERROR] ${new Date().toISOString()} - ${msg}`);
  if (err) console.error(err);
}
