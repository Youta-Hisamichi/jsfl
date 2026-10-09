// 序盤の導線：ページ（タブ）を少しずつ解放・初心者ミッション・ボスに負けたときの次の目安
// ---- ページの段階的な解放 ----
const TAB_UNLOCK_STAGE = { upgrade: 2, companion: 5, coinshop: 8, gacha: 11, records: 14, gemshop: 17, ranking: 20 }; // 矢継ぎ早にならないよう間をあける // 到達ステージで解放
const TAB_UNLOCK_INFO = {
  upgrade: 'コインで攻撃力やHPを強化できます',
  records: '目標を達成するとジェムがもらえます',
  companion: '仲間を招集して一緒に戦おう！初回は無料！',
  ranking: 'ほかのプレイヤーと記録を競おう',
  coinshop: 'スキルを覚えて戦いを有利に進めよう',
  gemshop: 'ジェムでアイテムやレア仲間を手に入れよう',
  gacha: 'ジェムで攻撃力・HPを進化させよう',
};
function isTabUnlocked(tab) {
  const need = TAB_UNLOCK_STAGE[tab];
  if (!need || (game.reincarnations || 0) > 0) return true; // 転生したことがあれば全部開いている
  return (game.bestStage || 1) >= need || (Array.isArray(game.unlockedTabs) && game.unlockedTabs.includes(tab));
}
function tabLabel(tab) { const el = document.querySelector(`.tab-btn[data-tab="${tab}"] .tab-label`); return el ? el.textContent : tab; }
const tabUnlockQueue = [];
const TAB_UNLOCK_GAP_MS = 25000; // 解放のお知らせは最低これだけ間をあける
let lastTabUnlockAt = 0;
function updateTabLocks() {
  const first = !Array.isArray(game.unlockedTabs);
  if (first) game.unlockedTabs = [];
  for (const tab in TAB_UNLOCK_STAGE) {
    const open = isTabUnlocked(tab), btn = document.querySelector(`.tab-btn[data-tab="${tab}"]`);
    if (btn) { btn.classList.toggle('tab-locked', !open); btn.dataset.lockStage = TAB_UNLOCK_STAGE[tab]; }
    if (open && !game.unlockedTabs.includes(tab)) {
      game.unlockedTabs.push(tab);
      if (!first && (game.bestStage || 1) < 100) { tabUnlockQueue.push(tab); if (btn) btn.classList.add('has-new'); } // 昔のセーブを読んだときは黙って開く
    }
  }
  if (tabUnlockQueue.length && !document.querySelector('.ob-unlock.show') && Date.now() - lastTabUnlockAt > TAB_UNLOCK_GAP_MS) { lastTabUnlockAt = Date.now(); showTabUnlock(tabUnlockQueue.shift()); }
}
function showTabUnlock(tab) {
  const wrap = document.querySelector('.arena-wrap'); if (!wrap) return;
  let el = document.getElementById('obUnlock');
  if (!el) { el = document.createElement('button'); el.id = 'obUnlock'; el.className = 'ob-unlock'; wrap.appendChild(el); }
  const src = ICON_IMAGES['tab_' + tab];
  el.innerHTML = `<span class="obu-new">NEW!</span>${src ? `<img class="ico-img" src="${src}" alt="">` : ''}<span class="obu-main"><b>「${tabLabel(tab)}」が解放！</b><small>${TAB_UNLOCK_INFO[tab] || ''}</small></span>`;
  el.onclick = () => { el.classList.remove('show'); switchTab(tab); };
  el.classList.remove('show'); void el.offsetWidth; el.classList.add('show');
  playTone(784, 0.12, 'square', 0.05, 1175); setTimeout(() => playTone(1175, 0.18, 'square', 0.05, 1568), 120);
  clearTimeout(el._t); el._t = setTimeout(() => { el.classList.remove('show'); setTimeout(updateTabLocks, 400); }, 4200);
}
document.getElementById('tabBar').addEventListener('click', event => { // 解放前のページは開けない
  const btn = event.target.closest('.tab-btn.tab-locked'); if (!btn) return;
  event.stopImmediatePropagation(); event.preventDefault();
  showTapError(`🔒 ステージ${btn.dataset.lockStage}で解放`, event.clientX, event.clientY);
}, true);

// ---- 初心者ミッション（上から順に1つずつ。達成したらタップで受け取り） ----
function obFlag(key) { if (!game.obFlags) game.obFlags = {}; if (!game.obFlags[key]) { game.obFlags[key] = true; updateMission(); } }
const upLv = id => (game.upgrades && game.upgrades[id]) || 0;
const anyCompanion = () => (game.companionSummons || 0) > 0 || Object.values(game.companions.recruited || {}).some(Boolean);
const BEGINNER_MISSIONS = [
  { text: 'ステージ3に到達する', get: () => game.bestStage || 1, goal: 3, gems: 1 },
  { text: '攻撃力をLv3まで強化する', get: () => upLv('atk'), goal: 3, gems: 1 },
  { text: '溜めMAX（×3）で攻撃する', get: () => game.obFlags && game.obFlags.chargeMax ? 1 : 0, goal: 1, gems: 1, hint: '攻撃せずに待つほど次の一撃が強くなる' },
  { text: '仲間を招集する', get: () => anyCompanion() ? 1 : 0, goal: 1, gems: 2, hint: '仲間ページの招集ガチャ（初回無料）' },
  { text: '「こうかばつぐん！」を出す', get: () => game.obFlags && game.obFlags.superEff ? 1 : 0, goal: 1, gems: 1, hint: '炎→草→水→炎の順に有利' },
  { text: 'スキルガチャを引く', get: () => game.skillGachaPulls || 0, goal: 1, gems: 2 },
  { text: '宝箱を開ける', get: () => game.obFlags && game.obFlags.chest ? 1 : 0, goal: 1, gems: 1, hint: '木箱や柱を壊すと出ることも' },
  { text: 'ステージ10のボスを倒す', get: () => game.bestStage || 1, goal: 11, gems: 3 },
  { text: '最大HPをLv5まで強化する', get: () => upLv('hp'), goal: 5, gems: 1 },
  { text: 'ステージ20に到達する', get: () => game.bestStage || 1, goal: 20, gems: 3 },
  { text: 'ステージ30に到達する', get: () => game.bestStage || 1, goal: 30, gems: 5 },
];
let missionSig = '';
const MISSION_GAP_MS = 20000; let missionHoldUntil = Date.now() + 8000; // 始めてすぐには出さない
function updateMission() {
  const wrap = document.querySelector('.arena-wrap'); if (!wrap) return;
  let el = document.getElementById('obMission');
  if (game.obMission == null) game.obMission = (game.reincarnations || 0) > 0 || (game.bestStage || 1) >= 100 ? BEGINNER_MISSIONS.length : 0; // やり込んだセーブには出さない
  const m = BEGINNER_MISSIONS[game.obMission];
  if (!m) { if (el) el.remove(); return; }
  if (Date.now() < missionHoldUntil || document.querySelector('.ob-unlock.show')) { if (el) el.style.display = 'none'; missionSig = ''; return; } // 解放のお知らせと同時には出さない
  if (el) el.style.display = '';
  if (!el) { el = document.createElement('button'); el.id = 'obMission'; el.className = 'ob-mission'; el.addEventListener('click', claimMission); wrap.appendChild(el); }
  const v = Math.min(m.goal, m.get()), done = v >= m.goal;
  const sig = game.obMission + ':' + v;
  if (sig === missionSig) return;
  missionSig = sig;
  el.classList.toggle('done', done);
  el.innerHTML = `<span class="obm-head">🎯 ミッション ${game.obMission + 1}/${BEGINNER_MISSIONS.length}</span><span class="obm-text">${m.text}${m.goal > 1 ? ` <b>${v}/${m.goal}</b>` : ''}</span>`
    + (done ? `<span class="obm-claim">タップで受け取る 💎${m.gems}</span>` : `<span class="obm-sub">${m.hint ? m.hint + '　' : ''}報酬 💎${m.gems}</span>`);
}
function claimMission(event) {
  const m = BEGINNER_MISSIONS[game.obMission];
  if (!m || m.get() < m.goal) { if (m && m.hint) showTapError('💡 ' + m.hint, event.clientX, event.clientY); return; }
  game.gems += m.gems; game.obMission++; missionHoldUntil = Date.now() + MISSION_GAP_MS; // 次のミッションは少し休んでから
  spawnDamageText(arena.x, arena.y - 30, `🎯 ミッション達成！ +${m.gems} 💎`, '#64e8ff', 0.012, true);
  playTone(1047, 0.1, 'square', 0.05, 1319); setTimeout(() => playTone(1568, 0.2, 'square', 0.05, 2093), 100);
  missionSig = ''; updateMission(); updateStatsUI(); saveGame();
}

// ---- ボスに負けたときの次の目安 ----
function bossAdviceHtml(reason, short) {
  const f = 1 - Math.min(1, Math.max(0, lastBossHpFrac)); // 削れた割合
  const tips = [];
  if (f > 0) tips.push(`ボスのHPを <b>${Math.round(f * 100)}%</b> 削りました`);
  const need = 1 / Math.max(0.05, f); // 同じ時間でボスを倒しきるのに必要な攻撃力の目安（倍）
  if (f >= 0.85) tips.push('あと少し！もう一度挑めば勝てるかも');
  else {
    const L = upLv('atk'); let n = 1;
    while (n < 500 && upgradeLvMult(L + n) / upgradeLvMult(L) < need) n++;
    tips.push(`💡 攻撃力をあと <b>Lv${n}</b> 上げると勝てそう（目安）`);
  }
  if (!short) {
    if (reason !== 'time') tips.push('❤️ 最大HPを上げると長く戦えます');
    if (!anyCompanion() && isTabUnlocked('companion')) tips.push('🐾 仲間を招集すると一緒に戦ってくれます');
    else if (!(game.skillGachaPulls > 0) && isTabUnlocked('coinshop')) tips.push('✨ スキルを覚えると一気に有利に');
  }
  return `<div class="boss-advice">${tips.map(t => `<div>${t}</div>`).join('')}</div>`;
}

setInterval(() => { try { updateTabLocks(); updateMission(); updatePotionButton(); } catch (e) { console.error(e); } }, 500);
updateTabLocks(); updateMission();

// ---- 転生・試練の塔の解放ダイアログ ----
const FEATURE_UNLOCKS = {
  tower: { ok: () => isTowerUnlocked(), img: 'assets/img/ui/bar/btn_tower.webp', title: '🏰 試練の塔が解放！', body: [
    'コイン（好きなステージを指定するときはジェム）を払って、<b>先のステージのボス</b>にいきなり挑戦できます。',
    '勝てばそのステージまで<b>一気にワープ</b>！ 飛ばしたステージが多いほど良い<b>遺物</b>がもらえます。',
    '負けても元のステージに戻るだけなので、気軽に挑戦しよう。',
    '画面下の「試練の塔」ボタンから挑戦できます。'] },
  reborn: { ok: () => isRebornUnlocked(), img: 'assets/img/ui/bar/btn_reborn.webp', title: '🌌 転生が解放！', body: [
    'ステージ1からやり直す代わりに、<b>ずっと強くなる報酬</b>がもらえます。',
    '・<b>転生Lv</b>アップ（深く進むほど多く上がる）<br>・<b>ジェム</b>と<b>進化の羽</b>（ステージの桁数×桁数×10枚）',
    'ボスに勝てなくなって行き詰まったら、転生して一気に駆け上がろう。',
    '画面下の「転生」ボタンから転生できます。'] },
};
const featureUnlockQueue = [];
function updateFeatureUnlocks() {
  const first = !game.featureUnlockSeen;
  if (first) game.featureUnlockSeen = {};
  for (const key in FEATURE_UNLOCKS) {
    if (game.featureUnlockSeen[key] || !FEATURE_UNLOCKS[key].ok()) continue;
    game.featureUnlockSeen[key] = true;
    if (!first && !(game.reincarnations > 0)) featureUnlockQueue.push(key); // 昔のセーブ・転生済みなら黙って開く
  }
  if (!featureUnlockQueue.length || getActiveTab() !== 'game' || phase !== 'battle' || document.querySelector('.modal-overlay.show')) return; // ほかのダイアログやゲームオーバー中は待つ
  showFeatureUnlock(featureUnlockQueue.shift()); saveGame();
}
function showFeatureUnlock(key) {
  const f = FEATURE_UNLOCKS[key];
  let ov = document.getElementById('featureUnlockModal');
  if (!ov) {
    ov = document.createElement('div'); ov.className = 'modal-overlay'; ov.id = 'featureUnlockModal'; ov.style.zIndex = 73;
    ov.innerHTML = '<div class="modal-panel fu-panel"><div class="fu-new">NEW!</div><img class="fu-img" alt=""><h2 class="fu-title"></h2><div class="fu-body"></div><button class="modal-close-btn fu-ok">OK</button></div>';
    document.body.appendChild(ov);
    ov.querySelector('.fu-ok').addEventListener('click', () => { ov.classList.remove('show'); if (typeof refreshBgm === 'function') refreshBgm(); });
  }
  ov.querySelector('.fu-img').src = f.img;
  ov.querySelector('.fu-title').textContent = f.title;
  ov.querySelector('.fu-body').innerHTML = f.body.map(t => `<p>${t}</p>`).join('');
  ov.classList.add('show');
  playTone(784, 0.12, 'square', 0.05, 1175); setTimeout(() => playTone(1568, 0.25, 'square', 0.05, 2093), 140);
}
setInterval(() => { try { updateFeatureUnlocks(); } catch (e) { console.error(e); } }, 700);

// ---- 敵をタップすると名前・属性・相性などを表示 ----
let enemyTapStart = null;
canvas.addEventListener('pointerdown', event => { enemyTapStart = { id: event.pointerId, x: event.clientX, y: event.clientY, t: Date.now() }; });
canvas.addEventListener('pointerup', event => {
  const s = enemyTapStart; enemyTapStart = null;
  if (!s || s.id !== event.pointerId || Date.now() - s.t > 400 || Math.hypot(event.clientX - s.x, event.clientY - s.y) > 12) return; // 短いタップだけ（引っ張り・ドラッグは対象外）
  const rect = canvas.getBoundingClientRect();
  const x = (event.clientX - rect.left) * (size / rect.width), y = (event.clientY - rect.top) * ((sizeH || size) / rect.height);
  const foes = [...balls, ...adds].filter(e => (e.isPlayer ? !e.isClone : !e.isDying && e.hp > 0 && !(e.spawnTimer > 0))); // 味方（自キャラ・仲間）も対象
  let best = null, bd = Infinity;
  for (const e of foes) { const d = Math.hypot(e.x - x, e.y - y); if (d < (e.radius || 12) * 1.4 + 10 && d < bd) { best = e; bd = d; } }
  if (best) (best.isPlayer ? showAllyInfo(best) : showEnemyInfo(best));
});
function showEnemyInfo(e) { // ステージ進捗バーの上に半透明で重ねて出す（戦場をふさがない）
  const host = document.querySelector('.exp-wrap'); if (!host) return;
  let el = document.getElementById('enemyInfoPop');
  if (!el) { el = document.createElement('div'); el.id = 'enemyInfoPop'; el.className = 'enemy-info-pop'; host.appendChild(el); }
  const key = getEnemyBookKey(e.megaOwner || e), book = ENEMY_BOOK_BY_KEY[key];
  const name = e.milestone && !game.skipChallenge ? e.milestone.label : (book && book.name) || (e.isBoss ? 'ボス' : 'モンスター');
  const el2 = getEnemyElement(e), hero = getHeroElement();
  const weak = el2 ? Object.keys(ELEMENT_BEATS).find(k => ELEMENT_BEATS[k] === el2) : null;
  const m = elementMult(hero, el2);
  const aff = !el2 || !hero ? '' : m > 1 ? `<b class="eip-good">こうかばつぐん×${ELEMENT_ADV}</b>` : m < 1 ? `<b class="eip-bad">いまひとつ×${ELEMENT_DIS}</b>` : 'ふつう';
  el.innerHTML = `<div class="eip-name">${e.isBoss ? '👑 ' : ''}${name}<small>Lv.${formatCoinNumber(enemyLevel(game.stage))}　HP ${formatCoinNumber(Math.ceil(e.hp))}/${formatCoinNumber(Math.ceil(e.maxHp || e.hp))}</small></div>`
    + `<div class="eip-row">属性 ${el2 ? elemBadge(el2) : '<span class="el-badge el-none">なし</span>'}${weak ? `　弱点 ${elemBadge(weak)}` : ''}${aff ? `　${aff}` : ''}</div>`;
  el.classList.remove('show'); void el.offsetWidth; el.classList.add('show');
  clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('show'), 2800);
}

// ---- 待ち時間中のスキルを押したら「チャージ中…」と出す ----
document.getElementById('skillRow').addEventListener('click', event => {
  const btn = event.target.closest('.action-btn'); if (!btn || btn.id === 'redPotionBtn') return;
  const m = btn.textContent.match(/(\d+)秒\s*$/); if (!m) return;
  const r = btn.getBoundingClientRect();
  let el = document.getElementById('skillChargePop');
  if (!el) { el = document.createElement('div'); el.id = 'skillChargePop'; el.className = 'skill-charge-pop'; document.body.appendChild(el); }
  el.innerHTML = `⏳ チャージ中…<small>あと${m[1]}秒</small>`;
  el.style.left = (r.left + r.width / 2) + 'px'; el.style.top = r.top + 'px';
  el.classList.remove('show'); void el.offsetWidth; el.classList.add('show');
  playTone(660, 0.06, 'triangle', 0.04, 520);
  clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('show'), 1100);
}, true);

// ---- 次の目標ステージ（50・100・200・300・500・1000…）をそれとなく見せる ----
const GOAL_STAGES = [50, 100, 200, 300, 500, 1000, 2000, 3000, 5000, 10000];
function nextGoalStage() {
  const best = game.bestStage || 1;
  for (const g of GOAL_STAGES) if (best < g) return g;
  let g = 10000; while (g <= best) g *= 10; return g;
}
let goalSig = '', lastGoalReached = null;
function updateGoalChip() {
  const wrap = document.querySelector('.arena-wrap'); if (!wrap) return;
  let el = document.getElementById('goalChip');
  if (!el) { el = document.createElement('div'); el.id = 'goalChip'; el.className = 'goal-chip'; wrap.appendChild(el); }
  const goal = nextGoalStage(), best = game.bestStage || 1;
  if (lastGoalReached !== null && goal !== lastGoalReached && best >= lastGoalReached) { // 目標に届いた
    showNotice(`🎯 目標のステージ${formatStageNumber(lastGoalReached)}に到達！ 次はステージ${formatStageNumber(goal)}`, false, 3200);
    el.classList.remove('reached'); void el.offsetWidth; el.classList.add('reached');
  }
  lastGoalReached = goal;
  const ms = typeof getMilestoneBoss === 'function' && goal % 100 === 0 ? getMilestoneBoss(goal) : null;
  const sig = goal + ':' + best;
  if (sig === goalSig) return; goalSig = sig;
  el.innerHTML = `🎯 目標 <b>ステージ${formatStageNumber(goal)}</b>${ms ? ' <span>👑</span>' : ''}`;
  el.style.display = game.skipChallenge ? 'none' : '';
}
setInterval(() => { try { updateGoalChip(); } catch (e) { console.error(e); } }, 1000);


// ---- 味方（自キャラ・仲間）をタップしたときの情報 ----
function showAllyInfo(b) {
  const host = document.querySelector('.exp-wrap'); if (!host) return;
  let el = document.getElementById('enemyInfoPop');
  if (!el) { el = document.createElement('div'); el.id = 'enemyInfoPop'; el.className = 'enemy-info-pop'; host.appendChild(el); }
  const isMain = isMainPlayerBall(b), cid = b.companionId;
  const hero = getHeroChar(), swapped = !isMain && cid && cid === hero; // 自キャラと交代した仲間の枠は勇者が入る
  const id = isMain ? hero : swapped ? null : cid;
  const name = id ? COMPANIONS[id].name : '勇者';
  const elem = isMain ? getHeroElement() : swapped ? null : (typeof compElement === 'function' ? compElement(cid) : COMPANION_ELEMENT[cid]);
  const weakTo = elem ? ELEMENT_BEATS[ELEMENT_BEATS[elem]] : null; // 自分が不利になる相手の属性
  const role = isMain ? '自キャラ' : '仲間';
  const lv = !isMain && cid && game.companions.level ? `Lv.${(game.companions.level[cid] || 0) + 1}　` : '';
  const info = isMain && typeof heroTypeInfo === 'function' ? heroTypeInfo(hero) : null;
  const typeTxt = isMain ? (info ? `${info.t.icon} ${info.t.name}（▲${info.up}・▼${info.down}）` : '⚖️ バランス（属性の不利なし）') : (id && COMPANIONS[id].desc ? COMPANIONS[id].desc : '');
  el.innerHTML = `<div class="eip-name eip-ally">${isMain ? '⭐ ' : '🐾 '}${name}<small>${role}　${lv}HP ${formatCoinNumber(Math.ceil(Math.max(0, b.hp)))}/${formatCoinNumber(Math.ceil(b.maxHp || b.hp))}　攻撃 ${formatCoinNumber(Math.round(b.atk || 0))}</small></div>`
    + `<div class="eip-row">属性 ${elem ? elemBadge(elem) : '<span class="el-badge el-none">なし</span>'}${elem ? `　有利 ${elemBadge(ELEMENT_BEATS[elem])}　苦手 ${elemBadge(weakTo)}` : ''}</div>`
    + (typeTxt ? `<div class="eip-row eip-sub">${typeTxt}</div>` : '');
  el.classList.remove('show'); void el.offsetWidth; el.classList.add('show');
  clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('show'), 2800);
}
