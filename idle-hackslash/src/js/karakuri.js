// ===== ステージイベント「からくり仕掛けの間」：障害物が決まった道すじで動きまわる =====
// 歯車・トゲ玉（ぶつかった敵だけが痛い。勇者や仲間はケガをしない）と、バンパー（勢いよく弾き返す）が、往復・円・8の字に動く。
// 動く障害物は押しても動かない（道すじどおりに動く）。ステージが変わると、ふつうの障害物の代わりに置き直す。
GIMMICKS.karakuri = { name: 'からくり仕掛けの間', icon: '⚙️', desc: '障害物が動きまわる。動く歯車に敵をぶつけよう。コイン×1.2', coin: 1.2 };
GIMMICK_KEYS.push('karakuri'); GIMMICK_FIRST_RUN.push('karakuri');
// 道すじ：位置はバトル画面の中心からの割合（横は画面の半分の幅、縦は半分の高さが1）。ph はコマごとに進む
const KARAKURI_LAYOUTS = [
  { name: '往復', parts: [ // バンパーが左右に、歯車が上下に行き来する
    { kind: 'bumper', path: t => [Math.sin(t * 0.018) * 0.62, -0.42] },
    { kind: 'bumper', path: t => [-Math.sin(t * 0.018) * 0.62, 0.42] },
    { kind: 'spike', sprite: 'gear', path: t => [-0.32, Math.sin(t * 0.014) * 0.6] },
    { kind: 'spike', sprite: 'gear', path: t => [0.32, -Math.sin(t * 0.014) * 0.6] },
  ] },
  { name: '回転', parts: [0, 1, 2, 3].map(i => ({ kind: i % 2 ? 'bumper' : 'spike', sprite: i % 2 ? null : 'gear', path: t => [Math.cos(t * 0.011 + i * Math.PI / 2) * 0.55, Math.sin(t * 0.011 + i * Math.PI / 2) * 0.55] }))
    .concat([{ kind: 'spike', sprite: 'spikeBall', path: t => [Math.cos(-t * 0.02) * 0.2, Math.sin(-t * 0.02) * 0.2] }]) },
  { name: '8の字', parts: [ // トゲ玉が8の字を描き、バンパーが外側を回る
    { kind: 'spike', sprite: 'spikeBall', path: t => [Math.sin(t * 0.012) * 0.6, Math.sin(t * 0.024) * 0.35] },
    { kind: 'spike', sprite: 'spikeBall', path: t => [-Math.sin(t * 0.012) * 0.6, -Math.sin(t * 0.024) * 0.35] },
    { kind: 'bumper', path: t => [Math.cos(t * 0.009) * 0.7, Math.sin(t * 0.009) * 0.7] },
    { kind: 'bumper', path: t => [Math.cos(t * 0.009 + Math.PI) * 0.7, Math.sin(t * 0.009 + Math.PI) * 0.7] },
  ] },
];
let karakuriState = null; // { stage, layout, t }
function karakuriPlace() {
  const L = KARAKURI_LAYOUTS[Math.abs(Math.floor(game.stage)) % KARAKURI_LAYOUTS.length], r = Math.max(14, arena.radius * 0.1);
  obstacles = obstacles.filter(o => o.kind === 'reflector' || o.debug); // ふつうの障害物は片づけて、動く障害物に置きかえる（反射玉は残す）
  L.parts.forEach((p, i) => {
    const o = { x: arena.x, y: arena.y, r: p.kind === 'bumper' ? r * 0.85 : r * 0.9, seed: Math.random(), kind: p.kind, hp: 1, cracks: [], karakuri: p.path };
    o.sprite = p.sprite || (p.kind === 'bumper' ? 'orb_' + ORB_COLORS[i % ORB_COLORS.length] : 'gear');
    obstacles.push(o);
  });
  karakuriState = { stage: obstacleStage, layout: L, t: 0 };
  karakuriMove(0);
  spawnDamageText(arena.x, arena.y - 70, `⚙️ からくり起動！（${L.name}）`, '#9fe0ff', 0.01, true);
  try { [0, 120, 240].forEach((at, i) => setTimeout(() => { thump(300 + i * 80, 120, 0.08, 0.12, 'square'); playTone(880 + i * 220, 0.05, 'square', 0.04); }, at)); } catch (err) {} // カチ・カチ・カチッ
}
function karakuriMove(dt) {
  const k = karakuriState; if (!k) return;
  k.t += dt;
  const hx = arenaHalf(), hy = arenaHalfY();
  for (const o of obstacles) {
    if (!o.karakuri) continue;
    const [px, py] = o.karakuri(k.t), nx = arena.x + px * (hx - o.r - 6), ny = arena.y + py * (hy - o.r - 6);
    o.kvx = nx - o.x; o.kvy = ny - o.y; o.x = nx; o.y = ny; o.mvx = 0; o.mvy = 0; // 押されても動かない（道すじどおり）
  }
}
function tickKarakuri() {
  if (typeof curGimmick !== 'function' || curGimmick() !== 'karakuri' || game.skipChallenge) {
    if (karakuriState) { karakuriState = null; obstacles = obstacles.filter(o => !o.karakuri); }
    return;
  }
  if (!karakuriState || karakuriState.stage !== obstacleStage || !obstacles.some(o => o.karakuri)) { karakuriPlace(); return; }
  karakuriMove(typeof getEffectiveSpeed === 'function' ? getEffectiveSpeed() : 1);
}
{ const orig = step; step = function () { try { tickKarakuri(); } catch (err) { console.warn(err); } return orig.apply(this, arguments); }; }
{ const sel = document.getElementById('dbgGimmickSel'); if (sel && !sel.querySelector('option[value="karakuri"]')) sel.insertAdjacentHTML('beforeend', `<option value="karakuri">${GIMMICKS.karakuri.icon} ${GIMMICKS.karakuri.name}</option>`); } // デバッグのステージギミックの選択肢にも足す
