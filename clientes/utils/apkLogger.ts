// utils/apkLogger.ts
import { Platform } from 'react-native';
import { getCurrentEnvironment } from '../config/baseUrl';

class APKLogger {
  private logs: string[] = [];
  private maxLogs = 500; // Máximo número de logs
  
  constructor() {
    // Interceptar console.log en APK
    if (!__DEV__) {
      this.interceptConsole();
    }
  }
  
  private interceptConsole() {
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    
    console.log = (...args) => {
      this.addLog('LOG', args);
      originalLog(...args);
    };
    
    console.error = (...args) => {
      this.addLog('ERROR', args);
      originalError(...args);
    };
    
    console.warn = (...args) => {
      this.addLog('WARN', args);
      originalWarn(...args);
    };
  }
  
  private addLog(level: string, args: any[]) {
    const timestamp = new Date().toISOString();
    const message = args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
    ).join(' ');
    
    const logEntry = `[${timestamp}] ${level}: ${message}`;
    
    this.logs.push(logEntry);
    
    // Mantener solo los últimos N logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }
  
  public getLogs(): string[] {
    return [...this.logs];
  }
  
  // Obtener logs como string para compartir
  getLogsAsString(): string {
    return this.logs.join('\n');
  }

  // Limpiar logs
  clearLogs() {
    this.logs = [];
  }

  // Información del entorno
  logEnvironmentInfo() {
    const env = getCurrentEnvironment();
    const isAPK = !__DEV__;
    
    console.log('🔧 [APK LOGGER] Environment Info:');
    console.log(`📱 Platform: ${Platform.OS}`);
    console.log(`🌍 Environment: ${env}`);
    console.log(`🚀 Is APK: ${isAPK}`);
    console.log(`🔗 User Agent: ${isAPK ? 'okhttp/4.12.0' : 'Expo Development'}`);
  }

  // Stats para el debugger
  getLogStats() {
    const errorLogs = this.logs.filter(log => log.includes('ERROR')).length;
    const warnLogs = this.logs.filter(log => log.includes('WARN')).length;
    const networkSuccess = this.logs.filter(log => log.includes('✅ [NETWORK]')).length;
    const networkErrors = this.logs.filter(log => log.includes('❌ [NETWORK]')).length;
    
    return {
      total: this.logs.length,
      errors: errorLogs,
      warnings: warnLogs,
      networkSuccess,
      networkErrors
    };
  }
  
  public logNetworkAttempt(url: string, method: string = 'GET') {
    console.log(`🌐 [NETWORK] Attempting ${method} ${url}`);
  }
  
  public logNetworkSuccess(url: string, status: number, data?: any) {
    console.log(`✅ [NETWORK] Success ${status} ${url}`);
    if (data && typeof data === 'object') {
      console.log(`✅ [NETWORK] Response keys: ${Object.keys(data).join(', ')}`);
    }
  }
  
  public logNetworkError(url: string, error: any) {
    console.error(`❌ [NETWORK] Failed ${url}`);
    console.error(`❌ [NETWORK] Error: ${error?.message || 'Unknown error'}`);
    console.error(`❌ [NETWORK] Status: ${error?.response?.status || 'No status'}`);
    console.error(`❌ [NETWORK] Code: ${error?.code || 'No code'}`);
  }
}

export const apkLogger = new APKLogger();