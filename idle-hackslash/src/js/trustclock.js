// ===== 信用できる時計（端末の時計をいじってもボーナスを取れないようにする） =====
// ・ネットにつながるときは、サーバーの時刻（返事の Date ヘッダー）を正しい時刻として使う
// ・ゲームを開いている間は、端末の時計ではなく「開いてから何ミリ秒たったか」（performance.now）で進める
//   → 遊んでいる最中に時計を進めても、ボーナスの時刻は進まない
// ・今までに見た一番新しい時刻（game.clockHigh）を覚えておき、それより前には戻さない
//   → 時計を巻き戻しても「昨日」にはならない（同じ日のボーナスをもう一度もらえない）
//   → ネットなしで時計を進めて先に受け取っても、その先の時刻まで時間が止まるので得にならない
// ・ログインボーナス・帰還ボーナスは、サーバーの時刻を確かめてから（最大4秒待って）配る
const TC_SYNC_TIMEOUT_MS = 4000;
const tc = { base: Date.now(), perf: performance.now(), skew: 0, synced: false, syncAt: 0, last: null, cheat: 0, ready: false, wait: null };
let returnCheckPending = true; // 帰還ボーナスの確認が終わるまで「最後に遊んでいた時刻」を上書きしない
function tcGame() { try { return typeof game !== 'undefined' && game ? game : null; } catch (e) { return null; } }
function trustNow() {
  const t = tc.base + (performance.now() - tc.perf), g = tcGame(), h = (g && g.clockHigh) || 0;
  if (t >= h) { if (g && tc.ready) g.clockHigh = t; return t; } // 時刻を確かめ終わるまでは覚えない（進めた時計を覚えてしまわないように）
  return h; // 時計が巻き戻っている：一番新しく見た時刻で止める
}
function tcAnchor(t) { tc.base = t; tc.perf = performance.now(); tc.skew = t - Date.now(); }
function tcTimeUrls() { // 時刻を聞く先：http(s) で開いているときは自分のページ（アプリの中の localhost は端末の時計なので使わない）
  const list = [], L = location;
  if (/^https?:$/.test(L.protocol) && !/^(localhost|127\.|10\.|192\.168\.)/.test(L.hostname)) list.push(L.href.split('#')[0].split('?')[0] + '?tc=' + Math.random().toString(36).slice(2));
  if (window.TRUST_TIME_URL) list.push(window.TRUST_TIME_URL); // スマホアプリにしたら、ゲームのサーバーの URL を入れる
  if (window.TC_DEBUG_URL) list.unshift(window.TC_DEBUG_URL);
  return list;
}
async function tcFetchServerTime(url) {
  const t0 = performance.now();
  const r = await fetch(url, { method: 'HEAD', cache: 'no-store', credentials: 'same-origin' }); // HEAD はオフライン保存（sw.js）を通らない
  const t1 = performance.now(), d = r.headers.get('Date'); if (!d) throw new Error('no date');
  const ms = Date.parse(d); if (!isFinite(ms)) throw new Error('bad date');
  const age = parseFloat(r.headers.get('Age')) || 0; // 途中の配信サーバーに置いてあった返事なら、置いてあった時間を足す
  return { at: ms + age * 1000 + 500 + (t1 - t0) / 2, perf: t1 }; // Date は秒単位なので0.5秒足す・行き帰りの半分を足す
}
let tcSyncing = null;
function tcSync() {
  if (tcSyncing) return tcSyncing;
  tcSyncing = (async () => {
    for (const url of tcTimeUrls()) {
      try {
        const s = await tcFetchServerTime(url), now = s.at + (performance.now() - s.perf);
        const g = tcGame(), h = (g && g.clockHigh) || 0;
        if (h > now + 10 * 60e3) tc.cheat = h - now; // 前に端末の時計を進めていた（その時刻まで時間は止まったまま）
        tcAnchor(now); tcFellBack = true; tc.synced = true; tc.syncAt = Date.now(); tc.last = { url: url.split('?')[0], at: now };
        return true;
      } catch (e) {}
    }
    return false;
  })().finally(() => { tcSyncing = null; });
  return tcSyncing;
}
function tcReady(fn) { // サーバーの時刻を確かめてから fn を呼ぶ（つながらなければ4秒で諦めて、覚えている時刻で進める）
  let done = false; const go = () => { if (done) return; done = true; tcFallback(); tc.ready = true; try { fn(); } catch (e) { console.error(e); } };
  (tc.wait || tcSync()).then(go, go); setTimeout(go, TC_SYNC_TIMEOUT_MS);
}
let tcFellBack = true;
function tcFallback() { // サーバーにつながらなかったとき：端末の時計＋前に測ったずれで合わせる（巻き戻しは clockHigh で止まる）
  if (tcFellBack) return; tcFellBack = true;
  tcAnchor(Math.max(Date.now() + tc.skew, tc.base + (performance.now() - tc.perf)));
}
// 裏に回して戻ってきたとき：開いていない間は performance.now が止まる端末もあるので、サーバーの時刻を聞き直す。
// 聞き終わるまでは止まっていた時計のまま（少なめ）で進め、つながらなかったときだけ端末の時計で合わせる
document.addEventListener('visibilitychange', () => {
  if (document.hidden) return;
  tcFellBack = false; returnCheckPending = true;
  tc.wait = tcSync().then(ok => { if (ok) tcFellBack = true; else tcFallback(); return ok; }).finally(() => { tc.wait = null; });
}, true);
function dayNumOf(t) { const d = new Date(t); return Math.floor((t - d.getTimezoneOffset() * 60000) / 864e5); } // その土地の日付の通し番号
function dayNumFromKey(k) { const m = /^(\d+)-(\d+)-(\d+)$/.exec(k || ''); return m ? dayNumOf(new Date(+m[1], +m[2] - 1, +m[3], 12).getTime()) : null; }
function showClockInfo() { // デバッグ：時計の状態
  const f = t => { const d = new Date(t), p = n => String(n).padStart(2, '0'); return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`; };
  const g = tcGame() || {}, now = trustNow(), dev = Date.now();
  const rows = [['ゲームが使う時刻', f(now)], ['端末の時計', f(dev)], ['ずれ', `${Math.round((dev - now) / 1000)}秒`], ['サーバーの時刻', tc.synced ? `確かめた（${tc.last.url}）` : 'まだ／つながらない'],
    ['一番新しく見た時刻', g.clockHigh ? f(g.clockHigh) : '-'], ['最後に遊んでいた時刻', g.lastSeenAt ? f(g.lastSeenAt) : '-'], ['7日ログイン', `${g.login7Date || '-'}（${g.login7Day || 0}日目）`],
    ['時計を進めた跡', tc.cheat ? `あり（約${Math.round(tc.cheat / 3600e3 * 10) / 10}時間ぶん止まる）` : 'なし']];
  simpleChoice({ icon: '🕰', title: '時計のチェック', text: `<div class="dbg-list">${rows.map(([a, b]) => `<div class="dl-r"><b>${a}</b><small>${b}</small></div>`).join('')}</div>`, sub: 'ログインボーナス・帰還ボーナス・デイリーの切り替わりは「ゲームが使う時刻」で決まります', yes: '閉じる', no: false });
}
tc.wait = tcSync().then(ok => { if (!ok) tcAnchor(Date.now()); tc.ready = true; return ok; }).finally(() => { tc.wait = null; }); // はじめ：つながらなければ端末の時計
