/**
 * Enhanced Ecommerce Events for Solitaire Game
 * События Enhanced Ecommerce для игры Solitaire
 */

class EcommerceTracker {
    constructor() {
        this.currency = 'USD';
        this.items = [];
        this.promotions = [];
        this.init();
    }

    /**
     * Инициализация трекера электронной коммерции
     */
    init() {
        // Определяем валюту на основе языка пользователя
        this.detectCurrency();
        
        // Инициализируем базовые товары
        this.initializeProducts();
        
        // Инициализируем промо-акции
        this.initializePromotions();
    }

    /**
     * Определение валюты на основе языка пользователя
     */
    detectCurrency() {
        const language = navigator.language || navigator.userLanguage;
        
        const currencyMap = {
            'en-US': 'USD',
            'en-GB': 'GBP',
            'en-CA': 'CAD',
            'en-AU': 'AUD',
            'de-DE': 'EUR',
            'fr-FR': 'EUR',
            'es-ES': 'EUR',
            'it-IT': 'EUR',
            'pt-PT': 'EUR',
            'nl-NL': 'EUR',
            'ru-RU': 'RUB',
            'ja-JP': 'JPY',
            'ko-KR': 'KRW',
            'zh-CN': 'CNY',
            'pl-PL': 'PLN',
            'cs-CZ': 'CZK',
            'hu-HU': 'HUF',
            'ro-RO': 'RON',
            'bg-BG': 'BGN',
            'hr-HR': 'HRK',
            'sk-SK': 'EUR',
            'sl-SI': 'EUR',
            'et-EE': 'EUR',
            'lv-LV': 'EUR',
            'lt-LT': 'EUR',
            'fi-FI': 'EUR',
            'sv-SE': 'SEK',
            'no-NO': 'NOK',
            'da-DK': 'DKK',
            'he-IL': 'ILS',
            'tr-TR': 'TRY',
            'el-GR': 'EUR'
        };
        
        this.currency = currencyMap[language] || 'USD';
    }

    /**
     * Инициализация товаров
     */
    initializeProducts() {
        this.items = [
            {
                item_id: 'premium_features',
                item_name: 'Premium Features Pack',
                item_category: 'Game Enhancement',
                item_category2: 'Premium',
                price: 4.99,
                quantity: 1,
                currency: this.currency
            },
            {
                item_id: 'hint_pack',
                item_name: 'Hint Pack (10 hints)',
                item_category: 'Game Help',
                item_category2: 'Hints',
                price: 0.99,
                quantity: 1,
                currency: this.currency
            },
            {
                item_id: 'undo_pack',
                item_name: 'Undo Pack (10 undos)',
                item_category: 'Game Help',
                item_category2: 'Undos',
                price: 0.99,
                quantity: 1,
                currency: this.currency
            },
            {
                item_id: 'ad_free_experience',
                item_name: 'Ad-Free Experience',
                item_category: 'Subscription',
                item_category2: 'Premium',
                price: 2.99,
                quantity: 1,
                currency: this.currency
            },
            {
                item_id: 'themes_pack',
                item_name: 'Premium Themes Pack',
                item_category: 'Customization',
                item_category2: 'Themes',
                price: 1.99,
                quantity: 1,
                currency: this.currency
            }
        ];
    }

    /**
     * Инициализация промо-акций
     */
    initializePromotions() {
        this.promotions = [
            {
                promotion_id: 'new_user_discount',
                promotion_name: 'New User 20% Off',
                creative_name: 'Welcome Offer',
                creative_slot: 'banner_top'
            },
            {
                promotion_id: 'premium_bundle',
                promotion_name: 'Premium Bundle Deal',
                creative_name: 'Bundle Offer',
                creative_slot: 'sidebar'
            },
            {
                promotion_id: 'holiday_special',
                promotion_name: 'Holiday Special',
                creative_name: 'Holiday Sale',
                creative_slot: 'popup'
            }
        ];
    }

    /**
     * Отслеживание просмотра товара
     */
    trackViewItem(itemId, itemName, category, price) {
        const item = this.findItem(itemId) || {
            item_id: itemId,
            item_name: itemName,
            item_category: category,
            price: price,
            currency: this.currency
        };

        gtag('event', 'view_item', {
            currency: this.currency,
            value: item.price,
            items: [item]
        });
    }

    /**
     * Отслеживание добавления товара в корзину
     */
    trackAddToCart(itemId, quantity = 1) {
        const item = this.findItem(itemId);
        if (!item) return;

        gtag('event', 'add_to_cart', {
            currency: this.currency,
            value: item.price * quantity,
            items: [{
                ...item,
                quantity: quantity
            }]
        });
    }

    /**
     * Отслеживание удаления товара из корзины
     */
    trackRemoveFromCart(itemId, quantity = 1) {
        const item = this.findItem(itemId);
        if (!item) return;

        gtag('event', 'remove_from_cart', {
            currency: this.currency,
            value: item.price * quantity,
            items: [{
                ...item,
                quantity: quantity
            }]
        });
    }

    /**
     * Отслеживание начала процесса покупки
     */
    trackBeginCheckout(items, value) {
        gtag('event', 'begin_checkout', {
            currency: this.currency,
            value: value,
            items: items
        });
    }

    /**
     * Отслеживание покупки
     */
    trackPurchase(transactionId, items, value, tax = 0, shipping = 0) {
        gtag('event', 'purchase', {
            transaction_id: transactionId,
            currency: this.currency,
            value: value,
            tax: tax,
            shipping: shipping,
            items: items
        });
    }

    /**
     * Отслеживание просмотра промо-акции
     */
    trackViewPromotion(promotionId) {
        const promotion = this.findPromotion(promotionId);
        if (!promotion) return;

        gtag('event', 'view_promotion', {
            promotion_id: promotion.promotion_id,
            promotion_name: promotion.promotion_name,
            creative_name: promotion.creative_name,
            creative_slot: promotion.creative_slot
        });
    }

    /**
     * Отслеживание клика по промо-акции
     */
    trackSelectPromotion(promotionId) {
        const promotion = this.findPromotion(promotionId);
        if (!promotion) return;

        gtag('event', 'select_promotion', {
            promotion_id: promotion.promotion_id,
            promotion_name: promotion.promotion_name,
            creative_name: promotion.creative_name,
            creative_slot: promotion.creative_slot
        });
    }

    /**
     * Отслеживание использования промо-кода
     */
    trackApplyPromotionCode(promotionId, code) {
        gtag('event', 'apply_promotion_code', {
            promotion_id: promotionId,
            promotion_code: code
        });
    }

    /**
     * Отслеживание подписки
     */
    trackSubscribe(subscriptionId, planName, price, currency = this.currency) {
        gtag('event', 'subscribe', {
            subscription_id: subscriptionId,
            plan_name: planName,
            currency: currency,
            value: price
        });
    }

    /**
     * Отслеживание отмены подписки
     */
    trackUnsubscribe(subscriptionId, planName) {
        gtag('event', 'unsubscribe', {
            subscription_id: subscriptionId,
            plan_name: planName
        });
    }

    /**
     * Отслеживание взаимодействия с рекламой
     */
    trackAdInteraction(adId, adName, adType = 'display') {
        gtag('event', 'ad_impression', {
            ad_id: adId,
            ad_name: adName,
            ad_type: adType
        });
    }

    /**
     * Отслеживание клика по рекламе
     */
    trackAdClick(adId, adName, adType = 'display') {
        gtag('event', 'ad_click', {
            ad_id: adId,
            ad_name: adName,
            ad_type: adType
        });
    }

    /**
     * Отслеживание воронки конверсии
     */
    trackConversionFunnel(step, value = 0) {
        const funnelSteps = {
            'game_start': 1,
            'first_move': 2,
            'game_completion': 3,
            'premium_feature_view': 4,
            'add_to_cart': 5,
            'begin_checkout': 6,
            'purchase': 7
        };

        gtag('event', 'conversion_funnel', {
            funnel_step: step,
            step_number: funnelSteps[step] || 0,
            value: value,
            currency: this.currency
        });
    }

    /**
     * Отслеживание жизненного цикла клиента
     */
    trackCustomerLifecycle(stage, value = 0) {
        gtag('event', 'customer_lifecycle', {
            lifecycle_stage: stage,
            value: value,
            currency: this.currency
        });
    }

    /**
     * Отслеживание удержания пользователей
     */
    trackUserRetention(daysSinceFirstVisit, sessionCount) {
        gtag('event', 'user_retention', {
            days_since_first_visit: daysSinceFirstVisit,
            session_count: sessionCount,
            retention_cohort: this.getRetentionCohort(daysSinceFirstVisit)
        });
    }

    /**
     * Определение когорты удержания
     */
    getRetentionCohort(days) {
        if (days <= 1) return 'day_1';
        if (days <= 7) return 'week_1';
        if (days <= 30) return 'month_1';
        if (days <= 90) return 'month_3';
        return 'month_6_plus';
    }

    /**
     * Поиск товара по ID
     */
    findItem(itemId) {
        return this.items.find(item => item.item_id === itemId);
    }

    /**
     * Поиск промо-акции по ID
     */
    findPromotion(promotionId) {
        return this.promotions.find(promo => promo.promotion_id === promotionId);
    }

    /**
     * Добавление нового товара
     */
    addItem(item) {
        this.items.push({
            ...item,
            currency: this.currency
        });
    }

    /**
     * Добавление новой промо-акции
     */
    addPromotion(promotion) {
        this.promotions.push(promotion);
    }

    /**
     * Получение всех товаров
     */
    getAllItems() {
        return this.items;
    }

    /**
     * Получение всех промо-акций
     */
    getAllPromotions() {
        return this.promotions;
    }

    /**
     * Расчет стоимости корзины
     */
    calculateCartValue(items) {
        return items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }

    /**
     * Отслеживание A/B тестов
     */
    trackABTest(testName, variant, conversionValue = 0) {
        gtag('event', 'ab_test', {
            test_name: testName,
            variant: variant,
            conversion_value: conversionValue,
            currency: this.currency
        });
    }
}

// Создаем глобальный экземпляр
window.ecommerceTracker = new EcommerceTracker();

// Экспортируем для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EcommerceTracker;
}
