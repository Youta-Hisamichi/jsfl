// ---- レビューのお願い（気分が最高潮のときだけ・控えめに）／デバッグ：遺物一覧・イベント確認 ----

// ===== レビュー要請：嬉しい瞬間の直後に1回だけ。断られたら長く空ける =====
// 出す条件：ある程度遊んでいる（3日以上 or 転生1回以上）・ボスに負けた直後ではない・前回から日数が空いている
const REVIEW_URL = ''; // ストア公開後に設定（空ならお礼だけ）
const REVIEW_HAPPY = { bossFirst: 3, rare: 4, record: 3, rebirth: 5, forbidden: 5 }; // 嬉しさの点数
let reviewScore = 0, reviewLastBad = 0;
function reviewEligible() {
  const r = game.review || {};
  if (r.done || r.never) return false;
  if (r.nextAt && Date.now() < r.nextAt) return false;
  const days = Object.keys(game.playDays || {}).length;
  if (days < 3 && !(game.reincarnations > 0)) return false;
  if ((game.playTimeMs || 0) < 40 * 60000) return false; // 40分以上遊んでから
  if (Date.now() - reviewLastBad < 5 * 60000) return false; // 負けた直後は出さない
  return true;
}
function reviewHappy(kind) {
  reviewScore += REVIEW_HAPPY[kind] || 1;
  if (reviewScore >= 5 && reviewEligible()) { reviewScore = 0; setTimeout(openReviewAsk, 3500); }
}
function openReviewAsk(force) {
  if (!force && (document.querySelector('.modal-overlay.show') || phase !== 'battle')) { setTimeout(() => openReviewAsk(force), 4000); return; }
  if (!game.review) game.review = {};
  game.review.asked = (game.review.asked || 0) + 1;
  const prev = phase; phase = 'paused';
  const ov = document.createElement('div'); ov.className = 'modal-overlay show'; ov.style.zIndex = 86;
  const hid = getHeroChar(), img = hid ? companionIconHtml(hid) : `<img class="comp-sprite" src="${PLAYER_SPRITE}" alt="">`;
  ov.innerHTML = `<div class="modal-panel rv-panel"><div class="rv-ico">${img}</div>
    <div class="rv-title">冒険、楽しんでる？</div>
    <div class="rv-text">ここまで遊んでくれてありがとう！<br>もし気に入ってくれたら、<b>★5のレビュー</b>で応援してもらえると開発の励みになります🙏</div>
    <div class="rv-stars">★★★★★</div>
    <button class="modal-close-btn rv-yes">⭐ レビューで応援する</button>
    <button class="modal-shop-btn rv-later" style="justify-content:center;"><span class="msb-name">あとで</span></button>
    <button class="rv-no">ちょっと不満がある…</button></div>`;
  document.body.appendChild(ov);
  const close = () => { ov.remove(); phase = prev === 'paused' ? 'battle' : prev; saveGame(); };
  ov.querySelector('.rv-yes').onclick = () => {
    game.review.done = true; game.gems += 10; updateStatsUI();
    if (REVIEW_URL) window.open(REVIEW_URL, '_blank');
    close(); showNotice('🙏 応援ありがとう！ お礼に 💎10', false, 3000); playLoginBonusSound && playLoginBonusSound();
  };
  ov.querySelector('.rv-later').onclick = () => { game.review.nextAt = Date.now() + 3 * 864e5; close(); }; // 3日後にまた
  ov.querySelector('.rv-no').onclick = () => { // 不満はレビューに行かず、ご意見として受け止める
    game.review.nextAt = Date.now() + 30 * 864e5;
    ov.querySelector('.rv-panel').innerHTML = `<div class="rv-title">ご意見ありがとう</div><div class="rv-text">どこが不満でしたか？ 今後の改善に使わせてください。</div><textarea class="rv-fb" placeholder="自由に書いてください"></textarea><button class="modal-close-btn rv-send">送る</button>`;
    ov.querySelector('.rv-send').onclick = () => { const t = ov.querySelector('.rv-fb').value.trim(); if (t) { game.review.feedback = (game.review.feedback || []).concat(t).slice(-5); } close(); showNotice('📝 ご意見ありがとうございました', false, 2500); };
  };
}
// プレイした日を記録
{ const k = todayKey(); if (!game.playDays) game.playDays = {}; game.playDays[k] = 1; }
// 嬉しい瞬間につなぐ
if (typeof markBossBeaten === 'function') { const o = markBossBeaten; markBossBeaten = function (em) { const first = !(game.bossBeaten && game.bossBeaten[em]); o.apply(this, arguments); if (first) reviewHappy('bossFirst'); }; }
if (typeof rareCutIn === 'function') { const o = rareCutIn; rareCutIn = function () { o.apply(this, arguments); reviewHappy('rare'); }; }
if (typeof showRunBanner === 'function') { const o = showRunBanner; showRunBanner = function (t) { o.apply(this, arguments); if (/新記録|実績|ドロップ/.test(t)) reviewHappy('record'); }; }
if (typeof startNextRun === 'function') { const o = startNextRun; startNextRun = function () { o.apply(this, arguments); reviewHappy('rebirth'); }; }
if (typeof bossDefeated === 'function') { const o = bossDefeated; bossDefeated = function () { reviewLastBad = Date.now(); reviewScore = 0; return o.apply(this, arguments); }; }

// ===== デバッグ：遺物一覧 =====
function openArtifactDebug() {
  const ov = document.createElement('div'); ov.className = 'modal-overlay show'; ov.style.zIndex = 90;
  const row = a => { const n = (game.ownedArtifacts && game.ownedArtifacts[a.id]) || 0, lim = ARTIFACT_STACK_LIMIT[a.id], on = isArtifactShown(a.id), r = RARITY_INFO[a.rarity];
    return `<div class="dbga-row ${on ? '' : 'off'}"><span class="dbga-ico">${ico(a)}</span><span class="dbga-main"><b style="color:${r.color}">${rarityStars(a.rarity)} ${a.name}</b><small>${a.desc}</small><small>${on ? '有効' : '非表示（効果なし）'}${BOSS_DROP_ONLY && BOSS_DROP_ONLY.includes(a.id) ? '・ボスドロップ限定' : ''}${SHOP_ITEMS[a.id] ? '・ショップ販売' : ''}</small></span><span class="dbga-n">${n}${lim ? '/' + lim : ''}<button data-dbga="${a.id}" data-d="1">＋</button><button data-dbga="${a.id}" data-d="-1">－</button></span></div>`; };
  const shown = ARTIFACT_ALL.filter(a => isArtifactShown(a.id)), hidden = ARTIFACT_ALL.filter(a => !isArtifactShown(a.id));
  ov.innerHTML = `<div class="modal-panel dbga-panel"><div class="evd-title">🏺 遺物一覧（全${ARTIFACT_ALL.length}種・有効${shown.length}）</div><div class="dbga-list">${shown.map(row).join('')}<div class="dbga-sep">― 非表示の遺物 ―</div>${hidden.map(row).join('')}</div><button class="modal-close-btn dbga-close">閉じる</button></div>`;
  document.body.appendChild(ov);
  ov.querySelector('.dbga-close').onclick = () => ov.remove();
  ov.querySelectorAll('[data-dbga]').forEach(b => b.onclick = () => { const id = b.dataset.dbga; game.ownedArtifacts[id] = Math.max(0, (game.ownedArtifacts[id] || 0) + +b.dataset.d); ov.remove(); openArtifactDebug(); renderArtifactList(); updateStatsUI(); });
}

// ===== デバッグ：イベント確認 =====
function openEventDebug() {
  const ov = document.createElement('div'); ov.className = 'modal-overlay show'; ov.style.zIndex = 90;
  const days = ['日', '月', '火', '水', '木', '金', '土'];
  ov.innerHTML = `<div class="modal-panel dbga-panel"><div class="evd-title">🎪 イベント確認（デバッグ）</div>
    <div class="dbge-h">⚡ ゲリライベント</div><div class="dbge-g">${GUERRILLAS.map(g => `<button data-ge="${g.key}">${g.icon}${g.name}</button>`).join('')}<button data-ge="stop">⏹ 終了</button></div>
    <div class="dbge-h">📅 曜日イベント（今日を差し替え）</div><div class="dbge-g">${WEEKDAY_EVENTS.map((e, i) => `<button data-wd="${i}">${days[i]} ${e.icon}</button>`).join('')}<button data-wd="off">戻す</button></div>
    <div class="dbge-h">🗓️ 季節イベント（月を差し替え）</div><div class="dbge-g">${MONTH_EVENTS.map((e, i) => `<button data-mo="${i}">${i + 1}月 ${e.icon}</button>`).join('')}<button data-mo="off">戻す</button></div>
    <div class="dbge-g"><button data-mi="10">季節アイテム +10</button><button data-mi="reset">季節リセット</button></div>
    <div class="dbge-h">その他</div><div class="dbge-g"><button data-x="banner">今日のお知らせ</button><button data-x="list">イベント一覧</button><button data-x="review">⭐ レビュー要請</button><button data-x="fortune">🔮 占い</button></div>
    <button class="modal-close-btn dbga-close">閉じる</button></div>`;
  document.body.appendChild(ov);
  ov.querySelector('.dbga-close').onclick = () => ov.remove();
  ov.onclick = e => {
    const b = e.target.closest('button'); if (!b) return; const d = b.dataset;
    if (d.ge) { if (d.ge === 'stop') game.guerrilla = null; else startGuerrilla(d.ge); renderEventChip(); }
    if (d.wd) { dbgWeekday = d.wd === 'off' ? null : +d.wd; showNotice(`DEBUG: 曜日 ${d.wd === 'off' ? '元に戻す' : WEEKDAY_EVENTS[+d.wd].name}`); renderEventChip(); }
    if (d.mo) { dbgMonth = d.mo === 'off' ? null : +d.mo; game.monthEv = null; showNotice(`DEBUG: 季節 ${d.mo === 'off' ? '元に戻す' : MONTH_EVENTS[+d.mo].name}`); renderEventChip(); }
    if (d.mi) { if (d.mi === 'reset') game.monthEv = null; else { monthState().n += 10; giveMonthRewards(); } renderEventChip(); }
    if (d.x === 'banner') { game.eventNoticeDate = null; const w = weekdayEvent(), ev = monthEvent(); eventBanner(`${w.icon} 今日は「${w.name}」`, `${w.desc}／${ev.icon} ${ev.name}開催中`); }
    if (d.x === 'list') { ov.remove(); openEventDialog(); }
    if (d.x === 'review') { ov.remove(); openReviewAsk(true); }
    if (d.x === 'fortune') { ov.remove(); openFortune(); }
  };
}
let dbgWeekday = null, dbgMonth = null;
{ const ow = weekdayEvent; weekdayEvent = function () { return dbgWeekday != null ? WEEKDAY_EVENTS[dbgWeekday] : ow(); }; }
{ const om = monthEvent; monthEvent = function () { return dbgMonth != null ? MONTH_EVENTS[dbgMonth] : om(); }; }
