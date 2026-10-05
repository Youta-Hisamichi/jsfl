function draw() {
  cloneCounter.textContent = `分身 ${balls.filter(ball => ball.isClone).length} / ${getCloneLimit()}`;
  wrap.classList.toggle('boss-mode', balls.some(ball => ball.isBoss));
  ctx.clearRect(0, 0, size, size);
  drawArenaFloor();
  drawObstacles();
  arenaPath();
  ctx.strokeStyle = 'rgba(150,160,190,0.35)';
  ctx.lineWidth = 2;
  ctx.stroke();

  if (barrierOrbs.length && barrierHits > 0) {
    const barrierColors = getBarrierColors();
    for (const orb of barrierOrbs) {
      if (orb.x == null) continue;
      ctx.save();
      ctx.shadowColor = barrierColors.glow;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, 7, 0, Math.PI * 2);
      ctx.fillStyle = barrierColors.fill;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.8)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    }
  }

  drawDeathDim();
  drawPinchAura();
  drawEnemyTelegraphs();
  drawRushTrail();
  for (const ball of [...balls, ...adds]) {
    if (flyouts.includes(ball) || ball.isDying) continue; // 撃破されて吹っ飛び中の敵はオーバーレイ側で描画
    if (ball.isCompanion) {
      if (ball.hp <= 0) {
        if (!ball.fallenAt) ball.fallenAt = Date.now();
        const t = (Date.now() - ball.fallenAt) / 600;
        if (t >= 1) continue;
        ctx.save();
        ctx.globalAlpha = 1 - t;
        ctx.translate(0, t * 12);
        drawBall(ball);
        ctx.restore();
        continue;
      }
      ball.fallenAt = 0;
    }
    drawBall(ball);
  }

  drawHomingMissiles();
  drawPoisonEffects();
  drawParalyzeEffects();
  drawSleepEffects();
  drawAtkUpEffects();
  drawRegenEffects();
  drawTackleEffects();
  drawRampageGauge();
  drawChargeRing();
  drawSlashFx();
  drawWeapons();
  tickChargeSound();
  drawDragStick();
  drawExpGems();
  drawEnemyTraitEffects();
  drawNovaFx();
  drawMysteryFx();

  drawTapBonus();
  for (const p of particles) {
    ctx.globalAlpha = Math.max(0, p.life);
    if (p.blood) { ctx.fillStyle = p.color; ctx.fillRect(Math.round(p.x), Math.round(p.y), p.blood, p.blood); continue; }
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.isCoin ? 4.5 : 2.5, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
    if (p.isCoin) { ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 1; ctx.stroke(); }
  }
  ctx.globalAlpha = 1;

  for (const meteor of meteors) {
    ctx.save();
    ctx.shadowColor = '#ff9f43';
    ctx.shadowBlur = 22;
    ctx.beginPath();
    ctx.arc(meteor.x, meteor.y, meteor.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#f07b32';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(meteor.x - meteor.radius * 0.22, meteor.y - meteor.radius * 0.25, meteor.radius * 0.42, 0, Math.PI * 2);
    ctx.fillStyle = '#ffd76b';
    ctx.fill();
    ctx.restore();
  }

  drawArenaOverlays();
  drawBossTimer();
  drawAutoLabel();
}
function drawDamageTexts() {
  ctx.save();
  ctx.textAlign = 'center';
  for (const d of damageTexts) {
    ctx.font = d.big ? 'bold 18px "Hiragino Sans", sans-serif' : 'bold 13px "Hiragino Sans", sans-serif';
    ctx.globalAlpha = Math.max(0, Math.min(1, d.life / 0.3)); // 最後の3割になるまではくっきり表示し、そこから消える
    ctx.fillStyle = d.color;
    ctx.strokeStyle = 'rgba(0,0,0,0.6)';
    ctx.lineWidth = 2.5;
    const lines = d.text.split('\n');
    const lineHeight = d.big ? 20 : 15;
    lines.forEach((line, i) => {
      const ly = d.y - (lines.length - 1 - i) * lineHeight;
      ctx.strokeText(line, d.x, ly);
      ctx.fillText(line, d.x, ly);
    });
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}
function drawArenaOverlays() {
  if (stageAnnounceTimer > 0) {
    const t = stageAnnounceTimer / STAGE_ANNOUNCE_DURATION;
    const fadeIn = Math.min(1, (STAGE_ANNOUNCE_DURATION - stageAnnounceTimer) / 8);
    const alpha = Math.min(fadeIn, t > 0.3 ? 1 : t / 0.3);
    const scale = 1 + (1 - Math.min(1, fadeIn)) * 0.6;
    ctx.save();
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.translate(arena.x, arena.y);
    ctx.scale(scale, scale);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 34px "Hiragino Sans", sans-serif';
    ctx.strokeStyle = 'rgba(0,0,0,0.7)';
    ctx.lineWidth = 6;
    ctx.strokeText(stageAnnounceText, 0, 0);
    ctx.fillStyle = '#ffd76b';
    ctx.fillText(stageAnnounceText, 0, 0);
    ctx.restore();
    ctx.globalAlpha = 1;
    stageAnnounceTimer--;
  }
}

function loop() {
  battleSfx = true; // ここで鳴る音は戦闘の効果音（ゲーム画面以外では鳴らさない）
  try {
    if (userPaused) { draw(); drawFlyouts(); battleSfx = false; animId = requestAnimationFrame(loop); return; }
    if (activeTabCache !== 'game') { drawFlyouts(); battleSfx = false; animId = requestAnimationFrame(loop); return; } // drawFlyouts は画面全体の重ね描きを消すため（残像が残らないように）
    if (hitStopFrames <= 0) {
      if (phase === 'battle') { updateRegen(); step(); updateBattleFx(); updateHomingMissiles(getEffectiveSpeed()); updatePoison(); updateCompanionAbilities(); }
      else updateDeathFx();
    } else {
      hitStopFrames--;
    }
    updateFlyouts();
    updateCoinFx();
    updateTackleHold();
    draw();
    drawFlyouts();
  } catch (err) {
    console.error('ゲームループ内でエラーが発生しました:', err);
  }
  battleSfx = false;
  animId = requestAnimationFrame(loop);
}

// ---------- 3択パワーアップ：敵を一定数倒すたびに、強化・スキル・仲間からランダムな3択 ----------
let powerUpPending = false;
// レベル：敵を倒すと経験値。ゲージがMAXになるとレベルアップして3択パワーアップ（転生でLv1に戻る）
function getLvNeed(lv) { return 30 + lv * 15; }
function renderLvGauge() {
  const lv = game.pLv || 1, ex = game.pExp || 0, need = getLvNeed(lv);
  document.getElementById('pLvNum').textContent = lv;
  const f = document.getElementById('pLvFill'); f.style.width = Math.min(100, ex / need * 100) + '%'; f.classList.toggle('full', powerUpPending);
  document.getElementById('pLvText').textContent = `${Math.floor(ex)} / ${need}`;
}
// レベルアップの軽いファンファーレ：「タタタ・ターン」と駆け上がって明るい和音で締める
function playLevelUpFanfare() {
  if (!audioCtx || isBattleSfxMuted()) return;
  const N = [[784, 0], [784, 0.09], [784, 0.18], [1047, 0.3]]; // ソソソ・ド
  N.forEach(([f, t], i) => { const len = i === 3 ? 0.5 : 0.08; thump(f, f, len, 0.07, 'square', t); thump(f / 2, f / 2, len, 0.04, 'triangle', t); });
  [1319, 1568].forEach(f => thump(f, f, 0.5, 0.03, 'square', 0.3)); // ミ・ソを重ねて和音に
  [2093, 2637, 3136].forEach((f, i) => thump(f, f, 0.15, 0.015, 'sine', 0.36 + i * 0.05)); // キラッ
}
function gainExp(n) {
  if (game.skipChallenge) return;
  game.pLv = game.pLv || 1; game.pExp = (game.pExp || 0) + n;
  if (!powerUpPending && game.pExp >= getLvNeed(game.pLv)) {
    game.pExp -= getLvNeed(game.pLv); game.pLv++; powerUpPending = true;
    const pl = balls.find(isMainPlayerBall);
    if (pl) spawnDamageText(pl.x, pl.y - 46, `LEVEL UP!  Lv.${game.pLv}`, '#c792ea', 0.016, true);
    playLevelUpFanfare();
    setTimeout(openPowerUp, 900); // 撃破演出のあとに出す
  }
  renderLvGauge();
}
// 経験値は敵を倒すと出る「経験値ジェム」を拾って得る（近づくと吸い寄せられる・しばらくすると自動で飛んでくる）
let expGems = [], lastKillPos = null;
function spawnExpGems(x, y, total) {
  const n = Math.min(8, Math.max(1, Math.round(total / 6)));
  for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, sp = 1.5 + Math.random() * 2.5; expGems.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, v: total / n, born: Date.now(), big: total >= 30 }); }
}
function updateExpGems(speedMult) {
  const pl = balls.find(isMainPlayerBall); if (!pl) return;
  for (const g of expGems) {
    const dx = pl.x - g.x, dy = pl.y - g.y, d = Math.hypot(dx, dy) || 1;
    const age = Date.now() - g.born;
    if (d < 110 || age > 3500) { const sp = Math.min(18, 6 + (age > 3500 ? (age - 3500) / 120 : (110 - d) / 5)); const k = 1 - Math.pow(0.55, speedMult); g.vx += (dx / d * sp - g.vx) * k; g.vy += (dy / d * sp - g.vy) * k; } // 吸い寄せ（高速）
    else { g.vx *= Math.pow(0.9, speedMult); g.vy *= Math.pow(0.9, speedMult); }
    g.x += g.vx * speedMult; g.y += g.vy * speedMult;
    const cp = arenaClampPt(g.x, g.y, 8); g.x = cp.x; g.y = cp.y;
    if (Math.hypot(pl.x - g.x, pl.y - g.y) < pl.radius + 10 || d < Math.hypot(g.vx, g.vy) * speedMult + pl.radius) { g.got = true; gainExp(g.v); playExpGemSound(); }
  }
  expGems = expGems.filter(g => !g.got);
}
// 経験値ダイヤを拾う音：続けて拾うほど音階が上がり、上がりきったらまた下から（ペンタトニックでキラキラ鳴る）
const EXP_GEM_SCALE = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24, 26, 28];
const EXP_GEM_CHAIN_MS = 700;
let expGemChain = -1, expGemLastAt = 0, expGemQueued = 0;
function playExpGemSound() {
  if (!audioCtx || isBattleSfxMuted()) return;
  const now = performance.now();
  if (now - expGemLastAt > EXP_GEM_CHAIN_MS) expGemChain = -1;
  expGemLastAt = now;
  expGemChain = (expGemChain + 1) % EXP_GEM_SCALE.length;
  const f = 1046.5 * Math.pow(2, EXP_GEM_SCALE[expGemChain] / 12); // C6 から
  // 同じフレームでまとめて拾ったときは少しずつずらして鳴らす（音が重ならず駆け上がって聞こえる）
  const delay = Math.min(0.25, expGemQueued * 0.045); expGemQueued++;
  requestAnimationFrame(() => { expGemQueued = 0; });
  thump(f, f, 0.16, 0.06, 'sine', delay);
  thump(f * 2, f * 2, 0.07, 0.02, 'triangle', delay);
  thump(f * 3.01, f * 3.01, 0.04, 0.008, 'sine', delay + 0.01);
}
function drawExpGems() {
  ctx.save();
  for (const g of expGems) {
    const s = g.big ? 6 : 4.5, tw = 0.7 + 0.3 * Math.sin(Date.now() / 120 + g.born);
    ctx.globalAlpha = 1;
    ctx.shadowColor = '#64e8ff'; ctx.shadowBlur = 8 * tw;
    ctx.fillStyle = g.big ? '#c792ea' : '#5fd8ff';
    ctx.beginPath(); ctx.moveTo(g.x, g.y - s * 1.3); ctx.lineTo(g.x + s, g.y); ctx.lineTo(g.x, g.y + s * 1.3); ctx.lineTo(g.x - s, g.y); ctx.closePath(); ctx.fill();
    ctx.shadowBlur = 0; ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.beginPath(); ctx.moveTo(g.x, g.y - s * 1.1); ctx.lineTo(g.x + s * 0.4, g.y - s * 0.2); ctx.lineTo(g.x - s * 0.3, g.y - s * 0.1); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}
function checkPowerUp(isBoss) { const p = lastKillPos || arena; spawnExpGems(p.x, p.y, isBoss ? 40 : 12); }
function compAtkIcon() { // 仲間の攻撃力：仲間タブの絵＋右下に剣
  return `<span class="ico-combo"><img class="ico-img" src="${ICON_IMAGES.tab_companion}" alt=""><span class="ico-badge">⚔️</span></span>`;
}
const PU_EXCLUDED_SKILLS = ['skillParalyze']; // レベルアップ3択に出さないスキル
function buildPowerUpPool() { // 3択パワーアップの候補すべて
  const pool = [];
  const upIds = Object.keys(UPGRADES).filter(id => !['accuracy', 'evasion', 'clash', 'bossDmg', 'critDmg', 'compAtk'].includes(id) && game.upgrades[id] < getUpgradeLevelCap(id)); // 命中率・回避・迫り合い・ボス特攻などは3択に出さない
  for (const id of upIds) { const n = 3 + Math.floor(game.stage / 15); pool.push({ kind: 'up', id, n, col: '#2ea043', label: '強化', icon: id === 'compAtk' ? compAtkIcon() : id === 'atk' ? '⚔️' : ico(UPGRADES[id]), name: `${UPGRADES[id].name} +${n}Lv`, desc: `無料で ${n} レベルアップ` }); }
  for (const id in SKILL_GACHA_SKILLS) {
    if (PU_EXCLUDED_SKILLS.includes(id)) continue;
    const sk = SKILL_GACHA_SKILLS[id], owned = !!game.shopOwned[id];
    if (owned && getSkillLevel(id) >= SKILL_MAX_LEVEL) continue;
    pool.push({ kind: 'skill', id, col: '#8a5bff', label: 'スキル', icon: id === 'skillAtkUp' ? '<span class="ico-combo atkup-ico">🗡️<span class="ico-badge">⏫</span></span>' : ico(sk), name: owned ? `${sk.name} Lv${getSkillLevel(id) + 1}` : `${sk.name} 解放`, desc: sk.desc });
  }
  { // 仲間は個別に選べる：まだいない仲間は「加入」、もういる仲間はレベルアップ
    const room = getCompanionTotal() < getPartyLimit(), lvN = 2 + Math.floor(game.stage / 15);
    const ids = Object.keys(COMPANIONS).filter(id => isCompanionUnlocked(id) && (getCompanionCount(id) > 0 || room)).sort(() => Math.random() - 0.5).slice(0, 3);
    for (const id of ids) {
      const c = COMPANIONS[id], has = getCompanionCount(id) > 0;
      pool.push({ kind: 'compPick', id, n: lvN, col: '#ff9a4f', label: '仲間', icon: companionIconHtml(id), name: has ? `${c.name} Lv+${lvN}` : `${c.name} 加入`, desc: has ? `Lv${(game.companions.level[id] || 0) + 1} → Lv${(game.companions.level[id] || 0) + 1 + lvN}` : '仲間に加わって一緒に戦う' });
    }
  }
  for (const id in RUN_BUFFS) {
    const lv = getRunBuff(id), B = RUN_BUFFS[id];
    if (lv < RUN_BUFF_MAX) pool.push({ kind: 'buff', id, col: '#2f8fe0', label: '強化', icon: B.icon, name: `${B.name} Lv${lv + 1}`, desc: B.desc });
  }
  for (const id in WEAPONS) {
    const lv = getWeaponLv(id), W = WEAPONS[id];
    if (lv >= WEAPON_MAX_LV) continue;
    pool.push({ kind: 'weapon', id, col: '#e0a030', label: '武器', icon: W.icon, name: lv ? `${W.name} Lv${lv + 1}` : `${W.name} 獲得`, desc: lv ? '威力・数・範囲がアップ' : W.desc + '（自動で発動）' });
  }
  pool.push({ kind: 'heal', col: '#ff5c8a', label: '回復', icon: '💗', name: 'HP回復', desc: 'HPと仲間のHPを最大HPの30%回復' });
  pool.push({ kind: 'coin', col: '#ffb14f', label: 'コイン', icon: '🟡', name: 'コインの山', desc: '今の階層に応じたコイン' });
  return pool;
}
function makePowerUpChoices() {
  const pool = buildPowerUpPool();
  const picks = [], kinds = new Set();
  const shuffled = pool.sort(() => Math.random() - 0.5);
  const N = getPowerUpCount();
  for (const c of shuffled) { if (picks.length >= N) break; if (!kinds.has(c.kind) || shuffled.length < 6) { picks.push(c); kinds.add(c.kind); } } // できるだけ別の種類から
  for (const c of shuffled) { if (picks.length >= N) break; if (!picks.includes(c)) picks.push(c); }
  return picks;
}
let powerUpChoices = [];
function openPowerUp() {
  document.querySelector('#powerUpModal .pu-title').innerHTML = `<img class="pu-banner" src="assets/img/ui/levelUp.webp" alt="LEVEL UP!"><span class="pu-lv">Lv.${game.pLv || 1}</span>`;
  if (phase !== 'battle' || getActiveTab() !== 'game') { setTimeout(openPowerUp, 1000); return; } // ゲーム画面に戻ったら出す
  powerUpChoices = makePowerUpChoices();
  renderPowerUp();
  phase = 'paused';
  document.getElementById('powerUpModal').classList.add('show');
  playGachaSound('rare');
  refreshBgm(); // 3択中は明るいレベルアップの曲
  puDeadline = Date.now() + PU_AUTO_MS;
  clearInterval(puTimer); puTimer = setInterval(tickPowerUpTimer, 250); tickPowerUpTimer();
}
// 20秒操作がなければ自動で選ぶ。ジェムで「全部取る」「引き直し」「枠+1（永続）」
const PU_AUTO_MS = 20000, PU_SLOT_MAX = 3;
let puDeadline = 0, puTimer = null;
function getPowerUpCount() { return 3 + Math.min(PU_SLOT_MAX, game.puSlots || 0); }
function getPuAllCost() { return gemPrice(2 * getPowerUpCount()); }
function getPuRerollCost() { return gemPrice(2); }
function getPuSlotCost() { return gemPrice(20 * Math.pow(2, game.puSlots || 0)); }
function renderPowerUp() {
  const list = document.getElementById('powerUpList');
  list.className = 'pu-list n' + powerUpChoices.length;
  list.innerHTML = powerUpChoices.map((c, i) => `<button class="pu-card" style="--pc:${c.col}" data-pu="${i}"><span class="pu-kind">${c.label}</span><span class="pu-icon">${c.icon}</span><span class="pu-name">${c.name}</span><span class="pu-desc">${c.desc}</span></button>`).join('');
  const all = document.getElementById('puAllBtn'), rr = document.getElementById('puRerollBtn'), sl = document.getElementById('puSlotBtn');
  all.innerHTML = `全部取る<br>💎 ${getPuAllCost()}`; all.classList.toggle('is-disabled', game.gems < getPuAllCost());
  rr.innerHTML = `引き直し<br>💎 ${getPuRerollCost()}`; rr.classList.toggle('is-disabled', game.gems < getPuRerollCost());
  const maxed = (game.puSlots || 0) >= PU_SLOT_MAX;
  sl.innerHTML = maxed ? '枠 最大' : `枠+1（転生まで）<br>💎 ${getPuSlotCost()}`; sl.classList.toggle('is-disabled', maxed || game.gems < getPuSlotCost());
}
function tickPowerUpTimer() {
  if (!document.getElementById('powerUpModal').classList.contains('show')) { clearInterval(puTimer); return; }
  const left = Math.max(0, puDeadline - Date.now());
  document.getElementById('puTimer').textContent = `${Math.ceil(left / 1000)} 秒後に自動で選びます`;
  if (left <= 0) { clearInterval(puTimer); startPowerUpSlot(); }
}
// 時間切れ：スロットのように選択枠が回って、だんだん遅くなって止まったカードに自動決定
let puSpinning = false;
function startPowerUpSlot() {
  if (puSpinning || !powerUpChoices.length) return;
  puSpinning = true;
  document.getElementById('puTimer').textContent = '🎰 時間切れ！ 自動で選んでいます…';
  const cards = [...document.querySelectorAll('#powerUpList .pu-card')];
  const win = Math.floor(Math.random() * powerUpChoices.length);
  const steps = cards.length * 4 + win + 1; // 何周か回ってから当たりで止まる
  let i = 0, delay = 55;
  const tick = () => {
    cards.forEach(c => c.classList.remove('slot-hl'));
    const idx = i % cards.length;
    if (cards[idx]) cards[idx].classList.add('slot-hl');
    playTone(900 + idx * 120, 0.04, 'square', 0.05);
    i++;
    if (i >= steps) {
      if (cards[idx]) cards[idx].classList.add('slot-win');
      thump(1046, 1046, 0.25, 0.06, 'square'); thump(1568, 1568, 0.3, 0.04, 'triangle', 0.06);
      setTimeout(() => { puSpinning = false; cards.forEach(c => c.classList.remove('slot-hl', 'slot-win')); finishPowerUp([powerUpChoices[idx]]); }, 650);
      return;
    }
    if (i > steps - 7) delay *= 1.35; // 終わり際にだんだん遅く
    setTimeout(tick, delay);
  };
  tick();
}
function showPowerUpZoom(list) { // 選んだアイコンが大きく拡大しながらフェードアウト
  list.forEach((c, i) => {
    const el = document.createElement('div');
    el.className = 'pu-zoom';
    el.style.setProperty('--pc', c.col || '#ffd76b');
    el.style.left = (50 + (i - (list.length - 1) / 2) * (list.length > 1 ? 22 : 0)) + '%';
    el.innerHTML = `<span class="pu-zoom-icon">${c.icon || '✨'}</span><span class="pu-zoom-name">${c.name}</span>`;
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  });
}
// パワーアップ選択音：上へ駆け上がる「ギュイーン」＋分散和音＋キラキラの余韻で締める
function playPowerUpSound() { // パワーアップ：力がみなぎる上昇チャージ → 一気に駆け上がるアルペジオ → 「ドーン！ジャーン！」と覚醒
  if (!audioCtx || isBattleSfxMuted()) return;
  const t = audioCtx.currentTime, v = game.sfxVolume;
  { // 力がたまっていく上昇音（震えながら高くなる）
    const o = audioCtx.createOscillator(), o2 = audioCtx.createOscillator(), g = audioCtx.createGain(), lfo = audioCtx.createOscillator(), lg = audioCtx.createGain();
    o.type = 'sawtooth'; o2.type = 'square';
    o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(1600, t + 0.42);
    o2.frequency.setValueAtTime(152, t); o2.frequency.exponentialRampToValueAtTime(1612, t + 0.42);
    lfo.frequency.setValueAtTime(10, t); lfo.frequency.linearRampToValueAtTime(30, t + 0.42); lg.gain.value = 0.5; lfo.connect(lg);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.06 * v, t + 0.38); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.46);
    const trem = audioCtx.createGain(); trem.gain.value = 0.6; lg.connect(trem.gain);
    o.connect(trem); o2.connect(trem); trem.connect(g); g.connect(audioCtx.destination);
    [o, o2, lfo].forEach(x => { x.start(t); x.stop(t + 0.48); });
  }
  filteredNoise(0, 0.42, 0.08, 1800, 0.6, 'bandpass'); // ゴォォ…（気が集まる）
  [523, 659, 784, 1047, 1319, 1568, 2093].forEach((f, i) => { thump(f, f, 0.07, 0.05, 'square', 0.26 + i * 0.03); thump(f * 2, f * 2, 0.05, 0.015, 'triangle', 0.26 + i * 0.03); }); // 駆け上がるアルペジオ
  const hit = 0.48;
  thump(150, 40, 0.5, 0.6, 'sine', hit);                    // ドーン
  filteredNoise(hit, 0.5, 0.18, 6000, 0.6, 'highpass');      // シャーン（シンバル）
  [523, 659, 784, 1047].forEach(f => { thump(f, f, 0.9, 0.04, 'square', hit); thump(f * 1.003, f * 1.003, 0.9, 0.03, 'sawtooth', hit); }); // ジャーン（覚醒の和音）
  thump(131, 131, 0.9, 0.08, 'triangle', hit);
  [2637, 3136, 3951, 4699, 5274].forEach((f, i) => thump(f, f, 0.12, 0.02, 'sine', hit + 0.1 + i * 0.06)); // キラキラ
}
function finishPowerUp(list) {
  showPowerUpZoom(list);
  clearInterval(puTimer);
  list.forEach(applyPowerUp);
  document.getElementById('powerUpModal').classList.remove('show');
  refreshBgm(); // 戦闘の曲に戻す
  powerUpPending = false;
  phase = 'battle';
  if ((game.pExp || 0) >= getLvNeed(game.pLv || 1)) gainExp(0); // 溜まっていた分で続けてレベルアップ
  renderLvGauge();
  playPowerUpSound();
  updateStatsUI(); updateHPUI(); saveGame();
}
document.getElementById('powerUpModal').addEventListener('pointerdown', () => { if (!puSpinning) puDeadline = Date.now() + PU_AUTO_MS; }); // タップがあれば時間を戻す
document.getElementById('puAllBtn').addEventListener('click', ev => {
  if (puSpinning) return;
  const cost = getPuAllCost(); if (game.gems < cost) { showTapError('ジェムが足りません', ev.clientX, ev.clientY); return; }
  game.gems -= cost; finishPowerUp(powerUpChoices);
});
document.getElementById('puRerollBtn').addEventListener('click', ev => {
  if (puSpinning) return;
  const cost = getPuRerollCost(); if (game.gems < cost) { showTapError('ジェムが足りません', ev.clientX, ev.clientY); return; }
  game.gems -= cost; powerUpChoices = makePowerUpChoices(); renderPowerUp(); playGachaSound('rare'); updateStatsUI();
});
document.getElementById('puSlotBtn').addEventListener('click', ev => {
  if (puSpinning) return;
  if ((game.puSlots || 0) >= PU_SLOT_MAX) return;
  const cost = getPuSlotCost(); if (game.gems < cost) { showTapError('ジェムが足りません', ev.clientX, ev.clientY); return; }
  game.gems -= cost; game.puSlots = (game.puSlots || 0) + 1;
  const extra = makePowerUpChoices().find(c => !powerUpChoices.some(p => p.kind === c.kind && p.id === c.id));
  if (extra) powerUpChoices.push(extra);
  renderPowerUp(); playRegisterSound(); updateStatsUI(); saveGame();
});
function applyPowerUp(c) {
  if (c.kind === 'up') { game.upgrades[c.id] = Math.min(getUpgradeLevelCap(c.id), game.upgrades[c.id] + c.n); refreshPlayerBallStats(false); }
  else if (c.kind === 'skill') {
    if (!game.skillLevels) game.skillLevels = {};
    if (!game.shopOwned[c.id]) { game.shopOwned[c.id] = true; game.skillLevels[c.id] = 1; const eq = getEquippedSkills(); if (eq.length < getSkillSlots() && !PASSIVE_SKILLS.includes(c.id)) eq.push(c.id); }
    else game.skillLevels[c.id] = Math.min(SKILL_MAX_LEVEL, getSkillLevel(c.id) + 1);
    updateSkillButtonVisibility(); renderSkillGacha();
  } else if (c.kind === 'compPick') {
    const id = c.id, has = getCompanionCount(id) > 0;
    if (has) { game.companions.level[id] = (game.companions.level[id] || 0) + c.n; showNotice(`🐾 ${COMPANIONS[id].name} がレベルアップ！（Lv${game.companions.level[id] + 1}）`); }
    else {
      const r = grantCompanion(id);
      if (game.companions.alive[r.id] && !balls.some(ball => ball.isCompanion && ball.companionId === r.id)) { const cb = makeCompanionBall(r.id); balls.push(cb); spawnHitParticles(cb.x, cb.y, '#ff9a4f'); }
      showNotice(`🐾 ${COMPANIONS[id].name}：${r.label}`);
    }
    refreshCompanionBalls(); refreshPlayerBallStats(false); renderCompanionList();
  } else if (c.kind === 'comp') {
    const r = grantCompanion(pickCompanionId());
    // 選択中は phase が 'battle' ではないため grantCompanion では戦場に出ない → ここで出現させる
    if (game.companions.alive[r.id] && !balls.some(ball => ball.isCompanion && ball.companionId === r.id)) {
      const cb = makeCompanionBall(r.id); balls.push(cb);
      spawnHitParticles(cb.x, cb.y, '#ff9a4f');
    }
    refreshCompanionBalls(); refreshPlayerBallStats(false);
    showNotice(`🐾 ${COMPANIONS[r.id].name}：${r.label}`); renderCompanionList();
  }
  else if (c.kind === 'buff') { if (!game.runBuffs) game.runBuffs = {}; game.runBuffs[c.id] = Math.min(RUN_BUFF_MAX, getRunBuff(c.id) + 1); }
  else if (c.kind === 'weapon') { if (!game.weapons) game.weapons = {}; game.weapons[c.id] = Math.min(WEAPON_MAX_LV, getWeaponLv(c.id) + 1); weaponCd[c.id] = 20; }
  else if (c.kind === 'heal') { const PU_HEAL = 0.3; const pl = balls.find(isMainPlayerBall); if (pl && pl.hp > 0) { const h = Math.min(pl.maxHp - pl.hp, Math.round(pl.maxHp * PU_HEAL)); pl.hp += h; spawnDamageText(pl.x, pl.y - pl.radius - 14, '+' + h + ' HP', '#5fe0a8', 0.012); } balls.forEach(b => { if (b.isCompanion && b.hp > 0) b.hp = Math.min(b.maxHp, b.hp + b.maxHp * PU_HEAL); }); playHealSound(); }
  else if (c.kind === 'coin') { const g = Math.round(getEnemyStats(game.stage).hp * 3 + 50); game.coins += g; const pl = balls.find(isMainPlayerBall); spawnCoinFountain(pl ? pl.x : arena.x, pl ? pl.y : arena.y, g); }
}
document.getElementById('powerUpList').addEventListener('click', ev => {
  const b = ev.target.closest('[data-pu]'); if (!b || puSpinning) return; // スロット中は選べない
  const c = powerUpChoices[+b.dataset.pu]; if (!c) return;
  finishPowerUp([c]);
});
let userPaused = false;
function setUserPaused(on) {
  userPaused = on;
  document.body.classList.toggle('user-paused', on);
  const dbtn = document.getElementById('debugPauseBtn');
  if (dbtn) dbtn.textContent = on ? '▶ 再開（T キー）' : '⏸ 一時停止（T キー）';
  if (audioCtx) { if (on) audioCtx.suspend(); else audioCtx.resume(); } // BGM・効果音も止める
}
document.addEventListener('keydown', ev => {
  if (ev.key !== 't' && ev.key !== 'T') return;
  if (ev.target.closest && ev.target.closest('input, textarea, select, [contenteditable]')) return; // 文字入力中は無視
  if (getActiveTab() !== 'game') return;
  setUserPaused(!userPaused);
});
document.getElementById('pauseBadge').addEventListener('click', () => setUserPaused(false));

function fullReset() {
  if (animId) cancelAnimationFrame(animId);
  clearSave();
  game.stage = 1; game.coins = 0; game.gems = 0; game.superGems = 0;
  game.reincarnations = 0; game.rebirthLv = 0; game.bossLoop = 0; game.bestStage = 1; game.totalKills = 0; game.totalTaps = 0; game.totalBounces = 0; game.maxBounceChain = 0;
  game.upgrades = newUpgradeLevels(); game.coinCloneSlots = 0; game.shopOwned = {}; game.skillLevels = {}; game.skillGachaPulls = 0; game.skillGachaOffer = null; game.skillSlots = 1; game.equippedSkills = [];
  game.gachaShards = { power: 0, vitality: 0, fortune: 0, meteor: 0, chain: 0, critical: 0, critdmg: 0, aim: 0, evade: 0, slayer: 0, counter: 0, rush: 0, bond: 0, guard: 0, pinch: 0, phoenix: 0 };
  game.evolutions = { power: 0, vitality: 0, fortune: 0, meteor: 0, chain: 0, critical: 0, critdmg: 0, aim: 0, evade: 0, slayer: 0, counter: 0, rush: 0, bond: 0, guard: 0, pinch: 0, phoenix: 0 };
  game.ownedArtifacts = {}; game.rebirthChests = []; game.bestiary = {}; game.companionBook = {}; game.companionUnlocks = {}; game.rebirthShopBuys = {}; game.rebirthOfferSlots = 3; game.companionSlots = 1; game.rebirthShopOffer = null; game.rebirthShopVisits = 0; game.rebirthSeenItems = {}; game.rebirthShopNew = []; game.tackleUnlocked = false; game.superTackleUnlocked = false; game.rebirthBonus = { atk: 0, hp: 0, cloneSlots: 0 }; game.skipChallenge = null;
  game.companions = { recruited: {}, awaken: {}, count: {}, level: companionMap(0), hp: companionMap(0), alive: companionMap(true) };
  lastSpecialAt = Date.now() - SPECIAL_COOLDOWN;
  lastAccelAt = Date.now() - ACCEL_COOLDOWN;
  accelEndAt = 0;
  lastHealAt = Date.now() - HEAL_COOLDOWN;
  lastBarrierAt = Date.now() - BARRIER_COOLDOWN;
  barrierHits = 0;
  barrierOrbs = [];
  lastHomingAt = Date.now() - HOMING_COOLDOWN;
  homingMissiles = [];
  lastPoisonAt = Date.now() - POISON_COOLDOWN;
  poisonBuffEndAt = 0;
  lastParalyzeAt = Date.now() - PARALYZE_COOLDOWN;
  lastSleepAt = Date.now() - SLEEP_COOLDOWN;
  lastAtkUpAt = Date.now() - ATK_UP_COOLDOWN;
  atkUpEndAt = 0;
  lastRegenAt = Date.now() - REGEN_COOLDOWN;
  regenEndAt = 0;
  lastSilenceAt = Date.now() - SILENCE_COOLDOWN;
  silenceEndAt = 0;
  lastSacrificeAt = Date.now() - SACRIFICE_COOLDOWN;
  lastDeathAt = Date.now() - SKILL_DEATH_COOLDOWN;
  lastCoinStrikeAt = Date.now() - SKILL_COINSTRIKE_COOLDOWN;
  coinStrikeEndAt = 0;
  lastZeniAt = Date.now() - SKILL_ZENI_COOLDOWN;
  lastMysteryAt = Date.now() - SKILL_MYSTERY_COOLDOWN;
  lastCompRushAt = Date.now() - SKILL_COMPRUSH_COOLDOWN;
  lastNovaAt = Date.now() - SKILL_NOVA_COOLDOWN;
  game.startedAt = Date.now();
  game.playTimeMs = 0;
  particles = []; damageTexts = []; meteors = []; adds = []; clearEnemyTraitObjects(); flyouts = [];
  stageAnnounceTimer = 0;
  hitStopFrames = 0; // ヒットストップをリセット
  resetCombo();
  clearInterval(continueTimer); clearTimeout(rebirthTimer);
  rebirthSkippable = false; gachaDialogOpen = false;
  continueBtn.style.display = 'none';
  giveUpBtn.style.display = 'none';
  dialogCloseBtn.style.display = 'none';
  toast.classList.remove('show');
  gameOverBgm = false; updateSkipBtnVisibility();
  renderArtifactList();
  updateStatsUI();
  balls = spawnBattleBalls();
  refreshPlayerBallStats(true);
  updateHPUI();
  phase = 'battle';
  updateSpecialButton();
  updateAccelButton();
  updateHealButton();
  updateBarrierButton();
  updatePoisonButton();
  updateParalyzeButton();
  updateAtkUpButton();
  updateRegenButton();
  updateSilenceButton();
  updateDeathButton();
  updateCoinStrikeButton();
  updateZeniButton();
  updateMysteryButton();
  updateCompRushButton();
  updateNovaButton();
  startBgm('normal');
  loop();
}

resetBtn.addEventListener('click', fullReset);
usernameSaveBtn.addEventListener('click', () => {
  const name = usernameInput.value.trim().slice(0, 12);
  game.username = name;
  saveGame();
  renderRanking();
  showNotice(name ? `ユーザー名を「${name}」に設定しました` : 'ユーザー名をリセットしました');
});

artifactListEl.addEventListener('click', event => {
  const chip = event.target.closest('[data-artifact]');
  if (!chip) return;
  const artifact = ARTIFACT_BY_ID[chip.dataset.artifact];
  const count = game.ownedArtifacts[chip.dataset.artifact] || 0;
  toastIcon.style.display = 'block';
  toastIcon.innerHTML = ico(artifact);
  toastBig.textContent = artifact.name;
  toastBig.className = 'big stage-clear';
  toastSub.textContent = artifact.desc + (count > 0 ? `　所持数 x${count}` : '　（未所持）');
  continueBtn.style.display = 'none';
  giveUpBtn.style.display = 'none';
  toast.classList.add('show');
  setTimeout(() => { if (phase === 'battle') toast.classList.remove('show'); }, 1800);
});

toast.addEventListener('click', event => {
  if (event.target === continueBtn || event.target === dialogCloseBtn || event.target === giveUpBtn) return;
  if (rebirthChest) { openRebirthChest(); return; } // 宝箱演出中はタップで開封
  if (!rebirthSkippable) return;
  finishRebirth(); // 結果画面は1回のタップで次へ
});

dialogCloseBtn.addEventListener('click', () => {
  if (!gachaDialogOpen) return;
  gachaDialogOpen = false;
  dialogCloseBtn.style.display = 'none';
  toast.classList.remove('show');
  phase = 'battle';
});

// コンテニュー（リトライ）のジェム：序盤（STAGE 30まで）は1個、それ以降は3個
function getContinueCost() { return game.stage <= 30 ? 1 : 3; }
continueBtn.addEventListener('click', event => {
  if (phase !== 'paused') return;
  const contCost = getContinueCost();
  if (game.gems < contCost) {
    clearInterval(continueTimer); // 確認中・ショップにいる間はカウントダウンを止める
    const remaining = Math.max(1000, continueDeadline - Date.now());
    promptGemShortage(contCost, {
      onCancel: () => { continueDeadline = Date.now() + remaining; startContinueCountdown(); },
      onLeave: () => { toast.classList.remove('show'); },
      returnTo: () => { switchTab('game'); onPlayerDeath(false, true); },
      mustResume: true
    });
    return;
  }
  clearInterval(continueTimer);
  game.gems -= contCost;
  continueBtn.style.display = 'none';
  giveUpBtn.style.display = 'none';
  toast.classList.remove('show');
  revivePlayerInPlace();
  meteors = []; adds = []; clearEnemyTraitObjects();
  resetCombo();
  updateStatsUI();
  updateHPUI();
  phase = 'battle';
  showNotice('コンテニュー！', false);
});

giveUpBtn.addEventListener('click', () => {
  if (phase !== 'paused') return;
  clearInterval(continueTimer);
  continueBtn.style.display = 'none';
  giveUpBtn.style.display = 'none';
  reincarnateAfterAd();
});

const DEBUG_ACTION_LABELS = {
  coins: 'DEBUG: コイン +100 を付与しました',
  gems: 'DEBUG: ジェム +10 を付与しました',
  gems1000: 'DEBUG: ジェム +1000 を付与しました',
  coins1000: 'DEBUG: コイン +1000 を付与しました',
  supergems: 'DEBUG: スーパージェム +10000円 を付与しました',
  special: 'DEBUG: メテオ・加速・回復・バリア・ホーミング・毒・麻痺・眠り・攻撃UP・リヒール・魔法封じ・捨て身・即死魔法・コイン攻撃・ゼニ投げ・謎魔法・仲間特攻・全体攻撃のクールダウンをすべてリセットしました',
  prev: 'DEBUG: 1階層戻しました',
  next: 'DEBUG: 1階層進めました',
  nextboss: 'DEBUG: 次のボスの階層までスキップしました',
  tradeBoss: 'DEBUG: 針鎧の王を出現させました',
  swarmStage: 'DEBUG: 次の大群の階層へ移動しました',
  giantBoss: 'DEBUG: 激デカボスを出現させました',
  unlockSkills: 'DEBUG: すべてのスキルを解放しました',
  allCompanions: 'DEBUG: 仲間を全員追加しました',
  clearSubs: 'DEBUG: サブスク（紋章）を解除しました',
  rewardAdReset: 'DEBUG: リワード動画の待ち時間をリセットしました',
};
debugRow.addEventListener('click', event => {
  const button = event.target.closest('[data-debug]');
  if (!button) return;
  const action = button.dataset.debug;
  if (action === 'reload') { saveGame(); location.reload(); return; }
  if (action === 'size') { showGameSize(); return; }
  if (action === 'arenaRect') { // お試しの四角い戦闘エリアと丸を切り替え
    ARENA_RECT = !ARENA_RECT;
    try { localStorage.setItem('arenaRect', ARENA_RECT ? '1' : '0'); } catch (err) {}
    document.body.classList.toggle('arena-rect', ARENA_RECT);
    size = 0; resizeCanvas();
    showNotice('DEBUG: 戦闘エリアを' + (ARENA_RECT ? '四角' : '丸') + 'にしました');
    return;
  } // セーブしてからページを再読み込み
  if (action === 'coins') game.coins += 100;
  if (action === 'gems') game.gems += 10;
  if (action === 'gems1000') game.gems += 1000;
  if (action === 'coins1000') game.coins += 1000;
  if (action === 'supergems') game.superGems += 10000;
  if (action === 'die') {
    const player = balls.find(ball => ball.isPlayer && !ball.isClone && !ball.isCompanion);
    if (phase !== 'battle' || !player) { showNotice('DEBUG: 戦闘中のみ使えます', true); return; }
    player.hp = 0;
    updateHPUI();
    onPlayerDeath();
    return;
  }
  if (action === 'playerHp1' || action === 'enemyHp1') {
    const target = action === 'playerHp1'
      ? balls.find(ball => ball.isPlayer && !ball.isClone && !ball.isCompanion)
      : balls.find(ball => !ball.isPlayer && !ball.isDying);
    if (phase !== 'battle' || !target) { showNotice('DEBUG: 戦闘中のみ使えます', true); return; }
    target.hp = 1;
    updateHPUI();
    showNotice(action === 'playerHp1' ? 'DEBUG: 自分のHPを1にしました' : 'DEBUG: 敵のHPを1にしました');
    return;
  }
  if (action === 'unlockSkills') {
    for (const id in SKILL_GACHA_SKILLS) {
      game.shopOwned[id] = true;
      if (!game.skillLevels) game.skillLevels = {};
      if (!game.skillLevels[id]) game.skillLevels[id] = 1;
    }
    game.skillGachaOffer = null;
    const eq = getEquippedSkills();
    for (const id in SKILL_GACHA_SKILLS) if (eq.length < getSkillSlots() && !eq.includes(id)) eq.push(id);
    renderSkillGacha();
    saveGame();
  }
  if (action === 'pause') { setUserPaused(!userPaused); return; }
  if (action.startsWith('enemy:')) {
    const key = action.slice(6);
    const [kind, val] = key.split(':');
    game.skipChallenge = null;
    if (kind === 'boss') { if (game.stage % 10 !== 0) game.stage = Math.ceil(game.stage / 10) * 10; forcedBossEmoji = val; }
    else { if (game.stage % 10 === 0) game.stage++; forcedEnemyKey = key; }
    game.bestStage = Math.max(game.bestStage, game.stage);
    balls = spawnBattleBalls(); meteors = []; adds = []; clearEnemyTraitObjects();
    balls.forEach(bl => { if (!bl.isPlayer) bl.forceTrait = true; }); // デバッグで出した敵は特徴をかならず使う
    forcedBossEmoji = null; forcedEnemyKey = null;
    refreshPlayerBallStats(true); updateStatsUI(); updateHPUI();
    if (kind === 'boss') showBossWarning();
    startBgm(kind === 'boss' ? 'boss' : 'normal');
    switchTab('game');
    showNotice(`DEBUG: ${button.textContent} を出現`);
    return;
  }
  if (action === 'bgmNow') {
    const info = BGM_INFO.find(b => b.key === currentBgmType);
    const scene = { rebirth: '転生ショップ', gameover: 'ゲームオーバー' }[currentBgmType];
    const msg = !audioCtx || !currentBgmType ? '（まだ音が鳴っていません。画面をタップすると再生されます）'
      : info ? `「${info.name}」 ${info.desc}`
      : scene ? `（${scene}：BGMなし）` : `（${currentBgmType}）`;
    showNotice(`🎶 再生中：${msg}`, false);
    return;
  }
  if (action.startsWith('bgm:')) {
    const key = action.slice(4);
    ensureAudio();
    if (BOSS_BATTLE_SONGS.includes(key)) { battleBgmType = 'boss'; const i = bossBgmOrder.indexOf(key); if (i >= 0) bossBgmIndex = i; }
    else if (!NORMAL_BATTLE_SONGS.includes(key)) battleBgmType = key; // コンテニュー曲など（次のステージで戦闘曲に戻る）
    else { battleBgmType = 'normal'; const i = normalBgmOrder.indexOf(key); if (i >= 0) normalBgmIndex = i; }
    currentBgmType = null;
    refreshBgm();
    showNotice(`DEBUG: BGM「${button.textContent.replace('🎵 ', '')}」を再生中`);
    renderBgmInfo();
    return;
  }
  if (action === 'clearSubs') {
    game.subscriptions = {};
    refreshPlayerBallStats(false);
    if (phase === 'battle') refreshCompanionBalls();
    updateStatsUI(); updateHPUI(); updateRewardAdButtons();
    renderShopList(); renderSupergemShopList(); renderUpgradeList(); renderCoinShopList(); renderCompanionList();
    saveGame();
  }
  if (action === 'allCompanions') {
    const cp = game.companions;
    ['awaken', 'count', 'hp', 'alive'].forEach(k => { if (!cp[k]) cp[k] = {}; });
    if (!game.companionUnlocks) game.companionUnlocks = {};
    if (!game.companionBook) game.companionBook = {};
    for (const id of COMPANION_IDS) {
      if (companionNeedsUnlock(id)) game.companionUnlocks[id] = true;
      game.companionBook[id] = true;
      cp.recruited[id] = true;
      if (!cp.count[id]) cp.count[id] = 1;
      cp.alive[id] = true;
      cp.hp[id] = getCompanionMaxHP(id);
      if (phase === 'battle' && !balls.some(ball => ball.isCompanion && ball.companionId === id)) balls.push(makeCompanionBall(id));
    }
    if (phase === 'battle') refreshCompanionBalls();
    renderCompanionList();
    updateStatsUI();
    saveGame();
  }
  if (action === 'rebirthShop') {
    switchTab('gemshop'); // 転生ショップの商品はショップページにある
    return;
  }
  if (action === 'slots') { openDebugSlots(); return; }
  if (action === 'rewardAdReset') { game.lastRewardAdAt = 0; updateRewardAdButtons(); saveGame(); }
  if (action === 'special') {
    lastSpecialAt = Date.now() - SPECIAL_COOLDOWN;
    lastAccelAt = Date.now() - ACCEL_COOLDOWN;
    accelEndAt = 0;
    lastHealAt = Date.now() - HEAL_COOLDOWN;
    lastBarrierAt = Date.now() - BARRIER_COOLDOWN;
    barrierHits = 0;
    barrierOrbs = [];
    lastHomingAt = Date.now() - HOMING_COOLDOWN;
    lastPoisonAt = Date.now() - POISON_COOLDOWN;
    poisonBuffEndAt = 0;
    updatePoisonButton();
    lastParalyzeAt = Date.now() - PARALYZE_COOLDOWN;
    updateParalyzeButton();
    lastSleepAt = Date.now() - SLEEP_COOLDOWN;
    lastAtkUpAt = Date.now() - ATK_UP_COOLDOWN;
    atkUpEndAt = 0;
    updateAtkUpButton();
    lastRegenAt = Date.now() - REGEN_COOLDOWN;
    regenEndAt = 0;
    updateRegenButton();
    lastSilenceAt = Date.now() - SILENCE_COOLDOWN;
    silenceEndAt = 0;
    updateSilenceButton();
    lastSacrificeAt = Date.now() - SACRIFICE_COOLDOWN;
    lastDeathAt = Date.now() - SKILL_DEATH_COOLDOWN;
    lastCoinStrikeAt = Date.now() - SKILL_COINSTRIKE_COOLDOWN;
    coinStrikeEndAt = 0;
    lastZeniAt = Date.now() - SKILL_ZENI_COOLDOWN;
    lastMysteryAt = Date.now() - SKILL_MYSTERY_COOLDOWN;
    lastCompRushAt = Date.now() - SKILL_COMPRUSH_COOLDOWN;
    updateCompRushButton();
    lastNovaAt = Date.now() - SKILL_NOVA_COOLDOWN;
    updateNovaButton();
    updateDeathButton();
    updateCoinStrikeButton();
    updateZeniButton();
    updateMysteryButton();
    updateSpecialButton();
    updateAccelButton();
    updateHealButton();
    updateBarrierButton();
  }
  if (action === 'prev') game.stage = Math.max(1, game.stage - 1);
  if (action === 'next') game.stage++;
  if (action === 'prev' || action === 'next' || action === 'nextboss' || action === 'tradeBoss') game.skipChallenge = null;
  if (action === 'prev' || action === 'next') {
    game.bestStage = Math.max(game.bestStage, game.stage);
    balls = spawnBattleBalls(); meteors = []; adds = []; clearEnemyTraitObjects();
    refreshPlayerBallStats(true); updateHPUI();
    startBgm(game.stage % 10 === 0 ? 'boss' : 'normal');
  }
  if (action === 'nextboss') {
    game.stage = Math.ceil((game.stage + 1) / 10) * 10;
    game.bestStage = Math.max(game.bestStage, game.stage);
    balls = spawnBattleBalls(); meteors = []; adds = []; clearEnemyTraitObjects();
    refreshPlayerBallStats(true); updateHPUI();
    showBossWarning();
    startBgm('boss');
  }
  if (action === 'giantBoss') {
    if (game.stage % 10 !== 0) game.stage = Math.ceil(game.stage / 10) * 10;
    game.skipChallenge = null;
    game.bestStage = Math.max(game.bestStage, game.stage);
    forcedGiantBoss = true;
    balls = spawnBattleBalls(); meteors = []; adds = []; clearEnemyTraitObjects();
    forcedGiantBoss = false;
    refreshPlayerBallStats(true); updateHPUI();
    showBossWarning();
    startBgm('boss');
  }
  if (action === 'swarmStage') {
    let st = game.stage + 1;
    while (!isSwarmStage(st)) st++;
    game.stage = st;
    game.skipChallenge = null;
    game.bestStage = Math.max(game.bestStage, game.stage);
    balls = spawnBattleBalls(); meteors = []; adds = []; clearEnemyTraitObjects();
    refreshPlayerBallStats(true); updateHPUI();
    stageAnnounceText = game.stage + '階層 大群！';
    stageAnnounceTimer = STAGE_ANNOUNCE_DURATION;
    startBgm('normal');
  }
  if (action === 'tradeBoss') {
    if (game.stage % 10 !== 0) game.stage = Math.ceil(game.stage / 10) * 10;
    game.bestStage = Math.max(game.bestStage, game.stage);
    forcedBossEmoji = TACKLE_TRADE_BOSS;
    balls = spawnBattleBalls(); meteors = []; adds = []; clearEnemyTraitObjects();
    forcedBossEmoji = null;
    refreshPlayerBallStats(true); updateHPUI();
    showBossWarning();
    startBgm('boss');
  }
  if (action === 'saveReset') {
    clearSave();
    fullReset();
    showNotice('DEBUG: セーブデータを削除し、ゲームを最初からやり直しました');
    return;
  }
  if (action === 'loginBonus') {
    checkLoginBonus([15, 45, 90, 240, 600, 2000][Math.floor(Math.random() * 6)] * 60000);
    return;
  }
  updateStatsUI();
  showNotice(DEBUG_ACTION_LABELS[action] || 'DEBUG: 更新しました');
});

upgradeList.addEventListener('click', event => {
  const maxButton = event.target.closest('[data-upgrade-max], [data-upgrade-pct]');
  if (maxButton) {
    if (phase !== 'battle') { showTapError('戦闘中のみ強化できます', event.clientX, event.clientY); return; }
    const isPct = maxButton.dataset.upgradePct !== undefined;
    const id = isPct ? maxButton.dataset.upgradePct : maxButton.dataset.upgradeMax;
    if (game.upgrades[id] >= getUpgradeLevelCap(id)) { showTapError('これ以上強化できません', event.clientX, event.clientY); return; }
    const count = getMaxAffordableUpgradeLevels(id, isPct ? game.coins * PCT_BUDGET : game.coins);
    if (count < 1) { showTapError(isPct ? '手持ちの10%では1Lvも上がりません' : 'コインが足りません', event.clientX, event.clientY); return; }
    const totalCost = sumUpgradeCost(id, game.upgrades[id], count);
    spendCoins(totalCost);
    game.upgrades[id] += count;
    refreshPlayerBallStats(false);
    playUpgradeSound();
    showNotice(`${UPGRADES[id].name} を ${count}Lv 一括強化！`);
    showUpgradeLevelUpPop(id, event.clientX, event.clientY, `レベルアップ！ +${count}Lv`);
    updateStatsUI();
    updateHPUI();
    return;
  }
  const button = event.target.closest('[data-upgrade]');
  if (button && consumeHoldClick()) return; // 長押しで連続強化した直後のクリックは無視
  if (!button || phase !== 'battle') { showTapError('戦闘中のみ強化できます', event.clientX, event.clientY); return; }
  levelUpUpgrade(button.dataset.upgrade, event.clientX, event.clientY);
});
function showLevelUpPop(x, y, text) {
  const el = document.createElement('div');
  el.className = 'levelup-pop';
  el.textContent = text;
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  document.body.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
}
function showUpgradeLevelUpPop(id, x, y, text) {
  const item = upgradeList.querySelector(`[data-upgrade="${id}"]`);
  if (item) { const r = item.getBoundingClientRect(); x = r.left + r.width / 2; y = r.top + r.height / 2; }
  showLevelUpPop(x, y, text);
}
// オート強化：ONにすると、たまったコインで攻撃力・最大HPのうち安い方を自動で上げ続ける（放置向け）
const AUTO_UPGRADE_IDS = ['atk', 'hp'];
function renderAutoUpgradeBtn() {
  const b = document.getElementById('autoUpgradeBtn'); if (!b) return;
  b.textContent = game.autoUpgrade ? '🤖 オート強化 ON（攻撃力・HPを自動で強化）' : '🤖 オート強化 OFF（タップでON）';
  b.classList.toggle('off', !game.autoUpgrade);
}
document.getElementById('autoUpgradeBtn').addEventListener('click', () => { game.autoUpgrade = !game.autoUpgrade; renderAutoUpgradeBtn(); saveGame(); });
setInterval(() => {
  if (!game.autoUpgrade || phase !== 'battle') return;
  let bought = 0;
  for (let n = 0; n < 20; n++) {
    const id = AUTO_UPGRADE_IDS.filter(k => UPGRADES[k] && game.upgrades[k] < getUpgradeLevelCap(k)).sort((x, y) => getUpgradeCost(x) - getUpgradeCost(y))[0];
    if (!id || game.coins < getUpgradeCost(id)) break;
    spendCoins(getUpgradeCost(id)); game.upgrades[id]++; bought++;
  }
  if (!bought) return;
  refreshPlayerBallStats(false); updateStatsUI(); updateHPUI();
  const pl = balls.find(isMainPlayerBall);
  if (pl && getActiveTab() === 'game') spawnDamageText(pl.x, pl.y - pl.radius - 30, `🤖 オート強化 +${bought}`, '#7fe8a0', 0.03);
}, 1500);
function levelUpUpgrade(id, x, y) {
  if (phase !== 'battle') { showTapError('戦闘中のみ強化できます', x, y); return false; }
  if (game.upgrades[id] >= getUpgradeLevelCap(id)) { showTapError('これ以上強化できません', x, y); return false; }
  const cost = getUpgradeCost(id);
  if (game.coins < cost) { showTapError('コインが足りません', x, y); return false; }
  spendCoins(cost);
  game.upgrades[id]++;
  refreshPlayerBallStats(false);
  playUpgradeSound();
  showUpgradeLevelUpPop(id, x, y, `レベルアップ！ Lv.${game.upgrades[id]}`);
  updateStatsUI();
  updateHPUI();
  return true;
}

shopList.addEventListener('click', event => {
  const button = event.target.closest('[data-shop]');
  if (!button) return;
  const id = button.dataset.shop;
  const item = SHOP_ITEMS[id];
  if (isShopItemOwned(id)) { showTapError(item.unlockKey ? 'すでに開放しています' : item.stackKey ? 'これ以上強化できません' : 'すでに所持しています', event.clientX, event.clientY); return; }
  if (item.requires && !game[item.requires]) { showTapError('先にタックルを開放してください', event.clientX, event.clientY); return; }
  const gcost = gemPrice(getShopItemBaseCost(id));
  if (game.gems < gcost) { promptGemShortage(gcost); return; }
  game.gems -= gcost;
  if (item.consumableKey) { game[item.consumableKey] = (game[item.consumableKey] || 0) + 1; updatePotionButton(); }
  else if (item.stackKey) game[item.stackKey] = (game[item.stackKey] || 0) + 1;
  else if (item.unlockKey) game[item.unlockKey] = true; else game.shopOwned[id] = true;
  renderShopList();
  refreshPlayerBallStats(false);
  playRegisterSound();
  updateStatsUI();
  updateHPUI();
});

const potionBtn = document.getElementById('potionBtn');
function updatePotionButton() {
  const n = game.potions || 0;
  const html = `🧪<b>×${n}</b>`;
  if (potionBtn.dataset.html !== html) { potionBtn.innerHTML = html; potionBtn.dataset.html = html; }
  potionBtn.classList.toggle('is-disabled', n <= 0);
}
potionBtn.addEventListener('click', event => {
  if ((game.potions || 0) <= 0) { promptGemShortage(0, { title: '回復ポーションがありません', text: 'ショップで回復ポーションを買いますか？', silent: true, icon: '🧪' }); return; }
  const player = balls.find(ball => isMainPlayerBall(ball));
  if (phase !== 'battle' || !player) { showTapError('戦闘中のみ使用できます', event.clientX, event.clientY); return; }
  if (player.hp >= player.maxHp) { showTapError('HPが満タンです', event.clientX, event.clientY); return; }
  game.potions--;
  const heal = Math.round(player.maxHp * POTION_HEAL_RATIO);
  player.hp = Math.min(player.maxHp, player.hp + heal);
  spawnDamageText(player.x, player.y - player.radius - 12, '🧪 +' + heal + ' HP', '#7ee787');
  spawnHitParticles(player.x, player.y, '#7ee787');
  playHealSound();
  updatePotionButton();
  updateHPUI();
  saveGame();
});
coinShopList.addEventListener('click', event => {
  const button = event.target.closest('[data-coin-shop]');
  if (!button || phase !== 'battle') { showTapError('戦闘中のみ使用できます', event.clientX, event.clientY); return; }
  const id = button.dataset.coinShop;
  const item = COIN_SHOP_ITEMS[id];
  const cost = coinPrice(id === 'cloneSlot' ? item.cost * (game.coinCloneSlots + 1) : item.cost);
  if (game.coins < cost) { showTapError('コインが足りません', event.clientX, event.clientY); return; }
  if (id === 'cloneSlot') {
    game.coinCloneSlots++;
  }
  spendCoins(cost);
  playRegisterSound();
  updateStatsUI();
  updateHPUI();
});

document.getElementById('skillLevelList').addEventListener('click', event => {
  const buy = event.target.closest('[data-skill-buy]');
  const equip = event.target.closest('[data-skill-equip]');
  if (buy) {
    const id = buy.dataset.skillBuy;
    const sk = SKILL_GACHA_SKILLS[id];
    const owned = !!game.shopOwned[id];
    if (owned && getSkillLevel(id) >= SKILL_MAX_LEVEL) { showTapError('Lv MAX です', event.clientX, event.clientY); return; }
    const cost = getSkillBuyCost(id);
    if (game.coins < cost) { showTapError(`コインが ${formatCoinNumber(cost - Math.floor(game.coins))} 枚不足しています`, event.clientX, event.clientY); return; }
    spendCoins(cost);
    if (!game.skillLevels) game.skillLevels = {};
    if (!owned) {
      game.shopOwned[id] = true; game.skillLevels[id] = 1;
      const eq = getEquippedSkills();
      if (eq.length < getSkillSlots()) { eq.push(id); lastSetSkill = id; } // 空き枠があれば自動で装備
    } else game.skillLevels[id] = Math.min(SKILL_MAX_LEVEL, getSkillLevel(id) + 1);
    showNotice(!owned ? `${sk.icon} ${sk.name} スキルを解放！` : `${sk.icon} ${sk.name} スキルが Lv${game.skillLevels[id]} に！`);
    showLevelUpPop(event.clientX, event.clientY, !owned ? '解放！' : `Lv${game.skillLevels[id]}！`);
    playUpgradeSound();
    updateStatsUI();
    renderCoinShopList();
    saveGame();
    return;
  }
  if (equip) {
    const id = equip.dataset.skillEquip;
    if (PASSIVE_SKILLS.includes(id)) { showNotice(`${SKILL_GACHA_SKILLS[id].name} は取得するだけで常に効きます（セット不要）`); return; }
    const eq = getEquippedSkills();
    if (eq.includes(id)) eq.splice(eq.indexOf(id), 1);
    else if (eq.length >= getSkillSlots()) {
      const out = eq.pop();
      eq.push(id);
      lastSetSkill = id;
      showNotice(`${SKILL_GACHA_SKILLS[out].name} と入れ替えて ${SKILL_GACHA_SKILLS[id].name} をセット`);
    } else { eq.push(id); lastSetSkill = id; }
    playTone(880, 0.06, 'triangle', 0.1);
    renderCoinShopList();
    saveGame();
  }
});
document.getElementById('skillDeck').addEventListener('click', event => {
  if (event.target.closest('.deck-card.locked')) { openSkillSlotConfirm(); return; }
  if (event.target.closest('.deck-card.empty')) {
    const list = document.getElementById('skillLevelList');
    const target = list.querySelector('[data-skill-equip]:not(.on)') || list.querySelector('[data-skill-buy]:not(.is-disabled)') || list.querySelector('.sk-card');
    const cardEl = target && target.closest('.sk-card');
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      cardEl.classList.remove('sk-flash'); void cardEl.offsetWidth; cardEl.classList.add('sk-flash');
      if (!list.querySelector('[data-skill-equip]:not(.on)')) showNotice('装備できるスキルがありません。まずスキルを解放しましょう');
    }
    return;
  }
  const card = event.target.closest('[data-skill-equip]');
  if (!card) return;
  const eq = getEquippedSkills();
  const i = eq.indexOf(card.dataset.skillEquip);
  if (i >= 0) eq.splice(i, 1);
  playTone(660, 0.06, 'triangle', 0.1);
  renderCoinShopList();
  saveGame();
});
// ゲーム画面から取得済みスキルのセットを入れ替える
const skillSetModal = document.getElementById('skillSetModal');
function renderSkillSetModal() {
  const eq = getEquippedSkills(), slots = getSkillSlots();
  document.getElementById('skillSetHead').textContent = `セット中 ${eq.length} / ${slots}（タップでセット／外す）`;
  document.getElementById('skillSetGrid').innerHTML = SKILL_ORDER.filter(id => game.shopOwned[id] && !PASSIVE_SKILLS.includes(id)).map(id => {
    const sk = SKILL_GACHA_SKILLS[id], lv = getSkillLevel(id);
    return `<button class="ss-card ${eq.includes(id) ? 'on' : ''}" data-skill-set="${id}">${ico(sk)}<span>${sk.name}</span><span class="ss-lv">${lv >= SKILL_MAX_LEVEL ? 'Lv MAX' : 'Lv' + lv}</span></button>`;
  }).join('');
}
document.getElementById('skillSetBtn').addEventListener('click', () => { renderSkillSetModal(); skillSetModal.classList.add('show'); });
document.getElementById('skillSetCloseBtn').addEventListener('click', () => skillSetModal.classList.remove('show'));
document.getElementById('skillSetGrid').addEventListener('click', event => {
  const card = event.target.closest('[data-skill-set]'); if (!card) return;
  const id = card.dataset.skillSet, eq = getEquippedSkills();
  if (eq.includes(id)) eq.splice(eq.indexOf(id), 1);
  else if (eq.length >= getSkillSlots()) { const out = eq.pop(); eq.push(id); showNotice(`${SKILL_GACHA_SKILLS[out].name} と入れ替えて ${SKILL_GACHA_SKILLS[id].name} をセット`); }
  else eq.push(id);
  lastSetSkill = id;
  playTone(880, 0.06, 'triangle', 0.1);
  renderSkillSetModal(); renderCoinShopList(); updateSkillButtonVisibility(); saveGame();
});
const skillSlotModal = document.getElementById('skillSlotModal');
function openSkillSlotConfirm() {
  const slots = getSkillSlots();
  if (slots >= SKILL_SLOT_MAX) return;
  const cost = getSkillSlotCost();
  document.getElementById('skillSlotModalText').textContent = `💎${cost} 消費して、スキル枠を ${slots} → ${slots + 1} に増やしますか？\n（所持ジェム 💎${Math.floor(game.gems).toLocaleString('ja-JP')}）`;
  document.getElementById('skillSlotYesBtn').textContent = `💎${cost} で枠を増やす`;
  skillSlotModal.classList.add('show');
}
document.getElementById('skillSlotYesBtn').addEventListener('click', event => {
  skillSlotModal.classList.remove('show');
  document.getElementById('skillSlotBtn').dispatchEvent(new MouseEvent('click', { clientX: event.clientX, clientY: event.clientY, bubbles: true }));
});
document.getElementById('skillSlotNoBtn').addEventListener('click', () => skillSlotModal.classList.remove('show'));
document.getElementById('skillSlotBtn').addEventListener('click', event => {
  const slots = getSkillSlots();
  if (slots >= SKILL_SLOT_MAX) { showTapError('スキル枠は最大です', event.clientX, event.clientY); return; }
  const cost = getSkillSlotCost();
  if (game.gems < cost) { promptGemShortage(cost, { returnTo: () => switchTab('coinshop') }); return; }
  game.gems -= cost;
  game.skillSlots = slots + 1;
  showNotice(`🎒 スキル枠が ${game.skillSlots} つになりました`);
  playRegisterSound();
  updateStatsUI();
  renderCoinShopList();
  saveGame();
});

supergemShopList.addEventListener('click', event => {
  const subBtn = event.target.closest('[data-sub-shop]');
  if (subBtn) { buySubscription(subBtn.dataset.subShop, event); return; }
  const button = event.target.closest('[data-supergem-shop]');
  if (!button) return;
  const id = button.dataset.supergemShop;
  const item = SUPERGEM_SHOP_ITEMS[id];
  if (game.superGems < item.cost) { showTapError('スーパージェムが足りません', event.clientX, event.clientY); return; }
  game.superGems -= item.cost;
  const gain = { small: 20, medium: 110, large: 605, huge: 1331 }[id] || 0;
  game.gems += gain;
  updateStatsUI();
  celebrateGemPurchase({ small: 1, medium: 2, large: 3, huge: 4 }[id] || 1, gain);
  saveGame();
});

document.getElementById('partySlotBtn').addEventListener('click', event => {
  const lim = getPartyLimit();
  if (lim >= COMPANION_PARTY_MAX) { showTapError('パーティ枠は最大です', event.clientX, event.clientY); return; }
  const cost = getPartySlotCost();
  if (game.gems < cost) { promptGemShortage(cost, { returnTo: () => switchTab('companion') }); return; }
  game.gems -= cost;
  game.companionSlots = lim + 1;
  showNotice(`🐾 パーティ枠が ${game.companionSlots} 人になりました`);
  playRegisterSound();
  updateStatsUI();
  renderCompanionList();
  saveGame();
});
function buySubscription(id, event) {
  const sub = SUBSCRIPTIONS[id];
  const active = getActiveSub();
  if (!isSubActive(id) && active && active.rank > sub.rank) { showTapError('上位の紋章が有効です', event.clientX, event.clientY); return; }
  if (game.superGems < sub.cost) { showTapError('スーパージェムが足りません', event.clientX, event.clientY); return; }
  game.superGems -= sub.cost;
  if (!game.subscriptions) game.subscriptions = {};
  const from = Math.max(Date.now(), game.subscriptions[id] || 0); // 加入中なら残り期間に上乗せ
  game.subscriptions[id] = from + SUBSCRIPTION_DAYS * 86400000;
  refreshPlayerBallStats(false);
  if (typeof refreshCompanionBalls === 'function' && phase === 'battle') refreshCompanionBalls();
  updateStatsUI();
  updateHPUI();
  updateRewardAdButtons();
  renderShopList(); renderSupergemShopList(); renderUpgradeList(); renderCoinShopList(); renderCompanionList();
  celebrateGemPurchase(id === 'hero' ? 4 : 3, 0, { title: id === 'hero' ? '勇者の証、授かる！' : '熟練者の証、授かる！', countText: `${sub.icon} ${sub.name}` });
  saveGame();
}
const GEM_CELEBRATE = {
  1: { title: 'ありがとう！', color: '#64c8ff', gems: 18, ms: 2600 },
  2: { title: '大感謝！！', color: '#b07cff', gems: 45, ms: 3400 },
  3: { title: '超・大感謝！！！', color: '#ffc94f', gems: 90, ms: 4300 },
  4: { title: '神・降・臨！！！！', color: '#ff5fd2', gems: 160, ms: 5500 },
};
function celebrateGemPurchase(tier, gain, opts = {}) {
  const cfg = { ...GEM_CELEBRATE[tier], ...(opts.title ? { title: opts.title } : {}) };
  const ov = document.createElement('div');
  ov.className = `gem-celebrate tier-${tier}`;
  ov.style.setProperty('--gc-color', cfg.color);
  let html = '<div class="gcel-bg"></div>';
  if (tier >= 3) html += '<div class="gcel-rays"></div>';
  for (let i = 0; i < cfg.gems; i++) {
    const size = 14 + Math.random() * (10 + tier * 8);
    html += `<span class="gcel-gem" style="left:${Math.random() * 100}%;font-size:${size}px;animation-delay:${(Math.random() * cfg.ms * 0.6) | 0}ms;animation-duration:${1200 + Math.random() * 1400}ms">${Math.random() < 0.15 * tier ? '✨' : '💎'}</span>`;
  }
  html += `<div class="gcel-center"><div class="gcel-title">${cfg.title}</div><div class="gcel-bag">💰</div><div class="gcel-count">${opts.countText ? `<b class="gcel-subname">${opts.countText}</b>` : '💎 +<span>0</span>'}</div><div class="gcel-sub">タップで閉じる</div></div>`;
  ov.innerHTML = html;
  document.body.appendChild(ov);
  if (tier >= 2) document.body.classList.add('gcel-shake-' + tier);
  const countEl = ov.querySelector('.gcel-count span') || { set textContent(v) {} };
  const start = performance.now(), countMs = 700 + tier * 350;
  const tick = now => {
    const t = Math.min(1, (now - start) / countMs);
    countEl.textContent = Math.round(gain * (1 - Math.pow(1 - t, 3))).toLocaleString('ja-JP');
    if (t < 1 && ov.isConnected) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  playLoginBonusSound();
  if (tier >= 2) setTimeout(() => playGachaSound('epic'), 450);
  if (tier >= 3) { setTimeout(() => playGachaSound('legendary'), 900); setTimeout(() => playNoiseBurst(0.5, 0.18), 900); }
  if (tier >= 4) { setTimeout(() => playGachaSound('legendary'), 1500); setTimeout(() => playLoginBonusSound(), 2000); setTimeout(() => playGachaSound('legendary'), 2500); }
  let closed = false;
  const close = () => {
    if (closed) return;
    closed = true;
    document.body.classList.remove('gcel-shake-2', 'gcel-shake-3', 'gcel-shake-4');
    ov.classList.add('closing');
    setTimeout(() => ov.remove(), 350);
  };
  setTimeout(() => ov.addEventListener('click', close), 600);
  setTimeout(close, cfg.ms);
}

function playGachaSound(rarity) {
  const tablesByRarity = {
    common: [523.25, 659.25],
    rare: [523.25, 659.25, 783.99],
    epic: [440, 554.37, 659.25, 880],
    legendary: [392, 523.25, 659.25, 783.99, 1046.5, 1318.5]
  };
  const notes = tablesByRarity[rarity] || tablesByRarity.common;
  notes.forEach((f, i) => setTimeout(() => playTone(f, 0.22, 'triangle', 0.2), i * 90));
  if (rarity === 'legendary' || rarity === 'epic') playNoiseBurst(0.3, 0.15);
}
function playGachaSummonSound() {
  [220, 277.18, 349.23, 440].forEach((f, i) => setTimeout(() => playTone(f, 0.35, 'sine', 0.1, f * 1.5), i * 260));
}

const GACHA_LOADING_MS_BY_RARITY = { common: 1500, rare: 1800, epic: 2200, legendary: 2800 };
function getGachaLoadingMs(rarity) { return GACHA_LOADING_MS_BY_RARITY[rarity] || 1500; }
function playGachaBuildUpSound(hintRarity) {
  const GACHA_LOADING_MS = getGachaLoadingMs(hintRarity);
  const steps = Math.round(9 * GACHA_LOADING_MS / 1000);
  for (let i = 0; i < steps; i++) {
    setTimeout(() => {
      const f = 330 * Math.pow(Math.pow(2.3, 1 / steps), i * 1.6);
      playTone(f, 0.09, 'square', 0.05 + i / steps * 0.07, f * 1.5);
      if (i % 2 === 0) playNoiseBurst(0.03, 0.05 + i / steps * 0.08);
    }, i * (GACHA_LOADING_MS / steps));
  }
  if (hintRarity === 'epic' || hintRarity === 'legendary') thump(60, 120, GACHA_LOADING_MS / 1000 * 0.9, 0.25, 'sawtooth');
  setTimeout(() => { noiseSweep(0.35, 8000, 1200, 'highpass', 0.7, 0.35); thump(90, 40, 0.3, 0.5); }, GACHA_LOADING_MS - 40); // シャーン！
}
function runGachaCountdown(hintRarity, onDone) {
  gachaResult.style.display = 'block';
  gachaResult.style.background = '';
  gachaResult.className = 'gacha-result gacha-summoning gc-building rarity-bg-' + hintRarity;
  const col = RARITY_INFO[hintRarity].color;
  const dur = getGachaLoadingMs(hintRarity);
  gachaResult.style.setProperty('--gc-dur', dur + 'ms'); // CSSアニメの長さも合わせる
  gachaResult.innerHTML = `<div class="gc-stage" style="--gc-color:${col}"><div class="gc-ring"></div><div class="gc-ring gc-ring2"></div><div class="gc-orb">🔮</div></div><div class="gr-title gc-text" style="--gc-color:${col}">召喚中！！</div><div class="gc-bar"><div class="gc-fill" style="background:${col}"></div></div>`;
  playGachaBuildUpSound(hintRarity);
  setTimeout(() => {
    gachaResult.classList.remove('gc-building');
    onDone();
    gachaResult.classList.add('gc-flash');
    setTimeout(() => gachaResult.classList.remove('gc-flash'), 500);
  }, dur);
}

gachaBtn.addEventListener('click', event => {
  if (game.gems < 5) { promptGemShortage(5, { returnTo: () => switchTab('gacha') }); return; }
  if (gachaBtn.disabled) return;
  gachaBtn.disabled = true; gacha10Btn.disabled = true;
  game.gems -= 5;
  const id = pickGachaId(); // 排出結果は先に決定し、カウントダウン中の背景で予感させる
  runGachaCountdown(GACHA_POOL[id].rarity, () => {
    game.evolutions[id]++;
    refreshPlayerBallStats(false);
    updateStatsUI();
    updateHPUI();
    const result = GACHA_POOL[id];
    const rarity = RARITY_INFO[result.rarity];
    playGachaSound(result.rarity);
    gachaResult.className = 'gacha-result rarity-' + result.rarity;
    gachaResult.style.background = rarityBackground(result.rarity);
    gachaResult.innerHTML = `<div class="gr-icon gr-pop">${ico(result)}</div><div class="gr-sparkle">✨🌟✨</div><div class="gr-title gr-pop" style="color:${rarity.color}">${rarityStars(result.rarity)} ${result.name}</div><div class="gr-sub">Lv.${game.evolutions[id]} に進化！（${result.desc}）</div><button id="gachaResultCloseBtn">閉じる</button>`;
    document.getElementById('gachaResultCloseBtn').addEventListener('click', () => { gachaResult.style.display = 'none'; });
    gachaBtn.disabled = false; gacha10Btn.disabled = false;
    updateStatsUI();
  });
});

const GACHA_AUTO_OPEN_INTERVAL_MS = 650;
function autoOpenGachaResults(results, onAllDone) {
  gachaResult.className = 'gacha-result';
  gachaResult.style.background = '';
  const cards = results.map((r, i) => `<div class="gm-item gm-hidden" data-gm="${i}"><div class="gm-face">❔</div><span class="gm-name">&nbsp;<br>&nbsp;</span></div>`).join('');
  gachaResult.innerHTML = `<div class="gr-title">🌟 10連召喚結果 🌟</div><div class="gacha-multi-grid">${cards}</div><div class="gr-sub" id="gachaAutoOpenHint">タップで一気に開封</div>`;
  let idx = 0;
  let timer = null;
  const open = (i, withSound) => {
    const r = results[i];
    const rarity = RARITY_INFO[r.rarity];
    const el = gachaResult.querySelector(`[data-gm="${i}"]`);
    el.classList.remove('gm-hidden');
    el.classList.add('gm-open', 'rarity-' + r.rarity);
    el.style.border = `1px solid ${rarity.color}`;
    el.style.background = rarityBackground(r.rarity);
    el.innerHTML = `<div class="gm-face">${ico(r)}</div><span class="gm-name">${rarityStars(r.rarity)}<br>${r.name.replace('の欠片', '')}</span>`;
    if (withSound) playGachaSound(r.rarity);
  };
  const finish = () => {
    clearInterval(timer);
    gachaResult.removeEventListener('click', skipAll);
    const bestRarity = results.reduce((best, r) => RARITY_INFO[r.rarity].needMult < RARITY_INFO[best.rarity].needMult ? r : best, results[0]).rarity;
    gachaResult.className = 'gacha-result rarity-' + bestRarity;
    const hint = document.getElementById('gachaAutoOpenHint');
    if (hint) hint.remove();
    onAllDone();
  };
  const step = () => {
    open(idx, true);
    idx++;
    if (idx >= results.length) finish();
  };
  const skipAll = () => {
    if (idx >= results.length) return;
    for (; idx < results.length; idx++) open(idx, false);
    const bestRarity = results.reduce((best, r) => RARITY_INFO[r.rarity].needMult < RARITY_INFO[best.rarity].needMult ? r : best, results[0]).rarity;
    playGachaSound(bestRarity);
    finish();
  };
  gachaResult.addEventListener('click', skipAll);
  timer = setInterval(step, GACHA_AUTO_OPEN_INTERVAL_MS);
}

gacha10Btn.addEventListener('click', event => {
  if (game.gems < 45) { promptGemShortage(45, { returnTo: () => switchTab('gacha') }); return; }
  if (gachaBtn.disabled) return;
  gachaBtn.disabled = true; gacha10Btn.disabled = true;
  game.gems -= 45;
  const ids = []; // 排出結果は先に決定し、カウントダウン中の背景で予感させる
  for (let i = 0; i < 10; i++) ids.push(pickGachaId());
  const bestRarityForHint = ids.reduce((best, id) => RARITY_INFO[GACHA_POOL[id].rarity].needMult < RARITY_INFO[best].needMult ? GACHA_POOL[id].rarity : best, GACHA_POOL[ids[0]].rarity);
  runGachaCountdown(bestRarityForHint, () => {
    const results = ids.map(id => { game.evolutions[id]++; return { id, ...GACHA_POOL[id] }; });
    refreshPlayerBallStats(false);
    updateStatsUI();
    updateHPUI();
    autoOpenGachaResults(results, () => {
      const closeBtn = document.createElement('button');
      closeBtn.textContent = '閉じる';
      closeBtn.addEventListener('click', () => { gachaResult.style.display = 'none'; });
      gachaResult.appendChild(closeBtn);
      gachaBtn.disabled = false; gacha10Btn.disabled = false;
      updateStatsUI();
    });
  });
});

evolutionList.addEventListener('click', event => {
  const button = event.target.closest('[data-evolve]');
  if (!button) return;
  const id = button.dataset.evolve;
  const need = getEvolveNeed(id);
  if (game.gachaShards[id] < need) { showTapError('進化用の欠片が足りません', event.clientX, event.clientY); return; }
  game.gachaShards[id] -= need;
  game.evolutions[id]++;
  refreshPlayerBallStats(false);
  playUpgradeSound();
  updateStatsUI();
  updateHPUI();
});

companionList.addEventListener('click', event => {
  const infoTile = event.target.closest('[data-comp-info]');
  if (infoTile) { compInfoId = compInfoId === infoTile.dataset.compInfo ? null : infoTile.dataset.compInfo; renderCompanionList(); return; }
  const maxBtn = event.target.closest('[data-companion-level-max], [data-companion-level-pct]');
  if (maxBtn) {
    const isPct = maxBtn.dataset.companionLevelPct !== undefined;
    const id = isPct ? maxBtn.dataset.companionLevelPct : maxBtn.dataset.companionLevelMax;
    if (phase !== 'battle') { showTapError('戦闘中のみレベルアップできます', event.clientX, event.clientY); return; }
    const { count, total } = getCompanionMaxLevels(id, isPct ? game.coins * PCT_BUDGET : game.coins);
    if (count < 1) { showTapError(isPct ? '手持ちの10%では1Lvも上がりません' : 'コインが足りません', event.clientX, event.clientY); return; }
    spendCoins(total);
    game.companions.level[id] += count;
    refreshPlayerBallStats(false);
    refreshCompanionBalls();
    playUpgradeSound();
    showNotice(`${COMPANIONS[id].name} が Lv.${game.companions.level[id]} に！（+${count}）`);
    updateStatsUI();
    updateHPUI();
    renderCompanionList();
    return;
  }
  const levelBtn = event.target.closest('[data-companion-level]');
  if (levelBtn) {
    if (consumeHoldClick()) return;
    levelUpCompanion(levelBtn.dataset.companionLevel, event.clientX, event.clientY);
  }
});
function levelUpCompanion(id, x, y) {
  const cost = getCompanionLevelCost(id);
  if (phase !== 'battle') { showTapError('戦闘中のみレベルアップできます', x, y); return false; }
  if (game.coins < cost) { showTapError('コインが足りません', x, y); return false; }
  spendCoins(cost);
  game.companions.level[id]++;
  refreshPlayerBallStats(false);
  refreshCompanionBalls();
  playUpgradeSound();
  updateStatsUI();
  updateHPUI();
  return true;
}

const HOLD_DELAY_MS = 400;
const HOLD_FIRST_INTERVAL_MS = 150;
const HOLD_MIN_INTERVAL_MS = 40;
const HOLD_TARGETS = [
  { attr: 'upgrade', action: levelUpUpgrade },
  { attr: 'companionLevel', action: levelUpCompanion },
  { attr: 'rebirthShop', action: (id, x, y) => buyRebirthItem(id, x, y, true) },
  { attr: 'goalClaim', action: claimRecordGoal }, // 戦績の報酬は押しっぱなしで一気に受け取れる
];
let holdTimer = null;
let holdRepeated = false;
// 押しっぱなし中の合計（回数・レベル・能力値・消費コイン/ジェム）を指の近くに出す
const holdSum = document.createElement('div'); holdSum.className = 'hold-sum'; document.body.appendChild(holdSum);
let holdSnap = null, holdSumTimer = null;
function holdLevel(t, id) { return t.attr === 'upgrade' ? game.upgrades[id] : t.attr === 'companionLevel' ? game.companions.level[id] : 0; }
function showHoldSum() {
  if (!holdSnap || !holdSnap.n) return;
  const { t, id } = holdSnap, dc = game.coins - holdSnap.coins, dg = game.gems - holdSnap.gems, dl = holdLevel(t, id) - holdSnap.level;
  const parts = [dl ? `<b>Lv +${dl}</b>` : `<b>×${holdSnap.n}</b>`];
  if (t.attr === 'upgrade') parts.push(`${formatUpgradeStat(id, holdSnap.stat)} → <b>${formatUpgradeStat(id, getUpgradeStatValue(id))}</b>`);
  if (dc) parts.push(`🟡 ${dc > 0 ? '+' : '-'}${formatCoinNumber(Math.abs(dc))}`);
  if (dg) parts.push(`💎 ${dg > 0 ? '+' : '-'}${Math.floor(Math.abs(dg)).toLocaleString('ja-JP')}`);
  holdSum.innerHTML = parts.join('<span>｜</span>');
  const hw = holdSum.offsetWidth / 2 + 8;
  holdSum.style.left = Math.min(window.innerWidth - hw, Math.max(hw, holdSnap.x)) + 'px'; holdSum.style.top = Math.max(40, holdSnap.y - 58) + 'px';
  holdSum.classList.add('show');
}
function stopHold() {
  clearTimeout(holdTimer);
  holdTimer = null;
  if (holdSnap && holdSnap.n) { clearTimeout(holdSumTimer); holdSumTimer = setTimeout(() => holdSum.classList.remove('show'), 1600); }
  holdSnap = null;
}
function consumeHoldClick() {
  if (!holdRepeated) return false;
  holdRepeated = false;
  return true;
}
document.addEventListener('pointerdown', event => {
  stopHold();
  holdRepeated = false;
  const el = event.target.closest('[data-upgrade], [data-companion-level], [data-rebirth-shop], [data-goal-claim]');
  if (!el) return;
  const target = HOLD_TARGETS.find(t => el.dataset[t.attr] !== undefined);
  const id = el.dataset[target.attr];
  const x = event.clientX, y = event.clientY;
  let interval = HOLD_FIRST_INTERVAL_MS;
  const snap = { t: target, id, x, y, n: 0, coins: game.coins, gems: game.gems, level: holdLevel(target, id), stat: target.attr === 'upgrade' ? getUpgradeStatValue(id) : 0 };
  holdSnap = snap;
  const repeat = () => {
    holdRepeated = true;
    if (!target.action(id, x, y)) { stopHold(); return; }
    snap.n++; clearTimeout(holdSumTimer); showHoldSum();
    interval = Math.max(HOLD_MIN_INTERVAL_MS, interval * 0.85);
    holdTimer = setTimeout(repeat, interval);
  };
  holdTimer = setTimeout(repeat, HOLD_DELAY_MS);
});
['pointerup', 'pointercancel'].forEach(type => document.addEventListener(type, stopHold));
window.addEventListener('blur', stopHold);

function buyRebirthItemMax(id, x, y) {
  const item = REBIRTH_SHOP_ITEMS[id];
  if (!item) return;
  const count = getRebirthMaxCount(id);
  if (count < 1) { buyRebirthItem(id, x, y, false); return; } // 買えない理由の表示は通常購入に任せる
  if (!game.rebirthShopBuys) game.rebirthShopBuys = {};
  for (let i = 0; i < count; i++) {
    game.gems -= getRebirthItemCost(id);
    game.rebirthShopBuys[id] = (game.rebirthShopBuys[id] || 0) + 1;
    item.effect();
  }
  renderArtifactList();
  showRebirthPurchasePop(item, x, y, count);
  playRegisterSound();
  updateStatsUI();
  renderRebirthShopList();
}
function buyRebirthItem(id, x, y, fromHold) {
  const item = REBIRTH_SHOP_ITEMS[id];
  if (!item) return false;
  if (isRebirthItemMaxed(item)) { showTapError(item.companionId || item.unlockKey ? 'すでに開放しています' : '所持上限に達しています', x, y); return false; }
  if (isRebirthItemLocked(item)) { showTapError('先にタックルを開放してください', x, y); return false; }
  const lockLeft = getRebirthShopLockLeft(id);
  if (lockLeft) { showTapError(`あと${lockLeft}回の転生で開放`, x, y); return false; }
  const cost = getRebirthItemCost(id);
  if (game.gems < cost) {
    if (fromHold) showTapError('ジェムが足りません', x, y); // 連続購入中はダイアログを出さずに止める
    else promptGemShortage(cost);
    return false;
  }
  game.gems -= cost;
  if (!game.rebirthShopBuys) game.rebirthShopBuys = {};
  game.rebirthShopBuys[id] = (game.rebirthShopBuys[id] || 0) + 1;
  item.effect();
  renderArtifactList();
  showRebirthPurchasePop(item, x, y);
  playRegisterSound();
  updateStatsUI();
  renderRebirthShopList();
  return true;
}
rebirthShopList.addEventListener('click', event => {
  const maxBtn = event.target.closest('[data-rebirth-max]');
  if (maxBtn) {
    const itemBtn = maxBtn.parentElement.querySelector('[data-rebirth-shop]');
    const r = (itemBtn || maxBtn).getBoundingClientRect();
    buyRebirthItemMax(maxBtn.dataset.rebirthMax, r.left + r.width / 2, r.top + r.height / 2);
    return;
  }
  const button = event.target.closest('[data-rebirth-shop]');
  if (!button) return;
  if (consumeHoldClick()) return; // 長押しで連続購入した直後のクリックは無視
  buyRebirthItem(button.dataset.rebirthShop, event.clientX, event.clientY, false);
});

const SHARE_HASHTAG = '#放置系ハクスラ無限反射';
function buildShareText(kind) {
  const b = computeBonuses();
  const found = ENEMY_BOOK.filter(entry => (game.bestiary || {})[entry.key]).length;
  const comp = (Math.floor(found / ENEMY_BOOK.length * 1000) / 10).toFixed(1);
  if (kind === 'records') {
    return `【放置系ハクスラ無限反射 戦績】\n🏔 最高到達 ${game.bestStage}階層\n⚔️ 累計キル ${game.totalKills.toLocaleString('ja-JP')}\n💥 最大ダメージ ${Math.floor(game.maxDamage || 0).toLocaleString('ja-JP')}\n🌌 転生 ${game.reincarnations}回\n📖 敵図鑑 ${found}/${ENEMY_BOOK.length}（${comp}%）\n${SHARE_HASHTAG}`;
  }
  if (kind === 'ranking') {
    if (!lastRankInfo) renderRanking();
    const info = lastRankInfo;
    return `【放置系ハクスラ無限反射 ランキング】\n🏆 ${info.label}ランキングで ${info.rank}位！（${info.score}）\n${SHARE_HASHTAG}`;
  }
  const player = balls.find(ball => ball.isPlayer && !ball.isClone && !ball.isCompanion);
  return `放置系ハクスラ無限反射で ${game.stage}階層 に挑戦中！\n⚔️ ATK ${player ? player.atk : getPlayerAtk()} ／ 🏔 最高 ${game.bestStage}階層 ／ 🌌 転生 ${game.reincarnations}回\n${SHARE_HASHTAG}`;
}
const shareModal = document.getElementById('shareModal');
const shareTextEl = document.getElementById('shareText');
const shareMsg = document.getElementById('shareMsg');
function openShare(kind) {
  const text = buildShareText(kind);
  shareTextEl.value = text;
  document.getElementById('shareXLink').href = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text);
  document.getElementById('shareLineLink').href = 'https://social-plugins.line.me/lineit/share?text=' + encodeURIComponent(text);
  document.getElementById('shareMoreBtn').style.display = navigator.share ? '' : 'none';
  shareMsg.classList.remove('show');
  shareModal.classList.add('show');
}
function showShareMsg(text) {
  shareMsg.textContent = text;
  shareMsg.classList.remove('show'); void shareMsg.offsetWidth; shareMsg.classList.add('show');
}
document.addEventListener('click', event => {
  const btn = event.target.closest('[data-share]');
  if (btn) openShare(btn.dataset.share);
});
document.getElementById('shareCopyBtn').addEventListener('click', async () => {
  const text = shareTextEl.value;
  try {
    await navigator.clipboard.writeText(text);
    showShareMsg('✅ コピーしました');
  } catch (err) {
    shareTextEl.focus(); shareTextEl.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    showShareMsg(ok ? '✅ コピーしました' : 'テキストを選択しました。長押しでコピーしてください');
  }
});
document.getElementById('shareMoreBtn').addEventListener('click', async () => {
  try { await navigator.share({ text: shareTextEl.value }); } catch (err) { /* キャンセル等は無視 */ }
});
document.getElementById('shareCloseBtn').addEventListener('click', () => shareModal.classList.remove('show'));
shareModal.addEventListener('click', event => { if (event.target === shareModal) shareModal.classList.remove('show'); });

const rebornConfirmModal = document.getElementById('rebornConfirmModal');
function doSelfRebirth(mult) {
  rebornConfirmModal.classList.remove('show');
  if (phase !== 'battle' || game.stage < 3) return;
  rebirthGemMult = mult;
  onPlayerDeath(true);
}
document.getElementById('rebornConfirmOkBtn').addEventListener('click', () => doSelfRebirth(1));
document.getElementById('rebornAdBtn').addEventListener('click', () => {
  if (isAdFree()) { doSelfRebirth(3); return; } // 紋章（サブスク）加入中は動画なし
  playRewardedVideo(() => { rewardAdModal.classList.remove('show'); doSelfRebirth(3); });
});
document.getElementById('rebornConfirmCancelBtn').addEventListener('click', () => rebornConfirmModal.classList.remove('show'));
rebornConfirmModal.addEventListener('click', event => { if (event.target === rebornConfirmModal) rebornConfirmModal.classList.remove('show'); });
rebornBtn.addEventListener('click', event => {
  if (phase === 'battle' && game.stage >= 3) {
    const g = getRebirthGemGain();
    document.getElementById('rebornGemAmt').textContent = g;
    document.getElementById('rebornGemAmt3').textContent = g * 3;
    document.getElementById('rebornAdBtn').innerHTML = `${isAdFree() ? '🎁 紋章特典で報酬3倍' : '🎬 動画を見て報酬3倍'} <b>💎 ${g * 3}</b>`;
    rebornConfirmModal.classList.add('show');
  } else {
    showTapError('3階層から転生できます', event.clientX, event.clientY);
  }
});

specialBtn.addEventListener('click', event => {
  if (!game.shopOwned.skillSpecial) { showTapError('スキルページで解放・装備してください', event.clientX, event.clientY); return; }
  if (phase !== 'battle') { showTapError('今はメテオを使えません', event.clientX, event.clientY); return; }
  if (Date.now() - lastSpecialAt < getSpecialCooldown()) { tryGemResetSkill('special', event, () => { lastSpecialAt = Date.now() - SPECIAL_COOLDOWN; }, updateSpecialButton); return; }
  const enemy = balls.find(ball => !ball.isPlayer);
  if (!enemy) return;
  const b = computeBonuses();
  const multiplier = (game.shopOwned.meteor ? 1.5 : 1) * b.specialMult * b.specialDmgMult;
  const damage = Math.round(enemy.maxHp * 0.35 * multiplier);
  lastSpecialAt = Date.now();
  meteors.push({
    x: arena.x + (Math.random() - 0.5) * arena.radius,
    y: arena.y - arena.radius - 45,
    radius: 32, speed: 10, damage, hit: false
  });
  playSpecialSound();
  updateSpecialButton();
});

accelBtn.addEventListener('click', event => {
  if (!game.shopOwned.skillAccel) { showTapError('スキルページで解放・装備してください', event.clientX, event.clientY); return; }
  if (phase !== 'battle') { showTapError('今は加速できません', event.clientX, event.clientY); return; }
  if (Date.now() - lastAccelAt < skillCd('skillAccel', ACCEL_COOLDOWN)) { tryGemResetSkill('accel', event, () => { lastAccelAt = Date.now() - ACCEL_COOLDOWN; }, updateAccelButton); return; }
  lastAccelAt = Date.now();
  accelEndAt = Date.now() + ACCEL_DURATION;
  playAccelSound();
  updateAccelButton();
});

healBtn.addEventListener('click', event => {
  if (!game.shopOwned.skillHeal) { showTapError('スキルページで解放・装備してください', event.clientX, event.clientY); return; }
  if (phase !== 'battle') { showTapError('今は回復できません', event.clientX, event.clientY); return; }
  if (Date.now() - lastHealAt < skillCd('skillHeal', HEAL_COOLDOWN)) { tryGemResetSkill('heal', event, () => { lastHealAt = Date.now() - HEAL_COOLDOWN; }, updateHealButton); return; }
  const player = balls.find(ball => ball.isPlayer && !ball.isClone && !ball.isCompanion);
  if (!player) return;
  lastHealAt = Date.now();
  player.hp = Math.min(player.maxHp, player.hp + player.maxHp * 0.5);
  spawnDamageText(player.x, player.y - player.radius - 12, '+HEAL', '#7ee787');
  spawnHitParticles(player.x, player.y, '#7ee787');
  playHealSound();
  updateHealButton();
  updateBarrierButton();
  updateHPUI();
});

atkUpBtn.addEventListener('click', event => {
  if (!game.shopOwned.skillAtkUp) { showTapError('スキルページで解放・装備してください', event.clientX, event.clientY); return; }
  if (phase !== 'battle') { showTapError('今は攻撃UPを使えません', event.clientX, event.clientY); return; }
  if (Date.now() < atkUpEndAt) return;
  if (Date.now() - lastAtkUpAt < skillCd('skillAtkUp', ATK_UP_COOLDOWN)) { tryGemResetSkill('atkup', event, () => { lastAtkUpAt = Date.now() - ATK_UP_COOLDOWN; }, updateAtkUpButton); return; }
  lastAtkUpAt = Date.now();
  atkUpEndAt = Date.now() + ATK_UP_MS;
  const player = balls.find(ball => ball.isPlayer && !ball.isClone && !ball.isCompanion);
  if (player) {
    player.atk = getPlayerAtk();
    spawnDamageText(player.x, player.y - player.radius - 14, `💪 攻撃力 ×${ATK_UP_MULT}`, '#ff6b6b', 0.012);
    spawnHitParticles(player.x, player.y, '#ff6b6b');
  }
  playAtkUpSound();
  showNotice(`💪 攻撃力UP！ ${ATK_UP_MS / 1000}秒間 攻撃力 ×${ATK_UP_MULT}`);
  updateAtkUpButton();
  updateHPUI();
});

// 魔法封じの音：キラキラした魔力が揺らぎながら萎んでいき、最後に「カチッ」と封印が閉じる
function playSilenceSound() {
  if (!audioCtx || isBattleSfxMuted()) return;
  [2093, 1760, 1397, 1175, 988].forEach((f, i) => thump(f, f * 0.97, 0.16, 0.035, 'triangle', i * 0.035)); // 魔力のきらめき（下降）
  thump(660, 220, 0.42, 0.05, 'square', 0.05); thump(671, 216, 0.42, 0.05, 'square', 0.05); // うなりながら萎む魔力
  filteredNoise(0.05, 0.35, 0.07, 2400, 2, 'bandpass');                                       // シュウゥ…と吸い込まれる
  thump(180, 55, 0.2, 0.2, 'sine', 0.44);                                                      // 封印の「ドン」
  filteredNoise(0.44, 0.05, 0.25, 1800, 1.5, 'bandpass');                                      // 錠が閉まる「カチッ」
  thump(523, 523, 0.5, 0.025, 'sine', 0.5); thump(784, 784, 0.4, 0.012, 'sine', 0.5);         // 静まった余韻
}
silenceBtn.addEventListener('click', event => {
  if (!game.shopOwned.skillSilence) { showTapError('スキルページで解放・装備してください', event.clientX, event.clientY); return; }
  if (phase !== 'battle') { showTapError('今は魔法封じを使えません', event.clientX, event.clientY); return; }
  if (Date.now() < silenceEndAt) return;
  if (Date.now() - lastSilenceAt < skillCd('skillSilence', SILENCE_COOLDOWN)) { tryGemResetSkill('silence', event, () => { lastSilenceAt = Date.now() - SILENCE_COOLDOWN; }, updateSilenceButton); return; }
  lastSilenceAt = Date.now();
  silenceEndAt = Date.now() + SILENCE_MS;
  enemyShots = enemyShots.filter(sh => !sh.magic); // 飛んでいる魔法弾も消す
  for (const en of [...balls, ...adds]) {
    if (en.isPlayer || en.isDying) continue;
    if (en.traitState === 'cast') { en.traitState = null; en.traitFreeze = false; }
    spawnDamageText(en.x, en.y - en.radius - 20, '🔇 魔法封じ', '#9fa8ff', 0.012);
    spawnHitParticles(en.x, en.y, '#9fa8ff');
  }
  playSilenceSound();
  showNotice(`🔇 魔法封じ！ ${SILENCE_MS / 1000}秒間 敵の魔法と弾を封じた`);
  updateSilenceButton();
});

deathBtn.addEventListener('click', event => {
  const ctxs = beginSkill(event, 'skillDeath', 'death', SKILL_DEATH_COOLDOWN, lastDeathAt, v => { lastDeathAt = v; }, updateDeathButton);
  if (!ctxs) return;
  const { player, enemy } = ctxs;
  const chance = enemy.isBoss ? DEATH_CHANCE_BOSS : DEATH_CHANCE;
  for (let i = 0; i < 14; i++) particles.push({ x: enemy.x + (Math.random() - 0.5) * 40, y: enemy.y + (Math.random() - 0.5) * 40, vx: 0, vy: -0.8, life: 1, color: '#b48cff', decay: 0.025 });
  playTone(110, 0.6, 'sawtooth', 0.16, 55);
  if (Math.random() < chance) {
    spawnDamageText(enemy.x, enemy.y - enemy.radius - 30, '💀 即死！', '#b48cff', 0.012, true);
    trackDamage(enemy.hp);
    enemy.hp = 0;
    triggerEnemyDefeat(enemy, player.x, player.y);
    shakeScreenLight();
  } else {
    spawnDamageText(enemy.x, enemy.y - enemy.radius - 30, '即死魔法… 効かなかった', '#9aa3b8', 0.014);
  }
  updateDeathButton();
  updateHPUI();
});
coinStrikeBtn.addEventListener('click', event => {
  if (Date.now() < coinStrikeEndAt) return;
  const ctxs = beginSkill(event, 'skillCoinStrike', 'coinStrike', SKILL_COINSTRIKE_COOLDOWN, lastCoinStrikeAt, v => { lastCoinStrikeAt = v; }, updateCoinStrikeButton, false);
  if (!ctxs) return;
  coinStrikeEndAt = Date.now() + COIN_STRIKE_MS;
  spawnDamageText(ctxs.player.x, ctxs.player.y - ctxs.player.radius - 14, '🪙 コイン攻撃', '#ffd76b', 0.012);
  showNotice(`🪙 コイン攻撃！ ${COIN_STRIKE_MS / 1000}秒間 敵めがけてコインを投げまくる・討伐コイン×${COIN_STRIKE_KILL_MULT}`);
  playTone(988, 0.12, 'square', 0.12, 1318);
  updateCoinStrikeButton();
});
function onCoinStrikeTap(x, y) {
  if (!isCoinStrike()) return;
  const gain = Math.max(1, Math.round((3 + game.stage) * 0.5 * computeBonuses().coinMult));
  game.coins += gain;
  spawnDamageText(x, y - 10, '+' + gain + ' 🟡', '#ffd76b', 0.03);
  playTone(1568, 0.05, 'square', 0.06);
  updateStatsUI();
}
zeniBtn.addEventListener('click', event => {
  if (game.shopOwned.skillZeni && game.coins < ZENI_MIN_COINS && Date.now() - lastZeniAt >= skillCd('skillZeni', SKILL_ZENI_COOLDOWN)) { showTapError(`コインが${ZENI_MIN_COINS}枚以上必要です`, event.clientX, event.clientY); return; }
  const ctxs = beginSkill(event, 'skillZeni', 'zeni', SKILL_ZENI_COOLDOWN, lastZeniAt, v => { lastZeniAt = v; }, updateZeniButton);
  if (!ctxs) return;
  const { player, enemy } = ctxs;
  const thrown = Math.floor(game.coins / 2);
  spendCoins(thrown);
  const { dmg, crit } = rollCrit(Math.max(1, Math.round(thrown * ZENI_DMG_PER_COIN + player.atk)), enemy);
  enemy.hp -= dmg;
  trackDamage(dmg);
  for (let i = 0; i < 16; i++) particles.push({ x: player.x, y: player.y, vx: (enemy.x - player.x) / 20 + (Math.random() - 0.5) * 3, vy: (enemy.y - player.y) / 20 + (Math.random() - 0.5) * 3, life: 1, color: '#ffd76b', decay: 0.03, isCoin: true });
  spawnDamageText(enemy.x, enemy.y - enemy.radius - 30, `💰 ゼニ投げ！（${formatCoinNumber(thrown)}枚）`, '#ffcf4a', 0.012, true);
  spawnAttackDamageText(enemy, dmg, crit, '#ffe9a8');
  onPlayerHitEnemy(enemy, dmg);
  playNoiseBurst(0.2, 0.2);
  [1318, 1568, 1976].forEach((f, i) => setTimeout(() => playTone(f, 0.08, 'square', 0.08), i * 60));
  if (enemy.hp <= 0) triggerEnemyDefeat(enemy, player.x, player.y);
  updateZeniButton();
  updateStatsUI();
  updateHPUI();
});
const MYSTERY_EFFECTS = [
  { w: 14, name: '💥 大爆発！', color: '#ff9f43', fn: ({ player, enemy }) => { const { dmg, crit } = rollCrit(Math.round(player.atk * 10), enemy); enemy.hp -= dmg; trackDamage(dmg); spawnAttackDamageText(enemy, dmg, crit, '#ffcf8a'); onPlayerHitEnemy(enemy, dmg); shakeScreenLight(); if (enemy.hp <= 0) triggerEnemyDefeat(enemy, player.x, player.y); } },
  { w: 12, name: '💖 全回復！', color: '#7ee787', fn: ({ player }) => { player.hp = player.maxHp; playHealSound(); } },
  { w: 10, name: '💎 ジェムが降ってきた！ +3', color: '#64e8ff', fn: () => { game.gems += 3; } },
  { w: 12, name: '🟡 コインの雨！', color: '#ffd76b', fn: ({ player }) => { const g = Math.round(game.stage * 40 * computeBonuses().coinMult); game.coins += g; spawnCoinBurst(player.x, player.y, g); } },
  { w: 12, name: '⏸ 時間停止！（敵が3秒止まる）', color: '#a5a8ff', fn: ({ enemy }) => { enemy.stunnedUntil = Date.now() + 3000; } },
  { w: 8,  name: '🔻 敵が縮んだ！', color: '#7fd6ff', fn: ({ enemy }) => { enemy.radius = Math.max(8, enemy.radius * 0.7); enemy.traitBaseRadius = enemy.radius; } },
  { w: 8,  name: '🤔 何も起きなかった…', color: '#9aa3b8', fn: () => {} },
  { w: 8,  name: '😱 敵が回復してしまった！', color: '#ff6b6b', fn: ({ enemy }) => { enemy.hp = Math.min(enemy.maxHp, enemy.hp + Math.round(enemy.maxHp * 0.3)); } },
  { w: 8,  name: '💫 自分にダメージ！', color: '#ff6b6b', fn: ({ player }) => { const d = Math.min(player.hp - 1, Math.round(player.maxHp * 0.2)); if (d > 0) { player.hp -= d; spawnDamageText(player.x, player.y - player.radius - 14, '-' + d, '#ff6b6b', 0.02); } } },
  { w: 8,  name: '🌀 すべてのスキルが回復！', color: '#c792ea', fn: () => { lastSpecialAt = lastAccelAt = lastHealAt = lastBarrierAt = lastHomingAt = lastPoisonAt = lastParalyzeAt = lastSleepAt = lastAtkUpAt = lastRegenAt = lastSilenceAt = lastSacrificeAt = lastDeathAt = lastCoinStrikeAt = lastZeniAt = lastCompRushAt = lastNovaAt = 0; updateStatsUI(); } },
];
novaBtn.addEventListener('click', event => {
  const targets = () => [...balls.filter(x => !x.isPlayer && !x.isDying && !(x.spawnTimer > 0)), ...adds.filter(x => x.hp > 0)];
  if (game.shopOwned.skillNova && !targets().length && Date.now() - lastNovaAt >= skillCd('skillNova', SKILL_NOVA_COOLDOWN)) { showTapError('敵がいません', event.clientX, event.clientY); return; }
  const ctxs = beginSkill(event, 'skillNova', 'nova', SKILL_NOVA_COOLDOWN, lastNovaAt, v => { lastNovaAt = v; }, updateNovaButton, false);
  if (!ctxs) return;
  const { player } = ctxs;
  novaFx = { start: Date.now() };
  shakeScreenLight();
  thump(90, 30, 0.6, 0.8); noiseSweep(0.5, 3000, 120, 'lowpass', 0.8, 0.6);
  let hitCount = 0;
  for (const en of targets()) {
    const { dmg, crit } = rollCrit(Math.max(1, Math.round(player.atk * NOVA_DMG_MULT)), en);
    en.hp -= dmg;
    trackDamage(dmg);
    hitCount++;
    spawnAttackDamageText(en, dmg, crit, '#ffc98a', en.isAdd ? 6 : undefined);
    spawnHitParticles(en.x, en.y, '#ff9f43');
    if (en.isAdd) {
      if (en.hp <= 0) {
        recordBestiaryKill(en);
        const coinGain = 5 + Math.floor(Math.random() * 8);
        game.coins += coinGain;
        spawnDamageText(en.x, en.y, '+' + formatCoinNumber(coinGain) + ' 🟡', '#ffd76b');
      }
    } else {
      onPlayerHitEnemy(en, dmg);
      if (en.hp <= 0) triggerEnemyDefeat(en, player.x, player.y);
    }
  }
  adds = adds.filter(ad => ad.hp > 0);
  spawnDamageText(arena.x, arena.y - 30, `💥 全体攻撃！（${hitCount}体）`, '#ff9f43', 0.012, true);
  updateNovaButton();
  updateStatsUI();
  updateHPUI();
});
function drawNovaFx() {
  if (!novaFx) return;
  const t = (Date.now() - novaFx.start) / 600;
  if (t >= 1) { novaFx = null; return; }
  ctx.save();
  ctx.globalAlpha = 1 - t;
  ctx.strokeStyle = '#ff9f43'; ctx.shadowColor = '#ff9f43'; ctx.shadowBlur = 20; ctx.lineWidth = 10 * (1 - t) + 2;
  arenaPath(t); ctx.stroke();
  ctx.globalAlpha = (1 - t) * 0.25; ctx.fillStyle = '#ffd76b';
  arenaPath(); ctx.fill();
  ctx.restore();
}
compRushBtn.addEventListener('click', event => {
  const comps = balls.filter(ball => ball.isCompanion && ball.hp > 0);
  if (game.shopOwned.skillCompRush && !comps.length && Date.now() - lastCompRushAt >= skillCd('skillCompRush', SKILL_COMPRUSH_COOLDOWN)) { showTapError('戦える仲間がいません', event.clientX, event.clientY); return; }
  const ctxs = beginSkill(event, 'skillCompRush', 'compRush', SKILL_COMPRUSH_COOLDOWN, lastCompRushAt, v => { lastCompRushAt = v; }, updateCompRushButton);
  if (!ctxs) return;
  const { player, enemy } = ctxs;
  let total = 0;
  comps.forEach((comp, i) => {
    const ang = Math.atan2(enemy.y - comp.y, enemy.x - comp.x);
    comp.vx = Math.cos(ang) * 12; comp.vy = Math.sin(ang) * 12;
    for (let k = 0; k < 6; k++) particles.push({ x: comp.x, y: comp.y, vx: Math.cos(ang) * (3 + k), vy: Math.sin(ang) * (3 + k), life: 0.8, color: COMPANION_COLORS[comp.companionId] || '#8fe3a0', decay: 0.05 });
    const { dmg } = rollCrit(Math.max(1, Math.round(comp.atk * COMP_RUSH_DMG_MULT)), enemy);
    total += dmg;
  });
  enemy.hp -= total;
  trackDamage(total);
  spawnDamageText(enemy.x, enemy.y - enemy.radius - 30, `🐾 仲間特攻！ ×${comps.length}`, '#8fe3a0', 0.014, true);
  spawnAttackDamageText(enemy, total, false, '#d4ffdd');
  spawnHitParticles(enemy.x, enemy.y, '#8fe3a0');
  onPlayerHitEnemy(enemy, total);
  shakeScreenLight();
  [392, 523, 659, 784].forEach((f, i) => setTimeout(() => playTone(f, 0.08, 'square', 0.1), i * 50));
  if (enemy.hp <= 0) triggerEnemyDefeat(enemy, player.x, player.y);
  updateCompRushButton();
  updateHPUI();
});
mysteryBtn.addEventListener('click', event => {
  const ctxs = beginSkill(event, 'skillMystery', 'mystery', SKILL_MYSTERY_COOLDOWN, lastMysteryAt, v => { lastMysteryAt = v; }, updateMysteryButton);
  if (!ctxs) return;
  const total = MYSTERY_EFFECTS.reduce((sum, ef) => sum + ef.w, 0);
  let roll = Math.random() * total;
  const ef = MYSTERY_EFFECTS.find(x => (roll -= x.w) < 0) || MYSTERY_EFFECTS[0];
  [523, 659, 784, 1046, 1319, 1568, 2093, 1568, 2637].forEach((f, i) => setTimeout(() => playTone(f * (0.92 + Math.random() * 0.16), 0.09, i % 2 ? 'square' : 'triangle', 0.09), i * 55)); // ルーレットのように鳴る
  setTimeout(() => { thump(110, 40, 0.5, 0.5); filteredNoise(0, 0.6, 0.2, 5000, 0.6, 'highpass'); }, 500);
  mysteryFx = { start: Date.now(), color: ef.color, x: ctxs.player.x, y: ctxs.player.y };
  for (let i = 0; i < 40; i++) { const a = Math.random() * Math.PI * 2, sp = 2 + Math.random() * 5; particles.push({ x: ctxs.player.x, y: ctxs.player.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, color: `hsl(${Math.floor(Math.random() * 360)},90%,65%)`, decay: 0.02 }); }
  shakeScreenLight();
  spawnDamageText(ctxs.player.x, ctxs.player.y - ctxs.player.radius - 18, '❓ 謎魔法…', '#7fe0ff', 0.02);
  ef.fn(ctxs);
  showNotice('❓ 謎魔法 → ' + ef.name);
  spawnDamageText(arena.x, arena.y - 40, ef.name, ef.color, 0.01, true);
  updateMysteryButton();
  updateStatsUI();
  updateHPUI();
});

regenBtn.addEventListener('click', event => {
  if (!game.shopOwned.skillRegen) { showTapError('スキルページで解放・装備してください', event.clientX, event.clientY); return; }
  if (phase !== 'battle') { showTapError('今はリヒールを使えません', event.clientX, event.clientY); return; }
  if (Date.now() < regenEndAt) return;
  if (Date.now() - lastRegenAt < skillCd('skillRegen', REGEN_COOLDOWN)) { tryGemResetSkill('regen', event, () => { lastRegenAt = Date.now() - REGEN_COOLDOWN; }, updateRegenButton); return; }
  lastRegenAt = Date.now();
  regenEndAt = Date.now() + REGEN_MS;
  lastRegenTickAt = Date.now();
  regenHealAccum = 0;
  const player = balls.find(ball => ball.isPlayer && !ball.isClone && !ball.isCompanion);
  if (player) {
    spawnDamageText(player.x, player.y - player.radius - 14, '🌿 リヒール', '#5fe0a8', 0.012);
    spawnHitParticles(player.x, player.y, '#5fe0a8');
  }
  playHealSound();
  showNotice(`🌿 リヒール！ ${REGEN_MS / 1000}秒間 HPが少しずつ回復`);
  updateRegenButton();
});


paralyzeBtn.addEventListener('click', event => {
  if (!game.shopOwned.skillParalyze) { showTapError('スキルページで解放・装備してください', event.clientX, event.clientY); return; }
  if (phase !== 'battle') { showTapError('今は麻痺を使えません', event.clientX, event.clientY); return; }
  if (Date.now() - lastParalyzeAt < skillCd('skillParalyze', PARALYZE_COOLDOWN)) { tryGemResetSkill('paralyze', event, () => { lastParalyzeAt = Date.now() - PARALYZE_COOLDOWN; }, updateParalyzeButton); return; }
  const enemy = balls.find(ball => !ball.isPlayer);
  if (!enemy || enemy.isDying || enemy.spawnTimer > 0) { showTapError('敵がいません', event.clientX, event.clientY); return; }
  lastParalyzeAt = Date.now();
  castParalyze(enemy);
  updateParalyzeButton();
});

poisonBtn.addEventListener('click', event => {
  if (!game.shopOwned.skillPoison) { showTapError('スキルページで解放・装備してください', event.clientX, event.clientY); return; }
  if (phase !== 'battle') { showTapError('今は毒を付与できません', event.clientX, event.clientY); return; }
  if (isPoisonBuffActive()) return;
  if (Date.now() - lastPoisonAt < skillCd('skillPoison', POISON_COOLDOWN)) { tryGemResetSkill('poison', event, () => { lastPoisonAt = Date.now() - POISON_COOLDOWN; }, updatePoisonButton); return; }
  lastPoisonAt = Date.now();
  poisonBuffEndAt = Date.now() + POISON_BUFF_MS;
  playPoisonActivateSound();
  showNotice('☠️ 毒付与！ 攻撃が当たると敵を毒状態に');
  updatePoisonButton();
});


barrierBtn.addEventListener('click', event => {
  if (!game.shopOwned.skillBarrier) { showTapError('スキルページで解放・装備してください', event.clientX, event.clientY); return; }
  if (phase !== 'battle') { showTapError('今はバリアを展開できません', event.clientX, event.clientY); return; }
  if (barrierHits > 0) { showTapError('バリアは展開中です', event.clientX, event.clientY); return; }
  if (Date.now() - lastBarrierAt < skillCd('skillBarrier', BARRIER_COOLDOWN)) { tryGemResetSkill('barrier', event, () => { lastBarrierAt = Date.now() - BARRIER_COOLDOWN; }, updateBarrierButton); return; }
  lastBarrierAt = Date.now();
  barrierHits = BARRIER_MAX_HITS;
  barrierOrbs = Array.from({ length: BARRIER_ORB_COUNT }, (_, i) => ({
    angle: (Math.PI * 2 / BARRIER_ORB_COUNT) * i,
    hitCooldown: 0
  }));
  playBarrierSound();
  updateBarrierButton();
});

speedRange.addEventListener('input', () => {
  gameSpeed = Number(speedRange.value);
  if (Date.now() >= accelEndAt) speedValue.textContent = gameSpeed.toFixed(1) + '×';
});

const DRAG_START_PX = 8;       // これ以上指が動いたらドラッグ（それ未満はタップ扱い）
const DRAG_DEAD = 6, DRAG_FULL = 55; // スティックの遊びと、最高速になるズラし量（キャンバス座標）
const DRAG_EASE = 0.25;        // 速度の変わりやすさ（小さいほど重たい）
const DRAG_AREA_MARGIN = 60;   // サークルの外側このくらい（画面上のpx）まではドラッグを受け付ける
let dragPending = null;        // { id, sx, sy }：押した位置（まだタップかドラッグか未確定）
let playerDrag = null;         // { id, x, y, px, py, ox, oy }：ドラッグ中の目標地点（キャンバス座標）
let lastDragFrameAt = 0;
function drawDragStick() { // 押した位置にスティックの目安を表示
  if (!playerDrag) return;
  const r = canvas.getBoundingClientRect(), k = size / r.width;
  const cx = (playerDrag.ox - r.left) * k, cy = (playerDrag.oy - r.top) * k;
  const jd = Math.hypot(playerDrag.jx, playerDrag.jy) || 1, m = Math.min(jd, DRAG_FULL);
  ctx.save();
  ctx.globalAlpha = 0.35; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(cx, cy, DRAG_FULL, 0, Math.PI * 2); ctx.stroke();
  ctx.globalAlpha = 0.5; ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(cx + playerDrag.jx / jd * m, cy + playerDrag.jy / jd * m, 12, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
function dragMainPlayer(ball, speedMult, b) {
  const now = performance.now();
  const ft = lastDragFrameAt && now - lastDragFrameAt < 100 ? (now - lastDragFrameAt) / (1000 / 60) : 1;
  lastDragFrameAt = now;
  speedMult *= Math.min(2, ft);
  // バーチャルスティック：押した位置からズラした方向・量に応じて、指を離すまで移動し続ける
  const dx = playerDrag.jx || 0, dy = playerDrag.jy || 0, d = Math.hypot(dx, dy);
  const maxSpeed = BOUNCE_SPEED * b.speedMult * 2.4;
  const sp = d < DRAG_DEAD ? 0 : maxSpeed * Math.min(1, (d - DRAG_DEAD) / (DRAG_FULL - DRAG_DEAD));
  const wantVx = sp ? dx / d * sp : 0, wantVy = sp ? dy / d * sp : 0;
  const ease = 1 - Math.pow(1 - DRAG_EASE, speedMult);
  ball.vx += (wantVx - ball.vx) * ease; ball.vy += (wantVy - ball.vy) * ease;
  ball.x += ball.vx * speedMult; ball.y += ball.vy * speedMult;
  wallBounce(ball);
  ball.seekPoint = null; ball.missBounces = 0;
}
window.addEventListener('pointerdown', event => {
  if (phase !== 'battle' || getActiveTab() !== 'game') return;
  if (event.target.closest && event.target.closest('button, input, select, textarea, a, label, summary, .modal-backdrop, .toast')) return;
  const r = canvas.getBoundingClientRect();
  if (event.clientX < r.left - DRAG_AREA_MARGIN || event.clientX > r.right + DRAG_AREA_MARGIN || event.clientY < r.top - DRAG_AREA_MARGIN || event.clientY > r.bottom + DRAG_AREA_MARGIN) return;
  if (HOLD_RUSH_MODE) { chargeHold = { id: event.pointerId, start: Date.now(), sx: event.clientX, sy: event.clientY, dx: 0, dy: 0, aiming: false }; } // 少し押したまま引っ張ると狙いを付け、離して発射（すぐ動かすとドラッグ移動）
  dragPending = { id: event.pointerId, sx: event.clientX, sy: event.clientY };
});
window.addEventListener('pointermove', event => {
  if (playerDrag && event.pointerId === playerDrag.id) {
    const k = size / canvas.getBoundingClientRect().width;
    playerDrag.jx = (event.clientX - playerDrag.ox) * k;
    playerDrag.jy = (event.clientY - playerDrag.oy) * k;
    return;
  }
  if (!dragPending || event.pointerId !== dragPending.id) return;
  if (Math.hypot(event.clientX - dragPending.sx, event.clientY - dragPending.sy) < DRAG_START_PX) return;
  const pl = balls.find(ball => isMainPlayerBall(ball)), dragPending0 = dragPending;
  dragPending = null;
  if (!pl || phase !== 'battle') return;
  const k = size / canvas.getBoundingClientRect().width;
  playerDrag = { id: event.pointerId, ox: dragPending0.sx, oy: dragPending0.sy, jx: (event.clientX - dragPending0.sx) * k, jy: (event.clientY - dragPending0.sy) * k };
});
['pointerup', 'pointercancel'].forEach(type => window.addEventListener(type, event => {
  if (chargeHold && event.pointerId === chargeHold.id) { if (type === 'pointerup') releaseCharge(); else chargeHold = null; }
  if (dragPending && event.pointerId === dragPending.id) dragPending = null;
  if (!playerDrag || event.pointerId !== playerDrag.id) return;
  playerDrag = null;
  if (HOLD_RUSH_MODE) return; // 指を離したら一番近い敵へ突撃
  const pl = balls.find(ball => isMainPlayerBall(ball));
  if (pl && Math.hypot(pl.vx, pl.vy) < 0.5) {
    const en = nearestOf(pl, [...balls, ...adds].filter(x => !x.isPlayer && !x.isDying && x.hp > 0));
    if (en) { const a = Math.atan2(en.y - pl.y, en.x - pl.x); pl.vx = Math.cos(a); pl.vy = Math.sin(a); }
  }
}));

canvas.addEventListener('contextmenu', event => event.preventDefault()); // 長押しでメニューが出てタメが中断されないように
canvas.addEventListener('pointerdown', event => {
  if (phase !== 'battle') return;
  ensureAudio();
  startBgm(game.stage % 10 === 0 ? 'boss' : 'normal');
  const rect = canvas.getBoundingClientRect();
  const x = (event.clientX - rect.left) * (size / rect.width);
  const y = (event.clientY - rect.top) * (size / rect.height);
  if (arenaContains(x, y, 12)) {
    if (HOLD_RUSH_MODE) { game.totalTaps++; return; } // タップ・連打の攻撃処理はなし（押しっぱなしのタメ打ちとドラッグ移動のみ）
    arenaHeld = true;
    updateTackleHold();
    const player = balls.find(ball => ball.isPlayer && !ball.isClone && !ball.isCompanion);
    const enemy = player && nearestOf(player, [...balls, ...adds].filter(x => !x.isPlayer && !x.isDying && x.hp > 0 && !(x.spawnTimer > 0)));
    if (player) { player.seekPoint = null; player.missBounces = 0; }
    if (player) {
      player.tapSpeedMult = Math.min(TAP_ACCEL_MAX, (player.tapSpeedMult || 1) + TAP_ACCEL_PER_TAP);
      playTapDashSound(player.tapSpeedMult);
    }
    if (player && enemy) {
      const tdx = enemy.x - player.x, tdy = enemy.y - player.y;
      const tdist = Math.hypot(tdx, tdy);
      if (tdist > 4) {
        const speed = Math.hypot(player.vx, player.vy) || 3.2;
        player.vx = (tdx / tdist) * speed;
        player.vy = (tdy / tdist) * speed;
        spawnTapMarker(x, y);
      }
    }
    onCoinStrikeTap(x, y); // コイン攻撃中はタップでコイン
    game.totalTaps++;
    if (!CLONES_ENABLED) { updateStatsUI(); return; }
    const limit = getCloneLimit();
    let cloneCount = balls.filter(ball => ball.isClone).length;
    while (cloneCount >= limit) {
      const oldestIdx = balls.findIndex(ball => ball.isClone);
      if (oldestIdx === -1) break;
      balls.splice(oldestIdx, 1);
      cloneCount--;
    }
    balls.push(makeClone(x, y));
    spawnHitParticles(x, y, '#86c5ff');
    playCloneSound();
    updateStatsUI();
  }
});

try {
  const tryCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (tryCtx.state === 'running') { audioCtx = tryCtx; refreshBgm(); } else tryCtx.close();
} catch (e) {}
function unlockAudio() {
  ensureAudio(); refreshBgm();
  ['pointerdown', 'touchend', 'keydown'].forEach(t => document.removeEventListener(t, unlockAudio, true));
}
['pointerdown', 'touchend', 'keydown'].forEach(t => document.addEventListener(t, unlockAudio, true));

window.addEventListener('resize', () => { resizeCanvas(); draw(); });
if (window.ResizeObserver) new ResizeObserver(() => resizeCanvas()).observe(wrap);

setInterval(updateSpecialButton, 1000);
setInterval(updateAccelButton, 1000);
setInterval(updateHealButton, 1000);
setInterval(updateBarrierButton, 1000);
setInterval(updatePoisonButton, 500);
setInterval(updateParalyzeButton, 1000);
setInterval(updateAtkUpButton, 500);
setInterval(updateRegenButton, 500);
setInterval(updateSilenceButton, 500);
setInterval(updateDeathButton, 1000);
setInterval(updateCoinStrikeButton, 500);
setInterval(updateZeniButton, 1000);
setInterval(updateMysteryButton, 1000);
setInterval(updateCompRushButton, 1000);
setInterval(updateNovaButton, 1000);
setInterval(updateRewardAdButtons, 1000);
setInterval(() => {
  if (!audioCtx || phase !== 'battle' || isBattleSfxMuted() || !document.body.classList.contains('player-critical')) return;
  playTone(70, 0.12, 'sine', 0.22, 45);
  setTimeout(() => playTone(62, 0.14, 'sine', 0.18, 40), 170);
}, 850);
const GEM_CHAR = '💎';
const ICON_CHARS = { '💎': ['x_gem', 'gem-ico'], '🔒': ['x_lock', 'gem-ico lock-ico'], '🧪': ['x_potion', 'gem-ico potion-ico'] }; // 文字 → [アイコン, クラス]
const ICON_CHAR_RE = /💎|🔒|🧪/;
const GEM_SKIP_TAGS = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, OPTION: 1, TITLE: 1, CANVAS: 1 };
function gemifyTextNode(node) {
  const text = node.nodeValue;
  if (!text || !ICON_CHAR_RE.test(text)) return;
  const parent = node.parentNode;
  if (!parent || GEM_SKIP_TAGS[parent.nodeName]) return;
  const frag = document.createDocumentFragment();
  text.split(/(💎|🔒|🧪)/).forEach(part => {
    if (ICON_CHARS[part]) { const img = document.createElement('img'); img.className = ICON_CHARS[part][1]; img.src = ICON_IMAGES[ICON_CHARS[part][0]]; img.alt = ''; frag.appendChild(img); }
    else if (part) frag.appendChild(document.createTextNode(part));
  });
  parent.replaceChild(frag, node);
}
function gemifyTree(root) {
  if (root.nodeType === 3) { gemifyTextNode(root); return; }
  if (root.nodeType !== 1 || GEM_SKIP_TAGS[root.nodeName]) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const hits = [];
  while (walker.nextNode()) if (ICON_CHAR_RE.test(walker.currentNode.nodeValue)) hits.push(walker.currentNode);
  hits.forEach(gemifyTextNode);
}
gemifyTree(document.body);
new MutationObserver(list => {
  for (const m of list) {
    if (m.type === 'characterData') gemifyTextNode(m.target);
    else m.addedNodes.forEach(gemifyTree);
  }
}).observe(document.body, { childList: true, subtree: true, characterData: true });
document.querySelectorAll('[data-xi]').forEach(el => {
  const src = ICON_IMAGES[el.dataset.xi];
  if (src) el.innerHTML = `<img class="ico-img${el.hasAttribute('data-xi-big') ? ' xi-big' : ''}" src="${src}" alt="">`;
});
document.querySelectorAll('.tab-page[data-tab]').forEach(page => {
  const tab = page.dataset.tab;
  const src = ICON_IMAGES['tab_' + tab];
  const label = document.querySelector(`.tab-btn[data-tab="${tab}"] .tab-label`);
  if (tab === 'game' || !src || page.querySelector('.page-head')) return;
  const head = document.createElement('div');
  head.className = 'page-head';
  head.innerHTML = `<img class="ico-img" src="${src}" alt=""><span data-page-label="${tab}">${label ? label.textContent : ''}</span>`;
  page.insertBefore(head, page.firstChild);
});
document.querySelectorAll('.tab-btn[data-tab]').forEach(btn => {
  const src = ICON_IMAGES['tab_' + btn.dataset.tab];
  const span = btn.querySelector('.tab-icon');
  if (src && span) span.innerHTML = `<img class="ico-img" src="${src}" alt="">`;
});
const SKILL_BUTTON_KEYS = { specialBtn: 'skillSpecial', accelBtn: 'skillAccel', healBtn: 'skillHeal', barrierBtn: 'skillBarrier', poisonBtn: 'skillPoison', paralyzeBtn: 'skillParalyze', atkUpBtn: 'skillAtkUp', regenBtn: 'skillRegen', silenceBtn: 'skillSilence', deathBtn: 'skillDeath', coinStrikeBtn: 'skillCoinStrike', zeniBtn: 'skillZeni', mysteryBtn: 'skillMystery', compRushBtn: 'skillCompRush', novaBtn: 'skillNova' };
function decorateSkillButton(btn) {
  const node = btn.firstChild;
  if (!node || node.nodeType !== 3) return; // すでに画像化済み
  const text = node.nodeValue;
  const m = text.match(/^(\S+)\s/);
  if (!m || /^[\u0000-\u024f]/.test(m[1]) || m[1].startsWith('🔒') || m[1].startsWith('💎')) return;
  const img = document.createElement('img');
  img.className = 'ico-img';
  img.alt = '';
  img.src = SKILL_GACHA_SKILLS[SKILL_BUTTON_KEYS[btn.id]].img;
  node.nodeValue = text.slice(m[0].length);
  btn.insertBefore(img, node);
}
Object.keys(SKILL_BUTTON_KEYS).forEach(id => {
  const btn = document.getElementById(id);
  if (!btn || !SKILL_GACHA_SKILLS[SKILL_BUTTON_KEYS[id]]) return;
  new MutationObserver(() => decorateSkillButton(btn)).observe(btn, { childList: true, characterData: true, subtree: true });
  decorateSkillButton(btn);
});
updateSkillButtonVisibility();
renderLvGauge();
updatePotionButton();
renderDebugMonsters();
(() => { // モンスター一覧は開閉できる（開閉状態は覚えておく）
  const wrap = document.getElementById('dbgMonWrap'), mark = document.getElementById('dbgMonFoldMark');
  const set = open => { wrap.classList.toggle('open', open); mark.textContent = open ? '▲ 閉じる' : '▼ 開く'; try { localStorage.setItem('dbgMonOpen', open ? '1' : '0'); } catch (err) {} };
  let open = false; try { open = localStorage.getItem('dbgMonOpen') === '1'; } catch (err) {}
  set(open);
  document.getElementById('dbgMonFold').addEventListener('click', () => set(!wrap.classList.contains('open')));
  const ew = document.getElementById('dbgEnemyWrap'), em = document.getElementById('dbgEnemyFoldMark'); // 特殊な敵も最初は閉じておく
  document.getElementById('debugEnemyCat').addEventListener('click', () => { const o = !ew.classList.contains('open'); ew.classList.toggle('open', o); em.textContent = o ? '▲ 閉じる' : '▼ 開く'; });
  const ow = document.getElementById('dbgObsWrap'), om = document.getElementById('dbgObsFoldMark'); // 障害物も最初は閉じておく
  document.getElementById('dbgObsCat').addEventListener('click', () => { const o = !ow.classList.contains('open'); ow.classList.toggle('open', o); om.textContent = o ? '▲ 閉じる' : '▼ 開く'; });
  ow.innerHTML = DEBUG_OBSTACLES.map(([k, sp, name], i) => `<button data-dbg-obs="${i}">${sp && OBSTACLE_IMGS[sp] ? `<img class="dbg-obs-img" src="${OBSTACLE_IMGS[sp].src}" alt="">` : k === 'egg' ? '🥚' : '❓'} ${name}</button>`).join('') +
    '<button data-dbg-obs="clear">🧹 障害物を全部消す</button><button data-dbg-obs="reset">↩ この階層の配置に戻す</button>';
  ow.addEventListener('click', ev => {
    const btn = ev.target.closest('[data-dbg-obs]'); if (!btn) return;
    const v = btn.dataset.dbgObs;
    if (v === 'clear') { obstacles = []; showNotice('DEBUG: 障害物を全部消しました'); return; }
    if (v === 'reset') { setupObstacles(true); showNotice('DEBUG: この階層の障害物の配置に戻しました（デバッグで出した分は消去）'); return; }
    const [k, sp, name] = DEBUG_OBSTACLES[+v];
    if (getActiveTab() !== 'game') switchTab('game');
    showNotice(debugSpawnObstacle(k, sp) ? `DEBUG: ${name} を出現` : 'DEBUG: 空いている場所がありません');
  });
})();
let dbgPuPool = [];
function renderDebugPowerUps() {
  const grid = document.getElementById('dbgPuGrid'); if (!grid) return;
  dbgPuPool = buildPowerUpPool();
  grid.innerHTML = dbgPuPool.map((c, i) => `<button style="--pc:${c.col}" data-dbg-pu="${i}"><span>${c.icon}</span><span>${c.label}｜${c.name}</span></button>`).join('');
}
renderDebugPowerUps();
document.getElementById('dbgPuGrid').addEventListener('click', ev => {
  const b = ev.target.closest('[data-dbg-pu]'); if (!b) return;
  const c = dbgPuPool[+b.dataset.dbgPu]; if (!c) return;
  if (phase !== 'battle' && (c.kind === 'comp' || c.kind === 'heal')) { showNotice('DEBUG: 戦闘中に使ってください', true); return; }
  applyPowerUp(c); playPowerUpSound();
  updateStatsUI(); updateHPUI(); saveGame(); renderDebugPowerUps();
  showNotice(`DEBUG: ${c.label}「${c.name}」を取得`);
});
document.getElementById('dbgMonGrid').addEventListener('click', ev => { const b = ev.target.closest('[data-mon]'); if (b) { dbgMonKey = b.dataset.mon; renderDebugMonsters(); } });
// 🎬 撮影モード：選んだ敵を出し、倒しても同じ敵が出続ける（ステージは進まない・自キャラはやられない）。デバッグ一覧を閉じて画面を撮りやすく
let filmMode = null;
document.getElementById('dbgFilmBtn').addEventListener('click', () => {
  const btn = document.getElementById('dbgFilmBtn');
  if (filmMode) { filmMode = null; btn.textContent = '🎬 撮影モード'; showNotice('🎬 撮影モードを終了しました'); return; }
  if (!dbgMonKey) { showNotice('先に敵の画像をタップして選んでください', true); return; }
  filmMode = { key: dbgMonKey };
  btn.textContent = '⏹ 撮影終了';
  document.getElementById('dbgMonShow').click();
  setDebugOpen(false);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  showNotice(`🎬 撮影モード：${ENEMY_BOOK_BY_KEY[dbgMonKey].name} が出続けます（やられません）`);
});
document.getElementById('dbgMonShow').addEventListener('click', () => {
  if (!dbgMonKey) return;
  const b = document.createElement('button'); b.dataset.debug = 'enemy:' + dbgMonKey; b.textContent = ENEMY_BOOK_BY_KEY[dbgMonKey].name; b.style.display = 'none';
  debugRow.appendChild(b); b.click(); b.remove();
});
document.getElementById('dbgMonDel').addEventListener('click', () => {
  if (!dbgMonKey) return;
  if (!game.removedEnemies) game.removedEnemies = {};
  if (game.removedEnemies[dbgMonKey]) delete game.removedEnemies[dbgMonKey]; else game.removedEnemies[dbgMonKey] = true; // もう一度押すと戻す
  saveGame(); renderDebugMonsters();
  showNotice(`DEBUG: ${ENEMY_BOOK_BY_KEY[dbgMonKey].name} を${isEnemyRemoved(dbgMonKey) ? '出現しないように削除' : '元に戻しました'}`);
});
document.getElementById('dbgMonCopy').addEventListener('click', () => {
  const keys = Object.keys(game.removedEnemies || {});
  if (!keys.length) { showNotice('DEBUG: 削除した敵はありません'); return; }
  const ta = document.getElementById('dbgMonList'); // プレビュー内では自動コピーが止められることがあるので、文をその場に表示して選択しておく
  ta.value = 'プログラムから削除する敵: ' + keys.map(k => `${ENEMY_BOOK_BY_KEY[k] ? ENEMY_BOOK_BY_KEY[k].name : ''}(${k})`).join('、');
  ta.style.display = 'block'; ta.focus(); ta.select(); ta.setSelectionRange(0, ta.value.length);
  let ok = false; try { ok = document.execCommand('copy'); } catch (e) {}
  showNotice(ok ? 'DEBUG: コピーしました。チャットに貼り付けてください' : 'DEBUG: 下の枠の文を長押し（右クリック）でコピーしてください');
});
document.getElementById('dbgMonRestore').addEventListener('click', () => { game.removedEnemies = {}; saveGame(); renderDebugMonsters(); showNotice('DEBUG: 削除した敵を全部戻しました'); });
document.getElementById('dbgEnemyWrap').insertAdjacentHTML('beforeend', ENEMY_BOOK.filter(en => ENEMY_TRAITS[en.key])
  .map(en => `<button data-debug="enemy:${en.key}">${en.kind === 'boss' ? '👑' : ''}${en.name}（${ENEMY_TRAIT_LABELS[ENEMY_TRAITS[en.key]]}）</button>`).join(''));
document.getElementById('debugBgmCat').insertAdjacentHTML('afterend', BGM_INFO.map(b => `<button data-debug="bgm:${b.key}">🎵 ${b.name}</button>`).join(''));
function renderBgmInfo() { // （関数宣言なので上のデバッグ処理からも呼べる）
  const cur = currentBgmType;
  document.getElementById('bgmInfoList').innerHTML = `<div class="bi-row">通常戦闘は${NORMAL_BATTLE_SONGS.length}曲・ボス戦は${BOSS_BATTLE_SONGS.length}曲をそれぞれシャッフルして流し、ボスを倒すたびに次の曲へ切り替わります。</div>` +
    BGM_INFO.map(b => `<div class="bi-row ${b.key === cur ? 'now' : ''}"><b>${b.name}</b>：${b.desc}</div>`).join('');
}
renderBgmInfo();
document.getElementById('bgmInfo').addEventListener('toggle', renderBgmInfo);

setInterval(saveGame, 8000);
window.addEventListener('beforeunload', saveGame);
window.addEventListener('pagehide', saveGame);

loadGame();
delete game.level; delete game.exp; // レベル制は廃止（古いセーブの値は使わない）
delete game.bounceAtkBonus;         // 壁反射での攻撃力上昇は廃止
if (game.upgrades) delete game.upgrades.speed; // 移動速度の強化は廃止（タップ加速に置き換え）
if (game.ownedArtifacts) delete game.ownedArtifacts.boots;
if (game.ownedArtifacts) delete game.ownedArtifacts.clover; // 幸運のクローバーは廃止
if (Array.isArray(game.equippedSkills)) game.equippedSkills = game.equippedSkills.filter(x => !PASSIVE_SKILLS.includes(x)); // 常時発動になったスキルは枠から外す
if (game.companions) for (const k of ['recruited', 'awaken', 'count', 'level', 'hp', 'alive']) if (game.companions[k]) delete game.companions[k].cook; // 削除した仲間（陽気な料理人）
if (game.companionBook) delete game.companionBook.cook;
for (const id in COMPANIONS) { // あとから追加した仲間の項目を古いセーブにも用意
  if (game.companions.level && game.companions.level[id] === undefined) game.companions.level[id] = 0;
  if (game.companions.hp && game.companions.hp[id] === undefined) game.companions.hp[id] = 0;
  if (game.companions.alive && game.companions.alive[id] === undefined) game.companions.alive[id] = true;
}
for (const id of ['skillSleep', 'skillHoming', 'skillSacrifice']) { // 削除したスキル（眠り・追尾・捨て身）はセーブからも取り除く
  if (game.shopOwned) delete game.shopOwned[id];
  if (game.skillLevels) delete game.skillLevels[id];
  if (Array.isArray(game.equippedSkills)) game.equippedSkills = game.equippedSkills.filter(x => x !== id);
}
if (game.bestiary && game.bestiary['shape:circle']) {
  if (!game.bestiary['shape:spike']) game.bestiary['shape:spike'] = game.bestiary['shape:circle'];
  delete game.bestiary['shape:circle'];
}
if (game.extraArtifactSlots) game.gems += [50, 150, 400].slice(0, game.extraArtifactSlots).reduce((a, b) => a + b, 0);
delete game.artifactSlots; delete game.extraArtifactSlots;
if (game.evolutions) delete game.evolutions.swift;
if (game.gachaShards) delete game.gachaShards.swift;
if (!game.upgrades) game.upgrades = newUpgradeLevels();
for (const id in UPGRADES) if (typeof game.upgrades[id] !== 'number') game.upgrades[id] = 0;
for (const id in GACHA_POOL) {
  if (typeof game.evolutions[id] !== 'number') game.evolutions[id] = 0;
  if (typeof game.gachaShards[id] !== 'number') game.gachaShards[id] = 0;
}
if (!game.companions.level) game.companions.level = {};
if (!game.companions.hp) game.companions.hp = {};
if (!game.companions.alive) game.companions.alive = {};
COMPANION_IDS.forEach(id => {
  if (typeof game.companions.level[id] !== 'number') game.companions.level[id] = 0;
  if (typeof game.companions.hp[id] !== 'number') game.companions.hp[id] = 0;
  if (typeof game.companions.alive[id] !== 'boolean') game.companions.alive[id] = true;
});
if (!game.companions.awaken) game.companions.awaken = {};
if (!game.companions.count) game.companions.count = {};
for (const id in game.companions.recruited) {
  if (game.companions.recruited[id] && !game.companions.count[id]) game.companions.count[id] = 1; // 旧セーブは1人ずつ
}
for (const id in game.companions.recruited) {
  if (game.companions.recruited[id]) {
    game.companions.hp[id] = getCompanionMaxHP(id);
    game.companions.alive[id] = true;
  }
}
bgmVolRange.value = Math.round((game.bgmVolume ?? 0.7) * 100);
bgmVolVal.textContent = bgmVolRange.value + '%';
sfxVolRange.value = Math.round((game.sfxVolume ?? 0.7) * 100);
sfxVolVal.textContent = sfxVolRange.value + '%';
renderVibrationSetting();
updateRewardAdButtons();
usernameInput.value = game.username || '';
resizeCanvas();
renderArtifactList();
updateStatsUI();
renderChestTray(); // 前回から持ち越した未開封の宝箱
balls = spawnBattleBalls();
refreshPlayerBallStats(true);
refreshCompanionBalls(); // 仲間の状態を正しく設定
updateHPUI();
updateSpecialButton();
updateAccelButton();
updateHealButton();
updateBarrierButton();
updatePoisonButton();
updateParalyzeButton();
updateAtkUpButton();
updateRegenButton();
updateSilenceButton();
updateDeathButton();
updateCoinStrikeButton();
updateZeniButton();
updateMysteryButton();
updateCompRushButton();
updateNovaButton();
currentLang = game.language || 'ja';
applyLanguage(currentLang);
renderAutoUpgradeBtn();
checkLoginBonus(game.lastSeenAt ? Date.now() - game.lastSeenAt : 0);
game.lastSeenAt = Date.now();
if (game.skipChallenge && game.skipChallenge.lost) failSkipChallenge(); // 敗北後の確認中に閉じた場合は確認から再開
loop();
// 起動ローディングを消す（最低0.6秒は表示してチラつかないように）
(() => { const el = document.getElementById('bootLoading'); if (!el) return; const wait = Math.max(0, 600 - performance.now()); setTimeout(() => { el.classList.add('done'); setTimeout(() => el.remove(), 450); }, wait); })();
