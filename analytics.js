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

        // Если доступен gtag — отправляем напрямую в GA4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, eventData);
        }

        // Всегда отправляем в dataLayer для GTM
        if (window.dataLayer) {
            window.dataLayer.push({
                event: eventName,
                ...eventData
            });
        }
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
            game_start_time: this.gameStartTime
        });
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
            game_efficiency: this.calculateEfficiency()
        });
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
        this.trackEvent('game_error', {
            error_type: errorType,
            error_message: errorMessage,
            error_context: JSON.stringify(errorContext),
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
        this.trackEvent('performance_metric', {
            metric_name: metric,
            metric_value: value,
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
