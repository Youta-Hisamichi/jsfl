// ---- ステージイベント（ギミック）：数ステージごとに見た目と遊びが変わる。序盤は毎回なにかが起きる ----
// 3ステージ1組で同じイベントが続く（ボス階・試練の塔はお休み）。初めて見たイベントは「NEW!」でステージ図鑑に登録
const GIMMICKS = {
  stars:     { name: '流れ星の夜', icon: '🌠', desc: '落ちた星にさわるかタップでコイン', coin: 1, tint: 'rgba(10,16,60,0.28)' },
  balloons:  { name: '風船まつり', icon: '🎈', desc: '風船を割るとコイン。金の風船はジェム', coin: 1 },
  night:     { name: '月夜の草原', icon: '🌙', desc: '暗い夜。ホタルを集めるとコイン', coin: 1.3 },
  wind:      { name: '強風注意報', icon: '🍃', desc: 'みんな風に流される！ コイン×1.2', coin: 1.2 },
  fireworks: { name: '花火大会', icon: '🎆', desc: '夜空に花火。コイン×1.3', coin: 1.3, tint: 'rgba(8,10,40,0.3)' },
  treasure:  { name: '宝さがし', icon: '🗺️', desc: '✕じるしの上を通ると宝箱！', coin: 1 },
  thunder:   { name: '雷雨', icon: '⛈️', desc: '雷が敵に落ちて大ダメージ', coin: 1.1, tint: 'rgba(20,24,40,0.3)' },
  bubbles:   { name: 'シャボン玉の庭', icon: '🫧', desc: 'シャボン玉を割るとコイン', coin: 1 },
  gold:      { name: 'ゴールドラッシュ', icon: '💰', desc: '撃破コイン×2！', coin: 2, tint: 'rgba(255,200,40,0.08)' },
  whirl:     { name: '大渦の間', icon: '🌀', desc: '中心のまわりをぐるぐる流される', coin: 1.2 },
  haste:     { name: '疾風ステージ', icon: '⚡', desc: 'すべてが速い！ コイン×1.2', coin: 1.2 },
  rocks:     { name: '落石注意', icon: '🪨', desc: '岩が降ってきて敵をつぶす', coin: 1.1 },
  snow:      { name: '雪まつり', icon: '⛄', desc: '雪が舞う。雪だるまを壊すとコイン', coin: 1 },
  coinrain:  { name: 'コインの雨', icon: '🪙', desc: '降ってくるコインを拾おう', coin: 1 },
  slime:     { name: 'ぷるぷる床', icon: '🟢', desc: '跳ね返りが強くなる。コイン×1.2', coin: 1.2 },
  pots:      { name: '壺割りまくり', icon: '🏺', desc: '壺がずらり！ 割るたびにコイン', coin: 1 },
  mow:       { name: '芝刈りしまくり', icon: '🌿', desc: '草ぼうぼう！ 刈るたびにコイン', coin: 1 },
  blocks:    { name: 'ブロック叩きまくり', icon: '🧱', desc: 'ハテナブロックを何度も叩いてコイン', coin: 1 },
  tansu:     { name: 'タンス開けまくり', icon: '🗄️', desc: 'タンスを調べまくってお宝さがし！', coin: 1 },
};
const GIMMICK_KEYS = Object.keys(GIMMICKS);
// 1周目の序盤は、毎組ちがうイベントを見せて飽きさせない
const GIMMICK_FIRST_RUN = ['stars', 'pots', 'balloons', 'night', 'mow', 'wind', 'treasure', 'blocks', 'fireworks', 'tansu', 'bubbles', 'thunder', 'gold', 'coinrain', 'whirl', 'snow', 'rocks', 'haste', 'slime'];
const GIMMICK_FROM_STAGE = 3, GIMMICK_SPAN = 3, GIMMICK_FIND_GEMS = 2; // 初めて出会ったイベントはジェムのごほうび
let dbgGimmick = null; // デバッグで固定表示するイベント
function gimmickWindow(stage) { return Math.floor((stage - GIMMICK_FROM_STAGE) / GIMMICK_SPAN); }
function gimmickForStage(stage) {
  if (dbgGimmick) return dbgGimmick;
  if (stage < GIMMICK_FROM_STAGE || stage % 10 === 0 || game.skipChallenge) return null;
  const w = gimmickWindow(stage), reb = game.reincarnations || 0;
  if (!reb && w < GIMMICK_FIRST_RUN.length) return GIMMICK_FIRST_RUN[w];
  const r = stageRand(w * 31 + reb * 977 + 7); r(); r();
  const rate = stage <= 60 ? 0.85 : stage <= 300 ? 0.6 : 0.45; // 序盤ほどよく起きる
  if (r() >= rate) return null;
  let k = GIMMICK_KEYS[Math.floor(r() * GIMMICK_KEYS.length)];
  if (w > 0) { const prev = stageRand((w - 1) * 31 + reb * 977 + 7); prev(); prev(); prev(); if (GIMMICK_KEYS[Math.floor(prev() * GIMMICK_KEYS.length)] === k) k = GIMMICK_KEYS[(GIMMICK_KEYS.indexOf(k) + 5) % GIMMICK_KEYS.length]; } // 2組続けて同じにしない
  return k;
}
let gm = { key: null, id: '', t: 0, items: [], fx: [], bannerAt: 0, isNew: false, treasureDone: false, nextAt: 0 };
function curGimmick() { return phase === 'battle' || phase === 'paused' ? gm.key : null; }
function gimmickCoinMult() { const k = curGimmick(); return k ? GIMMICKS[k].coin || 1 : 1; }
function gimmickCoinUnit() { return Math.max(1, stageCoinRaw() * computeBonuses().coinMult); }
function gimmickGiveCoins(x, y, k, label) {
  const g = Math.max(1, Math.round(gimmickCoinUnit() * k));
  game.coins += g; spawnCoinDrop(x, y, 0, 2);
  spawnDamageText(x, y - 14, (label || '') + '+' + formatCoinNumber(g) + ' 🟡', '#ffd76b', 0.022);
  if (typeof updateStatsUI === 'function') updateStatsUI();
}
function gimmickPlayerBalls() { return balls.filter(b => b.isPlayer && !(b.isCompanion && b.hp <= 0)); }
function gimmickEnemies() { return [...balls, ...adds].filter(e => !e.isPlayer && !e.isDying && e.hp > 0 && !(e.spawnTimer > 0)); }
function gArea() { const hx = arena.radius, hy = arenaHalfY(); return { l: arena.x - hx, r: arena.x + hx, t: arena.y - hy, b: arena.y + hy, w: hx * 2, h: hy * 2 }; }
function gRand(a, b) { return a + Math.random() * (b - a); }

function setupGimmick(key) {
  const id = key ? key + ':' + gimmickWindow(game.stage) + ':' + (game.reincarnations || 0) : '';
  if (id === gm.id) return;
  gm = { key, id, t: 0, items: [], fx: [], bannerAt: 0, isNew: false, treasureDone: false, nextAt: 0, wind: 0 };
  if (!key) return;
  game.gimmickSeen = game.gimmickSeen || {};
  gm.isNew = !game.gimmickSeen[key]; game.gimmickSeen[key] = true;
  if (gm.isNew && !dbgGimmick) { game.gems += GIMMICK_FIND_GEMS; setTimeout(() => spawnDamageText(arena.x, arena.y + 20, `図鑑に登録！ +${GIMMICK_FIND_GEMS} 💎`, '#64e8ff', 0.012, true), 900); if (typeof updateStatsUI === 'function') updateStatsUI(); }
  gm.bannerAt = Date.now();
  playTone(660, 0.12, 'triangle', 0.06, 990); setTimeout(() => playTone(990, 0.16, 'triangle', 0.06, 1320), 120);
  const A = gArea();
  if (key === 'treasure') gm.spot = { x: gRand(A.l + A.w * 0.2, A.r - A.w * 0.2), y: gRand(A.t + A.h * 0.2, A.b - A.h * 0.2) };
  if (key === 'snow') for (let i = 0; i < 3; i++) gm.items.push({ kind: 'snowman', x: gRand(A.l + 40, A.r - 40), y: gRand(A.t + 50, A.b - 40), hp: 3 });
  if (key === 'night') for (let i = 0; i < 6; i++) gm.items.push(makeFirefly(A));
  if (key === 'wind') gm.wind = Math.random() * Math.PI * 2;
}
function makeFirefly(A) { return { kind: 'firefly', x: gRand(A.l + 20, A.r - 20), y: gRand(A.t + 20, A.b - 20), ph: Math.random() * 6, vx: gRand(-0.4, 0.4), vy: gRand(-0.4, 0.4) }; }

// ---- 毎フレームの動き ----
function tickGimmick(sp) {
  setupGimmick(gimmickForStage(game.stage));
  const key = gm.key; if (!key) return;
  gm.t += sp;
  const A = gArea(), now = Date.now(), pls = gimmickPlayerBalls();
  const touch = (o, r) => pls.find(b => Math.hypot(b.x - o.x, b.y - o.y) < (b.radius || 12) + r);
  // 出現
  if (gm.t >= gm.nextAt) {
    if (key === 'stars') { gm.nextAt = gm.t + gRand(70, 130); const tx = gRand(A.l + 30, A.r - 30), ty = gRand(A.t + 40, A.b - 30); gm.fx.push({ kind: 'shoot', x: tx - 160, y: ty - 220, tx, ty, life: 1 }); }
    else if (key === 'balloons') { gm.nextAt = gm.t + gRand(40, 75); const gold = Math.random() < 0.06 && (gm.goldN || 0) < 2; if (gold) gm.goldN = (gm.goldN || 0) + 1; gm.items.push({ kind: 'balloon', x: gRand(A.l + 24, A.r - 24), y: A.b + 30, vy: -gRand(0.7, 1.2), ph: Math.random() * 6, col: gold ? '#ffd23f' : ['#ff5c7a', '#4fa3ff', '#7ae06b', '#c77dff', '#ff9f43'][Math.floor(Math.random() * 5)], gold }); }
    else if (key === 'bubbles') { gm.nextAt = gm.t + gRand(25, 50); gm.items.push({ kind: 'bubble', x: gRand(A.l + 20, A.r - 20), y: A.b + 20, vy: -gRand(0.4, 0.9), r: gRand(9, 17), ph: Math.random() * 6 }); }
    else if (key === 'fireworks') { gm.nextAt = gm.t + gRand(45, 90); const x = gRand(A.l + 40, A.r - 40), y = gRand(A.t + 40, A.t + A.h * 0.45); gm.fx.push({ kind: 'rocket', x, y: A.b, ty: y, life: 1, col: `hsl(${Math.floor(Math.random() * 360)},95%,65%)` }); playTone(300, 0.35, 'sine', 0.025, 900); }
    else if (key === 'thunder') { gm.nextAt = gm.t + gRand(170, 240); const foes = gimmickEnemies(); if (foes.length) { const e = foes[Math.floor(Math.random() * foes.length)]; gm.fx.push({ kind: 'warn', target: e, x: e.x, y: e.y, t: 0 }); } }
    else if (key === 'rocks') { gm.nextAt = gm.t + gRand(140, 210); const foes = gimmickEnemies(); if (foes.length) { const e = foes[Math.floor(Math.random() * foes.length)]; gm.fx.push({ kind: 'rockfall', target: e, x: e.x, y: e.y, t: 0 }); } }
    else if (key === 'coinrain') { gm.nextAt = gm.t + gRand(14, 30); gm.items.push({ kind: 'coin', x: gRand(A.l + 16, A.r - 16), y: A.t - 10, vy: gRand(1.2, 2), spin: Math.random() * 6, landY: gRand(A.t + A.h * 0.3, A.b - 16) }); }
    else if (key === 'night') { gm.nextAt = gm.t + 120; if (gm.items.filter(i => i.kind === 'firefly').length < 6) gm.items.push(makeFirefly(A)); }
    else if (key === 'snow') { gm.nextAt = gm.t + 3; gm.fx.push({ kind: 'flake', x: gRand(A.l - 20, A.r), y: A.t - 8, vx: gRand(0.3, 0.9), vy: gRand(0.6, 1.3), rot: Math.random() * 6, s: gRand(3, 6) }); }
    else if (key === 'wind') { gm.nextAt = gm.t + 2; gm.fx.push({ kind: 'streak', x: gRand(A.l, A.r), y: gRand(A.t, A.b), life: 1, len: gRand(20, 60) }); }
    else gm.nextAt = gm.t + 60;
  }
  // 流れる力（風・渦）
  if (key === 'wind' || key === 'whirl') {
    gm.wind += 0.0015 * sp;
    for (const b of [...balls, ...adds]) {
      if (b.isDying || b.spawnTimer > 0 || (b.isCompanion && b.hp <= 0) || b.isBoss) continue;
      let fx, fy;
      if (key === 'wind') { fx = Math.cos(gm.wind) * 0.06; fy = Math.sin(gm.wind) * 0.06; }
      else { const dx = b.x - arena.x, dy = b.y - arena.y, d = Math.hypot(dx, dy) || 1; fx = (-dy / d) * 0.07 - dx / d * 0.012; fy = (dx / d) * 0.07 - dy / d * 0.012; }
      b.vx += fx * sp; b.vy += fy * sp;
    }
  }
  if (key === 'slime') for (const b of pls) { if (b.vx == null) continue; const v = Math.hypot(b.vx, b.vy); if (v > 0 && v < 2.2) { b.vx *= 1.02; b.vy *= 1.02; } }
  // 宝さがし
  if (key === 'treasure' && !gm.treasureDone && gm.spot) {
    const p = pls.find(b => isMainPlayerBall(b) && Math.hypot(b.x - gm.spot.x, b.y - gm.spot.y) < (b.radius || 12) + 14);
    if (p) { gm.treasureDone = true; spawnDamageText(gm.spot.x, gm.spot.y - 20, '🗺️ お宝はっけん！', '#ffe36b', 0.012, true); playCoinChime(4); setTimeout(() => playCoinChime(7), 120); if (typeof questTick === 'function') dropTreasureChest(); }
  }
  // 拾える物
  for (const it of gm.items) {
    if (it.dead) continue;
    if (it.kind === 'balloon') { it.y += it.vy * sp; it.ph += 0.04 * sp; it.x += Math.sin(it.ph) * 0.4 * sp; if (it.y < A.t - 40) it.dead = true; else if (touch(it, 13)) popGimmickItem(it); }
    else if (it.kind === 'bubble') { it.y += it.vy * sp; it.ph += 0.05 * sp; it.x += Math.sin(it.ph) * 0.5 * sp; if (it.y < A.t - 30) it.dead = true; else if (touch(it, it.r)) popGimmickItem(it); }
    else if (it.kind === 'star') { it.life -= 0.0028 * sp; if (it.life <= 0) it.dead = true; else if (touch(it, 12)) popGimmickItem(it); }
    else if (it.kind === 'coin') { if (it.y < it.landY) it.y += it.vy * sp; else it.ground = (it.ground || 0) + sp; it.spin += 0.15 * sp; if (it.ground > 360) it.dead = true; else if (touch(it, 9)) popGimmickItem(it); }
    else if (it.kind === 'firefly') { it.ph += 0.05 * sp; it.x += (it.vx + Math.sin(it.ph * 0.7) * 0.4) * sp; it.y += (it.vy + Math.cos(it.ph * 0.5) * 0.4) * sp; if (it.x < A.l + 10 || it.x > A.r - 10) it.vx *= -1; if (it.y < A.t + 10 || it.y > A.b - 10) it.vy *= -1; it.x = Math.max(A.l + 10, Math.min(A.r - 10, it.x)); it.y = Math.max(A.t + 10, Math.min(A.b - 10, it.y)); if (touch(it, 8)) popGimmickItem(it); }
    else if (it.kind === 'snowman') { if (!it.cool || it.cool < gm.t) { const b = touch(it, 14); if (b) { it.cool = gm.t + 30; it.hp--; it.shake = now; playTone(500, 0.06, 'square', 0.05, 300); spawnHitParticles(it.x, it.y, '#ffffff'); if (it.hp <= 0) popGimmickItem(it); } } }
  }
  gm.items = gm.items.filter(i => !i.dead);
  // 演出
  for (const f of gm.fx) {
    if (f.kind === 'shoot') { f.life -= 0.05 * sp; if (f.life <= 0) { f.dead = true; gm.items.push({ kind: 'star', x: f.tx, y: f.ty, life: 1 }); playTone(1500, 0.12, 'sine', 0.04, 2400); spawnHitParticles(f.tx, f.ty, '#fff6b0'); } }
    else if (f.kind === 'rocket') { f.y -= 5 * sp; if (f.y <= f.ty) { f.dead = true; const parts = []; for (let i = 0; i < 26; i++) { const a = i / 26 * Math.PI * 2, s = gRand(1.6, 2.8); parts.push({ x: f.x, y: f.ty, vx: Math.cos(a) * s, vy: Math.sin(a) * s }); } gm.fx.push({ kind: 'burst', parts, life: 1, col: f.col }); thump(90, 40, 0.25, 0.25); playNoiseBurst(0.18, 0.12); } }
    else if (f.kind === 'burst') { f.life -= 0.018 * sp; for (const p of f.parts) { p.x += p.vx * sp; p.y += p.vy * sp; p.vy += 0.03 * sp; p.vx *= 0.985; } if (f.life <= 0) f.dead = true; }
    else if (f.kind === 'warn' || f.kind === 'rockfall') {
      f.t += sp; if (f.target && !f.target.isDying && f.target.hp > 0) { f.x = f.target.x; f.y = f.target.y; }
      if (f.t >= 50) { f.dead = true; gimmickStrike(f); }
    }
    else if (f.kind === 'bolt' || f.kind === 'crash') { f.life -= 0.06 * sp; if (f.life <= 0) f.dead = true; }
    else if (f.kind === 'flake') { f.x += (f.vx + Math.sin(gm.t * 0.03 + f.rot) * 0.4) * sp; f.y += f.vy * sp; f.rot += 0.05 * sp; if (f.y > A.b + 10) f.dead = true; }
    else if (f.kind === 'streak') { f.life -= 0.03 * sp; f.x += Math.cos(gm.wind) * 6 * sp; f.y += Math.sin(gm.wind) * 6 * sp; if (f.life <= 0) f.dead = true; }
  }
  gm.fx = gm.fx.filter(f => !f.dead);
  if (gm.fx.length > 220) gm.fx.splice(0, gm.fx.length - 220);
}
function popGimmickItem(it) {
  it.dead = true;
  if (it.kind === 'balloon') {
    playNoiseBurst(0.08, 0.2); playTone(900, 0.05, 'square', 0.05, 400);
    for (let i = 0; i < 5; i++) spawnHitParticles(it.x, it.y, it.col);
    if (it.gold) { game.gems += 1; spawnDamageText(it.x, it.y - 18, '金の風船！ +1 💎', '#64e8ff', 0.012, true); playCoinChime(8); } else gimmickGiveCoins(it.x, it.y, 0.25, '🎈');
  } else if (it.kind === 'bubble') { playTone(1300, 0.05, 'sine', 0.05, 1900); spawnHitParticles(it.x, it.y, '#bfe9ff'); gimmickGiveCoins(it.x, it.y, 0.12, '🫧'); }
  else if (it.kind === 'star') { playCoinChime(5); playTone(1800, 0.15, 'triangle', 0.05, 2600); for (let i = 0; i < 4; i++) spawnHitParticles(it.x, it.y, '#fff3a0'); gimmickGiveCoins(it.x, it.y, 0.4, '🌠'); }
  else if (it.kind === 'coin') { playCoinChime(Math.floor(Math.random() * 6)); gimmickGiveCoins(it.x, it.y, 0.1, ''); }
  else if (it.kind === 'firefly') { playTone(2000, 0.08, 'sine', 0.04, 2600); spawnHitParticles(it.x, it.y, '#d6ff7a'); gimmickGiveCoins(it.x, it.y, 0.2, '✨'); }
  else if (it.kind === 'snowman') { playNoiseBurst(0.2, 0.25); for (let i = 0; i < 6; i++) spawnHitParticles(it.x + gRand(-10, 10), it.y + gRand(-10, 10), '#ffffff'); gimmickGiveCoins(it.x, it.y, 0.6, '⛄'); }
}
function gimmickStrike(f) { // 雷・落石：その場所にいる敵に大ダメージ
  const R = 34, thunder = f.kind === 'warn';
  gm.fx.push({ kind: thunder ? 'bolt' : 'crash', x: f.x, y: f.y, life: 1 });
  if (thunder) { gm.flashAt = Date.now(); playNoiseBurst(0.5, 0.4); thump(70, 30, 0.6, 0.5); }
  else { thump(120, 40, 0.4, 0.5); playNoiseBurst(0.3, 0.3); for (let i = 0; i < 6; i++) spawnHitParticles(f.x + gRand(-14, 14), f.y + gRand(-14, 14), '#8d867b'); }
  shakeScreenLight();
  for (const e of gimmickEnemies()) {
    if (Math.hypot(e.x - f.x, e.y - f.y) > R + (e.radius || 0)) continue;
    const dmg = Math.max(1, Math.round(e.maxHp * (e.isBoss ? 0.05 : 0.25)));
    e.hp -= dmg; trackDamage(dmg);
    spawnAttackDamageText(e, dmg, false, thunder ? '#ffe36b' : '#c9b79c');
    onPlayerHitEnemy(e, dmg);
  }
}

// ---- 描画 ----
function drawGimmick() {
  const key = curGimmick(); if (!key) return;
  const G = GIMMICKS[key], A = gArea(), now = Date.now();
  ctx.save(); arenaPath(); ctx.clip();
  if (G.tint) { ctx.fillStyle = G.tint; fillArenaRect(); }
  if (key === 'night') drawGimmickDark(A, 'rgba(4,6,28,0.62)', 70);
  if (key === 'gold') { for (let i = 0; i < 14; i++) { const t = now / 900 + i * 1.7, x = A.l + ((i * 97 + now / 40) % A.w), y = A.t + ((i * 61 + Math.sin(t) * 40 + A.h) % A.h); ctx.globalAlpha = 0.4 + 0.4 * Math.sin(t * 3); ctx.fillStyle = '#ffe36b'; gStar(x, y, 4); } ctx.globalAlpha = 1; }
  if (key === 'treasure' && gm.spot && !gm.treasureDone) { const s = 11 + Math.sin(now / 200) * 2; ctx.strokeStyle = 'rgba(200,30,30,0.85)'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(gm.spot.x - s, gm.spot.y - s); ctx.lineTo(gm.spot.x + s, gm.spot.y + s); ctx.moveTo(gm.spot.x + s, gm.spot.y - s); ctx.lineTo(gm.spot.x - s, gm.spot.y + s); ctx.stroke(); ctx.globalAlpha = 0.5 + 0.5 * Math.sin(now / 150); ctx.fillStyle = '#fff6b0'; gStar(gm.spot.x + 12, gm.spot.y - 12, 3); ctx.globalAlpha = 1; }
  if (key === 'whirl') { ctx.strokeStyle = 'rgba(160,220,255,0.18)'; ctx.lineWidth = 3; for (let i = 0; i < 4; i++) { ctx.beginPath(); for (let a = 0; a < 5.5; a += 0.15) { const rr = 10 + a * A.w * 0.075, an = a + i * Math.PI / 2 + now / 900; const x = arena.x + Math.cos(an) * rr, y = arena.y + Math.sin(an) * rr; a ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); } }
  if (key === 'slime') { ctx.globalAlpha = 0.14 + 0.05 * Math.sin(now / 300); ctx.fillStyle = '#5be07a'; fillArenaRect(); ctx.globalAlpha = 1; }
  if (key === 'haste') { ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.lineWidth = 2; for (let i = 0; i < 10; i++) { const y = A.t + ((i * 83 + now / 3) % A.h), x = A.l + ((i * 151) % A.w); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - 40); ctx.stroke(); } }
  if (key === 'thunder' || key === 'rocks') { // 雨
    if (key === 'thunder') { ctx.strokeStyle = 'rgba(170,190,230,0.35)'; ctx.lineWidth = 1; ctx.beginPath(); for (let i = 0; i < 40; i++) { const x = A.l + ((i * 53 + now / 6) % A.w), y = A.t + ((i * 97 + now / 1.6) % A.h); ctx.moveTo(x, y); ctx.lineTo(x - 4, y + 12); } ctx.stroke(); }
  }
  for (const it of gm.items) drawGimmickItem(it, now);
  for (const f of gm.fx) drawGimmickFx(f, now);
  if (key === 'thunder' && gm.flashAt && now - gm.flashAt < 220) { ctx.fillStyle = `rgba(255,255,240,${0.55 * (1 - (now - gm.flashAt) / 220)})`; fillArenaRect(); }
  ctx.restore();
  drawGimmickLabel(key, A, now);
}
let gDarkCv = null;
function drawGimmickDark(A, col, lightR) { // 暗闇（味方とホタルのまわりだけ明るい）
  const k = 0.5, w = Math.ceil(size * k), h = Math.ceil((sizeH || size) * k);
  if (!gDarkCv) gDarkCv = document.createElement('canvas');
  if (gDarkCv.width !== w || gDarkCv.height !== h) { gDarkCv.width = w; gDarkCv.height = h; }
  const c = gDarkCv.getContext('2d');
  c.globalCompositeOperation = 'source-over'; c.clearRect(0, 0, w, h); c.fillStyle = col; c.fillRect(0, 0, w, h);
  c.globalCompositeOperation = 'destination-out';
  const hole = (x, y, r) => { const g = c.createRadialGradient(x * k, y * k, 0, x * k, y * k, r * k); g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(0.6, 'rgba(0,0,0,0.7)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.beginPath(); c.arc(x * k, y * k, r * k, 0, Math.PI * 2); c.fill(); };
  for (const b of gimmickPlayerBalls()) hole(b.x, b.y, isMainPlayerBall(b) ? lightR * 1.5 : lightR);
  for (const e of gimmickEnemies()) hole(e.x, e.y, (e.radius || 14) * 2.2);
  for (const it of gm.items) if (it.kind === 'firefly') hole(it.x, it.y, 34);
  ctx.drawImage(gDarkCv, 0, 0, size, sizeH || size);
  // 月
  ctx.fillStyle = 'rgba(255,248,210,0.9)'; ctx.shadowColor = '#fff6c0'; ctx.shadowBlur = 24; ctx.beginPath(); ctx.arc(A.r - 34, A.t + 34, 14, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
}
function gStar(x, y, r) { ctx.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } ctx.closePath(); ctx.fill(); }
function drawGimmickItem(it, now) {
  if (it.kind === 'balloon') {
    ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(it.x, it.y + 14); ctx.quadraticCurveTo(it.x + Math.sin(it.ph) * 5, it.y + 24, it.x, it.y + 34); ctx.stroke();
    ctx.fillStyle = it.col; if (it.gold) { ctx.shadowColor = '#ffe36b'; ctx.shadowBlur = 14; }
    ctx.beginPath(); ctx.ellipse(it.x, it.y, 11, 14, 0, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.beginPath(); ctx.ellipse(it.x - 4, it.y - 5, 3, 5, -0.4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = it.col; ctx.beginPath(); ctx.moveTo(it.x - 3, it.y + 16); ctx.lineTo(it.x + 3, it.y + 16); ctx.lineTo(it.x, it.y + 13); ctx.fill();
  } else if (it.kind === 'bubble') {
    const g = ctx.createRadialGradient(it.x - it.r * 0.3, it.y - it.r * 0.3, 1, it.x, it.y, it.r);
    g.addColorStop(0, 'rgba(255,255,255,0.5)'); g.addColorStop(0.7, `hsla(${(now / 10 + it.ph * 60) % 360},90%,75%,0.18)`); g.addColorStop(1, 'rgba(255,255,255,0.55)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(it.x, it.y, it.r, 0, Math.PI * 2); ctx.fill();
  } else if (it.kind === 'star') {
    const s = 9 + Math.sin(now / 120) * 2; ctx.globalAlpha = Math.min(1, it.life * 3); ctx.shadowColor = '#fff3a0'; ctx.shadowBlur = 16; ctx.fillStyle = '#ffe75c'; gStar(it.x, it.y, s); ctx.shadowBlur = 0; ctx.globalAlpha = 1;
  } else if (it.kind === 'coin') {
    const w = Math.abs(Math.cos(it.spin)) * 7 + 1; ctx.fillStyle = '#ffcf3a'; ctx.strokeStyle = '#a8740a'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(it.x, it.y, w, 8, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  } else if (it.kind === 'firefly') {
    const a = 0.6 + 0.4 * Math.sin(it.ph * 3); ctx.fillStyle = `rgba(214,255,122,${a})`; ctx.shadowColor = '#d6ff7a'; ctx.shadowBlur = 14; ctx.beginPath(); ctx.arc(it.x, it.y, 3.5, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
  } else if (it.kind === 'snowman') {
    const dx = it.shake && now - it.shake < 200 ? Math.sin(now / 20) * 3 : 0, x = it.x + dx;
    ctx.fillStyle = '#f4f8ff'; ctx.strokeStyle = '#b8c6dc'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(x, it.y + 6, 13, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(x, it.y - 11, 9, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#222'; ctx.fillRect(x - 4, it.y - 13, 2, 2); ctx.fillRect(x + 2, it.y - 13, 2, 2);
    ctx.fillStyle = '#ff8a2a'; ctx.beginPath(); ctx.moveTo(x, it.y - 10); ctx.lineTo(x + 7, it.y - 9); ctx.lineTo(x, it.y - 8); ctx.fill();
    ctx.fillStyle = '#d33'; ctx.fillRect(x - 8, it.y - 4, 16, 3);
  }
}
function drawGimmickFx(f, now) {
  if (f.kind === 'shoot') { const t = 1 - f.life, x = f.x + (f.tx - f.x) * t, y = f.y + (f.ty - f.y) * t; const g = ctx.createLinearGradient(x - 40, y - 55, x, y); g.addColorStop(0, 'rgba(255,250,200,0)'); g.addColorStop(1, 'rgba(255,250,200,0.95)'); ctx.strokeStyle = g; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x - 40, y - 55); ctx.lineTo(x, y); ctx.stroke(); }
  else if (f.kind === 'rocket') { ctx.fillStyle = '#fff2c0'; ctx.beginPath(); ctx.arc(f.x, f.y, 2.5, 0, Math.PI * 2); ctx.fill(); }
  else if (f.kind === 'burst') { ctx.globalAlpha = Math.max(0, f.life); ctx.fillStyle = f.col; for (const p of f.parts) { ctx.beginPath(); ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2); ctx.fill(); } ctx.globalAlpha = 1; }
  else if (f.kind === 'warn' || f.kind === 'rockfall') { const p = f.t / 50; ctx.strokeStyle = f.kind === 'warn' ? `rgba(255,230,90,${0.4 + p * 0.5})` : `rgba(255,120,60,${0.4 + p * 0.5})`; ctx.lineWidth = 2; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.arc(f.x, f.y, 34 * (1.3 - p * 0.3), 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
    if (f.kind === 'rockfall') { const A = gArea(), y = A.t - 30 + (f.y - A.t + 30) * p * p; ctx.globalAlpha = 0.25 + p * 0.3; ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(f.x, f.y + 6, 16 * p + 4, 6 * p + 2, 0, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; if (!(typeof drawObstacleSprite === 'function' && drawObstacleSprite('rock', f.x, y, 34, p * 4))) { ctx.fillStyle = '#7d766c'; ctx.beginPath(); ctx.arc(f.x, y, 15, 0, Math.PI * 2); ctx.fill(); } } }
  else if (f.kind === 'bolt') { const A = gArea(); ctx.strokeStyle = `rgba(255,250,200,${f.life})`; ctx.lineWidth = 4; ctx.shadowColor = '#fff6a0'; ctx.shadowBlur = 18; ctx.beginPath(); let x = f.x + gRand(-20, 20), y = A.t; ctx.moveTo(x, y); const n = 7; for (let i = 1; i <= n; i++) { y = A.t + (f.y - A.t) * i / n; x = i === n ? f.x : f.x + gRand(-18, 18); ctx.lineTo(x, y); } ctx.stroke(); ctx.shadowBlur = 0; }
  else if (f.kind === 'crash') { ctx.strokeStyle = `rgba(200,180,150,${f.life})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(f.x, f.y, 34 * (2 - f.life), 0, Math.PI * 2); ctx.stroke(); }
  else if (f.kind === 'flake') { ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.beginPath(); ctx.arc(f.x, f.y, f.s * 0.5, 0, Math.PI * 2); ctx.fill(); }
  else if (f.kind === 'streak') { ctx.strokeStyle = `rgba(230,255,230,${0.35 * f.life})`; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(f.x, f.y); ctx.lineTo(f.x - Math.cos(gm.wind) * f.len, f.y - Math.sin(gm.wind) * f.len); ctx.stroke(); if (Math.random() < 0.02) { ctx.fillStyle = '#7ccf5a'; ctx.beginPath(); ctx.ellipse(f.x, f.y, 4, 2, gm.wind, 0, Math.PI * 2); ctx.fill(); } }
}
function drawGimmickLabel(key, A, now) { // 左下にイベント名、開始時は中央に大きく告知
  const G = GIMMICKS[key];
  ctx.save();
  ctx.font = 'bold 11px sans-serif'; ctx.textBaseline = 'middle';
  const label = `${G.icon} ${G.name}${G.coin > 1 ? ' コイン×' + G.coin : ''}${GM_FILL[key] ? `　×${gm.broke || 0}` : ''}`, w = ctx.measureText(label).width + 14;
  ctx.fillStyle = 'rgba(10,12,30,0.6)'; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(A.l + 6, A.b - 26, w, 20, 10) : ctx.rect(A.l + 6, A.b - 26, w, 20); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.fillText(label, A.l + 13, A.b - 16);
  const t = (now - gm.bannerAt) / 2600;
  if (gm.bannerAt && t < 1) {
    const inT = Math.min(1, t * 6), outA = t > 0.8 ? (1 - t) / 0.2 : 1, y = arena.y + A.h * 0.22; // 中央の「ステージN」や上の解放告知と重ならない位置
    ctx.globalAlpha = outA; ctx.translate(arena.x + (1 - inT) * -A.w * 0.6, y);
    ctx.fillStyle = 'rgba(10,12,30,0.78)'; ctx.fillRect(-A.w / 2, -30, A.w, 60);
    ctx.fillStyle = '#ffe36b'; ctx.fillRect(-A.w / 2, -30, A.w, 2); ctx.fillRect(-A.w / 2, 28, A.w, 2);
    ctx.textAlign = 'center'; ctx.font = 'bold 20px sans-serif'; ctx.fillStyle = '#fff'; ctx.shadowColor = '#000'; ctx.shadowBlur = 6;
    ctx.fillText(`${G.icon} ${G.name}`, 0, -8);
    ctx.font = 'bold 12px sans-serif'; ctx.fillStyle = '#ffe9a8'; ctx.fillText(G.desc, 0, 15);
    if (gm.isNew) { ctx.font = 'bold 12px sans-serif'; ctx.fillStyle = '#ff5c7a'; ctx.fillText('NEW!', A.w / 2 - 26, -18); }
  }
  ctx.restore();
}

// タップで拾える物（星・風船・シャボン玉・コイン・ホタル）
canvas.addEventListener('pointerdown', event => {
  if (!curGimmick() || phase !== 'battle') return;
  const rect = canvas.getBoundingClientRect();
  const x = (event.clientX - rect.left) * (size / rect.width), y = (event.clientY - rect.top) * ((sizeH || size) / rect.height);
  const it = gm.items.find(i => !i.dead && i.kind !== 'snowman' && Math.hypot(i.x - x, i.y - y) < (i.r || 12) + 14);
  if (it) popGimmickItem(it);
});

// ---- 既存処理へのつなぎ込み ----
{ const orig = step; step = function () { orig(); if (phase === 'battle' && !filmMode) tickGimmick(getEffectiveSpeed()); }; }
{ const orig = draw; draw = function () { orig(); try { if (getActiveTab() === 'game') drawGimmick(); } catch (e) { console.error(e); } }; }
{ const orig = getEffectiveSpeed; getEffectiveSpeed = function () { const v = orig(); return gm.key === 'haste' && phase === 'battle' ? v * 1.3 : v; }; }
{ const orig = onStageClear; onStageClear = function (passed) { // イベントのコイン倍率
  const m = gimmickCoinMult(), before = game.coins; orig(passed);
  const d = game.coins - before;
  if (m > 1 && d > 0) { const extra = Math.round(d * (m - 1)); game.coins += extra; spawnDamageText(arena.x, arena.y - 46, `${GIMMICKS[gm.key] ? GIMMICKS[gm.key].icon : ''} イベントボーナス +${formatCoinNumber(extra)} 🟡`, '#ffe36b', 0.014); }
}; }
function dbgNextGimmick() { // デバッグ：イベントを順番に切り替える（最後の次は通常に戻す）
  const i = dbgGimmick ? GIMMICK_KEYS.indexOf(dbgGimmick) + 1 : 0;
  dbgGimmick = i < GIMMICK_KEYS.length ? GIMMICK_KEYS[i] : null;
  showNotice(dbgGimmick ? `DEBUG: イベント「${GIMMICKS[dbgGimmick].name}」` : 'DEBUG: イベント固定を解除');
}
// 戦績ページのミッション欄の下に、ステージイベント図鑑（見つけた数）
{ const orig = renderQuests; renderQuests = function () {
  orig(); const host = document.getElementById('questBox'); if (!host) return;
  const seen = game.gimmickSeen || {}, n = GIMMICK_KEYS.filter(k => seen[k]).length;
  host.insertAdjacentHTML('beforeend', `<div class="qb-sec gm-book"><div class="qb-head">🗺️ ステージイベント図鑑 ${n}/${GIMMICK_KEYS.length}<small>（初めて出会うと 💎${GIMMICK_FIND_GEMS}）</small></div><div class="gm-grid">${GIMMICK_KEYS.map(k => seen[k] ? `<div class="gm-cell" title="${GIMMICKS[k].desc}"><b>${GIMMICKS[k].icon}</b><span>${GIMMICKS[k].name}</span></div>` : '<div class="gm-cell un"><b>？</b><span>？？？</span></div>').join('')}</div></div>`);
}; }

// ===== 壺割りまくり・芝刈りしまくり・ブロック叩きまくり：障害物をずらっと並べ、壊してもまた出てくる =====
const GM_FILL = {
  pots:   { kind: 'pot', n: 16, size: 0.07, regrow: 70 },
  mow:    { kind: 'bush', n: 26, size: 0.055, regrow: 35 },
  blocks: { kind: 'qbox', n: 12, size: 0.075, regrow: 0, hits: 6 },
  tansu:  { kind: 'qbox', n: 9, size: 0.085, regrow: 80, hits: 3, tansu: true },
};
function gmFillSpots() { // ゲーム画面いっぱいの格子（少しずらして自然に）
  const A = gArea(), pts = [], cols = 6, rows = Math.max(5, Math.round(cols * A.h / A.w));
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) pts.push({ x: A.l + A.w * (c + 0.5 + (r % 2 ? 0.25 : -0.25) * 0.6) / cols, y: A.t + A.h * (r + 0.5) / rows });
  return pts;
}
function gmMakeObstacle(key, p, rnd) {
  const F = GM_FILL[key], r = arena.radius * F.size, floorKey = getFloorKey(game.stage);
  const o = { x: p.x, y: p.y, r, seed: rnd(), kind: F.kind, hp: F.kind === 'qbox' ? 1 : 1, cracks: [], gm: key, bornAt: Date.now() };
  if (F.kind === 'qbox') { o.multi = F.hits; if (F.tansu) o.tansu = true; } // 何度も叩ける（タンスは引き出し3段）
  else o.sprite = F.kind === 'bush' ? ['b_bush', 'b_bush2', 'b_bush3'][Math.floor(rnd() * 3)] : natureSpriteFor(F.kind, floorKey, rnd);
  return o;
}
function gmSpotFree(p, r) { return !obstacles.some(o => Math.hypot(o.x - p.x, o.y - p.y) < o.r + r + 6) && ![...balls, ...adds].some(b => Math.hypot(b.x - p.x, b.y - p.y) < (b.radius || 14) + r + 10); }
function fillGimmickObstacles(key) {
  const F = GM_FILL[key]; if (!F) return;
  obstacles = obstacles.filter(o => o.debug || o.gm === key); // ほかの障害物はどけて、この遊びに集中
  const rnd = stageRand(game.stage * 7 + 1), spots = gmFillSpots().sort(() => rnd() - 0.5), r = arena.radius * F.size;
  for (const p of spots) { if (obstacles.filter(o => o.gm === key).length >= F.n) break; if (gmSpotFree(p, r)) obstacles.push(gmMakeObstacle(key, p, rnd)); }
}
{ const orig = setupObstacles; setupObstacles = function () { orig.apply(this, arguments); const k = gimmickForStage(game.stage); if (GM_FILL[k]) fillGimmickObstacles(k); }; }
// また生えてくる（壺・草）
let gmRegrowT = 0;
{ const orig = tickGimmick; tickGimmick = function (sp) {
  orig.apply(this, arguments);
  const k = gm.key, F = GM_FILL[k]; if (!F || !F.regrow) return;
  for (const o of obstacles) if (o.tansu && o.used && Date.now() - (o.usedAt || 0) > 3000) o.broken = true; // 空になったタンスは消える
  if (gm.lastFill !== game.stage + ':' + k) { gm.lastFill = game.stage + ':' + k; if (!obstacles.some(o => o.gm === k)) fillGimmickObstacles(k); }
  gmRegrowT += sp; if (gmRegrowT < F.regrow) return; gmRegrowT = 0;
  if (obstacles.filter(o => o.gm === k).length >= F.n) return;
  const r = arena.radius * F.size, spots = gmFillSpots().filter(p => gmSpotFree(p, r));
  if (spots.length) { const o = gmMakeObstacle(k, spots[Math.floor(Math.random() * spots.length)], Math.random); obstacles.push(o); spawnHitParticles(o.x, o.y, F.kind === 'bush' ? '#7fd06a' : '#c8a070'); }
}; }
// 壊したときのごほうび（この遊びのものは必ずコイン）
{ const orig = breakObstacleLoot; breakObstacleLoot = function (o) {
  if (!o.gm) return orig.apply(this, arguments);
  gm.broke = (gm.broke || 0) + 1;
  const m = o.gm === 'mow' ? 0.12 : 0.3, c = Math.max(1, Math.round(stageCoinRaw() * computeBonuses().coinMult * m));
  game.coins += c; spawnCoinDrop(o.x, o.y, c, o.gm === 'mow' ? 1 : 3);
  spawnDamageText(o.x, o.y - 10, `${o.gm === 'mow' ? '🌿' : '🏺'} +${formatCoinNumber(c)}`, '#ffd76b', 0.022);
  playCoinChime(Math.min(12, gm.broke % 13));
  if (gm.broke % 25 === 0) { spawnDamageText(arena.x, arena.y - 40, `${o.gm === 'mow' ? '🌿 芝刈り' : '🏺 壺割り'} ${gm.broke}コンボ！ ボーナス`, '#ffe36b', 0.012, true); const b = c * 10; game.coins += b; spawnCoinBurst(arena.x, arena.y - 20, b, 8); }
  updateStatsUI();
}; }
// ハテナブロック：何度も叩ける（叩くたびにコイン、最後の1回は豪華）
{ const orig = openQBox; openQBox = function (o) {
  if (o.tansu) return openTansu(o);
  if (!o.gm || !(o.multi > 0)) return orig.apply(this, arguments);
  if (Date.now() - (o.popAt || 0) < 220) return; // 連続ヒットしすぎないように
  o.multi--; o.popAt = Date.now(); gm.broke = (gm.broke || 0) + 1;
  if (o.multi <= 0) { o.used = true; return orig.apply(this, arguments); } // 最後は通常のハテナボックスの中身
  const c = Math.max(1, Math.round(stageCoinRaw() * computeBonuses().coinMult * 0.35));
  game.coins += c; spawnCoinDrop(o.x, o.y - o.r, c, 2);
  spawnDamageText(o.x, o.y - o.r - 10, `🧱 +${formatCoinNumber(c)}（あと${o.multi}）`, '#ffd76b', 0.022);
  playTone(988, 0.06, 'square', 0.06); setTimeout(() => playCoinChime(gm.broke % 13), 50);
  spawnHitParticles(o.x, o.y - o.r, '#ffd76b'); updateStatsUI();
}; }

// タンス：ぶつかるたびに引き出しを1段ずつ開けて、中身を見つける（RPGの「タンスを調べた！」）
const TANSU_JUNK = ['古びたくつしたを見つけた…', 'ホコリが舞った…', 'なにもなかった…', 'ヘソクリのメモ「残念でした」', 'ぬいぐるみがこっちを見ている…'];
function openTansu(o) {
  if (o.used || Date.now() - (o.popAt || 0) < 250) return;
  o.multi = (o.multi || 3) - 1; o.popAt = Date.now(); o.opened = true; gm.broke = (gm.broke || 0) + 1;
  if (o.multi <= 0) { o.used = true; o.usedAt = Date.now(); }
  playTone(520, 0.05, 'square', 0.05, 380); setTimeout(() => playTone(700, 0.08, 'triangle', 0.06), 70); // ガラッ
  const x = o.x, y = o.y - o.r - 12, r = Math.random(), unit = Math.max(1, stageCoinRaw() * computeBonuses().coinMult);
  let txt, col = '#ffd76b';
  if (r < 0.45) { const c = Math.round(unit * (0.3 + Math.random() * 0.5)); game.coins += c; spawnCoinDrop(x, o.y, c, 3); txt = `💰 ${formatCoinNumber(c)}コインを見つけた！`; playCoinChime(gm.broke % 13); }
  else if (r < 0.58) { const pl = balls.find(isMainPlayerBall); if (pl) pl.hp = Math.min(pl.maxHp, pl.hp + Math.round(pl.maxHp * 0.2)); txt = '🌿 やくそうを見つけた！ HP回復'; col = '#7ee787'; }
  else if (r < 0.65) { game.gems += 1; txt = '💎 ジェムを見つけた！'; col = '#64e8ff'; playCoinChime(10); }
  else if (r < 0.70) { const rar = rollChestRarity(2); dropTreasureChest(rar); txt = `🎁 ${RARITY_INFO[rar].label}の宝箱を見つけた！`; col = RARITY_INFO[rar].color; }
  else if (r < 0.74) { game.redPotions = (game.redPotions || 0) + 1; if (typeof updateRedPotionButton === 'function') updateRedPotionButton(); txt = '🧪 スキル全快ポーションを見つけた！'; col = '#ff8ad8'; }
  else { txt = TANSU_JUNK[Math.floor(Math.random() * TANSU_JUNK.length)]; col = '#c8c8d0'; }
  spawnDamageText(x, y, txt, col, 0.016, r < 0.74);
  spawnHitParticles(x, o.y - o.r * 0.4, '#e8c080');
  if (gm.broke % 15 === 0) { const b = Math.round(unit * 6); game.coins += b; spawnCoinBurst(arena.x, arena.y - 20, b, 8); spawnDamageText(arena.x, arena.y - 44, `🗄️ タンス ${gm.broke}段！ ボーナス`, '#ffe36b', 0.012, true); }
  updateStatsUI();
}
