// ===== AdMob（スマホアプリ版の動画広告） =====
// ストアのアプリ（Capacitor の中）では、playRewardedVideo の仮の動画のかわりに、AdMob のリワード広告を流す。
// claude.ai のアーティファクト・ブラウザでは、いままでどおり仮の動画（このファイルは何もしない）。
// ・本番の ID。自分の端末で試すときは、AdMob の「設定 → テストデバイス」に端末を登録してテスト広告にする（自分で本番の広告を見たり押したりしない）
// ・テスト用に戻すとき：広告ユニットを ca-app-pub-3940256099942544/5224354917、ADMOB_TESTING を true に
// ・アプリ ID（ca-app-pub-…~…）は app/android/app/src/main/res/values/strings.xml の admob_app_id
// 機種ごとの広告ユニット（本番）
const ADMOB_IDS = {
  android: { rewarded: 'ca-app-pub-3193231960637976/2285083567', testing: false }, // 本番（動画報酬2：パートナーでの入札なし。旧 /9776778979 はメディエーション専用で使えなかった）
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
let admobLoading = null; // 読み込み中の Promise（二重に読み込まない）
function admobPrepare() { if (!admobLoading) admobLoading = admobPrepareRun().finally(() => { admobLoading = null; }); return admobLoading; }
async function admobPrepareRun() { // 次の広告を読み込んでおく
  const A = admobPlugin(); if (!A || admobPreloaded) return admobPreloaded;
  if (!(await admobInit())) return false;
  for (let i = 0; i < 2 && !admobPreloaded; i++) { // 読み込めなかったら、少し待って1回だけやり直す
    if (i) await new Promise(r => setTimeout(r, 1500));
    try { await A.prepareRewardVideoAd({ adId: ADMOB_REWARDED_ID, isTesting: ADMOB_TESTING }); admobPreloaded = true; admobLastError = null; }
    catch (e) { admobPreloaded = false; admobLastError = admobErrorInfo(e); console.warn('AdMob の広告を読み込めません', e); }
  }
  return admobPreloaded;
}
// 読み込めなかった理由（AdMob のエラー番号）。読み込めなかった画面に小さく出す
let admobLastError = null;
const ADMOB_ERROR_NAMES = { 0: '内部エラー', 1: 'リクエストが正しくない', 2: '通信エラー', 3: '広告の在庫なし', 8: 'アプリIDの設定ミス', 9: '在庫なし（メディエーション）' };
function admobErrorInfo(e) {
  const code = e && (e.code ?? (e.data && e.data.code)), msg = String((e && (e.message || e.errorMessage)) || e || '');
  const m = code == null ? /code[^0-9]*(\d+)/i.exec(msg) : null, c = code != null ? Number(code) : m ? Number(m[1]) : null;
  return { code: c, name: c != null && ADMOB_ERROR_NAMES[c] ? ADMOB_ERROR_NAMES[c] : '', msg: msg.slice(0, 120) };
}
function admobErrorText() { const e = admobLastError; if (!e) return ''; return `（エラー${e.code != null ? ' ' + e.code : ''}${e.name ? '：' + e.name : ''}）`; }
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
  const finish = (ok, why) => { if (!admobBusy) return; admobBusy = false; hs.forEach(h => { try { h.remove(); } catch (e) {} }); try { if (typeof audioCtx !== 'undefined' && audioCtx && audioCtx.state === 'suspended') audioCtx.resume(); } catch (e) {} admobPreloaded = false; setTimeout(() => done(ok, why), 350); }; // 次の動画は、戦闘の画面が見えていないときに先読みする（下の admobIdlePrepare） // 画面の処理（ごほうび・ダイアログ）は、広告の知らせの中ではなく、広告の画面が閉じきってから少しあとに行う（AdMob のコールバックと同じ流れで画面をいじると落ちやすい）
  try {
    hs.push(await A.addListener('onRewardedVideoAdReward', () => { rewarded = true; })); // ここでは印を付けるだけ（画面の処理はしない）
    hs.push(await A.addListener('onRewardedVideoAdDismissed', () => finish(rewarded, rewarded ? '' : 'closed')));
    hs.push(await A.addListener('onRewardedVideoAdFailedToShow', () => finish(false, 'show')));
    if (!(await admobPrepare())) { finish(false, 'load'); return; }
    try { if (typeof audioCtx !== 'undefined' && audioCtx && audioCtx.state === 'running') audioCtx.suspend(); } catch (e) {} // 広告の音とゲームの音が重ならないように
    const item = await A.showRewardVideoAd({ adId: ADMOB_REWARDED_ID }); if (item) rewarded = true; // 本番の広告ユニットを指定して流す（テストで読み込んだテスト広告を流さないように）
  } catch (e) { finish(false, 'show'); }
}
// 動画広告の読み込みについて：
// ・AdMob の立ち上げ（MobileAds.initialize）は、MainActivity が起動時に裏のスレッドで済ませる。
// ・本番の動画の読み込み（6〜9秒）の間、Android では広告の WebView とゲームの WebView が処理を取り合い、ゲームが1〜2秒止まる
//   （ゲームの画面が広い・長押しチャージ中ほど長い。テスト広告ではほぼ止まらない）。
// ・そのため戦闘中は読み込まない。戦闘の画面が止まっているとき（ほかのページを開いている・一時停止・宝箱などの画面）にだけ先読みする。
// ・先読みが済んでいないときは、動画のボタンを押したとき「動画を読み込み中…」の画面の間に読み込む（admobShowRewarded）。
function admobBattleHidden() { return (typeof activeTabCache !== 'undefined' && activeTabCache !== 'game') || (typeof phase !== 'undefined' && phase === 'paused') || (typeof userPaused !== 'undefined' && userPaused); }
function admobIdlePrepare() {
  if (!admobPlugin() || admobPreloaded || admobLoading || admobBusy || document.hidden) return;
  if (typeof isAdFree === 'function' && isAdFree()) return; // 紋章（広告なし）なら読み込まない
  if (admobBattleHidden()) admobPrepare();
}
setInterval(() => { if (window.requestIdleCallback) requestIdleCallback(admobIdlePrepare, { timeout: 1500 }); else admobIdlePrepare(); }, 2000); // ブラウザの手が空いたときに呼ぶ（iPhone の WKWebView には requestIdleCallback がないので、そのときはそのまま呼ぶ）
// デバッグ：リワード動画のテスト。必ず Google のテスト用の広告ユニットで流す（本番の広告を自分で見ないように）
const ADMOB_TEST_REWARDED_ID = ADMOB_PLATFORM === 'ios' ? 'ca-app-pub-3940256099942544/1712485313' : 'ca-app-pub-3940256099942544/5224354917'; // Google のテスト用（機種ごと）
async function admobDebugTest() {
  const A = admobPlugin(), row = (k, v) => `<div class="dl-r"><b>${k}</b>　${v}</div>`;
  const info = () => `<div class="dbg-list">${row('アプリの中', A ? 'はい（AdMob の部品あり）' : 'いいえ（ブラウザ・アーティファクト：仮の動画）')}${row('本番の広告ユニット', ADMOB_REWARDED_ID)}${row('本番でテスト設定', ADMOB_TESTING ? 'ON' : 'OFF')}${row('初期化', admobReady ? '済み' : 'まだ')}${row('本番の広告の読み込み', admobPreloaded ? '済み' : 'まだ')}${row('本番の最後のエラー', admobLastError ? `${admobErrorText()} ${admobLastError.msg}` : 'なし')}</div>`;
  if (!A) { simpleChoice({ icon: '🎬', title: 'リワード動画のテスト', text: info(), sub: 'アプリ（Android）の中で押すと、テスト用の広告を流します', yes: '閉じる', no: false }); return; }
  if (admobBusy) { showNotice('🎬 広告を表示中です'); return; }
  showNotice('🎬 テスト用の広告を読み込み中…');
  if (!(await admobInit())) { simpleChoice({ icon: '⚠️', title: 'AdMob を初期化できません', text: info(), yes: '閉じる', no: false }); return; }
  admobBusy = true; let rewarded = false; const hs = [], t0 = Date.now();
  const end = (title, why) => { if (!admobBusy) return; admobBusy = false; hs.forEach(h => { try { h.remove(); } catch (e) {} }); try { if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume(); } catch (e) {} admobPreloaded = false; setTimeout(admobPrepare, 1500);
    simpleChoice({ icon: rewarded ? '✅' : '⚠️', title, text: info() + `<div class="dbg-list">${row('結果', why)}${row('かかった時間', ((Date.now() - t0) / 1000).toFixed(1) + '秒')}</div>`, sub: 'テスト用の広告なので、報酬（ジェム）は配りません', yes: '閉じる', no: false }); };
  try {
    hs.push(await A.addListener('onRewardedVideoAdReward', () => { rewarded = true; })); // ここでは印を付けるだけ（画面の処理はしない）
    hs.push(await A.addListener('onRewardedVideoAdDismissed', () => end(rewarded ? '最後まで見られました' : '途中で閉じました', rewarded ? '報酬の合図あり（本番なら報酬を渡す）' : '報酬の合図なし')));
    hs.push(await A.addListener('onRewardedVideoAdFailedToShow', e => end('広告を表示できません', JSON.stringify(e || {}))));
    try { await A.prepareRewardVideoAd({ adId: ADMOB_TEST_REWARDED_ID, isTesting: true }); } catch (e) { end('広告を読み込めません', JSON.stringify(e && (e.message || e.code) || e)); return; }
    try { if (audioCtx && audioCtx.state === 'running') audioCtx.suspend(); } catch (e) {}
    const item = await A.showRewardVideoAd({ adId: ADMOB_REWARDED_ID }); if (item) rewarded = true; // 本番の広告ユニットを指定して流す（テストで読み込んだテスト広告を流さないように）
  } catch (e) { end('広告を表示できません', String(e && e.message || e)); }
} // 起動して少ししたら1本読み込んでおく

// デバッグ：AdMob の立ち上げ・動画の読み込みで、ゲームの画面がどれだけ止まるかを測る（Android と iPhone で比べる用）。
// テスト用の広告ユニットで読み込むだけ（表示はしない）。新規インストール直後（まだ一度も広告を読み込んでいない状態）で押すのがいちばん分かりやすい
async function admobFreezeTest(prod) { // prod：本番の広告ユニットで読み込む（表示はしないので、見られた数・収益には入らない）
  const A = admobPlugin();
  if (!A) { simpleChoice({ icon: '⏱', title: '広告の読み込みテスト', text: 'アプリの中でだけ測れます（ブラウザ・アーティファクトには AdMob がありません）', yes: 'OK', no: false }); return; }
  const box = document.createElement('div'); box.style.cssText = 'position:fixed;left:50%;top:40%;transform:translate(-50%,-50%);z-index:300;background:rgba(0,0,0,0.85);color:#fff;font:900 20px sans-serif;padding:14px 20px;border-radius:12px;text-align:center;line-height:1.5;'; document.body.appendChild(box);
  let worst = 0, worstAt = '', last = performance.now(), stage = '準備', run = true; const t0 = performance.now(), log = [];
  const tick = () => { const now = performance.now(), gap = now - last; last = now; if (gap > worst) { worst = gap; worstAt = stage; } box.innerHTML = `⏱ ${((now - t0) / 1000).toFixed(1)}秒<br><small>${stage}</small><br><small>いちばん長い止まり ${Math.round(worst)}ms</small>`; if (run) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
  const step = async (name, fn) => { stage = name; const s = performance.now(); let ok = true, err = ''; try { await fn(); } catch (e) { ok = false; err = String((e && (e.message || e.code)) || e).slice(0, 80); } log.push(`${name}：${Math.round(performance.now() - s)}ms${ok ? '' : '（失敗 ' + err + '）'}`); };
  await new Promise(r => setTimeout(r, 600)); // 測り始めの基準
  await step('立ち上げ（initialize）', () => A.initialize({ initializeForTesting: true }));
  if (prod) await step('動画の読み込み（本番の広告）', async () => { await A.prepareRewardVideoAd({ adId: ADMOB_REWARDED_ID, isTesting: ADMOB_TESTING }); admobPreloaded = true; }); // 読み込んだ本番の広告は、次に動画のボタンを押したときにそのまま使う
  else await step('動画の読み込み（テスト広告）', () => A.prepareRewardVideoAd({ adId: ADMOB_TEST_REWARDED_ID, isTesting: true }));
  stage = '読み込み後'; await new Promise(r => setTimeout(r, 1500)); run = false; box.remove();
  simpleChoice({ icon: '⏱', title: '広告の読み込みテスト（' + ADMOB_PLATFORM + (prod ? '・本番' : '・テスト広告') + '）', text: `<div class="dbg-list"><div class="dl-r"><b>いちばん長い止まり</b>　${Math.round(worst)}ms（${worstAt}）</div>${log.map(t => `<div class="dl-r">${t}</div>`).join('')}</div>`, sub: '止まり＝画面の更新が止まった時間。100ms を超えると引っかかりを感じ、1000ms 以上は固まって見える。新規インストール直後の1回目で測るのがいちばん分かりやすい', yes: 'OK', no: false });
}
