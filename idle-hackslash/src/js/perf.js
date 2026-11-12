// ===== 処理落ち対策：ゲームの1コマ（loop）の中では、重い計算の結果を使い回す =====
// computeBonuses（自キャラ・仲間の倍率の計算）は1コマに90回ほど呼ばれていたので、1コマの中では最初の1回の結果を使う。
// ボタンを押したときなど、ゲームの1コマの外では今までどおり毎回計算する（強化した直後の表示がずれないように）。
let perfInFrame = false, perfBonusMemo = null, perfGraceMemo = null;
{ const orig = computeBonuses; computeBonuses = function () {
  if (!perfInFrame || bonusTraceOn) return orig.apply(this, arguments);
  if (!perfBonusMemo) perfBonusMemo = orig.apply(this, arguments);
  return Object.assign({}, perfBonusMemo); // 呼んだ側が書き換えても使い回しの元は変わらないように写しを返す
}; }
{ const orig = partyGraceMult; partyGraceMult = function () {
  if (!perfInFrame) return orig.apply(this, arguments);
  if (perfGraceMemo == null) perfGraceMemo = orig.apply(this, arguments);
  return perfGraceMemo;
}; }
{ const orig = loop; loop = function () {
  perfInFrame = true; perfBonusMemo = null; perfGraceMemo = null;
  try { return orig.apply(this, arguments); } finally { perfInFrame = false; perfBonusMemo = null; perfGraceMemo = null; }
}; }
// ===== 床（と背景の一枚絵）は動かないので、一度描いたら取っておいて、毎コマはそれを貼るだけにする =====
// 床の模様・別の床の重ね・周りの影・村や教会などの大きな背景の縮小を毎コマ描き直していて、スマホ（Pixel 6 など）で1コマの大半を使っていた。
// ステージ・床の絵・背景の読み込み・画面の大きさが変わったときだけ描き直す。
let floorCache = null; // { cv, key }
{ const orig = drawArenaFloor; drawArenaFloor = function () {
  try {
    const gk = typeof curGimmick === 'function' ? curGimmick() : null, bg = gk && typeof stageArt === 'function' ? stageArt('bg_' + gk) : null;
    if (gk && !bg && ((typeof GIMMICK_DECOR !== 'undefined' && GIMMICK_DECOR[gk]) || gk === 'castle')) return orig.apply(this, arguments); // 背景の絵がまだで、動く飾りを描いている間は取っておかない
    const c = ctx.canvas, m = ctx.getTransform(), fk = getFloorKey(game.stage);
    let ready = 0; for (const k in floorImgs) { const im = floorImgs[k]; if (im && im.complete && im.naturalWidth) ready++; }
    const key = [c.width, c.height, m.a, m.d, m.e, m.f, arena.x, arena.y, arena.radius, arenaHalfY(), game.stage, fk, gk || '', bg ? bg.naturalWidth : 0, ready, lastReadyFloorKey || ''].join('|');
    if (!floorCache || floorCache.key !== key || floorCache.cv.width !== c.width || floorCache.cv.height !== c.height) {
      const cv = (floorCache && floorCache.cv) || document.createElement('canvas'); cv.width = c.width; cv.height = c.height;
      const oc = cv.getContext('2d'); oc.setTransform(m);
      const real = ctx; ctx = oc; try { orig.apply(this, arguments); } finally { ctx = real; }
      floorCache = { cv, key };
    } else if (typeof warmUpcomingStage === 'function') warmUpcomingStage(); // 次の階の床・背景の先読みは毎コマ続ける
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.drawImage(floorCache.cv, 0, 0); ctx.restore();
  } catch (e) { floorCache = null; return orig.apply(this, arguments); }
}; }
