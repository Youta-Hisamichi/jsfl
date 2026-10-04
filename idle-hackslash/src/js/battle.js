const ENEMY_TRAITS = {
  'emoji:🥬': 'spinGuard', 'emoji:🧙': 'attackMagic', 'emoji:🪖': 'charge', 'emoji:🔪': 'charge', 'emoji:🌑': 'deathMagic', 'emoji:⚫': 'merge', 'emoji:🩶': 'grow', 'emoji:🩷': 'healMagic', 'emoji:🔷': 'split', 'emoji:🦕': 'homing', 'emoji:🟩': 'split', 'emoji:🐟': 'charge', 'emoji:🦒': 'grow', 'emoji:🥒': 'charge', 'emoji:🦎': 'charge', 'emoji:🦀': 'spinGuard', 'emoji:🥈': 'spinGuard', 'emoji:🌈': 'healMagic', 'emoji:🟨': 'split', 'emoji:🦋': 'merge', 'emoji:🔥': 'mines', 'emoji:💋': 'healMagic', 'emoji:🛡️': 'spinGuard', 'emoji:🗡️': 'charge', 'emoji:🪲': 'spinGuard', 'boss:💪': 'grow', 'emoji:🐻': 'berserk', 'emoji:🦞': 'deathMagic', 'emoji:🦫': 'charge', 'boss:👁️': 'attackMagic', 'boss:🕸️': 'homing', 'boss:🪦': 'deathMagic', 'boss:🦍': 'berserk',
  'emoji:🧛': 'healMagic', 'emoji:🌕': 'berserk', 'emoji:⚡': 'grow', 'emoji:💧': 'split', 'boss:⚰️': 'deathMagic', 'boss:⚔️': 'charge', 'boss:🫧': 'megaSlime', 'boss:😈': 'attackMagic',
  'emoji:👑': 'spinGuard', 'emoji:🐧': 'attackMagic', 'emoji:🪼': 'healMagic', 'emoji:🛢️': 'mines', 
  'emoji:👾': 'spinGuard', 'emoji:💀': 'spinGuard',
  'shape:spike': 'split',
  'shape:slimeOrange': 'splitMany', 'shape:slimeGreen': 'splitMany', 'shape:slimeBlood': 'splitMany',
  'shape:slimeChibi': 'jumbo', 'shape:slimeJumbo': 'jumbo',
  'shape:slimeSnowman': 'stack', 'shape:slimeDango': 'stack',
  'shape:square': 'grow',
  'emoji:👻': 'attackMagic', 'boss:💀': 'attackMagic',
  'emoji:🐲': 'homing',
  'emoji:🎃': 'mines',
  'emoji:🦂': 'deathMagic',
  'emoji:🦇': 'merge',
};
const MULTIPLY_TRAITS = new Set(['split', 'splitMany', 'merge', 'stack', 'jumbo']); // 敵が増える特徴
const MULTIPLY_TRAIT_FROM = 20;    // この階層までは分裂・増える系を使ってこない
const MULTIPLY_TRAIT_CHANCE = 0.15; // その特徴を持つ敵が実際に使ってくる確率（デバッグで出した敵はいつも使う）
const ENEMY_TRAIT_DESCS = {
  berserk: 'HPが半分を切るか時間が経つと発狂：動きが速くなり、クリティカルを連発して暴れる。そのかわり受けるダメージが1.5倍（防御ダウン）',
  charge: '溜めてから高速で突進してくる', spinGuard: 'バリア中はダメージを弾く（メタルスライムは常に硬く、ダメージを75%カット）', split: '倒すと分裂する', splitMany: '倒すと2〜3体に分裂する（オレンジ→グリーン→ブラッドの順に大量。ブラッドは攻撃で吸血してHP回復）', grow: '時間とともに巨大化して強くなる',
  attackMagic: '詠唱して火の玉を撃ってくる（魔法封じで止まる）', healMagic: '詠唱してHPを回復する（魔法封じで止まる）', homing: '追尾弾を撃ってくる（魔法封じで止まる）',
  mines: '足元に炎を残す（燃え上がった炎に触れるとダメージ）', deathMagic: '一定確率で即死させる魔法を唱える（魔法封じで止まる）', merge: '近くの雑魚と合体して強くなる', stack: '縦に積み重なっている。HPが減るたびに上から1体ずつ崩れ落ちて、別々に襲ってくる', jumbo: 'チビスライムの群れで現れ、しばらくすると集まってジャンボスライムに合体する（先に倒すほど弱くなる）',
};
const ENEMY_TRAIT_LABELS = { berserk: '発狂', stack: '積み重なり', jumbo: 'ジャンボ合体', charge: '突進', spinGuard: 'バリア', split: '分裂', splitMany: '大分裂', grow: '巨大化', attackMagic: '攻撃魔法', healMagic: '回復魔法', homing: 'ホーミング弾', mines: '炎の罠', deathMagic: '即死魔法', merge: '合体' };
const MAGIC_TRAITS = { attackMagic: 1, healMagic: 1, homing: 1, deathMagic: 1 }; // 魔法封じで止まる特性
const TRAIT_CD = { berserk: [420, 600], charge: [240, 360], spinGuard: [300, 420], attackMagic: [300, 420], healMagic: [360, 480], homing: [260, 380], mines: [240, 330], deathMagic: [480, 600], merge: [200, 280] }; // 次の行動までのフレーム（ゲーム速度1倍）
const SPLIT_TIMES = 2;         // 分裂できる回数
const SPLIT_CONFIG = {
  spike:       { times: 1, children: 1, hpRate: 0.18 }, // 分裂は1回だけ・増えても1〜2体（基本は1対1で戦う）
  slimeOrange: { times: 1, children: 1, hpRate: 0.15 },
  slimeGreen:  { times: 1, children: 2, hpRate: 0.1 },
  slimeBlood:  { times: 1, children: 2, hpRate: 0.08 },
};
function getSplitConfig(enemy) { return SPLIT_CONFIG[enemy.shape] || SPLIT_CONFIG.spike; }
const GROW_PER_HIT = 0.05;     // 被弾1回ごとの巨大化
const GROW_MAX = 1.8;
const SPIN_GUARD_FRAMES = 120; // バリアの長さ
const SPIN_GUARD_CUT = 0.8;    // バリア中の被ダメージ軽減率
const METAL_DAMAGE_CUT = 0.75; // メタルスライムは常に硬い：被ダメージを75%カット（回転ガードとも重なる）
function isMetalEnemy(e) { return !!e && !e.isBoss && !e.isAdd && e.emoji === '👾'; }
function enemyDamageCut(e) { return 1 - (isMetalEnemy(e) ? 1 - METAL_DAMAGE_CUT : 1) * (e.guarding ? 1 - SPIN_GUARD_CUT : 1); }
const ENEMY_DEATH_CHANCE = 0.12;
const METAL_SLIME_COIN_MULT = 8; // メタルスライム撃破時のコイン倍率
const METAL_SLIME_GEM_MIN = 1, METAL_SLIME_GEM_MAX = 3; // メタルスライム撃破時のジェム
const MERGE_MINIONS = 3;
const BERSERK_FRAMES = 360;        // 発狂の長さ（約6秒）
const BERSERK_ATK_MULT = 1.3;      // 発狂中の攻撃力
const BERSERK_CRIT_CHANCE = 0.6;   // 発狂中のクリティカル率
const BERSERK_DMG_TAKEN = 1.5;     // 発狂中に受けるダメージ（防御ダウン）          // 手下がこの数集まると合体
const MERGE_MAX = 6;              // 合体の上限回数
const JUMBO_CHIBIS = 3;           // 一緒に現れるチビスライムの数
const JUMBO_GATHER_FRAMES = 300;  // 現れてからこの時間（ゲーム速度1倍のフレーム）で集まり始める
const JUMBO_HP_PER_CHIBI = 0.45;  // チビ1体を取り込むごとに増える最大HP（元の最大HP比）
const JUMBO_ATK_PER_CHIBI = 0.12; // チビ1体を取り込むごとに増える攻撃力
const STACK_LAYERS = { slimeSnowman: ['slimeIce'], slimeDango: ['slimeMatcha', 'slimeIce'] };
const STACK_CHILD_HP = 0.18; // 崩れ落ちた1体のHP（元の最大HP比）
function updateStackSlime(e) {
  if (!e.stack) {
    e.stack = (STACK_LAYERS[e.shape] || ['slimeIce']).slice();
    e.stackTotal = e.stack.length;
    e.traitBaseRadius = 20; e.radius = 20;
    return;
  }
  while (e.stack.length > 1 && e.hp > 0 && e.hp <= e.maxHp * (e.stack.length - 1) / e.stackTotal) {
    const key = e.stack.pop();
    const c = makeAddEnemy(e);
    c.shape = key; c.emoji = null; c.color = SHAPE_ENEMY_COLORS[key] || e.color; c.glow = e.glow;
    c.radius = 14; c.maxHp = c.hp = Math.max(4, Math.round(e.maxHp * STACK_CHILD_HP));
    c.x = e.x; c.y = e.y - e.radius * 1.4;
    const a = -Math.PI / 2 + (Math.random() - 0.5) * 1.6;
    c.vx = Math.cos(a) * 4; c.vy = Math.sin(a) * 4;
    c.isSplit = true; // 残っている間は次のステージに進まない
    adds.push(c);
    spawnDamageText(e.x, e.y - e.radius * 2.2, 'ポロッ！', SHAPE_ENEMY_COLORS[key] || '#ffffff', 0.016, true);
    spawnHitParticles(e.x, e.y - e.radius, SHAPE_ENEMY_COLORS[key] || '#ffffff');
    playTone(700, 0.12, 'triangle', 0.1, 350);
  }
}
// ボス「超ジャンボスライム」：倒せないミニスライムが叩かれるたびに分裂し、32匹そろうと合体して超ジャンボスライムになる
const MEGA_COUNT = 32, MEGA_INV_HP = 999999, MEGA_HP_MULT = 4, MEGA_ATK_MULT = 1.5, MEGA_RADIUS = 66, MEGA_AUTO_SPLIT = 240;
function makeMegaMini(e, x, y) {
  const c = makeAddEnemy(e);
  c.shape = 'slimeChibi'; c.emoji = null; c.color = '#5cc8ff'; c.glow = 'rgba(92,200,255,0.55)';
  c.radius = 10; c.maxHp = c.hp = MEGA_INV_HP; c.atk = Math.max(1, Math.round(e.megaBaseAtk * 0.25));
  c.megaOwner = e; c.isSplit = true;
  const a = Math.random() * Math.PI * 2;
  c.x = x + Math.cos(a) * 8; c.y = y + Math.sin(a) * 8; c.vx = Math.cos(a) * 4.5; c.vy = Math.sin(a) * 4.5;
  const cp = arenaClampPt(c.x, c.y, 14); c.x = cp.x; c.y = cp.y;
  adds.push(c);
  return c;
}
function updateMegaSlime(e, speedMult) {
  if (!e.megaPhase) {
    e.megaPhase = 'mini'; e.megaBaseHp = e.maxHp; e.megaBaseAtk = e.atk; e.megaTimer = 0;
    e.traitBaseRadius = 12; e.radius = 12; e.baseRadius = 12;
    e.maxHp = e.hp = MEGA_INV_HP; e.traitLastHp = e.hp; e.atk = Math.max(1, Math.round(e.megaBaseAtk * 0.3));
    spawnDamageText(arena.x, arena.y - 50, '倒せないミニスライム…？ 叩くと増える！', '#7fd6ff', 0.01, true);
    updateHPUI();
    return;
  }
  const minis = adds.filter(ad => ad.megaOwner === e && ad.hp > 0);
  if (e.megaPhase === 'mini') {
    const hitList = [];
    if (e.hp < e.maxHp) { hitList.push(e); e.hp = e.maxHp; }
    for (const ad of minis) if (ad.hp < ad.maxHp) { hitList.push(ad); ad.hp = ad.maxHp; }
    e.megaTimer += speedMult;
    if (e.megaTimer >= MEGA_AUTO_SPLIT) { e.megaTimer = 0; hitList.push(minis.length ? minis[Math.floor(Math.random() * minis.length)] : e); } // 放っておいても少しずつ増える
    let count = 1 + minis.length;
    for (const src of hitList) {
      if (count >= MEGA_COUNT) break;
      makeMegaMini(e, src.x, src.y); count++;
      spawnHitParticles(src.x, src.y, '#7fd6ff');
      playTone(420 + count * 22, 0.09, 'sine', 0.09, 700 + count * 30);
      if (count % 8 === 0 || count === 2) spawnDamageText(src.x, src.y - 20, `ぷるん！分裂（${count}/${MEGA_COUNT}）`, '#7fd6ff', 0.014, true);
    }
    if (count >= MEGA_COUNT) {
      e.megaPhase = 'gather'; e.traitFreeze = true; e.vx = e.vy = 0;
      adds.filter(ad => ad.megaOwner === e && ad.hp > 0).forEach(ad => { ad.merging = true; ad.traitFreeze = true; });
      spawnDamageText(e.x, e.y - 40, `${MEGA_COUNT}匹そろった！ 合体するぞ！`, '#b46cff', 0.008, true);
      playTone(300, 0.6, 'sawtooth', 0.1, 900); shakeScreenLight();
    }
    return;
  }
  if (e.megaPhase === 'gather') {
    e.hp = e.maxHp;
    let left = 0;
    for (const ad of minis) {
      left++;
      const dx = e.x - ad.x, dy = e.y - ad.y, dist = Math.hypot(dx, dy) || 1, st = Math.min(dist, 7 * speedMult);
      ad.x += dx / dist * st; ad.y += dy / dist * st;
      if (dist < e.radius + 2) {
        ad.hp = 0; ad.megaOwner = null; left--;
        e.megaMerged = (e.megaMerged || 0) + 1;
        e.radius = e.traitBaseRadius = e.baseRadius = 12 + (MEGA_RADIUS - 12) * Math.min(1, e.megaMerged / (MEGA_COUNT - 1));
        spawnHitParticles(e.x, e.y, '#b46cff');
        playTone(260 + e.megaMerged * 18, 0.1, 'square', 0.06, 500 + e.megaMerged * 25);
      }
    }
    adds = adds.filter(ad => ad.hp > 0);
    if (!left) {
      e.megaPhase = 'mega'; e.traitFreeze = false; e.isGiant = true;
      e.radius = e.traitBaseRadius = e.baseRadius = MEGA_RADIUS;
      e.maxHp = e.hp = Math.round(e.megaBaseHp * MEGA_HP_MULT); e.traitLastHp = e.hp;
      e.atk = Math.round(e.megaBaseAtk * MEGA_ATK_MULT);
      spawnDamageText(e.x, e.y - e.radius - 20, '合体！ 超ジャンボスライム！', '#b46cff', 0.008, true);
      for (let i = 0; i < 4; i++) spawnHitParticles(e.x, e.y, i % 2 ? '#ffffff' : '#b46cff');
      shakeScreen(); playNoiseBurst(0.5, 0.35); thump(90, 35, 0.7, 0.6);
      updateHPUI();
    }
  }
}
function updateJumboSlime(e, speedMult) {
  if (!e.jumboInit) {
    e.jumboInit = true; e.jumboTimer = 0; e.jumboCount = 0; e.jumboBaseHp = e.maxHp; e.jumboBaseAtk = e.atk;
    if (e.shape === 'slimeJumbo') { e.jumboDone = true; return; } // 最初からジャンボ（デバッグ用）
    e.traitBaseRadius = 12; e.radius = 12;
    for (let i = 0; i < JUMBO_CHIBIS; i++) {
      const c = makeAddEnemy(e);
      const a = Math.PI * 2 * i / JUMBO_CHIBIS, r = arena.radius * (0.35 + Math.random() * 0.35);
      c.x = arena.x + Math.cos(a) * r; c.y = arena.y + Math.sin(a) * r;
      c.shape = 'slimeChibi'; c.emoji = null; c.color = e.color; c.glow = e.glow;
      c.radius = 11; c.maxHp = c.hp = Math.max(4, Math.round(e.maxHp * 0.12)); // チビスライム（小さいのが特徴）
      c.chibiOwner = e; c.isSplit = true; // 残っている間は次のステージに進まない
      adds.push(c);
    }
    spawnDamageText(arena.x, arena.y - 50, 'チビスライムの群れだ！', '#7fd6ff', 0.012, true);
    return;
  }
  if (e.jumboDone) return;
  const chibis = adds.filter(ad => ad.chibiOwner === e && ad.hp > 0);
  e.jumboTimer += speedMult;
  if (!e.jumboGathering && e.jumboTimer >= JUMBO_GATHER_FRAMES && chibis.length) {
    e.jumboGathering = true;
    chibis.forEach(ad => { ad.merging = true; ad.traitFreeze = true; });
    spawnDamageText(e.x, e.y - e.radius - 24, '集まれ〜！', '#b46cff', 0.014, true);
    playTone(520, 0.25, 'triangle', 0.12, 880);
  }
  for (const ad of chibis) {
    if (!ad.merging) continue;
    const dx = e.x - ad.x, dy = e.y - ad.y, dist = Math.hypot(dx, dy) || 1;
    const step = Math.min(dist, 6 * speedMult);
    ad.x += dx / dist * step; ad.y += dy / dist * step;
    if (dist < e.radius + 2) {
      ad.hp = 0; ad.chibiOwner = null;
      e.jumboCount++;
      const hpUp = Math.round(e.jumboBaseHp * JUMBO_HP_PER_CHIBI);
      e.maxHp += hpUp; e.hp += hpUp; e.traitLastHp = e.hp;
      e.atk = Math.round(e.jumboBaseAtk * (1 + JUMBO_ATK_PER_CHIBI * e.jumboCount));
      e.traitBaseRadius = Math.min(46, 12 + e.jumboCount * 4); e.radius = e.traitBaseRadius;
      spawnHitParticles(e.x, e.y, '#b46cff');
      playTone(300 + e.jumboCount * 40, 0.12, 'square', 0.08, 600 + e.jumboCount * 60);
      updateHPUI();
    }
  }
  if (e.jumboGathering && !adds.some(ad => ad.chibiOwner === e && ad.hp > 0)) {
    e.jumboDone = true;
    if (e.jumboCount > 0) {
      e.shape = 'slimeJumbo'; e.color = '#b46cff'; e.glow = 'rgba(180,108,255,0.6)';
      spawnDamageText(e.x, e.y - e.radius - 30, `合体！ジャンボスライム（×${e.jumboCount + 1}）`, '#b46cff', 0.01, true);
      for (let i = 0; i < 3; i++) spawnHitParticles(e.x, e.y, i % 2 ? '#ffffff' : '#b46cff');
      shakeScreenLight(); playNoiseBurst(0.35, 0.25);
      updateHPUI();
    }
  }
}
const MAX_FREE_ADDS = 1;          // 通常ステージで同時に出る雑魚の最大数（本体は別。基本は1対1、せいぜい2体）
const SWARM_ADDS = 6;             // 大群ステージの雑魚の数（控えめ）
function isSwarmStage(stage) { return stage >= 30 && stage % 20 === 15; } // 大群ステージ（序盤は無し。35, 55, 75…と20階層ごと） // 敵の即死魔法の成功率（バリアで防げる）
let enemyShots = [];           // 敵の弾（攻撃魔法・ホーミング弾）
let enemyMines = [];           // 敵の炎の罠（カボチャヘッド）
function clearEnemyTraitObjects() { enemyShots = []; enemyMines = []; }
function randTraitCd(trait) { const [lo, hi] = TRAIT_CD[trait] || [300, 400]; return lo + Math.random() * (hi - lo); }
function getEnemyTrait(enemy) {
  if (!enemy || enemy.isPlayer || enemy.isAdd) return null;
  if (enemy.trait === undefined) {
    enemy.trait = ENEMY_TRAITS[getEnemyBookKey(enemy)] || null;
    if (MULTIPLY_TRAITS.has(enemy.trait) && !enemy.isBoss && !enemy.forceTrait && (game.stage <= MULTIPLY_TRAIT_FROM || Math.random() >= MULTIPLY_TRAIT_CHANCE)) enemy.trait = null; // 分裂・増える系は序盤は使わず、それ以降もたまにしか使ってこない
    enemy.traitCd = enemy.trait ? randTraitCd(enemy.trait) * 0.6 : 0;
    enemy.splitsLeft = enemy.trait === 'split' || enemy.trait === 'splitMany' ? getSplitConfig(enemy).times : 0;
    enemy.growScale = 1;
    enemy.traitBaseAtk = enemy.atk;
    enemy.traitLastHp = enemy.hp;
  }
  return enemy.trait;
}
function getTraitBaseRadius(e) { if (!e.traitBaseRadius) e.traitBaseRadius = e.radius; return e.traitBaseRadius; }
function damagePlayerByTrait(a, e, dmg, color) {
  if (a.hp <= 0) return false;
  if (absorbWithBarrier(a)) { updateHPUI(); return false; }
  const { dmg: d, crit } = rollEnemyCrit(e, Math.max(1, Math.round(dmg)));
  a.hp -= d;
  spawnReceivedDamageText(a, d, crit, e);
  spawnHitParticles(a.x, a.y, color || '#ff6b6b');
  playPlayerHitSound();
  updateHPUI();
  return a.hp <= 0;
}
function enemySurvivesDefeat(enemy) {
  const trait = getEnemyTrait(enemy);
  if (!trait) return false;
  if (enemy.megaPhase && enemy.megaPhase !== 'mega') { enemy.hp = enemy.maxHp; return true; } // 合体前のミニスライムは倒せない
  if ((enemy.guarding || isMetalEnemy(enemy)) && enemy.traitLastHp > 0) {
    const lost = enemy.traitLastHp - enemy.hp;
    enemy.hp = enemy.traitLastHp - lost * (1 - enemyDamageCut(enemy));
    enemy.traitLastHp = enemy.hp;
    if (enemy.hp > 0) { spawnDamageText(enemy.x, enemy.y - enemy.radius - 18, enemy.guarding ? 'GUARD' : 'カキン！', '#c7ecff', 0.02); return true; }
  }
  if ((trait === 'split' || trait === 'splitMany') && enemy.splitsLeft > 0) {
    enemy.splitsLeft--;
    const cfg = getSplitConfig(enemy);
    const origMaxHp = enemy.maxHp;
    enemy.maxHp = Math.max(1, Math.ceil(enemy.maxHp * 0.6));
    enemy.hp = enemy.maxHp;
    enemy.traitLastHp = enemy.hp;
    enemy.traitBaseRadius = Math.max(14, getTraitBaseRadius(enemy) * 0.9); // 分裂しても小さくなりすぎない
    enemy.radius = enemy.traitBaseRadius;
    for (let i = 0; i < cfg.children; i++) {
      const child = makeAddEnemy(enemy);
      const ang = Math.PI * 2 * i / cfg.children + Math.random() * 0.5;
      const spd = 3.2 + Math.random() * 1.2;
      child.x = enemy.x + Math.cos(ang) * 6; child.y = enemy.y + Math.sin(ang) * 6;
      if (cfg.children > 1) { child.vx = Math.cos(ang) * spd; child.vy = Math.sin(ang) * spd; }
      child.shape = enemy.shape; child.emoji = enemy.emoji; child.isSplit = true;
      child.color = enemy.color; child.glow = enemy.glow;
      child.maxHp = child.hp = Math.max(4, Math.round(origMaxHp * cfg.hpRate));
      child.radius = Math.max(13, enemy.radius * (cfg.children > 1 ? 0.85 : 0.9));
      adds.push(child);
    }
    spawnDamageText(enemy.x, enemy.y - enemy.radius - 24, cfg.children > 1 ? `${cfg.children + 1}分裂！` : '分裂！', enemy.color || '#7fd6ff', 0.014, true);
    spawnHitParticles(enemy.x, enemy.y, enemy.color || '#7fd6ff');
    playTone(520, 0.2, 'sine', 0.14, 260);
    updateHPUI();
    return true;
  }
  return false;
}
function updateEnemyTraits(a, e, speedMult) {
  let playerDown = false;
  const trait = getEnemyTrait(e);
  if (trait && !e.isDying && !(e.spawnTimer > 0)) {
    if (e.hp < e.traitLastHp) {
      if (e.guarding || isMetalEnemy(e)) {
        const lost = e.traitLastHp - e.hp;
        e.hp += lost * enemyDamageCut(e);
        if (e.guarding) playEnemyBarrierBlockSound();
        if (Math.random() < 0.5) spawnDamageText(e.x, e.y - e.radius - 18, e.guarding ? 'GUARD' : 'カキン！', '#c7ecff', 0.03);
        updateHPUI();
      }
      if (trait === 'grow' && e.growScale < GROW_MAX) {
        e.growScale = Math.min(GROW_MAX, e.growScale + GROW_PER_HIT);
        e.radius = getTraitBaseRadius(e) * e.growScale;
        e.atk = Math.round(e.traitBaseAtk * (1 + (e.growScale - 1) * 0.6));
        updateHPUI();
      }
    } else if (e.hp > e.traitLastHp && e.hp > e.maxHp) e.hp = e.maxHp;
    if (trait === 'grow') getTraitBaseRadius(e);
    const disabled = isDisabled(e);
    if (!disabled) e.traitCd -= speedMult;
    if (e.traitState) e.traitTimer -= speedMult;
    if (trait === 'charge') {
      if (!e.traitState && e.traitCd <= 0) {
        e.traitState = 'windup'; e.traitTimer = 40; e.traitFreeze = true;
        spawnDamageText(e.x, e.y - e.radius - 22, '！', '#ff6b6b', 0.025, true);
      } else if (e.traitState === 'windup' && e.traitTimer <= 0) {
        e.traitState = 'dash'; e.traitTimer = 30; e.traitFreeze = false; e.dashing = true;
        const ang = Math.atan2(a.y - e.y, a.x - e.x);
        e.vx = Math.cos(ang) * 7; e.vy = Math.sin(ang) * 7;
        playTone(180, 0.25, 'sawtooth', 0.14, 90);
      } else if (e.traitState === 'dash' && e.traitTimer <= 0) {
        e.traitState = null; e.dashing = false; e.traitCd = randTraitCd(trait);
      }
    } else if (trait === 'berserk') { // 発狂：速く・クリティカル連発で暴れるが、防御が下がる
      if (!e.traitState && !disabled && (e.traitCd <= 0 || (!e.berserkHalf && e.hp <= e.maxHp * 0.5))) {
        if (e.hp <= e.maxHp * 0.5) e.berserkHalf = true;
        e.traitState = 'berserk'; e.traitTimer = BERSERK_FRAMES; e.berserk = true;
        e.atk = Math.round(e.traitBaseAtk * BERSERK_ATK_MULT);
        spawnDamageText(e.x, e.y - e.radius - 26, '発狂！！', '#ff2a2a', 0.012, true);
        spawnHitParticles(e.x, e.y, '#ff2a2a'); spawnHitParticles(e.x, e.y, '#ff9a3c');
        thump(110, 55, 0.5, 0.45, 'sawtooth'); thump(220, 90, 0.4, 0.25, 'square'); shakeScreen();
      } else if (e.traitState === 'berserk') {
        if (e.traitTimer <= 0) {
          e.traitState = null; e.berserk = false; e.atk = e.traitBaseAtk; e.traitCd = randTraitCd(trait);
          spawnDamageText(e.x, e.y - e.radius - 22, 'ハァ…ハァ…', '#ffb3b3', 0.02);
        } else if (!e.traitFreeze) { // 自機めがけて荒々しく突っ込む
          const ang = Math.atan2(a.y - e.y, a.x - e.x) + (Math.random() - 0.5) * 0.9;
          e.vx += Math.cos(ang) * 0.45 * speedMult; e.vy += Math.sin(ang) * 0.45 * speedMult;
          const sp = Math.hypot(e.vx, e.vy), cap = e.isBoss ? 7 : 8;
          if (sp > cap) { e.vx *= cap / sp; e.vy *= cap / sp; }
          if (Math.random() < 0.25) spawnHitParticles(e.x + (Math.random() - 0.5) * e.radius, e.y + (Math.random() - 0.5) * e.radius, Math.random() < 0.5 ? '#ff2a2a' : '#ff8a3c');
        }
      }
    } else if (trait === 'spinGuard') {
      if (!e.traitState && e.traitCd <= 0) {
        e.traitState = 'guard'; e.traitTimer = SPIN_GUARD_FRAMES; e.guarding = true;
        spawnDamageText(e.x, e.y - e.radius - 22, 'バリア', '#c7ecff', 0.016);
        playEnemyBarrierSound();
      } else if (e.traitState === 'guard' && e.traitTimer <= 0) {
        e.traitState = null; e.guarding = false; e.traitCd = randTraitCd(trait);
      }
    } else if (trait === 'stack') {
      updateStackSlime(e);
    } else if (trait === 'jumbo') {
      updateJumboSlime(e, speedMult);
    } else if (trait === 'megaSlime') {
      updateMegaSlime(e, speedMult);
    } else if (trait === 'merge') {
      const mine = adds.filter(ad => ad.mergeOwner === e && ad.hp > 0);
      if (!mine.some(ad => ad.merging) && e.traitCd <= 0) {
        e.traitCd = randTraitCd(trait);
        if ((e.mergeCount || 0) < MERGE_MAX) {
          if (mine.length >= MERGE_MINIONS - 1) {
            mine.forEach(ad => { ad.merging = true; ad.traitFreeze = true; });
            spawnDamageText(e.x, e.y - e.radius - 22, '集まれ！', '#c792ea', 0.016);
          } else {
            for (let i = 0; i < 1; i++) {
              const m = makeAddEnemy(e);
              m.emoji = e.emoji; m.shape = e.shape; m.radius = 13; m.mergeOwner = e;
              m.x = e.x + (Math.random() - 0.5) * 40; m.y = e.y + (Math.random() - 0.5) * 40;
              adds.push(m);
            }
            spawnDamageText(e.x, e.y - e.radius - 22, '仲間を呼んだ！', '#c792ea', 0.016);
          }
        }
      }
      for (const ad of mine) {
        if (!ad.merging) continue;
        const dx = e.x - ad.x, dy = e.y - ad.y, dist = Math.hypot(dx, dy) || 1;
        const step = Math.min(dist, 7 * speedMult);
        ad.x += dx / dist * step; ad.y += dy / dist * step;
        if (dist < e.radius) {
          ad.hp = 0;
          e.mergeCount = (e.mergeCount || 0) + 1;
          const hpBoost = Math.round(e.maxHp * 0.15);
          e.maxHp += hpBoost; e.hp += hpBoost;
          e.atk = Math.round(e.atk * 1.1);
          e.traitBaseRadius = Math.min(getTraitBaseRadius(e) * 1.06, 40);
          e.radius = e.traitBaseRadius;
          e.traitLastHp = e.hp;
          spawnDamageText(e.x, e.y - e.radius - 24, '合体！', '#c792ea', 0.02, true);
          spawnHitParticles(e.x, e.y, '#c792ea');
          playTone(330, 0.2, 'square', 0.1, 660);
          updateHPUI();
        }
      }
    } else if (MAGIC_TRAITS[trait] || trait === 'mines') {
      const silenced = MAGIC_TRAITS[trait] && isSilenced();
      if (!e.traitState && e.traitCd <= 0) {
        if (silenced || (trait === 'healMagic' && e.hp >= e.maxHp * 0.85)) {
          e.traitCd = 60; // 封じられている／回復不要なら少し待って再判定
        } else if (trait === 'mines') {
          if (enemyMines.length < 5) enemyMines.push({ x: e.x, y: e.y, armIn: 40, life: 720, dmg: e.atk * 1.5, owner: e });
          spawnDamageText(e.x, e.y - e.radius - 18, '🔥', '#ff9f43', 0.03);
          e.traitCd = randTraitCd(trait);
        } else {
          e.traitState = 'cast'; e.traitTimer = trait === 'homing' ? 30 : trait === 'deathMagic' ? 70 : 45; e.traitFreeze = trait !== 'homing';
          const castName = trait === 'attackMagic' ? '🔥 ファイア' : trait === 'healMagic' ? '💚 ヒール' : trait === 'deathMagic' ? '💀 デス' : '🎯 ロックオン';
          spawnDamageText(e.x, e.y - e.radius - 22, castName, trait === 'healMagic' ? '#7ee787' : '#ffb35c', 0.016);
        }
      } else if (e.traitState === 'cast' && e.traitTimer <= 0) {
        e.traitState = null; e.traitFreeze = false; e.traitCd = randTraitCd(trait);
        if (!silenced) {
          if (trait === 'attackMagic') {
            const ang = Math.atan2(a.y - e.y, a.x - e.x);
            enemyShots.push({ x: e.x, y: e.y, vx: Math.cos(ang) * 5, vy: Math.sin(ang) * 5, life: 200, dmg: e.atk * 1.2, magic: true, kind: 'fire', owner: e });
            playTone(300, 0.3, 'sawtooth', 0.12, 600);
          } else if (trait === 'healMagic') {
            const heal = Math.round(e.maxHp * 0.15);
            e.hp = Math.min(e.maxHp, e.hp + heal);
            spawnDamageText(e.x, e.y - e.radius - 30, '+' + heal, '#7ee787', 0.014, true);
            spawnHitParticles(e.x, e.y, '#7ee787');
            playHealSound();
            updateHPUI();
          } else if (trait === 'deathMagic') {
            playTone(110, 0.6, 'sawtooth', 0.16, 55);
            if (a.hp > 0 && Math.random() < ENEMY_DEATH_CHANCE) {
              if (absorbWithBarrier(a)) {
                spawnDamageText(a.x, a.y - a.radius - 22, 'バリアが即死を防いだ！', '#c7ecff', 0.014);
              } else {
                a.hp = 0;
                spawnDamageText(a.x, a.y - a.radius - 22, '💀 即死…', '#b48cff', 0.012, true);
                updateHPUI();
                playerDown = true;
              }
            } else {
              spawnDamageText(a.x, a.y - a.radius - 22, '即死を耐えた！', '#c7ecff', 0.016);
            }
          } else if (trait === 'homing') {
            for (const off of [-0.5, 0.5]) {
              const ang = Math.atan2(a.y - e.y, a.x - e.x) + off;
              enemyShots.push({ x: e.x, y: e.y, vx: Math.cos(ang) * 3.4, vy: Math.sin(ang) * 3.4, life: 200, dmg: e.atk * 0.7, magic: true, homing: true, kind: 'homing', owner: e });
            }
            playTone(1200, 0.15, 'square', 0.1, 600);
          }
        }
      }
    }
    e.traitLastHp = e.hp;
  }
  for (const sh of enemyShots) {
    if (sh.homing) {
      const want = Math.atan2(a.y - sh.y, a.x - sh.x), cur = Math.atan2(sh.vy, sh.vx);
      let diff = want - cur; while (diff > Math.PI) diff -= Math.PI * 2; while (diff < -Math.PI) diff += Math.PI * 2;
      const ang = cur + Math.max(-0.06, Math.min(0.06, diff)) * speedMult, sp = Math.hypot(sh.vx, sh.vy);
      sh.vx = Math.cos(ang) * sp; sh.vy = Math.sin(ang) * sp;
    }
    sh.x += sh.vx * speedMult; sh.y += sh.vy * speedMult; sh.life -= speedMult;
    if (!arenaContains(sh.x, sh.y)) sh.life = 0;
    else if (obstacleHit(sh.x, sh.y, 4)) { sh.life = 0; spawnHitParticles(sh.x, sh.y, '#b9b2a6'); } // 岩の陰に隠れれば弾を防げる
    if (sh.life > 0 && a.hp > 0 && Math.hypot(sh.x - a.x, sh.y - a.y) < a.radius + 6) {
      sh.life = 0;
      if (damagePlayerByTrait(a, sh.owner || e, sh.dmg, sh.kind === 'fire' ? '#ff9f43' : '#c792ea')) playerDown = true;
    }
  }
  enemyShots = enemyShots.filter(sh => sh.life > 0);
  for (const m of enemyMines) {
    m.life -= speedMult; if (m.armIn > 0) m.armIn -= speedMult;
    if (m.armIn <= 0 && m.life > 0 && a.hp > 0 && Math.hypot(m.x - a.x, m.y - a.y) < a.radius + 10) {
      m.life = 0;
      spawnHitParticles(m.x, m.y, '#ff9f43'); spawnHitParticles(m.x, m.y, '#ffd76b');
      spawnDamageText(m.x, m.y - 14, 'BURN!', '#ff7a2b', 0.02, true);
      playNoiseBurst(0.3, 0.3);
      shakeScreenLight();
      if (damagePlayerByTrait(a, m.owner || e, m.dmg, '#ff9f43')) playerDown = true;
    }
  }
  enemyMines = enemyMines.filter(m => m.life > 0);
  return playerDown;
}
function drawEnemyTraitEffects() {
  const t = Date.now();
  for (const m of enemyMines) {
    if (m.seed === undefined) m.seed = Math.random() * 100;
    const grow = m.armIn > 0 ? 0.45 + 0.35 * (1 - m.armIn / 40) : 1;
    ctx.save();
    ctx.globalAlpha = Math.min(1, m.life / 60) * (m.armIn > 0 ? 0.7 : 1);
    ctx.shadowColor = '#ff6a1f'; ctx.shadowBlur = 14;
    [['#ff4a1c', 1], ['#ff9f2b', 0.68], ['#fff1a0', 0.38]].forEach(([col, k], li) => {
      const fl = 1 + 0.14 * Math.sin(t / 70 + m.seed + li * 1.7) + 0.06 * Math.sin(t / 23 + m.seed * 2);
      const w = 9.5 * k * grow, h = 26 * k * grow * fl;
      const sway = Math.sin(t / 110 + m.seed + li) * 2.2 * k;
      const tipX = m.x + sway, tipY = m.y + 3 - h, by = m.y + 3;
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.moveTo(tipX, tipY);
      ctx.bezierCurveTo(m.x + w * 1.15, by - h * 0.45, m.x + w, by + w * 0.2, m.x, by + w * 0.35);
      ctx.bezierCurveTo(m.x - w, by + w * 0.2, m.x - w * 1.15, by - h * 0.45, tipX, tipY);
      ctx.fill();
      if (li === 0) ctx.shadowBlur = 0;
    });
    if (m.armIn <= 0) {
      ctx.fillStyle = '#ffd76b';
      for (let i = 0; i < 2; i++) {
        const ph = ((t / 900 + m.seed * 0.37 + i * 0.5) % 1);
        ctx.globalAlpha = (1 - ph) * Math.min(1, m.life / 60);
        ctx.beginPath(); ctx.arc(m.x + Math.sin(ph * 9 + m.seed + i) * 5, m.y - 6 - ph * 22, 1.3, 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.restore();
  }
  for (const sh of enemyShots) {
    ctx.save();
    const col = sh.kind === 'fire' ? '#ff9f43' : '#c792ea';
    ctx.shadowColor = col; ctx.shadowBlur = 12; ctx.fillStyle = col;
    ctx.beginPath(); ctx.arc(sh.x, sh.y, sh.kind === 'fire' ? 7 : 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(sh.x, sh.y, 2.2, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  for (const e of balls) {
    if (e.isPlayer || e.isDying || !e.trait) continue;
    const r = e.radius * ENEMY_SPRITE_SCALE / 2;
    ctx.save();
    if (e.guarding) { // バリア：半透明の光る球体（ゆっくり脈打つ）
      const br = r + 6 + Math.sin(t / 160) * 1.5;
      const grad = ctx.createRadialGradient(e.x, e.y, br * 0.35, e.x, e.y, br);
      grad.addColorStop(0, 'rgba(120,210,255,0.05)'); grad.addColorStop(0.75, 'rgba(120,210,255,0.18)'); grad.addColorStop(1, 'rgba(170,235,255,0.5)');
      ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(e.x, e.y, br, 0, Math.PI * 2); ctx.fill();
      ctx.shadowColor = '#7fd8ff'; ctx.shadowBlur = 10;
      ctx.strokeStyle = `rgba(200,240,255,${0.6 + 0.3 * Math.sin(t / 120)})`; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(e.x, e.y, br, 0, Math.PI * 2); ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(255,255,255,0.45)'; // 左上の照り返し
      ctx.beginPath(); ctx.ellipse(e.x - br * 0.4, e.y - br * 0.45, br * 0.28, br * 0.13, -0.6, 0, Math.PI * 2); ctx.fill();
    }
    if (e.traitState === 'windup') { // 突進の溜め
      ctx.strokeStyle = 'rgba(255,90,90,' + (0.5 + 0.5 * Math.sin(t / 60)) + ')'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(e.x, e.y, r + 3, 0, Math.PI * 2); ctx.stroke();
    }
    if (e.traitState === 'cast') { // 詠唱の魔法陣
      ctx.strokeStyle = e.trait === 'healMagic' ? 'rgba(126,231,135,0.85)' : e.trait === 'deathMagic' ? 'rgba(180,140,255,0.9)' : 'rgba(255,159,67,0.85)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(e.x, e.y, r + 6, t / 200, t / 200 + Math.PI * 1.6); ctx.stroke();
    }
    if (MAGIC_TRAITS[e.trait] && isSilenced()) {
      ctx.font = '14px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('🔇', e.x + r * 0.8, e.y - r * 0.8);
    }
    ctx.restore();
  }
}

// 攻撃予兆：敵が足元に赤い予告エリア（扇・円・直線）を出してから攻撃する。範囲の外へ動けば回避でき、攻撃後の隙は大ダメージのチャンス
const TG_WIND = 32, TG_STUN = 45, TG_STUN_DMG = 2, TG_DMG = 1.6;
const TG_KINDS = ['fan', 'circle', 'line'];
function tgKindFor(e) {
  if (e.isBoss) return TG_KINDS[Math.floor(Math.random() * 3)];
  const key = getEnemyBookKey(e); let h = 0;
  for (const ch of key) h = (h * 31 + ch.codePointAt(0)) >>> 0;
  return TG_KINDS[h % 3];
}
function tgRandCd(e) { return e.isBoss ? 170 + Math.random() * 130 : 240 + Math.random() * 180; }
function tgInside(tg, x, y, pr) {
  if (tg.kind === 'circle') return Math.hypot(x - tg.x, y - tg.y) < tg.r + pr * 0.5;
  const dx = x - tg.x, dy = y - tg.y;
  if (tg.kind === 'fan') {
    if (Math.hypot(dx, dy) > tg.r + pr * 0.5) return false;
    let d = Math.atan2(dy, dx) - tg.ang; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2;
    return Math.abs(d) < tg.half + 0.12;
  }
  const along = dx * Math.cos(tg.ang) + dy * Math.sin(tg.ang), side = -dx * Math.sin(tg.ang) + dy * Math.cos(tg.ang);
  return along > -pr && along < tg.len + pr * 0.5 && Math.abs(side) < tg.w / 2 + pr * 0.5;
}
function updateEnemyTelegraph(a, e, speedMult) {
  if (!a || !e || e.isDying || e.hp <= 0 || e.spawnTimer > 0 || phase !== 'battle') return false;
  if (e.megaPhase && e.megaPhase !== 'mega') return false; // 合体前は予兆攻撃しない
  if (e.tgCd === undefined) e.tgCd = 120 + Math.random() * 120;
  if (e.traitState === 'tgStun') {
    e.tgTimer -= speedMult;
    if (e.tgTimer <= 0) { e.traitState = null; e.traitFreeze = false; }
    return false;
  }
  if (e.traitState === 'tgDash') {
    e.tgTimer -= speedMult;
    if (e.tgTimer <= 0) {
      e.dashing = false; e.vx *= 0.2; e.vy *= 0.2;
      if (e.tgBig) { e.traitState = 'tgStun'; e.tgTimer = TG_STUN; e.traitFreeze = true; spawnDamageText(e.x, e.y - e.radius - 22, 'スキ！', '#ffd76b', 0.02); }
      else e.traitState = null;
    }
    return false;
  }
  const tg = e.tg;
  if (!tg) {
    if (e.traitState || isDisabled(e) || a.hp <= 0) return false;
    e.tgCd -= speedMult;
    if (e.tgCd > 0) return false;
    let kind = tgKindFor(e);
    const dist = Math.hypot(a.x - e.x, a.y - e.y), ang = Math.atan2(a.y - e.y, a.x - e.x);
    if (kind === 'fan' && dist > 150) kind = 'circle';
    const isBig = e.isBoss || Math.random() < 0.3; // 大技：ボスは毎回、雑魚はときどき。範囲が広く溜めが長いが、終わると「スキ」ができる
    const big = (e.isBoss ? 1.25 : 1) * (isBig ? 1.3 : 1);
    const t = { kind, wind: (e.isBoss ? TG_WIND - 8 : TG_WIND) + (isBig ? 14 : 0), t: 0, ang, x: e.x, y: e.y, big: isBig };
    if (kind === 'circle') { t.x = a.x; t.y = a.y; t.r = 52 * big; }
    else if (kind === 'fan') { t.r = (e.radius + 80) * big; t.half = 0.62; }
    else { t.len = Math.min(arena.radius * 1.6, dist + 70); t.w = Math.max(30, e.radius * ENEMY_SPRITE_SCALE * 0.6) * big; }
    t.wasIn = tgInside(t, a.x, a.y, a.radius);
    e.tg = t; e.traitState = 'tg'; e.traitFreeze = true;
    spawnDamageText(e.x, e.y - e.radius - 22, isBig ? '大技！' : '！', '#ff4d4d', 0.025, true);
    playTone(isBig ? 620 : 880, isBig ? 0.25 : 0.12, 'square', 0.06, isBig ? 420 : 660);
    return false;
  }
  if (e.traitState !== 'tg') { e.tg = null; return false; } // 封印などで中断された
  if (kind_followTarget(tg)) { tg.ang = Math.atan2(a.y - e.y, a.x - e.x); }
  tg.t += speedMult;
  if (tg.t < tg.wind) return false;
  // 発動
  e.tg = null; e.tgCd = tgRandCd(e);
  const hit = a.hp > 0 && tgInside(tg, a.x, a.y, a.radius);
  if (tg.kind === 'circle') {
    for (let i = 0; i < 3; i++) spawnHitParticles(tg.x + (Math.random() - 0.5) * tg.r, tg.y + (Math.random() - 0.5) * tg.r, i ? '#ff9f43' : '#ff4d4d');
    playNoiseBurst(0.25, 0.3); shakeScreenLight();
  } else if (tg.kind === 'fan') {
    spawnHitParticles(e.x + Math.cos(tg.ang) * tg.r * 0.6, e.y + Math.sin(tg.ang) * tg.r * 0.6, '#ff4d4d');
    playSnesSlash(0);
  } else {
    playTone(180, 0.25, 'sawtooth', 0.14, 90);
  }
  e.tgFx = { kind: tg.kind, x: tg.x, y: tg.y, r: tg.r, ang: tg.ang, half: tg.half, len: tg.len, w: tg.w, at: Date.now() };
  if (tg.kind === 'line') {
    e.traitState = 'tgDash'; e.traitFreeze = false; e.dashing = true; e.tgBig = tg.big;
    const sp = 13; e.vx = Math.cos(tg.ang) * sp; e.vy = Math.sin(tg.ang) * sp; e.tgTimer = tg.len / sp;
  } else if (tg.big) { // 大技の後だけ隙ができる
    e.traitState = 'tgStun'; e.tgTimer = TG_STUN; e.traitFreeze = true;
    spawnDamageText(e.x, e.y - e.radius - 22, 'スキ！', '#ffd76b', 0.02);
  } else { e.traitState = null; e.traitFreeze = false; }
  if (hit) {
    applyHitKnockback(a, e, 5);
    return damagePlayerByTrait(a, e, e.atk * TG_DMG * (tg.big ? 1.5 : 1), '#ff4d4d'); // 大技は威力も大きい
  }
  if (tg.wasIn || Math.random() < 0.3) spawnEvadeText(a);
  return false;
}
function kind_followTarget(tg) { return tg.kind !== 'circle' && tg.t < tg.wind * 0.45; } // 扇・突進は溜めの前半だけ狙いを合わせる
function isTelegraphStunned(e) { return !!e && e.traitState === 'tgStun'; }
function tgPath(tg, ex, ey) {
  ctx.beginPath();
  if (tg.kind === 'circle') ctx.arc(tg.x, tg.y, tg.r, 0, Math.PI * 2);
  else if (tg.kind === 'fan') { ctx.moveTo(ex, ey); ctx.arc(ex, ey, tg.r, tg.ang - tg.half, tg.ang + tg.half); ctx.closePath(); }
  else {
    const c = Math.cos(tg.ang), s = Math.sin(tg.ang), hw = tg.w / 2;
    ctx.moveTo(ex - s * hw, ey + c * hw); ctx.lineTo(ex + c * tg.len - s * hw, ey + s * tg.len + c * hw);
    ctx.lineTo(ex + c * tg.len + s * hw, ey + s * tg.len - c * hw); ctx.lineTo(ex + s * hw, ey - c * hw); ctx.closePath();
  }
}
// 長押し突進のダッシュ演出：残像と、進行方向の後ろへ流れるスピード線
let rushTrail = [];
const RUSH_TRAIL_MS = 120;
function drawRushTrail() {
  const now = Date.now();
  rushTrail = rushTrail.filter(p => now - p.t < RUSH_TRAIL_MS);
  const pl = balls.find(isMainPlayerBall);
  if (!pl || !rushTrail.length) return;
  ctx.save();
  for (let i = 0; i < rushTrail.length; i += 5) { // 残像（うっすら透ける・控えめ）
    const p = rushTrail[i], k = 1 - (now - p.t) / RUSH_TRAIL_MS;
    ctx.globalAlpha = 0.16 * k;
    drawBall({ ...pl, x: p.x, y: p.y, hitFlash: 0 });
  }
  ctx.globalAlpha = 1;
  if (rushingNow) { // スピード線
    const sp = Math.hypot(pl.vx, pl.vy) || 1, ux = pl.vx / sp, uy = pl.vy / sp;
    ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.lineCap = 'round';
    for (let i = 0; i < 6; i++) {
      const off = ((i * 37 + now / 8) % 50) - 25, back = 18 + ((i * 53 + now / 3) % 30), len = 16 + (i % 3) * 8;
      const bx = pl.x - ux * back - uy * off, by = pl.y - uy * back + ux * off;
      ctx.lineWidth = 1.5 + (i % 2);
      ctx.globalAlpha = 0.4 + 0.3 * Math.sin(now / 40 + i);
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx - ux * len, by - uy * len); ctx.stroke();
    }
  }
  ctx.restore();
}
// 敵の攻撃フェーズ：一定間隔で「構え（予告）→攻撃中」を繰り返し、攻撃中にぶつかった時だけダメージを受ける
// ステージが進むほど攻撃中の時間が長く、間隔が短くなる（ボスはさらに長め）
function getEnemyAtkCycle(e) {
  const st = Math.max(1, game.stage);
  let calm = Math.max(75, 190 - st * 1.1), atk = Math.min(110, 40 + st * 0.6);
  if (e.isBoss) { calm *= 0.8; atk *= 1.3; }
  return { calm, warn: 36, atk };
}
function tickEnemyAtkPhase(e, speedMult) {
  if (!e || e.isDying || e.spawnTimer > 0) return;
  if (isDisabled(e) || e.traitState === 'tgStun') { e.atkPh = 'calm'; e.atkT = 0; return; } // 麻痺・隙の間は攻撃しない
  const c = getEnemyAtkCycle(e);
  if (!e.atkPh) { e.atkPh = 'calm'; e.atkT = Math.random() * c.calm * 0.5; }
  e.atkT += speedMult;
  if (e.atkPh === 'calm' && e.atkT >= c.calm) { e.atkPh = 'warn'; e.atkT = 0; }
  else if (e.atkPh === 'warn' && e.atkT >= c.warn) {
    e.atkPh = 'attack'; e.atkT = 0;
    playTone(240, 0.12, 'sawtooth', 0.06, 160);
    const pl = balls.find(isMainPlayerBall); // 攻撃開始で少し踏み込む
    if (pl) { const an = Math.atan2(pl.y - e.y, pl.x - e.x); e.vx += Math.cos(an) * 1.5; e.vy += Math.sin(an) * 1.5; }
  } else if (e.atkPh === 'attack' && e.atkT >= c.atk) { e.atkPh = 'calm'; e.atkT = 0; }
}
function isEnemyAttacking(e) { return !!e && e.atkPh === 'attack'; }
function drawEnemyAtkPhase(e) {
  if (!e.atkPh || e.isDying) return;
  const now = Date.now(), r = e.radius * ENEMY_SPRITE_SCALE / 2;
  ctx.save();
  if (e.atkPh === 'warn') { // 構え：赤い輪が縮みながら点滅（もうすぐ攻撃）
    const k = Math.min(1, e.atkT / getEnemyAtkCycle(e).warn);
    ctx.strokeStyle = `rgba(255,70,70,${0.5 + 0.5 * Math.abs(Math.sin(now / 70))})`; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(e.x, e.y, r * (1.6 - 0.5 * k), 0, Math.PI * 2); ctx.stroke();
  } else if (e.atkPh === 'attack') { // 攻撃中：赤いオーラと剣マーク（触るとダメージ）
    const g = ctx.createRadialGradient(e.x, e.y, r * 0.2, e.x, e.y, r * 1.3);
    g.addColorStop(0, `rgba(255,40,40,${0.35 + 0.15 * Math.sin(now / 90)})`); g.addColorStop(0.75, `rgba(255,40,40,${0.3 + 0.15 * Math.sin(now / 90)})`); g.addColorStop(1, 'rgba(255,40,40,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(e.x, e.y, r * 1.3, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(255,70,70,0.95)'; ctx.lineWidth = 3;
    for (let i = 0; i < 8; i++) { const an = i * Math.PI / 4 + now / 400; ctx.beginPath(); ctx.moveTo(e.x + Math.cos(an) * r * 1.0, e.y + Math.sin(an) * r * 1.0); ctx.lineTo(e.x + Math.cos(an) * r * 1.22, e.y + Math.sin(an) * r * 1.22); ctx.stroke(); }
    ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = 'bold 17px sans-serif'; ctx.fillText('⚔️', e.x + r * 0.8, e.y - r * 0.85);
  }
  ctx.restore();
}
// 謎魔法の演出：虹色の魔法陣が回りながら広がり、「？」が渦を巻いて飛び散る
let mysteryFx = null;
function drawMysteryFx() {
  if (!mysteryFx) return;
  const k = (Date.now() - mysteryFx.start) / 1100;
  if (k >= 1) { mysteryFx = null; return; }
  const { x, y } = mysteryFx, R = arena.radius * (0.25 + k * 1.1);
  ctx.save();
  ctx.globalAlpha = 0.35 * (1 - k); ctx.fillStyle = mysteryFx.color || '#ffffff'; arenaPath(); ctx.fill(); // 画面がぱっと光る
  ctx.globalAlpha = 1 - k;
  for (let r = 0; r < 3; r++) { // 虹色の輪
    ctx.lineWidth = 6 - r * 1.5; ctx.strokeStyle = `hsl(${(Date.now() / 4 + r * 120) % 360},90%,62%)`;
    ctx.beginPath(); ctx.arc(x, y, R * (1 - r * 0.22), 0, Math.PI * 2); ctx.stroke();
  }
  ctx.translate(x, y); ctx.rotate(k * Math.PI * 3); // 回る魔法陣
  ctx.strokeStyle = `rgba(255,255,255,${0.8 * (1 - k)})`; ctx.lineWidth = 2;
  ctx.beginPath(); for (let i = 0; i <= 5; i++) { const a = i * Math.PI * 4 / 5 - Math.PI / 2, rr = R * 0.55; i ? ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); } ctx.stroke();
  ctx.font = `bold ${18 + k * 14}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, rr = R * 0.75; ctx.fillStyle = `hsl(${i * 45},90%,65%)`; ctx.fillText('？', Math.cos(a) * rr, Math.sin(a) * rr); }
  ctx.restore();
}
function drawEnemyTelegraphs() {
  const now = Date.now();
  for (const e of balls) {
    if (e.isPlayer || e.isDying) continue;
    drawEnemyAtkPhase(e);
    const tg = e.tg;
    if (tg) {
      const p = Math.min(1, tg.t / tg.wind);
      const ex = tg.kind === 'circle' ? tg.x : e.x, ey = tg.kind === 'circle' ? tg.y : e.y;
      ctx.save();
      tgPath(tg, ex, ey);
      ctx.fillStyle = `rgba(255,40,40,${0.12 + 0.1 * p})`; ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = `rgba(255,70,70,${0.55 + 0.4 * Math.abs(Math.sin(now / (p > 0.7 ? 45 : 90)))})`; ctx.stroke();
      ctx.clip(); // 内側から満ちていくゲージで発動タイミングを見せる
      ctx.fillStyle = 'rgba(255,60,40,0.35)';
      if (tg.kind === 'circle') { ctx.beginPath(); ctx.arc(tg.x, tg.y, tg.r * p, 0, Math.PI * 2); ctx.fill(); }
      else if (tg.kind === 'fan') { ctx.beginPath(); ctx.moveTo(ex, ey); ctx.arc(ex, ey, tg.r * p, tg.ang - tg.half, tg.ang + tg.half); ctx.closePath(); ctx.fill(); }
      else { const t2 = { ...tg, len: tg.len * p }; tgPath(t2, ex, ey); ctx.fill(); }
      ctx.restore();
    }
    const fx = e.tgFx;
    if (fx) {
      const k = (now - fx.at) / 260;
      if (k >= 1) { e.tgFx = null; continue; }
      ctx.save();
      ctx.globalAlpha = 1 - k;
      tgPath(fx, fx.kind === 'circle' ? fx.x : fx.x, fx.kind === 'circle' ? fx.y : fx.y);
      ctx.fillStyle = 'rgba(255,230,180,0.55)'; ctx.fill();
      ctx.restore();
    }
    if (e.traitState === 'tgStun') { // 隙：頭の上で星が回る
      ctx.save(); ctx.font = '12px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const r = e.radius * ENEMY_SPRITE_SCALE / 2;
      for (let i = 0; i < 3; i++) { const an = now / 220 + i * Math.PI * 2 / 3; ctx.fillText('⭐', e.x + Math.cos(an) * r * 0.7, e.y - r - 6 + Math.sin(an) * 4); }
      ctx.restore();
    }
  }
}

const ATK_UP_COOLDOWN = 180 * 1000;
const ATK_UP_MS = 20 * 1000;
const ATK_UP_MULT = 1.5;
let lastAtkUpAt = Date.now() - ATK_UP_COOLDOWN;
let atkUpEndAt = 0;
function drawAtkUpEffects() {
  if (Date.now() >= atkUpEndAt) return;
  const player = balls.find(ball => ball.isPlayer && !ball.isClone && !ball.isCompanion);
  if (!player) return;
  const t = Date.now() / 120;
  ctx.save();
  ctx.shadowColor = '#ff6b6b';
  ctx.shadowBlur = 14;
  ctx.strokeStyle = 'rgba(255,107,107,0.85)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let i = 0; i <= 24; i++) {
    const a = i / 24 * Math.PI * 2;
    const rr = player.radius + 7 + Math.sin(a * 5 + t) * 2.5;
    const px = player.x + Math.cos(a) * rr, py = player.y + Math.sin(a) * rr;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.stroke();
  ctx.restore();
}

const POISON_COOLDOWN = 150 * 1000;
const POISON_BUFF_MS = 15 * 1000;
const POISON_TICK_MS = 1000;
const POISON_DURATION_MS = 6 * 1000;
const POISON_MAX_STACKS = 5;
const POISON_DMG_MULT = 0.3;
let lastPoisonAt = Date.now() - POISON_COOLDOWN;
let poisonBuffEndAt = 0;
function isPoisonBuffActive() { return Date.now() < poisonBuffEndAt; }
function applyPoison(enemy, force = false) {
  if (!enemy || enemy.isAdd || (!force && !isPoisonBuffActive())) return;
  const now = Date.now();
  const prev = enemy.poison;
  enemy.poison = {
    stacks: Math.min(POISON_MAX_STACKS, (prev ? prev.stacks : 0) + 1),
    until: now + POISON_DURATION_MS,
    nextTick: prev ? prev.nextTick : now + POISON_TICK_MS
  };
}
function updatePoison() {
  if (phase !== 'battle') return;
  const enemy = balls.find(ball => !ball.isPlayer);
  if (!enemy || !enemy.poison || enemy.isDying) return;
  const now = Date.now();
  const pz = enemy.poison;
  if (now - pz.nextTick > POISON_TICK_MS) pz.nextTick = now; // 一時停止明けにまとめて入らないように
  if (now >= pz.nextTick) {
    pz.nextTick += POISON_TICK_MS;
    const player = balls.find(ball => ball.isPlayer && !ball.isClone && !ball.isCompanion);
    const dmg = Math.max(1, Math.round((player ? player.atk : getPlayerAtk()) * POISON_DMG_MULT * pz.stacks * bossDamageMult(enemy)));
    enemy.hp -= dmg;
    trackDamage(dmg);
    spawnDamageText(enemy.x + (Math.random() - 0.5) * 20, enemy.y - enemy.radius - 4, '☠ ' + dmg, '#7ee787');
    for (let i = 0; i < 4; i++) particles.push({ x: enemy.x + (Math.random() - 0.5) * enemy.radius, y: enemy.y, vx: (Math.random() - 0.5) * 0.8, vy: -1 - Math.random(), life: 1, color: '#7ee787', decay: 0.03 });
    playPoisonTickSound();
    updateHPUI();
    if (enemy.hp <= 0) { triggerEnemyDefeat(enemy, enemy.x, enemy.y + 1); return; }
  }
  if (now > pz.until) delete enemy.poison;
}
function drawPoisonEffects() {
  const t = Date.now() / 200;
  if (isPoisonBuffActive()) {
    const player = balls.find(ball => ball.isPlayer && !ball.isClone && !ball.isCompanion);
    if (player) {
      ctx.save();
      ctx.strokeStyle = 'rgba(126,231,135,0.8)';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#7ee787';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.radius + 5 + Math.sin(t) * 2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }
  for (const ball of balls) {
    if (ball.isPlayer || !ball.poison || ball.isDying) continue;
    ctx.save();
    ctx.strokeStyle = 'rgba(126,231,135,0.85)';
    ctx.lineWidth = 2 + ball.poison.stacks * 0.6;
    ctx.setLineDash([6, 5]);
    ctx.lineDashOffset = -t * 6;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius + 6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#7ee787';
    ctx.strokeStyle = 'rgba(0,0,0,0.7)';
    ctx.lineWidth = 3;
    const label = '☠x' + ball.poison.stacks;
    ctx.strokeText(label, ball.x, ball.y + ball.radius + 20);
    ctx.fillText(label, ball.x, ball.y + ball.radius + 20);
    ctx.restore();
  }
}
const PARALYZE_COOLDOWN = 150 * 1000;
const PARALYZE_MS = 5 * 1000;
const PARALYZE_BOSS_MS = 2.5 * 1000;
const PARALYZE_DMG_MULT = 0.5;
let lastParalyzeAt = Date.now() - PARALYZE_COOLDOWN;
let lightningFx = null; // 落雷エフェクト { x, y, until }
function isParalyzed(ball) { return !!ball && ball.paralyzedUntil > Date.now(); }
function castParalyze(enemy) {
  const player = balls.find(ball => ball.isPlayer && !ball.isClone && !ball.isCompanion);
  const dur = enemy.isBoss ? PARALYZE_BOSS_MS : PARALYZE_MS;
  enemy.paralyzedUntil = Date.now() + dur;
  lightningFx = { x: enemy.x, y: enemy.y, until: Date.now() + 350 };
  const { dmg, crit } = rollCrit(Math.max(1, Math.round((player ? player.atk : getPlayerAtk()) * PARALYZE_DMG_MULT)), enemy);
  enemy.hp -= dmg;
  trackDamage(dmg);
  spawnAttackDamageText(enemy, dmg, crit, '#fff1a8');
  spawnDamageText(enemy.x, enemy.y + enemy.radius + 26, `⚡ 麻痺 ${dur / 1000}秒`, '#ffe14f', 0.012);
  for (let i = 0; i < 12; i++) {
    const a = Math.random() * Math.PI * 2, sp = 2 + Math.random() * 3;
    particles.push({ x: enemy.x, y: enemy.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, color: '#ffe14f', decay: 0.035 });
  }
  playParalyzeSound();
  updateHPUI();
  if (enemy.hp <= 0) triggerEnemyDefeat(enemy, enemy.x, enemy.y - 1);
}
function drawLightningBolt(x1, y1, x2, y2, width, color) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  const segs = 9;
  for (let i = 1; i < segs; i++) {
    const t = i / segs;
    ctx.lineTo(x1 + (x2 - x1) * t + (Math.random() - 0.5) * 22, y1 + (y2 - y1) * t);
  }
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}
function drawParalyzeEffects() {
  const now = Date.now();
  if (lightningFx && now < lightningFx.until) {
    ctx.save();
    ctx.shadowColor = '#ffe14f';
    ctx.shadowBlur = 18;
    drawLightningBolt(lightningFx.x + (Math.random() - 0.5) * 30, 0, lightningFx.x, lightningFx.y, 5, '#fff7c2');
    drawLightningBolt(lightningFx.x + (Math.random() - 0.5) * 30, 0, lightningFx.x, lightningFx.y, 2, '#ffe14f');
    ctx.restore();
  } else if (lightningFx) {
    lightningFx = null;
  }
  for (const ball of balls) {
    if (ball.isPlayer || !isParalyzed(ball) || ball.isDying) continue;
    ctx.save();
    ctx.shadowColor = '#ffe14f';
    ctx.shadowBlur = 8;
    for (let i = 0; i < 3; i++) {
      const a = Math.random() * Math.PI * 2;
      const r1 = ball.radius * 0.6, r2 = ball.radius + 10;
      drawLightningBolt(ball.x + Math.cos(a) * r1, ball.y + Math.sin(a) * r1, ball.x + Math.cos(a) * r2, ball.y + Math.sin(a) * r2, 1.5, '#ffe14f');
    }
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffe14f';
    ctx.strokeStyle = 'rgba(0,0,0,0.7)';
    ctx.lineWidth = 3;
    const label = '⚡' + Math.ceil((ball.paralyzedUntil - now) / 1000) + 's';
    ctx.strokeText(label, ball.x, ball.y - ball.radius - 18);
    ctx.fillText(label, ball.x, ball.y - ball.radius - 18);
    ctx.restore();
  }
}
const SLEEP_COOLDOWN = 150 * 1000;
const SLEEP_MS = 10 * 1000;
const SLEEP_BOSS_MS = 5 * 1000;
const SLEEP_WAKE_BONUS = 1.5; // 起こした一撃に、そのダメージ×1.5 を追加（合計2.5倍）
let lastSleepAt = Date.now() - SLEEP_COOLDOWN;
function isAsleep(ball) { return !!ball && ball.asleepUntil > Date.now(); }
function isStunned(ball) { return !!ball && ball.stunnedUntil > Date.now(); }
function isDisabled(ball) { return isParalyzed(ball) || isAsleep(ball) || isStunned(ball); }
function castSleep(enemy) {
  const dur = enemy.isBoss ? SLEEP_BOSS_MS : SLEEP_MS;
  enemy.asleepUntil = Date.now() + dur;
  spawnDamageText(enemy.x, enemy.y + enemy.radius + 26, `💤 眠り ${dur / 1000}秒`, '#a5a8ff', 0.012);
  for (let i = 0; i < 10; i++) particles.push({ x: enemy.x + (Math.random() - 0.5) * 30, y: enemy.y, vx: (Math.random() - 0.5) * 1.2, vy: -0.6 - Math.random(), life: 1, color: '#c9cbff', decay: 0.02 });
  playSleepSound();
}
function onPlayerHitEnemy(enemy, dmg) {
  focusHpEnemy(enemy);
  spawnBlood(enemy.x, enemy.y);
  if (isAsleep(enemy)) {
    enemy.asleepUntil = 0;
    const bonus = Math.max(1, Math.round(dmg * SLEEP_WAKE_BONUS));
    enemy.hp -= bonus;
    trackDamage(bonus);
    spawnDamageText(enemy.x, enemy.y - enemy.radius - 40, '寝込み攻撃！\n+' + bonus, '#c9a5ff', 0.012, true);
    playWakeHitSound();
  }
  applyPoison(enemy);
}
function drawSleepEffects() {
  const t = Date.now() / 1000;
  for (const ball of balls) {
    if (ball.isPlayer || !isAsleep(ball) || ball.isDying) continue;
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = '#1a1c40';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius + 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.textAlign = 'center';
    ctx.strokeStyle = 'rgba(0,0,0,0.6)';
    ctx.lineWidth = 3;
    for (let i = 0; i < 3; i++) {
      const phase = (t * 0.8 + i / 3) % 1;
      ctx.globalAlpha = 1 - phase;
      ctx.font = `bold ${10 + i * 4}px sans-serif`;
      ctx.fillStyle = '#c9cbff';
      const zx = ball.x + ball.radius * 0.6 + phase * 14 + i * 4, zy = ball.y - ball.radius - phase * 28;
      ctx.strokeText('Z', zx, zy);
      ctx.fillText('Z', zx, zy);
    }
    ctx.globalAlpha = 1;
    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = '#c9cbff';
    const label = '💤' + Math.ceil((ball.asleepUntil - Date.now()) / 1000) + 's';
    ctx.strokeText(label, ball.x, ball.y + ball.radius + 34);
    ctx.fillText(label, ball.x, ball.y + ball.radius + 34);
    ctx.restore();
  }
}
const NEW_COMP_ABILITIES = {
  heroine: { ms: 8000, fn: (c, pl) => { if (!pl || pl.hp >= pl.maxHp) return; const h = Math.max(1, Math.round(pl.maxHp * 0.1)); pl.hp = Math.min(pl.maxHp, pl.hp + h); spawnDamageText(pl.x, pl.y - pl.radius - 14, '✨ +' + h + ' HP', '#cfe4ff'); spawnHitParticles(pl.x, pl.y, '#cfe4ff'); playHealSound(); updateHPUI(); } },
  mage: { ms: 6000, fn: (c, pl, en) => { if (!en || en.isDying || en.spawnTimer > 0) return; const a = Math.atan2(en.y - c.y, en.x - c.x); homingMissiles.push({ x: c.x, y: c.y, vx: Math.cos(a) * 5, vy: Math.sin(a) * 5, speed: 5, life: HOMING_LIFE_FRAMES, trail: [], delay: 0, dmg: c.atk * 3 }); spawnDamageText(c.x, c.y - c.radius - 14, '🔥 爆炎', '#ff8a5c', 0.03); playTone(300, 0.25, 'sawtooth', 0.1, 700); } },
  ranger: { ms: 4000, fn: (c, pl, en) => { if (!en || en.isDying || en.spawnTimer > 0) return; for (const off of [-0.35, 0, 0.35]) { const a = Math.atan2(en.y - c.y, en.x - c.x) + off; homingMissiles.push({ x: c.x, y: c.y, vx: Math.cos(a) * 6, vy: Math.sin(a) * 6, speed: 6, life: HOMING_LIFE_FRAMES, trail: [], delay: 0, dmg: c.atk * 0.6, kind: 'arrow' }); } playTone(1500, 0.06, 'triangle', 0.08, 900); } },
  warrior: { ms: 12000, fn: (c, pl) => { if (!pl) return; atkUpEndAt = Math.max(atkUpEndAt, Date.now() + 4000); spawnDamageText(c.x, c.y - c.radius - 14, '💢 雄叫び！', '#ffb35c', 0.025, true); thump(160, 90, 0.3, 0.3, 'sawtooth'); } },
  paladin: { ms: 10000, fn: (c, pl) => { let healed = false; for (const b of balls) { if (!(b.isCompanion || b === pl) || b.hp <= 0 || b.hp >= b.maxHp) continue; b.hp = Math.min(b.maxHp, b.hp + Math.max(1, Math.round(b.maxHp * 0.08))); spawnHitParticles(b.x, b.y, '#ffe9a8'); healed = true; } if (healed) { spawnDamageText(c.x, c.y - c.radius - 14, '⚜️ 聖盾', '#ffe9a8', 0.025); playHealSound(); updateHPUI(); } } },
  dragoon: { ms: 9000, fn: (c, pl, en) => { if (!en || en.isDying || en.spawnTimer > 0) return; c.x = en.x - (en.radius + c.radius) * 0.7; c.y = en.y - (en.radius + c.radius) * 0.7; c.vx = 0; c.vy = 0; homingMissiles.push({ x: c.x, y: c.y, vx: 0, vy: 0, speed: 12, life: HOMING_LIFE_FRAMES, trail: [], delay: 0, dmg: c.atk * 5, kind: 'arrow' }); spawnHitParticles(en.x, en.y, '#9fd0ff'); spawnDamageText(c.x, c.y - c.radius - 14, '🐲 ジャンプ！', '#9fd0ff', 0.025, true); thump(220, 60, 0.35, 0.35, 'sawtooth'); } },
  summoner: { ms: 7000, fn: (c, pl, en) => { if (!en || en.isDying || en.spawnTimer > 0) return; for (const off of [-0.6, 0.6]) { const a = Math.atan2(en.y - c.y, en.x - c.x) + off; homingMissiles.push({ x: c.x, y: c.y, vx: Math.cos(a) * 4.5, vy: Math.sin(a) * 4.5, speed: 4.5, life: HOMING_LIFE_FRAMES, trail: [], delay: 0, dmg: c.atk * 1.5 }); } spawnDamageText(c.x, c.y - c.radius - 14, '🦊 霊獣召喚', '#b8f5c8', 0.03); playTone(660, 0.18, 'sine', 0.09, 990); } },
  alchemist: { ms: 12000, fn: c => { const g = Math.max(1, Math.round((20 + game.stage * 5) * computeBonuses().coinMult)); game.coins += g; spawnDamageText(c.x, c.y - c.radius - 14, '⚗️ +' + formatCoinNumber(g) + ' 🟡', '#ffd76b', 0.025); playTone(1200, 0.1, 'triangle', 0.07, 2600); updateStatsUI(); } },
  gunner: { ms: 5000, fn: (c, pl, en) => { if (!en || en.isDying || en.spawnTimer > 0) return; const a = Math.atan2(en.y - c.y, en.x - c.x); homingMissiles.push({ x: c.x, y: c.y, vx: Math.cos(a) * 9, vy: Math.sin(a) * 9, speed: 9, life: HOMING_LIFE_FRAMES, trail: [], delay: 0, dmg: c.atk * 2.5 }); spawnDamageText(c.x, c.y - c.radius - 14, '🔫 狙撃', '#ffcf7a', 0.03); thump(900, 200, 0.08, 0.2, 'square'); } },
  cat: { ms: 7000, fn: c => { const g = Math.max(1, Math.round((8 + game.stage * 2) * computeBonuses().coinMult)); game.coins += g; spawnDamageText(c.x, c.y - c.radius - 14, '🐾 +' + formatCoinNumber(g) + ' 🟡', '#ffd76b', 0.025); playTone(1800, 0.06, 'triangle', 0.06, 2400); updateStatsUI(); } },
};
function updateCompanionAbilities() {
  if (phase !== 'battle') return;
  const now = Date.now();
  const enemy = balls.find(ball => !ball.isPlayer);
  const player = balls.find(ball => ball.isPlayer && !ball.isClone && !ball.isCompanion);
  for (const comp of balls) {
    if (!comp.isCompanion || comp.hp <= 0) continue;
    if (comp.companionId === 'archer') {
      if (!comp.nextAbilityAt) comp.nextAbilityAt = now + ARCHER_SHOT_INTERVAL_MS;
      if (now >= comp.nextAbilityAt && enemy && !enemy.isDying && !(enemy.spawnTimer > 0)) {
        comp.nextAbilityAt = now + ARCHER_SHOT_INTERVAL_MS;
        const a = Math.atan2(enemy.y - comp.y, enemy.x - comp.x);
        homingMissiles.push({ x: comp.x, y: comp.y, vx: Math.cos(a) * 6, vy: Math.sin(a) * 6, speed: 6, life: HOMING_LIFE_FRAMES, trail: [], delay: 0, dmg: comp.atk, kind: 'arrow' });
        playTone(1500, 0.06, 'triangle', 0.08, 900);
      }
    }
    if (comp.companionId === 'priest') {
      if (!comp.nextAbilityAt) comp.nextAbilityAt = now + PRIEST_INTERVAL_MS;
      if (now >= comp.nextAbilityAt) {
        comp.nextAbilityAt = now + PRIEST_INTERVAL_MS;
        const fallen = balls.find(ball => ball.isCompanion && ball.hp <= 0);
        if (fallen) {
          fallen.hp = Math.max(1, Math.round(fallen.maxHp * PRIEST_REVIVE_RATIO));
          game.companions.alive[fallen.companionId] = true;
          game.companions.hp[fallen.companionId] = fallen.hp;
          spawnDamageText(fallen.x, fallen.y - fallen.radius - 14, '✨ 復活', '#fff4b8');
          spawnHitParticles(fallen.x, fallen.y, '#fff4b8');
          playHealSound();
        } else {
          let healed = false;
          for (const ally of balls) {
            if (!ally.isCompanion || ally.hp <= 0 || ally.hp >= ally.maxHp) continue;
            ally.hp = Math.min(ally.maxHp, ally.hp + Math.max(1, Math.round(ally.maxHp * PRIEST_HEAL_RATIO)));
            spawnHitParticles(ally.x, ally.y, '#7ee787');
            healed = true;
          }
          if (healed) playHealSound();
        }
      }
    }
    if (NEW_COMP_ABILITIES[comp.companionId]) { // 新しい仲間の能力（一定時間ごと）
      const ab = NEW_COMP_ABILITIES[comp.companionId];
      if (!comp.nextAbilityAt) comp.nextAbilityAt = now + ab.ms;
      if (now >= comp.nextAbilityAt) { comp.nextAbilityAt = now + ab.ms; ab.fn(comp, player, enemy); }
    }
    if (comp.companionId === 'sage') {
      if (!comp.nextAbilityAt) comp.nextAbilityAt = now + 5000;
      if (now >= comp.nextAbilityAt && enemy && !enemy.isDying && !(enemy.spawnTimer > 0)) {
        comp.nextAbilityAt = now + 5000;
        const a = Math.atan2(enemy.y - comp.y, enemy.x - comp.x);
        homingMissiles.push({ x: comp.x, y: comp.y, vx: Math.cos(a) * 5, vy: Math.sin(a) * 5, speed: 5, life: HOMING_LIFE_FRAMES, trail: [], delay: 0, dmg: comp.atk * 2 });
        spawnDamageText(comp.x, comp.y - comp.radius - 14, '📖 魔導', '#5a8cff', 0.03);
        playTone(880, 0.12, 'sine', 0.1, 1320);
      }
    }
    if (comp.companionId === 'angel') {
      if (!comp.nextAbilityAt) comp.nextAbilityAt = now + 10000;
      if (now >= comp.nextAbilityAt) {
        comp.nextAbilityAt = now + 10000;
        for (const ally of balls) {
          if (!ally.isPlayer || ally.isClone) continue;
          if (ally.isCompanion && ally.hp <= 0) {
            ally.hp = Math.max(1, Math.round(ally.maxHp * 0.5));
            game.companions.alive[ally.companionId] = true;
            game.companions.hp[ally.companionId] = ally.hp;
            spawnDamageText(ally.x, ally.y - ally.radius - 14, '✨ 復活', '#fff0a0');
          } else if (ally.hp > 0) {
            ally.hp = Math.min(ally.maxHp, ally.hp + Math.max(1, Math.round(ally.maxHp * 0.15)));
          }
          spawnHitParticles(ally.x, ally.y, '#fff0a0');
        }
        spawnDamageText(comp.x, comp.y - comp.radius - 16, '👼 祝福', '#fff0a0', 0.02);
        playHealSound();
        updateHPUI();
      }
    }
    if (comp.companionId === 'witch') {
      if (!comp.nextAbilityAt) comp.nextAbilityAt = now + WITCH_HEAL_INTERVAL_MS;
      if (now >= comp.nextAbilityAt && player) {
        comp.nextAbilityAt = now + WITCH_HEAL_INTERVAL_MS;
        if (player.hp < player.maxHp) {
          const heal = Math.max(1, Math.round(player.maxHp * WITCH_HEAL_RATIO));
          player.hp = Math.min(player.maxHp, player.hp + heal);
          spawnDamageText(player.x, player.y - player.radius - 14, '+' + heal + ' HP', '#7ee787');
          spawnHitParticles(player.x, player.y, '#7ee787');
          playHealSound();
          updateHPUI();
        }
      }
    }
  }
}
function drawHomingMissiles() {
  for (const m of homingMissiles) {
    if (m.delay > 0) continue;
    ctx.save();
    for (let i = 0; i < m.trail.length; i++) {
      const t = m.trail[i];
      ctx.globalAlpha = (i + 1) / m.trail.length * 0.5;
      ctx.beginPath();
      ctx.arc(t.x, t.y, 2 + i * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = m.kind === 'arrow' ? '#7ee787' : '#ffb14f';
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.shadowColor = m.kind === 'arrow' ? '#7ee787' : '#ff8a4f';
    ctx.shadowBlur = 10;
    ctx.translate(m.x, m.y);
    ctx.rotate(Math.atan2(m.vy, m.vx));
    ctx.beginPath();
    ctx.moveTo(8, 0); ctx.lineTo(-5, 4); ctx.lineTo(-3, 0); ctx.lineTo(-5, -4); ctx.closePath();
    ctx.fillStyle = m.kind === 'arrow' ? '#d7ffd9' : '#ffe0c2';
    ctx.fill();
    ctx.restore();
  }
}
let barrierHits = 0; // 残りの肩代わり回数（0 = バリアなし）
let barrierOrbs = [];
function getBarrierColors() {
  if (barrierHits <= 1) return { fill: '#ff7b87', glow: '#ff3b4a' };
  if (barrierHits <= 2) return { fill: '#ffd76b', glow: '#ffb14f' };
  return { fill: '#8fe0ff', glow: '#5cc8ff' };
}
function absorbWithBarrier(player) {
  if (barrierHits <= 0) return false;
  barrierHits--;
  spawnHitParticles(player.x, player.y, getBarrierColors().glow);
  if (barrierHits > 0) {
    spawnDamageText(player.x, player.y - player.radius - 8, 'GUARD ×' + barrierHits, '#c7ecff');
    playBarrierHitSound();
  } else {
    barrierOrbs = [];
    lastBarrierAt = Date.now(); // バリアが壊れた時点からクールダウン開始
    spawnDamageText(player.x, player.y - player.radius - 8, 'BARRIER BREAK', '#ff9aa5');
    playBarrierBreakSound();
  }
  updateBarrierButton();
  return true;
}

const SAVE_KEY = 'circle-battle-idle-save-v1';
let saveTimer = null;
let suppressAutoSave = false; // デバッグのロード中は自動セーブで上書きしない
function saveGame() {
  if (suppressAutoSave) return;
  try {
    const data = { game, lastSpecialAt, lastAccelAt, accelEndAt, lastHealAt, lastBarrierAt, lastHomingAt, lastPoisonAt, lastParalyzeAt, lastSleepAt, lastAtkUpAt, lastRegenAt, lastSilenceAt, lastSacrificeAt, lastDeathAt, lastCoinStrikeAt, lastZeniAt, lastMysteryAt, lastCompRushAt, lastNovaAt, savedAt: Date.now() };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch (err) { /* 保存できない環境では無視 */ }
}
function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    if (!data || !data.game) return false;
    Object.assign(game, data.game);
    if (data.game.rebirthLv == null) game.rebirthLv = game.reincarnations || 0; // 転生Lvが無い昔のセーブ：これまでの転生1回につきLv1
    if (!Array.isArray(data.game.equippedSkills)) {
      game.equippedSkills = Object.keys(SKILL_GACHA_SKILLS).filter(id => game.shopOwned && game.shopOwned[id]).slice(0, game.skillSlots || 1);
    }
    if (typeof data.lastSpecialAt === 'number') lastSpecialAt = data.lastSpecialAt;
    if (typeof data.lastAccelAt === 'number') lastAccelAt = data.lastAccelAt;
    if (typeof data.accelEndAt === 'number') accelEndAt = data.accelEndAt;
    if (typeof data.lastHealAt === 'number') lastHealAt = data.lastHealAt;
    if (typeof data.lastBarrierAt === 'number') lastBarrierAt = data.lastBarrierAt;
    if (typeof data.lastHomingAt === 'number') lastHomingAt = data.lastHomingAt;
    if (typeof data.lastPoisonAt === 'number') lastPoisonAt = data.lastPoisonAt;
    if (typeof data.lastParalyzeAt === 'number') lastParalyzeAt = data.lastParalyzeAt;
    if (typeof data.lastSleepAt === 'number') lastSleepAt = data.lastSleepAt;
    if (typeof data.lastAtkUpAt === 'number') lastAtkUpAt = data.lastAtkUpAt;
    if (typeof data.lastRegenAt === 'number') lastRegenAt = data.lastRegenAt;
    if (typeof data.lastSilenceAt === 'number') lastSilenceAt = data.lastSilenceAt;
    if (typeof data.lastSacrificeAt === 'number') lastSacrificeAt = data.lastSacrificeAt;
    if (typeof data.lastDeathAt === 'number') lastDeathAt = data.lastDeathAt;
    if (typeof data.lastCoinStrikeAt === 'number') lastCoinStrikeAt = data.lastCoinStrikeAt;
    if (typeof data.lastZeniAt === 'number') lastZeniAt = data.lastZeniAt;
    if (typeof data.lastMysteryAt === 'number') lastMysteryAt = data.lastMysteryAt;
    if (typeof data.lastCompRushAt === 'number') lastCompRushAt = data.lastCompRushAt;
    if (typeof data.lastNovaAt === 'number') lastNovaAt = data.lastNovaAt;
    return true;
  } catch (err) {
    return false;
  }
}
const DEBUG_SLOT_COUNT = 10;
const debugSlotKey = i => `circle-battle-idle-debug-slot-${i}`;
let debugSlotArmed = null; // 2回タップ確認用 'save-3' など
function readDebugSlot(i) {
  try { const raw = localStorage.getItem(debugSlotKey(i)); return raw ? JSON.parse(raw) : null; } catch (err) { return null; }
}
function renderDebugSlots() {
  const list = document.getElementById('debugSlotList');
  let html = '';
  for (let i = 1; i <= DEBUG_SLOT_COUNT; i++) {
    const slot = readDebugSlot(i);
    const g = slot && slot.data && slot.data.game;
    const info = g
      ? `<b>スロット${i}</b>　${new Date(slot.savedAt).toLocaleString('ja-JP')}<br>${g.stage}階層　🟡 ${formatCoinNumber(g.coins)}　💎 ${Math.floor(g.gems || 0)}　転生 ${g.reincarnations || 0}回`
      : `<b>スロット${i}</b>　<span class="slot-empty">（空き）</span>`;
    const arm = kind => debugSlotArmed === `${kind}-${i}`;
    html += `<div class="slot-row"><div class="slot-info">${info}</div>`
      + `<button class="save ${arm('save') ? 'armed' : ''}" data-slot-save="${i}">${arm('save') ? '上書き?' : '保存'}</button>`
      + `<button class="load ${arm('load') ? 'armed' : ''}" data-slot-load="${i}" ${g ? '' : 'disabled'}>${arm('load') ? '本当に?' : 'ロード'}</button>`
      + `<button class="del ${arm('del') ? 'armed' : ''}" data-slot-del="${i}" ${g ? '' : 'disabled'}>${arm('del') ? '削除?' : '削除'}</button></div>`;
  }
  list.innerHTML = html;
}
function openDebugSlots() {
  debugSlotArmed = null;
  renderDebugSlots();
  document.getElementById('debugSlotModal').classList.add('show');
}
function handleDebugSlotClick(event) {
  const saveBtn = event.target.closest('[data-slot-save]');
  const loadBtn = event.target.closest('[data-slot-load]');
  const delBtn = event.target.closest('[data-slot-del]');
  const btn = saveBtn || loadBtn || delBtn;
  if (!btn || btn.disabled) return;
  const kind = saveBtn ? 'save' : loadBtn ? 'load' : 'del';
  const i = Number(btn.dataset.slotSave || btn.dataset.slotLoad || btn.dataset.slotDel);
  const occupied = !!readDebugSlot(i);
  const needConfirm = kind !== 'save' || occupied;
  if (needConfirm && debugSlotArmed !== `${kind}-${i}`) { debugSlotArmed = `${kind}-${i}`; renderDebugSlots(); return; }
  debugSlotArmed = null;
  try {
    if (kind === 'save') {
      saveGame();
      const data = JSON.parse(localStorage.getItem(SAVE_KEY));
      localStorage.setItem(debugSlotKey(i), JSON.stringify({ savedAt: Date.now(), data }));
      showNotice(`💾 スロット${i}に保存しました`);
    } else if (kind === 'del') {
      localStorage.removeItem(debugSlotKey(i));
      showNotice(`🗑️ スロット${i}を削除しました`);
    } else {
      const slot = readDebugSlot(i);
      localStorage.setItem(SAVE_KEY, JSON.stringify(slot.data));
      suppressAutoSave = true; // 再読み込み時の自動セーブでロードしたデータを上書きしない
      showNotice(`📂 スロット${i}をロードします…`);
      setTimeout(() => location.reload(), 300);
      return;
    }
  } catch (err) {
    showNotice('セーブスロットを利用できません（保存領域が使えない環境です）', true);
  }
  renderDebugSlots();
}

function clearSave() {
  try { localStorage.removeItem(SAVE_KEY); } catch (err) { /* 無視 */ }
}

// 帰還の反射くじ：10分以上離れて戻ると引ける。離れていた時間が長いほど報酬・レア度・サプライズ宝箱の確率が上がる
const RETURN_MIN_MS = 10 * 60 * 1000;
const LOGIN_BONUS_TABLE = [
  { min: 10, label: '10分', coins: 60, gems: 0, chest: 0.05 },
  { min: 30, label: '30分', coins: 120, gems: 1, chest: 0.1 },
  { min: 60, label: '1時間', coins: 250, gems: 1, chest: 0.2 },
  { min: 180, label: '3時間', coins: 500, gems: 2, chest: 0.35 },
  { min: 480, label: '8時間', coins: 1000, gems: 3, chest: 0.5 },
  { min: 1440, label: '1日', coins: 2000, gems: 5, chest: 0.7 }
];
function getReturnTier(awayMs) { let t = 0; LOGIN_BONUS_TABLE.forEach((r, i) => { if (awayMs >= r.min * 60000) t = i; }); return t; }
function formatAway(ms) { const m = Math.floor(ms / 60000), h = Math.floor(m / 60), d = Math.floor(h / 24); return d ? `${d}日${h % 24}時間` : h ? `${h}時間${m % 60}分` : `${m}分`; }
const LOGIN_RARITY_MULT = { common: 1, rare: 1.5, epic: 2.5, legendary: 5 };
const LOGIN_RARITY_EXTRA_GEMS = { common: 0, rare: 0, epic: 1, legendary: 3 };
function pickLoginRarity(tier = 0) {
  const roll = Math.random() * 100 - tier * 4; // 長く離れていたほどレアが出やすい
  if (roll < 3) return 'legendary';
  if (roll < 15) return 'epic';
  if (roll < 45) return 'rare';
  return 'common';
}
function formatCoinNumber(num) {
  num = Math.floor(num || 0);
  if (num < 10000) return num.toLocaleString('ja-JP');
  const units = [
    { value: 1e4, symbol: '万' },
    { value: 1e8, symbol: '億' },
    { value: 1e12, symbol: '兆' },
    { value: 1e16, symbol: '京' },
  ];
  let idx = units.length - 1;
  while (idx > 0 && num < units[idx].value) idx--;
  while (true) {
    const u = units[idx];
    const raw = num / u.value;
    const decimals = raw < 10 ? 2 : (raw < 100 ? 1 : 0);
    const rounded = Math.round(raw * Math.pow(10, decimals)) / Math.pow(10, decimals);
    if (rounded >= 10000 && idx < units.length - 1) { idx++; continue; } // 桁上りで一つ大きい単位へ
    return rounded.toLocaleString('ja-JP', { maximumFractionDigits: decimals }) + u.symbol;
  }
}
function dateKey(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function daysBetweenKeys(a, b) {
  const [ay, am, ad] = a.split('-').map(Number);
  const [by, bm, bd] = b.split('-').map(Number);
  const da = new Date(ay, am - 1, ad);
  const db = new Date(by, bm - 1, bd);
  return Math.round((db - da) / 86400000);
}
function showBossWarning() {
  const ms = game.stage % 10 === 0 && !game.skipChallenge ? getMilestoneBoss(game.stage) : null; // 節目のボスは特別な警告
  bossWarning.textContent = ms ? `⚠ ${ms.label} ⚠` : 'WARNING';
  bossWarning.classList.add('show');
  if (ms) { shakeScreen(); setTimeout(playWarningSound, 600); }
  playWarningSound();
  setTimeout(() => bossWarning.classList.remove('show'), 1800);
}

function ensureDailyClearReset() {
  const today = dateKey(new Date());
  if (game.dailyClearDate !== today) {
    if (!game.dailyClearHistory) game.dailyClearHistory = {};
    if (game.dailyClearDate) game.dailyClearHistory[game.dailyClearDate] = game.dailyClears;
    game.dailyClearDate = today;
    game.dailyClears = 0;
  }
}
function getDailyClearsForDate(key) {
  const today = dateKey(new Date());
  if (key === today) return game.dailyClears;
  if (game.dailyClearHistory && game.dailyClearHistory[key] != null) return game.dailyClearHistory[key];
  return 0;
}

const LOGIN_RARITY_ORDER = ['common', 'rare', 'epic', 'legendary'];
const LOGIN_RARITY_TITLES = { common: 'NORMAL', rare: 'RARE!', epic: 'EPIC!!', legendary: 'LEGENDARY!!!' };
let loginGachaSkip = null; // 演出中にタップしたら最後まで早送り
function renderLoginDays(pos) {
  const cycle = LOGIN_BONUS_TABLE.length;
  document.getElementById('lbDays').innerHTML = LOGIN_BONUS_TABLE.map((r, i) =>
    `<div class="lb-day ${i < pos ? 'done' : ''} ${i === pos ? 'today' : ''} ${i === cycle - 1 ? 'big' : ''}"><b>${i < pos ? '✔' : i === cycle - 1 ? '🎁' : i + 1}</b>${r.label}</div>`).join('');
}
function spawnLoginConfetti(rarity) {
  const box = document.getElementById('lbConfetti');
  const n = { common: 0, rare: 18, epic: 40, legendary: 80 }[rarity];
  const cols = rarity === 'legendary' ? ['#ffd76b', '#ff5c8a', '#64e8ff', '#7ee787', '#c792ea', '#ffffff'] : [RARITY_INFO[rarity].color, '#ffffff', '#ffd76b'];
  let html = '';
  for (let i = 0; i < n; i++) {
    const dur = 1.6 + Math.random() * 1.8, delay = Math.random() * 0.6;
    html += `<i style="left:${Math.random() * 100}%;background:${cols[i % cols.length]};--dx:${(Math.random() - 0.5) * 120}px;--rot:${Math.random() * 900 - 450}deg;animation-duration:${dur}s;animation-delay:${delay}s"></i>`;
  }
  box.innerHTML = html;
}
function checkLoginBonus(awayMs) {
  if (!(awayMs >= RETURN_MIN_MS) || loginBonusModal.classList.contains('show')) return;
  const tier = getReturnTier(awayMs);
  const reward = LOGIN_BONUS_TABLE[tier];
  const rarity = pickLoginRarity(tier);
  const rarityInfo = RARITY_INFO[rarity];
  const b = computeBonuses();
  const bonusCoins = Math.round(reward.coins * (1 + game.stage * 0.25) * b.loginBonusMult * LOGIN_RARITY_MULT[rarity]);
  const rIdx = LOGIN_RARITY_ORDER.indexOf(rarity);
  const chest = Math.random() < reward.chest; // サプライズ宝箱：遺物かジェムの山
  const chestArtifact = chest && Math.random() < 0.5 ? pickWeightedArtifact(ARTIFACT_POOL, REBIRTH_REWARD_RARITY_WEIGHTS) : null;
  const chestGems = chest && !chestArtifact ? 5 + tier * 5 : 0;
  const bonusGems = reward.gems + LOGIN_RARITY_EXTRA_GEMS[rarity] + chestGems;
  const bonusPotion = rIdx >= 2 ? 1 : 0;
  const bonusArtifact = rarity === 'legendary' ? pickWeightedArtifact(ARTIFACT_POOL, REBIRTH_REWARD_RARITY_WEIGHTS) : null;
  const fakeOut = rIdx >= 2 && Math.random() < 0.5;
  game.lastSeenAt = Date.now();
  game.coins += bonusCoins;
  game.gems += bonusGems;
  if (chestArtifact) gainArtifact(chestArtifact.id);
  if (bonusPotion) game.potions = (game.potions || 0) + bonusPotion;
  if (bonusArtifact) gainArtifact(bonusArtifact.id);
  saveGame();

  const panel = document.getElementById('lbPanel'), orb = document.getElementById('lbOrb'), rarityEl = document.getElementById('lbRarity');
  panel.className = 'modal-panel lb-panel';
  panel.style.setProperty('--lb', '#ffd76b');
  orb.style.setProperty('--orb', '#ffd76b');
  orb.className = 'lb-orb shaking';
  rarityEl.className = 'lb-rarity'; rarityEl.innerHTML = '';
  document.getElementById('lbConfetti').innerHTML = '';
  loginBonusStreak.textContent = `おかえり！ 離れていた時間 ${formatAway(awayMs)}`;
  renderLoginDays(tier);
  loginBonusReward.innerHTML = '';
  loginBonusCloseBtn.disabled = false; // 演出中に押すとスキップ、終わってから押すと閉じる
  loginBonusCloseBtn.textContent = '抽選中……（タップでスキップ）';
  loginSlotBox.classList.remove('settled');
  loginSlotBox.classList.add('spinning');
  loginSlotBox.style.borderColor = ''; loginSlotBox.style.boxShadow = '';
  loginSlotNum.textContent = '0';
  loginBonusModal.classList.add('show');

  const timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  let done = false;
  let cyc = 0;
  const cycle = () => {
    if (done) return;
    const c = RARITY_INFO[LOGIN_RARITY_ORDER[cyc++ % 4]].color;
    orb.style.setProperty('--orb', c);
    playSlotTickSound();
    if (cyc < 14) later(cycle, 60 + cyc * 12);
  };
  later(cycle, 200);
  const showRarity = (r, withUp) => {
    const info = RARITY_INFO[r];
    panel.style.setProperty('--lb', info.color);
    orb.style.setProperty('--orb', info.color);
    orb.className = 'lb-orb burst';
    panel.classList.add('revealed');
    panel.classList.remove('r-common', 'r-rare', 'r-epic', 'r-legendary'); panel.classList.add('r-' + r);
    rarityEl.innerHTML = (withUp ? '<span class="up">⬆ 昇格！！</span>' : '') + `${rarityStars(r)} ${LOGIN_RARITY_TITLES[r]}`;
    rarityEl.className = 'lb-rarity'; void rarityEl.offsetWidth; rarityEl.className = 'lb-rarity pop';
    playGachaSound(r);
  };
  let t = 1500;
  if (fakeOut) { later(() => showRarity(LOGIN_RARITY_ORDER[rIdx - 1], false), t); t += 900; later(() => { showRarity(rarity, true); shakeScreenLight(); }, t); }
  else later(() => showRarity(rarity, false), t);
  later(() => { spawnLoginConfetti(rarity); if (rIdx >= 2) playLoginBonusSound(); }, t + 100);
  let ticks = 0;
  const spin = () => {
    if (done) return;
    if (++ticks < 14) {
      loginSlotNum.textContent = Math.round(Math.random() * bonusCoins * 1.4).toLocaleString('ja-JP');
      playSlotTickSound();
      later(spin, 40 + Math.pow(ticks / 14, 2) * 160);
    } else settleCoins();
  };
  const settleCoins = () => {
    loginSlotNum.textContent = formatCoinNumber(bonusCoins);
    loginSlotBox.classList.remove('spinning');
    loginSlotBox.classList.add('settled');
    loginSlotBox.style.borderColor = rarityInfo.color;
    loginSlotBox.style.boxShadow = `0 0 24px ${rarityInfo.color}99 inset`;
    playSlotSettleSound();
  };
  later(spin, t + 350);
  const chips = [];
  if (chest) chips.push({ special: true, html: `🎁 サプライズ宝箱！ ${chestArtifact ? `${ico(chestArtifact)} 遺物「${chestArtifact.name}」` : `💎 ジェム +${chestGems}`}` });
  if (bonusGems - chestGems) chips.push(`💎 +${bonusGems - chestGems} ジェム`);
  if (bonusPotion) chips.push(`🧪 回復ポーション +${bonusPotion}`);
  if (bonusArtifact) chips.push({ special: true, html: `${ico(bonusArtifact)} 遺物「${bonusArtifact.name}」` });
  if (LOGIN_RARITY_MULT[rarity] > 1) chips.push(`🟡 コイン ×${LOGIN_RARITY_MULT[rarity]}`);
  const showChips = () => {
    loginBonusReward.innerHTML = chips.map((c, i) => `<span class="lb-chip ${c.special ? 'special' : ''}" style="animation-delay:${i * 0.18}s">${c.html || c}</span>`).join('');
  };
  const finish = () => {
    if (done) return;
    done = true;
    timers.forEach(clearTimeout);
    loginGachaSkip = null;
    if (!panel.classList.contains('revealed')) { showRarity(rarity, false); spawnLoginConfetti(rarity); }
    else if (!rarityEl.textContent.includes(LOGIN_RARITY_TITLES[rarity])) showRarity(rarity, fakeOut);
    if (!loginSlotBox.classList.contains('settled')) settleCoins();
    showChips();
    loginBonusCloseBtn.disabled = false;
    loginBonusCloseBtn.textContent = '受け取る';
    updateStatsUI(); updatePotionButton(); renderArtifactList();
  };
  later(finish, t + 350 + 1500);
  loginGachaSkip = finish;
}
document.getElementById('lbPanel').addEventListener('click', ev => {
  if (loginGachaSkip) { ev.stopPropagation(); loginGachaSkip(); }
}, true);
loginBonusCloseBtn.addEventListener('click', () => {
  if (loginBonusCloseBtn.disabled || loginGachaSkip) return;
  loginBonusModal.classList.remove('show');
});

let noticeTimer = null;
let continueTimer = null;
let continueDeadline = 0;
let rebirthTimer = null;
let rebirthSkippable = false;
let gachaDialogOpen = false;

let comboCount = 0;
let lastHitAt = 0;
const COMBO_WINDOW_MS = 500; // 再ヒットできるようになってから、この時間以内に再ヒットしたらコンボ
const HIT_LOCK_FRAMES = 20;  // 1回当たった後、次に当たれるまでのフレーム数（ゲーム速度で実時間が変わる）
function getComboWindowMs() { return HIT_LOCK_FRAMES / 60 * 1000 / getEffectiveSpeed() + COMBO_WINDOW_MS; }
const COMBO_STEP = 0.08;
const COMBO_MAX_STACKS = 12;

function registerHit() {
  const now = Date.now();
  if (now - lastHitAt <= getComboWindowMs()) comboCount++;
  else comboCount = 1;
  lastHitAt = now;
  if (comboCount > (game.maxCombo || 0)) game.maxCombo = comboCount;
  if (comboCount >= 2) showComboBadge(comboCount);
  return comboCount;
}
const comboBadge = document.getElementById('comboBadge');
let comboBadgeTimer = null;
function showComboBadge(count) {
  comboBadge.textContent = `${count} コンボ！`;
  comboBadge.classList.add('show');
  comboBadge.classList.remove('pop'); void comboBadge.offsetWidth; comboBadge.classList.add('pop');
  clearTimeout(comboBadgeTimer);
  comboBadgeTimer = setTimeout(() => comboBadge.classList.remove('show'), getComboWindowMs() + 500);
}
function getComboMultiplier(comboGrowthBonus) {
  const stacks = Math.min(comboCount - 1, COMBO_MAX_STACKS);
  return 1 + stacks * (COMBO_STEP + comboGrowthBonus);
}
function resetCombo() { comboCount = 0; clearTimeout(comboBadgeTimer); comboBadge.classList.remove('show'); }

let dpsAccum = 0;
function trackDamage(amount) {
  if (amount > game.maxDamage) {
    if (game.maxDamage > 0) announceRecord('damage', amount); // 初回記録は通知しない
    game.maxDamage = amount;
  }
  dpsAccum += amount;
}
setInterval(() => {
  if (dpsAccum > game.maxDps) {
    if (game.maxDps > 0) announceRecord('dps', dpsAccum);
    game.maxDps = dpsAccum;
  }
  dpsAccum = 0;
}, 1000);

let lastPlayTickAt = Date.now();
setInterval(() => {
  const now = Date.now();
  const delta = now - lastPlayTickAt;
  lastPlayTickAt = now;
  if (document.hidden || delta > 5000) return;
  game.playTimeMs = (game.playTimeMs || 0) + delta;
  game.lastSeenAt = now; // 最後に遊んでいた時刻（帰還の反射くじ用）
}, 1000);
document.addEventListener('visibilitychange', () => {
  lastPlayTickAt = Date.now();
  if (document.hidden) { game.lastSeenAt = Date.now(); saveGame(); }
  else { checkLoginBonus(game.lastSeenAt ? Date.now() - game.lastSeenAt : 0); game.lastSeenAt = Date.now(); }
});

const RECORD_BADGE_INTERVAL_MS = 2500;
const RECORD_LABELS = { damage: 'MAX ダメージ', dps: 'MAX DPS' };
const recordBadge = document.getElementById('recordBadge');
['animationend', 'animationcancel'].forEach(type => {
  recordBadge.addEventListener(type, () => recordBadge.classList.remove('show'));
  document.getElementById('lootPopup').addEventListener(type, ev => ev.currentTarget.classList.remove('show'));
});
const pendingRecords = {};
let lastRecordBadgeAt = 0;
function announceRecord(type, value) { pendingRecords[type] = value; }
setInterval(() => {
  const types = Object.keys(pendingRecords);
  if (!types.length || Date.now() - lastRecordBadgeAt < RECORD_BADGE_INTERVAL_MS) return;
  lastRecordBadgeAt = Date.now();
  recordBadge.innerHTML = types.map(t => `<div>🏆 ${RECORD_LABELS[t]} 更新！ <b>${Math.floor(pendingRecords[t]).toLocaleString('ja-JP')}</b></div>`).join('');
  types.forEach(t => delete pendingRecords[t]);
  recordBadge.classList.remove('show');
  void recordBadge.offsetWidth; // アニメーションを最初から再生
  recordBadge.classList.add('show');
  if (activeTabCache === 'game') playTone(1318.5, 0.12, 'triangle', 0.12, 1760);
}, 250);

function formatDuration(ms) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return h + '時間' + String(m).padStart(2, '0') + '分' + String(s).padStart(2, '0') + '秒';
}

let noticeHoldUntil = 0; // 宝箱などの重要な通知を表示中は、他の通知で上書きしない（終わってから表示）
let noticeDeferTimer = null;
function showNotice(text, isError = false, duration = 1500, hold = false) {
  if (isBattleSfxMuted()) return; // 戦闘中のお知らせ（ステージクリア等）はゲーム画面以外では出さない
  const now = Date.now();
  if (!hold && !isError && now < noticeHoldUntil) {
    clearTimeout(noticeDeferTimer);
    noticeDeferTimer = setTimeout(() => showNotice(text, isError, duration), noticeHoldUntil - now);
    return;
  }
  if (hold) noticeHoldUntil = now + duration;
  battleNotice.textContent = text;
  battleNotice.classList.toggle('error', isError);
  battleNotice.classList.remove('at-tap');
  battleNotice.style.position = '';
  battleNotice.style.left = '';
  battleNotice.style.top = '';
  battleNotice.classList.add('show');
  if (isError) playErrorSound();
  clearTimeout(noticeTimer);
  noticeTimer = setTimeout(() => battleNotice.classList.remove('show'), duration);
}

const TREASURE_TEXT_DECAY = 1 / 280; // 宝箱のテキストは約4.5秒表示（通常のダメージ表示より長め）
const TREASURE_NOTICE_MS = 4000;
const lootPopup = document.getElementById('lootPopup');
function showLootPopup(title, main, sub, color) {
  lootPopup.innerHTML = `<div class="lp-title">${title}</div><div class="lp-main" style="color:${color}">${main}</div>${sub ? `<div class="lp-sub">${sub}</div>` : ''}`;
  lootPopup.style.borderColor = color;
  lootPopup.classList.remove('show');
  void lootPopup.offsetWidth; // 連続でも最初から再生
  lootPopup.classList.add('show');
  lootNoticeActive = true;
}
let lootNoticeActive = false;
window.addEventListener('pointerdown', () => {
  if (!lootPopup.classList.contains('show')) return;
  lootPopup.classList.remove('show');
  if (lootNoticeActive) { lootNoticeActive = false; noticeHoldUntil = 0; clearTimeout(noticeTimer); battleNotice.classList.remove('show'); }
}, true);
// 戦闘中に手に入れた宝箱はすぐ開けず、ステージ左下に並べておく。タップで開封
// 宝箱にはレア度がある。ステージ左下にレア度ごとにまとめて「×個数」で表示し、タップで1個ずつ開封
const CHEST_RARITIES = ['common', 'rare', 'epic', 'legendary'];
const CHEST_STOCK_MAX = 100; // 持っておける宝箱の最大数
const CHEST_WEIGHTS = { common: 60, rare: 28, epic: 10, legendary: 2 };
const CHEST_ICON = { common: 'x_chest1', rare: 'x_chest2', epic: 'x_chest4', legendary: 'x_chest6' };
const CHEST_COIN_MULT = { common: 1, rare: 2.5, epic: 6, legendary: 15 };
const CHEST_ARTIFACT_CHANCE = { common: 0.35, rare: 0.45, epic: 0.6, legendary: 0.85 };
const CHEST_ART_WEIGHTS = { common: { common: 75, rare: 22, epic: 3, legendary: 0 }, rare: { common: 45, rare: 42, epic: 12, legendary: 1 }, epic: { common: 15, rare: 45, epic: 35, legendary: 5 }, legendary: { common: 0, rare: 20, epic: 55, legendary: 25 } };
function getHeldChests() { // 古いセーブ（個数だけ）はノーマルとして扱う
  if (typeof game.heldChests !== 'object' || !game.heldChests) game.heldChests = { common: Number(game.heldChests) || 0 };
  return game.heldChests;
}
function dropTreasureChest(rarity) {
  if (!rarity) { let r = Math.random() * 100; rarity = CHEST_RARITIES.find(k => (r -= CHEST_WEIGHTS[k]) < 0) || 'common'; }
  const hc = getHeldChests();
  if (CHEST_RARITIES.reduce((n, k) => n + (hc[k] || 0), 0) >= CHEST_STOCK_MAX) { spawnDamageText(arena.x, arena.y + 30, `🎁 宝箱がいっぱい！（最大${CHEST_STOCK_MAX}個）`, '#ff6b6b', TREASURE_TEXT_DECAY); return; }
  hc[rarity] = (hc[rarity] || 0) + 1;
  const info = RARITY_INFO[rarity];
  spawnDamageText(arena.x, arena.y + 30, `🎁 ${info.label}の宝箱ゲット！ 左下をタップで開封`, info.color, TREASURE_TEXT_DECAY);
  playLoginBonusSound();
  renderChestTray(rarity);
  saveGame();
}
function renderChestTray(newRarity) {
  const el = document.getElementById('chestTray'); if (!el) return;
  const hc = getHeldChests(), cnt = k => (hc[k] || 0) + rebirthChestCount(k); // 転生ガチャの宝箱も同じレア度のボタンに加算
  el.innerHTML = CHEST_RARITIES.filter(k => cnt(k) > 0).map(k => `<button data-open-chest="${k}" class="${k === newRarity ? 'tray-new' : ''}" style="border-color:${RARITY_INFO[k].color}" title="${RARITY_INFO[k].label}の宝箱（タップで開封）">${xi(CHEST_ICON[k]) || '🎁'}<b style="border-color:${RARITY_INFO[k].color}">×${cnt(k)}</b></button>`).join('');
}
// 宝箱ボタンはふだん静止。長い間タップされないときだけ、たまに動いて気づかせる
const CHEST_NUDGE_IDLE_MS = 60000, CHEST_NUDGE_EVERY_MS = 12000;
let chestTrayTapAt = Date.now(), chestNudgeAt = 0;
setInterval(() => {
  const el = document.getElementById('chestTray'), now = Date.now();
  if (!el || !el.children.length || now - chestTrayTapAt < CHEST_NUDGE_IDLE_MS || now - chestNudgeAt < CHEST_NUDGE_EVERY_MS) return;
  chestNudgeAt = now; el.classList.remove('nudge'); void el.offsetWidth; el.classList.add('nudge');
}, 1000);
document.getElementById('chestTray').addEventListener('click', ev => {
  chestTrayTapAt = Date.now(); document.getElementById('chestTray').classList.remove('nudge');
  const b = ev.target.closest('[data-open-chest]'); if (!b) return;
  const k = b.dataset.openChest;
  if (phase !== 'battle') return;
  if (rebirthChestCount(k) > 0) { openRebirthChestDialog(k); return; } // 転生ガチャの宝箱が先（中身は遺物）
  if (!(getHeldChests()[k] > 0)) return;
  openChestDialog(k);
});
// 宝箱ダイアログ：開けるまで・閉じるまで戦闘は止まる。動画を見ると中身3倍
const chestModal = document.getElementById('chestModal');
let chestPausedPhase = null;
function openChestDialog(rarity) {
  chestPausedPhase = phase; phase = 'paused';
  if (rarity === 'all') { openAllChestDialog(); return; }
  const info = RARITY_INFO[rarity];
  document.getElementById('chestModalIcon').innerHTML = xi(CHEST_ICON[rarity]) || '🎁';
  document.getElementById('chestModalIcon').className = 'chest-big shake';
  document.getElementById('chestModalTitle').innerHTML = `<span style="color:${info.color}">${rarityStars(rarity)} ${info.label}の宝箱</span>`;
  document.getElementById('chestModalText').textContent = `残り ${getHeldChests()[rarity]} 個\n動画を見ると中身が3倍に！`;
  document.getElementById('chestModalBtns').innerHTML = `<button class="modal-close-btn" id="chestAdBtn">${isAdFree() ? '🎁 紋章特典で3倍開封' : '🎬 動画を見て3倍開封'}</button><button class="modal-shop-btn" id="chestOpenBtn" style="justify-content:center;"><span class="msb-name">そのまま開ける</span></button><button class="modal-shop-btn chest-cancel-btn" id="chestCancelBtn" style="justify-content:center;"><span class="msb-name">↩ 開けずに戻る</span></button>`;
  document.getElementById('chestCancelBtn').onclick = closeChestDialog;
  chestModal.classList.add('show');
  const open = mult => {
    const hc = getHeldChests(); if (!(hc[rarity] > 0)) return;
    hc[rarity]--; renderChestTray();
    showChestResult(rarity, openTreasureChest(rarity, mult), mult);
  };
  document.getElementById('chestOpenBtn').onclick = () => open(1);
  document.getElementById('chestAdBtn').onclick = () => { if (isAdFree()) { open(3); return; } playRewardedVideo(() => { rewardAdModal.classList.remove('show'); open(3); }); };
}
function openAllChestDialog() { // まとめて開封
  const hc = getHeldChests(), total = CHEST_RARITIES.reduce((n, k) => n + (hc[k] || 0), 0);
  document.getElementById('chestModalIcon').innerHTML = xi(CHEST_ICON[CHEST_RARITIES.filter(k => hc[k] > 0).pop() || 'common']) || '🎁';
  document.getElementById('chestModalIcon').className = 'chest-big shake';
  document.getElementById('chestModalTitle').textContent = `🎁 宝箱を全部開ける（${total}個）`;
  document.getElementById('chestModalText').innerHTML = CHEST_RARITIES.filter(k => hc[k] > 0).map(k => `<span style="color:${RARITY_INFO[k].color};font-weight:800">${RARITY_INFO[k].label} ×${hc[k]}</span>`).join('　') + '<br>動画を見ると全部の中身が3倍に！';
  document.getElementById('chestModalBtns').innerHTML = `<button class="modal-close-btn" id="chestAdBtn">${isAdFree() ? '🎁 紋章特典で全部3倍' : '🎬 動画を見て全部3倍'}</button><button class="modal-shop-btn" id="chestOpenBtn" style="justify-content:center;"><span class="msb-name">そのまま全部開ける</span></button>`;
  chestModal.classList.add('show');
  const openAll = mult => {
    let coins = 0; const arts = {};
    for (const k of CHEST_RARITIES) {
      while (hc[k] > 0) {
        hc[k]--;
        const before = game.coins, loot = openTreasureChest(k, mult, true);
        if (loot.art) arts[loot.art.id] = (arts[loot.art.id] || 0) + mult; else coins += game.coins - before;
      }
    }
    playChestOpenSound(); renderChestTray(); renderArtifactList(); updateStatsUI(); saveGame();
    const list = Object.entries(arts).map(([id, n]) => { const a = ARTIFACT_POOL.find(x => x.id === id); return `<span style="color:${RARITY_INFO[a.rarity].color}">${a.icon} ${a.name} ×${n}</span>`; }).join('<br>');
    document.getElementById('chestModalIcon').className = 'chest-big';
    document.getElementById('chestModalIcon').innerHTML = '<span style="font-size:4rem">🎉</span>';
    document.getElementById('chestModalTitle').textContent = `🎁 ${total}個 開封！${mult > 1 ? '（3倍）' : ''}`;
    document.getElementById('chestModalText').innerHTML = `<div class="chest-loot" style="color:#d18b00">🟡 ${formatCoinNumber(coins)} コイン</div>${list ? `<div style="max-height:30vh;overflow-y:auto;font-weight:800;line-height:1.6">${list}</div>` : ''}`;
    document.getElementById('chestModalBtns').innerHTML = `<button class="modal-close-btn" id="chestCloseBtn">閉じる</button>`;
    document.getElementById('chestCloseBtn').onclick = closeChestDialog;
  };
  document.getElementById('chestOpenBtn').onclick = () => openAll(1);
  document.getElementById('chestAdBtn').onclick = () => { if (isAdFree()) { openAll(3); return; } playRewardedVideo(() => { rewardAdModal.classList.remove('show'); openAll(3); }); };
}
function rebirthChestCount(rarity) { return Array.isArray(game.rebirthChests) ? game.rebirthChests.filter(id => ARTIFACT_BY_ID[id] && ARTIFACT_BY_ID[id].rarity === rarity).length : 0; }
function openRebirthChestDialog(rarity) { // 転生ガチャの宝箱：開けるか、開けずに戻るか
  const n = rebirthChestCount(rarity); if (!n) return;
  const info = RARITY_INFO[rarity];
  chestPausedPhase = phase; phase = 'paused';
  document.getElementById('chestModalIcon').innerHTML = xi(CHEST_ICON[rarity]) || '🎁';
  document.getElementById('chestModalIcon').className = 'chest-big shake';
  document.getElementById('chestModalTitle').innerHTML = `<span style="color:${info.color}">🔮 転生ガチャ ${rarityStars(rarity)} ${info.label}の宝箱</span>`;
  document.getElementById('chestModalText').textContent = `残り ${n} 個\n中身は${info.label}の遺物（開けるまでお楽しみ）`;
  document.getElementById('chestModalBtns').innerHTML = `<button class="modal-close-btn" id="rbOpenBtn">開ける</button><button class="modal-shop-btn chest-cancel-btn" id="chestCancelBtn" style="justify-content:center;"><span class="msb-name">↩ 開けずに戻る</span></button>`;
  document.getElementById('chestCancelBtn').onclick = closeChestDialog;
  document.getElementById('rbOpenBtn').onclick = () => { closeChestDialog(); openStockedRebirthChest(rarity); };
  chestModal.classList.add('show');
}
function closeChestDialog() {
  chestModal.classList.remove('show');
  if (chestPausedPhase === 'battle' && phase === 'paused') phase = 'battle';
  chestPausedPhase = null;
}
function showChestResult(rarity, loot, mult) {
  document.getElementById('chestModalIcon').className = 'chest-big';
  document.getElementById('chestModalIcon').innerHTML = loot.icon;
  document.getElementById('chestModalText').innerHTML = `<div class="chest-loot" style="color:${loot.color}">${loot.main}${mult > 1 ? ' <span style="color:#ff5c6c">×3！</span>' : ''}</div>${loot.sub || ''}`;
  document.getElementById('chestModalBtns').innerHTML = `<button class="modal-close-btn" id="chestCloseBtn">閉じる</button>`;
  document.getElementById('chestCloseBtn').onclick = closeChestDialog;
}
function openTreasureChest(rarity = 'common', mult = 1, quiet = false) { // 中身を決めて受け取る。表示用の情報を返す（quiet＝まとめて開封）
  if (!quiet) playChestOpenSound();
  const isCoin = Math.random() >= CHEST_ARTIFACT_CHANCE[rarity];
  let loot;
  if (isCoin) {
    const bonus = Math.round((60 + game.stage * 10) * CHEST_COIN_MULT[rarity] * computeBonuses().coinMult) * mult;
    game.coins += bonus;
    if (!quiet) spawnCoinBurst(arena.x, arena.y + 20, bonus);
    loot = { icon: xi('x_coin') || '<span style="font-size:4rem">🟡</span>', main: `🟡 ${formatCoinNumber(bonus)} コイン`, color: '#d18b00' };
  } else {
    const pick = pickWeightedArtifact(ARTIFACT_POOL, CHEST_ART_WEIGHTS[rarity]); // レア度の高い宝箱ほど良い遺物
    for (let i = 0; i < mult; i++) gainArtifact(pick.id);
    const info = RARITY_INFO[pick.rarity];
    loot = { art: pick, icon: ico(pick), main: `${pick.name}${mult > 1 ? ` ×${mult}` : ''}`, color: info.color, sub: `<span style="color:${info.color}">${rarityStars(pick.rarity)} ${info.label}</span>　${pick.desc}<br>所持 x${game.ownedArtifacts[pick.id]}` };
    if (!quiet) renderArtifactList();
  }
  if (!quiet) { updateStatsUI(); saveGame(); }
  return loot;
}
function showTapError(text, clientX, clientY) {
  battleNotice.textContent = text;
  battleNotice.style.position = 'fixed';
  battleNotice.style.left = clientX + 'px';
  battleNotice.style.top = (clientY - 14) + 'px';
  battleNotice.classList.add('error', 'at-tap', 'show');
  playErrorSound();
  clearTimeout(noticeTimer);
  noticeTimer = setTimeout(() => battleNotice.classList.remove('show'), 1500);
}

function resizeCanvas() {
  const rect = wrap.getBoundingClientRect();
  if (rect.width < 10) return;
  dpr = Math.max(1, window.devicePixelRatio || 1);
  const newSize = rect.width;
  const oldSize = size;
  size = newSize;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  arena.x = size / 2;
  arena.y = size / 2;
  arena.radius = size / 2 - (ARENA_RECT ? 3 : 6);
  if (oldSize > 0 && Math.abs(newSize - oldSize) > 0.5) {
    const k = newSize / oldSize;
    const scalePos = o => { o.x *= k; o.y *= k; if (o.orbitRadius) o.orbitRadius *= k; };
    balls.forEach(scalePos); adds.forEach(scalePos); meteors.forEach(scalePos); particles.forEach(scalePos); damageTexts.forEach(scalePos);
    homingMissiles.forEach(m => { scalePos(m); m.trail.forEach(scalePos); });
  }
}

function ensureAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  else if (audioCtx.state === 'suspended') audioCtx.resume();
}

const BGM_PATTERNS = {
  normal: [
    { freq: 261.63, dur: 0.3, type: 'triangle', gain: 0.05 },
    { freq: 329.63, dur: 0.3, type: 'triangle', gain: 0.045 },
    { freq: 392.00, dur: 0.3, type: 'triangle', gain: 0.045 },
    { freq: 329.63, dur: 0.3, type: 'triangle', gain: 0.04 },
    { freq: 293.66, dur: 0.3, type: 'triangle', gain: 0.045 },
    { freq: 349.23, dur: 0.3, type: 'triangle', gain: 0.045 },
    { freq: 440.00, dur: 0.3, type: 'triangle', gain: 0.04 },
    { freq: 349.23, dur: 0.3, type: 'triangle', gain: 0.04 },
  ],
  boss: [
    { freq: 130.81, dur: 0.2, type: 'sawtooth', gain: 0.07 },
    { freq: 130.81, dur: 0.2, type: 'sawtooth', gain: 0.05 },
    { freq: 155.56, dur: 0.2, type: 'square',   gain: 0.06 },
    { freq: 130.81, dur: 0.2, type: 'sawtooth', gain: 0.05 },
    { freq: 174.61, dur: 0.2, type: 'square',   gain: 0.06 },
    { freq: 130.81, dur: 0.2, type: 'sawtooth', gain: 0.05 },
    { freq: 155.56, dur: 0.2, type: 'square',   gain: 0.06 },
    { freq: 196.00, dur: 0.2, type: 'sawtooth', gain: 0.07 },
  ]
};
const NOTE_FREQ = (() => {
  const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const m = {};
  for (let o = 1; o <= 7; o++) names.forEach((n, i) => { m[n + o] = 440 * Math.pow(2, (i - 9) / 12 + (o - 4)); });
  return m;
})();
function melody(str, dur, type, gain) {
  return str.split(' ').map(n => ({ freq: n === '-' ? 0 : NOTE_FREQ[n], dur, type, gain }));
}
Object.assign(BGM_PATTERNS, {
  upgrade: melody('C5 E5 G5 E5 F5 A5 G5 E5 D5 F5 E5 C5 D5 B4 C5 -', 0.2, 'triangle', 0.05),
  companion: melody('G4 B4 D5 C5 E5 G5 B4 D5 G5 A4 C5 E5 D5 F#5 A5 G5 - -', 0.26, 'square', 0.03),
  coinshop: melody('E5 G5 C6 G5 A5 F5 D5 G5 E5 C5 D5 E5 C5 - C5 -', 0.18, 'square', 0.035),
  artifact: melody('A4 C5 E5 A5 G5 E5 C5 B4 F4 A4 C5 F5 E5 C5 A4 G#4', 0.42, 'sine', 0.06),
  gemshop: melody('C6 E6 G6 E6 D6 F6 A6 F6 E6 G6 C7 G6 D6 B5 C6 -', 0.2, 'sine', 0.045),
  gacha: melody('C5 D5 E5 G5 C6 G5 E5 D5 D5 E5 F#5 A5 D6 A5 F#5 E5', 0.16, 'sawtooth', 0.03),
  records: melody('C5 G4 A4 E4 F4 C4 F4 G4 E5 D5 C5 B4 A4 G4 A4 B4', 0.5, 'triangle', 0.05),
  ranking: melody('C5 C5 C5 G5 - E5 G5 C6 - A5 F5 A5 G5 - - -', 0.2, 'square', 0.035),
  gameover: melody('A4 - G4 F4 E4 - D4 C4 B3 - C4 D4 A3 - - -', 0.55, 'sine', 0.07),
  rebirth: melody('C5 G5 E6 G5 A4 E5 C6 E5 F4 C5 A5 C5 G4 D5 B5 D5', 0.34, 'sine', 0.05),
});
