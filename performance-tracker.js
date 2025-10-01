/**
 * Performance and Error Tracking Module
 * Модуль отслеживания производительности и ошибок
 */

class PerformanceTracker {
    constructor() {
        this.metrics = {};
        this.errors = [];
        this.init();
    }

    /**
     * Инициализация трекера производительности
     */
    init() {
        // Отслеживание времени загрузки страницы
        this.trackPageLoad();
        
        // Отслеживание производительности рендеринга
        this.trackRenderingPerformance();
        
        // Отслеживание ошибок JavaScript
        this.trackJavaScriptErrors();
        
        // Отслеживание производительности памяти
        this.trackMemoryUsage();
        
        // Отслеживание взаимодействия с пользователем
        this.trackUserInteractionPerformance();
    }

    /**
     * Отслеживание времени загрузки страницы
     */
    trackPageLoad() {
        window.addEventListener('load', () => {
            const navigation = performance.getEntriesByType('navigation')[0];
            
            const metrics = {
                page_load_time: navigation.loadEventEnd - navigation.loadEventStart,
                dom_content_loaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                first_paint: this.getFirstPaint(),
                first_contentful_paint: this.getFirstContentfulPaint(),
                largest_contentful_paint: this.getLargestContentfulPaint(),
                cumulative_layout_shift: this.getCumulativeLayoutShift()
            };

            this.sendMetrics('page_load', metrics);
        });
    }

    /**
     * Получение метрики First Paint
     */
    getFirstPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
        return firstPaint ? firstPaint.startTime : null;
    }

    /**
     * Получение метрики First Contentful Paint
     */
    getFirstContentfulPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        return fcp ? fcp.startTime : null;
    }

    /**
     * Получение метрики Largest Contentful Paint
     */
    getLargestContentfulPaint() {
        return new Promise((resolve) => {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                resolve(lastEntry.startTime);
            });
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        });
    }

    /**
     * Получение метрики Cumulative Layout Shift
     */
    getCumulativeLayoutShift() {
        return new Promise((resolve) => {
            let clsValue = 0;
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                resolve(clsValue);
            });
            observer.observe({ entryTypes: ['layout-shift'] });
        });
    }

    /**
     * Отслеживание производительности рендеринга игры
     */
    trackRenderingPerformance() {
        // Отслеживание времени рендеринга карт
        const originalRender = window.render;
        if (originalRender) {
            window.render = (...args) => {
                const startTime = performance.now();
                const result = originalRender.apply(this, args);
                const endTime = performance.now();
                
                this.sendMetrics('card_rendering', {
                    render_time: endTime - startTime,
                    cards_count: document.querySelectorAll('.card').length
                });
                
                return result;
            };
        }
    }

    /**
     * Отслеживание ошибок JavaScript
     */
    trackJavaScriptErrors() {
        window.addEventListener('error', (event) => {
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
            
            // Отправляем ошибку в аналитику
            if (window.solitaireAnalytics) {
                window.solitaireAnalytics.trackError(
                    'javascript_error',
                    event.message,
                    errorInfo
                );
            }
        });

        // Отслеживание необработанных промисов
        window.addEventListener('unhandledrejection', (event) => {
            const errorInfo = {
                reason: event.reason,
                timestamp: new Date().toISOString(),
                user_agent: navigator.userAgent,
                url: window.location.href
            };

            this.errors.push(errorInfo);
            
            if (window.solitaireAnalytics) {
                window.solitaireAnalytics.trackError(
                    'unhandled_promise_rejection',
                    event.reason,
                    errorInfo
                );
            }
        });
    }

    /**
     * Отслеживание использования памяти
     */
    trackMemoryUsage() {
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                this.sendMetrics('memory_usage', {
                    used_heap_size: memory.usedJSHeapSize,
                    total_heap_size: memory.totalJSHeapSize,
                    heap_size_limit: memory.jsHeapSizeLimit
                });
            }, 30000); // Каждые 30 секунд
        }
    }

    /**
     * Отслеживание производительности взаимодействия с пользователем
     */
    trackUserInteractionPerformance() {
        // Отслеживание времени отклика на клики
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

        // Отслеживание времени отклика на перетаскивание
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

    /**
     * Отслеживание производительности анимаций
     */
    trackAnimationPerformance() {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                this.sendMetrics('animation_performance', {
                    animation_name: entry.name,
                    duration: entry.duration,
                    start_time: entry.startTime
                });
            }
        });
        
        observer.observe({ entryTypes: ['measure', 'mark'] });
    }

    /**
     * Отслеживание производительности сети
     */
    trackNetworkPerformance() {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                this.sendMetrics('network_performance', {
                    resource_name: entry.name,
                    transfer_size: entry.transferSize,
                    encoded_body_size: entry.encodedBodySize,
                    decoded_body_size: entry.decodedBodySize,
                    duration: entry.duration
                });
            }
        });
        
        observer.observe({ entryTypes: ['resource'] });
    }

    /**
     * Отслеживание производительности игры
     */
    trackGamePerformance() {
        // FPS мониторинг
        let frameCount = 0;
        let lastTime = performance.now();
        
        const countFrames = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                
                this.sendMetrics('game_fps', {
                    fps: fps,
                    frame_count: frameCount
                });
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(countFrames);
        };
        
        requestAnimationFrame(countFrames);
    }

    /**
     * Отправка метрик в аналитику
     */
    sendMetrics(metricType, data) {
        if (window.solitaireAnalytics) {
            window.solitaireAnalytics.trackPerformance(metricType, data);
        }
        
        // Сохраняем метрики локально для отладки
        if (!this.metrics[metricType]) {
            this.metrics[metricType] = [];
        }
        this.metrics[metricType].push({
            timestamp: new Date().toISOString(),
            data: data
        });
    }

    /**
     * Получение статистики ошибок
     */
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

    /**
     * Получение статистики производительности
     */
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

    /**
     * Расчет среднего значения
     */
    calculateAverage(values) {
        if (values.length === 0) return 0;
        
        const sum = values.reduce((acc, val) => {
            if (typeof val === 'object') {
                return acc + Object.values(val).reduce((a, b) => a + b, 0);
            }
            return acc + val;
        }, 0);
        
        return sum / values.length;
    }
}

// Создаем глобальный экземпляр
window.performanceTracker = new PerformanceTracker();

// Экспортируем для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceTracker;
}
