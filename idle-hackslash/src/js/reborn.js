// ---- 転生しても飽きない仕組み：周回の掟／転生ボーナスの3択／ダッシュスタート／周回記録／縛りの実績 ----

// ===== 周回の掟（転生のたびに3つから1つ選ぶ。この周回だけのルール） =====
const RUN_RULES = {
  bossRich: { icon: '👑', name: '強者の掟', good: 'ボス撃破の報酬 ×2', bad: 'ボスのHP ×2' },
  solo:     { icon: '🗡️', name: '孤高の掟', good: '攻撃力 ×3', bad: '仲間が戦いに出ない' },
  eventful: { icon: '🎪', name: '祭りの掟', good: 'イベント中のコイン ×1.5', bad: '毎ステージ何かが起きる' },
  gemCoin:  { icon: '💎', name: '宝石の掟', good: '雑魚を倒すと5%でジェム', bad: 'コイン ×0.5' },
  speed:    { icon: '⚡', name: '疾風の掟', good: 'コイン ×1.5', bad: 'すべてが1.25倍速' },
  glass:    { icon: '🔥', name: '背水の掟', good: '攻撃力 ×2', bad: '最大HP ×0.5' },
};
const RUN_RULE_KEYS = Object.keys(RUN_RULES);
function runRule() { return game.runRule && RUN_RULES[game.runRule] ? game.runRule : null; }

// ===== 転生ボーナス（3つから1つ。この周回だけ） =====
const RUN_BONUSES = {
  atk50:   { icon: '⚔️', name: '闘志', desc: 'この周回の攻撃力 +50%' },
  hp50:    { icon: '❤️', name: '頑強', desc: 'この周回の最大HP +50%' },
  coin100: { icon: '🪙', name: '金運', desc: 'この周回のコイン +100%' },
  comp:    { icon: '🐾', name: '旅の友', desc: '最初から仲間が1人いる（★1〜2からランダム）' },
  gems:    { icon: '💎', name: '宝石袋', desc: 'すぐに 💎10 もらえる' },
  dash2:   { icon: '🏃', name: '韋駄天', desc: 'ダッシュスタートの開始ステージが2倍' },
};
const RUN_BONUS_KEYS = Object.keys(RUN_BONUSES);
function runBonus() { return game.runBonus && RUN_BONUSES[game.runBonus] ? game.runBonus : null; }

// ===== ダッシュスタート：最高ステージの15%（10の位で切り捨て＋1）から始められる =====
const DASH_RATE = 0.15, DASH_MIN_BEST = 100;
function dashStartStage(bonus) {
  const best = game.bestStage || 1;
  if (best < DASH_MIN_BEST) return 1;
  const rate = DASH_RATE * (bonus === 'dash2' ? 2 : 1);
  return Math.max(1, Math.floor(best * rate / 10) * 10 + 1);
}

// ===== 効果のつなぎ込み =====
{ const orig = computeBonuses; computeBonuses = function () {
  const b = orig.apply(this, arguments), r = runRule(), bo = runBonus();
  if (r === 'solo') b.atkMult *= 3;
  if (r === 'glass') { b.atkMult *= 2; b.hpMult *= 0.5; }
  if (r === 'gemCoin') b.coinMult *= 0.5;
  if (r === 'speed') b.coinMult *= 1.5;
  if (bo === 'atk50') b.atkMult *= 1.5;
  if (bo === 'hp50') b.hpMult *= 1.5;
  if (bo === 'coin100') b.coinMult *= 2;
  return b;
}; }
{ const orig = getEnemyStats; getEnemyStats = function (stage) {
  const s = orig.apply(this, arguments);
  if (runRule() === 'bossRich' && s.isBoss && !game.skipChallenge) s.hp = Math.round(s.hp * 2);
  return s;
}; }
{ const orig = makeCompanionBalls; makeCompanionBalls = function () { return runRule() === 'solo' ? [] : orig.apply(this, arguments); }; }
{ const orig = syncCompanionBalls; syncCompanionBalls = function () { return runRule() === 'solo' ? [] : orig.apply(this, arguments); }; }
{ const orig = getEffectiveSpeed; getEffectiveSpeed = function () { const v = orig(); return runRule() === 'speed' && phase === 'battle' ? v * 1.25 : v; }; }
if (typeof gimmickForStage === 'function') { const orig = gimmickForStage; gimmickForStage = function (stage) { // 祭りの掟：毎ステージ何かが起きる
  const k = orig.apply(this, arguments);
  if (k || runRule() !== 'eventful' || stage < 3 || stage % 10 === 0 || game.skipChallenge) return k;
  return GIMMICK_KEYS[Math.floor(stageRand(gimmickWindow(stage) * 53 + 11)() * GIMMICK_KEYS.length)];
}; }
if (typeof gimmickCoinMult === 'function') { const orig = gimmickCoinMult; gimmickCoinMult = function () { const m = orig(); return runRule() === 'eventful' && curGimmick() ? m * 1.5 : m; }; }
{ const orig = onStageClear; onStageClear = function (passed) {
  const before = game.coins, wasBoss = game.stage % 10 === 0 && !game.skipChallenge, r = runRule();
  orig.apply(this, arguments);
  if (passed) return;
  if (r === 'bossRich' && wasBoss) { const d = game.coins - before; if (d > 0) { game.coins += d; spawnDamageText(arena.x, arena.y - 60, `👑 強者の掟 報酬×2 +${formatCoinNumber(d)} 🟡`, '#ffd76b', 0.01, true); } }
  if (r === 'gemCoin' && !wasBoss && Math.random() < 0.05) { game.gems += 1; spawnDamageText(arena.x, arena.y - 60, '💎 宝石の掟 +1 💎', '#64e8ff', 0.012, true); updateStatsUI(); }
}; }

// ===== 周回記録 =====
const RUN_RECORD_STAGES = [100, 500, 1000, 5000, 10000];
function runRec() { if (!game.runRec) game.runRec = { best: 0, fast: {} }; if (!game.runRec.fast) game.runRec.fast = {}; return game.runRec; }
function fmtTime(ms) { const s = Math.floor(ms / 1000), h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60, ss = s % 60; return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(ss).padStart(2, '0'); }
if (!game.runStartAt) game.runStartAt = Date.now();
if (!game.runReached) game.runReached = {};
// 遊んでいる時間だけ数える（アプリを閉じている間は進めない）
setInterval(() => { if (document.hidden || phase !== 'battle') return; game.runPlayMs = (game.runPlayMs || 0) + 1000; }, 1000);

// ===== 縛りの実績（周回中に条件を満たすとジェム） =====
const RUN_FEATS = [
  { id: 'solo100', icon: '🗡️', name: '一匹狼', desc: '仲間なしでステージ100に到達', gems: 10, check: st => st >= 100 && getCompanionTotal() === 0 },
  { id: 'noSkill50', icon: '🚫', name: '素手の勇者', desc: 'スキルを1つも装備せずにステージ50に到達', gems: 5, check: st => st >= 50 && getEquippedSkills().length === 0 },
  { id: 'fast100', icon: '⏱️', name: '韋駄天', desc: '周回開始から10分以内にステージ100に到達', gems: 10, check: st => st >= 100 && (game.runPlayMs || 0) <= 600000 },
  { id: 'fast500', icon: '🚀', name: '流星', desc: '周回開始から30分以内にステージ500に到達', gems: 20, check: st => st >= 500 && (game.runPlayMs || 0) <= 1800000 },
  ...RUN_RULE_KEYS.map(k => ({ id: 'rule_' + k, icon: RUN_RULES[k].icon, name: RUN_RULES[k].name + 'の覇者', desc: `「${RUN_RULES[k].name}」の周回でステージ100に到達`, gems: 5, check: st => st >= 100 && runRule() === k })),
  { id: 'reb10', icon: '🌌', name: '輪廻の旅人', desc: '転生10回', gems: 10, check: () => (game.reincarnations || 0) >= 10 },
  { id: 'reb30', icon: '🌠', name: '輪廻の達人', desc: '転生30回', gems: 20, check: () => (game.reincarnations || 0) >= 30 },
  { id: 'reb100', icon: '♾️', name: '輪廻の覇王', desc: '転生100回', gems: 50, check: () => (game.reincarnations || 0) >= 100 },
];
function checkRunProgress() {
  if (!game.runFeats) game.runFeats = {};
  const st = game.stage || 1, rec = runRec();
  for (const th of RUN_RECORD_STAGES) { // 最速記録
    if (st < th || game.runReached[th]) continue;
    game.runReached[th] = true;
    const t = game.runPlayMs || 0, old = rec.fast[th];
    if (!old || t < old) { rec.fast[th] = t; if (old) showRunBanner('⏱️ 新記録！', `ステージ${th}まで ${fmtTime(t)}（前回 ${fmtTime(old)}）`); }
  }
  if (st > (rec.curBest || 0)) rec.curBest = st;
  for (const f of RUN_FEATS) {
    if (game.runFeats[f.id] || !f.check(st)) continue;
    game.runFeats[f.id] = true; game.gems += f.gems; updateStatsUI();
    showRunBanner(`🏅 実績「${f.name}」`, `${f.desc}　+💎${f.gems}`);
    saveGame();
  }
}
setInterval(() => { try { if (phase === 'battle') checkRunProgress(); } catch (e) { console.error(e); } }, 1000);
function showRunBanner(title, text) {
  const el = document.createElement('div'); el.className = 'run-banner';
  el.innerHTML = `<b>${title}</b><span>${text}</span>`;
  document.body.appendChild(el);
  playTone(784, 0.1, 'square', 0.05, 1175); setTimeout(() => playTone(1568, 0.25, 'triangle', 0.06), 120);
  setTimeout(() => el.classList.add('out'), 3200); setTimeout(() => el.remove(), 3700);
}

// ===== 転生の前後 =====
{ const orig = completeReincarnation; completeReincarnation = function () {
  const rec = runRec(); rec.best = Math.max(rec.best || 0, game.stage || 1, rec.curBest || 0); rec.curBest = 0; // 1周の最高ステージ
  rec.lastRunStage = game.stage; rec.lastRunMs = game.runPlayMs || 0;
  game.runRule = null; game.runBonus = null;
  return orig.apply(this, arguments);
}; }
{ const orig = startNextRun; startNextRun = function () {
  orig.apply(this, arguments);
  game.runStartAt = Date.now(); game.runPlayMs = 0; game.runReached = {};
  if ((game.reincarnations || 0) > 0) setTimeout(openRunStartDialog, 400);
}; }

// ===== 周回の始まりのダイアログ（掟 → 転生ボーナス → ダッシュスタート） =====
function pickN(keys, n) { const a = [...keys]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a.slice(0, n); }
function openRunStartDialog() {
  if (document.getElementById('runStartModal')) return;
  const prevPhase = phase; phase = 'paused';
  const ov = document.createElement('div'); ov.className = 'modal-overlay show'; ov.id = 'runStartModal'; ov.style.zIndex = 85;
  document.body.appendChild(ov);
  const finish = () => {
    ov.remove(); phase = prevPhase === 'paused' ? 'battle' : prevPhase;
    const bo = runBonus();
    if (bo === 'gems') { game.gems += 10; }
    if (bo === 'comp') { const pool = COMPANION_IDS.filter(id => ['common', 'rare'].includes(COMPANIONS[id].rarity) && isCompanionUnlocked(id)); const id = pool[Math.floor(Math.random() * pool.length)]; if (id) { grantCompanion(id); showNotice(`🐾 ${COMPANIONS[id].name}が仲間になった！`); } }
    const dash = dashStartStage(bo);
    if (dash > 1 && game.stage < dash) {
      game.stage = dash; game.coins += Math.round(stageCoinRaw(dash) * computeBonuses().coinMult * 15); // 強化の元手も少し
      spawnNextEnemy(); refreshPlayerBallStats(true);
      stageAnnounceText = 'ステージ' + formatStageNumber(dash); stageAnnounceTimer = STAGE_ANNOUNCE_DURATION;
      showRunBanner('🏃 ダッシュスタート！', `ステージ${dash}から始めます（最高ステージの${Math.round(DASH_RATE * (bo === 'dash2' ? 2 : 1) * 100)}%）`);
    }
    renderRunRuleChip(); updateStatsUI(); updateHPUI(); saveGame();
  };
  const step2 = () => {
    const opts = pickN(RUN_BONUS_KEYS.filter(k => k !== 'dash2' || (game.bestStage || 1) >= DASH_MIN_BEST), 3);
    ov.innerHTML = `<div class="modal-panel rs-panel"><div class="rs-title">🎁 転生ボーナスを1つ選ぼう</div><div class="rs-sub">この周回のあいだだけ効きます</div><div class="rs-cards">${opts.map(k => `<button class="rs-card" data-bonus="${k}"><span class="rs-ico">${RUN_BONUSES[k].icon}</span><b>${RUN_BONUSES[k].name}</b><small>${RUN_BONUSES[k].desc}</small></button>`).join('')}</div></div>`;
    ov.querySelectorAll('[data-bonus]').forEach(b => b.addEventListener('click', () => { game.runBonus = b.dataset.bonus; playUpgradeSound(); finish(); }));
  };
  const opts = pickN(RUN_RULE_KEYS, 3), dash = dashStartStage(null);
  ov.innerHTML = `<div class="modal-panel rs-panel"><div class="rs-title">📜 ${game.reincarnations}回目の周回 ― 掟を選ぼう</div><div class="rs-sub">掟は周回ごとに変わる特別ルール（良いことと悪いことがセット）</div>
    <div class="rs-cards">${opts.map(k => { const r = RUN_RULES[k]; return `<button class="rs-card" data-rule="${k}"><span class="rs-ico">${r.icon}</span><b>${r.name}</b><small class="good">▲ ${r.good}</small><small class="bad">▼ ${r.bad}</small>${game.runFeats && game.runFeats['rule_' + k] ? '' : '<i class="rs-new">実績チャンス</i>'}</button>`; }).join('')}</div>
    <button class="rs-skip" data-rule="">掟なしで始める</button>${dash > 1 ? `<div class="rs-dash">🏃 ダッシュスタート：ステージ${dash}から始まります</div>` : ''}</div>`;
  ov.querySelectorAll('[data-rule]').forEach(b => b.addEventListener('click', () => { game.runRule = b.dataset.rule || null; playTone(880, 0.08, 'triangle', 0.08); step2(); }));
  playTone(523, 0.12, 'triangle', 0.08, 784);
}

// ===== 今の掟をゲーム画面の左上に小さく出す =====
function renderRunRuleChip() {
  const wrap = document.querySelector('.arena-wrap'); if (!wrap) return;
  let el = document.getElementById('runRuleChip');
  const r = runRule(), bo = runBonus();
  if (!r && !bo) { if (el) el.remove(); return; }
  if (!el) { el = document.createElement('button'); el.id = 'runRuleChip'; el.className = 'run-rule-chip'; wrap.appendChild(el); el.addEventListener('click', ev => { const r2 = runRule(), b2 = runBonus(); showTapError(`${r2 ? `${RUN_RULES[r2].icon}${RUN_RULES[r2].name}：▲${RUN_RULES[r2].good}／▼${RUN_RULES[r2].bad}` : ''}${b2 ? `　${RUN_BONUSES[b2].icon}${RUN_BONUSES[b2].desc}` : ''}`, ev.clientX, ev.clientY); }); }
  el.innerHTML = `${r ? RUN_RULES[r].icon + ' ' + RUN_RULES[r].name : ''}${bo ? ' ' + RUN_BONUSES[bo].icon : ''}`;
}
renderRunRuleChip();

// ===== 戦績ページ：周回記録と縛りの実績 =====
{ const orig = renderQuests; renderQuests = function () {
  orig(); const host = document.getElementById('questBox'); if (!host) return;
  const rec = runRec(), feats = game.runFeats || {}, got = RUN_FEATS.filter(f => feats[f.id]).length;
  const fastRows = RUN_RECORD_STAGES.filter(th => rec.fast[th]).map(th => `<div class="rr-row"><span>⏱️ ステージ${th}まで最速</span><b>${fmtTime(rec.fast[th])}</b></div>`).join('');
  host.insertAdjacentHTML('beforeend', `<div class="qb-sec rr-box"><div class="qb-head">🏆 周回記録</div>
    <div class="rr-row"><span>🌌 転生回数</span><b>${game.reincarnations || 0}回</b></div>
    <div class="rr-row"><span>🏔️ 1周の最高ステージ</span><b>${Math.max(rec.best || 0, rec.curBest || 0)}</b></div>
    <div class="rr-row"><span>⏳ 今の周回のプレイ時間</span><b>${fmtTime(game.runPlayMs || 0)}</b></div>${fastRows || '<div class="rr-row"><span>⏱️ 最速記録はステージ100到達から</span></div>'}</div>
    <div class="qb-sec rr-box"><div class="qb-head">🏅 縛りの実績 ${got}/${RUN_FEATS.length}</div><div class="rf-list">${RUN_FEATS.map(f => `<div class="rf-row ${feats[f.id] ? 'got' : ''}"><span class="rf-ico">${feats[f.id] ? f.icon : '🔒'}</span><span class="rf-main"><b>${f.name}</b><small>${f.desc}</small></span><span class="rf-gem">${feats[f.id] ? '✓' : '💎' + f.gems}</span></div>`).join('')}</div></div>`);
}; }
