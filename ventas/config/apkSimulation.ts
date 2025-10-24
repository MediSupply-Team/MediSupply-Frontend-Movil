// config/apkSimulation.ts
let FORCE_APK_MODE = false;

export function setForceAPKMode(value: boolean) {
  FORCE_APK_MODE = value;
  console.log(`🎯 APK Simulation ${value ? 'ACTIVATED' : 'DEACTIVATED'}`);
}

export function isAPKMode() {
  return FORCE_APK_MODE || !__DEV__;
}

export function getAPKHeaders() {
  if (isAPKMode()) {
    return {
      'User-Agent': 'okhttp/4.12.0', // Simula user agent de Android APK
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Connection': 'close',
      'Cache-Control': 'no-cache'
    };
  }
  
  return {
    'Content-Type': 'application/json'
  };
}

export function getAPKTimeout() {
  return isAPKMode() ? 45000 : 15000; // Timeout más largo para APK
}