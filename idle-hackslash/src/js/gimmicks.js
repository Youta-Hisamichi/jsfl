// ---- ステージイベント（ギミック）：数ステージごとに見た目と遊びが変わる。序盤は毎回なにかが起きる ----
// 3ステージ1組で同じイベントが続く（ボス階・試練の塔はお休み）。初めて見たイベントは「NEW!」でステージ図鑑に登録
const GIMMICKS = {
  stars:     { name: '流れ星の夜', icon: '🌠', desc: '落ちた星にさわるかタップでコイン', coin: 1, tint: 'rgba(10,16,60,0.12)' },
  night:     { name: '月夜の草原', icon: '🌙', desc: '暗い夜。ホタルを集めるとコイン', coin: 1.3 },
  wind:      { name: '強風注意報', icon: '🍃', desc: 'みんな風に流される！ コイン×1.2', coin: 1.2 },
  treasure:  { name: '宝さがし', icon: '🗺️', desc: '✕じるしの上を通ると宝箱！', coin: 1 },
  thunder:   { name: '雷雨', icon: '⛈️', desc: '雷が敵に落ちて大ダメージ', coin: 1.1, tint: 'rgba(20,24,40,0.14)' },
  bubbles:   { name: 'シャボン玉の庭', icon: '🫧', desc: 'シャボン玉を割るとコイン', coin: 1 },
  gold:      { name: 'ゴールドラッシュ', icon: '💰', desc: '撃破コイン×2！', coin: 2, tint: 'rgba(255,200,40,0.08)' },
  haste:     { name: '疾風ステージ', icon: '⚡', desc: 'すべてが速い！ コイン×1.2', coin: 1.2 },
  rocks:     { name: '落石注意', icon: '🪨', desc: '岩が降ってきて敵をつぶす', coin: 1.1 },
  snow:      { name: '雪まつり', icon: '⛄', desc: '雪が舞う。雪だるまを壊すとコイン', coin: 1 },
  slime:     { name: 'ぷるぷる床', icon: '🟢', desc: '跳ね返りが強くなる。コイン×1.2', coin: 1.2 },
  pots:      { name: '壺割りまくり', icon: '🏺', desc: '壺がずらり！ 割るたびにコイン', coin: 1 },
  mow:       { name: '芝刈りしまくり', icon: '🌿', desc: '草ぼうぼう！ 刈るたびにコイン', coin: 1 },
  blocks:    { name: 'パンドラの箱叩きまくり', icon: '❓', desc: 'パンドラの箱を何度も叩いてコイン', coin: 1 },
  tansu:     { name: 'タンス開けまくり', icon: '🗄️', desc: 'タンスを調べまくってお宝さがし！', coin: 1 },
  castle:    { name: '王城の決戦', icon: '🏰', desc: 'シャンデリアが落ちて敵に大ダメージ。コイン×1.3', coin: 1.3, tint: 'rgba(40,10,6,0.12)' },
  village:   { name: 'のどかな村', icon: '🏡', desc: '逃げまわるニワトリにさわるとコイン', coin: 1.1 },
  town:      { name: 'にぎわう城下町', icon: '🏘️', desc: '落とし物の財布を拾おう。コイン×1.4', coin: 1.4 },
  ruins:     { name: '古代遺跡', icon: '🏛️', desc: '石柱が倒れて敵に大ダメージ。コイン×1.2', coin: 1.2 },
  graveyard: { name: '真夜中の墓地', icon: '🪦', desc: '暗い墓場。人魂を集めるとコイン', coin: 1.3 },
  church:    { name: '祈りの教会', icon: '⛪', desc: '聖なる光が敵を打つ。コイン×1.2', coin: 1.2 },
};
const GIMMICK_KEYS = Object.keys(GIMMICKS);
// 1周目の序盤は、毎組ちがうイベントを見せて飽きさせない
const GIMMICK_FIRST_RUN = ['stars', 'pots', 'mow', 'wind', 'treasure', 'blocks', 'tansu', 'bubbles', 'thunder', 'gold', 'snow', 'rocks', 'haste', 'slime', 'castle', 'village', 'town', 'ruins', 'graveyard', 'church'];
const GIMMICK_FROM_STAGE = 3, GIMMICK_SPAN = 3, GIMMICK_FIND_GEMS = 1; // 初めて出会ったイベントはジェムのごほうび
let dbgGimmick = null; // デバッグで固定表示するイベント
let dbgStageNow = null, dbgStagePrev = null; // デバッグの一番上に出す、今と直前のステージ名
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
  if (k === 'night' && (stage < 300 || r() < 0.75)) k = GIMMICK_KEYS[(GIMMICK_KEYS.indexOf(k) + 7) % GIMMICK_KEYS.length]; // 月夜の草原（ホタル）は後半にまれに
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
  const name = key ? `${GIMMICKS[key].icon} ${GIMMICKS[key].name}` : '通常ステージ'; // デバッグ表示用に「今」と「直前」のステージ名を覚えておく
  if (!dbgStageNow || dbgStageNow.name !== name) { dbgStagePrev = dbgStageNow; dbgStageNow = { name, key: key || '-', stage: game.stage }; }
  gm = { key, id, t: 0, items: [], fx: [], bannerAt: 0, isNew: false, treasureDone: false, nextAt: 0, wind: 0 };
  if (!key) return;
  game.gimmickSeen = game.gimmickSeen || {};
  gm.isNew = !game.gimmickSeen[key]; game.gimmickSeen[key] = true;
  // ステージイベント図鑑（初クリアのジェム）はなくした // ジェムは初めてクリアしたときに
  gm.bannerAt = Date.now();
  playTone(660, 0.12, 'triangle', 0.06, 990); setTimeout(() => playTone(990, 0.16, 'triangle', 0.06, 1320), 120);
  const A = gArea();
  if (key === 'treasure') gm.spot = { x: gRand(A.l + A.w * 0.2, A.r - A.w * 0.2), y: gRand(A.t + A.h * 0.2, A.b - A.h * 0.2) };
  if (key === 'snow') for (let i = 0; i < 3; i++) gm.items.push({ kind: 'snowman', x: gRand(A.l + 40, A.r - 40), y: gRand(A.t + 50, A.b - 40), hp: 3, flip: Math.random() < 0.5 }); // 向きは左右ランダム
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
    else if (key === 'bubbles') { gm.nextAt = gm.t + gRand(25, 50); gm.items.push({ kind: 'bubble', x: gRand(A.l + 20, A.r - 20), y: A.b + 20, vy: -gRand(0.4, 0.9), r: gRand(9, 17), ph: Math.random() * 6 }); }
    else if (key === 'fireworks') { gm.nextAt = gm.t + gRand(35, 75); for (let k = Math.random() < 0.3 ? 2 : 1; k > 0; k--) { const x = gRand(A.l + 40, A.r - 40), y = gRand(A.t + 40, A.t + A.h * 0.45); gm.fx.push({ kind: 'rocket', x, y: A.b + k * 30, ty: y, life: 1, hue: Math.floor(Math.random() * 360) }); } playTone(300, 0.35, 'sine', 0.025, 900); } // ときどき2発同時
    else if (key === 'thunder') { gm.nextAt = gm.t + gRand(170, 240); const foes = gimmickEnemies(); if (foes.length) { const e = foes[Math.floor(Math.random() * foes.length)]; gm.fx.push({ kind: 'warn', target: e, x: e.x, y: e.y, t: 0 }); } }
    else if (key === 'castle') { gm.nextAt = gm.t + gRand(150, 230); const foes = gimmickEnemies(); if (foes.length) { const e = foes[Math.floor(Math.random() * foes.length)]; gm.fx.push({ kind: 'rockfall', chand: true, target: e, x: e.x, y: e.y, t: 0 }); } }
    else if (key === 'rocks') { gm.nextAt = gm.t + gRand(140, 210); const foes = gimmickEnemies(); if (foes.length) { const e = foes[Math.floor(Math.random() * foes.length)]; gm.fx.push({ kind: 'rockfall', target: e, x: e.x, y: e.y, t: 0 }); } }
    else if (key === 'coinrain') { gm.nextAt = gm.t + gRand(14, 30); gm.items.push({ kind: 'coin', x: gRand(A.l + 16, A.r - 16), y: A.t - 10, vy: gRand(1.2, 2), spin: Math.random() * 6, landY: gRand(A.t + A.h * 0.3, A.b - 16) }); }
    else if (key === 'night') { gm.nextAt = gm.t + 120; if (gm.items.filter(i => i.kind === 'firefly').length < 6) gm.items.push(makeFirefly(A)); }
    else if (key === 'snow') { gm.nextAt = gm.t + 3; gm.fx.push({ kind: 'flake', x: gRand(A.l - 20, A.r), y: A.t - 8, vx: gRand(0.3, 0.9), vy: gRand(0.6, 1.3), rot: Math.random() * 6, s: gRand(3, 6) }); }
    else if (key === 'wind') { gm.nextAt = gm.t + 2; gm.fx.push({ kind: 'streak', x: gRand(A.l, A.r), y: gRand(A.t, A.b), life: 1, len: gRand(20, 60) }); }
    else gm.nextAt = gm.t + 60;
  }
  // 流れる力（風）
  if (key === 'wind') {
    gm.wind += 0.0015 * sp;
    for (const b of [...balls, ...adds]) {
      if (b.isDying || b.spawnTimer > 0 || (b.isCompanion && b.hp <= 0) || b.isBoss) continue;
      const fx = Math.cos(gm.wind) * 0.06, fy = Math.sin(gm.wind) * 0.06;
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
    else if (f.kind === 'rocket') { f.y -= 5 * sp; f.trail = f.trail || []; f.trail.push({ x: f.x + gRand(-1, 1), y: f.y, l: 1 }); for (const t of f.trail) t.l -= 0.06 * sp; f.trail = f.trail.filter(t => t.l > 0); if (f.y <= f.ty) { f.dead = true; gm.fx.push(makeFireworkBurst(f.x, f.ty, f.hue)); thump(90, 40, 0.25, 0.25); playNoiseBurst(0.18, 0.12); } }
    else if (f.kind === 'burst') { f.life -= (f.type === 'willow' ? 0.010 : 0.014) * sp; for (const p of f.parts) { p.px = p.x; p.py = p.y; p.x += p.vx * sp; p.y += p.vy * sp; p.vy += (f.type === 'willow' ? 0.045 : 0.03) * sp; p.vx *= Math.pow(0.975, sp); p.vy *= Math.pow(0.985, sp); } if (f.life <= 0) f.dead = true; }
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
  if (it.kind === 'bubble') { playTone(1300, 0.05, 'sine', 0.05, 1900); spawnHitParticles(it.x, it.y, '#bfe9ff'); gimmickGiveCoins(it.x, it.y, 0.12, '🫧'); }
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
  if (G.tint && !BRIGHT_FLOORS[getFloorKey(game.stage)]) { ctx.fillStyle = G.tint; fillArenaRect(); } // 雪原など明るい床はイベントの色かぶせで暗くしない
  if (key === 'night') drawGimmickDark(A, 'rgba(4,6,28,0.62)', 70);
  if (key === 'gold') { for (let i = 0; i < 14; i++) { const t = now / 900 + i * 1.7, x = A.l + ((i * 97 + now / 40) % A.w), y = A.t + ((i * 61 + Math.sin(t) * 40 + A.h) % A.h); ctx.globalAlpha = 0.4 + 0.4 * Math.sin(t * 3); ctx.fillStyle = '#ffe36b'; gStar(x, y, 4); } ctx.globalAlpha = 1; }
  if (key === 'treasure' && gm.spot && !gm.treasureDone) { const s = 11 + Math.sin(now / 200) * 2; ctx.strokeStyle = 'rgba(200,30,30,0.85)'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(gm.spot.x - s, gm.spot.y - s); ctx.lineTo(gm.spot.x + s, gm.spot.y + s); ctx.moveTo(gm.spot.x + s, gm.spot.y - s); ctx.lineTo(gm.spot.x - s, gm.spot.y + s); ctx.stroke(); ctx.globalAlpha = 0.5 + 0.5 * Math.sin(now / 150); ctx.fillStyle = '#fff6b0'; gStar(gm.spot.x + 12, gm.spot.y - 12, 3); ctx.globalAlpha = 1; }
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
  for (const it of gm.items) if (it.kind === 'firefly' || it.kind === 'wisp') hole(it.x, it.y, it.kind === 'wisp' ? 46 : 34);
  ctx.drawImage(gDarkCv, 0, 0, size, sizeH || size);
  // 月
  ctx.fillStyle = 'rgba(255,248,210,0.9)'; ctx.shadowColor = '#fff6c0'; ctx.shadowBlur = 24; ctx.beginPath(); ctx.arc(A.r - 34, A.t + 34, 14, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
}
function gStar(x, y, r) { ctx.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } ctx.closePath(); ctx.fill(); }
function drawGimmickItem(it, now) {
  if (it.kind === 'bubble') {
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
    if (it.flip) { ctx.save(); ctx.translate(x * 2, 0); ctx.scale(-1, 1); } // 左右反転（x を軸に）
    const drawn = typeof drawObstacleSprite === 'function' && drawObstacleSprite('snowman', x, it.y - 2, 44);
    if (drawn) { if (it.flip) ctx.restore(); return; }
    ctx.fillStyle = '#f4f8ff'; ctx.strokeStyle = '#b8c6dc'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(x, it.y + 6, 13, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(x, it.y - 11, 9, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#222'; ctx.fillRect(x - 4, it.y - 13, 2, 2); ctx.fillRect(x + 2, it.y - 13, 2, 2);
    ctx.fillStyle = '#ff8a2a'; ctx.beginPath(); ctx.moveTo(x, it.y - 10); ctx.lineTo(x + 7, it.y - 9); ctx.lineTo(x, it.y - 8); ctx.fill();
    ctx.fillStyle = '#d33'; ctx.fillRect(x - 8, it.y - 4, 16, 3);
    if (it.flip) ctx.restore();
  }
}
// ===== 花火：加算合成で光る（光の粒は色ごとにぼかした絵を作って使い回す） =====
const gGlowCache = {};
function gGlow(hue, light = 70) {
  const k = hue + ':' + light; if (gGlowCache[k]) return gGlowCache[k];
  const cv = document.createElement('canvas'); cv.width = cv.height = 32; const c = cv.getContext('2d');
  const g = c.createRadialGradient(16, 16, 0, 16, 16, 16);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.18, `hsla(${hue},100%,${Math.min(95, light + 15)}%,0.95)`); g.addColorStop(0.45, `hsla(${hue},100%,${light}%,0.45)`); g.addColorStop(1, `hsla(${hue},100%,${light - 20}%,0)`);
  c.fillStyle = g; c.fillRect(0, 0, 32, 32); return (gGlowCache[k] = cv);
}
const FIREWORK_TYPES = ['peony', 'peony', 'ring', 'double', 'willow', 'multi'];
function makeFireworkBurst(x, y, hue) {
  const type = FIREWORK_TYPES[Math.floor(Math.random() * FIREWORK_TYPES.length)], parts = [];
  const add = (n, sMin, sMax, h) => { for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2 + gRand(-0.05, 0.05), s = gRand(sMin, sMax); parts.push({ x, y, px: x, py: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, hue: h, tw: Math.random() * 6 }); } };
  if (type === 'ring') add(48, 3.0, 3.2, hue);
  else if (type === 'double') { add(40, 2.6, 3.4, hue); add(24, 1.1, 1.6, (hue + 150) % 360); }
  else if (type === 'willow') add(56, 1.4, 3.0, 42); // 金色のしだれ柳
  else if (type === 'multi') { for (let i = 0; i < 60; i++) { const a = Math.random() * Math.PI * 2, s = gRand(0.8, 3.4); parts.push({ x, y, px: x, py: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, hue: Math.floor(Math.random() * 360), tw: Math.random() * 6 }); } }
  else add(60, 1.0, 3.4, hue);
  return { kind: 'burst', type, x, y, hue, parts, life: 1 };
}
function drawFireworkBurst(f) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const age = 1 - f.life;
  if (age < 0.25) { // 開いた瞬間のまぶしい光
    const r = 30 + age * 360, a = (1 - age / 0.25) * 0.55, g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, r);
    g.addColorStop(0, `hsla(${f.hue},100%,90%,${a})`); g.addColorStop(0.4, `hsla(${f.hue},100%,65%,${a * 0.45})`); g.addColorStop(1, `hsla(${f.hue},100%,50%,0)`);
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(f.x, f.y, r, 0, Math.PI * 2); ctx.fill();
  }
  const t = Date.now() / 60, fade = Math.min(1, f.life * 1.6), sz = f.type === 'willow' ? 9 : 11;
  ctx.lineCap = 'round';
  for (const p of f.parts) {
    let al = fade;
    if (f.life < 0.35) al *= 0.45 + 0.55 * Math.abs(Math.sin(t + p.tw * 3)); // 消えぎわにチカチカ
    ctx.globalAlpha = al * 0.7; ctx.strokeStyle = `hsl(${p.hue},100%,65%)`; ctx.lineWidth = 2;
    const tl = f.type === 'willow' ? 7 : 4; // 尾の長さ
    ctx.beginPath(); ctx.moveTo(p.x - p.vx * tl, p.y - p.vy * tl); ctx.lineTo(p.x, p.y); ctx.stroke();
    ctx.globalAlpha = al; ctx.drawImage(gGlow(p.hue), p.x - sz / 2, p.y - sz / 2, sz, sz);
  }
  ctx.restore();
}
function drawGimmickFx(f, now) {
  if (f.kind === 'shoot') { const t = 1 - f.life, x = f.x + (f.tx - f.x) * t, y = f.y + (f.ty - f.y) * t; const g = ctx.createLinearGradient(x - 40, y - 55, x, y); g.addColorStop(0, 'rgba(255,250,200,0)'); g.addColorStop(1, 'rgba(255,250,200,0.95)'); ctx.strokeStyle = g; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x - 40, y - 55); ctx.lineTo(x, y); ctx.stroke(); }
  else if (f.kind === 'rocket') { // 上がっていく火の玉と火の粉の尾（加算合成で光る）
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (const t of f.trail || []) { ctx.globalAlpha = t.l * 0.8; ctx.drawImage(gGlow(40), t.x - 5, t.y - 5, 10, 10); }
    ctx.globalAlpha = 1; ctx.drawImage(gGlow(45), f.x - 12, f.y - 12, 24, 24); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(f.x, f.y, 2, 0, Math.PI * 2); ctx.fill();
    ctx.restore(); }
  else if (f.kind === 'burst') drawFireworkBurst(f);
  else if (f.kind === 'warn' || f.kind === 'rockfall') { const p = f.t / 50; ctx.strokeStyle = f.kind === 'warn' ? `rgba(255,230,90,${0.4 + p * 0.5})` : `rgba(255,120,60,${0.4 + p * 0.5})`; ctx.lineWidth = 2; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.arc(f.x, f.y, 34 * (1.3 - p * 0.3), 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
    if (f.kind === 'rockfall') { const A = gArea(), y = A.t - 30 + (f.y - A.t + 30) * p * p; ctx.globalAlpha = 0.25 + p * 0.3; ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(f.x, f.y + 6, 16 * p + 4, 6 * p + 2, 0, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; if (f.chand) drawChandelier(f.x, y, 1); else if (!(typeof drawObstacleSprite === 'function' && drawObstacleSprite('rock', f.x, y, 34, p * 4))) { ctx.fillStyle = '#7d766c'; ctx.beginPath(); ctx.arc(f.x, y, 15, 0, Math.PI * 2); ctx.fill(); } } }
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
  let ly = A.b - 26; // 左下のミッション枠が出ているときは、その上に出して重ねない
  const mis = document.getElementById('obMission');
  if (mis && mis.style.display !== 'none' && mis.offsetHeight) ly = Math.min(ly, mis.getBoundingClientRect().top - canvas.getBoundingClientRect().top - 24);
  ctx.fillStyle = 'rgba(10,12,30,0.6)'; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(A.l + 6, ly, w, 20, 10) : ctx.rect(A.l + 6, ly, w, 20); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.fillText(label, A.l + 13, ly + 10);
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

// タップで拾える物（星・シャボン玉・コイン・ホタル）
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
  if (false) host.insertAdjacentHTML('beforeend', `<div class="qb-sec gm-book"><div class="qb-head">🗺️ ステージイベント図鑑 ${n}/${GIMMICK_KEYS.length}<small>（初めてクリアすると 💎${GIMMICK_FIND_GEMS}）</small></div><div class="gm-grid">${GIMMICK_KEYS.map(k => seen[k] ? `<div class="gm-cell" title="${GIMMICKS[k].desc}"><b>${GIMMICKS[k].icon}</b><span>${GIMMICKS[k].name}</span></div>` : '<div class="gm-cell un"><b>？</b><span>？？？</span></div>').join('')}</div></div>`);
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
// パンドラの箱：何度も叩ける（叩くたびにコイン、最後の1回は豪華）
{ const orig = openQBox; openQBox = function (o) {
  if (o.tansu) return openTansu(o);
  if (!o.gm || !(o.multi > 0)) return orig.apply(this, arguments);
  if (Date.now() - (o.popAt || 0) < 220) return; // 連続ヒットしすぎないように
  o.multi--; o.popAt = Date.now(); gm.broke = (gm.broke || 0) + 1;
  if (o.multi <= 0) { o.used = true; return orig.apply(this, arguments); } // 最後は通常のパンドラの箱の中身
  const c = Math.max(1, Math.round(stageCoinRaw() * computeBonuses().coinMult * 0.35));
  game.coins += c; spawnCoinDrop(o.x, o.y - o.r, c, 2);
  spawnDamageText(o.x, o.y - o.r - 10, `🟡 +${formatCoinNumber(c)}（あと${o.multi}）`, '#ffd76b', 0.022);
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
  let txt, col = '#ffd76b', chestRar = null;
  if (r < 0.45) { const c = Math.round(unit * (0.3 + Math.random() * 0.5)); game.coins += c; spawnCoinDrop(x, o.y, c, 3); txt = `💰 ${formatCoinNumber(c)}コインを見つけた！`; playCoinChime(gm.broke % 13); }
  else if (r < 0.58) { const pl = balls.find(isMainPlayerBall); if (pl) pl.hp = Math.min(pl.maxHp, pl.hp + Math.round(pl.maxHp * 0.2)); txt = '🧪 回復ポーションを見つけた！ HP回復'; col = '#7ee787'; }
  else if (r < 0.65) { const fr = rollRecordFeather(); addFea(fr, 1); txt = `🪶 ${RARITY_INFO[fr].label}の進化の羽を見つけた！`; col = RARITY_INFO[fr].color; playCoinChime(10); }
  else if (r < 0.70) { const rar = rollChestRarity(2); dropTreasureChest(rar); txt = `${RARITY_INFO[rar].label}の宝箱を見つけた！`; col = RARITY_INFO[rar].color; chestRar = rar; }
  else if (r < 0.74) { game.redPotions = (game.redPotions || 0) + 1; if (typeof updateRedPotionButton === 'function') updateRedPotionButton(); txt = '🧪 スキルポーションを見つけた！'; col = '#ff8ad8'; }
  else { txt = TANSU_JUNK[Math.floor(Math.random() * TANSU_JUNK.length)]; col = '#c8c8d0'; }
  spawnDamageText(x, y, txt, col, 0.016, r < 0.74); if (chestRar) attachChestImg(chestRar);
  spawnHitParticles(x, o.y - o.r * 0.4, '#e8c080');
  if (gm.broke % 15 === 0) { const b = Math.round(unit * 6); game.coins += b; spawnCoinBurst(arena.x, arena.y - 20, b, 8); spawnDamageText(arena.x, arena.y - 44, `🗄️ タンス ${gm.broke}段！ ボーナス`, '#ffe36b', 0.012, true); }
  updateStatsUI();
}

// ===== ドーピングの種（ドラクエの「ちからのたね」風）=====
// タンス・壺・宝箱から出る。使うとその周回のあいだ能力アップ（転生でリセット）。使わなければ転生しても持ち越せる
const SEEDS = {
  atk: { icon: '🌰', img: 'assets/img/icons/bag_seedAtk.webp', name: 'パワーの種', stat: '攻撃力', col: '#ff8a5c' },
  hp:  { icon: '🍎', img: 'assets/img/icons/bag_seedHp.webp', name: 'HPの種', stat: '最大HP', col: '#7ee787' },
};
const SEED_PER_USE = 0.05; // 1個につき +5%
const SEED_CHEST_CHANCE = {}; // ドーピングの種はなくした（宝箱からも出ない）
const SEED_CHEST_CHANCE_OLD = { common: 0.01, rare: 0.03, epic: 0.08, legendary: 0.12, mythic: 0.2 }; // 宝箱から種が出る確率：N1%・R3%・SR8%・SSR12%・UR20%
const SEED_CHEST_COUNT = { common: 1, rare: 1, epic: 1, legendary: 2, mythic: 3 };
function seedHeld(k) { return ((game.seeds || {})[k]) || 0; }
function seedUsed(k) { return ((game.seedUsed || {})[k]) || 0; }
function gainSeed(k, n = 1) { game.seeds = game.seeds || {}; game.seeds[k] = seedHeld(k) + n; updateSeedButton(); }
function randomSeedKey() { return Math.random() < 0.5 ? 'atk' : 'hp'; }
{ const orig = computeBonuses; computeBonuses = function () { const b = orig.apply(this, arguments); b.atkMult *= 1 + seedUsed('atk') * SEED_PER_USE; b.hpMult *= 1 + seedUsed('hp') * SEED_PER_USE; return b; }; }
function useSeed(k, n) {
  n = Math.min(n, seedHeld(k)); if (n <= 0) return;
  game.seeds[k] -= n; game.seedUsed = game.seedUsed || {}; game.seedUsed[k] = seedUsed(k) + n;
  if (typeof refreshPlayerBallStats === 'function') refreshPlayerBallStats(false);
  const S = SEEDS[k], pl = balls.find(isMainPlayerBall);
  if (pl) { spawnDamageText(pl.x, pl.y - pl.radius - 20, `${S.stat} +${n * SEED_PER_USE * 100 | 0}%！`, S.col, 0.012, true); for (let i = 0; i < 14; i++) spawnHitParticles(pl.x + gRand(-18, 18), pl.y + gRand(-18, 18), i % 2 ? S.col : '#fff6c0'); }
  seedUseFx(k, n);
  try { playTone(392, 0.09, 'square', 0.05, 523); setTimeout(() => playTone(523, 0.09, 'square', 0.05, 659), 80); setTimeout(() => playTone(659, 0.09, 'square', 0.05, 784), 160); setTimeout(() => playTone(784, 0.12, 'square', 0.05, 1047), 240);
    setTimeout(() => { playTone(1047, 0.35, 'triangle', 0.08, 2093); thump(110, 50, 0.3, 0.35); playCoinChime(9); }, 340); } catch (e) {}
  if (typeof shakeScreenLight === 'function') setTimeout(shakeScreenLight, 340);
  updateSeedButton(); updateStatsUI(); saveGame();
}
function seedUseFx(k, n) { // 種を使った演出：ダイアログの中央で種がはじけて、効果を大きく表示
  const S = SEEDS[k], host = document.querySelector('.seed-ov .seed-panel') || document.body;
  const el = document.createElement('div'); el.className = 'seed-use-fx' + (k === 'hp' ? ' hp' : '');
  el.innerHTML = `<div class="suf-rays"></div><img class="suf-ico" src="${S.img}" alt=""><div class="suf-txt">${S.stat} UP!</div><div class="suf-sub">${S.name}を${n}個使った　<b>+${Math.round(n * SEED_PER_USE * 100)}%</b>（合計 +${Math.round(seedUsed(k) * SEED_PER_USE * 100)}%）</div>`
    + Array.from({ length: 16 }, (_, i) => `<i class="suf-spark" style="--a:${i * 22.5}deg;--d:${70 + (i % 3) * 26}px;animation-delay:${280 + (i % 4) * 30}ms"></i>`).join('');
  host.appendChild(el);
  const row = document.querySelector(`.seed-ov [data-seed="${k}"]`); const card = row && row.closest('.sd2-row'); if (card) { card.classList.remove('seed-flash'); void card.offsetWidth; card.classList.add('seed-flash'); }
  setTimeout(() => el.remove(), 1500);
}
const seedBtn = document.getElementById('seedBtn');
function updateSeedButton() {
  const held = seedHeld('atk') + seedHeld('hp'), used = seedUsed('atk') + seedUsed('hp');
  seedBtn.style.display = 'none'; { const tb = document.getElementById('towerSeedBtn'); if (tb) tb.style.display = 'none'; } // ドーピングの種はなくした
  const html = `<img class="seed-btn-ico" src="assets/img/icons/bag_seedAtk.webp" alt=""><b>×${held}</b>`; if (seedBtn.dataset.html !== html) { seedBtn.innerHTML = html; seedBtn.dataset.html = html; }
  seedBtn.classList.toggle('is-disabled', !held);
  const t = document.getElementById('towerSeedBtn'); if (t) { t.style.display = held || used ? '' : 'none'; t.innerHTML = `<img class="seed-btn-ico" src="assets/img/icons/bag_seedAtk.webp" alt="">種でドーピング <small>所持 ${held}個${used ? `／使用中 ${used}個` : ''}</small>`; }
  const ov = document.querySelector('.seed-ov'); if (ov) renderSeedPanel(ov);
}
function renderSeedPanel(ov) { // 見本の絵（seed_panel.webp）の上に、数字とボタンを重ねる。並びは絵どおり HPの種 → パワーの種
  ['hp', 'atk'].forEach(k => {
    const row = ov.querySelector(`.sd2-row[data-k="${k}"]`); if (!row) return;
    const S = SEEDS[k], h = seedHeld(k), u = seedUsed(k), pct = Math.max(1, Math.floor(h * 0.1));
    row.querySelector('.sd2-stat').innerHTML = `所持 <b class="sd2-n">${h}</b> 個<br>いまの効果 <b class="sd2-eff ${k}">+${Math.round(u * SEED_PER_USE * 100)}%</b> ${u}個`;
    row.querySelector('.sd2-pctn').textContent = `${h ? pct : 0}個`;
    row.querySelectorAll('[data-seed]').forEach(b => { b.disabled = !h; b.classList.toggle('is-disabled', !h); });
  });
}
function openSeedPanel() {
  if (document.querySelector('.seed-ov')) return;
  const ov = document.createElement('div'); ov.className = 'cl-overlay show seed-ov';
  const row = (k, y) => `<div class="sd2-row" data-k="${k}" style="--y:${y}"><div class="sd2-stat"></div>`
    + `<button class="sd2-b b-all" data-seed="${k}" data-n="all" aria-label="全部使う"></button>`
    + `<button class="sd2-b b-pct" data-seed="${k}" data-n="pct" aria-label="10%使う"><span class="sd2-pctn"></span></button>`
    + `<button class="sd2-b b-one" data-seed="${k}" data-n="1" aria-label="1個使う"></button></div>`;
  ov.innerHTML = `<div class="cl-panel seed-panel sd2" role="dialog" aria-label="ドーピングの種">${row('hp', 0)}${row('atk', 1)}<button class="cl-close sd2-close" aria-label="閉じる"></button></div>`;
  document.body.appendChild(ov); renderSeedPanel(ov);
  ov.addEventListener('click', ev => {
    const b = ev.target.closest('[data-seed]'); if (b) { if (b.disabled) return; const k = b.dataset.seed, h = seedHeld(k); useSeed(k, b.dataset.n === 'all' ? h : b.dataset.n === 'pct' ? Math.max(1, Math.floor(h * 0.1)) : 1); return; }
    if (ev.target === ov || ev.target.closest('.cl-close')) ov.remove();
  });
}
seedBtn.addEventListener('click', openSeedPanel);
document.getElementById('towerSeedBtn').addEventListener('click', openSeedPanel);
updateSeedButton();
// 入手：タンスの引き出し・壺・宝箱
function seedDropText(k, n, x, y) { const S = SEEDS[k]; spawnDamageText(x, y, `${S.icon} ${S.name}${n > 1 ? ` ×${n}` : ''}を見つけた！`, S.col, 0.012, true); playCoinChime(11); }
{ const orig = openTansu; openTansu = function (o) {
  const before = gm.broke; orig.apply(this, arguments);
  // ドーピングの種はなくした
}; }
{ const orig = breakObstacleLoot; breakObstacleLoot = function (o) {
  orig.apply(this, arguments);
  // ドーピングの種はなくした
}; }
// 宝箱の種は、宝箱の中身の1つとして決まった確率で出る（battle.js の openTreasureChest）
// ★4（SSR）・★5（UR）の宝箱の中身の1つとして、仲間が出る。だれが出るかは招集ガチャと同じ重み（N30・R25・SR10・SSR2・UR1）。持っている仲間ならキャラ進化
const CHEST_COMP_CHANCE = { legendary: 0.05, mythic: 0.15 };
const CHEST_COMP_EXCLUDE = { legendary: ['common'], mythic: ['common', 'rare'] }; // ★4はNを出さない、★5はNとRを出さない
function rollChestCompanion(rarity) {
  const ex = CHEST_COMP_EXCLUDE[rarity] || [], pool = compPoolIds().filter(id => !ex.includes(COMPANIONS[id].rarity)); if (!pool.length) return null;
  let x = Math.random() * pool.reduce((t, id) => t + COMPANIONS[id].weight, 0);
  for (const id of pool) { if ((x -= COMPANIONS[id].weight) < 0) return id; }
  return pool[pool.length - 1];
}
function chestCompPool(rarity) { const ex = CHEST_COMP_EXCLUDE[rarity] || []; return compPoolIds().filter(id => !ex.includes(COMPANIONS[id].rarity)); }
let chestCompRenderT = 0;
function chestCompLoot(rarity) { // 宝箱の中身「仲間」：パーティには入れず、新しければ図鑑に登録、ダブりならキャラ進化
  const id = rollChestCompanion(rarity); if (!id) return null;
  const c = COMPANIONS[id], dup = !!(game.companionBook || {})[id], evo = dup ? compEvolve(id) : '';
  if (!dup) { if (!game.companionBook) game.companionBook = {}; game.companionBook[id] = true; }
  const t = dup ? `ダブり → キャラ進化！ ${evo}` : 'NEW！ 図鑑に登録';
  if (!chestCompRenderT) chestCompRenderT = setTimeout(() => { chestCompRenderT = 0; try { renderCompanionList(); } catch (e) {} }, 0); // まとめて開けても描き直しは1回
  return { misc: 'comp:' + id, n: 1, icon: companionIconHtml(id), main: `🐾 ${c.name}（${RARITY_INFO[c.rarity].label}）`, cardName: c.name, cardDesc: dup ? 'ダブり → キャラ進化' : 'NEW！ 図鑑に登録', color: RARITY_INFO[c.rarity].color, sub: t };
}
// ★3（SR）・★4（SSR）・★5（UR）の宝箱の中身の1つとして、自キャラが出て進化する（攻撃力かHPの初期Lv+1）
const CHEST_HERO_CHANCE = { epic: 0.03, legendary: 0.08, mythic: 0.15 };
function chestHeroLoot() { // 宝箱の中身「自キャラ」：攻撃力かHPの初期Lv+1
  const hid = getHeroChar(), name = hid ? COMPANIONS[hid].name : (game.username || '勇者'), t = heroEvolve();
  setTimeout(() => { try { renderMyCharCard(); } catch (e) {} }, 0);
  return { misc: 'hero', n: 1, icon: hid ? companionIconHtml(hid) : `<img class="comp-sprite" src="${PLAYER_SPRITE}" alt="">`, main: `🦸 自キャラ（${name}）`, cardName: `自キャラ（${name}）`, cardDesc: '進化して初期Lv+1', color: '#ffd76b', sub: `進化！ ${t}` };
}
// 転生で使った種の効果はリセット（持っている種はそのまま）
// 使ったドーピングの種は、転生のときに進化の羽で還元（1個につき羽 SEED_FEATHER_REFUND 枚。転生報酬の羽に上乗せ）
const SEED_FEATHER_REFUND = 1;
function seedRefundFeathers() { return (seedUsed('atk') + seedUsed('hp')) * SEED_FEATHER_REFUND; }
{ const orig = getRebirthFeatherGain; getRebirthFeatherGain = function () { return orig.apply(this, arguments) + seedRefundFeathers(); }; }
{ const orig = completeReincarnation; completeReincarnation = function () { const used = seedUsed('atk') + seedUsed('hp'), r = orig.apply(this, arguments); game.seedUsed = {}; updateSeedButton(); if (used) setTimeout(() => showNotice(`🌱 使った種 ${used}個 → 進化の羽 +${used * SEED_FEATHER_REFUND}枚に還元！`), 600); return r; }; }
{ const orig = rebornGoalsHtml; rebornGoalsHtml = function () { const h = orig.apply(this, arguments), used = seedUsed('atk') + seedUsed('hp'); if (!used) return h; return h.replace(/<\/div>$/, `<div class="rg-item"><img src="${SEEDS.atk.img}" alt=""><span>使った種 ${used}個 → 進化の羽 +${used * SEED_FEATHER_REFUND}枚に還元（転生報酬に込み）</span></div></div>`); }; }

// ===== ショップの「所持品」タブ：持っている消耗品・宝箱・種などを一覧（使えるものはここから使う） =====

// ===== 宝箱から出る使いきりアイテム（持ち越し可。Lv倍増券だけは1周回に1回まで） =====
const CHEST_ITEMS = {
  skillTicket: { icon: '🎫', name: 'スキルガチャ券', desc: 'スキルガチャを1回、コインなしで回せる（回数の上限にも数えない）', col: '#8ad0ff' },
  compTicket:  { icon: '📜', name: '招集ガチャ券', desc: '招集ガチャを1回、コインなしで回せる', col: '#ffc46b' },
  doll:        { icon: '🪆', name: '身代わり人形', desc: 'ボス戦・試練の塔で倒れたとき、1回だけHP50%で立ち直る（自動で使う）', col: '#ff9a9a' },
  lv15:        { icon: '🎟️', img: 'assets/img/icons/bag_ticket.webp', name: 'Lv1.5倍券', desc: 'パーティの仲間の攻撃力Lv・HPLvと、持っているスキルのLvを全部1.5倍（Lv倍増券は1周回に1回まで）', col: '#c28aff' },
  lv2:         { icon: '🎟️', img: 'assets/img/icons/bag_ticket.webp', name: 'Lv2倍券', desc: 'パーティの仲間の攻撃力Lv・HPLvと、持っているスキルのLvを全部2倍（Lv倍増券は1周回に1回まで）', col: '#ff8adf' },
  ret15:       { icon: '🏠', name: '帰還ボーナス1.5倍券', desc: '次の帰還ボーナスのコインが1.5倍（自動で使う）', col: '#7ee7c8' },
  midare:      { icon: '📜', name: 'みだれうちの巻物', desc: '使うと次のボスを倒すまで、自キャラの攻撃が4回攻撃になる', col: '#ff8a5c', buff: 'midare' },
  nitoryu:     { icon: '📜', name: 'にとうりゅうの巻物', desc: '使うと次のボスを倒すまで、自キャラの攻撃が2回攻撃になる', col: '#ffb35c', buff: 'nitoryu' },
  yamabiko:    { icon: '📜', name: 'やまびこの巻物', desc: '使うと次のボスを倒すまで、メテオなどの攻撃スキルがもう1回落ちる', col: '#8ad0ff', buff: 'yamabiko' },
  ageage:      { icon: '💃', name: 'アゲアゲダンス', desc: '使うと次のボスを倒すまで、仲間の攻撃が2回攻撃になる', col: '#ff8adf', buff: 'ageage' },
  lifeglass:   { icon: '⏳', img: 'assets/img/icons/item_lifeglass.webp', name: '命の砂時計', desc: 'ボス戦で使うと、ボス戦の残り時間が最初に戻る（同じボスには1回だけ。コンテニューするとまた使える。ゲーム画面のスキル列から使う）', col: '#ffd76b' },
  ret2:        { icon: '🏠', name: '帰還ボーナス2倍券', desc: '次の帰還ボーナスのコインが2倍（自動で使う。1.5倍券より先に使う）', col: '#5fe0ff' },
};
// 宝箱のレア度ごとに、どのアイテムがどれくらいの確率で出るか（コイン・羽などと同じ「どれか1つ」の中身）
const CHEST_ITEM_DROP = {
  rare: [['skillTicket', 0.05], ['compTicket', 0.05]],
  epic: [['doll', 0.03], ['lifeglass', 0.03]],
  legendary: [['doll', 0.03], ['lv15', 0.02], ['ret15', 0.05], ['lifeglass', 0.03]],
  mythic: [['doll', 0.03], ['lv15', 0.01], ['lv2', 0.01], ['ret2', 0.05], ['midare', 0.01], ['nitoryu', 0.02], ['yamabiko', 0.02], ['ageage', 0.02]],
};
const MANEKI_MS = 5 * 60 * 1000;
function itemHeld(k) { return ((game.items || {})[k]) || 0; }
function gainItem(k, n = 1) { game.items = game.items || {}; game.items[k] = itemHeld(k) + n; updateItemTicketBtns(); }
function spendItem(k) { if (!itemHeld(k)) return false; game.items[k]--; updateItemTicketBtns(); return true; }
{ const orig = computeBonuses; computeBonuses = function () { const b = orig.apply(this, arguments); if (b && Date.now() < (game.manekiUntil || 0)) b.coinMult *= 2; return b; }; } // 招き猫の間はコイン2倍
function useManeki(ev) {
  if (!spendItem('maneki')) return;
  game.manekiUntil = Math.max(Date.now(), game.manekiUntil || 0) + MANEKI_MS; playRegisterSound(); saveGame();
  showNotice(`🐱 金の招き猫！ ${Math.round((game.manekiUntil - Date.now()) / 60000)}分間 コイン2倍`); renderBagList();
}
// ===== 次のボスを倒すまで効く巻物・ダンス（みだれうち×4・にとうりゅう×2・やまびこ・アゲアゲダンス） =====
function bossBuffOn(k) { return !!(game.bossBuffs || {})[k]; }
function useBossBuff(k) {
  const I = CHEST_ITEMS[k]; if (bossBuffOn(I.buff)) { showNotice(`${I.icon} ${I.name}はもう効いています（次のボスを倒すまで）`, true, 2200); return; }
  if (!spendItem(k)) return;
  game.bossBuffs = game.bossBuffs || {}; game.bossBuffs[I.buff] = true; playRegisterSound(); saveGame(); renderBagList();
  showNotice(`${I.icon} ${I.name}！ 次のボスを倒すまで効く`);
}
function bossBuffExtraHits(e, dmg, who) { // 当たった攻撃を、決まった回数まで追加で当てる（ダメージはすぐ、数字は少しずつ出す）
  const n = who === 'comp' ? (bossBuffOn('ageage') ? 2 : 1) : (bossBuffOn('midare') ? 4 : bossBuffOn('nitoryu') ? 2 : 1);
  if (n < 2 || !e || !(dmg > 0)) return;
  for (let i = 1; i < n; i++) {
    e.hp -= dmg; trackDamage(dmg);
    setTimeout(() => { if ([...balls, ...adds].includes(e)) spawnAttackDamageText(e, dmg, false, who === 'comp' ? '#ffb8ec' : '#ffd0a0', -14 * i); }, i * 90);
  }
}
{ const orig = markBossBeaten; markBossBeaten = function () { if (game.bossBuffs && Object.keys(game.bossBuffs).length) { game.bossBuffs = {}; setTimeout(() => showNotice('📜 巻物・ダンスの効果が切れた'), 900); } return orig.apply(this, arguments); }; }
// やまびこ：攻撃スキルを使ったら、少しあとにもう1回同じスキルが発動する（待ち時間は増やさない）
const ECHO_SKILL_BTNS = { specialBtn: () => lastSpecialAt, poisonBtn: () => lastPoisonAt, paralyzeBtn: () => lastParalyzeAt, novaBtn: () => lastNovaAt, blastBtn: () => lastBlastAt };
const ECHO_SKILL_SET = { specialBtn: v => { lastSpecialAt = v; }, poisonBtn: v => { lastPoisonAt = v; }, paralyzeBtn: v => { lastParalyzeAt = v; }, novaBtn: v => { lastNovaAt = v; }, blastBtn: v => { lastBlastAt = v; } };
let echoing = false;
Object.keys(ECHO_SKILL_BTNS).forEach(id => { const btn = document.getElementById(id); if (!btn) return;
  let before = 0;
  btn.addEventListener('click', () => { try { before = ECHO_SKILL_BTNS[id](); } catch (e) { before = 0; } }, true);
  btn.addEventListener('click', () => {
    if (echoing || !bossBuffOn('yamabiko')) return;
    let now; try { now = ECHO_SKILL_BTNS[id](); } catch (e) { return; }
    if (now === before) return; // 発動しなかった
    setTimeout(() => { if (phase !== 'battle') return; echoing = true; ECHO_SKILL_SET[id](0); try { btn.click(); spawnDamageText(arena.x, arena.y - arena.radius * 0.3, '📜 やまびこ！', '#8ad0ff', 0.014, true); } finally { ECHO_SKILL_SET[id](now); echoing = false; } }, 700);
  });
});
// 命の砂時計：ボス戦で使うと、残り時間が最初に戻る（同じボスには1回だけ。コンテニュー・リトライでまた使える）
function lifeGlassBoss() { return balls.find(b => !b.isPlayer && b.isBoss && !b.isDying && b.hp > 0); }
function useLifeGlass(ev) {
  const p = balls.find(isMainPlayerBall), boss = lifeGlassBoss();
  if (phase === 'battle' && !boss && typeof bossWarning !== 'undefined' && bossWarning.classList.contains('show')) { showTapError('ボスが現れたら使えます', ev.clientX, ev.clientY); return; }
  if (phase !== 'battle' || !p || !boss) { showTapError('命の砂時計はボス戦でだけ使えます', ev.clientX, ev.clientY); return; }
  if (boss.glassUsed) { showTapError('このボスにはもう使えない（コンテニューするとまた使える）', ev.clientX, ev.clientY); return; }
  if (!spendItem('lifeglass')) return;
  boss.glassUsed = true; bossTimeLeftMs = bossTimeLimitMs(); bossTimerLastAt = Date.now();
  spawnDamageText(arena.x, arena.y - 40, `⏳ 命の砂時計！ 残り時間が ${Math.round(bossTimeLeftMs / 1000)}秒 に戻った`, '#ffd76b', 0.012, true);
  playLifeGlassSound(); if (typeof songState !== 'undefined' && songState) songState.tempo = 1; // 早回しになっていたBGMもすぐ元の速さに
  saveGame(); updateLifeGlassBtn();
}
function playLifeGlassSound() { // 時計の「チク・タク・チク・タク」（最後のボーンはなし）
  const tick = (hi, at) => setTimeout(() => { playTone(hi ? 2400 : 1700, 0.03, 'square', 0.09); thump(hi ? 900 : 650, hi ? 500 : 380, 0.05, 0.35, 'triangle'); if (typeof playNoiseBurst === 'function') playNoiseBurst(0.02, 0.12); }, at);
  for (let i = 0; i < 6; i++) tick(i % 2 === 0, i * 280); // チク・タク ×3
}
function updateLifeGlassBtn() {
  const row = document.getElementById('skillRow'); if (!row) return;
  let b = document.getElementById('lifeGlassBtn');
  const bb = lifeGlassBoss(), warn = typeof bossWarning !== 'undefined' && bossWarning.classList.contains('show'), show = itemHeld('lifeglass') > 0 && phase === 'battle' && (warn || (!!bb && !bb.glassUsed)); // WARNING中から出しておく
  if (!b) { b = document.createElement('button'); b.id = 'lifeGlassBtn'; b.className = 'action-btn lifeglass'; b.addEventListener('click', useLifeGlass); row.appendChild(b); }
  b.style.display = show ? '' : 'none';
  const h = `<img class="lg-ico" src="assets/img/icons/item_lifeglass.webp" alt=""><b>${itemHeld('lifeglass')}</b><span class="lg-name">命の砂時計</span>`; if (b.dataset.h !== h) { b.innerHTML = h; b.dataset.h = h; }
}
setInterval(updateLifeGlassBtn, 500);
function useLvTicket(k) {
  const m = k === 'lv2' ? 2 : 1.5;
  if (game.lvTicketUsed) { showNotice('⏫ Lv倍増券は1周回に1回までです（転生でまた使える）', true, 2500); return; }
  simpleChoice({ icon: '⏫', title: CHEST_ITEMS[k].name, text: `パーティの仲間の攻撃力Lv・HPLvと、持っているスキル・自動スキルのLvを全部 <b>${m}倍</b> にしますか？`, sub: '<b style="color:#ff8a8a">⚠ Lv倍増券（1.5倍券・2倍券）は1周回に1回だけ使えます</b>', yes: `${m}倍にする`, no: 'やめる', onYes: () => {
    if (game.lvTicketUsed || !spendItem(k)) return;
    const up = lv => Math.max(lv + 1, Math.round(lv * m));
    for (const id of Object.keys(COMPANIONS)) if (getCompanionCount(id) > 0) for (const kind of ['atk', 'hp']) setCompUpLv(id, kind, up(compUpLv(id, kind) + 1) - 1);
    for (const id in SKILL_GACHA_SKILLS) if (game.shopOwned[id]) game.skillLevels[id] = Math.min(SKILL_MAX_LEVEL, up(getSkillLevel(id)));
    for (const w in (game.weapons || {})) if (game.weapons[w] > 0) game.weapons[w] = Math.min(WEAPON_MAX_LV, up(game.weapons[w]));
    game.lvTicketUsed = true; playRegisterSound();
    try { refreshCompanionBalls(); renderCompanionList(); renderCoinShopList(); updateStatsUI(); } catch (e) {}
    saveGame(); renderBagList(); showNotice(`⏫ 仲間とスキルのLvが${m}倍になった！`);
  } });
}
function useSkillTicket(ev) {
  if (!itemHeld('skillTicket')) return;
  if (typeof skGachaBusy !== 'undefined' && skGachaBusy) return;
  const sp = skillGachaPool().length, wp = weaponGachaPool().length;
  if (!sp && !wp) { showTapError('引けるスキルがありません', ev.clientX, ev.clientY); return; }
  spendItem('skillTicket'); saveGame();
  if (Math.random() * (sp + wp) < sp) skillGachaPull(ev, true); else weaponGachaPull(ev, true); // コインも回数もかからない
}
function useCompTicket(ev) {
  if (!itemHeld('compTicket') || compSummoning) return;
  spendItem('compTicket'); saveGame();
  runCompanionGacha(1, 0, ev, true); // コインなしで1回
}
// ガチャボタンの下に、券を持っていれば「券で回す」ボタン
function updateItemTicketBtns() {
  for (const [btnId, k, fn] of [['skillGachaBtn', 'skillTicket', useSkillTicket], ['compGachaBtn', 'compTicket', useCompTicket]]) {
    const btn = document.getElementById(btnId); if (!btn) continue;
    let t = document.getElementById(btnId + 'Ticket');
    if (!itemHeld(k)) { if (t) t.remove(); continue; }
    if (!t) { t = document.createElement('button'); t.id = btnId + 'Ticket'; t.className = 'ticket-pull-btn'; t.addEventListener('click', ev => fn(ev)); (btn.closest('.gacha-pair, .gacha-actions') || btn).insertAdjacentElement('afterend', t); } // ガチャの絵の行の下に置く（横に並べると絵が縮む）
    const h = `${CHEST_ITEMS[k].icon} ${CHEST_ITEMS[k].name}で回す（${itemHeld(k)}枚）`; if (t.textContent !== h) t.textContent = h;
  }
}
setInterval(updateItemTicketBtns, 1000);
// 身代わり人形：ボス戦・試練の塔で倒れたら自動で使って立ち直る
{ const orig = onPlayerDeath; onPlayerDeath = function (forceRebirth = false) {
  if (!forceRebirth && !filmMode && (game.skipChallenge || isBossFight()) && spendItem('doll')) {
    const p = balls.find(isMainPlayerBall); if (p) { p.hp = Math.round(p.maxHp * 0.5); p.safeHp = p.hp; spawnDamageText(p.x, p.y - p.radius - 16, '🪆 身代わり人形！', '#ff9a9a', 0.012, true); }
    updateHPUI(); saveGame(); showNotice(`🪆 身代わり人形が身代わりになった！（残り${itemHeld('doll')}個）`); return;
  }
  return orig.apply(this, arguments);
}; }
function bagRows() {
  const rows = [], hc = getHeldChests();
  rows.push({ icon: '🧪', name: '回復ポーション', n: game.potions || 0, desc: 'HPを最大値の45%回復（ボス戦で、ゲーム画面左上のボタンから使用）' });
  rows.push({ icon: '<i class="ico-redpot"></i>', name: 'スキルポーション', n: game.redPotions || 0, desc: 'すべてのスキルの待ち時間をリセット（ゲーム画面のスキル列の左端から使用）' });
  if (false) for (const [k, S] of Object.entries(SEEDS)) rows.push({ icon: `<img class="ico-img" src="${S.img}" alt="">`, name: S.name, n: seedHeld(k), desc: `1個で${S.stat} +${SEED_PER_USE * 100}%（転生まで）。使わなければ転生後も持ち越し${seedUsed(k) ? `／いま ${seedUsed(k)}個 使用中` : ''}`, btn: seedHeld(k) ? `<button data-bag-seed="1">使う</button>` : '' });
  for (const r of CHEST_RARITIES) { const n = (hc[r] || 0) + rebirthChestCount(r); if (!n) continue; const info = RARITY_INFO[r];
    rows.push({ icon: xi(CHEST_ICON[r]) || '🎁', name: `<span style="color:${info.color}">${rarityStars(r)}</span> ${info.label}の宝箱`, n, desc: 'コインや遺物が入っている', btn: `<button data-bag-chest="${r}">開ける</button>` }); }
  for (const r of FEA_RARITIES) { const n = feaCount(r); // 進化の羽はレア度ごと（0枚でも5種とも表示）
    rows.push({ fea: true, icon: feaIco(r), name: `<span style="color:${RARITY_INFO[r].color}">${rarityStars(r)}</span> 進化の${feaName(r)}`, n, desc: `進化1回で1枚使い、倍率×${FEA_MULT[r]}（レア度の高い羽から自動で使う）`, btn: `<button data-bag-go="gacha">進化へ</button>` }); }
  // ショップで買った（ずっと効く）品：進化項目・宝箱の予感・羽の束ね紐・流星剣など
  for (const [id, item] of Object.entries(SHOP_ITEMS)) {
    if (item.hideInShop || item.consumableKey || item.rebirth || item.action || item.slot || item.toggleFixed) continue;
    const n = item.toggleKind ? (isEvoKindOpen(item.toggleKind) ? 1 : 0) : SHOP_MULTI_ITEMS[id] ? shopBuyCount(id) : item.stackKey ? (game[item.stackKey] || 0) : item.unlockKey ? (game[item.unlockKey] ? 1 : 0) : (game.shopOwned && game.shopOwned[id] ? 1 : 0);
    if (!n) continue;
    const art = SHOP_ITEM_ART[id];
    rows.push({ icon: art ? `<span class="sr-ico su-i_${art}" style="display:inline-block;width:100%;height:100%"></span>` : ico(item), name: item.name + (SHOP_MULTI_ITEMS[id] ? ` Lv${n}` : item.toggleKind ? '（ON）' : ''), n, desc: SHOP_MULTI_ITEMS[id] ? `${SHOP_MULTI_ITEMS[id]} ${shopMultiRate(id)}倍` : item.desc, shop: true });
  }
  for (const [k, I] of Object.entries(CHEST_ITEMS)) { const n = itemHeld(k); if (!n) continue;
    const btn = CHEST_ITEMS[k].buff ? (bossBuffOn(CHEST_ITEMS[k].buff) ? '<button class="is-disabled" disabled>効いている</button>' : `<button data-bag-item="${k}">使う</button>`) : k === 'lifeglass' ? '' : k === 'maneki' ? '<button data-bag-item="maneki">使う</button>' : (k === 'lv15' || k === 'lv2') ? (game.lvTicketUsed ? '<button class="is-disabled" disabled>転生まで使えない</button>' : `<button data-bag-item="${k}">使う</button>`) : k === 'skillTicket' ? '<button data-bag-item="goSkill">使う</button>' : k === 'compTicket' ? '<button data-bag-item="goChara">使う</button>' : '';
    rows.push({ icon: I.img ? `<img class="ico-img" src="${I.img}" alt="">` : `<span class="bag-emoji">${I.icon}</span>`, name: I.name, n, desc: I.desc + (k === 'maneki' && Date.now() < (game.manekiUntil || 0) ? `（いま効いている：あと${Math.ceil((game.manekiUntil - Date.now()) / 60000)}分）` : ''), btn }); }
  if (game.hireTickets) rows.push({ icon: '<img class="ico-img" src="assets/img/icons/bag_ticket.webp" alt="">', name: 'ピックアップ採用券', n: game.hireTickets, desc: '★4・★5の仲間を1人、条件なしで採用できる（仲間タブで使用）', btn: `<button data-bag-go="chara">仲間タブへ</button>` });
  return rows;
}
function renderBagList() {
  const el = document.getElementById('bagList'); if (!el) return;
  const rows = bagRows().filter(r => r.n > 0 || r.fea); // 0個のものは出さない（進化の羽は0枚でも出す）
  el.innerHTML = (rows.length ? '' : '<div class="bag-empty-msg">所持品はありません</div>') + rows.map(r => `<div class="bag-row ${r.n ? '' : 'empty'}"><span class="bag-ico">${r.icon}</span><div class="bag-info"><b>${r.name}</b><span>${r.desc}</span></div><div class="bag-side"><span class="bag-n">×${formatCoinNumber(r.n)}</span>${r.btn || ''}</div></div>`).join('');
}
{ const orig = showShopTab; showShopTab = function (key) { orig.apply(this, arguments); if (key === 'bag') renderBagList(); }; }
document.getElementById('bagList').addEventListener('click', ev => {
  const b = ev.target.closest('button'); if (!b) return;
  if (b.dataset.bagSeed) { openSeedPanel(); return; }
  if (b.dataset.bagChest) { switchTab('game'); setTimeout(() => { if (phase === 'battle') openChestBatchDialog(b.dataset.bagChest); else showNotice('戦闘中に開けられます'); }, 200); return; }
  if (b.dataset.bagItem === 'maneki') { useManeki(ev); return; }
  if (b.dataset.bagItem && CHEST_ITEMS[b.dataset.bagItem] && CHEST_ITEMS[b.dataset.bagItem].buff) { useBossBuff(b.dataset.bagItem); return; }
  if (b.dataset.bagItem === 'lv15' || b.dataset.bagItem === 'lv2') { useLvTicket(b.dataset.bagItem); return; }
  if (b.dataset.bagItem === 'goSkill') { switchTab('coinshop'); return; } // スキルガチャの下の「券で回す」で使う
  if (b.dataset.bagItem === 'goChara') { switchTab('companion'); return; }
  if (b.dataset.bagGo === 'gacha') switchTab('gacha');
  if (b.dataset.bagGo === 'chara') switchTab('companion'); // ショップの仲間タブは削除したので仲間ページへ
});
{ const orig = updateSeedButton; updateSeedButton = function () { orig.apply(this, arguments); const sec = document.querySelector('[data-shop-sec="bag"]'); if (sec && !sec.hidden) renderBagList(); }; }
if (document.querySelector('[data-shop-sec="bag"]') && !document.querySelector('[data-shop-sec="bag"]').hidden) renderBagList();

// ===== 王城の決戦：赤じゅうたん・石の柱・王家の旗・たいまつ、落ちてくるシャンデリア =====
function drawCastleHall(A, now) {
  const cx = (A.l + A.r) / 2, w = A.w * 0.34;
  // 中央の赤じゅうたん（金の縁取り）
  const g = ctx.createLinearGradient(cx - w / 2, 0, cx + w / 2, 0); g.addColorStop(0, '#7a0c14'); g.addColorStop(0.5, '#b0182a'); g.addColorStop(1, '#7a0c14');
  ctx.globalAlpha = 0.78; ctx.fillStyle = g; ctx.fillRect(cx - w / 2, A.t - 10, w, A.h + 20);
  ctx.globalAlpha = 0.9; ctx.fillStyle = '#e0b048'; ctx.fillRect(cx - w / 2, A.t - 10, 4, A.h + 20); ctx.fillRect(cx + w / 2 - 4, A.t - 10, 4, A.h + 20);
  ctx.fillStyle = 'rgba(224,176,72,0.55)'; for (let y = A.t + 20; y < A.b; y += 46) { ctx.beginPath(); ctx.moveTo(cx, y - 8); ctx.lineTo(cx + 8, y); ctx.lineTo(cx, y + 8); ctx.lineTo(cx - 8, y); ctx.closePath(); ctx.fill(); }
  ctx.globalAlpha = 1;
  // 左右の石の柱と旗・たいまつ
  const rows = 3;
  for (let i = 0; i < rows; i++) {
    const y = A.t + A.h * (i + 0.5) / rows;
    for (const side of [-1, 1]) {
      const x = side < 0 ? A.l + 22 : A.r - 22, pw = 26, ph = A.h / rows * 0.8;
      const pg = ctx.createLinearGradient(x - pw / 2, 0, x + pw / 2, 0); pg.addColorStop(0, '#5d5a66'); pg.addColorStop(0.45, '#b9b5c2'); pg.addColorStop(1, '#4a4754');
      ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(x - pw / 2 + 5, y - ph / 2 + 6, pw, ph);
      ctx.fillStyle = pg; ctx.fillRect(x - pw / 2, y - ph / 2, pw, ph);
      ctx.fillStyle = '#8c8896'; ctx.fillRect(x - pw / 2 - 4, y - ph / 2 - 6, pw + 8, 8); ctx.fillRect(x - pw / 2 - 4, y + ph / 2 - 2, pw + 8, 8);
      // 旗（柱の内側に下がる）
      const bx = x + side * -26, by = y - ph / 2 + 4, bw = 18, bh = ph * 0.55, sway = Math.sin(now / 700 + i + side) * 2;
      ctx.fillStyle = '#1d3f9a'; ctx.beginPath(); ctx.moveTo(bx - bw / 2, by); ctx.lineTo(bx + bw / 2, by); ctx.lineTo(bx + bw / 2 + sway, by + bh); ctx.lineTo(bx + sway, by + bh - 7); ctx.lineTo(bx - bw / 2 + sway, by + bh); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#e8c45a'; ctx.fillRect(bx - bw / 2, by, bw, 3); ctx.beginPath(); ctx.arc(bx + sway / 2, by + bh * 0.42, 4, 0, Math.PI * 2); ctx.fill();
      // たいまつの灯り（ゆらめく）
      const fl = 0.75 + 0.25 * Math.sin(now / 90 + i * 2 + side * 3), tx = x, ty = y - ph / 2 + ph * 0.6;
      const lg = ctx.createRadialGradient(tx, ty, 0, tx, ty, 46 * fl); lg.addColorStop(0, 'rgba(255,190,90,0.38)'); lg.addColorStop(1, 'rgba(255,140,40,0)');
      ctx.fillStyle = lg; ctx.beginPath(); ctx.arc(tx, ty, 46 * fl, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffd36a'; ctx.beginPath(); ctx.ellipse(tx, ty - 4, 4 * fl, 7 * fl, 0, 0, Math.PI * 2); ctx.fill();
    }
  }
}
function drawChandelier(x, y, a) {
  if (typeof stageArt === 'function' && stageArt('chandelier')) { ctx.save(); ctx.globalAlpha = a; drawStageSprite('chandelier', x, y - 10, 84); ctx.restore(); return; } // 王城の絵のシャンデリア
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y);
  ctx.strokeStyle = '#7a5a1a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, -60); ctx.lineTo(0, -10); ctx.stroke();
  ctx.fillStyle = '#d9a93f'; ctx.strokeStyle = '#6a4a10'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(0, 0, 22, 7, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  for (const dx of [-18, -6, 6, 18]) { ctx.fillStyle = '#f4ead0'; ctx.fillRect(dx - 2, -12, 4, 9); ctx.fillStyle = '#ffcf5a'; ctx.beginPath(); ctx.ellipse(dx, -15, 2.5, 4, 0, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = '#9fd8ff'; for (const dx of [-14, 0, 14]) { ctx.beginPath(); ctx.moveTo(dx, 5); ctx.lineTo(dx + 3, 11); ctx.lineTo(dx, 17); ctx.lineTo(dx - 3, 11); ctx.closePath(); ctx.fill(); }
  ctx.restore();
}
{ const orig = getFloorKey; getFloorKey = function (stage) { return typeof gimmickForStage === 'function' && gimmickForStage(stage) === 'castle' ? 'redCarpet' : orig.apply(this, arguments); }; } // 王城は赤じゅうたんの床
{ const orig = drawArenaFloor; drawArenaFloor = function () { const r = orig.apply(this, arguments); try { if (curGimmick() === 'castle' && !(typeof stageArt === 'function' && stageArt('bg_castle'))) { ctx.save(); arenaPath(); ctx.clip(); drawCastleHall(gArea(), Date.now()); ctx.restore(); } } catch (e) {} return r; }; } // 王の間の飾りは床と一緒に（キャラの下に）描く

// ===== 村・町・遺跡・墓地・祠・教会のステージ（床の上に建物などを描き、それぞれの小さな遊びを足す） =====
const GIMMICK_FLOORS = { village: 'st_village', town: 'st_town', ruins: 'st_ruins', graveyard: 'st_graveyard', church: 'st_church' };
const STAGE_ART = {}; // 背景の一枚絵と小物の絵（読み込めるまでは床タイル＋プログラムで描いた飾りで代用）
['village', 'town', 'ruins', 'graveyard', 'church', 'castle'].forEach(k => { const im = new Image(); im.src = `assets/img/stages/bg_${k}.webp`; STAGE_ART['bg_' + k] = im; });
['chicken', 'chicken2', 'coins', 'purse', 'pillar', 'wisp', 'wisp2', 'holy', 'chandelier'].forEach(k => { const im = new Image(); im.src = `assets/img/stages/${k}.webp`; STAGE_ART[k] = im; });
function stageArt(k) { const im = STAGE_ART[k]; return im && im.complete && im.naturalWidth ? im : null; }
function drawStageSprite(k, x, y, h, flip = false) { const im = stageArt(k); if (!im) return false; const w = h * im.naturalWidth / im.naturalHeight; ctx.save(); ctx.translate(x, y); if (flip) ctx.scale(-1, 1); ctx.drawImage(im, -w / 2, -h / 2, w, h); ctx.restore(); return true; }
{ const orig = getFloorKey; getFloorKey = function (stage) { const k = typeof gimmickForStage === 'function' && gimmickForStage(stage); return GIMMICK_FLOORS[k] || orig.apply(this, arguments); }; }
function gWanderer(A, kind) { const a = Math.random() * Math.PI * 2; return { kind, alt: Math.random() < 0.4, x: gRand(A.l + 30, A.r - 30), y: gRand(A.t + 40, A.b - 40), vx: Math.cos(a), vy: Math.sin(a), ph: Math.random() * 6, turnAt: 0 }; }
{ const orig = setupGimmick; setupGimmick = function (key) {
  const before = gm.id; orig.apply(this, arguments); if (gm.id === before || !gm.key) return;
  const A = gArea();
  if (gm.key === 'village') for (let i = 0; i < 4; i++) gm.items.push(gWanderer(A, 'chicken'));
  if (gm.key === 'graveyard') for (let i = 0; i < 5; i++) gm.items.push(gWanderer(A, 'wisp'));
}; }
{ const orig = tickGimmick; tickGimmick = function (sp) {
  const due = gm.key && gm.t + sp >= gm.nextAt; // 元の処理が次の出現時刻を決める前に覚えておく
  orig.apply(this, arguments);
  const key = gm.key; if (!key || !GIMMICK_FLOORS[key]) return;
  const A = gArea(), pls = gimmickPlayerBalls(), foes = gimmickEnemies();
  const touch = (o, r) => pls.find(b => Math.hypot(b.x - o.x, b.y - o.y) < (b.radius || 12) + r);
  if (due) {
    if (key === 'village') { gm.nextAt = gm.t + gRand(160, 240); if (gm.items.filter(i => i.kind === 'chicken').length < 4) gm.items.push(gWanderer(A, 'chicken')); }
    else if (key === 'graveyard') { gm.nextAt = gm.t + 110; if (gm.items.filter(i => i.kind === 'wisp').length < 5) gm.items.push(gWanderer(A, 'wisp')); }
    else if (key === 'town') { gm.nextAt = gm.t + gRand(150, 230); gm.items.push({ kind: 'purse', x: gRand(A.l + 30, A.r - 30), y: gRand(A.t + 50, A.b - 40), life: 1 }); }
    else if (key === 'ruins') { gm.nextAt = gm.t + gRand(150, 220); if (foes.length) { const e = foes[Math.floor(Math.random() * foes.length)]; gm.fx.push({ kind: 'rockfall', pillar: true, target: e, x: e.x, y: e.y, t: 0 }); } }
    else if (key === 'church') { gm.nextAt = gm.t + gRand(160, 230); if (foes.length) { const e = foes[Math.floor(Math.random() * foes.length)]; gm.fx.push({ kind: 'holyWarn', target: e, x: e.x, y: e.y, t: 0 }); } }
  }
  for (const it of gm.items) {
    if (it.dead) continue;
    if (it.kind === 'chicken' || it.kind === 'wisp') {
      const near = it.kind === 'chicken' && pls.find(b => Math.hypot(b.x - it.x, b.y - it.y) < 70); // ニワトリは近づくと逃げる
      if (near) { const d = Math.hypot(it.x - near.x, it.y - near.y) || 1; it.vx = (it.x - near.x) / d; it.vy = (it.y - near.y) / d; }
      else if (gm.t > it.turnAt) { it.turnAt = gm.t + gRand(60, 150); const a = Math.random() * Math.PI * 2; it.vx = Math.cos(a); it.vy = Math.sin(a); }
      const v = it.kind === 'wisp' ? 0.45 : near ? 1.6 : 0.6; it.ph += 0.08 * sp;
      it.x += it.vx * v * sp; it.y += (it.vy * v + (it.kind === 'wisp' ? Math.sin(it.ph) * 0.4 : 0)) * sp;
      if (it.x < A.l + 14 || it.x > A.r - 14) it.vx *= -1; if (it.y < A.t + 20 || it.y > A.b - 14) it.vy *= -1;
      it.x = Math.max(A.l + 14, Math.min(A.r - 14, it.x)); it.y = Math.max(A.t + 20, Math.min(A.b - 14, it.y));
      if (touch(it, 10)) popGimmickItem(it);
    } else if (it.kind === 'purse') { it.life -= 0.0022 * sp; it.ph = (it.ph || 0) + 0.06 * sp; if (it.life <= 0) it.dead = true; else if (touch(it, 11)) popGimmickItem(it); }
  }
  gm.items = gm.items.filter(i => !i.dead);
  for (const f of gm.fx) {
    if (f.kind === 'holyWarn') { f.t += sp; if (f.target && !f.target.isDying && f.target.hp > 0) { f.x = f.target.x; f.y = f.target.y; } if (f.t >= 50) { f.dead = true; holyStrike(f); } }
    else if (f.kind === 'holyBeam') { f.life -= 0.045 * sp; if (f.life <= 0) f.dead = true; }
  }
  gm.fx = gm.fx.filter(f => !f.dead);
}; }
function holyStrike(f) { // 教会：聖なる光の柱が敵を打つ
  gm.fx.push({ kind: 'holyBeam', x: f.x, y: f.y, life: 1 });
  playTone(880, 0.3, 'triangle', 0.05, 1760); setTimeout(() => playTone(1320, 0.35, 'sine', 0.04, 1980), 80);
  for (let i = 0; i < 6; i++) spawnHitParticles(f.x + gRand(-14, 14), f.y + gRand(-14, 14), '#fff2b0');
  for (const e of gimmickEnemies()) {
    if (Math.hypot(e.x - f.x, e.y - f.y) > 36 + (e.radius || 0)) continue;
    const dmg = Math.max(1, Math.round(e.maxHp * (e.isBoss ? 0.05 : 0.25)));
    e.hp -= dmg; trackDamage(dmg); spawnAttackDamageText(e, dmg, false, '#fff2b0'); onPlayerHitEnemy(e, dmg);
  }
}
{ const orig = popGimmickItem; popGimmickItem = function (it) {
  if (it.kind === 'chicken') { it.dead = true; playTone(900, 0.06, 'square', 0.04, 1400); setTimeout(() => playTone(1100, 0.05, 'square', 0.035, 700), 70); for (let i = 0; i < 4; i++) spawnHitParticles(it.x, it.y, '#ffffff'); gimmickGiveCoins(it.x, it.y, 0.3, '🐔'); return; }
  if (it.kind === 'wisp') { it.dead = true; playTone(700, 0.2, 'sine', 0.04, 1400); spawnHitParticles(it.x, it.y, '#8fd8ff'); gimmickGiveCoins(it.x, it.y, 0.25, '👻'); return; }
  if (it.kind === 'purse') { it.dead = true; playCoinChime(3); setTimeout(() => playCoinChime(6), 90); gimmickGiveCoins(it.x, it.y, 0.6, '👛'); return; }
  return orig.apply(this, arguments);
}; }
{ const orig = drawGimmickItem; drawGimmickItem = function (it, now) {
  if (it.kind === 'chicken' && stageArt('chicken')) { const hop = Math.abs(Math.sin(it.ph * 2)) * 3; ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.beginPath(); ctx.ellipse(it.x, it.y + 10, 10, 3, 0, 0, Math.PI * 2); ctx.fill(); drawStageSprite(it.alt ? 'chicken2' : 'chicken', it.x, it.y - hop, 26, it.vx > 0); return; }
  if (it.kind === 'wisp' && stageArt('wisp')) { const a = 0.75 + 0.25 * Math.sin(it.ph * 2); ctx.save(); ctx.globalAlpha = a; ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(gGlow(it.alt ? 270 : 210, 65), it.x - 18, it.y - 18, 36, 36); ctx.restore(); ctx.save(); ctx.globalAlpha = a; drawStageSprite(it.alt ? 'wisp2' : 'wisp', it.x, it.y - 4, 30); ctx.restore(); return; }
  if (it.kind === 'purse' && stageArt('purse')) { ctx.globalAlpha = Math.min(1, it.life * 4); ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.beginPath(); ctx.ellipse(it.x, it.y + 10, 11, 3, 0, 0, Math.PI * 2); ctx.fill(); drawStageSprite('purse', it.x, it.y + Math.sin(now / 200 + it.x) * 1.5, 24); drawStageSprite('coins', it.x + 10, it.y + 6, 12); ctx.globalAlpha = 1; return; }
  if (it.kind === 'chicken') {
    const hop = Math.abs(Math.sin(it.ph * 2)) * 3, x = it.x, y = it.y - hop, f = it.vx < 0 ? -1 : 1;
    ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.beginPath(); ctx.ellipse(x, it.y + 8, 9, 3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#e8a33a'; ctx.fillRect(x - 3, y + 4, 2, 5); ctx.fillRect(x + 2, y + 4, 2, 5);
    ctx.fillStyle = '#fbfbf5'; ctx.strokeStyle = '#9a9a90'; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(x, y, 9, 7, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(x + f * 7, y - 6, 5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#e23a2a'; ctx.beginPath(); ctx.arc(x + f * 7, y - 11, 2.5, 0, Math.PI * 2); ctx.fill(); ctx.fillRect(x + f * 10 - 1, y - 4, 2, 3);
    ctx.fillStyle = '#f2a51a'; ctx.beginPath(); ctx.moveTo(x + f * 11, y - 7); ctx.lineTo(x + f * 15, y - 6); ctx.lineTo(x + f * 11, y - 4); ctx.fill();
    ctx.fillStyle = '#222'; ctx.fillRect(x + f * 8 - 1, y - 8, 2, 2);
    return;
  }
  if (it.kind === 'wisp') {
    const a = 0.65 + 0.3 * Math.sin(it.ph * 2), x = it.x, y = it.y;
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = a; ctx.drawImage(gGlow(195, 65), x - 16, y - 16, 32, 32); ctx.restore();
    ctx.fillStyle = `rgba(200,240,255,${a})`; ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x - 6, y); ctx.quadraticCurveTo(x - 2 + Math.sin(it.ph) * 3, y + 10, x + Math.sin(it.ph * 1.5) * 4, y + 16); ctx.quadraticCurveTo(x + 4, y + 8, x + 6, y); ctx.fill();
    return;
  }
  if (it.kind === 'purse') {
    const x = it.x, y = it.y, bob = Math.sin(now / 200 + it.x) * 1.5; ctx.globalAlpha = Math.min(1, it.life * 4);
    ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.beginPath(); ctx.ellipse(x, y + 9, 9, 3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#9a5a26'; ctx.strokeStyle = '#4e2a0c'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(x, y + 2 + bob, 9, 8, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#c47f3c'; ctx.beginPath(); ctx.moveTo(x - 5, y - 5 + bob); ctx.lineTo(x + 5, y - 5 + bob); ctx.lineTo(x + 7, y - 9 + bob); ctx.lineTo(x - 7, y - 9 + bob); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ffd34a'; ctx.beginPath(); ctx.arc(x, y + 3 + bob, 3, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
    return;
  }
  return orig.apply(this, arguments);
}; }
{ const orig = drawGimmickFx; drawGimmickFx = function (f, now) {
  if (f.kind === 'holyWarn') { const p = f.t / 50; ctx.strokeStyle = `rgba(255,240,170,${0.35 + p * 0.55})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(f.x, f.y, 34 * (1.3 - p * 0.3), 0, Math.PI * 2); ctx.stroke();
    ctx.save(); ctx.translate(f.x, f.y); ctx.rotate(now / 600); ctx.strokeStyle = `rgba(255,230,140,${0.3 + p * 0.5})`; ctx.beginPath(); for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; ctx.moveTo(Math.cos(a) * 18, Math.sin(a) * 18); ctx.lineTo(Math.cos(a + Math.PI * 2 / 3) * 18, Math.sin(a + Math.PI * 2 / 3) * 18); } ctx.stroke(); ctx.restore(); return; }
  if (f.kind === 'holyBeam' && stageArt('holy')) { const A = gArea(), im = stageArt('holy'), h = f.y - A.t + 40, w = Math.max(44, h * 0.3) * (0.7 + f.life * 0.5); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = Math.min(1, f.life * 1.6); ctx.drawImage(im, f.x - w / 2, A.t - 10, w, h + 10); ctx.globalAlpha = f.life; ctx.drawImage(gGlow(48, 80), f.x - 40, f.y - 40, 80, 80); ctx.restore(); return; }
  if (f.kind === 'holyBeam') { const A = gArea(), w = 30 * (0.6 + f.life * 0.6); ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createLinearGradient(f.x - w, 0, f.x + w, 0); g.addColorStop(0, 'rgba(255,240,180,0)'); g.addColorStop(0.5, `rgba(255,250,220,${0.85 * f.life})`); g.addColorStop(1, 'rgba(255,240,180,0)');
    ctx.fillStyle = g; ctx.fillRect(f.x - w, A.t - 10, w * 2, f.y - A.t + 10);
    ctx.globalAlpha = f.life; ctx.drawImage(gGlow(48, 80), f.x - 40, f.y - 40, 80, 80); ctx.restore(); return; }
  if (f.kind === 'rockfall' && f.pillar) { // 倒れてくる石柱（影→上から落ちる柱）
    const p = f.t / 50, A = gArea(), y = A.t - 40 + (f.y - A.t + 40) * p * p;
    ctx.strokeStyle = `rgba(255,170,80,${0.4 + p * 0.5})`; ctx.lineWidth = 2; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.arc(f.x, f.y, 34 * (1.3 - p * 0.3), 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
    ctx.globalAlpha = 0.25 + p * 0.3; ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(f.x, f.y + 6, 18 * p + 4, 6 * p + 2, 0, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
    if (!drawStageSprite('pillar', f.x, y - 22, 46)) drawRuinPillar(f.x, y - 20, 16, 40, 0.3 * (1 - p)); return;
  }
  return orig.apply(this, arguments);
}; }
function drawRuinPillar(x, y, w, h, tilt = 0, broken = false) {
  ctx.save(); ctx.translate(x, y + h / 2); ctx.rotate(tilt);
  const g = ctx.createLinearGradient(-w / 2, 0, w / 2, 0); g.addColorStop(0, '#8a8072'); g.addColorStop(0.45, '#d8cdb6'); g.addColorStop(1, '#7a7062');
  ctx.fillStyle = g; ctx.fillRect(-w / 2, -h, w, h);
  ctx.strokeStyle = 'rgba(80,70,55,0.5)'; ctx.lineWidth = 1; for (let i = -w / 2 + 4; i < w / 2; i += 5) { ctx.beginPath(); ctx.moveTo(i, -h + 4); ctx.lineTo(i, -2); ctx.stroke(); }
  ctx.fillStyle = '#a89c86'; ctx.fillRect(-w / 2 - 3, -4, w + 6, 5);
  if (broken) { ctx.fillStyle = '#c9bea6'; ctx.beginPath(); ctx.moveTo(-w / 2, -h); ctx.lineTo(-w / 6, -h - 5); ctx.lineTo(w / 8, -h + 2); ctx.lineTo(w / 2, -h - 3); ctx.lineTo(w / 2, -h); ctx.closePath(); ctx.fill(); }
  else ctx.fillRect(-w / 2 - 3, -h - 4, w + 6, 5);
  ctx.restore();
}
// ---- 床の上の飾り（キャラの下に描く） ----
function gHouse(x, y, w, h, roof, wall = '#e8d7b0') {
  ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(x - w / 2 + 4, y - h + 6, w, h);
  ctx.fillStyle = wall; ctx.fillRect(x - w / 2, y - h, w, h);
  ctx.strokeStyle = '#6b4a2a'; ctx.lineWidth = 2; ctx.strokeRect(x - w / 2, y - h, w, h);
  ctx.fillStyle = roof; ctx.beginPath(); ctx.moveTo(x - w / 2 - 6, y - h); ctx.lineTo(x, y - h - h * 0.75); ctx.lineTo(x + w / 2 + 6, y - h); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#6b4a2a'; ctx.fillRect(x - 5, y - 14, 10, 14);
  ctx.fillStyle = '#ffe9a0'; ctx.fillRect(x - w / 2 + 5, y - h + 6, 8, 7); ctx.fillRect(x + w / 2 - 13, y - h + 6, 8, 7);
}
function drawVillageDecor(A, now) {
  gHouse(A.l + 34, A.t + 62, 44, 32, '#b8462e'); gHouse(A.r - 34, A.t + 62, 44, 32, '#3f6fa8');
  ctx.strokeStyle = '#8a5f30'; ctx.lineWidth = 3; // 柵
  const fy = A.b - 22; ctx.beginPath(); ctx.moveTo(A.l + 8, fy); ctx.lineTo(A.l + A.w * 0.32, fy); ctx.moveTo(A.r - A.w * 0.32, fy); ctx.lineTo(A.r - 8, fy); ctx.stroke();
  ctx.fillStyle = '#8a5f30'; for (let x = A.l + 10; x < A.l + A.w * 0.32; x += 14) ctx.fillRect(x, fy - 10, 3, 14); for (let x = A.r - A.w * 0.32; x < A.r - 8; x += 14) ctx.fillRect(x, fy - 10, 3, 14);
  // 井戸
  const wx = arena.x, wy = A.t + 46; ctx.fillStyle = '#8f8a80'; ctx.beginPath(); ctx.ellipse(wx, wy, 16, 8, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#2b3550'; ctx.beginPath(); ctx.ellipse(wx, wy - 1, 11, 5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#7a4a22'; ctx.fillRect(wx - 15, wy - 26, 3, 24); ctx.fillRect(wx + 12, wy - 26, 3, 24); ctx.fillStyle = '#a3402a'; ctx.beginPath(); ctx.moveTo(wx - 20, wy - 24); ctx.lineTo(wx, wy - 36); ctx.lineTo(wx + 20, wy - 24); ctx.closePath(); ctx.fill();
}
function drawTownDecor(A, now) {
  const cols = ['#c8392e', '#2e7bc8', '#e0a02a', '#3a9a5a'];
  for (let i = 0; i < 4; i++) { // 屋台（しま模様の日よけ）
    const x = A.l + A.w * (i + 0.5) / 4, y = i % 2 ? A.b - 18 : A.t + 30, w = A.w / 4 - 16;
    ctx.fillStyle = '#7a5532'; ctx.fillRect(x - w / 2, y, w, 12);
    for (let k = 0; k < 6; k++) { ctx.fillStyle = k % 2 ? '#fff6e6' : cols[i]; ctx.fillRect(x - w / 2 + k * w / 6, y - 14, w / 6 + 0.5, 14); }
    ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fillRect(x - w / 2, y - 2, w, 3);
    ctx.fillStyle = ['#e85c3a', '#f2d24a', '#7bd05a'][i % 3]; for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.arc(x - w / 2 + 8 + k * (w - 16) / 3, y + 4, 3.5, 0, Math.PI * 2); ctx.fill(); }
  }
  ctx.strokeStyle = 'rgba(60,40,20,0.6)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(A.l, A.t + 70); ctx.quadraticCurveTo(arena.x, A.t + 92, A.r, A.t + 70); ctx.stroke(); // ちょうちんの紐
  for (let i = 1; i < 8; i++) { const t = i / 8, x = A.l + A.w * t, y = A.t + 70 + 22 * 4 * t * (1 - t) * 0.98; const fl = 0.8 + 0.2 * Math.sin(now / 300 + i); ctx.fillStyle = `rgba(255,${150 + i * 10},80,${fl})`; ctx.beginPath(); ctx.ellipse(x, y + 6, 4, 6, 0, 0, Math.PI * 2); ctx.fill(); }
}
function drawRuinsDecor(A, now) {
  const spots = [[0.1, 0.22, 1], [0.9, 0.2, 0], [0.12, 0.8, 0], [0.88, 0.78, 1], [0.5, 0.12, 1]];
  for (const [fx, fy, br] of spots) drawRuinPillar(A.l + A.w * fx, A.t + A.h * fy - 30, 18, br ? 22 : 36, 0, true);
  ctx.strokeStyle = 'rgba(40,30,20,0.45)'; ctx.lineWidth = 2; // ひび割れ
  for (const [x0, y0] of [[0.3, 0.4], [0.7, 0.6], [0.45, 0.85]]) { let x = A.l + A.w * x0, y = A.t + A.h * y0; ctx.beginPath(); ctx.moveTo(x, y); for (let k = 0; k < 4; k++) { x += 10 + (k * 7) % 9; y += (k % 2 ? -8 : 7); ctx.lineTo(x, y); } ctx.stroke(); }
  ctx.fillStyle = 'rgba(90,140,60,0.35)'; for (const [x0, y0] of [[0.08, 0.3], [0.92, 0.28], [0.15, 0.86]]) { ctx.beginPath(); ctx.ellipse(A.l + A.w * x0, A.t + A.h * y0, 14, 6, 0, 0, Math.PI * 2); ctx.fill(); }
}
function drawGraveyardDecor(A, now) {
  const spots = [[0.12, 0.2], [0.3, 0.14], [0.7, 0.14], [0.88, 0.2], [0.1, 0.62], [0.9, 0.6], [0.2, 0.88], [0.8, 0.88]];
  spots.forEach(([fx, fy], i) => {
    const x = A.l + A.w * fx, y = A.t + A.h * fy;
    ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(x + 3, y + 2, 12, 4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#7d7f8c'; ctx.strokeStyle = '#3e3f4a'; ctx.lineWidth = 1.5;
    if (i % 3 === 1) { ctx.fillRect(x - 3, y - 26, 6, 26); ctx.fillRect(x - 10, y - 20, 20, 6); ctx.strokeRect(x - 3, y - 26, 6, 26); } // 十字架
    else { ctx.beginPath(); ctx.moveTo(x - 10, y); ctx.lineTo(x - 10, y - 16); ctx.arc(x, y - 16, 10, Math.PI, 0); ctx.lineTo(x + 10, y); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#4e505c'; ctx.fillRect(x - 5, y - 15, 10, 2); ctx.fillRect(x - 4, y - 10, 8, 2); }
  });
  ctx.strokeStyle = '#2a2230'; ctx.lineWidth = 3; ctx.beginPath(); const tx = A.l + 14, ty = A.t + A.h * 0.42; ctx.moveTo(tx, ty + 40); ctx.lineTo(tx + 4, ty); ctx.moveTo(tx + 3, ty + 10); ctx.lineTo(tx + 22, ty - 6); ctx.moveTo(tx + 3, ty + 22); ctx.lineTo(tx + 18, ty + 18); ctx.stroke(); // 枯れ木
}
function drawChurchDecor(A, now) {
  const cx = arena.x, aw = A.w * 0.18;
  ctx.fillStyle = 'rgba(40,70,150,0.55)'; ctx.fillRect(cx - aw / 2, A.t - 10, aw, A.h + 20); // 青いじゅうたん
  ctx.fillStyle = 'rgba(240,220,150,0.6)'; ctx.fillRect(cx - aw / 2, A.t - 10, 3, A.h + 20); ctx.fillRect(cx + aw / 2 - 3, A.t - 10, 3, A.h + 20);
  for (let r = 0; r < 4; r++) for (const side of [-1, 1]) { // 長椅子
    const y = A.t + A.h * (0.32 + r * 0.17), x0 = side < 0 ? A.l + 14 : cx + aw / 2 + 12, w = A.w / 2 - aw / 2 - 26;
    ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(x0 + 3, y + 3, w, 10); ctx.fillStyle = '#7a4a26'; ctx.fillRect(x0, y, w, 10); ctx.fillStyle = '#5a3418'; ctx.fillRect(x0, y - 4, w, 4);
  }
  const ax = cx, ay = A.t + 34; ctx.fillStyle = '#e8e0d0'; ctx.fillRect(ax - 26, ay - 8, 52, 16); ctx.fillStyle = '#d0a63a'; ctx.fillRect(ax - 2, ay - 26, 4, 18); ctx.fillRect(ax - 8, ay - 21, 16, 4); // 祭壇と十字架
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; // ステンドグラスの光
  const cols = ['rgba(255,80,80,', 'rgba(80,140,255,', 'rgba(255,220,80,', 'rgba(100,220,140,'];
  for (let i = 0; i < 4; i++) { const x = A.l + A.w * (0.12 + i * 0.25), a = 0.07 + 0.03 * Math.sin(now / 900 + i); ctx.fillStyle = cols[i] + a + ')'; ctx.beginPath(); ctx.moveTo(x - 10, A.t); ctx.lineTo(x + 10, A.t); ctx.lineTo(x + 40, A.t + A.h * 0.7); ctx.lineTo(x + 6, A.t + A.h * 0.7); ctx.closePath(); ctx.fill(); }
  ctx.restore();
}
const GIMMICK_DECOR = { village: drawVillageDecor, town: drawTownDecor, ruins: drawRuinsDecor, graveyard: drawGraveyardDecor, church: drawChurchDecor };
{ const orig = drawArenaFloor; drawArenaFloor = function () { const r = orig.apply(this, arguments); try { const key = curGimmick(), bg = key && stageArt('bg_' + key); if (bg) { // 背景の一枚絵を戦う場所いっぱいに（はみ出す分は上下を切る）
      const A = gArea(), s = Math.max(A.w / bg.naturalWidth, A.h / bg.naturalHeight), w = bg.naturalWidth * s, h = bg.naturalHeight * s;
      ctx.save(); arenaPath(); ctx.clip(); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high'; /* 背景は高解像度にした絵なので、なめらかに縮小して描く */ ctx.drawImage(bg, (A.l + A.r - w) / 2, (A.t + A.b - h) / 2, w, h); ctx.restore(); return r; }
    const d = GIMMICK_DECOR[key]; if (d) { ctx.save(); arenaPath(); ctx.clip(); d(gArea(), Date.now()); ctx.restore(); } } catch (e) {} return r; }; }
{ const orig = drawGimmick; drawGimmick = function () { // 墓地は暗闇（人魂と味方のまわりだけ明るい）
  if (curGimmick() === 'graveyard') { ctx.save(); arenaPath(); ctx.clip(); drawGimmickDark(gArea(), stageArt('bg_graveyard') ? 'rgba(8,4,26,0.35)' : 'rgba(8,4,26,0.55)', 75); ctx.restore(); }
  return orig.apply(this, arguments);
}; }
// 月夜の草原（ホタル）は、草原・森・河原の床で（雪原などエリアの床にしない）
const NIGHT_FLOORS = ['mossStone', 'dirt', 'lawn', 'st_village']; // 1周目（3組目）は草原
{ const orig = getFloorKey; getFloorKey = function (stage) { if (typeof gimmickForStage === 'function' && gimmickForStage(stage) === 'night') return NIGHT_FLOORS[((gimmickWindow(stage) % NIGHT_FLOORS.length) + NIGHT_FLOORS.length) % NIGHT_FLOORS.length]; return orig.apply(this, arguments); }; }

// 吹き出しは、イベントの暗闇や色かぶせよりも上に描く（暗いステージでも読めるように）
{ // 吹き出しは専用の重ねキャンバスに描く（左上の宝箱などの上に出るように）
  const sc = document.getElementById('speechCanvas'), sctx = sc && sc.getContext('2d'); let scDirty = false;
  const orig = draw; draw = function () {
    orig.apply(this, arguments);
    if (!sctx) { try { drawSpeech(); } catch (e) {} return; }
    if (sc.width !== canvas.width || sc.height !== canvas.height) { sc.width = canvas.width; sc.height = canvas.height; }
    if (scDirty || speech.length) { sctx.setTransform(1, 0, 0, 1, 0, 0); sctx.clearRect(0, 0, sc.width, sc.height); scDirty = false; }
    if (!speech.length) return;
    const main = ctx; ctx = sctx; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    try { drawSpeech(); scDirty = true; } catch (e) {} finally { ctx = main; }
  };
}
// デバッグ：ステージギミック（イベント）を選んで固定する
{ const host = document.getElementById('dbgNowStage');
  if (host) {
    host.insertAdjacentHTML('afterend', `<label class="dbg-gm-sel">🎪 ステージギミック <select id="dbgGimmickSel"><option value="">（固定しない）</option>${GIMMICK_KEYS.map(k => `<option value="${k}">${GIMMICKS[k].icon} ${GIMMICKS[k].name}</option>`).join('')}</select></label>`);
    document.getElementById('dbgGimmickSel').addEventListener('change', ev => {
      dbgGimmick = ev.target.value || null; gm.id = ''; setupGimmick(gimmickForStage(game.stage));
      showNotice(dbgGimmick ? `DEBUG: イベント「${GIMMICKS[dbgGimmick].name}」` : 'DEBUG: イベント固定を解除');
    });
  }
}

// ステージイベントを初めてクリアしたら図鑑のジェム（前からのセーブは、出会ったときにもらい済み）
if (!game.gimmickCleared) game.gimmickCleared = Object.assign({}, game.gimmickSeen || {});
{ const orig = onStageClear; onStageClear = function (passed) {
  const key = gm && gm.key;
  const r = orig.apply(this, arguments);
  if (false && key && !passed && !dbgGimmick && !game.gimmickCleared[key]) { // ステージイベント図鑑のジェムはなくした
    game.gimmickCleared[key] = true; game.gems += GIMMICK_FIND_GEMS; updateStatsUI();
    setTimeout(() => spawnDamageText(arena.x, arena.y + 20, `${GIMMICKS[key].icon} ${GIMMICKS[key].name} 初クリア！ +${GIMMICK_FIND_GEMS} 💎`, '#64e8ff', 0.012, true), 700);
  }
  return r;
}; }
// ドーピングの種・金の招き猫・自キャラの変更はなくした：持っていた種（使った分も）と招き猫は、1つにつきN羽1枚にして返す
if (!game.seedGone) {
  const n = (seedHeld('atk') + seedHeld('hp') + seedUsed('atk') + seedUsed('hp')) + itemHeld('maneki');
  game.seeds = {}; game.seedUsed = {}; if (game.items) delete game.items.maneki; game.manekiUntil = 0; game.heroChar = null; game.seedGone = true;
  if (n > 0) { addFea('common', n); setTimeout(() => showNotice(`🪶 ドーピングの種・金の招き猫はなくなりました。持っていた分を 進化のN羽 ×${n} にして返しました`, false, 6000), 3000); }
  try { updateSeedButton(); refreshPlayerBallStats(false); saveGame(); } catch (e) {}
}
