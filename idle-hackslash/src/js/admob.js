// ===== AdMob（スマホアプリ版の動画広告） =====
// ストアのアプリ（Capacitor の中）では、playRewardedVideo の仮の動画のかわりに、AdMob のリワード広告を流す。
// claude.ai のアーティファクト・ブラウザでは、いままでどおり仮の動画（このファイルは何もしない）。
// ・本番の ID。自分の端末で試すときは、AdMob の「設定 → テストデバイス」に端末を登録してテスト広告にする（自分で本番の広告を見たり押したりしない）
// ・テスト用に戻すとき：広告ユニットを ca-app-pub-3940256099942544/5224354917、ADMOB_TESTING を true に
// ・アプリ ID（ca-app-pub-…~…）は app/android/app/src/main/res/values/strings.xml の admob_app_id
// 機種ごとの広告ユニット（本番）
const ADMOB_IDS = {
  android: { rewarded: 'ca-app-pub-3193231960637976/9776778979', testing: false }, // 本番（動画報酬）
  ios: { rewarded: 'ca-app-pub-3193231960637976/5661595525', testing: false }, // 本番（iOS の動画報酬）
};
const ADMOB_PLATFORM = (() => { try { return window.Capacitor && typeof window.Capacitor.getPlatform === 'function' ? window.Capacitor.getPlatform() : 'web'; } catch (e) { return 'web'; } })();
const ADMOB_REWARDED_ID = (ADMOB_IDS[ADMOB_PLATFORM] || ADMOB_IDS.android).rewarded;
const ADMOB_TESTING = (ADMOB_IDS[ADMOB_PLATFORM] || ADMOB_IDS.android).testing;
function admobPlugin() { try { const C = window.Capacitor; return C && typeof C.isNativePlatform === 'function' && C.isNativePlatform() && C.Plugins && C.Plugins.AdMob ? C.Plugins.AdMob : null; } catch (e) { return null; } }
let admobReady = null, admobPreloaded = false, admobBusy = false;
function admobInit() {
  const A = admobPlugin(); if (!A) return Promise.resolve(false);
  if (!admobReady) admobReady = A.initialize({ initializeForTesting: ADMOB_TESTING }).then(() => true, e => { console.warn('AdMob を初期化できません', e); admobReady = null; return false; }); // トラッキングの許可は、ここでは聞かない（起動直後やオープニング中に急に出さない）
  return admobReady;
}
async function admobPrepare() { // 次の広告を先に読み込んでおく（押してから待たせない）
  const A = admobPlugin(); if (!A || admobPreloaded) return admobPreloaded;
  if (!(await admobInit())) return false;
  try { await A.prepareRewardVideoAd({ adId: ADMOB_REWARDED_ID, isTesting: ADMOB_TESTING }); admobPreloaded = true; } catch (e) { admobPreloaded = false; }
  return admobPreloaded;
}
// iPhone のトラッキングの許可：はじめて動画のボタンを押したときに、先にゲームの画面で理由を説明してから、iPhone の許可の画面を出す（1回だけ）
let admobAttState = null;
async function admobNeedsAsk() {
  const A = admobPlugin(); if (!A || ADMOB_PLATFORM !== 'ios' || game.attAsked) return false;
  try { const t = await A.trackingAuthorizationStatus(); admobAttState = t && t.status; return admobAttState === 'notDetermined'; } catch (e) { return false; }
}
function admobAskTracking(next) {
  const A = admobPlugin(); game.attAsked = true; saveGame();
  simpleChoice({ icon: '📺', title: '動画広告について', text: 'このゲームは、動画広告で無料で遊べるようにしています。<br>このあと iPhone から「トラッキングの許可」をたずねる画面が出ます。<br><b>許可すると</b>、あなたに合った広告が出やすくなります。<br><b>許可しなくても</b>、ゲームも動画の報酬も、すべて同じように使えます。', sub: 'あとから iPhone の「設定 → プライバシーとセキュリティ → トラッキング」で変えられます', yes: '次へ', no: false,
    onYes: async () => { try { await A.requestTrackingAuthorization(); } catch (e) {} if (next) next(); } });
}
// 本物のリワード広告を流す。done(true)：最後まで見て報酬あり／done(false, 理由)：途中で閉じた・読み込めなかった
async function admobShowRewarded(done) {
  const A = admobPlugin(); if (!A || admobBusy) { done(false, 'busy'); return; }
  admobBusy = true; let rewarded = false; const hs = [];
  const finish = (ok, why) => { if (!admobBusy) return; admobBusy = false; hs.forEach(h => { try { h.remove(); } catch (e) {} }); try { if (typeof audioCtx !== 'undefined' && audioCtx && audioCtx.state === 'suspended') audioCtx.resume(); } catch (e) {} admobPreloaded = false; setTimeout(admobPrepare, 1500); done(ok, why); };
  try {
    hs.push(await A.addListener('onRewardedVideoAdReward', () => { rewarded = true; }));
    hs.push(await A.addListener('onRewardedVideoAdDismissed', () => finish(rewarded, rewarded ? '' : 'closed')));
    hs.push(await A.addListener('onRewardedVideoAdFailedToShow', () => finish(false, 'show')));
    if (!(await admobPrepare())) { finish(false, 'load'); return; }
    try { if (typeof audioCtx !== 'undefined' && audioCtx && audioCtx.state === 'running') audioCtx.suspend(); } catch (e) {} // 広告の音とゲームの音が重ならないように
    const item = await A.showRewardVideoAd(); if (item) rewarded = true;
  } catch (e) { finish(false, 'show'); }
}
setTimeout(() => { if (admobPlugin()) admobPrepare(); }, 3000);
// デバッグ：リワード動画のテスト。必ず Google のテスト用の広告ユニットで流す（本番の広告を自分で見ないように）
const ADMOB_TEST_REWARDED_ID = ADMOB_PLATFORM === 'ios' ? 'ca-app-pub-3940256099942544/1712485313' : 'ca-app-pub-3940256099942544/5224354917'; // Google のテスト用（機種ごと）
async function admobDebugTest() {
  const A = admobPlugin(), row = (k, v) => `<div class="dl-r"><b>${k}</b>　${v}</div>`;
  const info = () => `<div class="dbg-list">${row('アプリの中', A ? 'はい（AdMob の部品あり）' : 'いいえ（ブラウザ・アーティファクト：仮の動画）')}${row('本番の広告ユニット', ADMOB_REWARDED_ID)}${row('本番でテスト設定', ADMOB_TESTING ? 'ON' : 'OFF')}${row('初期化', admobReady ? '済み' : 'まだ')}${row('本番の広告の読み込み', admobPreloaded ? '済み' : 'まだ')}</div>`;
  if (!A) { simpleChoice({ icon: '🎬', title: 'リワード動画のテスト', text: info(), sub: 'アプリ（Android）の中で押すと、テスト用の広告を流します', yes: '閉じる', no: false }); return; }
  if (admobBusy) { showNotice('🎬 広告を表示中です'); return; }
  showNotice('🎬 テスト用の広告を読み込み中…');
  if (!(await admobInit())) { simpleChoice({ icon: '⚠️', title: 'AdMob を初期化できません', text: info(), yes: '閉じる', no: false }); return; }
  admobBusy = true; let rewarded = false; const hs = [], t0 = Date.now();
  const end = (title, why) => { if (!admobBusy) return; admobBusy = false; hs.forEach(h => { try { h.remove(); } catch (e) {} }); try { if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume(); } catch (e) {} admobPreloaded = false; setTimeout(admobPrepare, 1500);
    simpleChoice({ icon: rewarded ? '✅' : '⚠️', title, text: info() + `<div class="dbg-list">${row('結果', why)}${row('かかった時間', ((Date.now() - t0) / 1000).toFixed(1) + '秒')}</div>`, sub: 'テスト用の広告なので、報酬（ジェム）は配りません', yes: '閉じる', no: false }); };
  try {
    hs.push(await A.addListener('onRewardedVideoAdReward', () => { rewarded = true; }));
    hs.push(await A.addListener('onRewardedVideoAdDismissed', () => end(rewarded ? '最後まで見られました' : '途中で閉じました', rewarded ? '報酬の合図あり（本番なら報酬を渡す）' : '報酬の合図なし')));
    hs.push(await A.addListener('onRewardedVideoAdFailedToShow', e => end('広告を表示できません', JSON.stringify(e || {}))));
    try { await A.prepareRewardVideoAd({ adId: ADMOB_TEST_REWARDED_ID, isTesting: true }); } catch (e) { end('広告を読み込めません', JSON.stringify(e && (e.message || e.code) || e)); return; }
    try { if (audioCtx && audioCtx.state === 'running') audioCtx.suspend(); } catch (e) {}
    const item = await A.showRewardVideoAd(); if (item) rewarded = true;
  } catch (e) { end('広告を表示できません', String(e && e.message || e)); }
} // 起動して少ししたら1本読み込んでおく
