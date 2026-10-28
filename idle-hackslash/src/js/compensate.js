// ---- 補填（お詫びのジェム・不具合で壊れたセーブデータの直し） ----
// 配りたいときは COMPENSATIONS に1件足してビルドするだけ。id ごとに1回だけ届く（届いたら game.compGot に記録）。
//   title/text … ダイアログの見出しと本文
//   gems / coins / feathers: { common: 1, rare: 1 … } / redPotions / potions … 配るもの
//   until: '2026-12-31' … この日を過ぎたら配らない（省略で期限なし）
//   since: '2026-11-01' … この日より前に始めたセーブだけに配る、など（cond で自由に絞れる）
//   cond: g => true … 対象の人だけに配る条件
//   fix: g => '直した内容' … セーブデータを直す処理（直したことを文で返すとダイアログに出る）
//   code: 'WABI2026' … コード入力でだけ受け取れる（設定の「補填コードを入力」）
const COMPENSATIONS = [
  // 例） { id: '2026-11-01-wabi', title: '不具合のお詫び', text: '進化ガチャで羽が減らない不具合がありました。ご迷惑をおかけしました。', gems: 10, until: '2026-11-30' },
];
function compRewardText(c) {
  const p = [];
  if (c.gems) p.push(`💎${c.gems}`);
  if (c.coins) p.push(`🟡${formatCoinNumber(c.coins)}`);
  if (c.feathers) for (const r in c.feathers) if (c.feathers[r]) p.push(`${RARITY_INFO[r].label}の進化の羽×${c.feathers[r]}`);
  if (c.redPotions) p.push(`スキルポーション×${c.redPotions}`);
  if (c.potions) p.push(`回復ポーション×${c.potions}`);
  return p.join('・');
}
function compActive(c) {
  if ((game.compGot || {})[c.id]) return false;
  if (c.until && todayKey() !== c.until && new Date() > new Date(c.until + 'T23:59:59')) return false;
  try { return !c.cond || !!c.cond(game); } catch (e) { return false; }
}
function grantComp(c) { // 配って記録。直した内容の文を返す
  game.compGot = game.compGot || {}; game.compGot[c.id] = Date.now();
  if (c.gems) game.gems += c.gems;
  if (c.coins) game.coins += c.coins;
  if (c.feathers) for (const r in c.feathers) addFea(r, c.feathers[r]);
  if (c.redPotions) game.redPotions = (game.redPotions || 0) + c.redPotions;
  if (c.potions) game.potions = (game.potions || 0) + c.potions;
  let fixed = ''; if (c.fix) { try { fixed = c.fix(game) || ''; } catch (e) { fixed = ''; } }
  try { updateStatsUI(); updateHPUI(); if (typeof renderEvolutionList === 'function') renderEvolutionList(); } catch (e) {}
  saveGame();
  return fixed;
}
function showCompDialog(list, onDone) { // 届いたお詫びをまとめて見せて、受け取るボタンで配る
  const ov = document.createElement('div'); ov.className = 'modal-overlay show'; ov.style.zIndex = 86;
  ov.innerHTML = `<div class="modal-panel sc-panel comp-panel"><div class="sc-icon">📮</div><div class="sc-title">運営からのお届け物</div>${list.map(c => `<div class="comp-item"><b>${c.title}</b>${c.text ? `<div class="sc-text">${c.text}</div>` : ''}${compRewardText(c) ? `<div class="comp-reward">${compRewardText(c)}</div>` : ''}</div>`).join('')}<button class="modal-close-btn comp-ok">受け取る</button></div>`;
  document.body.appendChild(ov);
  ov.querySelector('.comp-ok').onclick = () => {
    const fixed = list.map(grantComp).filter(Boolean);
    ov.remove(); try { playLoginBonusSound(); } catch (e) {}
    showNotice('📮 受け取りました' + (fixed.length ? '（' + fixed.join('・') + '）' : ''), false, 3000);
    if (onDone) onDone();
  };
}
// 起動してほかのダイアログが閉じたら、届いているお詫びを出す（コード入力のものは除く）
{ let tries = 0; const t = setInterval(() => {
  if (++tries > 60) { clearInterval(t); return; }
  if (!game.openingSeen || (typeof openingOn !== 'undefined' && openingOn) || document.querySelector('.modal-overlay.show, .op-ov')) return;
  clearInterval(t);
  const list = COMPENSATIONS.filter(c => !c.code && compActive(c));
  if (list.length) showCompDialog(list);
}, 2000); }
// 設定に「補填コードを入力」
{ const ob = document.getElementById('openingBtn') || document.getElementById('creditsBtn');
  if (ob) { ob.insertAdjacentHTML('afterend', '<button class="modal-shop-btn" id="compCodeBtn"><span class="msb-name">🎁 補填コードを入力</span></button>');
    document.getElementById('compCodeBtn').addEventListener('click', () => {
      const v = (prompt('補填コードを入力してください') || '').trim().toUpperCase(); if (!v) return;
      const c = COMPENSATIONS.find(x => x.code && x.code.toUpperCase() === v);
      if (!c) { showNotice('コードが違います', true, 2000); return; }
      if ((game.compGot || {})[c.id]) { showNotice('このコードは受け取り済みです', true, 2000); return; }
      if (!compActive(c)) { showNotice('このコードは期限切れか、対象外です', true, 2000); return; }
      const sm = document.getElementById('settingsModal'); if (sm) sm.classList.remove('show');
      showCompDialog([c]);
    }); } }
// デバッグ：補填の確認と、セーブデータの手直し（ジェム・コイン・羽・ステージを直接入れる）
function openCompDebug() {
  const ov = document.createElement('div'); ov.className = 'serif-ov';
  const rows = COMPENSATIONS.map(c => `<div class="gs-row"><span class="gs-src">${c.title}<small>${c.id}${c.code ? '／コード ' + c.code : ''}${c.until ? '／期限 ' + c.until : ''}</small></span><b class="gs-amt">${(game.compGot || {})[c.id] ? '受取済' : compActive(c) ? '未受取' : '対象外'}</b><button data-cg="${c.id}">配る</button><button data-cr="${c.id}">戻す</button></div>`).join('') || '<div class="serif-sub">いま登録されている補填はありません（compensate.js の COMPENSATIONS に足すと配れます）</div>';
  const F = FEA_RARITIES.map(r => `<label>${RARITY_INFO[r].label}羽<input type="number" data-fea="${r}" value="${feaCount(r)}"></label>`).join('');
  ov.innerHTML = `<div class="serif-panel"><div class="serif-head"><b>📮 補填・セーブ調整</b><button class="serif-x">✕</button></div><div class="serif-body gem-src comp-dbg">
    <div class="serif-h2">登録されている補填</div>${rows}
    <div class="serif-h2">いますぐ配る（詫び石のテスト）</div>
    <div class="cd-grid"><label>💎<input type="number" id="cdGems" value="10"></label><label>見出し<input type="text" id="cdTitle" value="不具合のお詫び"></label></div><button id="cdSend">📮 お届け物ダイアログで配る</button>
    <div class="serif-h2">セーブデータを直す（入れた数にそろえる）</div>
    <div class="cd-grid"><label>💎ジェム<input type="number" data-set="gems" value="${game.gems || 0}"></label><label>🟡コイン<input type="number" data-set="coins" value="${Math.floor(game.coins || 0)}"></label><label>ステージ<input type="number" data-set="stage" value="${game.stage || 1}"></label><label>自己ベスト<input type="number" data-set="bestStage" value="${game.bestStage || 1}"></label><label>転生回数<input type="number" data-set="reincarnations" value="${game.reincarnations || 0}"></label>${F}</div>
    <button id="cdApply">💾 この値で保存</button></div></div>`;
  document.body.appendChild(ov);
  ov.addEventListener('click', ev => {
    if (ev.target === ov || ev.target.closest('.serif-x')) { ov.remove(); return; }
    const g = ev.target.closest('[data-cg]'), r = ev.target.closest('[data-cr]');
    if (g) { const c = COMPENSATIONS.find(x => x.id === g.dataset.cg); ov.remove(); showCompDialog([c]); return; }
    if (r) { if (game.compGot) delete game.compGot[r.dataset.cr]; saveGame(); ov.remove(); openCompDebug(); return; }
    if (ev.target.closest('#cdSend')) { const n = Math.max(0, Math.floor(Number(ov.querySelector('#cdGems').value) || 0)); ov.remove(); showCompDialog([{ id: 'dbg-' + Date.now(), title: ov.querySelector('#cdTitle').value || 'お詫び', text: 'デバッグで配ったお届け物です。', gems: n }]); return; }
    if (ev.target.closest('#cdApply')) {
      ov.querySelectorAll('[data-set]').forEach(i => { const v = Math.max(0, Math.floor(Number(i.value) || 0)); game[i.dataset.set] = i.dataset.set === 'stage' || i.dataset.set === 'bestStage' ? Math.max(1, v) : v; });
      game.bestStage = Math.max(game.bestStage, game.stage);
      ov.querySelectorAll('[data-fea]').forEach(i => { const r2 = i.dataset.fea; addFea(r2, Math.max(0, Math.floor(Number(i.value) || 0)) - feaCount(r2)); });
      try { updateStatsUI(); updateHPUI(); renderEvolutionList(); } catch (e) {}
      saveGame(); showNotice('💾 セーブデータを直しました', false, 2000); ov.remove();
    }
  });
}
document.getElementById('dbgCompBtn')?.addEventListener('click', openCompDebug);

// デバッグ：転生報酬（ジェム・羽）の目安。いまの永続ボーナスと転生効率の進化で計算
function openRebirthEstimate() {
  const bonus = computeBonuses().rebirthGems || 0, rate = getEvoRate('rebirth');
  const dg = s => String(Math.max(1, Math.floor(s))).length, gemsAt = s => Math.round((dg(s) + bonus) * rate), feaAt = s => Math.round(dg(s) * dg(s) * rate);
  const stages = [...new Set([game.stage || 1, 10, 30, 50, 100, 200, 300, 500, 1000, 3000, 10000, 100000, 1000000])].sort((a, b) => a - b);
  const exp = n => FEA_RARITIES.map(r => { const v = n * REBIRTH_FEA_RATES[r] / 100; return v >= 1 ? Math.round(v) : v ? v.toFixed(1) : 0; });
  const ov = document.createElement('div'); ov.className = 'serif-ov';
  ov.innerHTML = `<div class="serif-panel"><div class="serif-head"><b>🔁 転生報酬の目安</b><button class="serif-x">✕</button></div><div class="serif-body gem-src">
    <div class="serif-sub">💎 ＝ (ステージの桁数 ＋ 永続ボーナス${bonus}) × 転生効率${rate.toFixed(2)}倍<br>🪶 ＝ ステージの桁数² × 転生効率 → 1枚ずつ羽ガチャ（N${REBIRTH_FEA_RATES.common}%・R${REBIRTH_FEA_RATES.rare}%・SR${REBIRTH_FEA_RATES.epic}%・SSR${REBIRTH_FEA_RATES.legendary}%・UR${REBIRTH_FEA_RATES.mythic}%）</div>
    <table class="rb-est"><tr><th>ステージ</th><th>💎</th><th>🪶</th><th>N</th><th>R</th><th>SR</th><th>SSR</th><th>UR</th></tr>
    ${stages.map(s => `<tr class="${s === game.stage ? 'now' : ''}"><td>${formatStageNumber(s)}${s === game.stage ? '（いま）' : ''}</td><td>${formatCoinNumber(gemsAt(s))}</td><td>${formatCoinNumber(feaAt(s))}</td>${exp(feaAt(s)).map(v => `<td>${v}</td>`).join('')}</tr>`).join('')}</table>
    <div class="serif-sub">羽のレア度ごとの数は平均（実際は抽選でばらつく）</div></div></div>`;
  document.body.appendChild(ov);
  ov.addEventListener('click', ev => { if (ev.target === ov || ev.target.closest('.serif-x')) ov.remove(); });
}
document.getElementById('dbgRebirthBtn')?.addEventListener('click', openRebirthEstimate);

// ===== デバッグ：お知らせ管理（お知らせの追加・プレゼントの設定） =====
// ここで作ったお知らせは、この端末だけに出る（下書き・確認用）。みんなに配るときは「書き出す」で出た文を NEWS（features.js）に入れて公開する
const ADMIN_NEWS_KEY = 'adminNews';
function adminNewsLoad() { try { const a = JSON.parse(localStorage.getItem(ADMIN_NEWS_KEY) || '[]'); return Array.isArray(a) ? a : []; } catch (e) { return []; } }
function adminNewsSave(list) { try { localStorage.setItem(ADMIN_NEWS_KEY, JSON.stringify(list)); } catch (e) {} }
function adminNewsApply() { // 端末に保存した下書きを、お知らせ一覧の先頭に入れる
  for (let i = NEWS.length - 1; i >= 0; i--) if (NEWS[i].draft) NEWS.splice(i, 1);
  NEWS.unshift(...adminNewsLoad().map(n => ({ ...n, draft: true })));
  NEWS.sort((a, b) => b.id - a.id);
  if (typeof updateNewsDot === 'function') updateNewsDot();
}
adminNewsApply();
function adminNewsCode(n) { // NEWS に貼る1行
  const g = n.gift && Object.keys(n.gift).length ? `, gift: ${JSON.stringify(n.gift).replace(/"(\w+)":/g, '$1: ')}` : '';
  return `  { id: ${n.id}, date: '${n.date}', tag: '${n.tag}', title: ${JSON.stringify(n.title)}, body: ${JSON.stringify(n.body)}${g}${n.until ? `, until: '${n.until}'` : ''} },`;
}
function openNewsAdmin(editId) {
  document.querySelectorAll('.news-admin-ov').forEach(o => o.remove());
  const drafts = adminNewsLoad(), ed = drafts.find(n => n.id === editId) || null;
  const today = new Date(), ds = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;
  const g = (ed && ed.gift) || {}, fea = g.feathers || {};
  const esc = t => String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const rows = NEWS.map(n => `<div class="gs-row"><span class="gs-src">${n.draft ? '📝 ' : ''}${esc(n.title)}<small>${n.date}・${n.tag}${n.gift ? '・🎁 ' + compRewardText(n.gift) : ''}${n.until ? '・期限 ' + n.until : ''}${n.draft ? '・この端末だけ' : '・公開中'}</small></span>${n.draft ? `<button data-na-edit="${n.id}">直す</button><button data-na-del="${n.id}">消す</button>` : ''}</div>`).join('');
  const ov = document.createElement('div'); ov.className = 'serif-ov news-admin-ov';
  ov.innerHTML = `<div class="serif-panel"><div class="serif-head"><b>📢 お知らせ管理</b><button class="serif-x">✕</button></div><div class="serif-body gem-src comp-dbg">
    <div class="serif-sub">ここで作ったお知らせは<b>この端末だけ</b>に出ます（下書き・見え方の確認用）。みんなに配るには「書き出す」の文を送ってください（ゲームに組み込んで公開します）。</div>
    <div class="serif-h2">お知らせ一覧</div>${rows}
    <div class="serif-h2">${ed ? 'お知らせを直す' : '新しいお知らせ'}</div>
    <div class="cd-grid">
      <label>見出し<input type="text" id="naTitle" value="${esc(ed ? ed.title : '')}" placeholder="例：いつも遊んでくれてありがとう！"></label>
      <label>種類<select id="naTag">${['お知らせ', 'イベント', '新機能', 'BGM', 'おわび', 'プレゼント'].map(t => `<option ${ed && ed.tag === t ? 'selected' : ''}>${t}</option>`).join('')}</select></label>
      <label>日付<input type="text" id="naDate" value="${esc(ed ? ed.date : ds)}"></label>
      <label>受け取り期限（空なら無期限）<input type="date" id="naUntil" value="${esc(ed && ed.until ? ed.until : '')}"></label>
    </div>
    <label class="na-body">本文<textarea id="naBody" rows="4" placeholder="本文（改行できます）">${esc(ed ? ed.body : '')}</textarea></label>
    <div class="serif-h2">プレゼント（0なら付けない）</div>
    <div class="cd-grid">
      <label>💎ジェム<input type="number" min="0" id="naGems" value="${g.gems || 0}"></label>
      <label>🟡コイン<input type="number" min="0" id="naCoins" value="${g.coins || 0}"></label>
      ${FEA_RARITIES.map(r => `<label>${RARITY_INFO[r].label}の進化の羽<input type="number" min="0" data-na-fea="${r}" value="${fea[r] || 0}"></label>`).join('')}
      <label>回復ポーション<input type="number" min="0" id="naPot" value="${g.potions || 0}"></label>
      <label>スキルポーション<input type="number" min="0" id="naRedPot" value="${g.redPotions || 0}"></label>
    </div>
    <button id="naSave">${ed ? '💾 直して保存' : '➕ この端末に追加'}</button>${ed ? '<button id="naNew">新しく作る</button>' : ''}
    <div class="serif-h2">みんなに配るとき</div>
    <button id="naExport">📋 書き出す</button>
    <textarea id="naOut" rows="5" readonly placeholder="ここに書き出した文が出ます" style="width:100%;box-sizing:border-box;font-size:0.7rem"></textarea>
  </div></div>`;
  document.body.appendChild(ov);
  const num = id => Math.max(0, Math.floor(Number(ov.querySelector(id).value) || 0));
  ov.addEventListener('click', ev => {
    if (ev.target === ov || ev.target.closest('.serif-x')) { ov.remove(); return; }
    const e1 = ev.target.closest('[data-na-edit]'), d1 = ev.target.closest('[data-na-del]');
    if (e1) { openNewsAdmin(+e1.dataset.naEdit); return; }
    if (d1) { adminNewsSave(adminNewsLoad().filter(n => n.id !== +d1.dataset.naDel)); adminNewsApply(); openNewsAdmin(); return; }
    if (ev.target.closest('#naNew')) { openNewsAdmin(); return; }
    if (ev.target.closest('#naSave')) {
      const title = ov.querySelector('#naTitle').value.trim(); if (!title) { showNotice('見出しを入れてください', true, 1800); return; }
      const gift = {}; if (num('#naGems')) gift.gems = num('#naGems'); if (num('#naCoins')) gift.coins = num('#naCoins'); if (num('#naPot')) gift.potions = num('#naPot'); if (num('#naRedPot')) gift.redPotions = num('#naRedPot');
      const fe = {}; ov.querySelectorAll('[data-na-fea]').forEach(i => { const v = Math.max(0, Math.floor(Number(i.value) || 0)); if (v) fe[i.dataset.naFea] = v; }); if (Object.keys(fe).length) gift.feathers = fe;
      const maxId = Math.max(0, ...NEWS.map(n => n.id));
      const n = { id: ed ? ed.id : maxId + 1, date: ov.querySelector('#naDate').value.trim() || ds, tag: ov.querySelector('#naTag').value, title, body: ov.querySelector('#naBody').value };
      if (Object.keys(gift).length) n.gift = gift; const until = ov.querySelector('#naUntil').value; if (until) n.until = until;
      const list = adminNewsLoad().filter(x => x.id !== n.id); list.push(n); adminNewsSave(list); adminNewsApply();
      showNotice('📢 この端末のお知らせに保存しました（右上の📢で見られます）', false, 2500); openNewsAdmin(n.id); return;
    }
    if (ev.target.closest('#naExport')) { const out = ov.querySelector('#naOut'); out.value = adminNewsLoad().sort((a, b) => b.id - a.id).map(adminNewsCode).join('\n') || '（この端末の下書きはありません）'; out.select(); try { navigator.clipboard.writeText(out.value).then(() => showNotice('📋 コピーしました', false, 1500)).catch(() => {}); } catch (e) {} /* コピーできない環境では選択した状態のまま */ }
  });
}
document.getElementById('dbgNewsBtn')?.addEventListener('click', openNewsAdmin);

// ===== 仲間ページ：自キャラと仲間の強さの内訳（何で何倍になっているか） =====
function powerBreakdown() {
  bonusTraceOn = true; let b; try { b = computeBonuses(); } finally { bonusTraceOn = false; }
  const tr = b._trace || [], rows = { atk: [], hp: [], cAtk: [], cHp: [] };
  for (let i = 0; i < tr.length; i++) { const p = i ? tr[i - 1] : { atk: 1, hp: 1, cAtk: 1, cHp: 1 }; for (const k in rows) { const r = p[k] ? tr[i][k] / p[k] : 1; if (Math.abs(r - 1) > 0.0005) rows[k].push([tr[i].label, r]); } }
  const sA = 1 + seedUsed('atk') * SEED_PER_USE, sH = 1 + seedUsed('hp') * SEED_PER_USE;
  if (sA !== 1) rows.atk.push(['パワーの種', sA]); if (sH !== 1) rows.hp.push(['HPの種', sH]);
  const sub = getSubStatMult(); if (sub !== 1) { rows.atk.push(['紋章（サブスク）', sub]); rows.hp.push(['紋章（サブスク）', sub]); }
  const atkUp = (game.shopOwned.skillAtkUp || Date.now() < atkUpEndAt) ? ATK_UP_MULT : 1; if (atkUp !== 1) rows.atk.push(['攻撃力UPスキル', atkUp]);
  const accel = Date.now() < accelEndAt ? b.accelDmgMult : 1; if (accel !== 1) rows.atk.push(['加速スキル（発動中）', accel]);
  const ad = typeof bossAdBuffMult === 'function' ? bossAdBuffMult() : 1; if (ad !== 1) rows.atk.push(['動画バフ', ad]);
  const early = getEarlyPlayerHpRate(game.stage); if (early !== 1) rows.hp.push(['序盤の補正', early]);
  return { b, rows, csA: compShare('atk'), csH: compShare('hp') };
}
function openPowerBreakdown() {
  const { b, rows, csA, csH } = powerBreakdown(), F = v => formatCoinNumber(Math.round(v));
  const M = v => v >= 1000 ? '×' + formatCoinNumber(v) : '×' + (+v.toFixed(v >= 10 ? 1 : Math.abs(v - 1) < 0.05 ? 3 : 2)); // 1に近い小さな補正は細かい桁まで
  const total = list => list.reduce((t, [, r]) => t * r, 1);
  const tbl = (list, base, unit) => `<div class="pb-base">もとの${unit} <b>${base}</b></div>` + (list.length ? list.map(([l, r]) => `<div class="gs-row"><span class="gs-src">${l}</span><b class="gs-amt ${r >= 1 ? 'up' : 'dn'}">${M(r)}</b></div>`).join('') : '<div class="serif-sub">補正なし</div>') + `<div class="gs-row pb-total"><span class="gs-src">合計の倍率</span><b class="gs-amt">${M(total(list))}</b></div>`;
  const comps = Object.keys(COMPANIONS).filter(id => getCompanionCount(id) > 0).map(id => `<div class="gs-row"><span class="gs-src">${COMPANIONS[id].name}${getCompanionCount(id) > 1 ? ' ×' + getCompanionCount(id) : ''}<small>Lv${(game.companions.level[id] || 0) + 1}</small></span><b class="gs-amt">攻 ${F(getCompanionAtk(id))}／HP ${F(getCompanionMaxHP(id))}</b></div>`).join('') || '<div class="serif-sub">仲間はいません</div>';
  const ov = document.createElement('div'); ov.className = 'serif-ov';
  ov.innerHTML = `<div class="serif-panel"><div class="serif-head"><b>📊 強さの内訳</b><button class="serif-x">✕</button></div><div class="serif-body gem-src pb-body">
    <div class="serif-h2">⚔️ 自キャラの攻撃力 ${F(getPlayerAtk())}</div>${tbl(rows.atk, 10, '攻撃力')}${csA ? `<div class="gs-row"><span class="gs-src">＋ 仲間の攻撃力の10%</span><b class="gs-amt">＋${F(csA)}</b></div>` : ''}
    <div class="serif-h2">❤️ 自キャラの最大HP ${F(getPlayerMaxHP())}</div>${tbl(rows.hp, 100, '最大HP')}${csH ? `<div class="gs-row"><span class="gs-src">＋ 仲間の最大HPの10%</span><b class="gs-amt">＋${F(csH)}</b></div>` : ''}
    <div class="serif-h2">🐾 仲間にかかる倍率</div>
    <div class="pb-sub">攻撃力</div>${rows.cAtk.length ? rows.cAtk.map(([l, r]) => `<div class="gs-row"><span class="gs-src">${l}</span><b class="gs-amt">${M(r)}</b></div>`).join('') : '<div class="serif-sub">補正なし</div>'}
    <div class="pb-sub">最大HP</div>${rows.cHp.length ? rows.cHp.map(([l, r]) => `<div class="gs-row"><span class="gs-src">${l}</span><b class="gs-amt">${M(r)}</b></div>`).join('') : '<div class="serif-sub">補正なし</div>'}
    <div class="serif-h2">🐾 仲間ひとりずつ</div>${comps}
    <div class="serif-sub">倍率は掛け算で効きます。「強化Lv」は攻撃力・最大HPの強化、「進化」は進化ガチャ、「ショップ」は流星剣・月の盾などです。</div>
  </div></div>`;
  document.body.appendChild(ov);
  ov.addEventListener('click', ev => { if (ev.target === ov || ev.target.closest('.serif-x')) ov.remove(); });
}
document.getElementById('powerBreakBtn')?.addEventListener('click', openPowerBreakdown);
