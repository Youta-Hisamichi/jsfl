// ===== ローカル通知（スマホアプリにしたとき用の準備） =====
// ゲームを閉じた（裏に回した）瞬間に「いつ・何を知らせるか」の予定を作り、アプリの通知の仕組みに渡す。
//   ・スマホアプリ（Capacitor の LocalNotifications）の中で動いているときだけ、本当に予約する
//   ・Web（claude.ai のアーティファクト・ブラウザ）では何も鳴らない。予定はデバッグの「🔔 通知の予定」で確かめられる
//   ・ゲームに戻ってきたら、予約していた通知は全部取り消す（遊んでいる間は通知しない）
// 設定画面の「🔔 通知」でON/OFF（game.notifyOn。はじめはON）
const NOTIFY_LOGIN_HOUR = 8;         // ログインボーナスの通知は、次の日の朝8時（夜中に鳴らさない）
const NOTIFY_QUIET = [22, 8];        // 22時〜朝8時に当たる通知は、朝8時にずらす
const NOTIFY_IDS = { coin3h: 101, coinFull: 102, login: 103, day1: 104, day3: 105 };
function notifyOn() { return game.notifyOn !== false; }
function notifyQuietShift(t) { // 夜中に当たったら朝8時へ
  const d = new Date(t), h = d.getHours();
  if (h >= NOTIFY_QUIET[0] || h < NOTIFY_QUIET[1]) { if (h >= NOTIFY_QUIET[0]) d.setDate(d.getDate() + 1); d.setHours(NOTIFY_QUIET[1], 0, 0, 0); return d.getTime(); }
  return t;
}
function notifyIdleCoins(ms) { // 放置中に貯まるコイン（帰還ボーナスの「放置中の戦果」と同じ計算・帰還ボーナス券は入れない）
  try { const min = Math.min(ms, IDLE_REWARD_MAX_MS) / 60000; return Math.round(Math.floor(min * IDLE_KILLS_PER_MIN) * stageCoinRaw() * computeBonuses().coinMult * IDLE_COIN_RATE * RETURN_BONUS_SCALE); } catch (e) { return 0; }
}
function buildNotificationSchedule(now = Date.now()) { // 予定の一覧（時刻の早い順）
  const list = [], add = (key, at, title, body) => list.push({ id: NOTIFY_IDS[key], key, at: notifyQuietShift(at), title, body });
  const C = n => formatCoinNumber(n);
  add('coin3h', now + 3 * 3600e3, '🟡 コインが貯まっています', `冒険のあいだに 約${C(notifyIdleCoins(3 * 3600e3))}コイン 貯まりました。受け取りに戻ろう！`);
  add('coinFull', now + IDLE_REWARD_MAX_MS, '💰 放置の戦果が満タン！', `約${C(notifyIdleCoins(IDLE_REWARD_MAX_MS))}コイン が受け取れます（これ以上は増えません）`);
  { const d = new Date(now); d.setDate(d.getDate() + 1); d.setHours(NOTIFY_LOGIN_HOUR, 0, 0, 0); // 次の日のログインボーナス
    const nextDay = typeof todayKey === 'function' && game.login7Date === todayKey(new Date(now)) ? ((game.login7Day || 0) % 7) + 1 : 1;
    add('login', d.getTime(), '📅 ログインボーナスが受け取れます', `今日は${nextDay}日目のボーナス！ 連続ログインを続けよう`); }
  add('day1', now + 24 * 3600e3, '🏠 帰還ボーナスが最大です', `1日ぶんの帰還ボーナスが待っています。ステージ${formatStageNumber(game.stage || 1)}の続きから！`);
  add('day3', now + 72 * 3600e3, '⚔️ 冒険の続きをしませんか', 'あなたの勇者が待っています');
  return list.sort((a, b) => a.at - b.at);
}
function nativeNotifier() { // スマホアプリ（Capacitor）の通知。Web では null
  const p = window.Capacitor && window.Capacitor.Plugins; return p && p.LocalNotifications ? p.LocalNotifications : null;
}
async function cancelGameNotifications() {
  const LN = nativeNotifier(); if (!LN) return;
  try { await LN.cancel({ notifications: Object.values(NOTIFY_IDS).map(id => ({ id })) }); } catch (e) {}
}
async function scheduleGameNotifications() { // 閉じる（裏に回す）ときに呼ぶ
  const LN = nativeNotifier(); if (!LN) return false;
  await cancelGameNotifications();
  if (!notifyOn()) return false;
  try {
    const perm = await LN.checkPermissions(); if (perm && perm.display !== 'granted') { const r = await LN.requestPermissions(); if (!r || r.display !== 'granted') return false; }
    await LN.schedule({ notifications: buildNotificationSchedule().map(n => ({ id: n.id, title: n.title, body: n.body, schedule: { at: new Date(n.at), allowWhileIdle: true } })) });
    return true;
  } catch (e) { return false; }
}
document.addEventListener('visibilitychange', () => { if (document.hidden) scheduleGameNotifications(); else cancelGameNotifications(); });
window.addEventListener('pagehide', () => { scheduleGameNotifications(); });
window.idleNotify = { build: buildNotificationSchedule, schedule: scheduleGameNotifications, cancel: cancelGameNotifications }; // アプリ側から呼べるように
// 設定画面のON/OFF
{ const btn = document.getElementById('notifyBtn'), st = document.getElementById('notifyState');
  const sync = () => { if (st) st.textContent = notifyOn() ? 'ON' : 'OFF'; if (btn) btn.classList.toggle('active', notifyOn()); };
  if (btn) btn.addEventListener('click', () => { game.notifyOn = !notifyOn(); sync(); saveGame(); if (!notifyOn()) cancelGameNotifications(); playTone(880, 0.06, 'triangle', 0.05); });
  sync(); setTimeout(sync, 1500); }
function showNotifySchedule() { // デバッグ：いま閉じたら、いつ何が届くか
  const fmt = t => { const d = new Date(t), p = n => String(n).padStart(2, '0'); return `${d.getMonth() + 1}/${d.getDate()} ${p(d.getHours())}:${p(d.getMinutes())}`; };
  const rows = buildNotificationSchedule().map(n => `<div class="dl-r"><b>${fmt(n.at)}　${n.title}</b><small>${n.body}</small></div>`).join('');
  simpleChoice({ icon: '🔔', title: 'いま閉じたら届く通知', text: `<div class="dbg-list">${rows}</div>`, sub: `${nativeNotifier() ? 'スマホアプリの通知に予約されます' : 'いまはWeb版なので実際には届きません（スマホアプリにしたときに届きます）'}。22時〜8時に当たるものは朝8時にずらします。設定の通知：${notifyOn() ? 'ON' : 'OFF'}`, yes: '閉じる', no: false });
}
