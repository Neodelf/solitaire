/**
 * Google Apps Script Web App endpoint.
 *
 * 1) Replace SHEET_ID and SHEET_NAME, adjust LOCALES order.
 * 2) Deploy as Web App (Execute as: Me, Access: Anyone).
 * 3) Use the Web App URL in solitier.js.
 */
var SHEET_ID = '1TL35sczNPh1p2zTdtiQ8YFLwee8JFX9zoBJckdnWIFc';
var SHEET_NAME = 'Rating';
var FEEDBACK_SHEET_NAME = 'Feedback';
var FEEDBACK_HEADERS = ['Timestamp', 'Name', 'Email', 'Rating', 'Message', 'Locale'];
var SCORE_COLUMN = 'B';
var START_ROW = 2;
var DAILY_HEADER_ROW = 33;
var DAILY_START_ROW = 34;
var MONTHLY_HEADER_ROW = 65;
var MONTHLY_START_ROW = 66;
// ponytail: sheet layout is A=locale, B+=period columns (not C+)
var PERIOD_START_COL = 2;
var LOCALES = [
  'bg','cs','da','de','el','en','es','et','fi','fr','he','hr','hu','it',
  'ja','ko','lt','lv','nb','nl','pl','pt','ro','ru','sk','sl','sr','sv','tr'
];
var ACCESS_TOKEN = ''; // Optional shared secret

function doPost(e) {
  try {
    var body = {};
    if (e && e.parameter) {
      body = e.parameter;
    } else if (e && e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    }

    if (ACCESS_TOKEN && body.token !== ACCESS_TOKEN) {
      return jsonResponse({ ok: false, error: 'unauthorized' }, 401);
    }

    if (String(body.action || '') === 'feedback') {
      return handleFeedback(body);
    }

    var score = parseInt(body.score, 10);
    if (isNaN(score)) {
      return jsonResponse({ ok: false, error: 'invalid_score' }, 400);
    }

    var locale = String(body.locale || 'en').toLowerCase();

    var lock = LockService.getScriptLock();
    lock.waitLock(10000);

    try {
      var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
      var index = LOCALES.indexOf(normalizeLocale(locale));
      var row = START_ROW + index;
      var dailyRow = DAILY_START_ROW + index;
      var monthlyRow = MONTHLY_START_ROW + index;
      var dailyHeader = formatDailyHeaderUtc();
      var monthlyHeader = formatMonthlyHeaderUtc();
      var dailyCol = findOrCreatePeriodColumn(sheet, DAILY_HEADER_ROW, dailyHeader);
      var monthlyCol = findOrCreatePeriodColumn(sheet, MONTHLY_HEADER_ROW, monthlyHeader);
      var range = sheet.getRange(SCORE_COLUMN + row);
      var currentValue = parseInt(range.getValue(), 10);
      if (isNaN(currentValue)) currentValue = 0;
      var nextValue = currentValue + score;
      range.setValue(nextValue);
      incrementCell(sheet, dailyRow, dailyCol, score);
      incrementCell(sheet, monthlyRow, monthlyCol, score);
      return jsonResponse({
        ok: true,
        total: nextValue,
        locale: locale,
        dailyPeriod: dailyHeader,
        monthlyPeriod: monthlyHeader
      });
    } finally {
      lock.releaseLock();
    }
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 500);
  }
}

function handleFeedback(body) {
  // honeypot: bots fill hidden "website"; discard silently
  if (String(body.website || '').trim()) {
    return jsonResponse({ ok: true });
  }

  var name = clipText(body.name, 100);
  var email = clipText(body.email, 200);
  var message = clipText(body.message, 2000);
  var rating = parseInt(body.rating, 10);
  var locale = clipText(body.locale || 'en', 8).toLowerCase() || 'en';

  if (!name || !email || email.indexOf('@') < 1 || !message) {
    return jsonResponse({ ok: false, error: 'invalid_feedback' }, 400);
  }
  if (isNaN(rating) || rating < 1 || rating > 5) {
    return jsonResponse({ ok: false, error: 'invalid_rating' }, 400);
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = getOrCreateFeedbackSheet(ss);
    sheet.appendRow([
      Utilities.formatDate(new Date(), 'UTC', 'yyyy-MM-dd HH:mm:ss'),
      name,
      email,
      rating,
      message,
      locale
    ]);
    return jsonResponse({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

function getOrCreateFeedbackSheet(ss) {
  var sheet = ss.getSheetByName(FEEDBACK_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(FEEDBACK_SHEET_NAME);
    sheet.getRange(1, 1, 1, FEEDBACK_HEADERS.length).setValues([FEEDBACK_HEADERS]);
    return sheet;
  }
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, FEEDBACK_HEADERS.length).setValues([FEEDBACK_HEADERS]);
  }
  return sheet;
}

function clipText(value, max) {
  return String(value == null ? '' : value).trim().slice(0, max);
}

function jsonResponse(payload, status) {
  var output = ContentService.createTextOutput(JSON.stringify(payload));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

function doGet() {
  try {
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    var start = START_ROW;
    var end = START_ROW + LOCALES.length - 1;
    var range = sheet.getRange(SCORE_COLUMN + start + ':' + SCORE_COLUMN + end);
    var values = range.getValues();
    var result = {};
    for (var i = 0; i < LOCALES.length; i++) {
      var value = parseInt(values[i][0], 10);
      result[LOCALES[i]] = isNaN(value) ? 0 : value;
    }
    var dailyHeader = formatDailyHeaderUtc();
    var monthlyHeader = formatMonthlyHeaderUtc();
    return jsonResponse({
      ok: true,
      totals: result,
      dailyTotals: readPeriodTotals(sheet, DAILY_HEADER_ROW, DAILY_START_ROW, dailyHeader),
      monthlyTotals: readPeriodTotals(sheet, MONTHLY_HEADER_ROW, MONTHLY_START_ROW, monthlyHeader),
      dailyPeriod: dailyHeader,
      monthlyPeriod: monthlyHeader
    });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}

function getRowForLocale(locale) {
  var index = LOCALES.indexOf(normalizeLocale(locale));
  return START_ROW + index;
}

function normalizeLocale(locale) {
  var code = String(locale || 'en').toLowerCase();
  if (LOCALES.indexOf(code) === -1) code = 'en';
  if (LOCALES.indexOf(code) === -1) code = LOCALES[0];
  return code;
}

function formatDailyHeaderUtc() {
  return Utilities.formatDate(new Date(), 'UTC', 'dd.MM.yy');
}

function formatMonthlyHeaderUtc() {
  return Utilities.formatDate(new Date(), 'UTC', 'MM.yy');
}

function normalizePeriodHeader(value) {
  // getDisplayValues avoids Date objects when Sheets auto-parses "08.26" / "20.08.26"
  return String(value == null ? '' : value).trim();
}

function findOrCreatePeriodColumn(sheet, headerRow, headerLabel) {
  var lastCol = Math.max(sheet.getLastColumn(), PERIOD_START_COL);
  var width = lastCol - PERIOD_START_COL + 1;
  var headers = sheet.getRange(headerRow, PERIOD_START_COL, 1, width).getDisplayValues()[0];
  for (var i = 0; i < headers.length; i++) {
    if (normalizePeriodHeader(headers[i]) === headerLabel) {
      return PERIOD_START_COL + i;
    }
  }
  var col = PERIOD_START_COL + headers.length;
  sheet.getRange(headerRow, col).setValue(headerLabel);
  return col;
}

function readPeriodTotals(sheet, headerRow, dataStartRow, headerLabel) {
  var col = findPeriodColumn(sheet, headerRow, headerLabel);
  if (!col) {
    var empty = {};
    for (var j = 0; j < LOCALES.length; j++) empty[LOCALES[j]] = 0;
    return empty;
  }
  var values = sheet.getRange(dataStartRow, col, LOCALES.length, 1).getValues();
  var result = {};
  for (var i = 0; i < LOCALES.length; i++) {
    var value = parseInt(values[i][0], 10);
    result[LOCALES[i]] = isNaN(value) ? 0 : value;
  }
  return result;
}

function findPeriodColumn(sheet, headerRow, headerLabel) {
  var lastCol = Math.max(sheet.getLastColumn(), PERIOD_START_COL);
  var width = lastCol - PERIOD_START_COL + 1;
  var headers = sheet.getRange(headerRow, PERIOD_START_COL, 1, width).getDisplayValues()[0];
  for (var i = 0; i < headers.length; i++) {
    if (normalizePeriodHeader(headers[i]) === headerLabel) {
      return PERIOD_START_COL + i;
    }
  }
  return 0;
}

function incrementCell(sheet, row, col, delta) {
  var range = sheet.getRange(row, col);
  var currentValue = parseInt(range.getValue(), 10);
  if (isNaN(currentValue)) currentValue = 0;
  var nextValue = currentValue + delta;
  range.setValue(nextValue);
  return nextValue;
}
