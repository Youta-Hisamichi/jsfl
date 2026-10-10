// ---- バズ・ソーシャル：シェア画像カード／シェアしたくなる瞬間の提案／シェア報酬／今日の勇者占い／挑戦状コード（フレンド） ----

// ===== シェア画像カード（1080×1080）：自キャラ・仲間・記録を1枚に =====
const SHARE_IMG_CACHE = {};
function loadImgOnce(src) { return SHARE_IMG_CACHE[src] || (SHARE_IMG_CACHE[src] = new Promise(res => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = src; })); }
let shareMoment = null; // { title, text } シェアしたくなる瞬間
async function makeShareCard() {
  const S = 1080, cv = document.createElement('canvas'); cv.width = cv.height = S;
  const c = cv.getContext('2d');
  const g = c.createRadialGradient(S / 2, S * 0.42, 60, S / 2, S / 2, S * 0.75);
  g.addColorStop(0, '#3a3f86'); g.addColorStop(0.55, '#171c3e'); g.addColorStop(1, '#090c1c');
  c.fillStyle = g; c.fillRect(0, 0, S, S);
  const mc = await loadImgOnce('assets/img/ui/magic_circle.webp');
  if (mc) { c.globalAlpha = 0.35; c.drawImage(mc, S / 2 - 470, S * 0.42 - 470, 940, 940); c.globalAlpha = 1; }
  // 枠
  c.strokeStyle = '#ffd76b'; c.lineWidth = 10; c.strokeRect(24, 24, S - 48, S - 48);
  c.strokeStyle = 'rgba(255,215,107,0.4)'; c.lineWidth = 3; c.strokeRect(44, 44, S - 88, S - 88);
  c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillStyle = '#ffd76b'; c.font = '900 46px sans-serif'; c.fillText('放置系ハクスラ 無限反射', S / 2, 104);
  // 見出し（瞬間 or 冒険の記録）
  const head = shareMoment ? shareMoment.title : '🗡️ 冒険の記録';
  c.fillStyle = '#fff'; c.font = '900 64px sans-serif'; c.shadowColor = '#000'; c.shadowBlur = 12;
  fitText(c, head, S / 2, 190, S - 140); c.shadowBlur = 0;
  // 自キャラ
  const hid = getHeroChar(), heroSrc = hid ? COMPANION_SPRITES[hid] : PLAYER_SPRITE;
  const hero = await loadImgOnce(heroSrc);
  const glow = c.createRadialGradient(S / 2, 430, 20, S / 2, 430, 230); glow.addColorStop(0, 'rgba(255,230,140,0.55)'); glow.addColorStop(1, 'rgba(255,230,140,0)');
  c.fillStyle = glow; c.beginPath(); c.arc(S / 2, 430, 230, 0, Math.PI * 2); c.fill();
  if (hero) { c.imageSmoothingEnabled = false; const flip = hid && (SPRITE_FACING[hid] || 0) < 0; c.save(); c.translate(S / 2, 430); if (flip) c.scale(-1, 1); c.drawImage(hero, -170, -170, 340, 340); c.restore(); c.imageSmoothingEnabled = true; }
  // 仲間（最大6人）
  const party = COMPANION_IDS.filter(id => game.companions.recruited[id]).slice(0, 6);
  for (let i = 0; i < party.length; i++) {
    const im = await loadImgOnce(COMPANION_SPRITES[party[i]]); if (!im) continue;
    const x = S / 2 + (i - (party.length - 1) / 2) * 120, y = 660;
    c.fillStyle = 'rgba(20,26,60,0.85)'; c.strokeStyle = '#c99a3a'; c.lineWidth = 4; roundRectPath(c, x - 52, y - 52, 104, 104, 16); c.fill(); c.stroke();
    c.imageSmoothingEnabled = false; c.drawImage(im, x - 46, y - 46, 92, 92); c.imageSmoothingEnabled = true;
  }
  // 記録
  const rows = [
    ['🏔️ 最高ステージ', formatStageNumber(game.bestStage || 1)],
    ['🌌 転生', (game.reincarnations || 0) + '回'],
    ['⚔️ 撃破数', (game.totalKills || 0).toLocaleString('ja-JP')],
  ];
  const sub = shareMoment ? shareMoment.text : (typeof runRule === 'function' && runRule() ? `今の掟：${RUN_RULES[runRule()].icon}${RUN_RULES[runRule()].name}` : '');
  if (sub) { c.fillStyle = '#ffe9a8'; c.font = '800 38px sans-serif'; fitText(c, sub, S / 2, 770, S - 140); }
  rows.forEach(([k, v], i) => {
    const x = S / 2 + (i - 1) * 330, y = 858;
    c.fillStyle = 'rgba(255,255,255,0.08)'; roundRectPath(c, x - 150, y - 56, 300, 112, 18); c.fill();
    c.fillStyle = '#aab4d0'; c.font = '700 28px sans-serif'; c.fillText(k, x, y - 22);
    c.fillStyle = '#fff'; c.font = '900 44px sans-serif'; fitText(c, v, x, y + 22, 290);
  });
  c.fillStyle = '#64e8ff'; c.font = '800 34px sans-serif'; fitText(c, SHARE_HASHTAG, S / 2, 962, S - 140);
  c.fillStyle = '#aab4d0'; c.font = '700 24px sans-serif'; fitText(c, `挑戦状コード：${myRivalCode()}`, S / 2, 1004, S - 140);
  return cv;
}
function fitText(c, t, x, y, maxW) { const w = c.measureText(t).width; if (w > maxW) { c.save(); c.translate(x, y); c.scale(maxW / w, 1); c.fillText(t, 0, 0); c.restore(); } else c.fillText(t, x, y); }
function roundRectPath(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }

// シェア画面に画像カードと「画像を保存・シェア」を足す
{ const panel = document.querySelector('#shareModal .modal-panel'), ta = document.getElementById('shareText');
  if (panel && ta) {
    ta.insertAdjacentHTML('beforebegin', '<div class="share-card-wrap"><img id="shareCardImg" alt="シェア画像"><div class="share-card-hint">画像を長押しでも保存できます</div></div>');
    document.querySelector('#shareModal .share-grid').insertAdjacentHTML('afterend', '<button class="modal-close-btn share-img-btn" id="shareImgBtn">🖼️ 画像つきでシェア／保存</button><div class="share-reward-note" id="shareRewardNote"></div>');
  }
}
let shareCardBlob = null;
{ const orig = openShare; openShare = function (kind) {
  orig.apply(this, arguments);
  const img = document.getElementById('shareCardImg'); if (!img) return;
  img.removeAttribute('src'); shareCardBlob = null;
  makeShareCard().then(cv => { img.src = cv.toDataURL('image/png'); cv.toBlob(b => { shareCardBlob = b; }, 'image/png'); });
  const note = document.getElementById('shareRewardNote'); if (note) note.textContent = shareRewardReady() ? `🎁 今日はじめてのシェアで 💎${SHARE_REWARD_GEMS}` : '';
}; }
{ const orig = buildShareText; buildShareText = function (kind) {
  if (kind === 'moment' && shareMoment) return `${shareMoment.title}\n${shareMoment.text}\n🏔 最高 ステージ${game.bestStage} ／ 🌌 転生 ${game.reincarnations}回\n挑戦状コード：${myRivalCode()}\n${SHARE_HASHTAG}`;
  return orig.apply(this, arguments) + `\n挑戦状コード：${myRivalCode()}`;
}; }
document.getElementById('shareImgBtn') && document.getElementById('shareImgBtn').addEventListener('click', async () => {
  const text = document.getElementById('shareText').value;
  if (shareCardBlob && navigator.canShare) {
    const file = new File([shareCardBlob], 'mugen-hansha.png', { type: 'image/png' });
    if (navigator.canShare({ files: [file] })) { try { await navigator.share({ files: [file], text }); grantShareReward(); } catch (e) {} return; }
  }
  const img = document.getElementById('shareCardImg'); if (!img || !img.src) return; // 共有できなければ画像を保存
  const a = document.createElement('a'); a.href = img.src; a.download = 'mugen-hansha.png'; document.body.appendChild(a); a.click(); a.remove();
  showShareMsg('🖼️ 画像を保存しました。SNSに貼ってシェアしよう！'); grantShareReward();
});
// シェアしたら報酬（1日1回）
const SHARE_REWARD_GEMS = 3;
function shareRewardReady() { return game.shareRewardDate !== todayKey(); }
function grantShareReward() {
  if (!shareRewardReady()) return;
  game.shareRewardDate = todayKey(); game.gems += SHARE_REWARD_GEMS; game.shareCount = (game.shareCount || 0) + 1;
  updateStatsUI(); saveGame();
  setTimeout(() => showShareMsg(`🎁 シェアありがとう！ +💎${SHARE_REWARD_GEMS}`), 400);
  const note = document.getElementById('shareRewardNote'); if (note) note.textContent = '';
}
['shareXLink', 'shareLineLink', 'shareCopyBtn', 'shareMoreBtn'].forEach(id => { const el = document.getElementById(id); if (el) el.addEventListener('click', () => setTimeout(grantShareReward, 300)); });
document.getElementById('shareCloseBtn').addEventListener('click', () => { shareMoment = null; });

// ===== シェアしたくなる瞬間に「📸 シェア」ボタンを出す =====
function offerShareMoment(title, text) {
  const wrap = document.querySelector('.arena-wrap'); if (!wrap) return;
  let el = document.getElementById('momentShareBtn');
  if (!el) { el = document.createElement('button'); el.id = 'momentShareBtn'; el.className = 'moment-share'; wrap.appendChild(el); }
  el.innerHTML = `📸 この瞬間をシェア<small>${title}</small>`;
  el.onclick = () => { shareMoment = { title, text }; el.classList.remove('show'); openShare('moment'); };
  el.classList.remove('show'); void el.offsetWidth; el.classList.add('show');
  clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('show'), 8000);
}
// ★4・★5の仲間
if (typeof rareCutIn === 'function') { const orig = rareCutIn; rareCutIn = function (id) { orig.apply(this, arguments); const c = COMPANIONS[id]; if (c) setTimeout(() => offerShareMoment(`✨ ${c.name}が仲間に！`, `${rarityStars(c.rarity)} ${RARITY_INFO[c.rarity] ? RARITY_INFO[c.rarity].label : ''}の仲間を手に入れた！`), 2600); }; }
// 節目のボス（100ステージごと）・初めて倒した試練の塔ボス
{ const orig = markBossBeaten; markBossBeaten = function (em) {
  const first = !(game.bossBeaten && game.bossBeaten[em]);
  orig.apply(this, arguments);
  const name = BOSS_ENEMY_NAMES[em] || 'ボス';
  if (game.stage % 100 === 0 && !game.skipChallenge) offerShareMoment(`👑 ステージ${game.stage}突破！`, `${name}を撃破！`);
  else if (first && TOWER_BOSS_SET.has(em)) offerShareMoment(`🏰 ${name}を初撃破！`, '試練の塔の強敵をついに倒した！');
}; }
// 記録・実績
if (typeof showRunBanner === 'function') { const orig = showRunBanner; showRunBanner = function (title, text) { orig.apply(this, arguments); if (/新記録|実績/.test(title)) setTimeout(() => offerShareMoment(title.replace(/[「」]/g, ''), text), 1200); }; }

// ===== 今日の勇者占い（毎日変わる・シェアしたくなる診断。結果でちょっとした効果） =====
const FORTUNES = [
  { rank: '大吉', col: '#ff5c7a', coin: 0.3, msg: '伝説の予感。今日のあなたは何をやっても上手くいく' },
  { rank: '中吉', col: '#ffb14f', coin: 0.2, msg: '仲間との絆が深まる日。一緒に戦えば怖いものなし' },
  { rank: '小吉', col: '#ffd76b', coin: 0.1, msg: 'コツコツが吉。強化ボタンを押す手が冴える' },
  { rank: '吉', col: '#7ee787', coin: 0.1, msg: '思わぬお宝に出会えるかも。宝箱に注目' },
  { rank: '末吉', col: '#64e8ff', coin: 0.05, msg: '今は力をためる時。溜めMAXの一撃を信じて' },
  { rank: '凶', col: '#b8a0ff', coin: 0, msg: '逆に考えるんだ。ここからは上がるだけさ（明日はきっと良い日）' },
];
const LUCKY_THINGS = ['宝箱', '溜めMAX', 'ボス戦', 'ガチャ', '流れ星', '風船', '強化', '試練の塔', '転生', '仲間招集'];
function myPlayerSeed() { if (!game.playerSeed) game.playerSeed = Math.floor(Math.random() * 1e9); return game.playerSeed; }
function todayFortune() {
  const r = stageRand((parseInt(todayKey().replace(/\D/g, ''), 10) % 1000003) + myPlayerSeed() % 9973);
  r(); const f = FORTUNES[Math.floor(r() * r() * FORTUNES.length)]; // 良い結果が出やすめ
  const comps = COMPANION_IDS.filter(id => COMP_PROFILE[id]); const comp = comps[Math.floor(r() * comps.length)];
  return { ...f, comp, lucky: LUCKY_THINGS[Math.floor(r() * LUCKY_THINGS.length)], num: 1 + Math.floor(r() * 99) };
}
function fortuneCoinBonus() { return game.fortuneDate === todayKey() ? todayFortune().coin : 0; } // 占いを見た日だけ効く
{ const orig = computeBonuses; computeBonuses = function () { const b = orig.apply(this, arguments); const fc = fortuneCoinBonus(); if (fc) b.coinMult *= 1 + fc; return b; }; }
function openFortune() {
  const f = todayFortune(), first = game.fortuneDate !== todayKey();
  game.fortuneDate = todayKey(); saveGame();
  const c = COMPANIONS[f.comp];
  const ov = document.createElement('div'); ov.className = 'modal-overlay show'; ov.style.zIndex = 82;
  ov.innerHTML = `<div class="modal-panel ft-panel"><div class="ft-title">🔮 今日の勇者占い</div><div class="ft-rank" style="color:${f.col}">${f.rank}</div><div class="ft-msg">${f.msg}</div>
    <div class="ft-rows"><div><span>🐾 ラッキー仲間</span><b>${companionIconHtml(f.comp)} ${c.name}</b></div><div><span>🍀 ラッキーアイテム</span><b>${f.lucky}</b></div><div><span>🔢 ラッキーナンバー</span><b>${f.num}</b></div></div>
    ${f.coin ? `<div class="ft-eff">今日いちにち コイン +${Math.round(f.coin * 100)}%${first ? '（発動！）' : ''}</div>` : '<div class="ft-eff">明日の占いに期待…！</div>'}
    <button class="modal-close-btn ft-share">📤 占い結果をシェア</button><button class="modal-shop-btn ft-close" style="justify-content:center;"><span class="msb-name">閉じる</span></button></div>`;
  document.body.appendChild(ov);
  if (first) { playGachaSound && playGachaSound(f.coin >= 0.2 ? 'epic' : 'rare'); }
  ov.querySelector('.ft-close').addEventListener('click', () => ov.remove());
  ov.querySelector('.ft-share').addEventListener('click', () => { ov.remove(); shareMoment = { title: `🔮 今日の勇者占いは【${f.rank}】`, text: `ラッキー仲間：${c.name}／ラッキーアイテム：${f.lucky}` }; openShare('moment'); });
  updateStatsUI();
}

// ===== 挑戦状コード（フレンド）：自分の名前と最高ステージを入れたコード。友達のコードを入れるとライバルになる =====
function b64u(s) { return btoa(unescape(encodeURIComponent(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
function unb64u(s) { s = s.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '='; return decodeURIComponent(escape(atob(s))); }
function codeSum(s) { let h = 7; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) % 9973; return h.toString(36); }
function myRivalCode() { const body = `${(game.username || '名無しの勇者').slice(0, 12)}|${game.bestStage || 1}|${myPlayerSeed() % 46656}`; return 'MH-' + b64u(body) + '.' + codeSum(body); }
function parseRivalCode(code) {
  const m = String(code).trim().match(/MH-([A-Za-z0-9_-]+)\.([0-9a-z]+)/); if (!m) return null;
  let body; try { body = unb64u(m[1]); } catch (e) { return null; }
  if (codeSum(body) !== m[2]) return null;
  const [name, st, id] = body.split('|'); const stage = parseInt(st, 10);
  if (!name || !(stage >= 1)) return null;
  return { name: name.slice(0, 12), stage, id: String(id) };
}
const FRIEND_FIRST_GEMS = 10, FRIEND_BEAT_GEMS = 5, FRIEND_MAX = 20;
function addFriendCode(code) {
  const f = parseRivalCode(code);
  if (!f) return '⚠️ コードが正しくありません';
  if (f.id === String(myPlayerSeed() % 46656) && f.name === (game.username || '名無しの勇者').slice(0, 12)) return '⚠️ 自分のコードは登録できません';
  if (!game.friends) game.friends = [];
  const old = game.friends.find(x => x.id === f.id && x.name === f.name);
  if (old) { old.stage = Math.max(old.stage, f.stage); old.beaten = (game.bestStage || 1) > old.stage; saveGame(); return `🔄 ${f.name}の記録を更新しました（ステージ${old.stage}）`; }
  if (game.friends.length >= FRIEND_MAX) game.friends.shift();
  game.friends.push({ ...f, beaten: false, at: Date.now() });
  let msg = `👥 ${f.name}から挑戦状！ ステージ${f.stage}を超えろ`;
  if (!game.friendBonusGot) { game.friendBonusGot = true; game.gems += FRIEND_FIRST_GEMS; msg += `（はじめての登録 +💎${FRIEND_FIRST_GEMS}）`; }
  updateStatsUI(); saveGame(); return msg;
}
setInterval(() => { // フレンドの記録を超えたら報酬
  if (!game.friends || phase !== 'battle') return;
  for (const f of game.friends) if (!f.beaten && (game.bestStage || 1) > f.stage) {
    f.beaten = true; game.gems += FRIEND_BEAT_GEMS; updateStatsUI(); saveGame();
    if (typeof showRunBanner === 'function') showRunBanner(`👥 ${f.name}の挑戦状を突破！`, `ステージ${f.stage}を超えた！ +💎${FRIEND_BEAT_GEMS}`);
  }
}, 2000);
function friendRankEntries(mode) { // ベストステージのランキングにフレンドも並べる
  if (mode !== 'stage' || !game.friends) return [];
  return game.friends.map(f => ({ name: '👥 ' + f.name, score: f.stage, isPlayer: false, isFriend: true }));
}
function renderFriendBox() {
  const host = document.getElementById('friendBox'); if (!host) return;
  const fr = game.friends || [], me = game.bestStage || 1;
  host.innerHTML = `<div class="fb-title">👥 フレンドの挑戦状</div>
    <div class="fb-my"><span>あなたの挑戦状コード</span><code id="myRivalCode">${myRivalCode()}</code><button class="fb-copy" id="fbCopyBtn">📋 コピー</button><button class="fb-copy" data-share="records">📤 送る</button></div>
    <div class="fb-in"><input id="fbCodeInput" placeholder="友達の挑戦状コードを貼り付け" autocomplete="off"><button id="fbAddBtn">登録</button></div>
    <div class="fb-note">${game.friendBonusGot ? '' : `はじめて登録すると 💎${FRIEND_FIRST_GEMS}・`}友達の最高ステージを超えるたびに 💎${FRIEND_BEAT_GEMS}</div>
    <div class="fb-list">${fr.length ? fr.slice().sort((a, b) => b.stage - a.stage).map(f => `<div class="fb-row ${f.beaten || me > f.stage ? 'beat' : ''}"><b>${f.name}</b><span>ステージ${f.stage}</span><em>${f.beaten || me > f.stage ? '✓ 突破' : `あと${f.stage - me + 1}`}</em></div>`).join('') : '<div class="fb-empty">まだフレンドがいません。コードを送り合って競おう！</div>'}</div>`;
  document.getElementById('fbCopyBtn').onclick = async ev => { try { await navigator.clipboard.writeText(myRivalCode()); showTapError('📋 コピーしました', ev.clientX, ev.clientY); } catch (e) { showTapError('コードを長押しでコピーしてください', ev.clientX, ev.clientY); } };
  document.getElementById('fbAddBtn').onclick = ev => { const msg = addFriendCode(document.getElementById('fbCodeInput').value); showNotice(msg, msg.startsWith('⚠️'), 2600); if (!msg.startsWith('⚠️')) { renderFriendBox(); if (typeof renderRanking === 'function') renderRanking(); } };
}
{ const list = document.getElementById('rankingList');
  if (list) { const box = document.createElement('div'); box.id = 'friendBox'; box.className = 'friend-box'; list.parentNode.insertBefore(box, list); }
  document.querySelectorAll('.tab-btn[data-tab="ranking"]').forEach(b => b.addEventListener('click', () => setTimeout(renderFriendBox, 0)));
  renderFriendBox();
}
// 占いは戦績ページの上・ゲーム画面の下のボタンから
{ const host = document.getElementById('questBox');
  if (host) { const b = document.createElement('button'); b.className = 'fortune-btn'; b.id = 'fortuneBtn'; host.parentNode.insertBefore(b, host); b.addEventListener('click', openFortune); }
  const upd = () => { const b = document.getElementById('fortuneBtn'); if (!b) return; const seen = game.fortuneDate === todayKey(); b.innerHTML = seen ? `🔮 今日の勇者占い：<b>${todayFortune().rank}</b>（もう一度見る）` : '🔮 今日の勇者占いを見る <b>NEW</b>'; b.classList.toggle('new', !seen); };
  upd(); setInterval(upd, 5000);
}
