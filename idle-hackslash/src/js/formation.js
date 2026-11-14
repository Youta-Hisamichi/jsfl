// ===== ステージイベント「陣形の進軍」：敵が陣形を組んで、隊列を保ったまま進軍してくる =====
// 陣形の真ん中が勇者のほうへゆっくり進み、向きもゆっくり変える。敵はそれぞれ陣形の中の持ち場へ戻ろうとし続ける（弾き飛ばしても隊列に戻る）。
// 大群ステージと同じく、全部倒すと次のステージへ。残りが少なくなると陣形が崩れて、ばらばらに襲ってくる。
GIMMICKS.formation = { name: '陣形の進軍', icon: '🚩', desc: '敵が陣形を組んで進軍してくる。全部倒すと次へ。コイン×1.3', coin: 1.3 };
GIMMICK_KEYS.push('formation'); GIMMICK_FIRST_RUN.push('formation');
const FORM_GAP = 48; // 陣形の中の敵どうしの間かく
const FORMATIONS = [ // 持ち場：前（進む向き）が +x。間かく1マスぶんの単位で書く
  { name: '鶴翼の陣', note: '翼を広げて包みこむ', slots: () => { const a = [[0, 0]]; for (let k = 1; k <= 4; k++) a.push([k * 0.75, -k], [k * 0.75, k]); return a; } },
  { name: '魚鱗の陣', note: '三角の先で突き破る', slots: () => { const a = []; for (let r = 0; r < 4; r++) for (let i = 0; i <= r; i++) a.push([-r * 0.9, i - r / 2]); return a; } },
  { name: '方円の陣', note: '円く固めて守る', slots: () => { const a = [[0, 0]]; for (let i = 0; i < 8; i++) a.push([Math.cos(i * Math.PI / 4) * 1.5, Math.sin(i * Math.PI / 4) * 1.5]); return a; } },
  { name: '横陣', note: '横一列に押し寄せる', slots: () => { const a = []; for (let i = -4; i <= 4; i++) a.push([0, i]); return a; } },
  { name: '方陣', note: '四角く隊列を組む', slots: () => { const a = []; for (let y = -1; y <= 1; y++) for (let x = -1; x <= 1; x++) a.push([x, y]); return a; } },
];
const FORM_BREAK_LEFT = 3; // 残りがこの数以下になったら陣形が崩れる
let fmState = null; // { stage, f, cx, cy, ang, vx, vy, r, broken }
function formationSlot(ball) {
  const g = fmState, s = ball.form && ball.form.slot; if (!g || !s || g.broken) return { x: ball.x, y: ball.y, vx: 0, vy: 0 };
  const c = Math.cos(g.ang), n = Math.sin(g.ang);
  return { x: g.cx + s[0] * c - s[1] * n, y: g.cy + s[0] * n + s[1] * c, vx: g.vx, vy: g.vy };
}
function formationMembers() { const main = balls.find(b => !b.isPlayer); return [main, ...adds].filter(m => m && m.form && m.hp > 0 && !m.isDying); }
function spawnFormation(e, pl) {
  const f = FORMATIONS[Math.abs(game.stage) % FORMATIONS.length];
  let pts = f.slots().map(([x, y]) => [x * FORM_GAP, y * FORM_GAP]);
  const mx = pts.reduce((s, p) => s + p[0], 0) / pts.length, my = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  pts = pts.map(([x, y]) => [x - mx, y - my]); // 真ん中を陣形の中心に
  const r = Math.max(...pts.map(([x, y]) => Math.hypot(x, y))) + 20;
  let lead = 0; pts.forEach((p, i) => { if (Math.hypot(p[0], p[1]) < Math.hypot(pts[lead][0], pts[lead][1])) lead = i; }); // 本体（いちばん真ん中）
  const hx = arenaHalf(), hy = arenaHalfY(), clampX = x => Math.max(arena.x - hx + r, Math.min(arena.x + hx - r, x)), clampY = y => Math.max(arena.y - hy + r, Math.min(arena.y + hy - r, y));
  const fromTop = pl.y > arena.y; // 勇者と反対側から現れる
  const cx = r * 2 > hx * 2 ? arena.x : clampX(arena.x + (Math.random() - 0.5) * hx * 0.6), cy = r * 2 > hy * 2 ? arena.y : clampY(fromTop ? arena.y - hy * 0.55 : arena.y + hy * 0.55);
  fmState = { stage: game.stage, f, cx, cy, ang: Math.atan2(pl.y - cy, pl.x - cx), vx: 0, vy: 0, r, broken: false };
  const hp = Math.max(4, Math.round(e.maxHp * 0.3)), atk = Math.max(1, Math.round(e.atk * 0.5));
  pts.forEach((slot, i) => {
    let m;
    if (i === lead) { m = e; } else {
      m = makeAddEnemy(e);
      Object.assign(m, { shape: e.shape, emoji: e.emoji, color: e.color, glow: e.glow, maxHp: hp, hp, atk, spawnTimer: 0, isSwarmMate: true, isFormation: true });
      adds.push(m);
    }
    m.movementStyle = 'formation'; m.form = { slot };
    const p = formationSlot(m); m.x = p.x; m.y = p.y; m.vx = 0; m.vy = 0;
    for (let k = 0; k < 5; k++) particles.push({ x: m.x, y: m.y, vx: (Math.random() - 0.5) * 3, vy: (Math.random() - 0.5) * 3, life: 0.7, color: '#ffd76b', decay: 0.05 });
  });
  e.swarmStarted = true; // 大群ステージの「仲間を呼ぶ」かわりに陣形
  spawnDamageText(arena.x, arena.y - 70, `🚩 ${f.name}！`, '#ffd76b', 0.009, true);
  showNotice(`🚩 ${f.name}（${f.note}）！ 敵が${pts.length}体で進軍してくる。全部倒すと次へ`, false, 3200);
  try { [0, 260, 520, 680, 840].forEach((at, i) => setTimeout(() => { thump(i < 3 ? 90 : 120, 45, 0.25, 0.45); if (i >= 3) playTone(392 + i * 60, 0.12, 'square', 0.05); }, at)); } catch (err) {} // 進軍の太鼓「ドン・ドン・ドン・ドドン」
}
function tickFormation() {
  if (typeof curGimmick !== 'function' || curGimmick() !== 'formation' || game.skipChallenge) { fmState = null; return; }
  const e = balls.find(b => !b.isPlayer), pl = balls.find(isMainPlayerBall); if (!e || !pl || e.isBoss) return;
  if (fmState && fmState.stage !== game.stage) fmState = null;
  if (!fmState) { if (!e.formDone && !e.isDying && !(e.spawnTimer > 0)) { e.formDone = true; spawnFormation(e, pl); } return; }
  const g = fmState, sm = typeof getEffectiveSpeed === 'function' ? getEffectiveSpeed() : 1;
  if (!g.broken) {
    const left = formationMembers();
    if (left.length && left.length <= FORM_BREAK_LEFT) { // 陣形が崩れた：ばらばらに襲ってくる
      g.broken = true; g.vx = g.vy = 0;
      for (const m of left) { m.movementStyle = 'normal'; m.form = null; }
      spawnDamageText(arena.x, arena.y - 50, '💥 陣形が崩れた！', '#ff9d4f', 0.012, true);
      return;
    }
    const want = Math.atan2(pl.y - g.cy, pl.x - g.cx); let da = want - g.ang; while (da > Math.PI) da -= Math.PI * 2; while (da < -Math.PI) da += Math.PI * 2;
    g.ang += Math.max(-0.01, Math.min(0.01, da)) * sm; // 向きはゆっくり変える
    const d = Math.hypot(pl.x - g.cx, pl.y - g.cy), sp = WALK_SPEED * (d > 70 ? 0.42 : 0.12);
    g.vx = Math.cos(g.ang) * sp; g.vy = Math.sin(g.ang) * sp;
    const hx = arenaHalf(), hy = arenaHalfY(), lim = (v, c, h) => g.r * 2 > h * 2 ? c : Math.max(c - h + g.r, Math.min(c + h - g.r, v));
    g.cx = lim(g.cx + g.vx * sm, arena.x, hx); g.cy = lim(g.cy + g.vy * sm, arena.y, hy);
  }
}
{ const orig = step; step = function () { try { tickFormation(); } catch (err) { console.warn(err); } return orig.apply(this, arguments); }; }
// 陣形が残っている間は、本体を倒しても全部倒すまで次へ進まない（大群ステージと同じ扱い）
{ const orig = isSwarmStage; isSwarmStage = function (stage) { return orig.apply(this, arguments) || (!!fmState && fmState.stage === stage && stage === game.stage); }; }
{ const sel = document.getElementById('dbgGimmickSel'); if (sel && !sel.querySelector('option[value="formation"]')) sel.insertAdjacentHTML('beforeend', `<option value="formation">${GIMMICKS.formation.icon} ${GIMMICKS.formation.name}</option>`); } // デバッグのステージギミックの選択肢にも足す
