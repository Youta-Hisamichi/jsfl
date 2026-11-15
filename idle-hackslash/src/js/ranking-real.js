// ===== 本物のランキング（アプリ版：Firebase）。ブラウザ・アーティファクトでは今までどおりの見本（架空のライバル）を出す =====
// 記録は ranks/<uid>、本日のクリア数は daily/<日付>/p/<uid>。上位100人を出し、自分が100位より下なら「自分より上の人数」から順位を出す
const RANK_FIELDS = { stage: 'st', coins: 'co', kills: 'ki', evo: 'ev', refl: 'rf', dps: 'dp' }, RANK_TOP_N = 100, RANK_CACHE_MS = 60000, RANK_PUT_MS = 5 * 60000;
function rankReal() { return !!(window.fbCloud && fbCloud.uid && fbCloud.rankTop); }
function rankEsc(t) { return String(t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]); }
function rankName() { return (String(game.username || '').trim() || '名無しの勇者').slice(0, 12); }
function rankMine() { return { n: rankName(), st: Math.floor(game.bestStage || 1), co: Math.floor(game.bestCoins || 0), ki: Math.floor(game.totalKills || 0), ev: +(game.evoBestMult || 0), rf: Math.floor(game.reflBestMult || 0), dp: Math.floor(game.maxDps || 0), ver: String(typeof GAME_VERSION !== 'undefined' ? GAME_VERSION : '') }; }
let rankLastPut = '', rankLastPutAt = 0, rankLastDaily = '';
async function rankUpload(force) { // 記録が変わっていたら送る（5分おき・ランキングを開いたとき）
  if (!rankReal()) return;
  const now = Date.now(), m = rankMine(), j = JSON.stringify(m);
  if (j !== rankLastPut && (force || now - rankLastPutAt > RANK_PUT_MS)) { try { await fbCloud.rankPut(m); rankLastPut = j; rankLastPutAt = now; } catch (e) { console.warn('ランキングに送れません', e); } }
  const day = rankTodayKey(), c = Math.floor(getDailyClearsForDate(day) || 0), dj = day + ':' + c + ':' + m.n;
  if (c > 0 && dj !== rankLastDaily) { try { await fbCloud.dailyPut(day, { n: m.n, c }); rankLastDaily = dj; } catch (e) { console.warn('本日のランキングに送れません', e); } }
}
setInterval(() => rankUpload(false), 60000);
const rankCache = {}; let rankLoading = false, rankTotal = null, rankTotalAt = 0;
async function rankFetch(key, isDaily, day, field) {
  const ck = isDaily ? 'd:' + day : 'r:' + field, c = rankCache[ck];
  if (c && Date.now() - c.at < RANK_CACHE_MS) return c.list;
  const list = isDaily ? await fbCloud.dailyTop(day, RANK_TOP_N) : await fbCloud.rankTop(field, RANK_TOP_N);
  rankCache[ck] = { at: Date.now(), list }; return list;
}
async function renderRankingReal() {
  const isDaily = rankingMode === 'daily', mode = RANK_MODES[rankingMode] || RANK_MODES.daily, day = getRankingDateKey(), field = RANK_FIELDS[rankingMode];
  const fmt = v => isDaily ? v + ' クリア' : mode.fmt(v);
  const myScore = isDaily ? getDailyClearsForDate(day) : mode.mine();
  const key = rankingMode + '|' + day, modeNow = rankingMode;
  if (rankingList.dataset.key !== key) { rankingList.innerHTML = '<div class="rank-loading">ランキングを読み込み中…</div>'; rankingList.dataset.key = key; }
  let list;
  try { await rankUpload(true); list = await rankFetch(rankingMode, isDaily, day, field); }
  catch (e) { rankingList.innerHTML = '<div class="rank-loading">ランキングを読み込めませんでした。通信をお確かめのうえ、もう一度開いてください</div>'; return; }
  if (rankingMode !== modeNow || getRankingDateKey() !== day) return; // 読んでいる間にタブ・日付を変えた
  const me = fbCloud.uid, entries = list.map(d => ({ name: rankEsc(d.n || '名無しの勇者'), score: isDaily ? (d.c || 0) : (d[field] || 0), isPlayer: d.id === me }));
  let myRank = entries.findIndex(e => e.isPlayer) + 1;
  if (!myRank && myScore > 0) { try { const above = await fbCloud.rankAbove(field, myScore, isDaily ? day : null); if (above != null) myRank = above + 1; } catch (e) {} }
  lastRankInfo = { rank: myRank || 0, total: entries.length, label: isDaily ? `${rankDateLabel.textContent}のクリア数` : mode.title, score: fmt(myScore) };
  const RANK_WALLS = { 3: ['神の壁', 'w-god'], 10: ['プロゲーマーの壁', 'w-pro'], 20: ['名人の壁', 'w-master'], 50: ['クラスで上手い奴の壁', 'w-class'] }, wi = { 'w-god': '🔥', 'w-pro': '👑', 'w-master': '👑', 'w-class': '👑' };
  let html = entries.map((entry, i) => {
    const wall = RANK_WALLS[i] ? `<div class="rank-wall ${RANK_WALLS[i][1]}"><span><i>${wi[RANK_WALLS[i][1]]}</i>${RANK_WALLS[i][0]}<i>${wi[RANK_WALLS[i][1]]}</i></span></div>` : '';
    const cls = i < 3 ? `top${i + 1}` : i < 10 ? 'top10' : '', no = i < 3 ? '' : `${i + 1}<small>位</small>`;
    return wall + `<div class="rank-row ${cls} ${entry.isPlayer ? 'me' : ''}"><span class="rank-no">${no}</span><span class="rank-name">${entry.name}</span><span class="rank-score">${fmt(entry.score)}</span></div>`;
  }).join('');
  if (!entries.some(e => e.isPlayer)) html += `<div class="rank-row me"><span class="rank-no">${myRank ? `${formatCoinNumber(myRank)}<small>位</small>` : '圏外'}</span><span class="rank-name">${rankEsc(rankName())}</span><span class="rank-score">${fmt(myScore)}</span></div>`;
  if (!entries.length) html = `<div class="rank-loading">${isDaily ? 'この日の記録はまだありません' : 'まだ記録がありません'}</div>` + html;
  rankingList.innerHTML = html;
  if (Date.now() - rankTotalAt > 10 * 60000) { rankTotalAt = Date.now(); try { rankTotal = await fbCloud.rankCount(); } catch (e) { rankTotal = null; } }
  if (totalUserCountEl) { totalUserCountEl.style.display = rankTotal ? '' : 'none'; if (rankTotal) totalUserCountEl.textContent = `👥 ランキング参加者：${rankTotal.toLocaleString('ja-JP')} 人`; }
}
{ const orig = renderRanking; renderRanking = function () {
  if (!rankReal()) return orig.apply(this, arguments); // ブラウザ・アーティファクト（Firebase なし）は見本のまま
  const keep = rankingList.innerHTML, tot = totalUserCountEl && totalUserCountEl.textContent; orig.apply(this, arguments); // タブ・日付の表示はそのまま使う（見本のライバルの一覧は捨てる）
  rankingList.innerHTML = keep; if (totalUserCountEl && tot) totalUserCountEl.textContent = tot;
  renderRankingReal();
}; }
