// ===== 本物のランキング（アプリ版：Firebase）。ブラウザ・アーティファクトでは今までどおりの見本（架空のライバル）を出す =====
// 記録は ranks/<uid>、本日のクリア数は daily/<日付>/p/<uid>。上位100人を出し、自分が100位より下なら「自分より上の人数」から順位を出す
// 本日のクリア数は「デッドヒート」に見せる：開いたときの順位と前回開いたときの順位を比べて↑↓（サーバーの負荷を抑えるため、開いている間の自動更新はしない）・すぐ上と下の人との差・戦闘中に抜いた/抜かれたのお知らせ・締め切りまでの残り時間・昨日の結果
const RANK_FIELDS = { stage: 'st', coins: 'co', kills: 'ki', evo: 'ev', refl: 'rf', dps: 'dp' }, RANK_TOP_N = 50, RANK_CACHE_MS = 60000, RANK_PUT_MS = 5 * 60000;
const RANK_DAILY_PUT_MS = 60000, RANK_DUEL_CHECK_MS = 3 * 60000;
function rankReal() { const s = rankSrv(); return !!(s && s.uid && s.rankTop); } // rankSrv：XSERVER（rank-server.js）か Firebase
function rankEsc(t) { return String(t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]); }
function rankName() { return (cleanUserName(game.username) || '名無しの勇者'); }
function rankTz() { try { return String(Intl.DateTimeFormat().resolvedOptions().timeZone || '').slice(0, 40); } catch (e) { return ''; } } // 管理画面で国を見る用（端末のタイムゾーン）
function rankMine() { return { n: rankName(), st: Math.floor(game.bestStage || 1), co: Math.floor(game.bestCoins || 0), ki: Math.floor(game.totalKills || 0), ev: +(game.evoBestMult || 0), rf: Math.floor(game.reflBestMult || 0), dp: Math.floor(game.maxDps || 0), gm: Math.floor(game.gems || 0), rb: Math.floor(game.reincarnations || 0), tz: rankTz(), lc: String(navigator.language || '').slice(0, 20), ver: String(typeof GAME_VERSION !== 'undefined' ? GAME_VERSION : '') }; }
function rankTodayClears() { return Math.floor(getDailyClearsForDate(rankTodayKey()) || 0); }
let rankLastPut = '', rankLastPutAt = 0, rankLastDaily = '';
async function rankUpload(force) { // 記録が変わっていたら送る（本日のクリア数は1分おき、ほかは5分おき・ランキングを開いたとき）
  if (!rankReal()) return;
  const now = Date.now(), m = rankMine(), j = JSON.stringify(m);
  if (j !== rankLastPut && (force || now - rankLastPutAt > RANK_PUT_MS)) { try { const r = await rankSrv().rankPut(m); if (!(r && r.skipped)) { rankLastPut = j; rankLastPutAt = now; } } catch (e) { console.warn('ランキングに送れません', e); } }
  const day = rankTodayKey(), c = rankTodayClears(), dj = day + ':' + c + ':' + m.n;
  if (dj !== rankLastDaily) { /* まだ1つもクリアしていなくても、開いた日は0で登録する */ try { await rankSrv().dailyPut(day, { n: m.n, c }); rankLastDaily = dj; } catch (e) { console.warn('本日のランキングに送れません', e); } }
}
setInterval(() => rankUpload(false), RANK_DAILY_PUT_MS);
// アプリを裏に回したとき・閉じるときは、待たずにすぐ送る（5分おきの間に閉じると、最後の記録が次に開くまで届かないので）
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') rankUpload(true); });
window.addEventListener('pagehide', () => rankUpload(true));
const rankCache = {}; let rankTotal = null, rankTotalAt = 0;
async function rankFetch(isDaily, day, field) {
  const ck = isDaily ? 'd:' + day : 'r:' + field, c = rankCache[ck];
  if (c && Date.now() - c.at < RANK_CACHE_MS) return c.list;
  const list = isDaily ? await rankSrv().dailyTop(day, RANK_TOP_N) : await rankSrv().rankTop(field, RANK_TOP_N);
  rankCache[ck] = { at: Date.now(), list }; return list;
}
// ---- 一覧を描く（前の順位と比べて ↑↓・行がすべるように動く） ----
let rankPrevPos = {}, rankPrevKey = '';
function rankDraw(key, entries, opt) {
  const { fmt, myScore, myRank, isDaily, live } = opt;
  const RANK_WALLS = { 3: ['神の壁', 'w-god'], 10: ['プロゲーマーの壁', 'w-pro'], 20: ['名人の壁', 'w-master'], 50: ['クラスで上手い奴の壁', 'w-class'] }, wi = { 'w-god': '🔥', 'w-pro': '👑', 'w-master': '👑', 'w-class': '👑' };
  const prev = rankPrevKey === key ? rankPrevPos : {}, myIdx = entries.findIndex(e => e.isPlayer);
  let gap = '';
  if (isDaily && myScore > 0) { // B：すぐ上・すぐ下の人との差
    const up = myIdx > 0 ? entries[myIdx - 1] : opt.nearUp, dn = myIdx >= 0 ? entries[myIdx + 1] : opt.nearDown;
    const parts = [];
    if (up) parts.push(`⬆ <b>${up.name}</b> まであと <b class="gap-n">${Math.max(1, up.score - myScore + (up.score === myScore ? 1 : 0))}</b> クリア`);
    else if (myIdx === 0 || myRank === 1) parts.push('👑 いま1位！');
    if (dn) parts.push(`⬇ <b>${dn.name}</b> と <b class="gap-n">${Math.max(0, myScore - dn.score)}</b> 差`);
    if (parts.length) gap = `<div class="rank-gap">${parts.join('<br>')}</div>`;
  }
  let html = entries.map((entry, i) => {
    const wall = RANK_WALLS[i] ? `<div class="rank-wall ${RANK_WALLS[i][1]}"><span><i>${wi[RANK_WALLS[i][1]]}</i>${RANK_WALLS[i][0]}<i>${wi[RANK_WALLS[i][1]]}</i></span></div>` : '';
    const cls = i < 3 ? `top${i + 1}` : i < 10 ? 'top10' : '', no = i < 3 ? '' : `${i + 1}<small>位</small>`;
    const was = prev[entry.id], mv = was == null || was === i ? '' : was > i ? '<i class="rk-mv up">↑</i>' : '<i class="rk-mv down">↓</i>';
    return wall + `<div class="rank-row ${cls} ${entry.isPlayer ? 'me' : ''}" data-rid="${rankEsc(entry.id)}"><span class="rank-no">${no}</span><span class="rank-name">${mv}${entry.name}</span><span class="rank-score">${fmt(entry.score)}</span></div>` + (entry.isPlayer ? gap : '');
  }).join('');
  if (myIdx < 0) html += `<div class="rank-row me"><span class="rank-no">${myRank ? `${formatCoinNumber(myRank)}<small>位</small>` : '圏外'}</span><span class="rank-name">${rankEsc(rankName())}</span><span class="rank-score">${fmt(myScore)}</span></div>` + gap;
  if (!entries.length && !(myScore > 0)) html = `<div class="rank-loading">${isDaily ? 'この日の記録はまだありません' : 'まだ記録がありません'}</div>` + html;
  const before = {}; rankingList.querySelectorAll('[data-rid]').forEach(el => { before[el.dataset.rid] = el.getBoundingClientRect().top; });
  rankingList.innerHTML = html;
  if (live) rankingList.querySelectorAll('[data-rid]').forEach(el => { const t0 = before[el.dataset.rid]; if (t0 == null) return; const d = t0 - el.getBoundingClientRect().top; if (Math.abs(d) < 2) return; // A：入れ替わった行がすべって動く
    el.style.transition = 'none'; el.style.transform = `translateY(${d}px)`; el.classList.add('rk-moving'); requestAnimationFrame(() => requestAnimationFrame(() => { el.style.transition = 'transform 0.6s cubic-bezier(.2,.8,.2,1)'; el.style.transform = ''; setTimeout(() => el.classList.remove('rk-moving'), 900); })); });
  rankPrevKey = key; rankPrevPos = {}; entries.forEach((e, i) => { rankPrevPos[e.id] = i; });
}
// ---- A：本日のクリア数は、開いているあいだその場で順位が動く ----
let rankWatchStop = null, rankWatchKey = '', rankWatchList = null, rankWatchMine = 0;
setInterval(() => { if (rankWatchList && getActiveTab() === 'ranking' && rankingMode === 'daily' && rankingDateOffset === 0 && rankTodayClears() !== rankWatchMine) { rankWatchMine = rankTodayClears(); const key = 'daily|' + getRankingDateKey(); if (rankWatchKey === key) rankDrawLocal(); } }, 3000); // 自分のクリア数が増えたら、読みこんである一覧の中で自分の行だけ動かす（サーバーは読まない。ほかの人の数は開き直したとき）
function rankStopWatch() { if (rankWatchStop) { try { rankWatchStop(); } catch (e) {} } rankWatchStop = null; }
function rankDrawLocal() { const day = getRankingDateKey(), key = 'daily|' + day, es = rankDailyEntries(rankWatchList), r = es.findIndex(e => e.isPlayer) + 1; rankDraw(key, es, { fmt: v => v + ' クリア', myScore: rankTodayClears(), myRank: r, isDaily: true, live: true }); }
function rankDailyEntries(list) { // サーバーより手元のほうが新しいので、自分の数は手元の数にして並べ直す
  const me = rankSrv().uid, mine = rankTodayClears();
  const es = list.map(d => ({ id: d.id, name: rankEsc(d.n || '名無しの勇者'), score: d.id === me ? Math.max(d.c || 0, mine) : (d.c || 0), isPlayer: d.id === me }));
  if (!es.some(e => e.isPlayer) && (es.length < RANK_TOP_N || mine > es[es.length - 1].score)) es.push({ id: me, name: rankEsc(rankName()), score: mine, isPlayer: true });
  es.sort((a, b) => b.score - a.score || (a.isPlayer ? -1 : b.isPlayer ? 1 : 0)); return es.slice(0, RANK_TOP_N);
}
function rankTotalText() { return rankTotal ? `👥 総ユーザー数 <b>${rankTotal.toLocaleString('ja-JP')}</b> 人` : ''; }
async function rankShowTotal() {
  const show = () => { if (!totalUserCountEl) return; totalUserCountEl.style.display = rankTotal ? '' : 'none'; if (rankTotal) totalUserCountEl.innerHTML = rankTotalText(); };
  show();
  if (Date.now() - rankTotalAt > 60000) { rankTotalAt = Date.now(); try { rankTotal = await rankSrv().rankCount(); } catch (e) {} show(); }
}
async function renderRankingReal() {
  const isDaily = rankingMode === 'daily', mode = RANK_MODES[rankingMode] || RANK_MODES.daily, day = getRankingDateKey(), field = RANK_FIELDS[rankingMode];
  const fmt = v => isDaily ? v + ' クリア' : mode.fmt(v);
  const key = rankingMode + '|' + day, modeNow = rankingMode, today = isDaily && rankingDateOffset === 0;
  if (rankingList.dataset.key !== key) { rankingList.innerHTML = '<div class="rank-loading">ランキングを読み込み中…</div>'; rankingList.dataset.key = key; }
  rankDeadlineTick();
  const myScore = isDaily ? getDailyClearsForDate(day) : mode.mine();
  const label = isDaily ? `${rankDateLabel.textContent}のクリア数` : mode.title;
  const finish = async (entries, live) => {
    if (rankingMode !== modeNow || getRankingDateKey() !== day || getActiveTab() !== 'ranking') return; // 読んでいる間にタブ・日付を変えた
    const score = isDaily && today ? rankTodayClears() : myScore;
    let myRank = entries.findIndex(e => e.isPlayer) + 1, nearUp = null, nearDown = null;
    if (!myRank) { /* 記録が0でも順位を出す（0より上の人の数＋1） */
      try { const above = await rankSrv().rankAbove(field, score, isDaily ? day : null); if (above != null) myRank = above + 1; } catch (e) {}
      if (isDaily && rankSrv().dailyNear) { try { const nr = await rankSrv().dailyNear(day, score); const f = d => d && { id: d.id, name: rankEsc(d.n || '名無しの勇者'), score: d.c || 0 }; nearUp = f(nr.up[0]); nearDown = f(nr.down[0]); } catch (e) {} }
    }
    lastRankInfo = { rank: myRank || 0, total: entries.length, label, score: fmt(score) };
    rankDraw(key, entries, { fmt, myScore: score, myRank, isDaily, live, nearUp, nearDown });
  };
  try { await rankUpload(true); } catch (e) {}
  rankShowTotal(); // 総ユーザー数（一覧と並行して読む。1分に1回まで）
  rankStopWatch();
  let list; try { list = await rankFetch(isDaily, day, field); } catch (e) { rankingList.innerHTML = '<div class="rank-loading">ランキングを読み込めませんでした。通信をお確かめのうえ、もう一度開いてください</div>'; return; }
  if (today) { rankWatchList = list; rankWatchKey = key; rankWatchMine = rankTodayClears(); await finish(rankDailyEntries(list), rankingList.dataset.key === key && !!rankingList.querySelector('[data-rid]')); }
  else {
    const me = rankSrv().uid, es = list.map(d => ({ id: d.id, name: rankEsc(d.n || '名無しの勇者'), score: isDaily ? (d.c || 0) : (d[field] || 0), isPlayer: d.id === me }));
    // 自分が一覧に入っていない（記録0で並ばない・送る前）とき、一覧に空きがあって自分の記録が一番下以上なら、ふつうの行として順位どおりに入れる
    if (!es.some(e => e.isPlayer) && !isDaily && (es.length < RANK_TOP_N || myScore >= es[es.length - 1].score)) { es.push({ id: me, name: rankEsc(rankName()), score: myScore, isPlayer: true }); es.sort((a, b) => b.score - a.score || (a.isPlayer ? 1 : b.isPlayer ? -1 : 0)); }
    await finish(es.slice(0, RANK_TOP_N), false);
  }
}
// ---- D：締め切りまでの残り時間 ----
function rankDeadlineTick() {
  let el = document.getElementById('rankDeadline');
  const show = getActiveTab() === 'ranking' && rankingMode === 'daily' && rankingDateOffset === 0; // 見本のランキングのときも出す
  if (!el) { if (!show) return; el = document.createElement('div'); el.id = 'rankDeadline'; el.className = 'rank-deadline'; rankDateNav.after(el); }
  el.style.display = show ? '' : 'none'; if (!show) return;
  const s = Math.max(0, Math.floor(rankMsToJstMidnight() / 1000)); // 日本時間24時まで（世界共通）
  el.innerHTML = `⏳ 本日のランキング終了まで <b>${Math.floor(s / 3600)}:${String(Math.floor(s / 60) % 60).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}</b>`;
  el.classList.toggle('soon', s < 3600);
}
setInterval(rankDeadlineTick, 1000);
// ---- C：戦闘中に、抜いた・抜かれたをお知らせ（3分おきに、すぐ上と下の人だけ少し読む） ----
let rankDuel = null; // { day, rank, up: id, down: id, upName, downName }
async function rankDuelCheck() {
  if (!rankReal() || !rankSrv().dailyNear || getActiveTab() === 'ranking') return;
  const day = rankTodayKey(), c = rankTodayClears(); if (c <= 0) return;
  try {
    await rankUpload(false);
    const [above, nr] = await Promise.all([rankSrv().rankAbove(null, c, day), rankSrv().dailyNear(day, c)]);
    if (above == null) return;
    const rank = above + 1, prev = rankDuel, name = d => rankEsc((d && d.n) || 'ライバル');
    rankDuel = { day, rank, ups: nr.up.map(d => d.id), downs: nr.down.map(d => d.id) };
    if (!prev || prev.day !== day || prev.rank === rank) return;
    if (rank > prev.rank) { const who = nr.up.find(d => prev.downs.includes(d.id)) || nr.up[0]; showNotice(`⚠ ${name(who)}に抜かれた！（本日のクリア数 ${prev.rank}位→${rank}位）`, false, 4500); } // 前は下にいた人が、いま上にいる
    else { const who = nr.down.find(d => prev.ups.includes(d.id)) || nr.down[0]; showNotice(`🔥 ${name(who)}を抜いた！ 本日のクリア数 ${rank}位に浮上`, false, 4500); } // 前は上にいた人が、いま下にいる
  } catch (e) {}
}
setInterval(rankDuelCheck, RANK_DUEL_CHECK_MS);
// ---- D：日付が変わったら「昨日の結果」を1回だけ出す ----
async function rankYesterdayResult() {
  if (!rankReal()) return;
  const y = jstDateKey(typeof trustNow === 'function' ? trustNow() : Date.now(), -1); // 日本時間のきのう
  if (game.rankResultShown === y) return;
  const c = Math.floor(getDailyClearsForDate(y) || 0); if (c <= 0) { game.rankResultShown = y; return; }
  try {
    const above = await rankSrv().rankAbove(null, c, y); if (above == null) return;
    game.rankResultShown = y; saveGame(); const r = above + 1;
    simpleChoice({ icon: r <= 3 ? ['🏆', '🥈', '🥉'][r - 1] : '📅', title: '昨日のクリア数ランキング', text: `<div class="sc-text">昨日の結果は <b style="font-size:1.4em;color:#ffd76b">${r}位</b>（${c}クリア）でした！</div>`, sub: r <= 10 ? 'お見事！ 今日もこの調子で' : '今日のランキングで巻き返そう', yes: 'ランキングを見る', no: '閉じる', onYes: () => switchTab('ranking') });
  } catch (e) {}
}
{ let tries = 0; const t = setInterval(() => { if (rankReal() || ++tries > 30) { clearInterval(t); setTimeout(rankYesterdayResult, 6000); } }, 2000); }
setInterval(() => { if (rankReal()) rankYesterdayResult(); }, 10 * 60000); // 起動したまま日付をまたいだとき
{ const orig = renderRanking; renderRanking = function () {
  if (!rankReal()) return orig.apply(this, arguments); // サーバーにつながらないときは見本のまま
  const keep = rankingList.innerHTML, tot = totalUserCountEl && totalUserCountEl.innerHTML; orig.apply(this, arguments); // タブ・日付の表示はそのまま使う（見本のライバルの一覧は捨てる）
  rankingList.innerHTML = keep; if (totalUserCountEl && tot) { totalUserCountEl.innerHTML = tot; totalUserCountEl.style.display = ''; }
  renderRankingReal();
}; }
