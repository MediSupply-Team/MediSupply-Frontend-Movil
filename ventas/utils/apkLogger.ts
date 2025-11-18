// APK Logger - Sistema completo de logging para debugging de APK
// Captura todos los logs de console, errores de red, y eventos importantes
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LogEntry {
  timestamp: string;
  level: 'log' | 'warn' | 'error' | 'network';
  message: string;
  extra?: any;
}

interface NetworkLogEntry extends LogEntry {
  level: 'network';
  url: string;
  method?: string;
  success: boolean;
  status?: number;
  duration?: number;
}

class APKLogger {
  private logs: LogEntry[] = [];
  private readonly MAX_LOGS = 500;
  private readonly STORAGE_KEY = '@apk_debug_logs';
  
  private originalConsole = {
    log: console.log,
    warn: console.warn, 
    error: console.error
  };

  constructor() {
    this.initializeLogger();
  }

  private async initializeLogger() {
    // Cargar logs existentes
    await this.loadStoredLogs();
    
    // Interceptar métodos de console
    this.interceptConsole();
    
    // Log de inicialización
    this.addLog('log', '🚀 APK Logger initialized');
  }

  private interceptConsole() {
    console.log = (...args) => {
      this.originalConsole.log(...args);
      this.addLog('log', args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' '));
    };

    console.warn = (...args) => {
      this.originalConsole.warn(...args);
      this.addLog('warn', args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' '));
    };

    console.error = (...args) => {
      this.originalConsole.error(...args);
      this.addLog('error', args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' '));
    };
  }

  private addLog(level: LogEntry['level'], message: string, extra?: any) {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      extra
    };

    this.logs.unshift(logEntry);

    // Mantener solo los últimos MAX_LOGS
    if (this.logs.length > this.MAX_LOGS) {
      this.logs = this.logs.slice(0, this.MAX_LOGS);
    }

    // Guardar en AsyncStorage
    this.saveLogsToStorage();
  }

  // Métodos específicos para logging de red
  logNetworkAttempt(url: string, method: string = 'GET') {
    this.addLog('network', `🌐 Network Request: ${method} ${url}`, { url, method, type: 'attempt' });
  }

  logNetworkSuccess(url: string, status: number, data?: any) {
    const message = `✅ Network Success: ${status} ${url}`;
    this.addLog('network', message, { url, status, success: true, data: data ? 'Data received' : 'No data' });
  }

  logNetworkError(url: string, error: any) {
    const message = `❌ Network Error: ${url} - ${error?.message || 'Unknown error'}`;
    this.addLog('network', message, { 
      url, 
      success: false, 
      error: {
        message: error?.message,
        code: error?.code,
        status: error?.response?.status
      }
    });
  }

  // Obtener logs
  getLogs(level?: LogEntry['level']): LogEntry[] {
    if (level) {
      return this.logs.filter(log => log.level === level);
    }
    return [...this.logs];
  }

  // Obtener logs como string para compartir
  getLogsAsString(): string {
    return this.logs.map(log => 
      `[${log.timestamp}] ${log.level.toUpperCase()}: ${log.message}`
    ).join('\n');
  }

  // Limpiar logs
  clearLogs() {
    this.logs = [];
    this.saveLogsToStorage();
    this.addLog('log', '🧹 Logs cleared');
  }

  // Persistencia
  private async saveLogsToStorage() {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.logs));
    } catch (error) {
      this.originalConsole.error('Failed to save logs to storage:', error);
    }
  }

  private async loadStoredLogs() {
    try {
      const stored = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.logs = JSON.parse(stored);
      }
    } catch (error) {
      this.originalConsole.error('Failed to load logs from storage:', error);
    }
  }

  // Stats
  getLogStats() {
    const stats = {
      total: this.logs.length,
      errors: this.logs.filter(log => log.level === 'error').length,
      warnings: this.logs.filter(log => log.level === 'warn').length,
      networkSuccess: this.logs.filter(log => log.level === 'network' && log.extra?.success).length,
      networkErrors: this.logs.filter(log => log.level === 'network' && !log.extra?.success).length,
    };
    return stats;
  }
}

// Instancia global
export const apkLogger = new APKLogger();

// Export default para compatibilidad
export default apkLogger;