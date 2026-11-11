// ===== AdMob（スマホアプリ版の動画広告） =====
// ストアのアプリ（Capacitor の中）では、playRewardedVideo の仮の動画のかわりに、AdMob のリワード広告を流す。
// claude.ai のアーティファクト・ブラウザでは、いままでどおり仮の動画（このファイルは何もしない）。
// ・本番の ID。自分の端末で試すときは、AdMob の「設定 → テストデバイス」に端末を登録してテスト広告にする（自分で本番の広告を見たり押したりしない）
// ・テスト用に戻すとき：広告ユニットを ca-app-pub-3940256099942544/5224354917、ADMOB_TESTING を true に
// ・アプリ ID（ca-app-pub-…~…）は app/android/app/src/main/res/values/strings.xml の admob_app_id
const ADMOB_REWARDED_ID = 'ca-app-pub-3193231960637976/9776778979'; // 本番のリワード広告ユニット（動画報酬）
const ADMOB_TESTING = false;
function admobPlugin() { try { const C = window.Capacitor; return C && typeof C.isNativePlatform === 'function' && C.isNativePlatform() && C.Plugins && C.Plugins.AdMob ? C.Plugins.AdMob : null; } catch (e) { return null; } }
let admobReady = null, admobPreloaded = false, admobBusy = false;
function admobInit() {
  const A = admobPlugin(); if (!A) return Promise.resolve(false);
  if (!admobReady) admobReady = A.initialize({ initializeForTesting: ADMOB_TESTING }).then(() => true, e => { console.warn('AdMob を初期化できません', e); admobReady = null; return false; });
  return admobReady;
}
async function admobPrepare() { // 次の広告を先に読み込んでおく（押してから待たせない）
  const A = admobPlugin(); if (!A || admobPreloaded) return admobPreloaded;
  if (!(await admobInit())) return false;
  try { await A.prepareRewardVideoAd({ adId: ADMOB_REWARDED_ID, isTesting: ADMOB_TESTING }); admobPreloaded = true; } catch (e) { admobPreloaded = false; }
  return admobPreloaded;
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
setTimeout(() => { if (admobPlugin()) admobPrepare(); }, 3000); // 起動して少ししたら1本読み込んでおく
