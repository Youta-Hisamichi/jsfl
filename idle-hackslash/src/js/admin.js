// ===== アクセスログと管理画面 =====
// 記録：ゲームを開くたびに、遊んだ人ごとの記録（players/<その人のid>）に「来た時刻」と今の進み具合を残す。
//   ・アーティファクトの共有データベース（db）を使う。サインインしていない人・閲覧だけの人（Viewer）は記録できない（db の決まり）
//   ・名前は保存しない（id だけ）。管理画面で表示するときに名前に直す
// 管理画面：デバッグの「🛠 管理画面」から開く。オーナー（と編集者）だけが全員の記録を読める
const ADMIN_VISITS_KEEP = 60; // 1人ぶんの記録に残す来訪の数（古いものから消す）
let adminDb = null, adminUser = null, adminUid = null, adminLastSaved = null;
function adminDevice() { const u = navigator.userAgent || ''; return /iPhone|iPad|iPod/.test(u) ? 'iOS' : /Android/.test(u) ? 'Android' : /Mac/.test(u) ? 'Mac' : /Windows/.test(u) ? 'Windows' : 'その他'; }
function adminSnapshot() { // 進み具合（数字だけ）
  return { stage: Math.floor(game.stage || 1), best: Math.floor(game.bestStage || 1), reb: game.reincarnations || 0, gems: Math.floor(game.gems || 0), coins: Math.floor(Math.min(1e300, game.coins || 0)), ver: typeof GAME_VERSION !== 'undefined' ? GAME_VERSION : '' };
}
async function adminInit() {
  if (!window.claude || typeof window.claude.use !== 'function') return;
  try { adminDb = await window.claude.use('db'); adminUser = await window.claude.use('user'); } catch (e) { return; }
  if (!adminDb || !adminUser) return;
  adminUid = await adminUser.id(); if (!adminUid) return;
  try { // 来た記録を1件足す（読んでから書く・1回だけ）
    const ref = adminDb.doc('players/' + adminUid), snap = await ref.get(), old = snap.exists ? snap.data() : {};
    const visits = Array.isArray(old.visits) ? old.visits.slice(-(ADMIN_VISITS_KEEP - 1)) : [];
    const s = adminSnapshot(); visits.push({ at: Date.now(), dev: adminDevice(), stage: s.stage });
    const body = { ...s, firstAt: old.firstAt || Date.now(), lastAt: Date.now(), count: (old.count || 0) + 1, visits };
    await ref.set(body); adminLastSaved = JSON.stringify(s);
  } catch (e) { adminUid = null; } // 書けない人（閲覧だけ など）は記録しない
}
async function adminSaveProgress() { // 進み具合が変わったときだけ、10分おきにまとめて書く
  if (!adminDb || !adminUid) return;
  const s = adminSnapshot(), j = JSON.stringify(s); if (j === adminLastSaved) return;
  try { await adminDb.doc('players/' + adminUid).update({ ...s, lastAt: Date.now() }); adminLastSaved = j; } catch (e) {}
}
setTimeout(() => { adminInit(); }, 4000);
setInterval(adminSaveProgress, 10 * 60 * 1000);

// ---- 管理画面 ----
function adminFmtTime(t) { const d = new Date(t); const p = n => String(n).padStart(2, '0'); return `${d.getMonth() + 1}/${d.getDate()} ${p(d.getHours())}:${p(d.getMinutes())}`; }
function adminDayKey(t) { const d = new Date(t); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; }
async function openAdminConsole() {
  let ov = document.getElementById('adminConsole');
  if (!ov) { ov = document.createElement('div'); ov.id = 'adminConsole'; ov.className = 'adm-ov'; document.body.appendChild(ov); }
  ov.innerHTML = '<div class="adm-panel"><div class="adm-head"><b>🛠 管理画面</b><span class="adm-sub">アクセスログ・遊んでいる人</span><button class="adm-btn" data-adm="reload">更新</button><button class="adm-btn adm-close" data-adm="close">閉じる</button></div><div class="adm-body"><div class="adm-note">読み込み中…</div></div></div>';
  ov.classList.add('show');
  ov.onclick = e => { const b = e.target.closest('[data-adm]'); if (!b) return; if (b.dataset.adm === 'close') ov.classList.remove('show'); if (b.dataset.adm === 'reload') openAdminConsole(); };
  const body = ov.querySelector('.adm-body');
  const note = t => { body.innerHTML = ''; const d = document.createElement('div'); d.className = 'adm-note'; d.textContent = t; body.appendChild(d); };
  if (!window.claude || typeof window.claude.use !== 'function') { note('この画面はアーティファクト（claude.ai）で開いたときだけ使えます。'); return; }
  const db = adminDb || await window.claude.use('db'), user = adminUser || await window.claude.use('user');
  if (!db || !user) { note('データベースにつながりません（サインインしているか確かめてください）。'); return; }
  if (!(await user.canEdit())) { note('管理画面はオーナー（と編集者）だけが見られます。'); return; }
  const timer = setTimeout(() => note('データを読み込めません。少し待って「更新」を押してください。'), 10000);
  let snap; try { snap = await db.collection('players').get(); } catch (e) { clearTimeout(timer); note('読み込みに失敗しました（' + (e && e.code || 'error') + '）'); return; }
  clearTimeout(timer);
  const players = snap.docs.filter(d => d.exists).map(d => ({ id: d.id, ...d.data() }));
  const ps = await user.profiles(players.map(p => p.id));
  const name = id => (ps[id] && ps[id].name) || '名前不明';
  const now = Date.now(), DAY = 864e5;
  const logs = players.flatMap(p => (p.visits || []).map(v => ({ ...v, id: p.id }))).sort((a, b) => b.at - a.at);
  const active = ms => players.filter(p => now - (p.lastAt || 0) < ms).length;
  const days = []; for (let i = 13; i >= 0; i--) { const t = now - i * DAY, k = adminDayKey(t), vs = logs.filter(v => adminDayKey(v.at) === k); days.push({ label: `${new Date(t).getMonth() + 1}/${new Date(t).getDate()}`, n: vs.length, u: new Set(vs.map(v => v.id)).size }); }
  const maxN = Math.max(1, ...days.map(d => d.n));
  body.innerHTML = '';
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  const cards = el('div', 'adm-cards');
  [['遊んだ人', players.length], ['今日来た人', active(DAY)], ['7日以内', active(7 * DAY)], ['来訪の合計', players.reduce((t, p) => t + (p.count || 0), 0)]].forEach(([l, v]) => { const c = el('div', 'adm-card'); c.append(el('span', 'adm-card-l', l), el('b', 'adm-card-v', String(v))); cards.append(c); });
  body.append(cards);
  body.append(el('div', 'adm-h', '📈 日ごとの来訪（14日・棒＝来訪数、数字＝人数）'));
  const chart = el('div', 'adm-chart');
  days.forEach(d => { const col = el('div', 'adm-col'); const bar = el('div', 'adm-bar'); bar.style.height = (d.n / maxN * 100) + '%'; bar.title = `${d.label} 来訪${d.n}・${d.u}人`; col.append(el('span', 'adm-col-n', d.u ? String(d.u) : ''), bar, el('span', 'adm-col-l', d.label)); chart.append(col); });
  body.append(chart);
  body.append(el('div', 'adm-h', '👥 遊んでいる人（最後に来た順）'));
  const t1 = el('table', 'adm-table'); const h1 = el('tr'); ['名前', '最後に来た', '来訪', 'ステージ', '自己ベスト', '転生', 'ジェム', '版'].forEach(x => h1.append(el('th', null, x))); t1.append(h1);
  players.sort((a, b) => (b.lastAt || 0) - (a.lastAt || 0)).forEach(p => { const r = el('tr'); [name(p.id), p.lastAt ? adminFmtTime(p.lastAt) : '-', String(p.count || 0), String(p.stage || '-'), String(p.best || '-'), String(p.reb || 0), String(p.gems || 0), p.ver || ''].forEach(x => r.append(el('td', null, x))); t1.append(r); });
  const w1 = el('div', 'adm-scroll'); w1.append(t1); body.append(w1);
  body.append(el('div', 'adm-h', `🕘 アクセスログ（新しい順・最大200件）`));
  const t2 = el('table', 'adm-table'); const h2 = el('tr'); ['日時', '名前', '端末', 'その時のステージ'].forEach(x => h2.append(el('th', null, x))); t2.append(h2);
  logs.slice(0, 200).forEach(v => { const r = el('tr'); [adminFmtTime(v.at), name(v.id), v.dev || '', String(v.stage || '')].forEach(x => r.append(el('td', null, x))); t2.append(r); });
  const w2 = el('div', 'adm-scroll'); w2.append(t2); body.append(w2);
  if (!players.length) body.append(el('div', 'adm-note', 'まだ記録がありません。サインインして「Contributor（参加者）」以上で開いた人の来訪が記録されます。'));
}
