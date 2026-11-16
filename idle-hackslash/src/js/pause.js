// ===== アプリ全体の一時停止（Tキー・⏸ボタン） =====
// 時計（Date.now / performance.now）を止め、タイマーとCSSのアニメも止める。ゲーム以外のページやカウントダウンも止まる
const appPause = { on: false, at: 0, total: 0, pAt: 0, pTotal: 0 };
{
  const realNow = Date.now.bind(Date), realPerf = performance.now.bind(performance);
  Date.now = () => (appPause.on ? appPause.at : realNow()) - appPause.total;
  performance.now = () => (appPause.on ? appPause.pAt : realPerf()) - appPause.pTotal;
  appPause.set = on => {
    if (on === appPause.on) return;
    if (on) { appPause.at = realNow(); appPause.pAt = realPerf(); }
    else { appPause.total += realNow() - appPause.at; appPause.pTotal += realPerf() - appPause.pAt; }
    appPause.on = on;
    if (!on) { const q = appPause.queue.splice(0); q.forEach(f => { try { f(); } catch (e) { console.error(e); } }); }
  };
  appPause.queue = [];
  const realSetTimeout = window.setTimeout.bind(window), realSetInterval = window.setInterval.bind(window);
  window.setTimeout = (fn, ms, ...args) => realSetTimeout(() => { if (appPause.on) appPause.queue.push(() => typeof fn === 'function' ? fn(...args) : 0); else if (typeof fn === 'function') fn(...args); }, ms);
  window.setInterval = (fn, ms, ...args) => realSetInterval(() => { if (!appPause.on && typeof fn === 'function') fn(...args); }, ms);
  const realRaf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = cb => realRaf(t => { if (appPause.on) appPause.queue.push(() => window.requestAnimationFrame(cb)); else cb(performance.now()); });
}
