// ===== 無限反射：ご意見（Firestore の feedback）が届いたらメールで知らせる =====
// Google Apps Script に貼って使う。Firebase のプロジェクトを持っている Google アカウントで作ること。
// 1. このファイルの中身を「コード.gs」に貼る
// 2. 「プロジェクトの設定」で「appsscript.json マニフェスト ファイルをエディタで表示する」をオンにし、appsscript.json を同じフォルダのものに置き換える
// 3. 関数「setup」を選んで ▶ 実行 → 許可の画面で許可する（1時間ごとに自動で調べるようになる）
// 4. ためしに関数「checkFeedback」を実行すると、すぐに調べられる

const PROJECT_ID = 'mugenhansya';
const MAIL_TO = 'hisashi.app@gmail.com';   // 知らせるメールアドレス（変えてもよい）
const CHECK_EVERY_HOURS = 1;               // 何時間ごとに調べるか（1・2・4・6・8・12 のどれか）

function setup() {
  ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === 'checkFeedback').forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('checkFeedback').timeBased().everyHours(CHECK_EVERY_HOURS).create();
  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty('lastAt')) props.setProperty('lastAt', new Date(Date.now() - 7 * 864e5).toISOString()); // はじめは1週間前から
  checkFeedback();
}

function checkFeedback() {
  const props = PropertiesService.getScriptProperties();
  const lastAt = props.getProperty('lastAt') || new Date(0).toISOString();
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:runQuery`;
  const body = { structuredQuery: {
    from: [{ collectionId: 'feedback' }],
    where: { fieldFilter: { field: { fieldPath: 'at' }, op: 'GREATER_THAN', value: { timestampValue: lastAt } } },
    orderBy: [{ field: { fieldPath: 'at' }, direction: 'ASCENDING' }],
    limit: 100,
  } };
  const res = UrlFetchApp.fetch(url, {
    method: 'post', contentType: 'application/json', payload: JSON.stringify(body), muteHttpExceptions: true,
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken(), 'X-Goog-User-Project': PROJECT_ID },
  });
  if (res.getResponseCode() !== 200) throw new Error('Firestore を読めません: ' + res.getResponseCode() + ' ' + res.getContentText().slice(0, 500));
  const rows = JSON.parse(res.getContentText()).filter(r => r.document).map(r => {
    const f = r.document.fields || {}, v = k => f[k] ? (f[k].stringValue ?? f[k].integerValue ?? f[k].doubleValue ?? f[k].timestampValue ?? '') : '';
    return { at: v('at'), text: v('text'), ver: v('ver'), platform: v('platform'), stage: v('stage'), best: v('best'), reb: v('reb') };
  });
  if (!rows.length) return;
  const tz = 'Asia/Tokyo', fmt = s => Utilities.formatDate(new Date(s), tz, 'yyyy/MM/dd HH:mm');
  const text = rows.map((r, i) => `【${i + 1}】${fmt(r.at)}　${r.platform} / Ver.${r.ver}　ステージ${r.stage}（ベスト${r.best}・転生${r.reb}回）\n${r.text}`).join('\n\n----------\n\n');
  MailApp.sendEmail(MAIL_TO, `【無限反射】ご意見が ${rows.length} 件届きました`, text + `\n\n\n一覧：https://console.firebase.google.com/project/${PROJECT_ID}/firestore/databases/-default-/data/~2Ffeedback`);
  props.setProperty('lastAt', rows[rows.length - 1].at);
}
