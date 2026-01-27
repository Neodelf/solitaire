/**
 * Google Apps Script Web App endpoint.
 *
 * 1) Replace SHEET_ID and SHEET_NAME, adjust LOCALES order.
 * 2) Deploy as Web App (Execute as: Me, Access: Anyone).
 * 3) Use the Web App URL in solitier.js.
 */
var SHEET_ID = '1TL35sczNPh1p2zTdtiQ8YFLwee8JFX9zoBJckdnWIFc';
var SHEET_NAME = 'Rating';
var SCORE_COLUMN = 'B';
var START_ROW = 2;
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

    var score = parseInt(body.score, 10);
    if (isNaN(score)) {
      return jsonResponse({ ok: false, error: 'invalid_score' }, 400);
    }

    var locale = String(body.locale || 'en').toLowerCase();

    var lock = LockService.getScriptLock();
    lock.waitLock(10000);

    try {
      var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
      var row = getRowForLocale(locale);
      var range = sheet.getRange(SCORE_COLUMN + row);
      var currentValue = parseInt(range.getValue(), 10);
      if (isNaN(currentValue)) currentValue = 0;
      var nextValue = currentValue + score;
      range.setValue(nextValue);
      return jsonResponse({ ok: true, total: nextValue, locale: locale });
    } finally {
      lock.releaseLock();
    }
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 500);
  }
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
    return jsonResponse({ ok: true, totals: result });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}

function getRowForLocale(locale) {
  var index = LOCALES.indexOf(locale);
  if (index === -1) index = LOCALES.indexOf('en');
  if (index === -1) index = 0;
  return START_ROW + index;
}
