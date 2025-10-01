/**
 * Custom Dimensions Configuration for Google Analytics
 * Конфигурация пользовательских измерений для Google Analytics
 */

class CustomDimensions {
    constructor() {
        this.dimensions = {
            // Игровые измерения
            GAME_TYPE: 'cd1',
            GAME_SESSION_ID: 'cd2',
            PLAYER_SKILL_LEVEL: 'cd3',
            GAME_DIFFICULTY: 'cd4',
            
            // Измерения взаимодействия
            DEVICE_TYPE: 'cd5',
            SCREEN_RESOLUTION: 'cd6',
            BROWSER_TYPE: 'cd7',
            LANGUAGE: 'cd8',
            
            // Измерения производительности
            PAGE_LOAD_TIME: 'cd9',
            GAME_FPS: 'cd10',
            MEMORY_USAGE: 'cd11',
            ERROR_COUNT: 'cd12',
            
            // Измерения пользовательского поведения
            SESSION_DURATION: 'cd13',
            MOVES_PER_GAME: 'cd14',
            HINTS_USED: 'cd15',
            UNDOS_USED: 'cd16',
            
            // Измерения монетизации
            PREMIUM_FEATURES_USED: 'cd17',
            AD_INTERACTIONS: 'cd18',
            CONVERSION_FUNNEL_STEP: 'cd19'
        };
        
        this.init();
    }

    /**
     * Инициализация пользовательских измерений
     */
    init() {
        // Устанавливаем базовые измерения при загрузке страницы
        this.setDeviceInfo();
        this.setBrowserInfo();
        this.setLanguageInfo();
        this.setScreenInfo();
        
        // Отслеживаем изменения в реальном времени
        this.trackRealTimeChanges();
    }

    /**
     * Установка информации об устройстве
     */
    setDeviceInfo() {
        const deviceType = this.detectDeviceType();
        this.setCustomDimension(this.dimensions.DEVICE_TYPE, deviceType);
    }

    /**
     * Определение типа устройства
     */
    detectDeviceType() {
        const userAgent = navigator.userAgent.toLowerCase();
        
        if (/mobile|android|iphone|ipad|phone/i.test(userAgent)) {
            return 'mobile';
        } else if (/tablet|ipad/i.test(userAgent)) {
            return 'tablet';
        } else {
            return 'desktop';
        }
    }

    /**
     * Установка информации о браузере
     */
    setBrowserInfo() {
        const browserType = this.detectBrowser();
        this.setCustomDimension(this.dimensions.BROWSER_TYPE, browserType);
    }

    /**
     * Определение типа браузера
     */
    detectBrowser() {
        const userAgent = navigator.userAgent.toLowerCase();
        
        if (userAgent.includes('chrome')) return 'chrome';
        if (userAgent.includes('firefox')) return 'firefox';
        if (userAgent.includes('safari')) return 'safari';
        if (userAgent.includes('edge')) return 'edge';
        if (userAgent.includes('opera')) return 'opera';
        
        return 'unknown';
    }

    /**
     * Установка информации о языке
     */
    setLanguageInfo() {
        const language = navigator.language || navigator.userLanguage;
        this.setCustomDimension(this.dimensions.LANGUAGE, language);
    }

    /**
     * Установка информации об экране
     */
    setScreenInfo() {
        const resolution = `${screen.width}x${screen.height}`;
        this.setCustomDimension(this.dimensions.SCREEN_RESOLUTION, resolution);
    }

    /**
     * Отслеживание изменений в реальном времени
     */
    trackRealTimeChanges() {
        // Отслеживание изменений размера окна
        window.addEventListener('resize', () => {
            const resolution = `${window.innerWidth}x${window.innerHeight}`;
            this.setCustomDimension(this.dimensions.SCREEN_RESOLUTION, resolution);
        });

        // Отслеживание изменений ориентации
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                const resolution = `${window.innerWidth}x${window.innerHeight}`;
                this.setCustomDimension(this.dimensions.SCREEN_RESOLUTION, resolution);
            }, 100);
        });
    }

    /**
     * Установка пользовательского измерения
     */
    setCustomDimension(dimensionIndex, value) {
        if (typeof gtag !== 'undefined') {
            gtag('config', 'G-6CEHHD053K', {
                [dimensionIndex]: value
            });
        }
    }

    /**
     * Установка игровых измерений
     */
    setGameDimensions(gameData) {
        if (gameData.gameType) {
            this.setCustomDimension(this.dimensions.GAME_TYPE, gameData.gameType);
        }
        
        if (gameData.sessionId) {
            this.setCustomDimension(this.dimensions.GAME_SESSION_ID, gameData.sessionId);
        }
        
        if (gameData.skillLevel) {
            this.setCustomDimension(this.dimensions.PLAYER_SKILL_LEVEL, gameData.skillLevel);
        }
        
        if (gameData.difficulty) {
            this.setCustomDimension(this.dimensions.GAME_DIFFICULTY, gameData.difficulty);
        }
    }

    /**
     * Установка измерений производительности
     */
    setPerformanceDimensions(performanceData) {
        if (performanceData.pageLoadTime) {
            this.setCustomDimension(this.dimensions.PAGE_LOAD_TIME, performanceData.pageLoadTime);
        }
        
        if (performanceData.fps) {
            this.setCustomDimension(this.dimensions.GAME_FPS, performanceData.fps);
        }
        
        if (performanceData.memoryUsage) {
            this.setCustomDimension(this.dimensions.MEMORY_USAGE, performanceData.memoryUsage);
        }
        
        if (performanceData.errorCount) {
            this.setCustomDimension(this.dimensions.ERROR_COUNT, performanceData.errorCount);
        }
    }

    /**
     * Установка измерений поведения пользователя
     */
    setBehaviorDimensions(behaviorData) {
        if (behaviorData.sessionDuration) {
            this.setCustomDimension(this.dimensions.SESSION_DURATION, behaviorData.sessionDuration);
        }
        
        if (behaviorData.movesPerGame) {
            this.setCustomDimension(this.dimensions.MOVES_PER_GAME, behaviorData.movesPerGame);
        }
        
        if (behaviorData.hintsUsed) {
            this.setCustomDimension(this.dimensions.HINTS_USED, behaviorData.hintsUsed);
        }
        
        if (behaviorData.undosUsed) {
            this.setCustomDimension(this.dimensions.UNDOS_USED, behaviorData.undosUsed);
        }
    }

    /**
     * Установка измерений монетизации
     */
    setMonetizationDimensions(monetizationData) {
        if (monetizationData.premiumFeaturesUsed) {
            this.setCustomDimension(this.dimensions.PREMIUM_FEATURES_USED, monetizationData.premiumFeaturesUsed);
        }
        
        if (monetizationData.adInteractions) {
            this.setCustomDimension(this.dimensions.AD_INTERACTIONS, monetizationData.adInteractions);
        }
        
        if (monetizationData.conversionFunnelStep) {
            this.setCustomDimension(this.dimensions.CONVERSION_FUNNEL_STEP, monetizationData.conversionFunnelStep);
        }
    }

    /**
     * Определение уровня навыков игрока
     */
    calculatePlayerSkillLevel(gameStats) {
        const { totalGames, winRate, averageMoves, averageTime } = gameStats;
        
        if (totalGames < 5) return 'beginner';
        
        let skillScore = 0;
        
        // Оценка по проценту побед
        if (winRate > 0.8) skillScore += 3;
        else if (winRate > 0.6) skillScore += 2;
        else if (winRate > 0.4) skillScore += 1;
        
        // Оценка по количеству ходов
        if (averageMoves < 50) skillScore += 2;
        else if (averageMoves < 80) skillScore += 1;
        
        // Оценка по времени
        if (averageTime < 300) skillScore += 2; // менее 5 минут
        else if (averageTime < 600) skillScore += 1; // менее 10 минут
        
        if (skillScore >= 6) return 'expert';
        if (skillScore >= 4) return 'advanced';
        if (skillScore >= 2) return 'intermediate';
        
        return 'beginner';
    }

    /**
     * Определение сложности игры
     */
    calculateGameDifficulty(gameData) {
        const { moves, time, hints, undos } = gameData;
        
        let difficultyScore = 0;
        
        // Больше ходов = сложнее
        if (moves > 100) difficultyScore += 2;
        else if (moves > 70) difficultyScore += 1;
        
        // Больше времени = сложнее
        if (time > 600) difficultyScore += 2; // более 10 минут
        else if (time > 300) difficultyScore += 1; // более 5 минут
        
        // Использование подсказок = сложнее
        if (hints > 5) difficultyScore += 2;
        else if (hints > 2) difficultyScore += 1;
        
        // Использование отмены = сложнее
        if (undos > 10) difficultyScore += 2;
        else if (undos > 5) difficultyScore += 1;
        
        if (difficultyScore >= 6) return 'very_hard';
        if (difficultyScore >= 4) return 'hard';
        if (difficultyScore >= 2) return 'medium';
        
        return 'easy';
    }

    /**
     * Получение всех измерений
     */
    getAllDimensions() {
        return this.dimensions;
    }

    /**
     * Получение значения измерения
     */
    getDimensionValue(dimensionKey) {
        return this.dimensions[dimensionKey];
    }
}

// Создаем глобальный экземпляр
window.customDimensions = new CustomDimensions();

// Экспортируем для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CustomDimensions;
}
