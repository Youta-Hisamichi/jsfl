const ENEMY_SPRITES = {
  goblinSlime: 'assets/img/enemies/goblinSlime.webp',
  witchSlime: 'assets/img/enemies/witchSlime.webp',
  vikingSlime: 'assets/img/enemies/vikingSlime.webp',
  knifeGoblin: 'assets/img/enemies/knifeGoblin.webp',
  darkMage: 'assets/img/enemies/darkMage.webp',
  slimeBlack: 'assets/img/enemies/slimeBlack.webp',
  slimeGray: 'assets/img/enemies/slimeGray.webp',
  slimePinkS: 'assets/img/enemies/slimePinkS.webp',
  slimeBlueS: 'assets/img/enemies/slimeBlueS.webp',
  fatDragon: 'assets/img/enemies/fatDragon.webp',
  slimeGold: 'assets/img/enemies/slimeGold.webp',
  slimeGreenS: 'assets/img/enemies/slimeGreenS.webp',
  fishman: 'assets/img/enemies/fishman.webp',
  longSlime: 'assets/img/enemies/longSlime.webp',
  cucumber: 'assets/img/enemies/cucumber.webp',
  swordLizard: 'assets/img/enemies/swordLizard.webp',
  crabGirl: 'assets/img/enemies/crabGirl.webp',
  slimeSilver: 'assets/img/enemies/slimeSilver.webp',
  slimeRainbow: 'assets/img/enemies/slimeRainbow.webp',
  slimeYellow: 'assets/img/enemies/slimeYellow.webp',
  blueBat: 'assets/img/enemies/blueBat.webp',
  fireSpirit: 'assets/img/enemies/fireSpirit.webp',
  succubus: 'assets/img/enemies/succubus.webp',
  ironKnight: 'assets/img/enemies/ironKnight.webp',
  darkKnight: 'assets/img/enemies/darkKnight.webp',
  wolfSword: 'assets/img/enemies/wolfSword.webp',
  stagKnight: 'assets/img/enemies/stagKnight.webp',
  muscleSlime: 'assets/img/enemies/muscleSlime.webp',
  flameBear: 'assets/img/enemies/flameBear.webp',
  scorpion: 'assets/img/enemies/scorpion.webp',
  marmot: 'assets/img/enemies/marmot.webp',
  eyeGirl: 'assets/img/enemies/eyeGirl.webp',
  spiderGirl: 'assets/img/enemies/spiderGirl.webp',
  wellGhost: 'assets/img/enemies/wellGhost.webp',
  gorillaTaur: 'assets/img/enemies/gorillaTaur.webp',
  vampire: 'assets/img/enemies/vampire.webp',
  werewolf: 'assets/img/enemies/werewolf.webp',
  franken: 'assets/img/enemies/franken.webp',
  slimeGirl: 'assets/img/enemies/slimeGirl.webp',
  reaper: 'assets/img/enemies/reaper.webp',
  demonKing: 'assets/img/enemies/demonKing.webp',
  slimeKing: 'assets/img/enemies/slimeKing.webp',
  penguinMage: 'assets/img/enemies/penguinMage.webp',
  jellyDiva: 'assets/img/enemies/jellyDiva.webp',
  barrelCat: 'assets/img/enemies/barrelCat.webp',
  slime: 'assets/img/enemies/slime.webp',
  metalSlime: 'assets/img/enemies/metalSlime.webp',
  goblin: 'assets/img/enemies/goblin.webp',
  skeleton: 'assets/img/enemies/skeleton.webp',
  zombie: 'assets/img/enemies/zombie.webp',
  livingArmor: 'assets/img/enemies/livingArmor.webp',
  pumpkin: 'assets/img/enemies/pumpkin.webp',
  ghost: 'assets/img/enemies/ghost.webp',
  bat: 'assets/img/enemies/bat.webp',
  demon: 'assets/img/enemies/demon.webp',
  worm: 'assets/img/enemies/worm.webp',
  cobra: 'assets/img/enemies/cobra.webp',
  salamander: 'assets/img/enemies/salamander.webp',
  flameWisp: 'assets/img/enemies/flameWisp.webp',
  lich: 'assets/img/enemies/lich.webp',
  dragon: 'assets/img/enemies/dragon.webp',
  blueDragon: 'assets/img/enemies/blueDragon.webp',
  blackDragon: 'assets/img/enemies/blackDragon.webp',
  wyvern: 'assets/img/enemies/wyvern.webp',
};
const SHAPE_ENEMY_SPRITE = { spike: 'slime', slimeOrange: 'slimeOrange', slimeGreen: 'slimeGreen', slimeBlood: 'slimeBlood', slimeChibi: 'slime', slimeJumbo: 'slimeJumbo', slimeSnowman: 'slimeIce', slimeDango: 'slimeMatcha', slimeIce: 'slimeIce', slimePink: 'slimePink', slimeMatcha: 'slimeMatcha', diamond: 'flameWisp', square: 'worm' };
const EMOJI_ENEMY_SPRITE = { '🥬': 'goblinSlime', '🧙': 'witchSlime', '🪖': 'vikingSlime', '🔪': 'knifeGoblin', '🌑': 'darkMage', '⚫': 'slimeBlack', '🩶': 'slimeGray', '🩷': 'slimePinkS', '🔷': 'slimeBlueS', '🦕': 'fatDragon', '🪙': 'slimeGold', '🟩': 'slimeGreenS', '🐟': 'fishman', '🦒': 'longSlime', '🥒': 'cucumber', '🦎': 'swordLizard', '🦀': 'crabGirl', '🥈': 'slimeSilver', '🌈': 'slimeRainbow', '🟨': 'slimeYellow', '🦋': 'blueBat', '🔥': 'fireSpirit', '💋': 'succubus', '🛡️': 'ironKnight', '🗡️': 'wolfSword', '🪲': 'stagKnight', '🐻': 'flameBear', '🦞': 'scorpion', '🦫': 'marmot', '🧛': 'vampire', '🌕': 'werewolf', '⚡': 'franken', '💧': 'slimeGirl', '👑': 'slimeKing', '🐧': 'penguinMage', '🪼': 'jellyDiva', '🛢️': 'barrelCat', '👺': 'goblin', '💀': 'skeleton', '👻': 'ghost', '🎃': 'pumpkin', '🐉': 'dragon', '🦂': 'cobra', '🦇': 'bat', '👾': 'metalSlime', '🧟': 'zombie', '🦖': 'salamander', '🐲': 'wyvern' };
const BOSS_ENEMY_SPRITE = { '⚔️': 'darkKnight', '🫧': 'slimeJumbo', '💪': 'muscleSlime', '👁️': 'eyeGirl', '🕸️': 'spiderGirl', '🪦': 'wellGhost', '🦍': 'gorillaTaur', '⚰️': 'reaper', '😈': 'demonKing', '👹': 'demon', '💀': 'lich', '🦖': 'blackDragon', '🐲': 'blueDragon', '🦔': 'livingArmor' };
const ENEMY_SPRITE_SCALE = 3.2; // ドット絵の描画サイズ（半径比）
document.getElementById('stageBossMark').src = ENEMY_SPRITES.demon; // ステージ進行ゲージのゴール（ボス）アイコン
const enemySpriteImgs = {};
for (const k in ENEMY_SPRITES) { const img = new Image(); img.src = ENEMY_SPRITES[k]; enemySpriteImgs[k] = img; }
const SLIME_VARIANT_HUES = { slimeOrange: 32, slimeGreen: 118, slimeBlood: 352, slimeJumbo: 278, slimeIce: 200, slimePink: 340, slimeMatcha: 95 };
const SLIME_VARIANT_DARKEN = { slimeBlood: 0.78 }; // 血のような深い赤にするため少し暗く
const SLIME_VARIANT_LIFT = { slimeIce: 0.62, slimePink: 0.38, slimeMatcha: 0.25 };
const SLIME_VARIANT_SAT = { slimeIce: 0.35, slimePink: 0.8, slimeMatcha: 0.7 };
function buildSlimeVariants() {
  const src = enemySpriteImgs.slime;
  const w = src.naturalWidth, h = src.naturalHeight;
  for (const key in SLIME_VARIANT_HUES) {
    const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
    const c = cv.getContext('2d'); c.drawImage(src, 0, 0);
    const d = c.getImageData(0, 0, w, h), px = d.data, target = SLIME_VARIANT_HUES[key] / 360, dark = SLIME_VARIANT_DARKEN[key] || 1;
    const lift = SLIME_VARIANT_LIFT[key] || 0, satMul = SLIME_VARIANT_SAT[key] || 1;
    for (let i = 0; i < px.length; i += 4) {
      if (!px[i + 3]) continue;
      const r = px[i] / 255, g = px[i + 1] / 255, b = px[i + 2] / 255;
      const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l0 = (mx + mn) / 2 * dark, dd = mx - mn;
      if (dd < 0.08) continue; // 白・黒・灰色（目やハイライト）はそのまま
      const l = l0 < 0.18 ? l0 : l0 * (1 - lift) + lift; // 輪郭の暗い線はそのまま、体だけ明るく
      const sat = Math.min(1, dd / (1 - Math.abs((mx + mn) - 1))) * satMul;
      const q = l < 0.5 ? l * (1 + sat) : l + sat - l * sat, pp = 2 * l - q;
      const hue2 = t => { t = (t + 1) % 1; return t < 1 / 6 ? pp + (q - pp) * 6 * t : t < 0.5 ? q : t < 2 / 3 ? pp + (q - pp) * (2 / 3 - t) * 6 : pp; };
      px[i] = hue2(target + 1 / 3) * 255; px[i + 1] = hue2(target) * 255; px[i + 2] = hue2(target - 1 / 3) * 255;
    }
    c.putImageData(d, 0, 0);
    ENEMY_SPRITES[key] = cv.toDataURL();
    const img = new Image(); img.src = ENEMY_SPRITES[key]; enemySpriteImgs[key] = img;
  }
}
const scheduleIdle = cb => (window.requestIdleCallback ? requestIdleCallback(cb, { timeout: 1500 }) : setTimeout(cb, 300));
const buildSlimeVariantsLater = () => scheduleIdle(buildSlimeVariants);
if (enemySpriteImgs.slime.complete && enemySpriteImgs.slime.naturalWidth) buildSlimeVariantsLater();
else enemySpriteImgs.slime.addEventListener('load', buildSlimeVariantsLater, { once: true });
function getEnemySpriteKey(enemy) {
  if (enemy.isBoss && enemy.megaPhase && enemy.megaPhase !== 'mega') return 'slime'; // 超ジャンボスライムは合体するまでミニスライムの姿
  if (enemy.isBoss) return BOSS_ENEMY_SPRITE[enemy.emoji];
  return enemy.emoji ? EMOJI_ENEMY_SPRITE[enemy.emoji] : SHAPE_ENEMY_SPRITE[enemy.shape];
}
function getEnemySpriteImg(enemy) {
  const img = enemySpriteImgs[getEnemySpriteKey(enemy)];
  return img && img.complete && img.naturalWidth ? img : null;
}
function enemySpriteHtml(key, cls) { return ENEMY_SPRITES[key] ? `<img class="${cls || 'comp-sprite'}" src="${ENEMY_SPRITES[key]}" alt="">` : ''; }
function stackSpriteHtml(layers) {
  const base = layers.length >= 3 ? 1.3 : 1.5;
  let bottom = 0;
  return `<span class="bst-stack">${layers.map((key, i) => {
    const sz = base * Math.pow(0.8, i);
    const html = ENEMY_SPRITES[key] ? `<img src="${ENEMY_SPRITES[key]}" alt="" style="width:${sz.toFixed(2)}rem;height:${sz.toFixed(2)}rem;bottom:${bottom.toFixed(2)}rem;z-index:${i + 1}">` : '';
    bottom += sz * 0.46;
    return html;
  }).join('')}</span>`;
}
const ENEMY_BOOK = [
  ...Object.keys(SHAPE_ENEMY_NAMES).map(shape => ({ key: 'shape:' + shape, kind: 'normal', name: SHAPE_ENEMY_NAMES[shape], shape, color: SHAPE_ENEMY_COLORS[shape], sprite: SHAPE_ENEMY_SPRITE[shape] })),
  ...EMOJI_ENEMIES.map(em => ({ key: 'emoji:' + em, kind: 'normal', name: EMOJI_ENEMY_NAMES[em], icon: em, sprite: EMOJI_ENEMY_SPRITE[em] })),
  ...BOSS_EMOJIS.map(em => ({ key: 'boss:' + em, kind: 'boss', name: BOSS_ENEMY_NAMES[em], icon: em, sprite: BOSS_ENEMY_SPRITE[em] }))
];
const ENEMY_BOOK_BY_KEY = {};
// デバッグで「削除」した敵は出現しなくなる（セーブに残る。↩で戻せる）
function isEnemyRemoved(key) { return !!(game.removedEnemies && game.removedEnemies[key]); }
function pickFrom(list) { return list[Math.floor(Math.random() * list.length)]; }
let dbgMonKey = null;
function renderDebugMonsters() {
  const grid = document.getElementById('dbgMonGrid'); if (!grid) return;
  grid.innerHTML = ENEMY_BOOK.map(en => `<button class="${en.key === dbgMonKey ? 'sel' : ''} ${isEnemyRemoved(en.key) ? 'gone' : ''}" data-mon="${en.key}" title="${en.name}">${en.sprite && ENEMY_SPRITES[en.sprite] ? `<img src="${ENEMY_SPRITES[en.sprite]}" alt="">` : `<i style="background:${en.color || '#888'}"></i>`}</button>`).join('');
  const en = ENEMY_BOOK_BY_KEY[dbgMonKey];
  document.getElementById('dbgMonSel').textContent = en ? `${en.kind === 'boss' ? '👑' : ''}${en.name}${isEnemyRemoved(en.key) ? '（削除中）' : ''}` : '画像をタップして選択';
}
ENEMY_BOOK.forEach(entry => ENEMY_BOOK_BY_KEY[entry.key] = entry);
function getEnemyBookKey(enemy) {
  if (enemy.isBoss) return 'boss:' + enemy.emoji;
  return enemy.emoji ? 'emoji:' + enemy.emoji : 'shape:' + enemy.shape;
}
function recordBestiaryKill(enemy) {
  if (!enemy || enemy.bookRecorded) return;
  enemy.bookRecorded = true;
  const key = getEnemyBookKey(enemy);
  if (!ENEMY_BOOK_BY_KEY[key]) return;
  if (!game.bestiary) game.bestiary = {};
  const rec = game.bestiary[key];
  if (!rec) {
    game.bestiary[key] = { kills: 1, firstStage: game.stage };
    spawnDamageText(arena.x, arena.y - arena.radius * 0.45, '📖 図鑑に登録：' + ENEMY_BOOK_BY_KEY[key].name, '#8fd3ff', 0.012);
    damageTexts[damageTexts.length - 1].vy = 0; // 動かさずにサークル上部に表示
  } else {
    rec.kills++;
  }
  if (getActiveTab() === 'records') renderBestiary();
}
function renderBestiary() {
  const list = document.getElementById('bestiaryList');
  if (!list) return;
  const book = game.bestiary || {};
  const found = ENEMY_BOOK.filter(entry => book[entry.key]).length;
  document.getElementById('bestiaryCount').textContent = `${found} / ${ENEMY_BOOK.length}（${(Math.floor(found / ENEMY_BOOK.length * 1000) / 10).toFixed(1)}%）`;
  list.innerHTML = ENEMY_BOOK.map(entry => {
    const rec = book[entry.key];
    const face = STACK_LAYERS[entry.shape] ? `<span class="bst-face">${stackSpriteHtml(STACK_LAYERS[entry.shape])}</span>`
      : entry.sprite
      ? `<span class="bst-face">${enemySpriteHtml(entry.sprite, 'bst-sprite')}</span>`
      : entry.icon
      ? `<span class="bst-face">${entry.icon}</span>`
      : `<span class="bst-face"><span class="bst-shape bst-${entry.shape}" style="background:${entry.color}"></span></span>`;
    if (!rec) return `<div class="bst-card unknown"><span class="bst-face">？</span><span class="bst-name">？？？</span><span class="bst-info">${entry.kind === 'boss' ? '👑 ボス' : '未発見'}</span></div>`;
    return `<div class="bst-card ${entry.kind === 'boss' ? 'boss' : ''}">${face}<span class="bst-name">${entry.kind === 'boss' ? '👑 ' : ''}${entry.name}</span><span class="bst-info">撃破 ${formatCoinNumber(rec.kills)}体</span><span class="bst-info">初撃破 ${rec.firstStage}階層</span></div>`;
  }).join('');
}

const MOVEMENT_STYLES = ['normal', 'gravity', 'zigzag', 'orbit'];
function pickEnemyMovementStyle(stage) {
  const primary = MOVEMENT_STYLES[stage % MOVEMENT_STYLES.length];
  return Math.random() < 0.65 ? primary : MOVEMENT_STYLES[Math.floor(Math.random() * MOVEMENT_STYLES.length)];
}

function makeBall(isPlayer) {
  const b = computeBonuses();
  const speed = 3.2 * b.speedMult;
  const angle = Math.random() * Math.PI * 2;
  if (isPlayer) {
    const maxHp = getPlayerMaxHP();
    return {
      isPlayer: true,
      x: arena.x - arena.radius * 0.3, y: arena.y,
      vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      radius: 16, maxHp, hp: maxHp, atk: getPlayerAtk(),
      color: '#4fa8ff', glow: 'rgba(79,168,255,0.55)', hitCooldown: 0
    };
  } else {
    const es = getEnemyStats(game.stage);
    const enemyStyles = [
      { color: '#ff5c6c', glow: 'rgba(255,92,108,0.55)', shape: 'spike' },
      { color: '#ff9d4f', glow: 'rgba(255,157,79,0.55)', shape: 'diamond' },
      { color: '#f46bd4', glow: 'rgba(244,107,212,0.55)', shape: 'square' }
    ];
    let style = enemyStyles[0], isEmoji = false, emoji = null;
    const filmKind = filmMode && filmMode.key.split(':')[0];
    if (es.isBoss) { isEmoji = true; emoji = forcedBossEmoji || (filmKind === 'boss' ? filmMode.key.split(':')[1] : null) || getStageBossEmoji(game.stage); }
    else { // ステージごとに決まった敵（撮影モード中は選んだ敵）
      const [kind, val] = (filmKind && filmKind !== 'boss' ? filmMode.key : getStageEnemyKey(game.stage)).split(':');
      if (kind === 'shape') { const c = SHAPE_ENEMY_COLORS[val] || '#ff5c6c'; style = { color: c, glow: c + '8c', shape: val }; }
      else { isEmoji = true; emoji = val; }
    }
    const isGiant = es.isBoss && !game.skipChallenge && (forcedGiantBoss || Math.random() < GIANT_BOSS_CHANCE);
    forcedGiantBoss = false;
    if (isGiant) { es.hp = Math.round(es.hp * GIANT_BOSS_HP_MULT); es.atk = Math.round(es.atk * GIANT_BOSS_ATK_MULT); }
    if (forcedEnemyKey && !es.isBoss) {
      const [kind, val] = forcedEnemyKey.split(':');
      if (kind === 'shape') { isEmoji = false; emoji = null; const c = SHAPE_ENEMY_COLORS[val] || '#ff5c6c'; style = { color: c, glow: c + '8c', shape: val }; }
      else { isEmoji = true; emoji = val; }
    }
    const movementStyle = es.isBoss ? 'normal' : pickEnemyMovementStyle(game.stage);
    const orbitRadius = arena.radius * (0.4 + Math.random() * 0.3);
    return {
      isPlayer: false,
      ...farSpawnPoint(0.72),
      vx: Math.cos(angle) * 3.2, vy: Math.sin(angle) * 3.2,
      maxHp: es.hp, hp: es.hp, atk: es.atk, isBoss: es.isBoss, isGiant,
      radius: Math.round((isGiant ? GIANT_BOSS_RADIUS : es.isBoss ? 34 : 16) * (es.milestone && !game.skipChallenge ? Math.min(es.milestone.radius, isGiant ? 1.1 : 2) : 1)), milestone: es.milestone,
      color: es.isBoss ? '#ba6cff' : style.color,
      glow: es.isBoss ? 'rgba(186,108,255,0.65)' : style.glow,
      shape: es.isBoss ? 'emoji' : (isEmoji ? 'emoji' : style.shape),
      emoji,
      movementStyle,
      zigzagTimer: Math.random() * 40,
      orbitAngle: Math.random() * Math.PI * 2,
      orbitRadius,
      orbitSpeed: (0.018 + Math.random() * 0.018) * (Math.random() < 0.5 ? 1 : -1),
      hitCooldown: 0
    };
  }
}
// ステージごとの敵は固定。10ステージ単位のエリア（床の景色）に合った顔ぶれで、1〜9番目が通常の敵、10番目がボス
const STAGE_ZONES = [
  { name: '草原',   normal: ['shape:spike', 'emoji:🔷', 'emoji:🟩', 'emoji:🦫', 'shape:slimeOrange', 'emoji:🥬', 'emoji:🦋', 'emoji:🟨', 'emoji:👺'], boss: '💪' },
  { name: '森',     normal: ['emoji:🔪', 'shape:slimeGreen', 'emoji:🦎', 'emoji:🦒', 'emoji:🪲', 'shape:slimeChibi', 'emoji:🩷', 'emoji:🦇', 'emoji:🐻'], boss: '🦍' },
  { name: '砂漠',   normal: ['emoji:🦂', 'emoji:🪙', 'emoji:🦞', 'shape:diamond', 'emoji:🔥', 'emoji:🦕', 'shape:slimeBlood', 'emoji:⚫', 'emoji:🦖'], boss: '🦔' },
  { name: '街道',   normal: ['emoji:🥒', 'emoji:🩶', 'shape:square', 'emoji:🪖', 'emoji:💀', 'emoji:🥈', 'emoji:🗡️', 'emoji:👾', 'emoji:🛡️'], boss: '🕸️' },
  { name: '夜の町', normal: ['emoji:🎃', 'emoji:👻', 'emoji:🛢️', 'emoji:🧟', 'shape:slimeDango', 'emoji:⚡', 'emoji:🌕', 'emoji:💋', 'emoji:🧛'], boss: '🪦' },
  { name: '雪原',   normal: ['shape:slimeIce', 'shape:slimeSnowman', 'emoji:🐧', 'emoji:🔷', 'emoji:🦋', 'emoji:🌈', 'emoji:🧙', 'emoji:💧', 'emoji:👑'], boss: '🫧' },
  { name: '市場',   normal: ['shape:slimePink', 'emoji:🥬', 'emoji:🛢️', 'shape:slimeMatcha', 'emoji:🔪', 'emoji:🪙', 'emoji:🥒', 'emoji:💋', 'emoji:👺'], boss: '👁️' },
  { name: '船',     normal: ['emoji:🐟', 'emoji:🦀', 'emoji:🔷', 'emoji:🪼', 'emoji:💧', 'emoji:🦞', 'emoji:🪖', 'emoji:🐧', 'emoji:🌈'], boss: '🐲' },
  { name: '遺跡',   normal: ['emoji:💀', 'emoji:🧟', 'emoji:👻', 'emoji:⚫', 'emoji:🌑', 'emoji:👾', 'emoji:🛡️', 'emoji:🐲', 'emoji:🐉'], boss: '⚔️' },
  { name: '魔塔',   normal: ['emoji:🌑', 'emoji:🧛', 'emoji:💋', 'emoji:🗡️', 'emoji:🛡️', 'emoji:🦖', 'emoji:🐲', 'emoji:🌈', 'emoji:🐉'], boss: '😈' },
];
const LATE_BOSSES = ['👹', '🦖', '⚰️', '💀']; // 100ステージ以降はボスの顔ぶれを広げて巡回
function getStageZone(stage) { return STAGE_ZONES[Math.floor((Math.max(1, stage) - 1) / 10) % STAGE_ZONES.length]; }
function getStageEnemyKey(stage) { // そのステージの通常の敵（削除中なら同じエリアの次の敵）
  const z = getStageZone(stage), i = (Math.max(1, stage) - 1) % 10;
  for (let k = 0; k < z.normal.length; k++) { const key = z.normal[(i + k) % z.normal.length]; if (!isEnemyRemoved(key)) return key; }
  return z.normal[i % z.normal.length];
}
function getStageBossEmoji(stage) {
  const n = Math.floor((Math.max(10, stage) - 1) / 10);
  const list = n < STAGE_ZONES.length ? [getStageZone(stage).boss] : [...STAGE_ZONES.map(z => z.boss), ...LATE_BOSSES].slice(n % (STAGE_ZONES.length + LATE_BOSSES.length));
  const all = [...list, ...BOSS_EMOJIS];
  return all.find(e => !isEnemyRemoved('boss:' + e)) || all[0];
}
function getStageAddEmojis(stage) { // 雑魚の増援も同じエリアの顔ぶれから
  const list = getStageZone(stage).normal.filter(k => k.startsWith('emoji:') && !isEnemyRemoved(k)).map(k => k.slice(6));
  return list.length ? list : EMOJI_ENEMIES;
}
function farSpawnPoint(maxR) {
  const pl = balls.find(x => isMainPlayerBall(x));
  const px = pl ? pl.x : arena.x - arena.radius * 0.3, py = pl ? pl.y : arena.y;
  let best = { x: arena.x, y: arena.y }, bd = -1;
  for (let i = 0; i < 16; i++) {
    const a = Math.random() * Math.PI * 2, r = arena.radius * maxR * Math.sqrt(0.35 + Math.random() * 0.65);
    const x = arena.x + Math.cos(a) * r, y = arena.y + Math.sin(a) * r;
    const d = (x - px) ** 2 + (y - py) ** 2;
    if (d > bd) { bd = d; best = { x, y }; }
  }
  return best;
}
function farSpawnPointFrom(from, maxR) {
  let best = { x: arena.x, y: arena.y }, bd = -1;
  for (let i = 0; i < 16; i++) {
    const a = Math.random() * Math.PI * 2, r = arena.radius * maxR * Math.sqrt(Math.random());
    const x = arena.x + Math.cos(a) * r, y = arena.y + Math.sin(a) * r;
    const d = from ? (x - from.x) ** 2 + (y - from.y) ** 2 : 0;
    if (d > bd) { bd = d; best = { x, y }; }
  }
  return best;
}
// スライム級（小さくて丸い）の雑魚。大群ステージではこれ以外の雑魚を大きめに出す
const SLIME_CLASS_EMOJIS = new Set(['👾', '👑', '⚫', '🩶', '🩷', '🔷', '🪙', '🟩', '🥈', '🌈', '🟨', '🦒', '🥬', '🧙', '🪖']);
function makeAddEnemy(mainEnemy) {
  const angle = Math.random() * Math.PI * 2;
  const pool = game.skipChallenge ? EMOJI_ENEMIES : getStageAddEmojis(game.stage);
  const emoji = pool[Math.floor(Math.random() * pool.length)];
  const spot = farSpawnPoint(0.75);
  return {
    isPlayer: false, isAdd: true,
    x: spot.x + (Math.random() - 0.5) * 30, y: spot.y + (Math.random() - 0.5) * 30,
    vx: Math.cos(angle) * 3.4, vy: Math.sin(angle) * 3.4,
    radius: isSwarmStage(game.stage) && !SLIME_CLASS_EMOJIS.has(emoji) ? 15 : 11, maxHp: Math.max(6, Math.round(mainEnemy.maxHp * 0.18)), hp: Math.max(6, Math.round(mainEnemy.maxHp * 0.18)),
    atk: Math.max(1, Math.round(mainEnemy.atk * 0.4)),
    color: '#ff9d4f', glow: 'rgba(255,157,79,0.5)', shape: 'emoji', emoji,
    movementStyle: pickEnemyMovementStyle(game.stage),
    zigzagTimer: Math.random() * 40,
    orbitAngle: angle, orbitRadius: arena.radius * (0.35 + Math.random() * 0.25),
    orbitSpeed: (0.02 + Math.random() * 0.02) * (Math.random() < 0.5 ? 1 : -1),
    hitCooldown: 0
  };
}
function makeClone(x, y) {
  const b = computeBonuses();
  const speed = 3.2 * b.speedMult;
  const angle = Math.random() * Math.PI * 2;
  return {
    isPlayer: true, isClone: true, x, y,
    vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
    radius: 10, maxHp: 1, hp: 1, atk: getPlayerAtk(),
    color: '#86c5ff', glow: 'rgba(134,197,255,0.5)', hitCooldown: 0
  };
}

const COMPANION_COLORS = { paladin: '#ffe9a8', dragoon: '#9fd0ff', summoner: '#b8f5c8', alchemist: '#c4f06a', gunner: '#ffcf7a', pirate: '#e0584f', heroine: '#cfe4ff', mage: '#b48cff', ranger: '#6fd36f', warrior: '#d9a35a', cat: '#ffb46b', knight: '#ffb14f', archer: '#7ee787', witch: '#c792ea', sprite: '#64e8ff', golem: '#b0a58f', monk: '#ff8a5c', bard: '#ffd76b', ninja: '#8a7dff', priest: '#fff4b8', dragon: '#ff4f7b', lumber: '#c98b4f', thief: '#ff6b6b', lancer: '#6fa8ff', samurai: '#e05a6a', sage: '#5a8cff', angel: '#fff0a0' };
const COMPANION_MOVEMENT = {
  paladin: { style: 'guard', speedFactor: 0.85 }, dragoon: { style: 'hunter', speedFactor: 1.2 }, summoner: { style: 'kite', speedFactor: 1 }, alchemist: { style: 'kite', speedFactor: 0.95 }, gunner: { style: 'kite', speedFactor: 1 }, pirate: { style: 'hunter', speedFactor: 1.1 },
  heroine: { style: 'guard', speedFactor: 0.9 }, mage: { style: 'kite', speedFactor: 1 }, ranger: { style: 'kite', speedFactor: 1.1 }, warrior: { style: 'guard', speedFactor: 0.85 }, cat: { style: 'hop', speedFactor: 1.2 },
  knight: { style: 'guard', speedFactor: 0.8 },
  archer: { style: 'kite', speedFactor: 1.1 },
  witch:  { style: 'flutter', speedFactor: 0.9 },
  sprite: { style: 'flutter', speedFactor: 1.5 },
  golem:  { style: 'guard', speedFactor: 0.55 },
  monk:   { style: 'hop', speedFactor: 1.3 },
  bard:   { style: 'escort', speedFactor: 1 },
  ninja:  { style: 'hunter', speedFactor: 1.6 },
  priest: { style: 'escort', speedFactor: 0.8 },
  dragon: { style: 'swoop', speedFactor: 1.2 },
  lumber: { style: 'hop', speedFactor: 0.8 },
  thief:  { style: 'zigzag', speedFactor: 1.7 },
  lancer: { style: 'hunter', speedFactor: 1.1 },
  samurai:{ style: 'hunter', speedFactor: 1.3 },
  sage:   { style: 'kite', speedFactor: 0.9 },
  angel:  { style: 'escort', speedFactor: 1.1 }
};
const CUSTOM_COMPANION_STYLES = { guard: 1, hunter: 1, kite: 1, hop: 1, flutter: 1, escort: 1, swoop: 1 };
function steerBall(ball, dvx, dvy, turn) { ball.vx += (dvx - ball.vx) * turn; ball.vy += (dvy - ball.vy) * turn; }
function steerToward(ball, tx, ty, speed, turn) {
  const dx = tx - ball.x, dy = ty - ball.y, d = Math.hypot(dx, dy) || 1;
  steerBall(ball, dx / d * speed, dy / d * speed, turn);
  return d;
}
function moveCompanionCustom(ball, speedMult, player, enemy) {
  const style = ball.movementStyle;
  if (!CUSTOM_COMPANION_STYLES[style]) return false;
  const base = WALK_SPEED * 1.1 * (ball.speedFactor || 1);
  const turn = Math.min(1, WALK_TURN * 1.2 * speedMult);
  ball.moveT = (ball.moveT || Math.random() * 300) + speedMult;
  const t = ball.moveT;
  const hasEnemy = enemy && !enemy.isDying;
  if (style === 'guard') {
    if (player && hasEnemy) {
      const tx = player.x + (enemy.x - player.x) * 0.45, ty = player.y + (enemy.y - player.y) * 0.45;
      const d = steerToward(ball, tx, ty, base, turn);
      if (d < 12) steerToward(ball, enemy.x, enemy.y, base * 0.8, turn * 0.5);
    } else if (player) steerToward(ball, player.x, player.y, base * 0.6, turn);
  } else if (style === 'hunter') {
    const dashing = (t % 140) < 22;
    if (hasEnemy) steerToward(ball, enemy.x, enemy.y, base * (dashing ? 2.4 : 1), dashing ? turn * 2 : turn);
  } else if (style === 'kite') {
    if (hasEnemy) {
      const dx = ball.x - enemy.x, dy = ball.y - enemy.y, d = Math.hypot(dx, dy) || 1;
      const want = arena.radius * 0.55;
      const radial = (want - d) / want; // 近すぎれば離れ、遠すぎれば近づく
      const side = Math.sin(t / 90) > 0 ? 1 : -1;
      steerBall(ball, (dx / d * radial * 1.6 - dy / d * side) * base, (dy / d * radial * 1.6 + dx / d * side) * base, turn);
    }
  } else if (style === 'hop') {
    const phase = t % 80;
    if (phase < 18 && hasEnemy) {
      if (phase < speedMult + 0.01 || !ball.hopAimed) {
        const dx = enemy.x - ball.x, dy = enemy.y - ball.y, d = Math.hypot(dx, dy) || 1;
        ball.vx = dx / d * base * 2.6; ball.vy = dy / d * base * 2.6; ball.hopAimed = true;
      }
    } else {
      ball.hopAimed = false;
      ball.vx *= Math.pow(0.9, speedMult); ball.vy *= Math.pow(0.9, speedMult);
    }
  } else if (style === 'flutter') {
    if (hasEnemy && Math.random() < 0.02 * speedMult) steerToward(ball, enemy.x, enemy.y, base, 0.5);
    const sp = Math.hypot(ball.vx, ball.vy) || 1;
    const nx = ball.vx / sp, ny = ball.vy / sp;
    const wob = Math.cos(t / 9) * 1.8;
    ball.x += -ny * wob * speedMult; ball.y += nx * wob * speedMult;
    normalizeSpeed(ball, base);
  } else if (style === 'escort') {
    if (player) {
      const ang = t * 0.035 * (ball.speedFactor || 1) + (ball.escortOffset ??= Math.random() * Math.PI * 2);
      const R = player.radius + 38;
      steerToward(ball, player.x + Math.cos(ang) * R, player.y + Math.sin(ang) * R, base * 1.4, turn * 1.5);
    }
  } else if (style === 'swoop') {
    const diving = (t % 260) < 45;
    if (diving && hasEnemy) steerToward(ball, enemy.x, enemy.y, base * 2.2, turn * 1.5);
    else {
      const ang = t * 0.02;
      const R = arena.radius * 0.6;
      steerToward(ball, arena.x + Math.cos(ang) * R, arena.y + Math.sin(ang) * R, base, turn);
    }
  }
  applySeparation(ball, speedMult);
  ball.x += ball.vx * speedMult;
  ball.y += ball.vy * speedMult;
  wallBounce(ball);
  return true;
}
const COMPANION_RADIUS = { golem: 16, dragon: 15 };
const COMPANION_SPRITE_MIN_RADIUS = 16; // ドット絵の描画サイズの下限（自機と同じ）
const COMPANION_AWAKEN_MAX = 5;
const COMPANION_AWAKEN_BONUS = 0.2; // 覚醒1段階ごとに攻撃力・HP +20%
function getCompanionAwaken(id) { return (game.companions.awaken && game.companions.awaken[id]) || 0; }
function getCompanionPower(id) { return 1 + COMPANION_AWAKEN_BONUS * getCompanionAwaken(id); }
function getCompanionMaxHP(id) {
  if (!COMPANIONS[id]) return 0;
  const c = COMPANIONS[id];
  const level = game.companions.level[id] || 0;
  const baseBonus = c.baseBonus + level * c.perLevel;
  const playerMaxHP = getPlayerMaxHP();
  const boost = computeBonuses().companionHpMult; // 遺物「守護の護符」・進化「守護の欠片」
  return Math.round(playerMaxHP * baseBonus * 0.8 * getCompanionPower(id) * (id === 'golem' ? GOLEM_HP_MULT : 1) * boost);
}
function getCompanionBaseAtk(id) {
  const level = game.companions.level[id] || 0;
  const inspire = 1 + BARD_ATK_BONUS * getCompanionCount('bard');
  const boost = computeBonuses().companionAtkMult; // 遺物「絆の軍旗」・進化「絆の欠片」
  return Math.max(1, Math.round(getPlayerAtk() * (0.3 + level * 0.05) * getCompanionPower(id) * inspire * boost));
}
function getCompanionAtk(id) {
  if (id !== 'dragon') return getCompanionBaseAtk(id);
  let total = getCompanionBaseAtk('dragon');
  for (const other of COMPANION_IDS) {
    if (other !== 'dragon') total += getCompanionBaseAtk(other) * getCompanionCount(other);
  }
  return total;
}

function makeCompanionBall(id) {
  const c = COMPANIONS[id];
  const level = game.companions.level[id] || 0;
  const angle = Math.random() * Math.PI * 2;
  const dist = Math.random() * arena.radius * 0.5;
  const move = COMPANION_MOVEMENT[id] || { style: 'normal', speedFactor: 1 };
  const speed = 3.2 * move.speedFactor;
  const maxHP = getCompanionBallMaxHP(id);
  return {
    isPlayer: true, isCompanion: true, companionId: id,
    x: arena.x + Math.cos(angle) * dist, y: arena.y + Math.sin(angle) * dist,
    vx: Math.cos(angle + 1.4) * speed, vy: Math.sin(angle + 1.4) * speed,
    radius: COMPANION_RADIUS[id] || 11, atk: getCompanionBallAtk(id),
    hp: maxHP, maxHp: maxHP,
    color: COMPANION_COLORS[id] || '#ffffff', glow: (COMPANION_COLORS[id] || '#ffffff') + '88',
    icon: c.icon, hitCooldown: 0,
    movementStyle: move.style, speedFactor: move.speedFactor,
    zigzagTimer: Math.random() * 30,
    orbitAngle: angle, orbitRadius: arena.radius * (0.3 + Math.random() * 0.15),
    orbitSpeed: (0.03 + Math.random() * 0.015) * (Math.random() < 0.5 ? 1 : -1)
  };
}
function getCompanionBallAtk(id) { return getCompanionAtk(id) * Math.max(1, getCompanionCount(id)); }
function getCompanionBallMaxHP(id) { return getCompanionMaxHP(id) * Math.max(1, getCompanionCount(id)); }
function makeCompanionBalls() {
  return Object.keys(COMPANIONS).filter(id => getCompanionCount(id) > 0).map(id => makeCompanionBall(id));
}
function spawnBattleBalls() {
  return [makeBall(true), makeBall(false), ...makeCompanionBalls()];
}
function refreshCompanionBalls() {
  for (const ball of balls) {
    if (!ball.isCompanion) continue;
    ball.atk = getCompanionBallAtk(ball.companionId);
    const maxHP = getCompanionBallMaxHP(ball.companionId);
    ball.maxHp = maxHP;
    if (game.companions.alive[ball.companionId]) {
      ball.hp = maxHP;
    }
  }
}

function refreshPlayerBallStats(healFull) {
  const p = balls.find(b => b.isPlayer && !b.isClone && !b.isCompanion);
  if (!p) return;
  const newMax = getPlayerMaxHP();
  if (healFull) p.hp = newMax;
  else p.hp = Math.min(newMax, p.hp + (newMax - p.maxHp > 0 ? newMax - p.maxHp : 0));
  p.maxHp = newMax;
  p.atk = getPlayerAtk();
}

function normalizeSpeed(ball, targetSpeed) {
  const s = Math.hypot(ball.vx, ball.vy);
  if (s === 0) return;
  ball.vx = (ball.vx / s) * targetSpeed;
  ball.vy = (ball.vy / s) * targetSpeed;
}

function spawnDamageText(x, y, text, color, decay, big) { damageTexts.push({ x, y, text, color, life: 1, vy: -0.45, decay: (decay || 0.018) * 0.45, big: !!big }); } // 小さめの文字で長めに残す

const CRIT_CHANCE = 0.05; // 基本発生率 5%（アーティファクト「鷹の眼」で上昇）
const CRIT_MULT = 2;     // 基本ダメージ 2倍（アーティファクト「会心の牙」で上昇）
function bossDamageMult(target) { return target && target.isBoss ? 1 + computeBonuses().bossDmg : 1; }
function rollCrit(dmg, target, extraCritChance = 0) {
  dmg = Math.max(1, Math.round(dmg * bossDamageMult(target)));
  const b = computeBonuses();
  const crit = Math.random() < CRIT_CHANCE + b.critChance + extraCritChance;
  return { dmg: crit ? Math.round(dmg * (CRIT_MULT + b.critMultBonus)) : dmg, crit };
}
const ENEMY_CRIT_CHANCE = 0.05; // 発生率 5%
const BOSS_CRIT_CHANCE = 0.15;  // ボスの発生率 15%
const BOSS_CRIT_MULT = 2;       // ボスのダメージ 2倍
const ENEMY_CRIT_MULT = 1.5;    // ダメージ 1.5倍
function rollEnemyCrit(attacker, dmg) {
  const crit = Math.random() < (attacker.isBoss ? BOSS_CRIT_CHANCE : ENEMY_CRIT_CHANCE);
  const mult = attacker.isBoss ? BOSS_CRIT_MULT : ENEMY_CRIT_MULT;
  return { dmg: crit ? Math.round(dmg * mult) : dmg, crit };
}
const PLAYER_BASE_ACCURACY = 0.95;
const PLAYER_BASE_EVASION = 0.05;
const ENEMY_ACCURACY = 0.95, ENEMY_EVASION = 0.05;
const BOSS_ACCURACY = 1.0, BOSS_EVASION = 0.10;
const MIN_HIT_CHANCE = 0.2; // 回避を積んでも無敵にはならない
const ENEMY_HIT_EVA_PER_STAGE = 0.002; // ステージごとに敵の命中率・回避率が +0.2%
const ENEMY_HIT_EVA_STAGE_CAP = 0.25;  // ステージによる上昇は最大 +25%（ステージ126で到達）
function getEnemyStageBonus() { return Math.min(ENEMY_HIT_EVA_STAGE_CAP, (game.stage - 1) * ENEMY_HIT_EVA_PER_STAGE); }
function getEnemyAccuracy(enemy) { return (enemy.isBoss ? BOSS_ACCURACY : ENEMY_ACCURACY) + getEnemyStageBonus(); }
function getEnemyEvasion(enemy) { return (enemy.isBoss ? BOSS_EVASION : ENEMY_EVASION) + getEnemyStageBonus(); }
function getPlayerAccuracy() { return PLAYER_BASE_ACCURACY + computeBonuses().accuracy; }
function getPlayerEvasion() { return PLAYER_BASE_EVASION + computeBonuses().evasion; }
function hitChance(accuracy, evasion) { return Math.min(1, Math.max(MIN_HIT_CHANCE, accuracy - evasion)); }
function playerAttackHits(target) {
  return Math.random() < hitChance(getPlayerAccuracy(), getEnemyEvasion(target));
}
function enemyAttackHits(attacker) {
  return Math.random() < hitChance(getEnemyAccuracy(attacker), getPlayerEvasion());
}
const PLAYER_BASE_CLASH = 10;
const ENEMY_BASE_CLASH = 10;
const ENEMY_CLASH_PER_STAGE = 0.01;   // ステージごとに敵の迫り合い +1%
const BOSS_CLASH_MULT = 1.3;          // ボスは1.3倍
function getPlayerClash() { return PLAYER_BASE_CLASH * (1 + 0.1 * (game.upgrades.clash || 0)); }
function getEnemyClash(enemy) {
  return ENEMY_BASE_CLASH * (1 + (game.stage - 1) * ENEMY_CLASH_PER_STAGE) * (enemy && enemy.isBoss ? BOSS_CLASH_MULT : 1);
}
function getClashWinChance(enemy) {
  const pc = getPlayerClash(), ec = getEnemyClash(enemy);
  return pc / (pc + ec);
}
function spawnMissText(target) {
  spawnDamageText(target.x, target.y - target.radius - 8, 'MISS', '#9aa0b4');
  playMissSound();
}
function playEvadeSound() { // 剣で弾く「カキーン！」：金属の響き（倍音がずれた高い音）と打ち合う瞬間のカチッ
  if (!audioCtx || isBattleSfxMuted()) return;
  filteredNoise(0, 0.03, 0.35, 5000, 0.8, 'highpass');
  [[1950, 0.16], [2870, 0.11], [4130, 0.08], [5480, 0.05]].forEach(([f, a], k) => thump(f, f * 0.985, 0.55 - k * 0.08, a, 'sine'));
}
function spawnEvadeText(target) {
  spawnDamageText(target.x, target.y - target.radius - 8, currentLang === 'en' ? 'EVADE!' : '回避！', '#7ee7ff');
  spawnHitParticles(target.x, target.y, '#7ee7ff');
  playEvadeSound();
}

const gameTabPage = document.querySelector('.tab-page[data-tab="game"]');
function shakeScreen() {
  gameTabPage.classList.remove('screen-shake');
  wrap.classList.remove('crit-flash');
  void gameTabPage.offsetWidth;
  gameTabPage.classList.add('screen-shake');
  wrap.classList.add('crit-flash');
  vibrate([70, 40, 110]);
}
gameTabPage.addEventListener('animationend', ev => { if (ev.animationName === 'screenShake') gameTabPage.classList.remove('screen-shake'); });
function shakeScreenLight() {
  gameTabPage.classList.remove('screen-shake-light');
  void gameTabPage.offsetWidth;
  gameTabPage.classList.add('screen-shake-light');
}
gameTabPage.addEventListener('animationend', ev => { if (ev.animationName === 'screenShakeLight') gameTabPage.classList.remove('screen-shake-light'); });
wrap.addEventListener('animationend', ev => { if (ev.animationName === 'critFlash') wrap.classList.remove('crit-flash'); });
const BLOOD_DRAIN_RATE = 0.5;
function bloodDrain(attacker, dmg) {
  if (!attacker || attacker.shape !== 'slimeBlood' || attacker.isDying || attacker.hp <= 0 || !(dmg > 0)) return;
  const heal = Math.min(attacker.maxHp - attacker.hp, Math.max(1, Math.round(dmg * BLOOD_DRAIN_RATE)));
  if (heal <= 0) return;
  attacker.hp += heal;
  spawnDamageText(attacker.x, attacker.y - attacker.radius - 20, '🩸吸血 +' + heal, '#ff4d6d', 0.02);
  spawnHitParticles(attacker.x, attacker.y, '#c8102e');
  updateHPUI();
}
function spawnReceivedDamageText(target, dmg, crit, attacker) {
  if (target) target.hurtAt = Date.now();
  bloodDrain(attacker, dmg);
  spawnBlood(target.x, target.y, 8);
  const y = target.y - target.radius - 8;
  if (!crit) { spawnDamageText(target.x, y, String(dmg), '#ffb3b3'); return; }
  spawnDamageText(target.x, y - 6, (currentLang === 'en' ? 'CRITICAL!' : 'クリティカル！') + '\n' + dmg, '#ff3b4a', 0.014, true);
  spawnHitParticles(target.x, target.y, '#ff3b4a');
  spawnHitParticles(target.x, target.y, '#ff9aa5');
  playEnemyCritSound();
  if (attacker && attacker.isBoss) shakeScreen();
}
function spawnAttackDamageText(target, dmg, crit, color, offsetY) {
  { const pl = balls.find(isMainPlayerBall); if (pl) pl.hitAt = Date.now(); }
  const y = target.y - target.radius - (offsetY || 8);
  if (!crit) { spawnDamageText(target.x, y, String(dmg), color); return; }
  spawnDamageText(target.x, y - 6, (currentLang === 'en' ? 'CRITICAL!' : 'クリティカル！') + '\n' + dmg, '#ff7a3d', 0.014, true);
  spawnHitParticles(target.x, target.y, '#ff7a3d');
  spawnHitParticles(target.x, target.y, '#ffd76b');
  playCritSound();
}
function spawnBlood(x, y, n = 14) { // ドットの血しぶき：四角い粒が飛び散って落ちる
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.6, sp = 1.5 + Math.random() * 3;
    particles.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, g: 0.18, life: 1, decay: 0.03, blood: 3 + (Math.random() * 3 | 0), color: ['#c8102e', '#8a0a1f', '#ff3b4a'][i % 3] });
  }
}
function spawnHitParticles(x, y, color) {
  for (let i = 0; i < 8; i++) {
    const angle = Math.random() * Math.PI * 2;
    const spd = 1 + Math.random() * 2.5;
    particles.push({ x, y, vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd, life: 1, color });
  }
}

function spawnTapMarker(x, y) {
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    particles.push({ x: x + Math.cos(a) * 10, y: y + Math.sin(a) * 10, vx: Math.cos(a) * 0.6, vy: Math.sin(a) * 0.6, life: 0.8, color: '#4fa8ff', decay: 0.05 });
  }
}
function spawnCoinBurst(x, y, coinGain, count = 9) {
  spawnCoinDrop(x, y, coinGain, count);
  spawnDamageText(x, y - 20, '+' + formatCoinNumber(coinGain) + ' 🟡', '#ffd76b', 0.006);
  for (let i = 0; i < count; i++) setTimeout(() => playCoinChime(i), i * 45);
}
const COIN_CHIME_SCALE = [1046.5, 1174.7, 1318.5, 1568, 1760];
function playCoinChime(step) {
  if (activeTabCache !== 'game') return; // ゲーム画面以外では鳴らさない（遅れて鳴る音も含む）
  const f = COIN_CHIME_SCALE[step % COIN_CHIME_SCALE.length] * Math.pow(2, Math.min(2, Math.floor(step / COIN_CHIME_SCALE.length)));
  playTone(f, 0.06, 'square', 0.05);
  setTimeout(() => playTone(f * 1.5, 0.12, 'sine', 0.05), 30); // 余韻の「リン」
}
let coinAbsorbStep = 0, coinAbsorbLastAt = 0; // 吸い込み時の連鎖音階（間が空いたら最初の音に戻る）
const COIN_GRAVITY = 0.32;
function spawnCoinDrop(x, y, value, count) {
  const n = Math.max(1, count);
  for (let i = 0; i < n; i++) {
    const v = value / n;
    coinDisplayHold += v;
    coinFx.push({
      x, y, vx: (Math.random() - 0.5) * 5, vy: -3.5 - Math.random() * 3,
      ground: y + 22 + Math.random() * 38, bounces: 0, phase: 'fly', wait: 30 + i * 12, t: 0, value: v, spin: Math.random() * 6, // wait：1枚ずつ順番に飛んでいく
    });
  }
}
// コインの噴水：大量のコインを噴き上げてからヘッダーへ回収（3択パワーアップの「コインの山」など）
function spawnCoinFountain(x, y, value, count = 48) {
  for (let i = 0; i < count; i++) {
    const v = value / count, a = -Math.PI / 2 + (Math.random() - 0.5) * 1.8, sp = 4 + Math.random() * 5;
    coinDisplayHold += v;
    coinFx.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, ground: y + 30 + Math.random() * 60, bounces: 0, phase: 'fly', wait: 40 + i * 3, t: 0, value: v, spin: Math.random() * 6 });
  }
  spawnDamageText(x, y - 40, '💰 +' + formatCoinNumber(value) + ' 🟡', '#ffd76b', 0.006, true);
  shakeScreenLight();
  for (let i = 0; i < 16; i++) setTimeout(() => playCoinChime(i), i * 40);
}
function getCoinTargetInArena() {
  const rect = canvas.getBoundingClientRect();
  const el = headerCoinsEl.parentElement.getBoundingClientRect();
  if (rect.width < 10 || !size) return null;
  const k = rect.width / size;
  return { x: (el.left + 10 - rect.left) / k, y: (el.top + el.height / 2 - rect.top) / k };
}
function releaseCoin(c) {
  coinDisplayHold = Math.max(0, coinDisplayHold - c.value);
  headerCoinsEl.textContent = formatCoinNumber(Math.max(0, game.coins - coinDisplayHold));
  const pill = headerCoinsEl.parentElement;
  pill.classList.remove('coin-pulse'); void pill.offsetWidth; pill.classList.add('coin-pulse');
}
function updateCoinFx() {
  if (!coinFx.length) return;
  const target = getCoinTargetInArena();
  if (!target) { coinFx.forEach(releaseCoin); coinFx = []; return; } // ゲーム画面が見えていなければすぐ加算
  let arrived = 0;
  for (const c of coinFx) {
    c.spin += 0.25;
    if (c.phase === 'fly') {
      c.vy += COIN_GRAVITY; c.x += c.vx; c.y += c.vy;
      if (c.y >= c.ground && c.vy > 0) { // 地面でトントン跳ねる
        c.y = c.ground; c.vy *= -0.45; c.vx *= 0.65; c.bounces++;
        if (c.bounces <= 2 && Math.random() < 0.5) playTone(1500 + Math.random() * 400, 0.03, 'triangle', 0.04);
        if (Math.abs(c.vy) < 1 || c.bounces >= 3) { c.phase = 'rest'; c.vy = 0; }
      }
    } else if (c.phase === 'rest') {
      if (--c.wait <= 0) { c.phase = 'home'; c.sx = c.x; c.sy = c.y; c.t = 0; }
    } else if (c.phase === 'home') {
      c.t = Math.min(1, c.t + 0.02); // 約0.8秒かけてゆっくり飛んでいく
      const e = c.t < 0.5 ? 2 * c.t * c.t : 1 - Math.pow(-2 * c.t + 2, 2) / 2; // ゆっくり動き出して、最後はなめらかに吸い込まれる
      const mx = (c.sx + target.x) / 2, my = Math.min(c.sy, target.y) - 60; // 少し弧を描く
      const u = 1 - e;
      c.x = u * u * c.sx + 2 * u * e * mx + e * e * target.x;
      c.y = u * u * c.sy + 2 * u * e * my + e * e * target.y;
      if (c.t >= 1) { c.done = true; releaseCoin(c); arrived++; }
    }
  }
  for (let i = 0; i < arrived; i++) {
    const now = Date.now();
    if (now - coinAbsorbLastAt > 700) coinAbsorbStep = 0;
    coinAbsorbLastAt = now;
    playCoinChime(coinAbsorbStep++);
  }
  coinFx = coinFx.filter(c => !c.done);
}
function drawCoinFx() {
  for (const c of coinFx) {
    const r = 6.5;
    const sx = Math.max(0.25, Math.abs(Math.cos(c.spin))); // くるくる回って見えるよう横幅を変える
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.scale(sx, 1);
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = '#ffcf3d'; ctx.fill();
    ctx.lineWidth = 1.5; ctx.strokeStyle = '#b8860b'; ctx.stroke();
    ctx.beginPath(); ctx.arc(-1.8, -1.8, r * 0.38, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.fill();
    ctx.restore();
  }
}

// ステージの障害物（岩の柱）：ステージごとに配置が決まる。キャラは跳ね返り、敵の弾は遮られる
let obstacles = [], obstacleStage = -1, crateShards = [];
const CRATE_HP = 6, EGG_HP = 4, ROCK_HP = 16; // 岩は16回当てると砕けて宝箱
const EGG_MONSTERS = ['🐉', '🦖', '🐲', '💀', '🧛', '🌑']; // 卵から出てくるやばい敵 // 木箱の耐久（跳ね返り1回＝1、引っ張り攻撃＝2）
function stageRand(seed) { let x = seed * 9301 + 49297; return () => { x = (x * 9301 + 49297) % 233280; return x / 233280; }; }
function setupObstacles() {
  obstacleStage = game.stage + (game.skipChallenge ? 0.5 : 0);
  obstacles = [];
  const zone = Math.floor((Math.max(1, game.stage) - 1) / 10); // 配置は10ステージのエリアごとに固定（ステージごとには変えない）
  const rnd = stageRand(zone * 7 + 3), half = arena.radius;
  const n = 2 + Math.floor(rnd() * 3); // 2〜4個
  for (let tries = 0; obstacles.length < n && tries < 60; tries++) {
    const r = half * (0.09 + rnd() * 0.06);
    const x = arena.x + (rnd() * 2 - 1) * half * 0.72, y = arena.y + (rnd() * 2 - 1) * half * 0.72;
    if (Math.hypot(x - arena.x, y - arena.y) < half * 0.22) continue; // 真ん中は空ける
    if (obstacles.some(o => Math.hypot(o.x - x, o.y - y) < o.r + r + half * 0.22)) continue; // 間を通り抜けられるように
    const k = rnd(), kind = k < 0.35 ? 'rock' : k < 0.57 ? 'crate' : k < 0.75 ? 'bumper' : k < 0.87 ? 'egg' : 'qbox'; // 岩・木箱（壊せる）・バンパー（加速して弾く）・卵（割れると何かが出てくる）
    obstacles.push({ x, y, r: kind === 'bumper' ? r * 0.85 : r, seed: rnd(), kind, hp: kind === 'egg' ? EGG_HP : kind === 'rock' ? ROCK_HP : CRATE_HP, cracks: [] });
  }
}
let obstacleHalf = 0;
function tickObstacles() { if (obstacleStage !== game.stage + (game.skipChallenge ? 0.5 : 0) || obstacleHalf !== arena.radius) { obstacleHalf = arena.radius; setupObstacles(); } } // ステージが変わる・画面サイズが変わると配置し直す
function obstacleHit(x, y, r) { return obstacles.find(o => Math.hypot(x - o.x, y - o.y) < o.r + r) || null; }
function obstacleBounce(ball) {
  for (const o of obstacles) {
    const dx = ball.x - o.x, dy = ball.y - o.y, d = Math.hypot(dx, dy) || 1, min = o.r + ball.radius * 0.8;
    if (d >= min) continue;
    if (ball.isGiant && !ball.isPlayer && !o.broken) { smashObstacle(o); continue; } // 激デカボスは障害物を壊して突き進む
    const nx = dx / d, ny = dy / d;
    ball.x = o.x + nx * min; ball.y = o.y + ny * min;
    const dot = ball.vx * nx + ball.vy * ny;
    if (dot < 0) { ball.vx -= 2 * dot * nx; ball.vy -= 2 * dot * ny; }
    if (ball.kbx || ball.kby) { const kd = ball.kbx * nx + ball.kby * ny; if (kd < 0) { ball.kbx -= 2 * kd * nx; ball.kby -= 2 * kd * ny; } }
    const now = Date.now(), hard = dot < -0.6 && now - (ball.wallSoundAt || 0) > 150;
    if (o.kind === 'qbox' && !o.used && isMainPlayerBall(ball)) { openQBox(o); continue; } // ハテナボックス：自キャラが当たると中身が飛び出す
    if (dot < -0.6 && isMainPlayerBall(ball)) game.totalBounces = (game.totalBounces || 0) + 1; // 障害物での反射も数える
    if (o.kind === 'bumper') { // バンパー：勢いを増して弾き返す
      const sp = Math.hypot(ball.vx, ball.vy) || 1, boost = Math.min(14, Math.max(sp * 1.3, 6));
      ball.vx = ball.vx / sp * boost; ball.vy = ball.vy / sp * boost;
      if (isMainPlayerBall(ball) && holdRush && holdRush.shot) holdRush.speed = Math.min(16, holdRush.speed / 0.72 * 1.1); // 摩擦の減速を打ち消して加速
      o.flash = now;
      if (hard) { ball.wallSoundAt = now; thump(520, 900, 0.12, 0.08, 'square'); thump(260, 180, 0.15, 0.06, 'sine'); }
    } else if ((o.kind === 'crate' || o.kind === 'egg') && (dot < -0.6 || (isMainPlayerBall(ball) && rushingNow)) && now - (o.hitAt || 0) > 250) { // 木箱：誰かが跳ね返るたびに傷み、3回で壊れる（引っ張り攻撃は一撃2回分）
      o.hitAt = now; o.hp -= isMainPlayerBall(ball) && rushingNow ? 2 : 1; o.shakeAt = now;
      { // ぶつかった側からひびが1本増える
        const ang = Math.atan2(ball.y - o.y, ball.x - o.x), h = o.r * 0.9, pts = [[o.x + Math.cos(ang) * h * 0.9, o.y + Math.sin(ang) * h * 0.9]];
        for (let k = 1; k <= 3; k++) { const a2 = ang + Math.PI + (Math.random() - 0.5) * 1.6, l = h * 0.3 * k; pts.push([pts[0][0] + Math.cos(a2) * l + (Math.random() - 0.5) * 4, pts[0][1] + Math.sin(a2) * l + (Math.random() - 0.5) * 4]); }
        o.cracks.push(pts.map(([px, py]) => [px - o.x, py - o.y]));
      }
      const egg = o.kind === 'egg';
      spawnHitParticles(o.x, o.y, egg ? '#fff4d8' : '#c8955a');
      if (egg) { thump(900, 600, 0.06, 0.08, 'triangle'); filteredNoise(0, 0.05, 0.2, 3000, 2); } // ピキッ
      else { thump(160, 90, 0.12, 0.12, 'triangle'); filteredNoise(0, 0.08, 0.15, 900, 1.2); }
      if (o.hp <= 0 && egg) { hatchEgg(o); }
      else if (o.hp <= 0) {
        o.broken = true;
        for (let i = 0; i < 14; i++) { // 砕け散る板切れ
          const a2 = Math.random() * Math.PI * 2, sp = 2 + Math.random() * 4;
          crateShards.push({ x: o.x + (Math.random() - 0.5) * o.r, y: o.y + (Math.random() - 0.5) * o.r, vx: Math.cos(a2) * sp, vy: Math.sin(a2) * sp - 2, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.5, w: 4 + Math.random() * o.r * 0.6, h: 3 + Math.random() * 3, life: 1, col: Math.random() < 0.5 ? '#b07a42' : '#8a5a2c' });
        }
        for (let i = 0; i < 3; i++) spawnHitParticles(o.x + (Math.random() - 0.5) * o.r, o.y + (Math.random() - 0.5) * o.r, i ? '#a0703c' : '#e0b070');
        shakeScreenLight(); thump(120, 50, 0.25, 0.3);
        const r = Math.random(); // 中身：超たまに激レア宝箱、たまにコイン、たいていはスカ
        if (r < 0.03) { spawnDamageText(o.x, o.y - 10, '🌈 激レア宝箱！！', '#ffd76b', 0.012, true); dropTreasureChest('legendary'); }
        else if (r < 0.3) { const coins = Math.round(getEnemyStats(game.stage).hp * 0.6 + 10); game.coins += coins; spawnDamageText(o.x, o.y - 10, '+' + formatCoinNumber(coins) + ' 🟡', '#ffd76b', 0.016, true); playTone(1568, 0.12, 'square', 0.06, 2093); }
        else { spawnDamageText(o.x, o.y - 10, 'スカ…', '#9aa0b4', 0.02); playTone(220, 0.18, 'triangle', 0.06, 150); }
        playNoiseBurst(0.25, 0.2); updateStatsUI();
      }
    } else if (o.kind === 'rock' && dot < -0.6 && now - (o.hitAt || 0) > 120) { // 岩：誰が当たっても1ずつ削れ、16回で砕ける
      o.hitAt = now; o.hp--; o.shakeAt = now;
      if (hard) { ball.wallSoundAt = now; thump(ball.isPlayer ? 300 : 200, 120, 0.09, 0.08, 'triangle'); }
      if (o.hp % 4 === 0 && o.hp > 0) { const a = Math.random() * Math.PI * 2; o.cracks.push([[Math.cos(a) * o.r * 0.9, Math.sin(a) * o.r * 0.9], [Math.cos(a + 0.4) * o.r * 0.4, Math.sin(a + 0.4) * o.r * 0.4], [Math.cos(a + 2.5) * o.r * 0.3, Math.sin(a + 2.5) * o.r * 0.3]]); spawnHitParticles(o.x, o.y, '#9a9288'); }
      if (o.hp <= 0) {
        o.broken = true;
        for (let i = 0; i < 18; i++) { const a2 = Math.random() * Math.PI * 2, sp = 2 + Math.random() * 4.5; crateShards.push({ x: o.x + (Math.random() - 0.5) * o.r, y: o.y + (Math.random() - 0.5) * o.r, vx: Math.cos(a2) * sp, vy: Math.sin(a2) * sp - 2, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.5, w: 4 + Math.random() * o.r * 0.5, h: 4 + Math.random() * 5, life: 1, col: i % 2 ? '#8d867b' : '#5d574f' }); }
        thump(80, 30, 0.4, 0.45); playNoiseBurst(0.35, 0.3); shakeScreenLight();
        let r = Math.random() * 100; const rar = ['rare', 'epic', 'legendary'].find((k, i) => (r -= [55, 35, 10][i]) < 0) || 'rare';
        spawnDamageText(o.x, o.y - 14, '🪨💥 岩が砕けた！ 宝箱！', '#ffd76b', 0.012, true);
        dropTreasureChest(rar);
      }
    } else if (hard) { ball.wallSoundAt = now; thump(ball.isPlayer ? 300 : 200, 120, 0.09, 0.08, 'triangle'); }
  }
  if (obstacles.some(o => o.broken)) obstacles = obstacles.filter(o => !o.broken);
}
// ハテナボックス：1回当たると中身が出て、空箱（ただの硬いブロック）になる
function openQBox(o) {
  o.used = true; o.popAt = Date.now();
  playTone(988, 0.07, 'square', 0.08); setTimeout(() => playTone(1319, 0.2, 'square', 0.08), 70); // ピコーン
  const r = Math.random(), x = o.x, y = o.y - o.r - 10;
  if (r < 0.05) { spawnDamageText(x, y, '🌈 激レア宝箱！！', '#ffd76b', 0.012, true); dropTreasureChest('legendary'); }
  else if (r < 0.2) { spawnDamageText(x, y, '🎁 宝箱！', '#7fd6ff', 0.016, true); dropTreasureChest('rare'); }
  else if (r < 0.55) { const coins = Math.round(getEnemyStats(game.stage).hp * 1.2 + 20); game.coins += coins; spawnCoinBurst(o.x, o.y - o.r, coins, 6); spawnDamageText(x, y, '+' + formatCoinNumber(coins) + ' 🟡', '#ffd76b', 0.016, true); }
  else if (r < 0.8) { spawnExpGems(o.x, o.y - o.r, 18); spawnDamageText(x, y, '💎 経験値ザクザク！', '#7ee7ff', 0.016, true); }
  else { const pl = balls.find(isMainPlayerBall); if (pl) { const h = Math.round(pl.maxHp * 0.25); pl.hp = Math.min(pl.maxHp, pl.hp + h); spawnDamageText(x, y, `💚 HP +${h}`, '#5fe0a8', 0.016, true); playHealSound(); updateHPUI(); } }
  spawnHitParticles(o.x, o.y - o.r, '#ffd76b'); updateStatsUI();
}
function smashObstacle(o) { // 激デカボスに踏みつぶされて粉々になる
  if (o.kind === 'egg') { hatchEgg(o); return; }
  o.broken = true;
  const cols = o.kind === 'crate' ? ['#b07a42', '#8a5a2c'] : o.kind === 'bumper' ? ['#ff5cb8', '#ffd2f0'] : ['#8d867b', '#5d574f'];
  for (let i = 0; i < 16; i++) { const a = Math.random() * Math.PI * 2, sp = 2.5 + Math.random() * 4.5; crateShards.push({ x: o.x + (Math.random() - 0.5) * o.r, y: o.y + (Math.random() - 0.5) * o.r, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 2, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.5, w: 4 + Math.random() * o.r * 0.5, h: 3 + Math.random() * 5, life: 1, col: cols[i % 2] }); }
  spawnDamageText(o.x, o.y - 14, 'ドガァン！', '#ff9f43', 0.02, true);
  thump(90, 35, 0.4, 0.5); playNoiseBurst(0.35, 0.3); shakeScreen();
}
// 卵が割れる：たいていはやばい敵が飛び出す（倒すまで次のステージに進めない）。たまに宝箱
function hatchEgg(o) {
  o.broken = true;
  for (let i = 0; i < 12; i++) { const a2 = Math.random() * Math.PI * 2, sp = 2 + Math.random() * 3.5; crateShards.push({ x: o.x, y: o.y, vx: Math.cos(a2) * sp, vy: Math.sin(a2) * sp - 2, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.5, w: 4 + Math.random() * 6, h: 3 + Math.random() * 4, life: 1, col: Math.random() < 0.5 ? '#fff4d8' : '#e8d8b0' }); }
  thump(700, 300, 0.12, 0.15, 'square'); playNoiseBurst(0.2, 0.18);
  const main = balls.find(b => !b.isPlayer && !b.isDying);
  if (Math.random() < 0.3 || !main) { spawnDamageText(o.x, o.y - 14, '🥚 中から宝箱！', '#ffd76b', 0.016, true); dropTreasureChest(); return; }
  const m = makeAddEnemy(main);
  m.emoji = EGG_MONSTERS[Math.floor(Math.random() * EGG_MONSTERS.length)]; m.shape = 'emoji';
  m.x = o.x; m.y = o.y; m.radius = 19;
  m.maxHp = m.hp = Math.max(30, Math.round(main.maxHp * 0.7)); m.atk = Math.max(2, Math.round(main.atk * 1.1));
  m.isSplit = true; m.eggMonster = true;
  adds.push(m);
  spawnDamageText(o.x, o.y - 20, '🥚💥 やばいのが出てきた！', '#ff4f6d', 0.012, true);
  shakeScreen(); playWarningSound();
}
const crateImg = new Image(); crateImg.src = 'assets/img/ui/crate.webp';
function drawObstacles() {
  const now = Date.now();
  for (const sh of crateShards) { // 飛び散った板切れ
    sh.x += sh.vx; sh.y += sh.vy; sh.vy += 0.25; sh.vx *= 0.97; sh.rot += sh.vr; sh.life -= 0.025;
    ctx.save(); ctx.globalAlpha = Math.max(0, sh.life); ctx.translate(sh.x, sh.y); ctx.rotate(sh.rot);
    ctx.fillStyle = sh.col; ctx.fillRect(-sh.w / 2, -sh.h / 2, sh.w, sh.h); ctx.strokeStyle = '#4a2e12'; ctx.lineWidth = 0.8; ctx.strokeRect(-sh.w / 2, -sh.h / 2, sh.w, sh.h);
    ctx.restore();
  }
  crateShards = crateShards.filter(sh => sh.life > 0);
  for (const o of obstacles) {
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(o.x + 3, o.y + o.r * 0.55, o.r * 1.05, o.r * 0.5, 0, 0, Math.PI * 2); ctx.fill(); // 影
    if (o.kind === 'crate') { // 木箱（ひびが増える）
      const h = o.r * 0.9, sk = now - (o.shakeAt || 0) < 160 ? (Math.random() - 0.5) * 4 : 0; // 当たった瞬間ぐらつく
      ctx.translate(sk, 0);
      if (crateImg.complete && crateImg.naturalWidth) { ctx.imageSmoothingEnabled = false; ctx.drawImage(crateImg, o.x - h * 1.15, o.y - h * 1.2, h * 2.3, h * 2.3); ctx.imageSmoothingEnabled = true; } // UI素材の木箱
      else {
        ctx.fillStyle = '#b07a42'; ctx.fillRect(o.x - h, o.y - h, h * 2, h * 2);
        ctx.strokeStyle = '#5e3c1c'; ctx.lineWidth = 2.5; ctx.strokeRect(o.x - h, o.y - h, h * 2, h * 2);
        ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(o.x - h, o.y - h); ctx.lineTo(o.x + h, o.y + h); ctx.moveTo(o.x + h, o.y - h); ctx.lineTo(o.x - h, o.y + h); ctx.stroke();
        ctx.fillStyle = 'rgba(255,230,180,0.25)'; ctx.fillRect(o.x - h, o.y - h, h * 2, h * 0.35);
      }
      if (o.cracks && o.cracks.length) { // 傷はぶつけるたびに増える
        ctx.save(); ctx.beginPath(); ctx.rect(o.x - h, o.y - h, h * 2, h * 2); ctx.clip();
        ctx.strokeStyle = '#2b1a0a'; ctx.lineWidth = 1.6; ctx.lineJoin = 'round';
        for (const c of o.cracks) { ctx.beginPath(); c.forEach(([px, py], k) => k ? ctx.lineTo(o.x + px, o.y + py) : ctx.moveTo(o.x + px, o.y + py)); ctx.stroke(); }
        ctx.fillStyle = `rgba(30,15,5,${Math.min(0.35, (CRATE_HP - o.hp) * 0.06)})`; ctx.fillRect(o.x - h, o.y - h, h * 2, h * 2); // 傷むほど暗く
        ctx.restore();
      }
    } else if (o.kind === 'qbox') { // ハテナボックス（叩くと少し跳ねる。使ったら茶色の空箱）
      const pop = now - (o.popAt || 0) < 200 ? -Math.sin((now - o.popAt) / 200 * Math.PI) * 6 : 0, h = o.r * 0.9, bob = o.used ? 0 : Math.sin(now / 300 + o.seed * 6) * 1.5;
      ctx.translate(0, pop + bob);
      ctx.fillStyle = o.used ? '#8a5a2c' : '#ffbf1f'; ctx.fillRect(o.x - h, o.y - h, h * 2, h * 2);
      ctx.strokeStyle = o.used ? '#4a2e12' : '#a8560a'; ctx.lineWidth = 2.5; ctx.strokeRect(o.x - h, o.y - h, h * 2, h * 2);
      ctx.fillStyle = o.used ? '#5e3c1c' : '#a8560a'; [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => { ctx.beginPath(); ctx.arc(o.x + sx * h * 0.72, o.y + sy * h * 0.72, 1.6, 0, Math.PI * 2); ctx.fill(); }); // 鋲
      if (!o.used) { ctx.font = `900 ${Math.round(h * 1.5)}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#7a3a00'; ctx.fillText('?', o.x + 1.5, o.y + 2.5); ctx.fillStyle = '#fff6d0'; ctx.fillText('?', o.x, o.y + 1); }
    } else if (o.kind === 'egg') { // 卵（ひびが増え、割れそうになると震える）
      const wob = o.hp <= 1 ? Math.sin(now / 40) * 0.12 : now - (o.shakeAt || 0) < 200 ? Math.sin(now / 25) * 0.15 : 0;
      ctx.translate(o.x, o.y + o.r * 0.9); ctx.rotate(wob); ctx.translate(-o.x, -(o.y + o.r * 0.9));
      const g = ctx.createRadialGradient(o.x - o.r * 0.3, o.y - o.r * 0.5, o.r * 0.1, o.x, o.y, o.r * 1.2);
      g.addColorStop(0, '#ffffff'); g.addColorStop(0.7, '#f3e6c4'); g.addColorStop(1, '#c9b48a');
      ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(o.x, o.y - o.r * 0.1, o.r * 0.82, o.r * 1.05, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#8a7650'; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.fillStyle = '#9c6fd0'; [[-0.3, -0.4, 0.14], [0.25, 0.05, 0.18], [-0.15, 0.45, 0.12], [0.35, -0.55, 0.1]].forEach(([dx, dy, rr]) => { ctx.beginPath(); ctx.arc(o.x + dx * o.r, o.y + dy * o.r, rr * o.r, 0, Math.PI * 2); ctx.fill(); }); // 怪しい模様
      if (o.cracks && o.cracks.length) { ctx.strokeStyle = '#3a2a10'; ctx.lineWidth = 1.6; for (const c of o.cracks) { ctx.beginPath(); c.forEach(([px, py], k) => k ? ctx.lineTo(o.x + px * 0.8, o.y + py * 0.9) : ctx.moveTo(o.x + px * 0.8, o.y + py * 0.9)); ctx.stroke(); } }
    } else if (o.kind === 'bumper') { // バンパー（当たると光る）
      const lit = now - (o.flash || 0) < 180;
      const g = ctx.createRadialGradient(o.x - o.r * 0.3, o.y - o.r * 0.3, o.r * 0.1, o.x, o.y, o.r);
      g.addColorStop(0, lit ? '#ffffff' : '#ffd2f0'); g.addColorStop(0.55, lit ? '#ffe36b' : '#ff5cb8'); g.addColorStop(1, '#a0186e');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(o.x, o.y, o.r * (lit ? 1.08 : 1), 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = lit ? '#fff6a0' : '#ffe0f4'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(o.x, o.y, o.r * 0.62, 0, Math.PI * 2); ctx.stroke();
      if (lit) { ctx.shadowColor = '#ffe36b'; ctx.shadowBlur = 16; ctx.stroke(); }
    } else { // 岩
      const g = ctx.createRadialGradient(o.x - o.r * 0.35, o.y - o.r * 0.4, o.r * 0.1, o.x, o.y, o.r);
      g.addColorStop(0, '#b9b2a6'); g.addColorStop(0.6, '#7d766c'); g.addColorStop(1, '#4b463f');
      ctx.fillStyle = g; ctx.beginPath();
      for (let i = 0; i <= 10; i++) { const a = i / 10 * Math.PI * 2, rr = o.r * (0.92 + 0.08 * Math.sin(i * 2.7 + o.seed * 20)); i ? ctx.lineTo(o.x + Math.cos(a) * rr, o.y + Math.sin(a) * rr) : ctx.moveTo(o.x + Math.cos(a) * rr, o.y + Math.sin(a) * rr); }
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgba(40,36,30,0.8)'; ctx.lineWidth = 2; ctx.stroke();
      ctx.strokeStyle = 'rgba(40,36,30,0.5)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(o.x - o.r * 0.2, o.y - o.r * 0.5); ctx.lineTo(o.x + o.r * 0.05, o.y - o.r * 0.1); ctx.lineTo(o.x - o.r * 0.1, o.y + o.r * 0.3); ctx.stroke();
      if (o.cracks && o.cracks.length) { ctx.strokeStyle = '#2a2520'; ctx.lineWidth = 2; for (const c of o.cracks) { ctx.beginPath(); c.forEach(([px, py], k) => k ? ctx.lineTo(o.x + px, o.y + py) : ctx.moveTo(o.x + px, o.y + py)); ctx.stroke(); } } // 4回ごとにひびが増える
    }
    ctx.restore();
  }
}
function wallBounce(ball) {
  obstacleBounce(ball);
  const w = arenaWallHit(ball);
  if (w) {
    const { nx, ny } = w;
    const dot = ball.vx * nx + ball.vy * ny;
    if (dot <= 0) return; // 既に内向きなら反射しない（壁際で反射が往復して音が連続するのを防ぐ）
    ball.vx -= 2 * dot * nx;
    ball.vy -= 2 * dot * ny;
    const now = Date.now();
    if (dot > 0.6 && now - (ball.wallSoundAt || 0) > 150) { ball.wallSoundAt = now; if (ball.isPlayer) playPlayerWallSound(); else playEnemyWallSound(); }
    if (ball.isPlayer && !ball.isClone && !ball.isCompanion) { ball.lastWallAt = now; applyBounceReward(); if (dot > 0.6) game.totalBounces = (game.totalBounces || 0) + 1; } // 戦歴の反射回数
  }
}

function applyBounceReward() {
  const b = computeBonuses();
  if (b.bounceCoinCount <= 0) return;
  game.coins += 0.5 * b.bounceCoinCount * b.coinMult * b.bounceMult;
  updateStatsUI();
}

const HIT_KNOCK_SPEED = 7, HIT_KNOCK_DECAY = 0.86;
function applyHitKnock(ball, nx, ny) {
  if (ball.isDying || Math.hypot(ball.kbx || 0, ball.kby || 0) > HIT_KNOCK_SPEED * 0.5) return; // 同じ当たりで重ねがけしない
  const k = HIT_KNOCK_SPEED * (ball.isBoss ? 0.4 : ball.isPlayer && !isMainPlayerBall(ball) ? 0.7 : 1);
  ball.kbx = nx * k; ball.kby = ny * k;
}
function moveHitKnock(ball, speedMult) {
  if (!ball.kbx && !ball.kby) return;
  ball.x += ball.kbx * speedMult; ball.y += ball.kby * speedMult;
  obstacleBounce(ball);
  const w = arenaWallHit(ball);
  if (w) { // 壁に当たったら押し出しも跳ね返す
    const { nx, ny } = w;
    const dot = ball.kbx * nx + ball.kby * ny;
    if (dot > 0) { ball.kbx -= 2 * dot * nx; ball.kby -= 2 * dot * ny; }
  }
  const f = Math.pow(HIT_KNOCK_DECAY, speedMult);
  ball.kbx *= f; ball.kby *= f;
  if (Math.hypot(ball.kbx, ball.kby) < 0.15) ball.kbx = ball.kby = 0;
}
function resolveBallCollision(a, b) {
  const dx = b.x - a.x, dy = b.y - a.y;
  let dist = Math.hypot(dx, dy);
  const minDist = a.radius + b.radius;
  if (dist >= minDist) return false;
  if (dist === 0) dist = 0.01;
  const nx = dx / dist, ny = dy / dist;
  const overlap = minDist - dist;
  a.x -= nx * overlap / 2; a.y -= ny * overlap / 2;
  b.x += nx * overlap / 2; b.y += ny * overlap / 2;
  const rvx = b.vx - a.vx, rvy = b.vy - a.vy;
  const velAlongNormal = rvx * nx + rvy * ny;
  if (velAlongNormal < 0) {
    a.vx += velAlongNormal * nx; a.vy += velAlongNormal * ny;
    b.vx -= velAlongNormal * nx; b.vy -= velAlongNormal * ny;
  }
  if (PLAYER_BOUNCE_MODE && isMainPlayerBall(a)) { a.seekPoint = null; a.missBounces = 0; }
  if (PLAYER_BOUNCE_MODE && isMainPlayerBall(b)) { b.seekPoint = null; b.missBounces = 0; }
  if (PLAYER_BOUNCE_MODE && isMainPlayerBall(a)) { const d = a.vx * nx + a.vy * ny; if (d > 0) { a.vx -= 2 * d * nx; a.vy -= 2 * d * ny; } }
  if (PLAYER_BOUNCE_MODE && isMainPlayerBall(b)) { const d = b.vx * nx + b.vy * ny; if (d < 0) { b.vx -= 2 * d * nx; b.vy -= 2 * d * ny; } }
  if (a.isPlayer !== b.isPlayer) { applyHitKnock(a, -nx, -ny); applyHitKnock(b, nx, ny); } // 攻撃がぶつかったら両者とも大きめに跳ね返る
  return true;
}

function triggerEnemyDefeat(enemy, sourceX, sourceY) {
  if (enemySurvivesDefeat(enemy)) return; // 回転ガード・分裂で生き残った
  lastKillPos = { x: enemy.x, y: enemy.y };
  recordBestiaryKill(enemy);
  enemy.hp = 0;
  enemy.isDying = true;
  const dx = enemy.x - sourceX, dy = enemy.y - sourceY;
  const dist = Math.hypot(dx, dy) || 1;
  enemy.vx = (dx / dist) * KNOCKBACK_SPEED;
  enemy.vy = (dy / dist) * KNOCKBACK_SPEED;
  enemy.shakeTimer = KNOCKBACK_SHAKE_FRAMES;
  hitStopFrames = KILL_HITSTOP_DURATION;
  startFlyout(enemy);
}

function movePlayerSideBalls(list, speedMult, b) {
  const moveCtxPlayer = balls.find(x => isMainPlayerBall(x));
  const moveCtxEnemy = balls.find(x => !x.isPlayer && !x.isDying);
  for (const ball of list) {
    if (ball.isDying) continue; // 撃破されて吹っ飛び中の敵は updateFlyouts で動かす（壁で跳ね返らない）
    moveHitKnock(ball, speedMult);
    if (ball.isCompanion && ball.hp <= 0) { // 倒れた仲間は動かない（画面からも消える。蘇生されたら復帰）
      if (game.companions.alive[ball.companionId]) { game.companions.alive[ball.companionId] = false; game.companions.hp[ball.companionId] = 0; }
      continue;
    }
    if (!ball.isPlayer && (isDisabled(ball) || ball.traitFreeze)) { // 麻痺・眠り中・溜め／詠唱中の敵はその場で動けない
      if (ball.hitCooldown > 0) ball.hitCooldown -= speedMult;
      continue;
    }
    if (ball.dashing) { // 突進中はまっすぐ高速で進む
      ball.x += ball.vx * speedMult; ball.y += ball.vy * speedMult;
      wallBounce(ball);
      if (ball.hitCooldown > 0) ball.hitCooldown -= speedMult;
      continue;
    }
    if (ball.isCompanion && moveCompanionCustom(ball, speedMult, moveCtxPlayer, moveCtxEnemy)) {
      if (ball.hitCooldown > 0) ball.hitCooldown -= speedMult;
      continue;
    }
    if (isMainPlayerBall(ball) && isRampage()) { // 乱舞中は敵から敵へ斬りかかる
      moveRampage(ball, speedMult);
      if (ball.hitCooldown > 0) ball.hitCooldown -= speedMult;
      continue;
    }
    if (isMainPlayerBall(ball) && tickRushGauge()) { // 離したら敵へ突撃
      moveHoldRush(ball, speedMult);
      if (ball.hitCooldown > 0) ball.hitCooldown -= speedMult;
      continue;
    }
    if (isMainPlayerBall(ball) && playerDrag) { // ドラッグ中は指（カーソル）の少し上を追いかける
      dragMainPlayer(ball, speedMult, b);
      if (ball.hitCooldown > 0) ball.hitCooldown -= speedMult;
      continue;
    }
    if (isMainPlayerBall(ball) && isTackling()) { // タメ体当たり中は敵へ一直線
      steerTackle(ball);
      ball.x += ball.vx * speedMult; ball.y += ball.vy * speedMult;
      wallBounce(ball);
      if (ball.hitCooldown > 0) ball.hitCooldown -= speedMult;
      continue;
    }
    walkBall(ball, speedMult, b);
    if (ball.hitCooldown > 0) ball.hitCooldown -= speedMult;
  }
}
const WALK_SPEED = 1.5;   // 基本の歩く速さ（px/フレーム・ゲーム速度1倍）
const WALK_TURN = 0.06;   // 向き・速さの変わりやすさ（小さいほどゆったり）
function nearestOf(ball, list) {
  let best = null, bd = Infinity;
  for (const c of list) { const d = (c.x - ball.x) ** 2 + (c.y - ball.y) ** 2; if (d < bd) { bd = d; best = c; } }
  return best;
}
function applySeparation(ball, speedMult) {
  const group = ball.isPlayer ? balls : [...balls, ...adds];
  for (const o of group) {
    if (o === ball || o.isPlayer !== ball.isPlayer || o.isDying || (o.isCompanion && o.hp <= 0)) continue;
    const dx = ball.x - o.x, dy = ball.y - o.y, d = Math.hypot(dx, dy) || 0.01;
    const space = ball.radius + o.radius + 14;
    if (d < space) {
      const push = (space - d) / space * 0.5 * speedMult;
      ball.vx += dx / d * push; ball.vy += dy / d * push;
    }
  }
}
const PLAYER_BOUNCE_MODE = true;
const BOUNCE_SPEED = 2.4; // 反射移動の基本の速さ（px/フレーム・ゲーム速度1倍）
const BOUNCE_MISS_LIMIT = 5; // この回数反射しても敵に当たらなければ追尾に切り替える
function bounceMainPlayer(ball, speedMult, b) {
  const boosted = ball.boostUntil && Date.now() < ball.boostUntil;
  const tap = ball.tapSpeedMult || 1;
  const speed = BOUNCE_SPEED * b.speedMult * tap * (boosted ? BOOST_MULT : 1);
  let cur = Math.hypot(ball.vx, ball.vy);
  if (cur < 0.01) { const ang = Math.random() * Math.PI * 2; ball.vx = Math.cos(ang); ball.vy = Math.sin(ang); cur = 1; }
  const next = cur + (speed - cur) * Math.min(1, 0.08 * speedMult);
  ball.vx = ball.vx / cur * next; ball.vy = ball.vy / cur * next;
  if ((ball.missBounces || 0) >= BOUNCE_MISS_LIMIT) {
    const target = nearestOf(ball, [...balls, ...adds].filter(x => !x.isPlayer && !x.isDying && x.hp > 0));
    ball.seekPoint = target ? { x: target.x, y: target.y } : null;
  }
  if (ball.seekPoint) {
    const dx = ball.seekPoint.x - ball.x, dy = ball.seekPoint.y - ball.y, d = Math.hypot(dx, dy) || 1;
    const k = Math.min(1, 0.18 * speedMult);
    ball.vx += (dx / d * next - ball.vx) * k;
    ball.vy += (dy / d * next - ball.vy) * k;
    const c = Math.hypot(ball.vx, ball.vy) || 1;
    ball.vx = ball.vx / c * next; ball.vy = ball.vy / c * next;
    if ((ball.vx * dx + ball.vy * dy) / (next * d || 1) > 0.995 || d < ball.radius) ball.seekPoint = null;
  }
  if (tap > 1.2) {
    ball.stepDist = (ball.stepDist || 0) + next * speedMult;
    if (ball.stepDist > 26) {
      ball.stepDist = 0;
      const lv = Math.min(1, (tap - 1) / (TAP_ACCEL_MAX - 1));
      playFootstep(0.2 + lv * 0.6, 0.08 + lv * 0.1);
    }
  }
  ball.x += ball.vx * speedMult;
  ball.y += ball.vy * speedMult;
  const pvx = ball.vx, pvy = ball.vy;
  wallBounce(ball);
  if (ball.vx !== pvx || ball.vy !== pvy) {
    ball.missBounces = (ball.missBounces || 0) + 1;
    const target = nearestOf(ball, [...balls, ...adds].filter(x => !x.isPlayer && !x.isDying && x.hp > 0));
    ball.seekPoint = target ? { x: target.x, y: target.y } : null;
  }
}
function walkBall(ball, speedMult, b) {
  if (PLAYER_BOUNCE_MODE && isMainPlayerBall(ball)) { bounceMainPlayer(ball, speedMult, b); return; }
  const w = ball.walk || (ball.walk = { pause: 0, next: 60 + Math.random() * 200 });
  ball.moveT = (ball.moveT || Math.random() * 300) + speedMult;
  const t = ball.moveT;
  const isMain = isMainPlayerBall(ball);
  w.next -= speedMult;
  if (w.pause > 0) w.pause -= speedMult;
  else if (w.next <= 0) { w.pause = 18 + Math.random() * 36; w.next = 160 + Math.random() * 220; }
  let target, speed;
  if (ball.isPlayer) {
    target = nearestOf(ball, [...balls, ...adds].filter(x => !x.isPlayer && !x.isDying && x.hp > 0));
    const boosted = ball.boostUntil && Date.now() < ball.boostUntil;
    speed = WALK_SPEED * (isMain ? b.speedMult * (ball.tapSpeedMult || 1) : (ball.speedFactor || 1)) * (boosted ? BOOST_MULT : 1);
    if (isMain && (ball.tapSpeedMult || 1) > 1) w.pause = 0;
  } else {
    target = nearestOf(ball, balls.filter(x => x.isPlayer && x.hp > 0));
    speed = WALK_SPEED * (ball.isAdd ? 1.1 : ball.isBoss ? 0.85 : 1);
  }
  let dvx = 0, dvy = 0;
  if (target) {
    const dx = target.x - ball.x, dy = target.y - ball.y, d = Math.hypot(dx, dy) || 1;
    const nx = dx / d, ny = dy / d;
    const style = ball.isPlayer ? 'normal' : ball.movementStyle;
    if (style === 'orbit') {
      const lunge = (t % 240) < 50;
      const want = lunge ? 0 : 75;
      const radial = Math.max(-1, Math.min(1, (d - want) / 60));
      const side = ball.orbitSpeed > 0 ? 1 : -1;
      dvx = (nx * radial - ny * side * 0.8) * speed; dvy = (ny * radial + nx * side * 0.8) * speed;
    } else if (style === 'gravity') {
      const hop = (t % 70) < 22 ? 2.2 : 0.15;
      dvx = nx * speed * hop; dvy = ny * speed * hop;
    } else if (style === 'zigzag') {
      const sway = Math.sin(t / 22) * 0.9;
      dvx = (nx - ny * sway) * speed; dvy = (ny + nx * sway) * speed;
    } else {
      const sway = Math.sin(t / 50 + (ball.walkSeed ??= Math.random() * 6)) * 0.25;
      dvx = (nx - ny * sway) * speed; dvy = (ny + nx * sway) * speed;
    }
    if (w.pause > 0 && d > 50) { dvx *= 0.05; dvy *= 0.05; } // 立ち止まり
  } else {
    const ang = (ball.walkSeed ??= Math.random() * 6) + t / 120;
    dvx = Math.cos(ang) * speed * 0.4; dvy = Math.sin(ang) * speed * 0.4;
  }
  const turn = Math.min(1, WALK_TURN * speedMult * (isMain && (ball.tapSpeedMult || 1) > 1 ? 2.5 : 1));
  ball.vx += (dvx - ball.vx) * turn;
  ball.vy += (dvy - ball.vy) * turn;
  applySeparation(ball, speedMult);
  if (isMain && (ball.tapSpeedMult || 1) > 1.2) {
    ball.stepDist = (ball.stepDist || 0) + Math.hypot(ball.vx, ball.vy) * speedMult;
    if (ball.stepDist > 26) {
      ball.stepDist = 0;
      const lv = Math.min(1, ((ball.tapSpeedMult || 1) - 1) / (TAP_ACCEL_MAX - 1));
      playFootstep(0.2 + lv * 0.6, 0.08 + lv * 0.1);
    }
  }
  ball.x += ball.vx * speedMult;
  ball.y += ball.vy * speedMult;
  wallBounce(ball);
}

function updateBarrierOrbs(player, enemy, speedMult, b) {
  if (barrierHits <= 0) {
    if (barrierOrbs.length) barrierOrbs = [];
    return;
  }
  const canDamage = enemy && !enemy.isDying && !(enemy.spawnTimer > 0);
  const comboMult = getComboMultiplier(b.comboGrowth);
  const baseDmg = Math.max(1, Math.round(player.atk * 0.4 * comboMult));
  for (const orb of barrierOrbs) {
    orb.angle += BARRIER_ROT_SPEED * speedMult;
    orb.x = player.x + Math.cos(orb.angle) * BARRIER_ORBIT_RADIUS;
    orb.y = player.y + Math.sin(orb.angle) * BARRIER_ORBIT_RADIUS;
    if (orb.hitCooldown > 0) orb.hitCooldown -= speedMult;
    if (canDamage && orb.hitCooldown <= 0) {
      const dist = Math.hypot(orb.x - enemy.x, orb.y - enemy.y);
      if (dist < enemy.radius + 9) {
        orb.hitCooldown = 18;
        if (!playerAttackHits(enemy)) { spawnMissText(enemy); continue; }
        const { dmg, crit } = rollCrit(baseDmg, enemy);
        enemy.hp -= dmg;
        trackDamage(dmg);
        spawnHitParticles(orb.x, orb.y, getBarrierColors().glow);
        spawnAttackDamageText(enemy, dmg, crit, '#c7ecff');
        onPlayerHitEnemy(enemy, dmg);
        playBarrierHitSound();
        updateHPUI();
        if (enemy.hp <= 0) triggerEnemyDefeat(enemy, orb.x, orb.y);
      }
    }
  }
}

function applyHitKnockback(hitBall, sourceBall, force) {
  const dx = hitBall.x - sourceBall.x, dy = hitBall.y - sourceBall.y;
  const dist = Math.hypot(dx, dy) || 1;
  hitBall.vx += (dx / dist) * force;
  hitBall.vy += (dy / dist) * force;
}
