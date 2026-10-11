// ---- カレンダーイベント：曜日イベント／季節（毎月）のイベント／ゲリライベント ----

// ===== 曜日イベント（毎日ちがうボーナス） =====
const WEEKDAY_EVENTS = [
  { icon: '🌞', name: 'サンデー・禁断デー', desc: '禁断シリーズのドロップ率 2倍', drop: 2 },
  { icon: '💰', name: 'マンデー・ゴールド', desc: 'コイン +30%', coin: 1.3 },
  { icon: '👑', name: 'チューズデー・ボスラッシュ', desc: 'ボス撃破コイン 2倍', bossCoin: 2 },
  { icon: '🎁', name: 'ウェンズデー・宝箱デー', desc: '雑魚から宝箱が出やすい（2%）', chest: 0.02 },
  { icon: '💎', name: 'サーズデー・ジェムデー', desc: '雑魚からジェムが出ることも（1%）', gem: 0.01 },
  { icon: '🎪', name: 'フライデー・フィーバー', desc: 'ステージイベントが毎回起きる', fever: true },
  { icon: '⭐', name: 'サタデー・ボーナス', desc: 'コイン +50%', coin: 1.5 },
];
function weekdayEvent() { return WEEKDAY_EVENTS[new Date().getDay()]; }

// ===== 季節（毎月）のイベント：テーマのアイテムを雑魚から集めると、段階ごとにごほうび =====
const MONTH_EVENTS = [
  { icon: '🎍', name: 'お正月・初夢フェス', item: '🎍', itemName: '門松', color: '#ff5c5c' },
  { icon: '🍫', name: 'バレンタイン祭', item: '🍫', itemName: 'チョコ', color: '#c0784a' },
  { icon: '🎎', name: 'ひなまつり祭', item: '🎎', itemName: 'ひな人形', color: '#ff8ad8' },
  { icon: '🌸', name: 'お花見フェス', item: '🍡', itemName: '花見だんご', color: '#ffb7d2' },
  { icon: '🎏', name: 'こどもの日フェス', item: '🎏', itemName: 'こいのぼり', color: '#4fa3ff' },
  { icon: '☔', name: '梅雨のあじさい祭', item: '🐌', itemName: 'カタツムリ', color: '#8a7cff' },
  { icon: '🎋', name: '七夕・星まつり', item: '⭐', itemName: '願い星', color: '#ffe36b' },
  { icon: '🎆', name: '夏祭り・花火大会', item: '🍉', itemName: 'スイカ', color: '#7ee787' },
  { icon: '🌕', name: 'お月見フェス', item: '🍙', itemName: '月見だんご', color: '#ffe9a8' },
  { icon: '🎃', name: 'ハロウィン・パーティー', item: '🎃', itemName: 'カボチャ', color: '#ff9f43' },
  { icon: '🍁', name: '収穫祭・紅葉狩り', item: '🍠', itemName: '焼きいも', color: '#e07040' },
  { icon: '🎄', name: 'クリスマス・聖夜祭', item: '🎁', itemName: 'プレゼント', color: '#5fd068' },
];
const MONTH_REWARDS = [ // 集めた数 → ごほうび
  { at: 10, gems: 5 }, { at: 30, gems: 10 }, { at: 60, chest: 'epic' }, { at: 100, gems: 30 }, { at: 150, chest: 'legendary' }, { at: 250, gems: 50 },
];
const MONTH_DROP_RATE = 0.06; // 雑魚1体あたりの出やすさ
function monthKey() { const d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1); }
function monthEvent() { return MONTH_EVENTS[new Date().getMonth()]; }
function monthState() {
  if (!game.monthEv || game.monthEv.key !== monthKey()) game.monthEv = { key: monthKey(), n: 0, got: 0 }; // 月が変わったらリセット
  return game.monthEv;
}
function giveMonthRewards() {
  const st = monthState(), ev = monthEvent();
  while (st.got < MONTH_REWARDS.length && st.n >= MONTH_REWARDS[st.got].at) {
    const r = MONTH_REWARDS[st.got]; st.got++;
    if (r.gems) game.gems += r.gems; else if (r.chest) dropTreasureChest(r.chest);
    eventBanner(`${ev.icon} ${ev.itemName}を${r.at}個集めた！`, r.gems ? `ごほうび 💎${r.gems}` : `ごほうび ${RARITY_INFO[r.chest].label}の宝箱`);
  }
  updateStatsUI(); saveGame();
}

// ===== ゲリライベント：遊んでいると突然始まる3分間 =====
const GUERRILLAS = [
  { key: 'goldRush', icon: '💰', name: 'ゴールドラッシュ', desc: 'コイン ×3！', coin: 3 },
  { key: 'metal', icon: '👾', name: 'メタルスライム大量発生', desc: '雑魚がメタルスライムになりやすい' },
  { key: 'chestFes', icon: '🎁', name: '宝箱まつり', desc: '雑魚から宝箱が出やすい（10%）', chest: 0.1 },
  { key: 'gemRain', icon: '💎', name: 'ジェムの雨', desc: '雑魚から5%でジェム', gem: 0.05 },
  { key: 'itemFes', icon: '🎉', name: '季節アイテム大量', desc: '季節のアイテムが5倍出る', itemMult: 5 },
];
const GUERRILLA_MS = 3 * 60 * 1000;
function guerrilla() { const g = game.guerrilla; return g && g.until > Date.now() ? GUERRILLAS.find(x => x.key === g.key) : null; }
function guerrillaLeft() { const g = game.guerrilla; return g ? Math.max(0, g.until - Date.now()) : 0; }
function startGuerrilla(key) {
  const G = key ? GUERRILLAS.find(x => x.key === key) : GUERRILLAS[Math.floor(Math.random() * GUERRILLAS.length)];
  game.guerrilla = { key: G.key, until: Date.now() + GUERRILLA_MS };
  game.guerrillaWait = (8 + Math.random() * 10) * 60 * 1000; // 次は8〜18分遊んだころ
  eventBanner(`⚡ ゲリライベント発生！ ${G.icon} ${G.name}`, `${G.desc}（3分間）`);
  playTone(880, 0.1, 'square', 0.06, 1320); setTimeout(() => playTone(1320, 0.1, 'square', 0.06, 1760), 120); setTimeout(() => playTone(1760, 0.25, 'square', 0.06), 240);
  shakeScreenLight(); renderEventChip(); saveGame();
}
setInterval(() => { // 遊んでいる時間だけ数える
  if (document.hidden || phase !== 'battle' || getActiveTab() !== 'game') return;
  if (guerrilla()) return;
  if (game.guerrillaWait == null) game.guerrillaWait = 5 * 60 * 1000; // 最初は5分ほど遊んだころ
  game.guerrillaWait -= 1000;
  if (game.guerrillaWait <= 0 && (game.bestStage || 1) >= 5) startGuerrilla();
}, 1000);

// ===== 効果のつなぎ込み =====
function eventCoinMult() { const w = weekdayEvent(), g = guerrilla(); return (w.coin || 1) * (g && g.coin || 1); }
{ const orig = computeBonuses; computeBonuses = function () { const b = orig.apply(this, arguments); b.coinMult *= eventCoinMult(); return b; }; }
function eventDropMult() { return weekdayEvent().drop || 1; } // 禁断シリーズ（game.js の rollForbiddenDrop で使う）
if (typeof gimmickForStage === 'function') { const orig = gimmickForStage; gimmickForStage = function (stage) { // フライデー・フィーバー
  const k = orig.apply(this, arguments);
  if (k || !weekdayEvent().fever || stage < 3 || stage % 10 === 0 || game.skipChallenge) return k;
  return GIMMICK_KEYS[Math.floor(stageRand(gimmickWindow(stage) * 61 + 17)() * GIMMICK_KEYS.length)];
}; }
{ const orig = makeBall; makeBall = function (isPlayer) { // メタルスライム大量発生
  const e = orig.apply(this, arguments);
  const g = guerrilla();
  if (!isPlayer && e && !e.isBoss && g && g.key === 'metal' && Math.random() < 0.35) { e.emoji = '👾'; e.shape = undefined; }
  return e;
}; }
{ const orig = onStageClear; onStageClear = function (passed) {
  const wasBoss = game.stage % 10 === 0, before = game.coins, w = weekdayEvent(), g = guerrilla();
  const pos = { x: arena.x, y: arena.y };
  orig.apply(this, arguments);
  if (passed) return;
  if (wasBoss && w.bossCoin) { const d = game.coins - before; if (d > 0) { game.coins += Math.round(d * (w.bossCoin - 1)); spawnDamageText(pos.x, pos.y - 90, `${w.icon} ボス撃破コイン ×${w.bossCoin}`, '#ffd76b', 0.01, true); } }
  if (wasBoss) return;
  const chest = (w.chest || 0) + (g && g.chest || 0), gem = (w.gem || 0) + (g && g.gem || 0);
  if (chest && Math.random() < chest) setTimeout(() => dropTreasureChest(rollChestRarity()), 600);
  if (gem && Math.random() < gem) { game.gems += 1; spawnDamageText(pos.x, pos.y - 70, '💎 +1（イベント）', '#64e8ff', 0.012, true); }
  const ev = monthEvent(), rate = MONTH_DROP_RATE * (g && g.itemMult || 1);
  if (Math.random() < rate) { // 季節のアイテム
    const st = monthState(); st.n++;
    spawnDamageText(pos.x + 30, pos.y - 50, `${ev.item} ${ev.itemName} +1（${st.n}）`, ev.color, 0.012, true);
    playTone(1320, 0.08, 'triangle', 0.06, 1760);
    giveMonthRewards(); renderEventChip();
  }
  updateStatsUI();
}; }

// ===== お知らせの帯とイベントボタン =====
function eventBanner(title, text) {
  if (typeof showRunBanner === 'function') return showRunBanner(title, text);
  showNotice(`${title} ${text}`, false, 3000);
}
function renderEventChip() {
  const wrap = document.querySelector('.arena-wrap'); if (!wrap) return;
  let el = document.getElementById('eventChip');
  if (!el) { el = document.createElement('button'); el.id = 'eventChip'; el.className = 'event-chip'; wrap.appendChild(el); el.addEventListener('click', openEventDialog); }
  const g = guerrilla(), ev = monthEvent(), w = weekdayEvent();
  if (g) { const s = Math.ceil(guerrillaLeft() / 1000); el.innerHTML = `⚡ ${g.icon}${g.name} <b>${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}</b>`; el.classList.add('hot'); }
  else { el.innerHTML = `${ev.icon}${w.icon} イベント <b>${ev.item}${monthState().n}</b>`; el.classList.remove('hot'); }
}
setInterval(renderEventChip, 1000);
function openEventDialog() {
  const ev = monthEvent(), st = monthState(), w = weekdayEvent(), g = guerrilla();
  const days = ['日', '月', '火', '水', '木', '金', '土'], today = new Date().getDay();
  const next = MONTH_REWARDS[st.got];
  const ov = document.createElement('div'); ov.className = 'modal-overlay show'; ov.style.zIndex = 82;
  ov.innerHTML = `<div class="modal-panel evd-panel">
    <div class="evd-title">🎪 開催中のイベント</div>
    ${g ? `<div class="evd-box hot"><b>⚡ ゲリライベント：${g.icon} ${g.name}</b><span>${g.desc}　残り ${Math.ceil(guerrillaLeft() / 60000)}分</span></div>` : '<div class="evd-box dim"><b>⚡ ゲリライベント</b><span>遊んでいると突然始まる3分間の特別タイム（ゴールドラッシュ・メタル大量発生など）</span></div>'}
    <div class="evd-box" style="--ec:${ev.color}"><b>${ev.icon} ${new Date().getMonth() + 1}月の季節イベント：${ev.name}</b>
      <span>雑魚を倒すと ${ev.item}${ev.itemName} が出る。集めるとごほうび！（月末まで）</span>
      <div class="evd-prog"><i style="width:${Math.min(100, st.n / MONTH_REWARDS[MONTH_REWARDS.length - 1].at * 100)}%"></i></div>
      <div class="evd-rw">${MONTH_REWARDS.map((r, i) => `<span class="${i < st.got ? 'got' : ''}">${ev.item}${r.at}<br>${r.gems ? '💎' + r.gems : '🎁' + RARITY_INFO[r.chest].label}</span>`).join('')}</div>
      <small>${st.n}個 集めた${next ? `（次のごほうびまで あと${next.at - st.n}個）` : '（コンプリート！）'}</small></div>
    <div class="evd-box"><b>📅 曜日イベント</b><div class="evd-week">${WEEKDAY_EVENTS.map((e, i) => `<div class="${i === today ? 'today' : ''}"><em>${days[i]}</em>${e.icon}<small>${e.desc}</small></div>`).join('')}</div></div>
    <button class="modal-close-btn evd-close">閉じる</button></div>`;
  document.body.appendChild(ov);
  ov.querySelector('.evd-close').addEventListener('click', () => ov.remove());
  ov.addEventListener('click', e => { if (e.target === ov) ov.remove(); });
}
// 起動時に今日のイベントをお知らせ（1日1回）
setTimeout(() => {
  if (game.eventNoticeDate === todayKey()) return;
  game.eventNoticeDate = todayKey();
  const w = weekdayEvent(), ev = monthEvent();
  eventBanner(`${w.icon} 今日は「${w.name}」`, `${w.desc}／${ev.icon} ${ev.name}開催中`);
}, 4000);
renderEventChip();
