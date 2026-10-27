// ===== 属性相場（みんなの属性の流行を株価にたとえた仕組み） =====
// ・毎日、冒険者たち（全プレイヤー共通の日付シードで動く）の属性の人気が変わる
// ・人気の属性は魔物に研究されて効きにくく、人気のない属性は不意を突けて効きやすい（戦闘の補正）
// ・ジェムで属性の「株」を買える。株価＝その属性の人気。翌日の人気が上がれば得、下がれば損（翌日に自動で精算）
// ・明日みんながどの属性に流れるかは「うわさ」から読むしかない（7割くらい当たる）
const MKT_ELEMS = ['fire', 'water', 'grass'];
const MKT_BET_MAX = 30; // 1日に買える株（ジェム）の上限
function mktDayKey(off = 0) { const d = new Date(); d.setDate(d.getDate() + off); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; }
function mktHash(s) { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return (h >>> 0) / 4294967296; }
function mktRand(day, k) { return mktHash(day + '|' + k); }
const mktShareCache = {};
function mktCrowdShare(off) { // その日の冒険者たちの属性の割合（前の日の流れを引きずりつつ、毎日ゆらぐ）
  const day = mktDayKey(off); if (mktShareCache[day]) return mktShareCache[day];
  let s = { fire: 1 / 3, water: 1 / 3, grass: 1 / 3 };
  for (let i = 40; i >= 0; i--) {
    const d = mktDayKey(off - i), boom = mktRand(d, 'boom'), hot = MKT_ELEMS[Math.floor(mktRand(d, 'hot') * 3)];
    const n = {}; let sum = 0;
    for (const e of MKT_ELEMS) { const r = 0.4 + mktRand(d, e) + (boom > 0.7 && e === hot ? 0.9 : 0); n[e] = s[e] * 0.5 + r / 3 * 0.5 * 1.2 + (1 / 3 - s[e]) * 0.25; sum += n[e]; } // 流行は続きやすいが、偏りすぎると戻る
    for (const e of MKT_ELEMS) n[e] = Math.max(0.08, n[e] / sum);
    sum = MKT_ELEMS.reduce((a, e) => a + n[e], 0); for (const e of MKT_ELEMS) n[e] /= sum;
    s = n;
  }
  return (mktShareCache[day] = s);
}
function mktPrice(off, e) { return Math.round(mktCrowdShare(off)[e] * 300); } // 株価（平均100）
// 自分の最近の使い方（自キャラとパーティの属性・昨日と今日）
function mktMyUse() {
  const u = game.elemUse || {}, t = u[mktDayKey(0)] || {}, y = u[mktDayKey(-1)] || {}, r = {}; let sum = 0;
  for (const e of MKT_ELEMS) { r[e] = (t[e] || 0) + (y[e] || 0) * 0.5; sum += r[e]; }
  return sum > 0 ? Object.fromEntries(MKT_ELEMS.map(e => [e, r[e] / sum])) : null;
}
function mktShareWithMe() { const c = mktCrowdShare(0), m = mktMyUse(); return m ? Object.fromEntries(MKT_ELEMS.map(e => [e, c[e] * 0.9 + m[e] * 0.1])) : c; } // 自分の偏りも1割だけ混ざる
function marketMult(e) { if (!ELEMENTS_ON || !e || !MKT_ELEMS.includes(e)) return 1; const s = mktShareWithMe()[e]; return Math.max(0.75, Math.min(1.45, Math.pow((1 / 3) / s, 0.7))); } // 人気ほど効きにくい
// 戦闘中、自キャラと仲間の属性を数えておく（10秒ごと）
setInterval(() => {
  if (phase !== 'battle') return;
  const day = mktDayKey(0); if (!game.elemUse) game.elemUse = {};
  for (const k of Object.keys(game.elemUse)) if (k !== day && k !== mktDayKey(-1)) delete game.elemUse[k];
  const u = game.elemUse[day] || (game.elemUse[day] = {});
  const he = getHeroElement(); if (he) u[he] = (u[he] || 0) + 2;
  for (const b of balls) if (b.isCompanion && b.hp > 0) { const ce = compElement(b.companionId); if (ce) u[ce] = (u[ce] || 0) + 1; }
}, 10000);
// 戦闘の補正：自キャラと仲間の攻撃力に相場をかける
{ const orig = getCompanionBallAtk; getCompanionBallAtk = function (id) { return Math.max(1, Math.round(orig(id) * marketMult(compElement(id)))); }; }
{ const orig = getPlayerAtk; getPlayerAtk = function () { return Math.max(1, Math.round(orig() * marketMult(getHeroElement()))); }; }
// うわさ：明日の流れを7割くらいの確かさで伝える
const MKT_NEWS = {
  up: ['{e}属性の強い新キャラが出たらしい', '有名配信者が{e}パーティで大活躍', '{e}属性の攻略記事がバズっている', '{e}の装備が安売り中という話'],
  down: ['{e}属性はもう飽きたという声が多い', '{e}パーティで全滅した報告が相次ぐ', '{e}属性の弱点が見つかったらしい', 'ベテラン勢が{e}から乗り換え始めた'],
};
function mktNews() {
  const today = mktDayKey(0);
  return MKT_ELEMS.map(e => {
    const real = mktPrice(1, e) >= mktPrice(0, e) ? 'up' : 'down', truth = mktRand(today, 'news' + e) < 0.7;
    const dir = truth ? real : (real === 'up' ? 'down' : 'up'), list = MKT_NEWS[dir];
    return { e, dir, text: list[Math.floor(mktRand(today, 'nt' + e) * list.length)].replace('{e}', ELEMENTS[e].name) };
  });
}
// 株：今日買って、日付が変わったら翌日の株価で自動精算
function mktSettle() {
  const m = game.market; if (!m || !m.day || m.day === mktDayKey(0)) return null;
  const res = []; let back = 0, put = 0;
  // 買った日の株価と、その翌日の株価で精算（何日もあとに来ても、翌日の値動きで）
  const d0 = new Date(); let off = 0; for (let i = 0; i < 400 && mktDayKey(-i) !== m.day; i++) off = -i - 1;
  for (const e of MKT_ELEMS) { const g = (m.hold || {})[e] || 0; if (!g) continue; const p0 = mktPrice(off, e), p1 = mktPrice(off + 1, e), r = Math.max(0, Math.round(g * p1 / p0)); back += r; put += g; res.push({ e, g, r, p0, p1 }); }
  game.market = { day: mktDayKey(0), hold: {} };
  if (back) { game.gems += back; game.marketProfit = (game.marketProfit || 0) + back - put; }
  saveGame(); updateStatsUI();
  return res.length ? { res, back, put } : null;
}
function mktHeld() { const m = game.market; return m && m.day === mktDayKey(0) ? m.hold || {} : {}; }
function mktBuy(e, n, ev) {
  mktSettle();
  const held = mktHeld(), used = MKT_ELEMS.reduce((a, k) => a + (held[k] || 0), 0);
  n = Math.min(n, MKT_BET_MAX - used);
  if (n <= 0) { showTapError(`今日はもう買えません（1日${MKT_BET_MAX}💎まで）`, ev.clientX, ev.clientY); return; }
  if (game.gems < n) { showTapError('ジェムが足りません', ev.clientX, ev.clientY); return; }
  game.gems -= n; game.market = { day: mktDayKey(0), hold: { ...held, [e]: (held[e] || 0) + n } };
  playCoinChime && playCoinChime(3); saveGame(); updateStatsUI(); openMarket();
}
function mktBar(share, col) { return `<i style="width:${Math.round(share * 100)}%;background:${col}"></i>`; }
function openMarket(settled) {
  document.querySelectorAll('.mkt-ov').forEach(o => o.remove());
  const st = settled === undefined ? mktSettle() : settled;
  const y = mktCrowdShare(-1), t = mktCrowdShare(0), me = mktMyUse(), news = mktNews(), held = mktHeld();
  const used = MKT_ELEMS.reduce((a, k) => a + (held[k] || 0), 0);
  const hist = e => { const pts = [-6, -5, -4, -3, -2, -1, 0].map(o => mktPrice(o, e)); const mx = 200, w = 70, h = 22; return `<svg class="mkt-spark" viewBox="0 0 ${w} ${h}"><polyline fill="none" stroke="${ELEMENTS[e].color}" stroke-width="2" points="${pts.map((p, i) => `${i * w / 6},${h - Math.min(1, p / mx) * h}`).join(' ')}"/></svg>`; };
  const rows = MKT_ELEMS.map(e => {
    const E = ELEMENTS[e], p0 = mktPrice(-1, e), p1 = mktPrice(0, e), ch = p1 - p0, mult = marketMult(e);
    return `<div class="mkt-row" style="--ec:${E.color}">
      <div class="mkt-name">${E.icon}<b>${E.name}</b></div>
      <div class="mkt-share"><div class="mkt-bar y">${mktBar(y[e], E.color + '88')}</div><div class="mkt-bar">${mktBar(t[e], E.color)}</div><small>人気 ${Math.round(y[e] * 100)}% → <b>${Math.round(t[e] * 100)}%</b></small></div>
      <div class="mkt-price">${hist(e)}<b>${p1}</b><small class="${ch >= 0 ? 'up' : 'dn'}">${ch >= 0 ? '▲' : '▼'}${Math.abs(ch)}</small></div>
      <div class="mkt-eff ${mult >= 1 ? 'up' : 'dn'}">戦闘 ×${mult.toFixed(2)}</div>
      <div class="mkt-buy">${held[e] ? `<span class="mkt-hold">保有 💎${held[e]}</span>` : ''}<button data-mkt="${e}" data-n="1">+1</button><button data-mkt="${e}" data-n="5">+5</button><button data-mkt="${e}" data-n="10">+10</button></div>
    </div>`;
  }).join('');
  const myLine = me ? MKT_ELEMS.map(e => `${ELEMENTS[e].icon}${Math.round(me[e] * 100)}%`).join('　') : 'まだ記録がありません（属性のある自キャラ・仲間で戦うと記録されます）';
  const ov = document.createElement('div'); ov.className = 'modal-overlay show mkt-ov'; ov.style.zIndex = 80;
  ov.innerHTML = `<div class="modal-panel mkt-panel">
    <div class="mkt-title">📈 属性相場</div>
    <div class="mkt-lead">冒険者みんなが使う属性は毎日うつり変わる。<b>人気の属性ほど魔物に研究されて効きにくく</b>、人気のない属性ほど不意を突けて<b>強くなる</b>。</div>
    ${st ? `<div class="mkt-settle">📬 昨日の株を精算：${st.res.map(r => `${ELEMENTS[r.e].icon}💎${r.g}→<b class="${r.r >= r.g ? 'up' : 'dn'}">${r.r}</b>`).join('　')}　合計 <b>💎${st.back}</b>（${st.back - st.put >= 0 ? '+' : ''}${st.back - st.put}）</div>` : ''}
    <div class="mkt-head"><span>属性</span><span>昨日→今日の人気</span><span>株価</span><span></span></div>
    ${rows}
    <div class="mkt-news"><b>🗞️ 明日のうわさ</b>${news.map(n => `<div>${ELEMENTS[n.e].icon} ${n.text} <span class="${n.dir === 'up' ? 'up' : 'dn'}">${n.dir === 'up' ? '↗' : '↘'}</span></div>`).join('')}<small>うわさは7割くらいしか当たらない。みんなの気持ちを読もう</small></div>
    <div class="mkt-me">あなたの最近の属性：${myLine}<small>（自分の偏りも人気に1割まざる）</small></div>
    <div class="mkt-rule">株はジェムで買える（今日 💎${used} / ${MKT_BET_MAX}）。日付が変わると<b>翌日の株価</b>で自動で売れる。人気が上がれば得、下がれば損。${game.marketProfit ? `通算 ${game.marketProfit >= 0 ? '+' : ''}${game.marketProfit}💎` : ''}</div>
    <button class="modal-close-btn mkt-close">閉じる</button></div>`;
  document.body.appendChild(ov);
  ov.querySelector('.mkt-close').onclick = () => ov.remove();
  ov.addEventListener('click', ev => { const b = ev.target.closest('[data-mkt]'); if (b) mktBuy(b.dataset.mkt, +b.dataset.n, ev); else if (ev.target === ov) ov.remove(); });
}
// ランキングページに入口（フレンドの挑戦状の上）と、日付が変わったら精算のお知らせ
{ const fb = document.getElementById('friendBox');
  if (fb && ELEMENTS_ON) { const b = document.createElement('button'); b.className = 'mkt-entry'; b.id = 'mktEntry'; fb.parentNode.insertBefore(b, fb); b.onclick = () => openMarket(); }
  const renderEntry = () => { const el = document.getElementById('mktEntry'); if (!el) return; const best = MKT_ELEMS.slice().sort((a, b) => marketMult(b) - marketMult(a))[0]; el.innerHTML = `📈 属性相場 <small>今日の狙い目 ${ELEMENTS[best].icon}${ELEMENTS[best].name} ×${marketMult(best).toFixed(2)}</small>`; };
  renderEntry(); setInterval(renderEntry, 30000);
  setTimeout(() => { const st = mktSettle(); if (st) showNotice(`📈 属性相場：昨日の株を精算して 💎${st.back}（${st.back - st.put >= 0 ? '+' : ''}${st.back - st.put}）`, false, 4000); }, 6000);
}
