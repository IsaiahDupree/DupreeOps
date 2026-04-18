/**
 * Monitoring and Error Tracking Configuration
 * Logs errors and performance metrics for the Dupree Ops Website
 */

interface ErrorLog {
  timestamp: string;
  level: 'error' | 'warning' | 'info';
  message: string;
  context: Record<string, any>;
  url?: string;
  userAgent?: string;
  stackTrace?: string;
}

interface PerformanceMetric {
  timestamp: string;
  metric: string;
  value: number;
  unit: string;
  context?: Record<string, any>;
}

class MonitoringService {
  private isDevelopment = process.env.NODE_ENV === 'development';

  /**
   * Log an error with context
   */
  logError(
    message: string,
    context: Record<string, any> = {},
    error?: Error
  ) {
    const errorLog: ErrorLog = {
      timestamp: new Date().toISOString(),
      level: 'error',
      message,
      context,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent:
        typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      stackTrace: error?.stack,
    };

    console.error('[MONITORING]', errorLog);

    // In production, send to external service
    if (!this.isDevelopment) {
      this.sendToMonitoringService(errorLog);
    }

    // Track in analytics
    if (typeof window !== 'undefined' && window.__MONITORING__) {
      window.__MONITORING__.errors = (window.__MONITORING__.errors || 0) + 1;
    }
  }

  /**
   * Log a warning
   */
  logWarning(message: string, context: Record<string, any> = {}) {
    const warningLog: ErrorLog = {
      timestamp: new Date().toISOString(),
      level: 'warning',
      message,
      context,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    };

    console.warn('[MONITORING]', warningLog);

    if (!this.isDevelopment) {
      this.sendToMonitoringService(warningLog);
    }
  }

  /**
   * Log an info message
   */
  logInfo(message: string, context: Record<string, any> = {}) {
    const infoLog: ErrorLog = {
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
      context,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    };

    if (this.isDevelopment || process.env.NEXT_PUBLIC_DEBUG === 'true') {
      console.log('[MONITORING]', infoLog);
    }
  }

  /**
   * Track performance metric
   */
  trackMetric(metricName: string, value: number, unit = 'ms') {
    const metric: PerformanceMetric = {
      timestamp: new Date().toISOString(),
      metric: metricName,
      value,
      unit,
    };

    if (this.isDevelopment) {
      console.log('[PERFORMANCE]', metric);
    }

    if (!this.isDevelopment) {
      this.sendMetricToService(metric);
    }

    // Store in local history for analytics
    if (typeof window !== 'undefined') {
      if (!window.__MONITORING__) {
        window.__MONITORING__ = {};
      }
      if (!window.__MONITORING__.metrics) {
        window.__MONITORING__.metrics = [];
      }
      window.__MONITORING__.metrics.push(metric);
    }
  }

  /**
   * Track API performance
   */
  trackApiCall(endpoint: string, method: string, duration: number, status: number) {
    this.trackMetric(`api_${method}_${endpoint}`, duration, 'ms');

    if (status >= 400) {
      this.logWarning(`API Error: ${method} ${endpoint}`, {
        status,
        duration,
      });
    }
  }

  /**
   * Setup global error handlers
   */
  setupGlobalErrorHandlers() {
    if (typeof window === 'undefined') return;

    // Handle uncaught errors
    window.addEventListener('error', (event) => {
      this.logError('Uncaught Error', {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError('Unhandled Promise Rejection', {
        reason: event.reason,
      });
    });

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      this.logInfo('Page visibility changed', {
        hidden: document.hidden,
      });
    });
  }

  /**
   * Send error log to monitoring service (stub for external service)
   */
  private sendToMonitoringService(log: ErrorLog) {
    // This would send to a service like Sentry, LogRocket, or your own backend
    // For now, it's a stub that could be implemented later
    try {
      // Example implementation:
      // fetch('/api/monitoring/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(log),
      // }).catch(() => {
      //   // Silently fail if monitoring endpoint is unavailable
      // });
    } catch {
      // Silently fail
    }
  }

  /**
   * Send performance metric to service
   */
  private sendMetricToService(metric: PerformanceMetric) {
    // This would send metrics to a service like Datadog, New Relic, or your own backend
    // For now, it's a stub
    try {
      // Example implementation:
      // fetch('/api/monitoring/metrics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(metric),
      // }).catch(() => {
      //   // Silently fail if monitoring endpoint is unavailable
      // });
    } catch {
      // Silently fail
    }
  }

  /**
   * Get monitoring stats (for client-side use)
   */
  getStats() {
    if (typeof window === 'undefined') return null;

    return {
      errors: window.__MONITORING__?.errors || 0,
      metrics: window.__MONITORING__?.metrics || [],
    };
  }
}

// Export singleton instance
export const monitoring = new MonitoringService();

// Setup global handlers on client
if (typeof window !== 'undefined') {
  monitoring.setupGlobalErrorHandlers();
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    __MONITORING__?: {
      errors?: number;
      metrics?: PerformanceMetric[];
    };
  }
}
