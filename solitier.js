/* ### TODO ###
- Refactor code :) Always

Optional Features:
- HTML Drag & Drop API
- Limit How Many Times Stock Can Be Reloaded (3x)
- 3 Card Draw
- High score
- Options panel for user
- Sound Fx

*/


document.addEventListener("DOMContentLoaded", function(event) {
   if (!document.querySelector('#table')) {
      return;
   }

   // 0. DECLARE VARS

      window.dataLayer = window.dataLayer || [];

      // Google Sheets score endpoint (Apps Script Web App)
      var SHEETS_ENDPOINT_URL = 'https://script.google.com/macros/s/AKfycbys6qHXyRTX2SFInJ3v4sZVVdRhapobEgRl2iVS5I3a0WoIJJDRY7luZFsSSX-uHrcQKw/exec';
      var SHEETS_ENDPOINT_TOKEN = '';
      var LOCALE_RANKING_LIMIT = 5;
      var SUPPORTED_LOCALES = [
         'bg','cs','da','de','el','en','es','et','fi','fr','he','hr','hu','it',
         'ja','ko','lt','lv','nb','nl','pl','pt','ro','ru','sk','sl','sr','sv','tr'
      ];
      var LOCALE_EMOJI = {
         bg: '🇧🇬',
         cs: '🇨🇿',
         da: '🇩🇰',
         de: '🇩🇪',
         el: '🇬🇷',
         en: '🇺🇸',
         es: '🇪🇸',
         et: '🇪🇪',
         fi: '🇫🇮',
         fr: '🇫🇷',
         he: '🇮🇱',
         hr: '🇭🇷',
         hu: '🇭🇺',
         it: '🇮🇹',
         ja: '🇯🇵',
         ko: '🇰🇷',
         lt: '🇱🇹',
         lv: '🇱🇻',
         nb: '🇳🇴',
         nl: '🇳🇱',
         pl: '🇵🇱',
         pt: '🇵🇹',
         ro: '🇷🇴',
         ru: '🇷🇺',
         sk: '🇸🇰',
         sl: '🇸🇮',
         sr: '🇷🇸',
         sv: '🇸🇪',
         tr: '🇹🇷'
      };
      var UI_STRINGS = {
         bg: { play: 'Играй', pause: 'Пауза', timer: 'Таймер:', moves: 'Ходове:', score: 'Резултат:', newGame: 'Нова игра', chooseCountry: 'Избери страна' },
         cs: { play: 'Hraj', pause: 'Pauza', timer: 'Časovač:', moves: 'Tahy:', score: 'Skóre:', newGame: 'Nová hra', chooseCountry: 'Vybrat zemi' },
         da: { play: 'Play', pause: 'Pause', timer: 'Timer:', moves: 'Moves:', score: 'Score:', newGame: 'Nyt spil', chooseCountry: 'Vælg land' },
         de: { play: 'Spielen', pause: 'Pause', timer: 'Timer:', moves: 'Züge:', score: 'Punkte:', newGame: 'Neues Spiel', chooseCountry: 'Land wählen' },
         el: { play: 'Παίξε', pause: 'Παύση', timer: 'Χρόνος:', moves: 'Κινήσεις:', score: 'Πόντοι:', newGame: 'Νέο παιχνίδι', chooseCountry: 'Επιλογή χώρας' },
         en: { play: 'Play', pause: 'Pause', timer: 'Timer:', moves: 'Moves:', score: 'Score:', newGame: 'New Game', chooseCountry: 'Choose country' },
         es: { play: 'Jugar', pause: 'Pausa', timer: 'Tiempo:', moves: 'Movimientos:', score: 'Puntuación:', newGame: 'Nuevo juego', chooseCountry: 'Elegir país' },
         et: { play: 'Mängi', pause: 'Paus', timer: 'Aeg:', moves: 'Käigud:', score: 'Punktid:', newGame: 'Uus mäng', chooseCountry: 'Vali riik' },
         fi: { play: 'Pelaa', pause: 'Tauko', timer: 'Aika:', moves: 'Siirrot:', score: 'Pisteet:', newGame: 'Uusi peli', chooseCountry: 'Valitse maa' },
         fr: { play: 'Jouer', pause: 'Pause', timer: 'Temps:', moves: 'Mouvements:', score: 'Score:', newGame: 'Nouvelle partie', chooseCountry: 'Choisir un pays' },
         he: { play: 'התחל', pause: 'הפסק', timer: 'זמן:', moves: 'מהלכים:', score: 'ניקוד:', newGame: 'משחק חדש', chooseCountry: 'בחר מדינה' },
         hr: { play: 'Igraj', pause: 'Pauza', timer: 'Timer:', moves: 'Potezi:', score: 'Rezultat:', newGame: 'Nova igra', chooseCountry: 'Odaberi zemlju' },
         hu: { play: 'Indítás', pause: 'Szünet', timer: 'Idő:', moves: 'Lépések:', score: 'Pontszám:', newGame: 'Új játék', chooseCountry: 'Ország választása' },
         it: { play: 'Avvia', pause: 'Pausa', timer: 'Tempo:', moves: 'Mosse:', score: 'Punteggio:', newGame: 'Nuova partita', chooseCountry: 'Scegli paese' },
         ja: { play: 'スタート', pause: '一時停止', timer: '時間:', moves: '手数:', score: 'スコア:', newGame: '新しいゲーム', chooseCountry: '国を選択' },
         ko: { play: '시작', pause: '일시정지', timer: '시간:', moves: '횟수:', score: '점수:', newGame: '새 게임', chooseCountry: '국가 선택' },
         lt: { play: 'Pradėti', pause: 'Pauzė', timer: 'Laikas:', moves: 'Eismai:', score: 'Taškai:', newGame: 'Naujas žaidimas', chooseCountry: 'Pasirinkti šalį' },
         lv: { play: 'Sākt', pause: 'Pauze', timer: 'Laiks:', moves: 'Gājieni:', score: 'Punkti:', newGame: 'Jauna spēle', chooseCountry: 'Izvēlēties valsti' },
         nb: { play: 'Start', pause: 'Pause', timer: 'Tid:', moves: 'Trekk:', score: 'Poeng:', newGame: 'Nytt spill', chooseCountry: 'Velg land' },
         nl: { play: 'Play', pause: 'Pauze', timer: 'Tijd:', moves: 'Bewegingen:', score: 'Score:', newGame: 'Nieuw spel', chooseCountry: 'Kies land' },
         pl: { play: 'Play', pause: 'Pauza', timer: 'Czas:', moves: 'Ruchy:', score: 'Wynik:', newGame: 'Nowa gra', chooseCountry: 'Wybierz kraj' },
         pt: { play: 'Iniciar', pause: 'Pausar', timer: 'Tempo:', moves: 'Movimentos:', score: 'Pontos:', newGame: 'Novo jogo', chooseCountry: 'Escolher país' },
         ro: { play: 'Start', pause: 'Pauză', timer: 'Timp:', moves: 'Mutări:', score: 'Puncte:', newGame: 'Joc nou', chooseCountry: 'Alege țara' },
         ru: { play: 'Старт', pause: 'Пауза', timer: 'Время:', moves: 'Ходы:', score: 'Очки:', newGame: 'Новая игра', chooseCountry: 'Выбрать страну' },
         sk: { play: 'Štart', pause: 'Pauza', timer: 'Čas:', moves: 'Počet ťahov:', score: 'Body:', newGame: 'Nová hra', chooseCountry: 'Vybrať krajinu' },
         sl: { play: 'Začni', pause: 'Pavza', timer: 'Čas:', moves: 'Število potez:', score: 'Točke:', newGame: 'Nova igra', chooseCountry: 'Izberi državo' },
         sr: { play: 'Počni', pause: 'Pauza', timer: 'Vreme:', moves: 'Broj poteza:', score: 'Poeni:', newGame: 'Nova igra', chooseCountry: 'Odaberi zemlju' },
         sv: { play: 'Starta', pause: 'Paus', timer: 'Tid:', moves: 'Drag antal:', score: 'Poäng:', newGame: 'Nytt spel', chooseCountry: 'Välj land' },
         tr: { play: 'Başlat', pause: 'Duraklat', timer: 'Süre:', moves: 'Hamle Sayısı:', score: 'Puan:', newGame: 'Yeni oyun', chooseCountry: 'Ülke seç' }
      };
      var RANKING_LABELS = {
         bg: { common: 'Общ', daily: 'Дневен', monthly: 'Месечен' },
         cs: { common: 'Celkem', daily: 'Denní', monthly: 'Měsíční' },
         da: { common: 'Samlet', daily: 'Daglig', monthly: 'Månedlig' },
         de: { common: 'Gesamt', daily: 'Täglich', monthly: 'Monatlich' },
         el: { common: 'Γενικό', daily: 'Ημερήσιο', monthly: 'Μηνιαίο' },
         en: { common: 'Common', daily: 'Daily', monthly: 'Monthly' },
         es: { common: 'General', daily: 'Diario', monthly: 'Mensual' },
         et: { common: 'Üld', daily: 'Päeva', monthly: 'Kuu' },
         fi: { common: 'Yleis', daily: 'Päivä', monthly: 'Kuukausi' },
         fr: { common: 'Général', daily: 'Quotidien', monthly: 'Mensuel' },
         he: { common: 'כללי', daily: 'יומי', monthly: 'חודשי' },
         hr: { common: 'Ukupni', daily: 'Dnevni', monthly: 'Mjesečni' },
         hu: { common: 'Összes', daily: 'Napi', monthly: 'Havi' },
         it: { common: 'Generale', daily: 'Giornaliero', monthly: 'Mensile' },
         ja: { common: '総合', daily: '日間', monthly: '月間' },
         ko: { common: '종합', daily: '일간', monthly: '월간' },
         lt: { common: 'Bendras', daily: 'Dienos', monthly: 'Mėnesio' },
         lv: { common: 'Kopējais', daily: 'Dienas', monthly: 'Mēneša' },
         nb: { common: 'Totalt', daily: 'Daglig', monthly: 'Månedlig' },
         nl: { common: 'Algemeen', daily: 'Dagelijks', monthly: 'Maandelijks' },
         pl: { common: 'Ogólny', daily: 'Dzienny', monthly: 'Miesięczny' },
         pt: { common: 'Geral', daily: 'Diário', monthly: 'Mensal' },
         ro: { common: 'General', daily: 'Zilnic', monthly: 'Lunar' },
         ru: { common: 'Общий', daily: 'Дневной', monthly: 'Месячный' },
         sk: { common: 'Celkový', daily: 'Denný', monthly: 'Mesačný' },
         sl: { common: 'Skupni', daily: 'Dnevni', monthly: 'Mesečni' },
         sr: { common: 'Ukupni', daily: 'Dnevni', monthly: 'Mesečni' },
         sv: { common: 'Total', daily: 'Daglig', monthly: 'Månatlig' },
         tr: { common: 'Genel', daily: 'Günlük', monthly: 'Aylık' }
      };
      var EMPTY_RANKING_MESSAGES = {
         bg: 'Празно',
         cs: 'Prázdné',
         da: 'Tom',
         de: 'Leer',
         el: 'Κενό',
         en: 'Empty',
         es: 'Vacío',
         et: 'Tühi',
         fi: 'Tyhjä',
         fr: 'Vide',
         he: 'ריק',
         hr: 'Prazno',
         hu: 'Üres',
         it: 'Vuoto',
         ja: '空',
         ko: '비어 있음',
         lt: 'Tuščia',
         lv: 'Tukšs',
         nb: 'Tom',
         nl: 'Leeg',
         pl: 'Puste',
         pt: 'Vazio',
         ro: 'Gol',
         ru: 'Пусто',
         sk: 'Prázdne',
         sl: 'Prazno',
         sr: 'Prazno',
         sv: 'Tom',
         tr: 'Boş'
      };
      var pageLocale = getLocaleFromPath();
      var PLAYER_COUNTRY_KEY = 'ws_player_country';
      var RANKING_CACHE_KEY = 'ws_locale_ranking_cache_v1';
      var CONTRIB_KEY_ALL = 'ws_player_contrib_all';
      var CONTRIB_KEY_DAILY = 'ws_player_contrib_daily';
      var CONTRIB_KEY_MONTHLY = 'ws_player_contrib_monthly';

      function getLocaleFromPath() {
         var path = (window.location && window.location.pathname) ? window.location.pathname : '';
         var parts = path.split('/').filter(Boolean);
         if (parts.length > 0) {
            var candidate = parts[0].toLowerCase();
            if (SUPPORTED_LOCALES.indexOf(candidate) >= 0) return candidate;
         }
         return 'en';
      }

      function getPlayerCountry() {
         try {
            var saved = localStorage.getItem(PLAYER_COUNTRY_KEY);
            if (saved && SUPPORTED_LOCALES.indexOf(saved) >= 0) return saved;
         } catch (e) { /* ponytail: private mode */ }
         return pageLocale;
      }

      function setPlayerCountry(locale) {
         if (SUPPORTED_LOCALES.indexOf(locale) < 0) return;
         try {
            localStorage.setItem(PLAYER_COUNTRY_KEY, locale);
         } catch (e) { /* ponytail: private mode */ }
      }

      var localeTotals = null;
      var localeDailyTotals = null;
      var localeMonthlyTotals = null;

      function getRankingLocale() {
         var country = getPlayerCountry();
         return RANKING_LABELS[country] ? country : pageLocale;
      }

      function getRankingLabels() {
         return RANKING_LABELS[getRankingLocale()] || RANKING_LABELS.en;
      }

      function getUIStrings() {
         return UI_STRINGS[getRankingLocale()] || UI_STRINGS.en;
      }

      function getEmptyRankingMessage() {
         return EMPTY_RANKING_MESSAGES[getRankingLocale()] || EMPTY_RANKING_MESSAGES.en;
      }

      function getRankingUrl() {
         if (!SHEETS_ENDPOINT_URL) return '';
         var joiner = SHEETS_ENDPOINT_URL.indexOf('?') >= 0 ? '&' : '?';
         return SHEETS_ENDPOINT_URL + joiner + 'ts=' + Date.now();
      }

      function loadCachedRankingPayload() {
         try {
            var raw = localStorage.getItem(RANKING_CACHE_KEY);
            if (!raw) return null;
            var parsed = JSON.parse(raw);
            if (!parsed || !parsed.totals) return null;
            return parsed;
         } catch (e) { /* ponytail: private mode */ }
         return null;
      }

      function saveCachedRankingPayload(payload) {
         if (!payload || !payload.totals) return;
         try {
            localStorage.setItem(RANKING_CACHE_KEY, JSON.stringify({
               totals: payload.totals,
               dailyTotals: payload.dailyTotals || {},
               monthlyTotals: payload.monthlyTotals || {},
               dailyPeriod: payload.dailyPeriod || '',
               monthlyPeriod: payload.monthlyPeriod || ''
            }));
         } catch (e) { /* ponytail: private mode */ }
      }

      function p2(n) { return n < 10 ? '0' + n : String(n); }
      function utcDateKey() {
         var d = new Date();
         return d.getUTCFullYear() + '-' + p2(d.getUTCMonth() + 1) + '-' + p2(d.getUTCDate());
      }
      function utcMonthKey() {
         var d = new Date();
         return d.getUTCFullYear() + '-' + p2(d.getUTCMonth() + 1);
      }

      function loadContribs() {
         var today = utcDateKey();
         var month = utcMonthKey();
         function readScore(key, periodKey, currentPeriod) {
            try {
               var raw = localStorage.getItem(key);
               if (!raw) return 0;
               var obj = JSON.parse(raw);
               if (obj[periodKey] !== currentPeriod) return 0;
               return parseInt(obj.score, 10) || 0;
            } catch (e) { return 0; }
         }
         var all = 0;
         try {
            var rawAll = localStorage.getItem(CONTRIB_KEY_ALL);
            if (rawAll) all = parseInt(JSON.parse(rawAll).score, 10) || 0;
         } catch (e) { /* private mode */ }
         return {
            all: all,
            daily: readScore(CONTRIB_KEY_DAILY, 'date', today),
            monthly: readScore(CONTRIB_KEY_MONTHLY, 'month', month)
         };
      }

      function addPlayerScore(score) {
         if (!score || score <= 0) return;
         var today = utcDateKey();
         var month = utcMonthKey();
         function increment(key, periodKey, currentPeriod) {
            try {
               var raw = localStorage.getItem(key);
               var obj = raw ? JSON.parse(raw) : {};
               if (obj[periodKey] !== currentPeriod) { obj.score = 0; obj[periodKey] = currentPeriod; }
               obj.score = (parseInt(obj.score, 10) || 0) + score;
               localStorage.setItem(key, JSON.stringify(obj));
            } catch (e) { /* private mode */ }
         }
         try {
            var rawAll = localStorage.getItem(CONTRIB_KEY_ALL);
            var objAll = rawAll ? JSON.parse(rawAll) : { score: 0 };
            objAll.score = (parseInt(objAll.score, 10) || 0) + score;
            localStorage.setItem(CONTRIB_KEY_ALL, JSON.stringify(objAll));
         } catch (e) { /* private mode */ }
         increment(CONTRIB_KEY_DAILY, 'date', today);
         increment(CONTRIB_KEY_MONTHLY, 'month', month);
      }

      function replaceRankingContainer(container, scoreBlock) {
         if (!scoreBlock || !scoreBlock.parentNode) return;
         var existing = d.querySelector('#locale-ranking');
         if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
         if (container) scoreBlock.parentNode.insertBefore(container, scoreBlock);
      }

      function fetchRankingPayload(attempt) {
         attempt = attempt || 0;
         return fetch(getRankingUrl(), {
            cache: 'no-store'
         }).then(function(response) {
            return response.json();
         }).catch(function(error) {
            if (attempt >= 2) throw error;
            return new Promise(function(resolve) {
               setTimeout(resolve, 700 * (attempt + 1));
            }).then(function() {
               return fetchRankingPayload(attempt + 1);
            });
         });
      }

      function buildTopEntries(totals, limit) {
         if (!totals) return [];
         var entries = Object.keys(totals).map(function(locale) {
            return {
               locale: locale,
               score: parseInt(totals[locale], 10) || 0
            };
         }).filter(function(entry) {
            return entry.score > 0;
         });
         entries.sort(function(a, b) {
            return b.score - a.score;
         });
         return entries.slice(0, limit);
      }

      function fmtScore(score) {
         var n = parseInt(score, 10) || 0;
         return n >= 1000 ? Math.floor(n / 1000) + 'K' : String(n);
      }

      function buildRankingGrid(entries, playerCountry) {
         var grid = d.createElement('div');
         grid.className = 'locale-ranking-grid';
         entries.forEach(function(entry) {
            var item = d.createElement('div');
            item.className = 'locale-ranking-item';
            if (entry.locale === playerCountry) {
               item.className += ' is-current';
            }
            item.dataset.locale = entry.locale;
            item.textContent = (LOCALE_EMOJI[entry.locale] || '🏳️') +
               ' ' + entry.locale.toUpperCase() +
               ' ' + fmtScore(entry.score);
            grid.appendChild(item);
         });
         return grid;
      }

      function isRankingEmpty(totals) {
         if (!totals) return true;
         for (var locale in totals) {
            if (!Object.prototype.hasOwnProperty.call(totals, locale)) continue;
            if ((parseInt(totals[locale], 10) || 0) > 0) return false;
         }
         return true;
      }

      function buildEmptyRankingMessage() {
         var el = d.createElement('div');
         el.className = 'locale-ranking-empty';
         el.textContent = getEmptyRankingMessage();
         return el;
      }

      function buildLoadingGrid() {
         var grid = d.createElement('div');
         grid.className = 'locale-ranking-grid';
         for (var i = 0; i < LOCALE_RANKING_LIMIT; i++) {
            var loadingItem = d.createElement('div');
            loadingItem.className = 'locale-ranking-item is-placeholder';
            var loader = d.createElement('span');
            loader.className = 'locale-ranking-spinner';
            loadingItem.appendChild(loader);
            grid.appendChild(loadingItem);
         }
         return grid;
      }

      function buildContribBadge(score) {
         if (!score || score <= 0) return null;
         var el = d.createElement('div');
         el.className = 'locale-ranking-contrib';
         el.textContent = '+ ' + fmtScore(score);
         return el;
      }

      function buildPeriodRow(labelText, grid, badgeEl) {
         var row = d.createElement('div');
         row.className = 'locale-ranking-period-row';
         var label = d.createElement('div');
         label.className = 'locale-ranking-label';
         label.textContent = labelText;
         row.appendChild(label);
         row.appendChild(grid);
         if (badgeEl) row.appendChild(badgeEl);
         return row;
      }

      function buildDoublePeriodRow(leftLabel, leftContent, rightLabel, rightContent) {
         var row = d.createElement('div');
         row.className = 'locale-ranking-period-row locale-ranking-period-row-double';
         row.appendChild(buildPeriodRow(leftLabel, leftContent));
         row.appendChild(buildPeriodRow(rightLabel, rightContent));
         return row;
      }

      function renderRankingContainer(totals, dailyTotals, monthlyTotals) {
         var playerCountry = getPlayerCountry();
         var labels = getRankingLabels();
         var contribs = loadContribs();
         var container = d.createElement('div');
         container.id = 'locale-ranking';
         container.appendChild(renderPlayerCountryEl(totals));

         var allRow = d.createElement('div');
         allRow.className = 'locale-ranking-all-row';
         allRow.appendChild(buildPeriodRow(
            labels.common,
            buildRankingGrid(buildTopEntries(totals, LOCALE_RANKING_LIMIT), playerCountry),
            buildContribBadge(contribs.all)
         ));
         allRow.appendChild(buildPeriodRow(
            labels.daily,
            isRankingEmpty(dailyTotals) ? buildEmptyRankingMessage() : buildRankingGrid(buildTopEntries(dailyTotals, LOCALE_RANKING_LIMIT), playerCountry),
            buildContribBadge(contribs.daily)
         ));
         allRow.appendChild(buildPeriodRow(
            labels.monthly,
            isRankingEmpty(monthlyTotals) ? buildEmptyRankingMessage() : buildRankingGrid(buildTopEntries(monthlyTotals, LOCALE_RANKING_LIMIT), playerCountry),
            buildContribBadge(contribs.monthly)
         ));
         allRow.appendChild(renderLocalePickerSettingsBtn());
         container.appendChild(allRow);
         return container;
      }

      function renderPlayerCountryEl(totals) {
         var locale = getPlayerCountry();
         var el = document.createElement('div');
         el.className = 'locale-player-country';
         var score = totals && totals[locale] != null ? (parseInt(totals[locale], 10) || 0) : 0;
         el.textContent = (LOCALE_EMOJI[locale] || '🏳️') + ' ' + locale.toUpperCase() + ' ' + score;
         return el;
      }

      function renderLocalePickerSettingsBtn() {
         var btn = document.createElement('button');
         btn.type = 'button';
         btn.className = 'locale-picker-settings';
         btn.setAttribute('aria-label', getUIStrings().chooseCountry);
         btn.textContent = '⚙';
         btn.addEventListener('click', function(e) {
            e.preventDefault();
            openLocalePicker();
         });
         return btn;
      }

      function wrapRankingRow(grid) {
         var row = document.createElement('div');
         row.className = 'locale-ranking-row';
         row.appendChild(grid);
         row.appendChild(renderLocalePickerSettingsBtn());
         return row;
      }

      function applyUIStrings() {
         var s = getUIStrings();
         var set = function(sel, text) {
            var el = document.querySelector(sel);
            if (el) el.textContent = text;
         };
         set('#play', s.play);
         set('#pause', s.pause);
         set('#score .timer label', s.timer);
         set('#score .move-count label', s.moves);
         set('#score .score label', s.score);
         set('#new-game', s.newGame);

         var ranking = document.querySelector('#locale-ranking');
         if (!ranking) return;
         var labels = getRankingLabels();
         var labelEls = ranking.querySelectorAll('.locale-ranking-label');
         var texts = [labels.common, labels.daily, labels.monthly];
         for (var i = 0; i < labelEls.length && i < texts.length; i++) {
            labelEls[i].textContent = texts[i];
         }
         var emptyMsg = getEmptyRankingMessage();
         var emptyEls = ranking.querySelectorAll('.locale-ranking-empty');
         for (var j = 0; j < emptyEls.length; j++) {
            emptyEls[j].textContent = emptyMsg;
         }
         var settings = ranking.querySelector('.locale-picker-settings');
         if (settings) settings.setAttribute('aria-label', s.chooseCountry);
      }

      function refreshPlayerCountryUI() {
         applyUIStrings();
         var ranking = document.querySelector('#locale-ranking');
         if (!ranking) return;
         var badge = ranking.querySelector('.locale-player-country');
         var next = renderPlayerCountryEl(localeTotals);
         if (badge && badge.parentNode) {
            badge.parentNode.replaceChild(next, badge);
         } else {
            ranking.insertBefore(next, ranking.firstChild);
         }
         var current = getPlayerCountry();
         var items = ranking.querySelectorAll('.locale-ranking-item');
         for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.classList.contains('is-placeholder')) continue;
            if (item.dataset.locale === current) {
               item.classList.add('is-current');
            } else {
               item.classList.remove('is-current');
            }
         }
      }

      function hasChosenCountry() {
         try {
            var saved = localStorage.getItem(PLAYER_COUNTRY_KEY);
            return !!(saved && SUPPORTED_LOCALES.indexOf(saved) >= 0);
         } catch (e) {
            return true;
         }
      }

      function maybePromptCountryAfterWin() {
         if (hasChosenCountry()) return;
         setTimeout(function() {
            openLocalePicker();
         }, 1200);
      }

      function closeLocalePicker() {
         var existing = document.querySelector('#locale-picker');
         if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
      }

      function openLocalePicker() {
         if (document.querySelector('#locale-picker')) return;
         var current = getPlayerCountry();
         var overlay = document.createElement('div');
         overlay.id = 'locale-picker';
         var panel = document.createElement('div');
         panel.className = 'locale-picker-panel';
         panel.addEventListener('click', function(e) {
            e.stopPropagation();
         });
         SUPPORTED_LOCALES.forEach(function(locale) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'locale-picker-item';
            if (locale === current) btn.className += ' is-current';
            btn.setAttribute('aria-label', locale.toUpperCase());
            btn.textContent = LOCALE_EMOJI[locale] || '🏳️';
            btn.addEventListener('click', function() {
               setPlayerCountry(locale);
               closeLocalePicker();
               refreshPlayerCountryUI();
               if (window.solitaireAnalytics && window.solitaireAnalytics.trackCountrySelected) {
                  window.solitaireAnalytics.trackCountrySelected(locale);
               }
            });
            panel.appendChild(btn);
         });
         overlay.appendChild(panel);
         overlay.addEventListener('click', function() {
            closeLocalePicker();
            if (window.solitaireAnalytics && window.solitaireAnalytics.trackCountryDismissed) {
               window.solitaireAnalytics.trackCountryDismissed();
            }
         });
         document.body.appendChild(overlay);
      }

      function renderLocaleRanking() {
         if (!SHEETS_ENDPOINT_URL) return;
         var scoreBlock = d.querySelector('#score');
         var labels = getRankingLabels();
         if (scoreBlock && scoreBlock.parentNode) {
            var existing = d.querySelector('#locale-ranking');
            if (!existing) {
               var loadingContainer = d.createElement('div');
               loadingContainer.id = 'locale-ranking';
               loadingContainer.className = 'is-loading';
               loadingContainer.appendChild(renderPlayerCountryEl(null));
               var loadingAllRow = d.createElement('div');
               loadingAllRow.className = 'locale-ranking-all-row';
               loadingAllRow.appendChild(buildPeriodRow(labels.common, buildLoadingGrid()));
               loadingAllRow.appendChild(buildPeriodRow(labels.daily, buildLoadingGrid()));
               loadingAllRow.appendChild(buildPeriodRow(labels.monthly, buildLoadingGrid()));
               loadingContainer.appendChild(loadingAllRow);
               scoreBlock.parentNode.insertBefore(loadingContainer, scoreBlock);
            }
         }
         fetchRankingPayload()
            .then(function(payload) {
               if (!payload || !payload.ok || !payload.totals) return;
               localeTotals = payload.totals;
               localeDailyTotals = payload.dailyTotals || {};
               localeMonthlyTotals = payload.monthlyTotals || {};
               saveCachedRankingPayload(payload);
               var container = renderRankingContainer(localeTotals, localeDailyTotals, localeMonthlyTotals);
               replaceRankingContainer(container, scoreBlock);
            })
            .catch(function(error) {
               var cached = loadCachedRankingPayload();
               if (cached) {
                  localeTotals = cached.totals;
                  localeDailyTotals = cached.dailyTotals || {};
                  localeMonthlyTotals = cached.monthlyTotals || {};
                  replaceRankingContainer(renderRankingContainer(localeTotals, localeDailyTotals, localeMonthlyTotals), scoreBlock);
               } else {
                  replaceRankingContainer(null, scoreBlock);
               }
               console.warn('Ranking load failed', error);
            });
      }

      function scheduleLocaleRankingRender() {
         var run = function() {
            renderLocaleRanking();
         };
         if (window.requestIdleCallback) {
            window.requestIdleCallback(run, { timeout: 1500 });
         } else {
            setTimeout(run, 0);
         }
      }

      // document
      var d = document;
      var cardTemplateCache = Object.create(null);
      var cardTemplateRoot = d.querySelector('#card-templates');
      var layoutRafId = null;
      var cardElCache = Object.create(null);
      var cardCacheInitialized = false;
      var FACE_RANK_NAMES = { J: 'jack', Q: 'queen', K: 'king' };
      var ALL_FACE_SUITS = ['spade', 'heart', 'diamond', 'club'];
      var ALL_FACE_NAMES = ['jack', 'queen', 'king'];
      var dealRenderGen = 0;

      // build deck
      var deck = [];

      // build suits
      var suits = [];
      suits['spades'] = [
         // spades
         ['A','spade'],
         ['2','spade'],
         ['3','spade'],
         ['4','spade'],
         ['5','spade'],
         ['6','spade'],
         ['7','spade'],
         ['8','spade'],
         ['9','spade'],
         ['10','spade'],
         ['J','spade'],
         ['Q','spade'],
         ['K','spade']
      ];
      suits['hearts'] = [
         // hearts
         ['A','heart'],
         ['2','heart'],
         ['3','heart'],
         ['4','heart'],
         ['5','heart'],
         ['6','heart'],
         ['7','heart'],
         ['8','heart'],
         ['9','heart'],
         ['10','heart'],
         ['J','heart'],
         ['Q','heart'],
         ['K','heart']
      ];
      suits['diamonds'] = [
         // diamonds
         ['A','diamond'],
         ['2','diamond'],
         ['3','diamond'],
         ['4','diamond'],
         ['5','diamond'],
         ['6','diamond'],
         ['7','diamond'],
         ['8','diamond'],
         ['9','diamond'],
         ['10','diamond'],
         ['J','diamond'],
         ['Q','diamond'],
         ['K','diamond']
      ];
      suits['clubs'] = [
         // clubs
         ['A','club'],
         ['2','club'],
         ['3','club'],
         ['4','club'],
         ['5','club'],
         ['6','club'],
         ['7','club'],
         ['8','club'],
         ['9','club'],
         ['10','club'],
         ['J','club'],
         ['Q','club'],
         ['K','club']
      ];

      // build stock pile
      var s = [];

      // build waste pile
      var w = [];

      // build foundations
      var spades = [];
      var hearts = [];
      var diamonds = [];
      var clubs = [];

      // build tableau
      var t = [];
      t[1] = t[2] = t[3] = t[4] = t[5] = t[6] = t[7] = [];

      // build table
      var table = [];
      table['stock'] = s;
      table['waste'] = w;
      table['spades'] = spades;
      table['hearts'] = hearts;
      table['diamonds'] = diamonds;
      table['clubs'] = clubs;
      table['tab'] = t;

      // initial face up cards
      var initialPlayedCards =
      '#waste .card,' +
      '#fnd .card,' +
      '#tab .card:last-child';
      var playedCards = initialPlayedCards;

      // cache selectors
      var $timer = d.querySelector('#score .timer');
      var $timerSpan = d.querySelector('#score .timer span');
      var $moveCount = d.querySelector('#score .move-count');
      var $moveCountSpan = d.querySelector('#score .move-count span');
      var $score = d.querySelector('#score .score');
      var $scoreSpan = d.querySelector('#score .score span');
      var $newGameButton = d.querySelector('#new-game');
      var $playPause = d.querySelector('#play-pause');
      var $table = d.querySelector('#table');
      var $upper = d.querySelector('#table .upper-row');
      var $lower = d.querySelector('#table .lower-row');
      var $stock = d.querySelector('#stock');
      var $waste = d.querySelector('#waste');
      var $fnd = d.querySelector('#fnd');
      var $tab = d.querySelector('#tab');
      var $autoWin = d.querySelector('#auto-win');

      if ($newGameButton) {
         $newGameButton.addEventListener('click', function(event) {
            event.preventDefault();
            startNewGame();
         });
      }

      // other global vars
      var clock = 0;
      var time = 0;
      var moves = 0;
      var score = 0;
      var lastEventTime = 0;
      var scoreSubmitted = false;
      var suppressClickUntil = 0;
      var unplayedTabCards = [];

      function onGameWon() {
         maybePromptCountryAfterWin();
      }

      // Scoring: Standard Klondike rules (minimum score is 0)
      var SCORE = {
         WASTE_TO_TABLEAU: 5,
         WASTE_TO_FOUNDATION: 10,
         TABLEAU_TO_FOUNDATION: 10,
         TURNOVER_TABLEAU: 5,
         FOUNDATION_TO_TABLEAU: -15,
         TIME_PENALTY_PER_10SEC: -2
      };

   // 1. CREATE DECK
      deck = create(deck, suits);

   // 2. SHUFFLE DECK
      var debugDeal = false;
      if (window.location && window.location.search) {
         var params = new URLSearchParams(window.location.search);
         debugDeal = params.get('debug') === '1';
      }

      deck = debugDeal ? buildDebugDeck(suits) : shuffle(deck);

   // 3. DEAL DECK
      table = debugDeal ? debugDealStockOnly(deck, table) : deal(deck, table);

      // Отслеживание начала новой игры
      if (window.solitaireAnalytics) {
         window.solitaireAnalytics.trackGameStart('klondike');
      }

      // 4–5. RENDER TABLE (7 tops first) THEN START GAMEPLAY
      scheduleLocaleRankingRender();
      applyUIStrings();
      startDeferredDealRender(table, playedCards, false, function() {
         play(table);
         setupClickDelegation();
         setupPointerDnD();
      });

   // ### EVENT HANDLERS ###
      function scheduleLayoutReflow() {
         if (layoutRafId !== null && window.cancelAnimationFrame) {
            window.cancelAnimationFrame(layoutRafId);
         }
         if (window.requestAnimationFrame) {
            layoutRafId = window.requestAnimationFrame(function() {
               layoutRafId = null;
               sizeCards();
               layoutTableauToViewport();
            });
         } else {
            sizeCards();
            layoutTableauToViewport();
         }
      }

      window.onresize = function(event) {
         scheduleLayoutReflow();
      };
      if (window.visualViewport && window.visualViewport.addEventListener) {
         window.visualViewport.addEventListener('resize', function() {
            scheduleLayoutReflow();
         });
      }

   // ### FUNCTIONS ###

      // create deck
         function create(deck, suits) {
            // console.log('Creating Deck...');
            // loop through each suit
            for (var suit in suits) {
               suit = suits[suit];
               // loop through each card in suit
               for (var card in suit) {
                  card = suit[card];
                  deck.push(card); // push card to deck
               }
            }
            return deck;
         }

      // shuffle deck
         function shuffle(deck) {
            // console.log('Shuffling Deck...');
            // declare vars
            var i = deck.length, temp, rand;
            // while there remain elements to shuffle
            while (0 !== i) {
               // pick a remaining element
               rand = Math.floor(Math.random() * i);
               i--;
               // and swap it with the current element
               temp = deck[i];
               deck[i] = deck[rand];
               deck[rand] = temp;
            }
            return deck;
         }

      // build deterministic deck for debug mode
         function buildDebugDeck(suits) {
            var debugDeck = [];
            var order = ['spades', 'hearts', 'diamonds', 'clubs'];
            for (var i = 0; i < order.length; i++) {
               var suit = suits[order[i]];
               for (var card in suit) {
                  if (suit.hasOwnProperty(card)) {
                     debugDeck.push(suit[card]);
                  }
               }
            }
            return debugDeck;
         }

      // deal in debug mode: one move to win
         function debugDealStockOnly(deck, table) {
            var tabs = table['tab'];
            for (var pile = 1; pile <= 7; pile++) {
               tabs[pile] = [];
            }

            table['waste'] = [];
            table['spades'] = suits['spades'].slice();
            table['hearts'] = suits['hearts'].slice();
            table['diamonds'] = suits['diamonds'].slice();
            table['clubs'] = suits['clubs'].slice(0, 11);
            table['stock'] = [ ['Q','club'], ['K','club'] ];

            return table;
         }

      // deal deck
         function deal(deck, table) {
            // console.log('Dealing Deck...');
            // move all cards to stock
            table['stock'] = deck;
            // build tableau
               var tabs = table['tab'];
               // loop through 7 tableau rows
               for (var row = 1; row <= 7; row++) {
                  // loop through 7 piles in row
                  for (var pile = row; pile <= 7; pile++) {
                     // build blank pile on first row
                     if (row === 1) tabs[pile] = [];
                     // deal card to pile
                     move(table['stock'], tabs[pile], false);
                  }
               }
            return table;
         }

      // move card
         function move(source, dest, pop, selectedCards = 1) {
            if (pop !== true) {
               var card = source.shift(); // take card from bottom
               if (isValidCardTuple(card)) {
                  dest.push(card); // push card to destination pile
               }
            } else {
               var count = parseInt(selectedCards, 10);
               if (!isFinite(count) || count < 1) count = 1;
               if (count > source.length) count = source.length;
               if (count < 1) return false;

               // keep order of moved stack
               var start = source.length - count;
               var moved = source.splice(start, count);
               for (var i = 0; i < moved.length; i++) {
                  var movedCard = moved[i];
                  if (isValidCardTuple(movedCard)) {
                     dest.push(movedCard);
                  }
               }
            }
            return;
         }

         function isValidCardTuple(card) {
            return !!(
               card &&
               card.constructor === Array &&
               card.length >= 2 &&
               typeof card[0] !== 'undefined' &&
               typeof card[1] !== 'undefined'
            );
         }

      // asset paths relative to solitier.css (root or ../ from locales)
         function imgBase() {
            var link = d.querySelector('link[href*="solitier.css"]');
            if (link) {
               var href = link.getAttribute('href') || '';
               return href.replace(/solitier\.css.*$/, 'img/');
            }
            return 'img/';
         }

         function faceUrl(rank, suit) {
            var name = FACE_RANK_NAMES[rank];
            if (!name || !suit) return null;
            return imgBase() + 'face-' + name + '-' + suit + '.png';
         }

         function allFaceUrls() {
            var base = imgBase();
            var urls = [];
            for (var r = 0; r < ALL_FACE_NAMES.length; r++) {
               for (var s = 0; s < ALL_FACE_SUITS.length; s++) {
                  urls.push(base + 'face-' + ALL_FACE_NAMES[r] + '-' + ALL_FACE_SUITS[s] + '.png');
               }
            }
            return urls;
         }

         function preloadImages(urls, done) {
            var unique = [];
            var seen = Object.create(null);
            for (var i = 0; i < urls.length; i++) {
               var u = urls[i];
               if (!u || seen[u]) continue;
               seen[u] = true;
               unique.push(u);
            }
            var left = unique.length;
            if (!left) {
               if (done) done();
               return;
            }
            for (var j = 0; j < unique.length; j++) {
               var img = new Image();
               img.onload = img.onerror = function() {
                  left--;
                  if (left === 0 && done) done();
               };
               img.src = unique[j];
            }
         }

         function getTableauTops(tableState) {
            var tops = [];
            var tabs = tableState['tab'];
            for (var i = 1; i <= 7; i++) {
               var pile = tabs[i];
               if (pile && pile.length) tops.push(pile[pile.length - 1]);
            }
            return tops;
         }

         function faceUrlsForCards(cards) {
            var urls = [imgBase() + 'card_face_bg_new.jpg'];
            for (var i = 0; i < cards.length; i++) {
               var u = faceUrl(cards[i][0], cards[i][1]);
               if (u) urls.push(u);
            }
            return urls;
         }

         function clearBoardPiles(played) {
            if (!played) played = initialPlayedCards;
            update([], '#stock ul', played, true);
            update([], '#waste ul', played);
            update([], '#spades ul', played);
            update([], '#hearts ul', played);
            update([], '#diamonds ul', played);
            update([], '#clubs ul', played);
            for (var i = 1; i <= 7; i++) {
               update([], tableauPileUlSelector(i), played, true);
            }
            // nodes destroyed — drop cache
            cardElCache = Object.create(null);
            cardCacheInitialized = false;
         }

         // phase 1: only the 7 face-up tableau tops (board already cleared by caller)
         function renderTableauTopsOnly(tableState, played) {
            if (!played) played = initialPlayedCards;

            var tabs = tableState['tab'];
            for (var i = 1; i <= 7; i++) {
               var pile = tabs[i];
               var tops = (pile && pile.length) ? [pile[pile.length - 1]] : [];
               update(tops, tableauPileUlSelector(i), played, true);
            }

            flipCards(initialPlayedCards, 'up');
            unplayedTabCards = getUnplayedTabCards();

            sizeCards();
            layoutTableauToViewport();
            $table.style.opacity = '100';

            // ponytail: self-check phase1 — open tops only
            var expected = getTableauTops(tableState).length;
            var upCount = d.querySelectorAll('#tab .card.up').length;
            console.assert(upCount === expected, 'phase1 expected ' + expected + ' up cards, got ' + upCount);
         }

         // phase 2: create missing cards, sync piles without wiping phase-1 tops
         function ensureRemainingCardsThenSync(tableState) {
            ensureCardCacheInitialized();

            function ensurePileCards(pileArray, pileName, pileEl, append) {
               if (!pileArray || !pileArray.length) return;
               for (var i = 0; i < pileArray.length; i++) {
                  var card = pileArray[i];
                  if (!isValidCardTuple(card)) continue;
                  var key = cardKey(card);
                  var el = cardElCache[key];
                  if (el && el.nodeType === 1) continue;
                  createCard(card, pileEl, pileName, getTemplate(card), append);
               }
            }

            var stockUl = d.querySelector('#stock ul');
            var wasteUl = d.querySelector('#waste ul');
            var spadesUl = d.querySelector('#spades ul');
            var heartsUl = d.querySelector('#hearts ul');
            var diamondsUl = d.querySelector('#diamonds ul');
            var clubsUl = d.querySelector('#clubs ul');

            ensurePileCards(tableState['stock'], 'stock', stockUl, true);
            ensurePileCards(tableState['waste'], 'waste', wasteUl, false);
            ensurePileCards(tableState['spades'], 'spades', spadesUl, false);
            ensurePileCards(tableState['hearts'], 'hearts', heartsUl, false);
            ensurePileCards(tableState['diamonds'], 'diamonds', diamondsUl, false);
            ensurePileCards(tableState['clubs'], 'clubs', clubsUl, false);

            var tabs = tableState['tab'];
            for (var t = 1; t <= 7; t++) {
               var tabPile = tableauPileEl(t);
               var tabUl = tabPile ? tabPile.querySelector('ul') : null;
               ensurePileCards(tabs[t], 'tab', tabUl, true);
            }

            syncPileDomFromTable('stock', tableState['stock']);
            syncPileDomFromTable('waste', tableState['waste']);
            syncPileDomFromTable('spades', tableState['spades']);
            syncPileDomFromTable('hearts', tableState['hearts']);
            syncPileDomFromTable('diamonds', tableState['diamonds']);
            syncPileDomFromTable('clubs', tableState['clubs']);
            for (var n = 1; n <= 7; n++) {
               syncTableauPileDomFromTable(n, tabs[n]);
            }

            emptyPiles = checkForEmptyPiles(tableState);
            flipCards(initialPlayedCards, 'up');
            unplayedTabCards = getUnplayedTabCards();
            recomputeSectionCounts();

            sizeCards();
            layoutTableauToViewport();
            $table.style.opacity = '100';
         }

         // preload faces for tops → show tops → warm all faces → full render → onReady
         function startDeferredDealRender(tableState, played, preservePlayedState, onReady) {
            var gen = ++dealRenderGen;
            var tops = getTableauTops(tableState);

            // drop stale board immediately so New Game never shows previous deal
            clearBoardPiles(played);
            $table.style.opacity = '0';
            $table.style.pointerEvents = 'none';

            preloadImages(faceUrlsForCards(tops), function() {
               if (gen !== dealRenderGen) return;

               renderTableauTopsOnly(tableState, played);

               // ponytail: warm cache; safe without gen check
               var warm = function() { preloadImages(allFaceUrls()); };
               if (window.requestIdleCallback) {
                  window.requestIdleCallback(warm, { timeout: 2000 });
               } else {
                  setTimeout(warm, 0);
               }

               var finish = function() {
                  if (gen !== dealRenderGen) return;
                  ensureRemainingCardsThenSync(tableState);
                  // ponytail: self-check phase2 — full deck in DOM
                  var total = d.querySelectorAll('#table .card').length;
                  console.assert(total === 52, 'phase2 expected 52 cards, got ' + total);
                  $table.style.pointerEvents = '';
                  if (onReady) onReady();
               };

               if (window.requestAnimationFrame) {
                  window.requestAnimationFrame(function() {
                     window.requestAnimationFrame(finish);
                  });
               } else {
                  setTimeout(finish, 0);
               }
            });
         }

      // render table
         function render(table, playedCards, preservePlayedState) {
            // console.log('Rendering Table...');
            if (!playedCards) {
               playedCards = initialPlayedCards;
            }

            // DOM nodes are recreated — drop stale element cache
            cardElCache = Object.create(null);
            cardCacheInitialized = false;

            // preserve already-open cards only when re-rendering current game state
            if (preservePlayedState !== false) {
               playedCards = checkForPlayedCards(playedCards);
            }

            // check for empty piles
            emptyPiles = checkForEmptyPiles(table);

            // update stock pile
            update(table['stock'], '#stock ul', playedCards, true);
            // update waste pile
            update(table['waste'], '#waste ul', playedCards);
            // update spades pile
            update(table['spades'], '#spades ul', playedCards);
            // update hearts pile
            update(table['hearts'], '#hearts ul', playedCards);
            // update diamonds pile
            update(table['diamonds'], '#diamonds ul', playedCards);
            // update clubs pile
            update(table['clubs'], '#clubs ul', playedCards);
            // update tableau
            var tabs = table['tab'];
            // loop through tableau piles
            for (var i = 1; i <= 7; i++) {
               // update tableau pile
               update(tabs[i], tableauPileUlSelector(i), playedCards, true);
            }

            // turn cards face up (do once per render, not per pile)
            flipCards(playedCards, 'up');

            // get unplayed tab cards
            unplayedTabCards = getUnplayedTabCards();

            var finalizeRender = function() {
               sizeCards();
               layoutTableauToViewport();
               $table.style.opacity = '100';
            };
            if (window.requestAnimationFrame) {
               window.requestAnimationFrame(finalizeRender);
            } else {
               finalizeRender();
            }

            // console.log('Table Rendered:', table);

            return;
         }

      // partial render: reorder existing card nodes for dirty piles only
         function renderPartial(table, playedCards, dirtyPiles, preservePlayedState) {
            if (!dirtyPiles || dirtyPiles.length === 0) {
               return render(table, playedCards, preservePlayedState);
            }

            if (!playedCards) playedCards = initialPlayedCards;

            // update empty markers (needed for UI state)
            emptyPiles = checkForEmptyPiles(table);

            var touchesTableau = false;

            for (var i = 0; i < dirtyPiles.length; i++) {
               var key = dirtyPiles[i];

               if (key === 'stock') syncPileDomFromTable('stock', table['stock']);
               else if (key === 'waste') syncPileDomFromTable('waste', table['waste']);
               else if (key === 'spades') syncPileDomFromTable('spades', table['spades']);
               else if (key === 'hearts') syncPileDomFromTable('hearts', table['hearts']);
               else if (key === 'diamonds') syncPileDomFromTable('diamonds', table['diamonds']);
               else if (key === 'clubs') syncPileDomFromTable('clubs', table['clubs']);
               else if (key && key.indexOf('tab:') === 0) {
                  var n = parseInt(key.split(':')[1], 10);
                  if (!isNaN(n) && n >= 1 && n <= 7) {
                     syncTableauPileDomFromTable(n, table['tab'][n]);
                     touchesTableau = true;
                  }
               }
            }

            // sync keeps .up; only open new tops / waste / fnd
            flipCards(initialPlayedCards, 'up');

            // keep aggregate counts consistent (auto-win relies on these)
            recomputeSectionCounts();

            // refresh cache of unplayed tableau cards for next turnover scoring
            unplayedTabCards = getUnplayedTabCards();

            // ponytail: self-check — sync must not drop nodes
            console.assert(
               d.querySelectorAll('#table .card').length === 52,
               'renderPartial expected 52 cards'
            );

            if (touchesTableau) layoutTableauToViewport();
            return;
         }

         function ensureCardCacheInitialized() {
            if (cardCacheInitialized) return;
            var els = d.querySelectorAll('.card');
            for (var i = 0; i < els.length; i++) {
               var el = els[i];
               if (!el || !el.dataset) continue;
               var r = el.dataset.rank;
               var s = el.dataset.suit;
               if (!r || !s) continue;
               cardElCache[String(r) + ':' + String(s)] = el;
            }
            cardCacheInitialized = true;
         }

         function cardKey(card) {
            return String(card[0]) + ':' + String(card[1]);
         }

         // ponytail: data-pile on direct #tab child — bare nth-child also matches card lis
         function tableauPileEl(n) {
            return d.querySelector('#tab > li[data-pile="' + n + '"]');
         }

         function tableauPileUlSelector(n) {
            return '#tab > li[data-pile="' + n + '"] ul';
         }

         function getCardElForCard(card) {
            if (!isValidCardTuple(card)) return null;
            ensureCardCacheInitialized();
            var key = cardKey(card);
            var cached = cardElCache[key];
            if (cached && cached.nodeType === 1) return cached;
            // unique in a standard deck
            var el = d.querySelector('.card[data-rank="' + card[0] + '"][data-suit="' + card[1] + '"]');
            if (el) cardElCache[key] = el;
            return el;
         }

         // cache miss after detach: recreate instead of dropping the card from the board
         function resolveCardEl(card, pileUl, pileName, append) {
            var el = getCardElForCard(card);
            if (el) return el;
            if (!pileUl || !isValidCardTuple(card)) return null;
            return createCard(card, pileUl, pileName, getTemplate(card), append);
         }

         function clearChildrenPreserveNodes(parentEl) {
            // remove all children but keep nodes alive (for fast reordering)
            while (parentEl.firstChild) {
               parentEl.removeChild(parentEl.firstChild);
            }
         }

         function sanitizePileCards(pile) {
            if (!pile || !pile.length) return;
            for (var i = pile.length - 1; i >= 0; i--) {
               if (!isValidCardTuple(pile[i])) {
                  pile.splice(i, 1);
               }
            }
         }

         function syncPileDomFromTable(pileId, pileArray) {
            ensureCardCacheInitialized();
            var pileRoot = d.querySelector('#' + pileId);
            if (!pileRoot) return;
            var ul = pileRoot.querySelector('ul');
            if (!ul) return;

            // stock + tableau used append; waste + foundations used prepend
            var appendMode = (pileId === 'stock');
            var pileNameForCards = (pileId === 'stock' || pileId === 'waste') ? pileId : pileId; // keep same

            // detach current children (preserving nodes)
            clearChildrenPreserveNodes(ul);

            if (!pileArray || pileArray.length === 0) return;

            if (appendMode) {
               for (var i = 0; i < pileArray.length; i++) {
                  var cardEl = resolveCardEl(pileArray[i], ul, pileNameForCards, true);
                  if (!cardEl) continue;
                  cardEl.dataset.pile = pileNameForCards;
                  // card may come from tableau with inline offsets
                  cardEl.style.top = '';
                  cardEl.style.left = '';
                  cardEl.classList.remove('is-drag-origin');
                  ul.appendChild(cardEl);
               }
            } else {
               // prepend mode: DOM order is reverse of array (matches createCard(... append=false))
               for (var j = 0; j < pileArray.length; j++) {
                  var cardEl2 = resolveCardEl(pileArray[j], ul, pileNameForCards, false);
                  if (!cardEl2) continue;
                  cardEl2.dataset.pile = pileNameForCards;
                  // card may come from tableau with inline offsets
                  cardEl2.style.top = '';
                  cardEl2.style.left = '';
                  cardEl2.classList.remove('is-drag-origin');
                  ul.insertBefore(cardEl2, ul.firstChild);
               }
            }
         }

         function syncTableauPileDomFromTable(pileNumber, pileArray) {
            ensureCardCacheInitialized();
            var pileEl = tableauPileEl(pileNumber);
            if (!pileEl) return;
            var ul = pileEl.querySelector('ul');
            if (!ul) return;

            clearChildrenPreserveNodes(ul);

            if (!pileArray || pileArray.length === 0) return;
            for (var i = 0; i < pileArray.length; i++) {
               var cardEl = resolveCardEl(pileArray[i], ul, 'tab', true);
               if (!cardEl) continue;
               // important for turnover scoring
               cardEl.dataset.pile = 'tab';
               // card may carry stale offsets/drag class from previous pile
               cardEl.style.top = '';
               cardEl.style.left = '';
               cardEl.classList.remove('is-drag-origin');
               ul.appendChild(cardEl);
            }
         }

         function recomputeSectionCounts() {
            if ($tab) {
               var tabCards = $tab.querySelectorAll('.card');
               $tab.dataset.played = String(countPlayedCards(tabCards));
               $tab.dataset.unplayed = String(countUnplayedCards(tabCards));
            }
            if ($fnd) {
               var fndCards = $fnd.querySelectorAll('.card');
               $fnd.dataset.played = String(countPlayedCards(fndCards));
               $fnd.dataset.unplayed = String(countUnplayedCards(fndCards));
            }
         }

         function dirtyPilesForMove(source, dest) {
            var dirty = {};
            function add(key) { if (key) dirty[key] = true; }
            function addTab(n) { if (n >= 1 && n <= 7) dirty['tab:' + n] = true; }

            // source pile
            if (source === 'stock') add('stock');
            else if (source === 'waste') add('waste');
            else if (source === 'spades' || source === 'hearts' || source === 'diamonds' || source === 'clubs') add(source);
            else {
               var sN = parseInt(source, 10);
               if (!isNaN(sN)) addTab(sN);
            }

            // destination pile
            if (dest === 'stock') add('stock');
            else if (dest === 'waste') add('waste');
            else if (dest === 'spades' || dest === 'hearts' || dest === 'diamonds' || dest === 'clubs') add(dest);
            else {
               var dN = parseInt(dest, 10);
               if (!isNaN(dN)) addTab(dN);
            }

            var out = [];
            for (var k in dirty) if (dirty.hasOwnProperty(k)) out.push(k);
            return out;
         }

      // update piles
         function update(pile, selector, playedCards, append) {
            var e = d.querySelector(selector);
            var children = e.children; // get children
            var grandParent = e.parentElement.parentElement; // get grand parent
            var pileKey = getPileKeyFromSelector(selector);
            // reset pile
            e.innerHTML = '';
            // loop through cards in pile
            for (var card in pile) {
               card = pile[card];
               // get html template for card
               var html = getTemplate(card);
               // create card in pile
               createCard(card, e, pileKey, html, append);
            }
            // count played cards
            var played = countPlayedCards(children);
            e.parentElement.dataset.played = played;
            // count all played cards for #tab and #fnd piles
            if ( grandParent.id === 'tab' || grandParent.id === 'fnd' ) {
               var playedAll = parseInt(grandParent.dataset.played);
               if ( isNaN(playedAll) ) playedAll = 0;
               grandParent.dataset.played = playedAll + played;
            }
            // count unplayed cards
            var unplayed = countUnplayedCards(children);
            e.parentElement.dataset.unplayed = unplayed;
            // count all unplayed cards for #tab and #fnd piles
            if ( grandParent.id === 'tab' || grandParent.id === 'fnd' ) {
               var unplayedAll = parseInt(grandParent.dataset.unplayed);
               if ( isNaN(unplayedAll) ) unplayedAll = 0;
               grandParent.dataset.unplayed = unplayedAll + unplayed;
            }
            return pile;
         }

         function getPileKeyFromSelector(selector) {
            if (selector.indexOf('#stock') >= 0) return 'stock';
            if (selector.indexOf('#waste') >= 0) return 'waste';
            if (selector.indexOf('#spades') >= 0) return 'spades';
            if (selector.indexOf('#hearts') >= 0) return 'hearts';
            if (selector.indexOf('#diamonds') >= 0) return 'diamonds';
            if (selector.indexOf('#clubs') >= 0) return 'clubs';
            if (selector.indexOf('#tab') >= 0) return 'tab';
            return '';
         }

      // get html template for card
         function getTemplate(card) {
            var r = card[0]; // get rank
            var s = card[1]; // get suit
            var html = cardTemplateCache[r];
            if (!html) {
               var queryRoot = (cardTemplateRoot && cardTemplateRoot.content) ? cardTemplateRoot.content : d;
               var templateNode = queryRoot.querySelector('.template li[data-rank="'+r+'"]');
               html = templateNode ? templateNode.innerHTML : '';
               cardTemplateCache[r] = html;
            }
            // search and replace suit variable
            html = html.replace('{{suit}}', s);
            return html;
         }

      // create card in pile
         function createCard(card, pileEl, pileName, html, append) {
            var r = card[0]; // get rank
            var s = card[1]; // get suit
            var e = d.createElement('li'); // create li element
            e.className = 'card'; // add .card class to element
            e.dataset.rank = r; // set rank atribute
            e.dataset.suit = s; // set suit attribute
            e.dataset.pile = pileName; // set pile attribute;
            e.dataset.selected = 'false'; // set selected attribute

            e.innerHTML = html; // insert html to element
            cardElCache[String(r) + ':' + String(s)] = e;
            // append to pile
            if (append) pileEl.appendChild(e);
            // or prepend to pile
            else pileEl.insertBefore(e, pileEl.firstChild);
            return e;
         }

      // check for played cards
         function checkForPlayedCards(playedCards) {
            // query
            var els = d.querySelectorAll('.card[data-played="true"]');
            for (var e in els) { // loop through elements
               e = els[e];
               if (e.nodeType) {
                  var r = e.dataset.rank;
                  var s = e.dataset.suit;
                  playedCards += ', .card[data-rank="'+r+'"][data-suit="'+s+'"]' ;
               }
            }
            return playedCards;
         }

      // check for empty piles
         function checkForEmptyPiles(table) {
            // reset empty data on all piles
            var els = d.querySelectorAll('.pile'); // query elements
            for (var e in els) { // loop through elements
               e = els[e];
               if (e.nodeType) {
                  delete e.dataset.empty;
               }
            }
            // declare var with fake pile so we always have one
            var emptyPiles = '#fake.pile';
            // check spades pile
            if ( table['spades'].length === 0 ) {
               emptyPiles += ', #fnd #spades.pile';
            }
            // check hearts pile
            if ( table['hearts'].length === 0 ) {
               emptyPiles += ', #fnd #hearts.pile';
            }
            // check diamonds pile
            if ( table['diamonds'].length === 0 ) {
               emptyPiles += ', #fnd #diamonds.pile';
            }
            // check clubs pile
            if ( table['clubs'].length === 0 ) {
               emptyPiles += ', #fnd #clubs.pile';
            }
            // check tableau piles
            var tabs = table['tab'];
               // loop through tableau piles
               for (var i = 1; i <= 7; i++) {
                  // check tabeau pile
                  if ( tabs[i].length === 0 ) {
                     emptyPiles += ', #tab > li[data-pile="' + i + '"]';
                  }
               }
            // mark piles as empty
            els = d.querySelectorAll(emptyPiles); // query elements
            for (var e in els) { // loop through elements
               e = els[e];
               if (e.nodeType) {
                  e.dataset.empty = 'true'; // mark as empty
               }
            }
            return emptyPiles;
         }

      // count played cards
         function countPlayedCards(cards) {
            var played = 0;
               // loop through cards
               for (var card in cards) {
                  card = cards[card];
                  if (card.nodeType) {
                     // check if card has been played
                     if (card.dataset.played === 'true') played++;
                  }
               }
            return played;
         }

      // count unplayed cards
         function countUnplayedCards(cards) {
            var unplayed = 0;
               // loop through cards
               for (var card in cards) {
                  card = cards[card];
                  if (card.nodeType) {
                     // check if card has been played
                     if (card.dataset.played !== 'true') unplayed++;
                  }
               }
            return unplayed;
         }

      // flip cards
         function flipCards(selectors, direction) {
            var els = d.querySelectorAll(selectors); // query all elements
            for (var e in els) { // loop through elements
               e = els[e];
               if (e.nodeType) {
                  switch(direction) {
                     case 'up' :
                        if (e.dataset.played !== 'true') {
                           // if flipping over tableau card
                           if (e.dataset.pile === 'tab') {
                              // loop through unplayed cards
                              for (var card in unplayedTabCards) {
                                 card = unplayedTabCards[card];
                                 // if rank and suit matches
                                 if (  e.dataset.rank === card[0] &&
                                       e.dataset.suit === card[1] )
                                 addScore(SCORE.TURNOVER_TABLEAU);
                              }
                           }
                           e.className += ' up'; // add class
                           e.dataset.played = 'true'; // mark as played
                        }
                        break;
                     case 'down' :
                        e.className = 'card'; // reset class
                        delete e.dataset.played; // reset played data attribute
                     default : break;
                  }
               }
            }
            return;
         }

      // get face down cards in tableau pile
         function getUnplayedTabCards() {
            // reset array
            unplayedTabCards = [];
            // get all face down card elements
            var els = d.querySelectorAll('#tab .card:not([data-played="true"])');
            for (var e in els) { // loop through elements
               e = els[e];
               if (e.nodeType) {
                  unplayedTabCards.push( [ e.dataset.rank, e.dataset.suit ] );
               }
            }
            return unplayedTabCards;
         }

      // size cards
         function sizeCards(selector = '.pile', ratio = 1.4) {
            var s = selector;
            var r = ratio;
            var e = d.querySelector(s); // query element
            var h = e.offsetWidth * r; // get height of element
            // set row heights
            $upper.style.height = h + 10 + 'px';
            $lower.style.height = h + 120 + 'px';
            // set height of elements
            var els = d.querySelectorAll(s); // query all elements
            for (var e in els) { // loop through elements
               e = els[e];
               if (e.nodeType) e.style.height = h + 'px'; // set height in css
            }
         }

      // ensure tableau piles always fit viewport by compressing vertical offsets
         function layoutTableauToViewport() {
            if (!$lower) return;

            var piles = d.querySelectorAll('#tab > li.pile');
            if (!piles || piles.length === 0) return;

            var sampleCard = d.querySelector('#tab .card');
            if (!sampleCard) return;

            var cardRect = sampleCard.getBoundingClientRect();
            var cardHeight = cardRect.height || sampleCard.offsetHeight;
            if (!cardHeight) return;

            // available vertical space for tableau cards
            var lowerRect = $lower.getBoundingClientRect();
            var safeTop = 8;   // keep a little breathing room
            var safeBottom = 12;
            var viewportHeight = (window.visualViewport && window.visualViewport.height) ? window.visualViewport.height : window.innerHeight;
            var available = viewportHeight - lowerRect.top - safeBottom;
            if (!available || available <= 0) return;

            // defaults roughly match previous CSS feel
            var defaultUpStep = Math.round(cardHeight * 0.32);
            if (!isFinite(defaultUpStep) || defaultUpStep < 2) defaultUpStep = 2;

            function computePileHeight(cards, upStep) {
               var downStep = Math.round(upStep * 0.55);
               if (!isFinite(downStep) || downStep < 1) downStep = 1;
               if (downStep > upStep) downStep = upStep;

               var offset = 0;
               for (var c = 0; c < cards.length; c++) {
                  var card = cards[c];
                  var isPlayed = card.dataset && card.dataset.played === 'true';
                  offset += isPlayed ? upStep : downStep;
               }
               return cardHeight + offset;
            }

            function applyCompressedOffsets(cards, upStep) {
               var downStep = Math.round(upStep * 0.55);
               if (!isFinite(downStep) || downStep < 1) downStep = 1;
               if (downStep > upStep) downStep = upStep;

               var offset = 0;
               for (var c = 0; c < cards.length; c++) {
                  var card = cards[c];
                  card.style.left = '0px';
                  card.style.top = offset + 'px';
                  var isPlayed = card.dataset && card.dataset.played === 'true';
                  offset += isPlayed ? upStep : downStep;
               }
            }

            // apply per pile:
            // - all piles get same base spacing (visually "even")
            // - only overflowing pile(s) get compressed step
            for (var p = 0; p < piles.length; p++) {
               var cardsUl = piles[p].querySelector('ul');
               var cards = cardsUl ? cardsUl.querySelectorAll('li.card') : [];

               if (!cards || cards.length === 0) continue;

               var neededAtDefault = computePileHeight(cards, defaultUpStep);
               if (neededAtDefault <= (available - safeTop)) {
                  // keep a unified baseline spacing for non-overflow piles
                  applyCompressedOffsets(cards, defaultUpStep);
                  continue;
               }

               // shrink step for THIS pile only until it fits
               var upStep = defaultUpStep;
               while (upStep > 2 && computePileHeight(cards, upStep) > (available - safeTop)) {
                  upStep--;
               }
               if (!isFinite(upStep) || upStep < 2) upStep = 2;

               applyCompressedOffsets(cards, upStep);
            }
         }

      // gameplay
         function play(table) {
            // check for winning table
            if ( checkForWin(table) ) return;
            // check for autowin
            checkForAutoWin(table);
            // console.log('Make Your Move...');
            // console.log('......');
         }

         function setupClickDelegation() {
            if (!$table || $table.dataset.clickDelegationInitialized === 'true') return;
            $table.dataset.clickDelegationInitialized = 'true';

            function isFirstCardInPile(pileId, cardEl) {
               var pileEl = cardEl && cardEl.closest ? cardEl.closest('.pile') : null;
               if (!pileEl || !pileEl.dataset || pileEl.dataset.pile !== pileId) return false;
               var first = pileEl.querySelector('ul .card:first-child');
               return first === cardEl;
            }

            function isLastCardInTableau(cardEl) {
               var pileEl = cardEl && cardEl.closest ? cardEl.closest('.pile') : null;
               if (!pileEl || !pileEl.dataset) return false;
               var pileId = pileEl.dataset.pile;
               var n = parseInt(pileId, 10);
               if (isNaN(n) || n < 1 || n > 7) return false;
               var last = pileEl.querySelector('ul .card:last-child');
               return last === cardEl;
            }

            function shouldForwardToSelect(eventType, targetEl) {
               if (!targetEl) return false;

               // stock reload icon
               if (targetEl.classList && targetEl.classList.contains('reload-icon')) {
                  var stock = targetEl.closest ? targetEl.closest('#stock') : null;
                  return !!stock && eventType === 'click';
               }

               // cards
               if (!(targetEl.classList && targetEl.classList.contains('card'))) return false;
               var pileEl = targetEl.closest('.pile');
               var pileId = pileEl && pileEl.dataset ? pileEl.dataset.pile : null;

               if (eventType === 'click') {
                  if (pileId === 'stock') return isFirstCardInPile('stock', targetEl);
                  if (pileId === 'waste') return isFirstCardInPile('waste', targetEl);
                  if (pileId === 'spades' || pileId === 'hearts' || pileId === 'diamonds' || pileId === 'clubs') {
                     return isFirstCardInPile(pileId, targetEl);
                  }
                  // tableau: any face-up card is clickable
                  var n = parseInt(pileId, 10);
                  if (!isNaN(n) && n >= 1 && n <= 7) return targetEl.dataset && targetEl.dataset.played === 'true';
               }

               if (eventType === 'dblclick') {
                  // waste: top card only; tableau: last card only
                  if (pileId === 'waste') return isFirstCardInPile('waste', targetEl);
                  var n2 = parseInt(pileId, 10);
                  if (!isNaN(n2) && n2 >= 1 && n2 <= 7) return isLastCardInTableau(targetEl);
               }

               return false;
            }

            function delegatedHandler(event) {
               var target = event.target;
               var forwardEl = null;
               if (target && target.closest) {
                  forwardEl = target.closest('.card, #stock .reload-icon');
               }
               if (!forwardEl) return;
               if (!shouldForwardToSelect(event.type, forwardEl)) return;

               // allow select() to use a stable element even if click lands on nested nodes
               event.delegatedTarget = forwardEl;
               return select(event);
            }

            // one handler per event type for entire table
            $table.addEventListener('click', delegatedHandler);
            $table.addEventListener('dblclick', delegatedHandler);
         }

      // bind click events
         function bindClick(selectors, double) {
            var elements = d.querySelectorAll(selectors); // query all elements
            // loop through elements
            for (var e in elements) {
               e = elements[e];
               // add event listener
               if (e.nodeType) {
                  if (!double) e.addEventListener('click', select);
                  else e.addEventListener('dblclick', select);
               }
            }
            return;
         }

      // unbind click events
         function unbindClick(selectors, double) {
            var elements = d.querySelectorAll(selectors); // query all elements
            // loop through elements
            for (var e in elements) {
               e = elements[e];
               // remove event listener
               if (e.nodeType) {
                  if (!double) e.removeEventListener('click', select);
                  else e.removeEventListener('dblclick', select);
               }
            }
            return;
         }

      // on click handler: select
         var clicks = 0; // set counter for counting clicks
         var clickDelay = 200; // set delay for double click
         var clickTimer = null; // set timer for timeout function
         function select(event) {

            if ((event.type === 'click' || event.type === 'dblclick') && Date.now() < suppressClickUntil) {
               event.preventDefault();
               return;
            }

            // prevent default
            event.preventDefault();

            // start timer
            if ( $timer.dataset.action !== 'start' ) {
               timer('start');
            }

            // if timestamp matches then return false
            var time = event.timeStamp; // get timestamp
            if ( time === lastEventTime ) {
               // console.log('Status: Timestamp Matches, False Click');
               return false;
            }
            else {
               lastEventTime = time; // cache timestamp
            }

            // get variables
            var e = event.delegatedTarget || event.target; // get element
            var isSelected = e.dataset.selected; // get selected attribute
            var rank = e.dataset.rank; // get rank attribute
            var suit = e.dataset.suit; // get suit attribute
            var pile = e.dataset.pile; // get pile attribute
            var action = e.dataset.action; // get action attribute

            // create card array
            if (rank && suit) var card = [rank,suit];

            // count clicks
            clicks++;

            // single click
            if (clicks === 1 && event.type === 'click') {
               clickTimer = setTimeout(function() {
                  // console.log('Single Click Detected', event);

                  // reset click counter
                  clicks = 0;

                  // if same card is clicked
                  if (e.dataset.selected === 'true') {
                     // console.log('Status: Same Card Clicked');
                     // deselect card
                     delete e.dataset.selected;
                     delete $table.dataset.move;
                     delete $table.dataset.selected;
                     delete $table.dataset.source;
                     // console.log('Card Deselected', card, e);
                  }

                  // if move is in progress
                  else if ($table.dataset.move) {
                     // console.log('Status: A Move Is In Progess');
                     // get selected
                     var selected = $table.dataset.selected.split(',');
                     // update table dataset with destination pile
                     $table.dataset.dest = e.closest('.pile').dataset.pile;
                     // get destination card or pile
                     if ( card ) var dest = card;
                     else var dest = $table.dataset.dest;
                     // validate move
                     if ( validateMove(selected, dest) ) {
                        var dirty = dirtyPilesForMove($table.dataset.source, $table.dataset.dest);
                        // make move
                        makeMove();
                        reset(table);
                        renderPartial(table, playedCards, dirty);
                        play(table);
                     } else {
                        // console.log('Move is Invalid. Try again...');
                        reset(table);
                        play(table);
                        // console.log('Card Deselected', card, e);
                     }
                  }

                  // if stock is clicked
                  else if (pile === 'stock') {
                     // console.log('Status: Stock Pile Clicked');
                     // if stock isn't empty
                     if (table['stock'].length) {
                        // move card from stock to waste
                        move(table['stock'], table['waste']);
                        reset(table);
                        renderPartial(table, playedCards, ['stock', 'waste']);
                        // count move
                        countMove(moves++);
                        // return to play
                        play(table);
                     }
                  }

                  // if stock reload icon is clicked
                  else if (action === 'reload') {
                     // console.log('Starting New Game');
                     // console.log('Reloading Stock Pile');
                     // reload stock pile
                     if (table['waste'].length) {
                        table['stock'] = table['waste']; // move waste to stock
                        table['waste'] = [] // empty waste
                     }
                     // render table
                     renderPartial(table, playedCards, ['stock', 'waste']);
                     // turn all stock cards face down
                     flipCards('#stock .card', 'down');
                     // return to play
                     play(table);
                  }

                  // if no move is in progress
                  else {
                     // по одиночному клику не оставляем выделение карты:
                     // перемещения делаются drag&drop или двойным кликом
                     clearDomSelectedFlags();
                  }

               }, clickDelay);
            }

            // double click
            else if (event.type === 'dblclick') {
               // console.log('Double Click Detected', event);
               clearTimeout(clickTimer); // prevent single click
               clicks = 0; // reset click counter
               // select card
               e.dataset.selected = 'true';
               $table.dataset.move = 'true';
               $table.dataset.selected = card;
               $table.dataset.source = e.closest('.pile').dataset.pile;
               // get destination pile
               if ( card) var dest = card[1]+'s';
               // update table dataset with destination
               $table.dataset.dest = dest;
               // validate move
               if ( validateMove(card, dest) ) {
                  var dirty = dirtyPilesForMove($table.dataset.source, $table.dataset.dest);
                  // make move
                  makeMove();
                  reset(table);
                  renderPartial(table, playedCards, dirty);
                  play(table);
               } else {
                  // console.log('Move is Invalid. Try again...');
                  reset(table);
                  play(table);
                  // console.log('Card Deselected', card, e);
               }

            }

         }

         function clearDomSelectedFlags() {
            var selectedEls = d.querySelectorAll('.card[data-selected="true"]');
            for (var i = 0; i < selectedEls.length; i++) {
               delete selectedEls[i].dataset.selected;
            }
            delete $table.dataset.move;
            delete $table.dataset.selected;
            delete $table.dataset.source;
            delete $table.dataset.dest;
         }

      function setupPointerDnD() {
         if (!$table || $table.dataset.pointerDndInitialized === 'true') return;
         $table.dataset.pointerDndInitialized = 'true';

         var DRAG_THRESHOLD_PX = 7;
         var documentListenersAttached = false;
         var mouseListenersAttached = false;
         var touchListenersAttached = false;
         var drag = {
            active: false,
            started: false,
            pointerId: null,
            card: null,
            stackEls: null,
            ghost: null,
            startX: 0,
            startY: 0,
            offsetX: 0,
            offsetY: 0,
            lastClientX: 0,
            lastClientY: 0,
            currentDropPile: null
         };

         function isTableauPileId(pileId) {
            var n = parseInt(pileId, 10);
            return !isNaN(n) && n >= 1 && n <= 7;
         }

         function isFoundationPileId(pileId) {
            return ['spades', 'hearts', 'diamonds', 'clubs'].indexOf(pileId) >= 0;
         }

         function isDraggableCard(cardEl) {
            if (!cardEl || !cardEl.dataset) return false;
            var pileEl = cardEl.closest('.pile');
            if (!pileEl || !pileEl.dataset) return false;

            var pileId = pileEl.dataset.pile;
            if (pileId === 'stock') return false;
            if (cardEl.dataset.played !== 'true') return false;

            // waste + foundations: only the top card
            if (pileId === 'waste' || isFoundationPileId(pileId)) {
               return pileEl.querySelector('.card:first-child') === cardEl;
            }

            // tableau: any face-up card (can drag stacks)
            if (isTableauPileId(pileId)) return true;

            return false;
         }

         function createGhostFromCard(cardEl) {
            var stack = [cardEl];
            var pileEl = cardEl.closest('.pile');
            var pileId = pileEl && pileEl.dataset ? pileEl.dataset.pile : null;
            if (pileId && isTableauPileId(pileId)) {
               var cur = cardEl;
               while (cur = cur.nextSibling) {
                  if (cur && cur.nodeType === 1 && cur.classList && cur.classList.contains('card')) {
                     stack.push(cur);
                  }
               }
            }

            drag.stackEls = stack;

            var baseRect = cardEl.getBoundingClientRect();
            var container = d.createElement('div');
            container.className = 'drag-ghost-stack';
            container.style.transform = 'translate3d(' + (drag.lastClientX - drag.offsetX) + 'px,' + (drag.lastClientY - drag.offsetY) + 'px,0)';

            for (var i = 0; i < stack.length; i++) {
               var el = stack[i];
               var rect = el.getBoundingClientRect();
               var clone = el.cloneNode(true);
               clone.classList.add('drag-ghost');
               clone.removeAttribute('data-selected');
               clone.style.position = 'absolute';
               clone.style.left = (rect.left - baseRect.left) + 'px';
               clone.style.top = (rect.top - baseRect.top) + 'px';
               clone.style.width = rect.width + 'px';
               clone.style.height = rect.height + 'px';
               // нижние карты должны быть поверх верхних
               clone.style.zIndex = String(i + 1);
               clone.style.transform = 'none';
               container.appendChild(clone);
            }

            document.body.appendChild(container);
            return container;
         }

         function setDropPile(nextPile) {
            if (drag.currentDropPile === nextPile) return;
            if (drag.currentDropPile) drag.currentDropPile.classList.remove('is-drop-target');
            drag.currentDropPile = nextPile;
            if (drag.currentDropPile) drag.currentDropPile.classList.add('is-drop-target');
         }

         function updateDropTarget(clientX, clientY) {
            var el = document.elementFromPoint(clientX, clientY);
            if (!el) return setDropPile(null);
            var pile = el.closest('.pile');
            if (!pile) return setDropPile(null);
            return setDropPile(pile);
         }

         function beginDrag(pointerEvent) {
            drag.started = true;
            d.body.classList.add('is-dragging');

            clearDomSelectedFlags();

            var cardEl = drag.card;
            cardEl.dataset.selected = 'true';
            $table.dataset.move = 'true';
            $table.dataset.selected = [cardEl.dataset.rank, cardEl.dataset.suit];
            $table.dataset.source = cardEl.closest('.pile').dataset.pile;

            drag.lastClientX = pointerEvent.clientX;
            drag.lastClientY = pointerEvent.clientY;
            drag.ghost = createGhostFromCard(cardEl);
            if (drag.stackEls && drag.stackEls.length) {
               for (var i = 0; i < drag.stackEls.length; i++) {
                  drag.stackEls[i].classList.add('is-drag-origin');
               }
            } else {
               cardEl.classList.add('is-drag-origin');
            }

            updateDropTarget(pointerEvent.clientX, pointerEvent.clientY);
         }

         function positionGhost(clientX, clientY) {
            if (!drag.ghost) return;
            drag.ghost.style.transform = 'translate3d(' + (clientX - drag.offsetX) + 'px,' + (clientY - drag.offsetY) + 'px,0)';
         }

         function computeDestFromPile(pileEl) {
            if (!pileEl || !pileEl.dataset) return null;
            var pileId = pileEl.dataset.pile;

            // empty pile
            if (!pileEl.querySelector('.card')) return pileId;

            // non-empty: select the "top" card by pile type
            var targetCard = null;
            if (isTableauPileId(pileId)) targetCard = pileEl.querySelector('.card:last-child');
            else targetCard = pileEl.querySelector('.card:first-child');

            if (!targetCard) return pileId;
            return [targetCard.dataset.rank, targetCard.dataset.suit];
         }

         function cleanupDrag() {
            if (drag.stackEls && drag.stackEls.length) {
               for (var i = 0; i < drag.stackEls.length; i++) {
                  drag.stackEls[i].classList.remove('is-drag-origin');
               }
            } else if (drag.card) {
               drag.card.classList.remove('is-drag-origin');
            }
            if (drag.ghost && drag.ghost.parentNode) drag.ghost.parentNode.removeChild(drag.ghost);
            drag.ghost = null;
            d.body.classList.remove('is-dragging');
            setDropPile(null);

            drag.active = false;
            drag.started = false;
            drag.pointerId = null;
            drag.card = null;
            drag.stackEls = null;

            if (documentListenersAttached) {
               document.removeEventListener('pointermove', onPointerMove);
               document.removeEventListener('pointerup', onPointerUpOrCancel);
               document.removeEventListener('pointercancel', onPointerUpOrCancel);
               documentListenersAttached = false;
            }

            if (mouseListenersAttached) {
               document.removeEventListener('mousemove', onPointerMove);
               document.removeEventListener('mouseup', onPointerUpOrCancel);
               mouseListenersAttached = false;
            }

            if (touchListenersAttached) {
               document.removeEventListener('touchmove', onTouchMove);
               document.removeEventListener('touchend', onTouchEndOrCancel);
               document.removeEventListener('touchcancel', onTouchEndOrCancel);
               touchListenersAttached = false;
            }
         }

         function onPointerDown(e) {
            if (drag.active) return;
            if (e.button != null && e.button !== 0) return;

            var cardEl = e.target.closest('.card');
            if (!cardEl) return;
            if (!isDraggableCard(cardEl)) return;

            drag.active = true;
            drag.started = false;
            drag.pointerId = e.pointerId;
            drag.card = cardEl;
            drag.startX = e.clientX;
            drag.startY = e.clientY;
            drag.lastClientX = e.clientX;
            drag.lastClientY = e.clientY;

            var rect = cardEl.getBoundingClientRect();
            drag.offsetX = e.clientX - rect.left;
            drag.offsetY = e.clientY - rect.top;

            try {
               cardEl.setPointerCapture(e.pointerId);
            } catch (err) {
               // ignore
            }

            if (e.type === 'pointerdown' && !documentListenersAttached) {
               document.addEventListener('pointermove', onPointerMove, { passive: false });
               document.addEventListener('pointerup', onPointerUpOrCancel, { passive: false });
               document.addEventListener('pointercancel', onPointerUpOrCancel, { passive: false });
               documentListenersAttached = true;
            }
         }

         function onPointerMove(e) {
            if (!drag.active) return;
            if (e.pointerId !== drag.pointerId) return;

            drag.lastClientX = e.clientX;
            drag.lastClientY = e.clientY;

            if (!drag.started) {
               var dx = e.clientX - drag.startX;
               var dy = e.clientY - drag.startY;
               if (Math.sqrt(dx * dx + dy * dy) >= DRAG_THRESHOLD_PX) {
                  beginDrag(e);
               } else {
                  return;
               }
            }

            e.preventDefault();
            positionGhost(e.clientX, e.clientY);
            updateDropTarget(e.clientX, e.clientY);
         }

         function onPointerUpOrCancel(e) {
            if (!drag.active) return;
            if (e.pointerId !== drag.pointerId) return;

            if (!drag.started) {
               cleanupDrag();
               return;
            }

            e.preventDefault();

            var dropPile = drag.currentDropPile;
            if (!dropPile || !dropPile.dataset) {
               suppressClickUntil = Date.now() + 450;
               cleanupDrag();
               return;
            }

            var destPileId = dropPile.dataset.pile;
            $table.dataset.dest = destPileId;

            var selected = [drag.card.dataset.rank, drag.card.dataset.suit];
            var dest = computeDestFromPile(dropPile);

            // don't allow dropping onto the stock pile (not meaningful)
            if (destPileId === 'stock') {
               suppressClickUntil = Date.now() + 450;
               cleanupDrag();
               return;
            }

            suppressClickUntil = Date.now() + 450;
            cleanupDrag();

            if (dest && validateMove(selected, dest)) {
               var dirty = dirtyPilesForMove($table.dataset.source, $table.dataset.dest);
               makeMove();
               reset(table);
               renderPartial(table, playedCards, dirty);
               play(table);
            } else {
               reset(table);
               play(table);
            }
         }

         function onMouseDown(e) {
            // only left button
            if (e.button !== 0) return;
            onPointerDown(e);
            if (drag.active && !mouseListenersAttached) {
               document.addEventListener('mousemove', onPointerMove, { passive: false });
               document.addEventListener('mouseup', onPointerUpOrCancel, { passive: false });
               mouseListenersAttached = true;
            }
         }

         function findTouchById(touchList, id) {
            if (!touchList) return null;
            for (var i = 0; i < touchList.length; i++) {
               if (touchList[i].identifier === id) return touchList[i];
            }
            return null;
         }

         function normalizeTouchEvent(originalEvent, touch) {
            return {
               type: originalEvent.type,
               target: originalEvent.target,
               button: 0,
               pointerId: touch.identifier,
               clientX: touch.clientX,
               clientY: touch.clientY,
               preventDefault: function() {
                  originalEvent.preventDefault();
               }
            };
         }

         function onTouchStart(e) {
            if (!e.changedTouches || e.changedTouches.length === 0) return;
            var touch = e.changedTouches[0];
            onPointerDown(normalizeTouchEvent(e, touch));
            if (drag.active && !touchListenersAttached) {
               document.addEventListener('touchmove', onTouchMove, { passive: false });
               document.addEventListener('touchend', onTouchEndOrCancel, { passive: false });
               document.addEventListener('touchcancel', onTouchEndOrCancel, { passive: false });
               touchListenersAttached = true;
            }
         }

         function onTouchMove(e) {
            if (!drag.active) return;
            var touch = findTouchById(e.touches, drag.pointerId);
            if (!touch) return;
            onPointerMove(normalizeTouchEvent(e, touch));
         }

         function onTouchEndOrCancel(e) {
            if (!drag.active) return;
            var touch = findTouchById(e.changedTouches, drag.pointerId);
            if (!touch) return;
            onPointerUpOrCancel(normalizeTouchEvent(e, touch));
         }

         if ('PointerEvent' in window) {
            $table.addEventListener('pointerdown', onPointerDown, { passive: true });
         } else {
            $table.addEventListener('mousedown', onMouseDown, { passive: false });
            $table.addEventListener('touchstart', onTouchStart, { passive: true });
         }
      }

      // validate move
         function validateMove(selected, dest) {
            // console.log ('Validating Move...', selected, dest);

            // if selected card exists
            if (selected) {
               var sRank = parseRankAsInt(selected[0]);
               var sSuit = selected[1];
            }

            // if destination is another card
            if (dest.constructor === Array) {
               // console.log('Desitination appears to be a card');
               var dRank = parseRankAsInt(dest[0]);
               var dSuit = dest[1];
               var dPile = $table.dataset.dest;
               // if destination pile is foundation
               if (['spades','hearts','diamonds','clubs'].indexOf(dPile) >= 0) {
                  // if rank isn't in sequence then return false
                  if (dRank - sRank !== -1) {
                    // console.log('Rank sequence invalid');
                    // console.log(dRank - sRank)
                    return false;
                  }
                  // if suit isn't in sequence then return false
                  if ( sSuit !== dSuit ) {
                     // console.log('Suit sequence invalid');
                     return false;
                  }
               }
               // if destination pile is tableau
               else {
                  // if rank isn't in sequence then return false
                  if (dRank - sRank !== 1) {
                    // console.log('Rank sequence invalid');
                    return false;
                  }
                  // if suit isn't in sequence then return false
                  if ( ( (sSuit === 'spade' || sSuit === 'club') &&
                     (dSuit === 'spade' || dSuit === 'club') ) ||
                     ( (sSuit === 'heart' || sSuit === 'diamond') &&
                     (dSuit === 'heart' || dSuit === 'diamond') ) ) {
                    // console.log('Suit sequence invalid');
                    return false;
                  }
               }
               // else return true
               // console.log('Valid move');
               return true;

            }

            // if destination is foundation pile
            if (['spades','hearts','diamonds','clubs'].indexOf(dest) >= 0) {
               // console.log('Destination appears to be empty foundation');

               // get last card in destination pile
               var lastCard = d.querySelector('#'+dest+' .card:first-child');
               if (lastCard) {
                  var dRank = parseRankAsInt(lastCard.dataset.rank);
                  var dSuit = lastCard.dataset.suit;
               }
               // if suit doesn't match pile then return false
               if ( sSuit + 's' !== dest ) {
                  // console.log('Suit sequence invalid');
                  return false;
               }
               // if rank is ace then return true
               else if ( sRank === 1 ) {
                  // console.log('Valid Move');
                  return true;
               }
               // if rank isn't in sequence then return false
               else if ( sRank - dRank !== 1 ) {
                  // console.log('Rank sequence invalid');
                  return false;
               }
               // else return true
               else {
                  // console.log('Valid move');
                  return true;
               }
            }

            // if destination is empty tableau pile
            if ( dest >= 1 && dest <= 7 ) {
               // console.log('Destination appears tp be empty tableau');
               return true;
            }

         }

      // make move
         function makeMove() {
            // console.log('Making Move...');

            // get source and dest
            var source = $table.dataset.source; // number of pile
            var dest = $table.dataset.dest; // number of pile
            // console.log('From '+source+' pile to '+dest+' pile');

            // Получаем информацию о перемещаемой карте для аналитики
            var selectedCard = $table.dataset.selected;
            var cardInfo = null;
            if (selectedCard) {
               cardInfo = selectedCard.split(',');
            }

            // if pulling card from waste pile
            if ( source === 'waste') {
               if ( isNaN(dest) ) {
                  move(table[source], table[dest], true);
                  addScore(SCORE.WASTE_TO_FOUNDATION);
               }
               else {
                  move(table[source], table['tab'][dest], true);
                  addScore(SCORE.WASTE_TO_TABLEAU);
               }
            }

            // if pulling card from foundation pile
            else if (['spades','hearts','diamonds','clubs'].indexOf(source) >= 0) {
               if ( isNaN(dest) ) {
                  return false;
               }
               else {
                  move(table[source], table['tab'][dest], true);
                  addScore(SCORE.FOUNDATION_TO_TABLEAU);
               }
            }

            // if pulling card from tableau pile
            else {
               if ( isNaN(dest) ) {
                  move(table['tab'][source], table[dest], true);
                  addScore(SCORE.TABLEAU_TO_FOUNDATION);
               }
               // if moving card to tableau pile
               else {
                  // console.log('Moving To Tableau Pile');
                  // get selected card
                  var selected = d.querySelector('.card[data-selected="true"]');
                  // get cards under selected card
                  var selectedCards = [];
                  if (selected && selected.nodeType === 1 && selected.classList && selected.classList.contains('card')) {
                     selectedCards.push(selected);
                  }
                  while (selected && (selected = selected.nextSibling)) {
                     if (selected.nodeType === 1 && selected.classList && selected.classList.contains('card')) {
                        selectedCards.push(selected);
                     }
                  }
                  // move card(s)
                  move(
                     table['tab'][source],
                     table['tab'][dest],
                     true,
                     selectedCards.length
                  );
               }
            }

            // Defensive cleanup: ensure no invalid card tuples remain after move
            if (source === 'waste' || source === 'stock' || ['spades','hearts','diamonds','clubs'].indexOf(source) >= 0) {
               sanitizePileCards(table[source]);
            } else if (!isNaN(parseInt(source, 10))) {
               sanitizePileCards(table['tab'][source]);
            }
            if (dest === 'waste' || dest === 'stock' || ['spades','hearts','diamonds','clubs'].indexOf(dest) >= 0) {
               sanitizePileCards(table[dest]);
            } else if (!isNaN(parseInt(dest, 10))) {
               sanitizePileCards(table['tab'][dest]);
            }

            // count move
            countMove(moves++);

            // Отслеживание хода игрока
            if (window.solitaireAnalytics && cardInfo && cardInfo.length >= 2) {
               window.solitaireAnalytics.trackMove(
                  source, 
                  dest, 
                  cardInfo[0], // rank
                  cardInfo[1], // suit
                  'manual'
               );
            }

            $table.dataset.source = NaN;
            // reset table
            // console.log('Ending Move...');

            return;
         }

      // parse rank as integer
         function parseRankAsInt(rank) {
            // assign numerical ranks to letter cards
            switch (rank) {
               case 'A' : rank = '1'; break;
               case 'J' : rank = '11'; break;
               case 'Q' : rank = '12'; break;
               case 'K' : rank = '13'; break;
               default : break;
            }
            // return integer value for rank
            return parseInt(rank);
         }

      // parse integer as rank
         function parseIntAsRank(int) {
            // parse as integer
            rank = parseInt(int);
            // assign letter ranks to letter cards
            switch(rank) {
               case 1 : rank = 'A'; break;
               case 11 : rank = 'J'; break;
               case 12 : rank = 'Q'; break;
               case 13 : rank = 'K'; break;
               default : break;
            }
            return rank;
         }

      // reset table
         function reset(table) {
            delete $table.dataset.move;
            delete $table.dataset.selected;
            delete $table.dataset.source;
            delete $table.dataset.dest;
            delete $fnd.dataset.played;
            delete $fnd.dataset.unplayed;
            delete $tab.dataset.played;
            delete $tab.dataset.unplayed;
            // всегда снимаем выделение с карт в DOM
            var selectedEls = d.querySelectorAll('.card[data-selected="true"]');
            for (var i = 0; i < selectedEls.length; i++) {
               delete selectedEls[i].dataset.selected;
            }
            // console.log('Table reset');
         }

      // start a new game
         function startNewGame() {
            // stop timer and reset game state
            timer('stop');
            time = 0;
            moves = 0;
            score = 0;
            lastEventTime = 0;
            scoreSubmitted = false;

            $timer.dataset.action = 'stop';
            $timerSpan.textContent = '00:00';
            delete d.body.dataset.gameplay;

            $moveCount.dataset.moves = 0;
            $moveCountSpan.textContent = '0';

            $score.dataset.score = 0;
            if ($scoreSpan) $scoreSpan.textContent = '0';

            // hide auto win button and remove listener
            if ($autoWin) {
               $autoWin.style.display = 'none';
               $autoWin.removeEventListener('click', autoWin);
            }

            // remove victory overlay if present
            var effectOverlay = d.querySelector('#victory-effect');
            if (effectOverlay && effectOverlay.parentNode) {
               effectOverlay.parentNode.removeChild(effectOverlay);
            }

            // reset selections and unbind reload icon
            reset(table);
            unbindClick('#stock .reload-icon');

            // rebuild deck and deal
            deck = create([], suits);
            if (window.location && window.location.search) {
               var params = new URLSearchParams(window.location.search);
               debugDeal = params.get('debug') === '1';
            } else {
               debugDeal = false;
            }
            deck = debugDeal ? buildDebugDeck(suits) : shuffle(deck);

            table = [];
            table['stock'] = [];
            table['waste'] = [];
            table['spades'] = [];
            table['hearts'] = [];
            table['diamonds'] = [];
            table['clubs'] = [];
            table['tab'] = [];
            table = debugDeal ? debugDealStockOnly(deck, table) : deal(deck, table);

            // Отслеживание начала новой игры
            if (window.solitaireAnalytics) {
               window.solitaireAnalytics.trackGameStart('klondike');
            }

            playedCards = initialPlayedCards;
            startDeferredDealRender(table, playedCards, false, function() {
               play(table);
            });
         }

      // timer funcion
         function timer(action) {
            // declare timer vars
            var minutes = 0;
            var seconds = 0;
            var gameplay = d.body.dataset.gameplay;
            // set timer attribute
            $timer.dataset.action = action;
            // switch case
            switch (action) {
               // start timer
               case 'start' :
                  // console.log('Starting Timer...');
                  // looping function
                  clock = setInterval(function() {
                     // increment
                     time++;
                     // parse minutes and seconds
                     minutes = parseInt(time / 60, 10);
                     seconds = parseInt(time % 60, 10);
                     minutes = minutes < 10 ? "0" + minutes : minutes;
                     seconds = seconds < 10 ? "0" + seconds : seconds;
                     // output to display
                     $timerSpan.textContent = minutes + ':' + seconds;
                     if ( time % 10 === 0 ) addScore(SCORE.TIME_PENALTY_PER_10SEC);
                  }, 1000);
                  // add dataset to body
                  d.body.dataset.gameplay = 'active';
                  // unbind click to play button
                  if ( gameplay === 'paused')
                  $playPause.removeEventListener('click', playTimer);
                  // bind click to pause button
                  $playPause.addEventListener('click', pauseTimer = function(){
                     timer('pause');
                  });
                  
                  // Отслеживание возобновления игры
                  if (window.solitaireAnalytics && gameplay === 'paused') {
                     window.solitaireAnalytics.trackGameResume();
                  }
               break;
               // pause timer
               case 'pause' :
                  // console.log('Pausing Timer...');
                  clearInterval(clock);
                  d.body.dataset.gameplay = 'paused';
                  
                  // Отслеживание паузы игры
                  if (window.solitaireAnalytics) {
                     window.solitaireAnalytics.trackGamePause();
                  }
                  
                  // unbind click to pause button
                  if ( gameplay === 'active')
                  $playPause.removeEventListener('click', pauseTimer);
                  // bind click tp play button
                  $playPause.addEventListener('click', playTimer = function(){
                     timer('start');
                  });
               break;
               // stop timer
               case 'stop' :
                  // console.log('Stoping Timer...');
                  clearInterval(clock);
                  d.body.dataset.gameplay = 'over';
               break;
               // default
               default : break;
            }
            // console.log(time);
            return;
         }

      // move counter
         function countMove(moves) {
            // console.log('Move Counter', moves);
            // set move attribute
            $moveCount.dataset.moves = moves + 1;
            // output to display
            $moveCountSpan.textContent = moves + 1;
            return;
         }

      // scoring
         function addScore(delta) {
            score = Math.max(0, parseInt($score.dataset.score, 10) + delta);
            $score.dataset.score = score;
            $score.children[1].textContent = score;
            return score;
         }

      function sendScoreToSheet(finalScore) {
         if (!SHEETS_ENDPOINT_URL || scoreSubmitted) return;
         scoreSubmitted = true;
         addPlayerScore(parseInt(finalScore, 10));
         var params = new URLSearchParams();
         params.append('score', parseInt(finalScore, 10));
         params.append('locale', getPlayerCountry());
         if (SHEETS_ENDPOINT_TOKEN) params.append('token', SHEETS_ENDPOINT_TOKEN);
         fetch(SHEETS_ENDPOINT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
               'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: params.toString(),
            keepalive: true
         }).catch(function(error) {
            // Fail silently to avoid breaking gameplay
            console.warn('Score sync failed', error);
         });
      }

      // check for win
         function checkForWin(table) {
            // if all foundation piles are full
            if (  table['spades'].length +
                  table['hearts'].length +
                  table['diamonds'].length +
                  table['clubs'].length
                  === 52 ) {
               // console.log('Game Has Been Won');
               timer('stop');
               sendScoreToSheet(score);
               // show victory effect
               showVictoryEffect();

               // Отслеживание выигрыша
               if (window.solitaireAnalytics) {
                  window.solitaireAnalytics.trackGameWin('manual');
               }
               dataLayer.push({
                  event: 'gameWon'
                });
               onGameWon();

               // return true
               return true;
            }
            else return false;
         }

      // check for auto win
         function checkForAutoWin(table) {
            // if all tableau cards are played and stock is empty
            if (  parseInt($tab.dataset.unplayed) +
                  table['stock'].length +
                  table['waste'].length === 0) {
               // trigger auto win automatically (no button)
               autoWin();
            }
            return;
         }

      // auto win
         function autoWin() {
            // console.log('Huzzah!');
            
            // Отслеживание использования авто-победы
            if (window.solitaireAnalytics) {
               window.solitaireAnalytics.trackAutoWin();
            }
            
            // hide auto win button (if present)
            if ($autoWin) {
               $autoWin.style.display = 'none';
               $autoWin.removeEventListener('click', autoWin);
            }
            // unbind click events
            unbindClick(
               '#stock .card:first-child,' +
               '#waste .card:first-child,' +
               '#fnd .card:first-child,' +
               '#fnd #spades.pile[data-empty="true"],' +
               '#fnd #hearts.pile[data-empty="true"],' +
               '#fnd #diamonds.pile[data-empty="true"],' +
               '#fnd #clubs.pile[data-empty="true"],' +
               '#tab .card[data-played="true"],' +
               '#tab .pile[data-empty="true"]'
            );
            // unbind double click events
            unbindClick(
               '#waste .card:first-child' +
               '#tab .card:last-child',
               'double'
            );
            // reset table
            reset(table);
            render(table);
            // animate cards to foundation piles
            autoWinAnimation(table);
            // stop timer
            timer('stop');
            sendScoreToSheet(score);

            // Отслеживание победы в сценарии авто-победы.
            if (window.solitaireAnalytics) {
               window.solitaireAnalytics.trackGameWin('auto');
            }
            onGameWon();
         }

      // auto win animation
         function autoWinAnimation(table) {
            // set number of iterations
            var i = parseInt($tab.dataset.played);
            // create animation loop
            function animation_loop() {
               // get lowest ranking card
                  var bottomCards = []; // create array for the bottom cards
                  var els = d.querySelectorAll('#tab .card:last-child');
                  for (var e in els) { // loop through elements
                     e = els[e];
                     if (e.nodeType)
                        bottomCards.push( parseRankAsInt(e.dataset.rank) );
                  }
                  // get the lowest rank from array of bottom cards
                  var lowestRank = Math.min.apply(Math, bottomCards);
                  // parse integer as rank
                  var rank = parseIntAsRank(lowestRank);
                  // get element with rank
                  var e = d.querySelector('#tab .card[data-rank="'+rank+'"]');

               // setup move
                  // get suit of card
                  var suit = e.dataset.suit;
                  // create card array with rank and suit
                  var card = [rank, suit];
                  // get destination pile
                  var dest = suit+'s';

               // make move
                  if ( validateMove(card, dest) ) {
                     // set source pile
                     var pile = e.parentElement.parentElement;
                     $table.dataset.source = pile.dataset.pile;
                     // set dest pile
                     $table.dataset.dest = dest;
                     var dirty = dirtyPilesForMove($table.dataset.source, $table.dataset.dest);
                     // make move
                     makeMove();
                     reset(table);
                     renderPartial(table, playedCards, dirty);
                  } else {
                     // console.log('Move is Invalid. Try again...');
                     reset(table);
                  }
               // let's do it again in 100ms
               setTimeout(function() {
                  i--;
                  if (i !== 0) animation_loop();
                  // at the end lets celebrate!
                  else showVictoryEffect();
               }, 100);
            };
            // run animation loop
            animation_loop();
         }

   // Victory light effect
   function showVictoryEffect() {
      // console.log('Victory Effect!');
      
      const effectOverlay = document.createElement('div');
      effectOverlay.id = 'victory-effect';
      effectOverlay.className = 'victory-effect';
      document.body.appendChild(effectOverlay);
      
      // Удалить эффект через 10 секунд
      setTimeout(() => {
         effectOverlay.classList.add('fade-out');
         setTimeout(() => {
            if (effectOverlay.parentNode) {
               effectOverlay.parentNode.removeChild(effectOverlay);
            }
         }, 1000);
      }, 10000);
   }

   // Сделать функцию доступной из консоли
   window.showVictoryEffect = showVictoryEffect;

})