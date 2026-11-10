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
  if (!window.claude || typeof window.claude.use !== 'function' || cloudOff()) return;
  try { adminDb = await window.claude.use('db'); adminUser = await window.claude.use('user'); } catch (e) { return; }
  if (!adminDb || !adminUser) return;
  adminUid = await adminUser.id(); if (!adminUid) return;
  try { // 来た記録を1件足す（読んでから書く・1回だけ）
    const ref = adminDb.doc('players/' + adminUid), snap = await ref.get(), old = snap.exists ? snap.data() : {};
    const visits = Array.isArray(old.visits) ? old.visits.slice(-(ADMIN_VISITS_KEEP - 1)) : [];
    const s = adminSnapshot(); visits.push({ at: Date.now(), dev: adminDevice(), stage: s.stage });
    const body = { ...old, ...s, firstAt: old.firstAt || Date.now(), lastAt: Date.now(), count: (old.count || 0) + 1, visits }; // セーブの控え（save など）も消さずに残す
    await ref.set(body); adminLastSaved = JSON.stringify(s);
    if (!window.fbCloud || !fbCloud.uid) await cloudStartupCheck(old); // Firebase（リリース版）が使えるときは、そちらでセーブの控えを扱う
  } catch (e) { adminUid = null; } // 書けない人（閲覧だけ など）は記録しない
}
async function adminSaveProgress() { // 進み具合が変わったときだけ、10分おきにまとめて書く
  if (!adminDb || !adminUid) return;
  const s = adminSnapshot(), j = JSON.stringify(s); if (j === adminLastSaved) return;
  try { await adminDb.doc('players/' + adminUid).update({ ...s, lastAt: Date.now() }); adminLastSaved = j; } catch (e) {}
}
// ===== セーブの控え（クラウド） =====
// 端末のセーブ（localStorage）は、ブラウザやアプリの都合で消えることがある。サインインして遊んでいる人は、
// 自分の記録（players/<id>）にセーブの写しを3分おき・閉じるときに残し、端末のセーブが消えて最初からになっていたら復活を聞く
let cloudSave = null, cloudBackupOk = false, cloudLastRaw = null;
const CLOUD_OFF_KEY = 'circle-battle-idle-cloud-off'; // 「クラウドのデータとアカウントを削除」をしたら立てる。立っている間はクラウドに何も置かない（機種変更の画面で再開できる）
function cloudOff() { try { return !!localStorage.getItem(CLOUD_OFF_KEY); } catch (e) { return false; } }
// セーブの控えを置く場所（どちらか）：リリース版は Firebase（js/firebase-sync.js）、claude.ai のアーティファクトでは共有データベース
function cloudProvider() {
  if (window.fbCloud && fbCloud.uid) return fbCloud;
  if (adminDb && adminUid) return { kind: 'claude', remove: async () => { await adminDb.doc('players/' + adminUid).delete(); adminUid = null; }, save: d => adminDb.doc('players/' + adminUid).update(d), load: async () => { const s = await adminDb.doc('players/' + adminUid).get(); return s.exists ? s.data() : null; } };
  return null;
}
const CLOUD_CLEAR = () => ({ save: null, saveAt: Date.now(), saveBest: 1, saveReb: 0, saveStage: 1 });
async function cloudStartupCheck(doc) { // 起動時：ゲームリセットの直後なら控えを消す。端末より進んだ控えがあれば復活を聞く
  cloudSave = doc && doc.save ? { raw: doc.save, at: doc.saveAt || 0, best: doc.saveBest || 1, reb: doc.saveReb || 0, stage: doc.saveStage || 1 } : null;
  let wasReset = false; try { wasReset = !!localStorage.getItem(SAVE_RESET_FLAG); localStorage.removeItem(SAVE_RESET_FLAG); } catch (e) {}
  if (wasReset) { cloudSave = null; cloudBackupOk = true; try { const P = cloudProvider(); if (P) await P.save(CLOUD_CLEAR()); } catch (e) {} }
  else if (cloudSave && cloudAhead()) offerCloudRestore(); else cloudBackupOk = true;
}
function cloudAhead() { return cloudSave && ((cloudSave.reb || 0) > (game.reincarnations || 0) || (cloudSave.best || 1) > (game.bestStage || 1)); } // クラウドの控えのほうが進んでいる
function offerCloudRestore() {
  const d = new Date(cloudSave.at), p = n => String(n).padStart(2, '0');
  simpleChoice({ icon: '☁️', title: 'セーブの控えが見つかりました', text: `この端末のセーブより進んだ控えがあります。<br><b>自己ベスト ステージ${formatStageNumber(cloudSave.best)}・転生${cloudSave.reb}回</b><br><small>${d.getMonth() + 1}/${d.getDate()} ${p(d.getHours())}:${p(d.getMinutes())} に保存</small>`, sub: '復活すると、いまの端末の進み具合はこの控えで上書きされます', yes: '控えから復活する', no: 'いまのまま続ける',
    onYes: () => { try { window.__noSave = true; localStorage.setItem(SAVE_KEY, cloudSave.raw); } catch (e) {} location.reload(); },
    onNo: () => { cloudBackupOk = true; } });
}
async function cloudBackup() {
  const P = cloudProvider(); if (!P || !cloudBackupOk || window.__noSave || cloudOff()) return; // 復活するか聞いている間は、進んだ控えを上書きしない
  let raw; try { saveGame(); raw = localStorage.getItem(SAVE_KEY); } catch (e) { return; }
  if (!raw || raw === cloudLastRaw || raw.length > 240000) return;
  try { await P.save({ save: raw, saveAt: Date.now(), saveBest: Math.floor(game.bestStage || 1), saveReb: game.reincarnations || 0, saveStage: Math.floor(game.stage || 1) }); cloudLastRaw = raw; } catch (e) {}
}
setInterval(cloudBackup, 3 * 60 * 1000);
document.addEventListener('visibilitychange', () => { if (document.hidden) cloudBackup(); });
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
