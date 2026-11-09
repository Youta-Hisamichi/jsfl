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
