/**
 * Enhanced Analytics Module for World Solitaire
 * Расширенный модуль аналитики для игры Solitaire
 */

class SolitaireAnalytics {
    constructor() {
        this.gameStartTime = null;
        this.moveCount = 0;
        this.hintCount = 0;
        this.undoCount = 0;
        this.autoWinUsed = false;
        this.gameSessionId = this.generateSessionId();
        this.isGameActive = false;
        this.performanceMetricState = {};
        this.performanceMetricMinIntervalMs = 30000;
        this.errorDedupeState = {};
        this.errorMinIntervalMs = 60000;
        this.appVersion = window.WORLD_SOLITAIRE_VERSION || 'web-2026.04';
        
        // Инициализация
        this.init();
    }

    /**
     * Генерирует уникальный ID сессии игры
     */
    generateSessionId() {
        return 'game_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Инициализация модуля аналитики
     */
    init() {
        // Проверяем наличие хотя бы одного механизма отправки (gtag или dataLayer)
        const hasGtag = typeof gtag !== 'undefined';
        const hasDataLayer = Array.isArray(window.dataLayer);
        if (!hasGtag && !hasDataLayer) {
            console.warn('Analytics не инициализировалась: нет gtag и dataLayer');
            return;
        }

        // Отправляем событие инициализации (уйдет в gtag если доступен, и/или в dataLayer)
        this.trackEvent('game_initialized', {
            session_id: this.gameSessionId,
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent,
            screen_resolution: `${screen.width}x${screen.height}`,
            language: navigator.language
        });
    }

    /**
     * Универсальный метод для отправки событий в GA4
     */
    trackEvent(eventName, parameters = {}) {
        const eventData = {
            event_category: 'solitaire_game',
            session_id: this.gameSessionId,
            timestamp: new Date().toISOString(),
            ...parameters
        };

        // Один канал: gtag ИЛИ dataLayer, чтобы GTM+gtag не удваивали события в GA4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, eventData);
        } else if (window.dataLayer) {
            window.dataLayer.push({
                event: eventName,
                ...eventData
            });
        }
    }

    /**
     * Получение локали страницы из URL
     */
    getPageLocale() {
        const path = (window.location && window.location.pathname) ? window.location.pathname : '';
        const parts = path.split('/').filter(Boolean);
        if (parts.length > 0 && parts[0].length === 2) {
            return parts[0].toLowerCase();
        }
        return 'en';
    }

    /**
     * Страна игрока из localStorage (модалка выбора), иначе локаль страницы
     */
    getPlayerCountry() {
        try {
            const saved = localStorage.getItem('ws_player_country');
            if (saved && /^[a-z]{2}$/.test(saved)) return saved;
        } catch (e) { /* private mode */ }
        return this.getPageLocale();
    }

    trackCountrySelected(locale) {
        this.trackEvent('country_selected', {
            player_country: locale,
            page_locale: this.getPageLocale()
        });
    }

    trackCountryDismissed() {
        this.trackEvent('country_dismissed', {
            player_country: this.getPlayerCountry(),
            page_locale: this.getPageLocale()
        });
    }

    /**
     * Отслеживание начала новой игры
     */
    trackGameStart(gameType = 'klondike') {
        this.gameStartTime = Date.now();
        this.moveCount = 0;
        this.hintCount = 0;
        this.undoCount = 0;
        this.autoWinUsed = false;
        this.isGameActive = true;
        this.gameSessionId = this.generateSessionId();

        this.trackEvent('game_start', {
            game_type: gameType,
            session_id: this.gameSessionId,
            game_start_time: this.gameStartTime,
            player_country: this.getPlayerCountry(),
            page_locale: this.getPageLocale()
        });

        if (window.customDimensions) {
            window.customDimensions.setGameDimensions({
                gameType: gameType,
                sessionId: this.gameSessionId
            });
        }
    }

    /**
     * Отслеживание хода игрока
     */
    trackMove(fromPile, toPile, cardRank, cardSuit, moveType = 'manual') {
        if (!this.isGameActive) return;

        this.moveCount++;

        this.trackEvent('card_move', {
            from_pile: fromPile,
            to_pile: toPile,
            card_rank: cardRank,
            card_suit: cardSuit,
            move_type: moveType,
            move_number: this.moveCount,
            game_time: this.getGameTime()
        });
    }

    /**
     * Отслеживание использования подсказки
     */
    trackHint() {
        if (!this.isGameActive) return;

        this.hintCount++;

        this.trackEvent('hint_used', {
            hint_count: this.hintCount,
            move_count: this.moveCount,
            game_time: this.getGameTime()
        });
    }

    /**
     * Отслеживание отмены хода
     */
    trackUndo() {
        if (!this.isGameActive) return;

        this.undoCount++;

        this.trackEvent('undo_used', {
            undo_count: this.undoCount,
            move_count: this.moveCount,
            game_time: this.getGameTime()
        });
    }

    /**
     * Отслеживание победы
     */
    trackGameWin(winType = 'manual') {
        if (!this.isGameActive) return;

        const gameTime = this.getGameTime();
        this.isGameActive = false;

        this.trackEvent('game_won', {
            win_type: winType,
            total_moves: this.moveCount,
            total_hints: this.hintCount,
            total_undos: this.undoCount,
            game_time_seconds: Math.round(gameTime / 1000),
            auto_win_used: this.autoWinUsed,
            game_efficiency: this.calculateEfficiency(),
            player_country: this.getPlayerCountry(),
            page_locale: this.getPageLocale()
        });

        if (window.customDimensions) {
            window.customDimensions.setBehaviorDimensions({
                movesPerGame: this.moveCount,
                hintsUsed: this.hintCount,
                undosUsed: this.undoCount,
                sessionDuration: Math.round(gameTime / 1000)
            });
        }
    }

    /**
     * Отслеживание поражения/сдачи
     */
    trackGameLoss() {
        if (!this.isGameActive) return;

        const gameTime = this.getGameTime();
        this.isGameActive = false;

        this.trackEvent('game_lost', {
            total_moves: this.moveCount,
            total_hints: this.hintCount,
            total_undos: this.undoCount,
            game_time_seconds: Math.round(gameTime / 1000),
            game_efficiency: this.calculateEfficiency()
        });
    }

    /**
     * Отслеживание использования авто-победы
     */
    trackAutoWin() {
        this.autoWinUsed = true;
        this.trackEvent('auto_win_used', {
            move_count: this.moveCount,
            game_time: this.getGameTime()
        });
    }

    /**
     * Отслеживание паузы игры
     */
    trackGamePause() {
        this.trackEvent('game_paused', {
            move_count: this.moveCount,
            game_time: this.getGameTime()
        });
    }

    /**
     * Отслеживание возобновления игры
     */
    trackGameResume() {
        this.trackEvent('game_resumed', {
            move_count: this.moveCount,
            game_time: this.getGameTime()
        });
    }

    /**
     * Отслеживание ошибок
     */
    trackError(errorType, errorMessage, errorContext = {}) {
        const safeMessage = String(errorMessage || 'unknown_error').slice(0, 240);
        const dedupeKey = `${errorType}|${safeMessage}`;
        const now = Date.now();
        const previous = this.errorDedupeState[dedupeKey];
        if (previous && (now - previous) < this.errorMinIntervalMs) {
            return;
        }
        this.errorDedupeState[dedupeKey] = now;

        const safeContext = {
            error_code: errorContext.error_code || errorContext.code || errorType,
            filename: errorContext.filename || null,
            lineno: errorContext.lineno || null,
            colno: errorContext.colno || null,
            url: errorContext.url || window.location.href
        };

        this.trackEvent('game_error', {
            error_type: errorType,
            error_code: safeContext.error_code,
            error_message: safeMessage,
            error_context: JSON.stringify(safeContext),
            app_version: this.appVersion,
            page_locale: this.getPageLocale(),
            game_time: this.getGameTime(),
            move_count: this.moveCount
        });
    }

    /**
     * Отслеживание взаимодействия с интерфейсом
     */
    trackUIInteraction(element, action) {
        this.trackEvent('ui_interaction', {
            element: element,
            action: action,
            game_time: this.getGameTime(),
            move_count: this.moveCount
        });
    }

    /**
     * Получение времени игры в миллисекундах
     */
    getGameTime() {
        return this.gameStartTime ? Date.now() - this.gameStartTime : 0;
    }

    /**
     * Расчет эффективности игры
     */
    calculateEfficiency() {
        if (this.moveCount === 0) return 0;
        
        // Простая формула эффективности: меньше ходов = лучше
        // Можно настроить более сложную логику
        const baseEfficiency = 100;
        const penaltyPerMove = 1;
        const penaltyPerHint = 2;
        const penaltyPerUndo = 3;
        
        return Math.max(0, baseEfficiency - 
            (this.moveCount * penaltyPerMove) - 
            (this.hintCount * penaltyPerHint) - 
            (this.undoCount * penaltyPerUndo)
        );
    }

    /**
     * Отслеживание производительности
     */
    trackPerformance(metric, value) {
        const metricName = String(metric || 'unknown_metric');
        const now = Date.now();
        const serializedValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
        const previous = this.performanceMetricState[metricName];

        if (previous && (now - previous.lastSentAt) < this.performanceMetricMinIntervalMs) {
            // Keep one sample per metric per interval to reduce GA4 noise.
            return;
        }

        this.performanceMetricState[metricName] = {
            lastSentAt: now,
            lastValue: serializedValue
        };

        this.trackEvent('performance_metric', {
            metric_name: metricName,
            metric_value: serializedValue,
            app_version: this.appVersion,
            page_locale: this.getPageLocale(),
            game_time: this.getGameTime()
        });
    }

    /**
     * Отслеживание пользовательских настроек
     */
    trackSettingsChange(setting, value) {
        this.trackEvent('settings_changed', {
            setting_name: setting,
            setting_value: value,
            game_time: this.getGameTime()
        });
    }
}

// Создаем глобальный экземпляр
window.solitaireAnalytics = new SolitaireAnalytics();

// Экспортируем для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SolitaireAnalytics;
}
