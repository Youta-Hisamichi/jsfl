// ===== アプリ内課金（Google Play・App Store） =====
// ストアのアプリ（Capacitor の中）では、課金ショップのジェム袋とサブスク（紋章）を、本物のストアの購入にする（@capgo/native-purchases）。
// claude.ai のアーティファクト・ブラウザでは、いままでどおりデバッグの「リアルマネー」で買う（このファイルは何もしない）。
// ストアに登録する商品 ID（Google Play Console・App Store Connect で同じ ID にする）
//   ジェム袋（消費型）：mh_gem_small / mh_gem_medium / mh_gem_large / mh_gem_huge
//   サブスク（自動更新・1か月）：mh_sub_veteran / mh_sub_hero
//     Google Play：定期購入の中に「基本プラン」を作り、ID を monthly にする（毎月自動更新）
//     App Store：2つを同じ「サブスクリプショングループ」に入れる（上位は伝説の勇者の紋章）
const IAP_GEMS = { small: { sku: 'mh_gem_small', gems: 20 }, medium: { sku: 'mh_gem_medium', gems: 110 }, large: { sku: 'mh_gem_large', gems: 605 }, huge: { sku: 'mh_gem_huge', gems: 1331 } };
const IAP_SUBS = { veteran: { sku: 'mh_sub_veteran' }, hero: { sku: 'mh_sub_hero' } };
const IAP_ANDROID_PLAN = 'monthly'; // Google Play の基本プランの ID
const IAP_SUB_GRACE_MS = 3 * 864e5; // ストアで有効と確かめられたら、少なくとも3日は有効にしておく（電波がない日も切れないように）。起動のたびに確かめ直す
const IAP_TERMS_URL = 'https://mugenhansya.web.app/terms/', IAP_PRIVACY_URL = 'https://mugenhansya.web.app/privacy/';
function iapPlugin() { try { const C = window.Capacitor; return C && typeof C.isNativePlatform === 'function' && C.isNativePlatform() && C.Plugins && C.Plugins.NativePurchases ? C.Plugins.NativePurchases : null; } catch (e) { return null; } }
function iapActive() { return !!iapPlugin(); }
const IAP_PLATFORM = (() => { try { return window.Capacitor && window.Capacitor.getPlatform ? window.Capacitor.getPlatform() : 'web'; } catch (e) { return 'web'; } })();
let iapPrices = {}, iapBusy = false, iapReadyP = null;
function iapPriceText(sku, fallbackYen, perMonth) { // ストアから読めた値段（その国の通貨）を出す。読めないうちは円の目安
  const p = iapPrices[sku]; if (p) return `${p}${perMonth ? '<small> / 月</small>' : ''}`;
  return `${Number(fallbackYen).toLocaleString('ja-JP')}<small>円${perMonth ? ' / 月' : ''}</small>`;
}
async function iapLoadPrices() {
  const P = iapPlugin(); if (!P) return;
  try { const r = await P.getProducts({ productIdentifiers: Object.values(IAP_GEMS).map(x => x.sku), productType: 'inapp' }); for (const pr of r.products || []) iapPrices[pr.identifier] = pr.priceString; } catch (e) { console.warn('ジェム袋の値段を読めません', e); }
  try { const r = await P.getProducts({ productIdentifiers: Object.values(IAP_SUBS).map(x => x.sku), productType: 'subs' }); for (const pr of r.products || []) iapPrices[pr.identifier] = pr.priceString; } catch (e) { console.warn('紋章の値段を読めません', e); }
  if (typeof renderSupergemShopList === 'function') try { renderSupergemShopList(); } catch (e) {}
}
// サブスクがストアで有効かを確かめて、ゲームの「紋章」の期限に反映する（起動したとき・アプリに戻ったとき・購入を復元したとき）
async function iapSyncSubs(showResult) {
  const P = iapPlugin(); if (!P) return null;
  let list;
  try { list = (await P.getPurchases({ productType: 'subs', onlyCurrentEntitlements: true })).purchases || []; }
  catch (e) { console.warn('サブスクを確かめられません', e); if (showResult) showNotice('⚠️ ストアにつながりません。電波のよいところでもう一度お試しください', true, 3000); return null; }
  game.subscriptions = game.subscriptions || {}; game.iapSubSeen = game.iapSubSeen || {};
  const found = [];
  for (const id in IAP_SUBS) {
    const sku = IAP_SUBS[id].sku, t = list.find(x => x.productIdentifier === sku && x.isActive !== false && !x.revocationDate && (x.purchaseState == null || String(x.purchaseState) === '1' || /purchased/i.test(String(x.purchaseState))));
    if (t) {
      const exp = t.expirationDate ? Date.parse(t.expirationDate) : 0;
      game.subscriptions[id] = Math.max(Date.now() + IAP_SUB_GRACE_MS, exp || 0); game.iapSubSeen[id] = true; found.push(id);
    } else if (game.iapSubSeen[id]) { game.subscriptions[id] = 0; game.iapSubSeen[id] = false; } // ストアで解約・期限切れになったら紋章も外す（ストアで買った紋章だけ）
  }
  iapAfterChange(); saveGame();
  if (showResult) showNotice(found.length ? `✅ 購入を復元しました（${found.map(id => SUBSCRIPTIONS[id].name).join('・')}）` : '復元できる紋章（サブスク）はありませんでした', !found.length, 3000);
  return found;
}
function iapAfterChange() {
  try { refreshPlayerBallStats(false); } catch (e) {}
  try { if (typeof refreshCompanionBalls === 'function' && phase === 'battle') refreshCompanionBalls(); } catch (e) {}
  try { updateStatsUI(); updateHPUI(); updateRewardAdButtons(); renderShopList(); renderSupergemShopList(); renderUpgradeList(); renderCoinShopList(); renderCompanionList(); } catch (e) {}
}
function iapCancelled(e) { const m = String((e && (e.code || e.message)) || e || ''); return (m === '1' || /cancel/i.test(m)) && !/network|unavailable/i.test(m); } // 自分でやめたときは何も言わない
async function iapBuyGems(id) {
  const P = iapPlugin(), it = IAP_GEMS[id]; if (!P || !it || iapBusy) return;
  iapBusy = true; game.iapGranted = game.iapGranted || [];
  try {
    const t = await P.purchaseProduct({ productIdentifier: it.sku, productType: 'inapp', quantity: 1, isConsumable: true });
    const tid = t && (t.transactionId || t.orderId || t.purchaseToken);
    if (tid && game.iapGranted.includes(tid)) return; // 同じ購入で2回は配らない
    if (tid) game.iapGranted = game.iapGranted.concat(tid).slice(-50);
    game.gems += it.gems; game.iapTotal = (game.iapTotal || 0) + 1; saveGame(); updateStatsUI();
    celebrateGemPurchase({ small: 1, medium: 2, large: 3, huge: 4 }[id] || 1, it.gems);
  } catch (e) {
    if (!iapCancelled(e)) { console.warn('購入できませんでした', e); showNotice('⚠️ 購入できませんでした。時間をおいてもう一度お試しください', true, 3000); }
  } finally { iapBusy = false; }
}
async function iapBuySub(id) {
  const P = iapPlugin(), it = IAP_SUBS[id]; if (!P || !it || iapBusy) return;
  if (isSubActive(id) && (game.iapSubSeen || {})[id]) { try { await P.manageSubscriptions(); } catch (e) {} return; } // 加入中なら、ストアのサブスク管理を開く（解約・変更はストアで）
  iapBusy = true;
  try {
    const t = await P.purchaseProduct({ productIdentifier: it.sku, productType: 'subs', planIdentifier: IAP_ANDROID_PLAN, quantity: 1 });
    game.subscriptions = game.subscriptions || {}; game.iapSubSeen = game.iapSubSeen || {};
    const exp = t && t.expirationDate ? Date.parse(t.expirationDate) : 0;
    game.subscriptions[id] = Math.max(Date.now() + IAP_SUB_GRACE_MS, exp || 0); game.iapSubSeen[id] = true;
    iapAfterChange(); saveGame();
    celebrateGemPurchase(id === 'hero' ? 4 : 3, 0, { title: id === 'hero' ? '勇者の証、授かる！' : '熟練者の証、授かる！', countText: `${SUBSCRIPTIONS[id].icon} ${SUBSCRIPTIONS[id].name}` });
    setTimeout(() => iapSyncSubs(false), 4000); // ストアの正しい期限で上書き
  } catch (e) {
    if (!iapCancelled(e)) { console.warn('購入できませんでした', e); showNotice('⚠️ 購入できませんでした。時間をおいてもう一度お試しください', true, 3000); }
  } finally { iapBusy = false; }
}
// 課金ページのボタンは1枚絵で、値段（円）も絵に描いてある。ストアから値段が読めたら、絵の値段の札の上に同じ形の札を重ねて、その国の通貨の値段を出す
function iapPill(btn, sku, perMonth, yen) { // ストアの値段が読めないとき（ブラウザ版・読み込み前）は、円の値段の札を重ねる（絵の値段と、ストアで選べる値段がちがうことがあるため）
  if (btn.querySelector('.iap-pill')) return;
  const p = (sku && iapPrices[sku]) || (yen ? `${Number(yen).toLocaleString('ja-JP')}<small>円</small>` : ''); if (!p) return;
  btn.insertAdjacentHTML('beforeend', `<span class="iap-pill">${p}${perMonth ? '<small> / 月</small>' : ''}</span>`);
}
// 課金ページの値段の札は、ストアのアプリでもブラウザ版でも、いつも絵の上に重ねる
{ const orig = renderSupergemShopList; renderSupergemShopList = function () {
  orig.apply(this, arguments);
  if (iapActive()) return; // ストアのアプリは下の書きかえで重ねる
  const el = document.getElementById('supergemShopList'); if (!el) return;
  el.querySelectorAll('[data-supergem-shop]').forEach(b => { const it = SUPERGEM_SHOP_ITEMS[b.dataset.supergemShop]; if (it) iapPill(b, null, false, it.cost); });
  el.querySelectorAll('[data-sub-shop]').forEach(b => { const s = SUBSCRIPTIONS[b.dataset.subShop]; if (s) iapPill(b, null, true, s.cost); });
}; }
// 課金ショップの下に：自動更新の説明と規約のリンク（App Store の審査で必要）。「購入を復元」「サブスクの管理・解約」のボタンは設定ページ
function iapFooterHtml() {
  if (!iapActive()) return '';
  const store = IAP_PLATFORM === 'ios' ? 'App Store' : 'Google Play';
  return `<div class="iap-foot">
    <p>紋章は1か月ごとに自動で更新されるサブスクリプションです。料金は購入の確定時に${store}のアカウントに請求され、期間が終わる24時間前までに解約しないかぎり、同じ料金で自動更新されます。解約は、設定の「サブスクの管理・解約」（${store}の設定）からいつでもできます。機種変更などのときは、設定の「購入を復元」で戻せます。ジェムは買ったその場で届き、返品はできません。</p>
    <p><a href="${IAP_TERMS_URL}" target="_blank" rel="noopener">利用規約</a>　<a href="${IAP_PRIVACY_URL}" target="_blank" rel="noopener">プライバシーポリシー</a></p></div>`;
}
document.addEventListener('click', ev => {
  const b = ev.target.closest && ev.target.closest('[data-iap]'); if (!b) return;
  const P = iapPlugin(); if (!P) return;
  if (b.dataset.iap === 'restore') iapSyncSubs(true);
  if (b.dataset.iap === 'manage') P.manageSubscriptions().catch(() => showNotice('⚠️ ストアのサブスク管理を開けませんでした', true, 2500));
});
if (iapActive()) {
  ['iapRestoreBtn', 'iapManageBtn'].forEach(id => { const b = document.getElementById(id); if (b) b.style.display = ''; }); // 設定ページの「購入を復元」「サブスクの管理・解約」（ストアのアプリだけ）
  setTimeout(() => { iapLoadPrices(); iapSyncSubs(false); }, 2500);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') iapSyncSubs(false); });
  // 課金ショップの表示：値段をストアのものに、ボタンは「リアルマネー」の残りに関係なく押せる
  { const orig = renderSupergemShopList; renderSupergemShopList = function () {
    orig.apply(this, arguments);
    const el = typeof supergemShopList !== 'undefined' ? supergemShopList : document.getElementById('supergemShopList'); if (!el) return;
    el.querySelectorAll('[data-supergem-shop]').forEach(b => { const id = b.dataset.supergemShop; b.classList.remove('is-disabled'); const pr = b.querySelector('.gb-price'); if (pr && IAP_GEMS[id]) pr.innerHTML = iapPriceText(IAP_GEMS[id].sku, SUPERGEM_SHOP_ITEMS[id].cost); iapPill(b, IAP_GEMS[id].sku, false, SUPERGEM_SHOP_ITEMS[id].cost); });
    el.querySelectorAll('[data-sub-shop]').forEach(b => {
      const id = b.dataset.subShop, active = getActiveSub(), covered = !isSubActive(id) && active && active.rank > SUBSCRIPTIONS[id].rank;
      b.classList.toggle('is-disabled', !!covered);
      const pr = b.querySelector('.sub-price'); if (pr && IAP_SUBS[id]) { pr.innerHTML = iapPriceText(IAP_SUBS[id].sku, SUBSCRIPTIONS[id].cost, true); iapPill(b, IAP_SUBS[id].sku, true, SUBSCRIPTIONS[id].cost); }
      const st = b.querySelector('.sub-status'); if (st) st.textContent = isSubActive(id) ? '✅ 加入中・タップで管理' : covered ? '上位の紋章で有効中' : '1か月ごとの自動更新';
    });
    el.insertAdjacentHTML('beforeend', iapFooterHtml());
  }; }
}
