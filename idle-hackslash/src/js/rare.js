// ---- めったに出ないレア敵：条件（ステージ・キリ番・曜日・日数・仲間全員集結・時間帯）を満たしたときだけ、まれに現れる ----
// 見た目は既存の敵の絵に、金色のオーラと「RARE」の印をつける。倒すと特別なごほうび
const RARE_ENEMIES = [
  { id: 'goldKing', base: '👾', name: '黄金のメタルキング', cond: '最高ステージ300以上', chance: 0.004, ok: () => (game.bestStage || 1) >= 300, hp: 4, reward: { gems: 15, coin: 30 } },
  { id: 'kiriban', base: 'm_ghostKnight', name: 'キリ番の守護騎士', cond: 'ステージ111・222・333…のキリ番だけ', chance: 0.35, ok: () => game.stage >= 111 && game.stage % 111 === 0, hp: 5, reward: { gems: 10, chest: 'epic' } },
  { id: 'sunCat', base: 'm_luckyCat', name: '日曜の福招きネコ', cond: '日曜日だけ', chance: 0.02, ok: () => (typeof weekdayEvent === 'function' && weekdayEvent() === WEEKDAY_EVENTS[0]) || new Date().getDay() === 0, hp: 2, reward: { gems: 5, coin: 50 } },
  { id: 'veteran', base: 'm_ghostLantern', name: '古参の灯火', cond: '7日以上遊んだ人の前にだけ', chance: 0.01, ok: () => Object.keys(game.playDays || {}).length >= 7, hp: 3, reward: { gems: 5, chest: 'legendary' } },
  { id: 'allStar', base: 'm_thunderRabbit', name: '絆の守り神ラビ', cond: '仲間を全員そろえた（図鑑コンプ）あと', chance: 0.03, ok: () => COMPANION_IDS.every(id => game.companionBook && game.companionBook[id]), hp: 6, reward: { gems: 30, chest: 'mythic' } },
  { id: 'midnight', base: 'm_shade', name: '真夜中の影法師', cond: '夜中の0時〜4時だけ', chance: 0.02, ok: () => new Date().getHours() < 4, hp: 3, reward: { gems: 8, coin: 20 } },
  { id: 'rebornMimic', base: 'm_petitMimic', name: '輪廻の宝箱', cond: '転生10回以上', chance: 0.006, ok: () => (game.reincarnations || 0) >= 10, hp: 3, reward: { chest: 'legendary', coin: 40 } },
];
let dbgRareNext = null; // デバッグ：次に出す
function pickRare() {
  if (game.skipChallenge || game.stage % 10 === 0) return null;
  if (dbgRareNext) { const r = RARE_ENEMIES.find(x => x.id === dbgRareNext); dbgRareNext = null; return r; }
  for (const r of RARE_ENEMIES) { try { if (r.ok() && Math.random() < r.chance) return r; } catch (e) {} }
  return null;
}
{ const orig = makeBall; makeBall = function (isPlayer) {
  const e = orig.apply(this, arguments);
  if (isPlayer || !e || e.isBoss) return e;
  const r = pickRare(); if (!r) return e;
  e.emoji = r.base; e.shape = undefined; e.rare = r.id;
  e.maxHp = e.hp = Math.round(e.maxHp * r.hp); e.radius = Math.round(e.radius * 1.25);
  e.liveFrames = -60 * 30; // 逃げるまで長め
  setTimeout(() => {
    if (typeof eventBanner === 'function') eventBanner(`✨ レア敵出現！ ${r.name}`, `条件：${r.cond}`); else showNotice(`✨ レア敵出現！ ${r.name}`);
    playTone(1568, 0.1, 'square', 0.06, 2093); setTimeout(() => playTone(2093, 0.25, 'triangle', 0.06), 120);
  }, 300);
  return e;
}; }
// 金色のオーラ
{ const orig = draw; draw = function () {
  orig.apply(this, arguments);
  if (typeof getActiveTab === 'function' && getActiveTab() !== 'game') return;
  const now = Date.now();
  for (const e of balls) {
    if (!e.rare || e.isDying || e.isPlayer) continue;
    const R = e.radius * (1.5 + 0.12 * Math.sin(now / 160));
    ctx.save();
    const g = ctx.createRadialGradient(e.x, e.y, e.radius * 0.6, e.x, e.y, R); g.addColorStop(0, 'rgba(255,220,90,0)'); g.addColorStop(0.7, 'rgba(255,220,90,0.35)'); g.addColorStop(1, 'rgba(255,220,90,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(e.x, e.y, R, 0, Math.PI * 2); ctx.fill();
    for (let i = 0; i < 5; i++) { const a = now / 600 + i * 1.257, x = e.x + Math.cos(a) * e.radius * 1.3, y = e.y + Math.sin(a) * e.radius * 1.3; ctx.fillStyle = '#fff6b0'; ctx.beginPath(); ctx.arc(x, y, 2.2, 0, Math.PI * 2); ctx.fill(); }
    ctx.font = '900 10px sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#ffd23f'; ctx.strokeStyle = '#3a2a00'; ctx.lineWidth = 3;
    const label = 'RARE ' + (RARE_ENEMIES.find(x => x.id === e.rare) || {}).name;
    ctx.strokeText(label, e.x, e.y + e.radius + 14); ctx.fillText(label, e.x, e.y + e.radius + 14);
    ctx.restore();
  }
}; }
// 倒したらごほうび・図鑑
{ const orig = onStageClear; onStageClear = function (passed) {
  const d = balls.find(b => !b.isPlayer && b.rare), pos = d ? { x: d.x, y: d.y } : null;
  orig.apply(this, arguments);
  if (!d || passed) return;
  const r = RARE_ENEMIES.find(x => x.id === d.rare); if (!r) return;
  if (!game.rareSeen) game.rareSeen = {};
  const first = !game.rareSeen[r.id]; game.rareSeen[r.id] = (game.rareSeen[r.id] || 0) + 1;
  const w = r.reward, parts = [];
  if (w.gems) { const g = w.gems * (first ? 2 : 1); game.gems += g; parts.push(`💎${g}`); }
  if (w.coin) { const c = Math.round(stageCoinRaw() * computeBonuses().coinMult * w.coin); game.coins += c; spawnCoinBurst(pos.x, pos.y, c, 12); parts.push(`🟡${formatCoinNumber(c)}`); }
  if (w.chest) { setTimeout(() => dropTreasureChest(w.chest), 800); parts.push(`${RARITY_INFO[w.chest].label}の宝箱`); }
  setTimeout(() => {
    if (typeof eventBanner === 'function') eventBanner(`🏆 レア敵「${r.name}」撃破！${first ? '（初撃破ボーナス）' : ''}`, parts.join('・'));
    playGachaSound && playGachaSound('legendary');
    if (typeof offerShareMoment === 'function') offerShareMoment(`✨ レア敵「${r.name}」を撃破！`, `出現条件：${r.cond}`);
  }, 900);
  updateStatsUI(); saveGame();
}; }
// 戦績ページにレア敵図鑑（出会うまで条件はヒントだけ）
if (typeof renderQuests === 'function') { const orig = renderQuests; renderQuests = function () {
  orig(); const host = document.getElementById('questBox'); if (!host) return;
  const seen = game.rareSeen || {}, n = RARE_ENEMIES.filter(r => seen[r.id]).length;
  host.insertAdjacentHTML('beforeend', `<div class="qb-sec rr-box"><div class="qb-head">✨ レア敵図鑑 ${n}/${RARE_ENEMIES.length}</div><div class="rf-list">${RARE_ENEMIES.map(r => `<div class="rf-row ${seen[r.id] ? 'got' : ''}"><span class="rf-ico">${seen[r.id] ? '✨' : '❓'}</span><span class="rf-main"><b>${seen[r.id] ? r.name : '？？？'}</b><small>${r.cond}</small></span><span class="rf-gem">${seen[r.id] ? '×' + seen[r.id] : ''}</span></div>`).join('')}</div></div>`);
}; }
// デバッグ：イベント確認ダイアログにレア敵ボタン
if (typeof openEventDebug === 'function') { const orig = openEventDebug; openEventDebug = function () {
  orig();
  const panel = [...document.querySelectorAll('.dbga-panel')].pop(); if (!panel) return;
  const close = panel.querySelector('.dbga-close');
  close.insertAdjacentHTML('beforebegin', `<div class="dbge-h">✨ レア敵（次の雑魚を差し替え）</div><div class="dbge-g">${RARE_ENEMIES.map(r => `<button data-rare="${r.id}">${r.name}</button>`).join('')}</div>`);
  panel.querySelectorAll('[data-rare]').forEach(b => b.onclick = ev => { ev.stopPropagation(); dbgRareNext = b.dataset.rare; balls = balls.filter(x => x.isPlayer); spawnNextEnemy(); panel.closest('.modal-overlay').remove(); });
}; }
