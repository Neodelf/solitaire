/**
 * Performance and Error Tracking Module
 * Модуль отслеживания производительности и ошибок
 */

class PerformanceTracker {
    constructor() {
        this.metrics = {};
        this.errors = [];
        this.hasGameTable = !!document.querySelector('#table');
        this.init();
    }

    /**
     * Инициализация трекера производительности
     */
    init() {
        this.trackPageLoad();
        this.trackJavaScriptErrors();

        if (this.hasGameTable) {
            this.trackMemoryUsage();
            this.trackUserInteractionPerformance();
        }
    }

    /**
     * Отслеживание времени загрузки страницы
     */
    trackPageLoad() {
        window.addEventListener('load', async () => {
            const navigation = performance.getEntriesByType('navigation')[0];
            if (!navigation) {
                return;
            }

            const [lcp, cls] = await Promise.all([
                this.getLargestContentfulPaint(),
                this.getCumulativeLayoutShift()
            ]);

            const metrics = {
                page_load_time: Math.round(navigation.loadEventEnd - navigation.fetchStart),
                dom_content_loaded: Math.round(
                    navigation.domContentLoadedEventEnd - navigation.fetchStart
                ),
                first_paint: this.getFirstPaint(),
                first_contentful_paint: this.getFirstContentfulPaint(),
                largest_contentful_paint: lcp,
                cumulative_layout_shift: cls
            };

            this.sendMetrics('page_load', metrics);
        });
    }

    getFirstPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
        return firstPaint ? Math.round(firstPaint.startTime) : null;
    }

    getFirstContentfulPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        return fcp ? Math.round(fcp.startTime) : null;
    }

    getLargestContentfulPaint() {
        return new Promise((resolve) => {
            let resolved = false;
            const finish = (value) => {
                if (resolved) return;
                resolved = true;
                resolve(value);
            };

            const timeout = setTimeout(() => finish(null), 5000);

            try {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    clearTimeout(timeout);
                    finish(lastEntry ? Math.round(lastEntry.startTime) : null);
                    observer.disconnect();
                });
                observer.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                clearTimeout(timeout);
                finish(null);
            }
        });
    }

    getCumulativeLayoutShift() {
        return new Promise((resolve) => {
            let clsValue = 0;
            let resolved = false;
            const finish = () => {
                if (resolved) return;
                resolved = true;
                resolve(Math.round(clsValue * 1000) / 1000);
            };

            const timeout = setTimeout(() => finish(), 5000);

            try {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                        }
                    }
                });
                observer.observe({ entryTypes: ['layout-shift'] });

                const onHidden = () => {
                    if (document.visibilityState === 'hidden') {
                        document.removeEventListener('visibilitychange', onHidden);
                        observer.disconnect();
                        clearTimeout(timeout);
                        finish();
                    }
                };
                document.addEventListener('visibilitychange', onHidden);
            } catch (e) {
                clearTimeout(timeout);
                finish();
            }
        });
    }

    /**
     * Отслеживание ошибок JavaScript (не resource load errors)
     */
    trackJavaScriptErrors() {
        window.addEventListener('error', (event) => {
            if (event.target && event.target !== window) {
                return;
            }

            const errorInfo = {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error ? event.error.stack : null,
                timestamp: new Date().toISOString(),
                user_agent: navigator.userAgent,
                url: window.location.href
            };

            this.errors.push(errorInfo);

            if (window.solitaireAnalytics) {
                window.solitaireAnalytics.trackError(
                    'javascript_error',
                    event.message,
                    errorInfo
                );
            }
        });

        window.addEventListener('unhandledrejection', (event) => {
            const reason = event.reason;
            const message =
                (reason && reason.message) ||
                (typeof reason === 'string' ? reason : null) ||
                (reason && reason.toString ? reason.toString() : 'unhandled_rejection');

            const errorInfo = {
                reason: message,
                timestamp: new Date().toISOString(),
                user_agent: navigator.userAgent,
                url: window.location.href
            };

            this.errors.push(errorInfo);

            if (window.solitaireAnalytics) {
                window.solitaireAnalytics.trackError(
                    'unhandled_promise_rejection',
                    message,
                    errorInfo
                );
            }
        });
    }

    trackMemoryUsage() {
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                this.sendMetrics('memory_usage', {
                    used_heap_size: memory.usedJSHeapSize,
                    total_heap_size: memory.totalJSHeapSize,
                    heap_size_limit: memory.jsHeapSizeLimit
                });
            }, 30000);
        }
    }

    trackUserInteractionPerformance() {
        document.addEventListener('click', (event) => {
            const startTime = performance.now();

            requestAnimationFrame(() => {
                const endTime = performance.now();
                this.sendMetrics('click_response', {
                    response_time: endTime - startTime,
                    target_element: event.target.tagName,
                    target_class: event.target.className
                });
            });
        });

        let dragStartTime = 0;
        document.addEventListener('dragstart', () => {
            dragStartTime = performance.now();
        });

        document.addEventListener('dragend', () => {
            const dragTime = performance.now() - dragStartTime;
            this.sendMetrics('drag_performance', {
                drag_duration: dragTime
            });
        });
    }

    sendMetrics(metricType, data) {
        if (window.solitaireAnalytics) {
            window.solitaireAnalytics.trackPerformance(metricType, data);
        }

        if (!this.metrics[metricType]) {
            this.metrics[metricType] = [];
        }
        this.metrics[metricType].push({
            timestamp: new Date().toISOString(),
            data: data
        });
    }

    getErrorStats() {
        const errorTypes = {};
        this.errors.forEach(error => {
            const type = error.message ? 'javascript_error' : 'promise_rejection';
            errorTypes[type] = (errorTypes[type] || 0) + 1;
        });

        return {
            total_errors: this.errors.length,
            error_types: errorTypes,
            recent_errors: this.errors.slice(-10)
        };
    }

    getPerformanceStats() {
        const stats = {};
        Object.keys(this.metrics).forEach(key => {
            const values = this.metrics[key].map(m => m.data);
            stats[key] = {
                count: values.length,
                average: this.calculateAverage(values),
                min: Math.min(...values),
                max: Math.max(...values)
            };
        });

        return stats;
    }

    calculateAverage(values) {
        if (values.length === 0) return 0;

        const sum = values.reduce((acc, val) => {
            if (typeof val === 'object') {
                return acc + Object.values(val).reduce((a, b) => a + (Number(b) || 0), 0);
            }
            return acc + (Number(val) || 0);
        }, 0);

        return sum / values.length;
    }
}

window.performanceTracker = new PerformanceTracker();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceTracker;
}
