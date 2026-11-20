// ---- 最終目標・勇者の見た目・設定画面のデザイン（オープニングは削除した） ----
// ===== ゲームの最終目標：ステージ100万（魔王の玉座） =====
const FINAL_GOAL_STAGE = 1000000;
function finalGoalPct(stage) { return Math.min(100, Math.log10(Math.max(1, stage)) / Math.log10(FINAL_GOAL_STAGE) * 100); } // 桁で進むので対数（10・100・1000…で等間隔）
function openFinalGoal(first) {
  if (document.querySelector('.fg-panel')) return; // 二重に開かない
  game.finalGoalSeen = true;
  const best = Math.max(1, game.bestStage || 1), pct = finalGoalPct(best), left = Math.max(0, FINAL_GOAL_STAGE - best);
  const marks = [10, 100, 1000, 10000, 100000, 1000000].map(v => `<i style="left:${finalGoalPct(v)}%" class="${best >= v ? 'on' : ''}"><span>${v >= 10000 ? (v / 10000) + '万' : v.toLocaleString('ja-JP')}</span></i>`).join('');
  const ov = document.createElement('div'); ov.className = 'modal-overlay show'; ov.style.zIndex = 85;
  ov.innerHTML = `<div class="modal-panel fg-panel">
    <div class="fg-head">🏆 このゲームの最終目標</div>
    <div class="fg-goal"><small>魔王の玉座</small><b>ステージ <em>1,000,000</em></b></div>
    <div class="fg-text">果てしなく続くステージを進み、<b>ステージ100万</b>で待つ魔王を倒せ！<br>力尽きても<b>転生</b>すれば強くなって、もっと先へ行ける。</div>
    <div class="fg-bar"><div class="fg-fill" style="width:${pct}%"></div>${marks}<div class="fg-me" style="left:${pct}%">⚔️</div></div>
    <div class="fg-now">最高到達 <b>ステージ${formatStageNumber(best)}</b>${left ? `　あと <b>${formatStageNumber(left)}</b>` : '　<b>制覇！</b>'}</div>
    <button class="modal-close-btn fg-ok">${first ? '冒険に出発！' : '閉じる'}</button></div>`;
  document.body.appendChild(ov);
  const close = () => ov.remove();
  ov.querySelector('.fg-ok').addEventListener('click', close);
  ov.addEventListener('click', e => { if (e.target === ov) close(); });
  try { playLoginBonusSound(); } catch (e) {}
}
// ===== 初めて遊ぶときの説明（1枚）：反射・仲間・スキル・転生で、ステージ100万を目指す =====
function openWelcome() {
  if (document.querySelector('.wc-panel')) return;
  game.welcomeSeen = true; game.finalGoalSeen = true; saveGame();
  const boss = ENEMY_SPRITES.b_fireDragon ? `<img class="wc-boss" src="${ENEMY_SPRITES.b_fireDragon}" alt="">` : '';
  const card = (img, t, d) => `<div class="wc-card"><img class="wc-ico" src="${img}" alt=""><b>${t}</b><span>${d}</span></div>`;
  const ov = document.createElement('div'); ov.className = 'modal-overlay show wc-ov'; ov.style.zIndex = 86;
  ov.innerHTML = `<div class="modal-panel wc-panel">
    <div class="wc-top">${boss}<img class="wc-hero" src="${PLAYER_SPRITE}" alt="">
      <div class="wc-goal"><small>目指すは魔王の玉座</small><b>STAGE <em>1,000,000</em></b></div></div>
    <div class="wc-lead">放っておいても勇者は自動で戦い続ける。<br>4つの力で強くなって、<b>ステージ100万</b>を目指そう！</div>
    <div class="wc-grid">
      ${card('assets/img/ui/rk/i_refl.webp', '🔁 反射', '引っ張って放つと体当たり。壁や反射玉で跳ね返るほど大ダメージ')}
      ${card('assets/img/icons/tab_companion.webp', '🐾 仲間', '招集ガチャで仲間を集めて、一緒に戦ってもらおう')}
      ${card('assets/img/icons/sk_skillNova.webp', '✨ スキル', 'スキルガチャで技を覚えると、戦いの中で自動で発動')}
      ${card('assets/img/icons/art_rebirthOrb.webp', '🌌 転生', '行き詰まったら転生。ジェムと永続の力を持って、もっと先へ')}
    </div>
    <button class="modal-close-btn wc-ok">冒険に出発！</button></div>`;
  document.body.appendChild(ov);
  const close = () => { ov.classList.add('wc-closing'); setTimeout(() => ov.remove(), 250); try { refreshBgm(); } catch (e) {} };
  ov.querySelector('.wc-ok').addEventListener('click', close, { once: true });
  try { playLoginBonusSound(); } catch (e) {}
}
// 初めて起動したとき（まだ何も進めていない）に出す。ログインボーナスより手前に重ねる
setTimeout(() => {
  if (game.welcomeSeen) return;
  if ((game.bestStage || 1) > 1 || (game.reincarnations || 0) > 0) { game.welcomeSeen = true; return; } // すでに遊んでいる人には出さない
  openWelcome();
}, 0);
// 最終目標を一度だけ見せる（ほかのダイアログが開いていないとき）
{ let tries = 0; const t = setInterval(() => {
  if (game.finalGoalSeen || ++tries > 40) { clearInterval(t); return; }
  if (document.querySelector('.modal-overlay.show')) return;
  clearInterval(t); openFinalGoal(false);
}, 3000); }
// 上の「🎯 目標」チップをタップすると最終目標を見られる
document.addEventListener('click', e => { if (e.target.closest('#goalChip')) openFinalGoal(false); });
// 本当に100万に届いたら全クリアのお祝い
setInterval(() => {
  if (game.finalGoalCleared || (game.bestStage || 0) < FINAL_GOAL_STAGE) return;
  game.finalGoalCleared = true; game.gems += 100;
  try { showRunBanner('🏆 全クリア！！', 'ステージ100万に到達して魔王の玉座を制覇！ +💎100'); } catch (e) { showNotice('🏆 全クリア！ ステージ100万到達 +💎100', false, 6000); }
  try { playLoginBonusSound(); updateStatsUI(); saveGame(); } catch (e) {}
}, 2000);

// ===== キャラエディット：名前・見た目プリセット・色（髪・服・マント）。初回はオープニングのあと、以降は設定から =====
const HERO_COLORS = { // 元の絵の色から、色相・彩度・明るさを置き換える（null＝元の色）
  hair:   [['茶', null, '#8a5a2b'], ['金', { h: 48, s: 0.8, v: 1.7 }, '#f0cc48'], ['黒', { h: 230, s: 0.25, v: 0.45 }, '#2a2a36'], ['銀', { h: 220, s: 0.08, v: 1.65 }, '#c8ccd8'], ['赤', { h: 2, s: 1.1, v: 1.15 }, '#c8302a'], ['青', { h: 215, s: 0.9, v: 1.15 }, '#3a6ad0'], ['緑', { h: 125, s: 0.7, v: 1.05 }, '#3a9a4a'], ['桃', { h: 330, s: 0.55, v: 1.5 }, '#f090c0'], ['紫', { h: 275, s: 0.7, v: 1.1 }, '#8a4ac8']],
  outfit: [['青', null, '#2f5fb0'], ['赤', { h: 356, s: 1, v: 1 }, '#b8302a'], ['緑', { h: 130, s: 0.85, v: 0.95 }, '#2f8a3a'], ['紫', { h: 280, s: 0.85, v: 1 }, '#7a3ab8'], ['黒', { h: 230, s: 0.2, v: 0.5 }, '#2a2c34'], ['白', { h: 220, s: 0.1, v: 1.6 }, '#e0e4ec'], ['金', { h: 45, s: 0.9, v: 1.3 }, '#d0a830'], ['桃', { h: 330, s: 0.7, v: 1.25 }, '#e070a8']],
  cape:   [['赤', null, '#c8302a'], ['青', { h: 220, s: 1, v: 1 }, '#2f5fd0'], ['紫', { h: 280, s: 0.9, v: 1 }, '#8a3ac8'], ['緑', { h: 130, s: 0.85, v: 0.9 }, '#2f9a3a'], ['黒', { h: 230, s: 0.2, v: 0.5 }, '#26282e'], ['白', { h: 220, s: 0.08, v: 1.7 }, '#eceef4'], ['金', { h: 45, s: 0.95, v: 1.4 }, '#e0b830'], ['桃', { h: 330, s: 0.7, v: 1.3 }, '#f080b8']],
};
const HERO_BASE_HUE = { hair: 22, outfit: 220, cape: 355 };
const HERO_PRESETS = [ // 見た目プリセット（髪・服・マントの組み合わせ）
  { name: '勇者', hair: 0, outfit: 0, cape: 0 }, { name: '光の騎士', hair: 1, outfit: 5, cape: 1 }, { name: '闇の剣士', hair: 2, outfit: 4, cape: 2 },
  { name: '炎の戦士', hair: 4, outfit: 1, cape: 6 }, { name: '森の守り手', hair: 1, outfit: 2, cape: 3 }, { name: '氷の剣士', hair: 3, outfit: 0, cape: 5 },
  { name: '星の王子', hair: 8, outfit: 6, cape: 2 }, { name: '桜の剣士', hair: 7, outfit: 7, cape: 5 },
];
const HERO_ORIG_SRC = PLAYER_SPRITE;
const HERO_GENDER_SRC = { male: HERO_ORIG_SRC, female: HERO_ORIG_SRC }; // 性別ごとの勇者の絵（女の子の絵はあとで差し替え。今は同じ絵）
const HERO_ENDINGS = [['普通', ''], ['にゃん', 'にゃん'], ['にょ', 'にょ'], ['ぞい', 'ぞい'], ['自由に決める', null]];
const HERO_RANDOM_NAMES = { male: ['アレン', 'カイト', 'レオン', 'ユウ', 'ジーク', 'ソラ', 'リク', 'ハヤテ', 'ルーク', 'ガルド'], female: ['エマ', 'リナ', 'ミア', 'セレナ', 'ユイ', 'ルナ', 'アリサ', 'ヒカリ', 'ノエル', 'サクラ'] };
function heroName() { return userNameHtml('勇者'); } // 画面（HTML）に出す用に無害化した名前
function heroEnding() { return ''; /* キャラエディットの語尾は廃止（いつも普通のしゃべり方） */ const e = game.heroEnding || 0; return e === 4 ? String(game.heroEndingText || '').slice(0, 6) : (HERO_ENDINGS[e] || HERO_ENDINGS[0])[1]; }
function heroSay(text, ending) { // 勇者のセリフに語尾を付ける（文の終わりごと。「。」「！」などの記号の前に入れる）
  const end = ending != null ? ending : heroEnding(); if (!end || !text) return text;
  return String(text).split(/(?<=[。！？!?♪])/).map(sen => {
    const m = sen.match(/^([\s\S]*?)([。！？!?♪…・ー〜～\s]*)$/); if (!m || !m[1] || m[1].endsWith(end)) return sen;
    return m[1] + end + m[2];
  }).join('');
}
let heroBaseImg = null;
function heroLook() { const l = game.heroLook || {}; return { hair: l.hair || 0, outfit: l.outfit || 0, cape: l.cape || 0, gender: l.gender === 'female' ? 'female' : 'male' }; }
function recolorHero(look) { // 勇者の絵の髪・服・マントの色を塗り替えた画像（data URL）を作る
  const img = heroBaseImg; if (!img || !img.naturalWidth) return HERO_ORIG_SRC;
  if (!look.hair && !look.outfit && !look.cape) return HERO_GENDER_SRC[look.gender] || HERO_ORIG_SRC;
  const W = img.naturalWidth, H = img.naturalHeight, c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d'); x.drawImage(img, 0, 0);
  let d; try { d = x.getImageData(0, 0, W, H); } catch (e) { return HERO_ORIG_SRC; }
  const px = d.data, T = { hair: HERO_COLORS.hair[look.hair][1], outfit: HERO_COLORS.outfit[look.outfit][1], cape: HERO_COLORS.cape[look.cape][1] };
  for (let i = 0; i < px.length; i += 4) {
    if (px[i + 3] < 20) continue;
    const r = px[i] / 255, g = px[i + 1] / 255, b = px[i + 2] / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), v = mx, s = mx ? (mx - mn) / mx : 0;
    let h = 0; if (mx !== mn) { h = mx === r ? (g - b) / (mx - mn) : mx === g ? 2 + (b - r) / (mx - mn) : 4 + (r - g) / (mx - mn); h = (h * 60 + 360) % 360; }
    const y = Math.floor(i / 4 / W);
    let part = null;
    const xx = (i / 4) % W, face = xx > W * 0.34 && xx < W * 0.66 && y > H * 0.37 && y < H * 0.48, chin = xx > W * 0.46 && xx < W * 0.66 && y >= H * 0.48 && y < H * 0.545; // 顔（目・口・あご）は元の色のまま
    if ((h >= 335 || h < 8) && s > 0.5 && v > 0.25 && !face) part = 'cape';
    else if (h >= 195 && h <= 250 && s > 0.25) part = 'outfit';
    else if (h >= 8 && h <= 38 && s > 0.45 && v < 0.92 && y < H * 0.6 && !face && !chin) part = 'hair';
    const t = part && T[part]; if (!t) continue;
    const dh = ((h - HERO_BASE_HUE[part] + 540) % 360) - 180; // 元の色相からのずれ（陰影の色味）を残す
    const nh = (t.h + dh * 0.5 + 360) % 360, ns = Math.min(1, s * t.s), nv = Math.min(1, v * t.v);
    const f = (n) => { const k = (n + nh / 60) % 6; return nv - nv * ns * Math.max(0, Math.min(k, 4 - k, 1)); };
    px[i] = Math.round(f(5) * 255); px[i + 1] = Math.round(f(3) * 255); px[i + 2] = Math.round(f(1) * 255);
  }
  x.putImageData(d, 0, 0);
  return c.toDataURL('image/png');
}
function applyHeroLook() { // 塗り替えた絵を、ゲーム中のすべての勇者の絵に反映
  PLAYER_SPRITE = recolorHero(heroLook());
  if (typeof braveImg !== 'undefined') braveImg.src = PLAYER_SPRITE;
  if (typeof applyHeroChar === 'function') applyHeroChar();
  if (typeof renderCompanionList === 'function' && typeof activeTabCache !== 'undefined' && activeTabCache === 'companion') renderCompanionList();
}
{ const im = new Image(); im.onload = () => { heroBaseImg = im; if (game.heroLook) applyHeroLook(); }; im.src = HERO_ORIG_SRC; }
// ===== 設定画面のデザイン（紺の金縁パネル・金のスライダー・羊皮紙の項目ボタン） =====
function decorateSettingsPage() {
  const page = document.querySelector('#settingsModal .settings-page'); if (!page) return;
  page.classList.add('st2');
  page.querySelectorAll('.settings-btn-row > .modal-shop-btn:not(.lang-btn):not([href])').forEach(b => {
    if (b.classList.contains('st-item')) return;
    const nm = b.querySelector('.msb-name'); if (!nm) return;
    const first = nm.firstElementChild && nm.firstChild === nm.firstElementChild ? nm.firstElementChild : null; // 絵文字が画像に置き換わっていることもある
    let icon, label;
    if (first) { icon = first.outerHTML; label = nm.textContent.trim(); }
    else { const m = nm.textContent.trim().match(/^(\S+)\s+(.+)$/); if (!m) return; icon = m[1]; label = m[2]; }
    b.classList.add('st-item');
    const IC = { howToPlayBtn: 'howto', contactBtn: 'contact', termsBtn: 'terms', privacyBtn: 'privacy', faqBtn: 'faq', creditsBtn: 'credits', charEditBtn: 'chara', fundsActBtn: 'funds' }; // 項目アイコンの絵
    if (IC[b.id]) icon = `<img src="assets/img/ui/set/i_${IC[b.id]}.webp" alt="">`;
    b.innerHTML = `<span class="st-ico">${icon}</span><span class="msb-name">${label}</span><span class="st-arrow"></span>`;
  });
  [['bgmVolRange'], ['sfxVolRange']].forEach(([id]) => { const r = document.getElementById(id); if (r) r.style.setProperty('--v', r.value + '%'); });
  const setIco = (el, ico) => { if (!el || el.querySelector('.st-hico')) return; el.innerHTML = `<img class="st-hico" src="assets/img/ui/set/${ico}.webp" alt="">` + el.textContent.replace(/^[^\s]*\s+/, '').trim(); };
  setIco(page.querySelector('[data-i18n="langLabel"]'), 'i_globe'); setIco(page.querySelector('[data-i18n="devLabel"]'), 'i_person');
  page.querySelectorAll('a.modal-shop-btn .msb-name').forEach(n => setIco(n, /YouTube/.test(n.textContent) ? 'i_yt' : 'i_x'));
  const vb = document.getElementById('vibrationBtn'); if (vb) vb.classList.toggle('st-on', game.vibration !== false);
  const vl = page.querySelector('[data-i18n="vibrationLabel"]'); if (vl && !vl.querySelector('.st-vib')) vl.innerHTML = '<img class="st-vib" src="assets/img/ui/set/vib.webp" alt="">' + vl.textContent.replace(/^\S*📳\S*\s*/, '').trim();
}
['bgmVolRange', 'sfxVolRange'].forEach(id => { const r = document.getElementById(id); if (r) r.addEventListener('input', () => r.style.setProperty('--v', r.value + '%')); });
document.getElementById('vibrationBtn') && document.getElementById('vibrationBtn').addEventListener('click', () => setTimeout(decorateSettingsPage, 0));
settingsBtn.addEventListener('click', () => setTimeout(decorateSettingsPage, 0));
document.querySelectorAll('#settingsModal .lang-btn').forEach(b => b.addEventListener('click', () => setTimeout(decorateSettingsPage, 0)));
setTimeout(decorateSettingsPage, 0);
{ const fit = () => { const h = document.getElementById('topHeader'), t = document.getElementById('tabBar'), m = document.getElementById('settingsModal'); if (!m) return; // 設定画面をヘッダーとタブの間にぴったり合わせる
    if (h) m.style.setProperty('--set-top', Math.round(h.getBoundingClientRect().bottom) + 'px'); if (t) m.style.setProperty('--set-bot', Math.round(window.innerHeight - t.getBoundingClientRect().top) + 'px'); };
  const m = document.getElementById('settingsModal'); if (m) new MutationObserver(fit).observe(m, { attributes: true, attributeFilter: ['class'] }); window.addEventListener('resize', fit); }
document.getElementById('tabBar')?.addEventListener('click', () => { const m = document.getElementById('settingsModal'); if (m && m.classList.contains('show')) document.getElementById('settingsCloseBtn')?.click(); }, true); // 設定中に下のタブを押したら設定を閉じてそのページへ
{ const fitNews = () => { const h = document.getElementById('topHeader'), t = document.getElementById('tabBar'), m = document.getElementById('newsModal'); if (!m) return; // お知らせもヘッダーとタブの間に
    if (h) m.style.setProperty('--set-top', Math.round(h.getBoundingClientRect().bottom) + 'px'); if (t) m.style.setProperty('--set-bot', Math.round(window.innerHeight - t.getBoundingClientRect().top) + 'px'); };
  const nb = document.getElementById('newsBtn');
  nb?.addEventListener('click', ev => { const m = document.getElementById('newsModal'); if (m && m.classList.contains('show')) { m.classList.remove('show'); ev.stopImmediatePropagation(); } }, true); // もう一度押すと閉じる
  nb?.addEventListener('click', () => setTimeout(fitNews, 0));
  window.addEventListener('resize', fitNews);
  document.getElementById('tabBar')?.addEventListener('click', () => document.getElementById('newsModal')?.classList.remove('show'), true); }
// お知らせ・設定：どちらかを開くともう片方は閉じる。開いている間はゲームを止め、後ろの画面を隠してスクロールも止める
{ const news = () => document.getElementById('newsModal'), set = document.getElementById('settingsModal');
  document.getElementById('settingsBtn')?.addEventListener('click', () => news()?.classList.remove('show'), true);
  document.getElementById('newsBtn')?.addEventListener('click', () => { if (set.classList.contains('show') && !news()?.classList.contains('show')) document.getElementById('settingsCloseBtn')?.click(); }, true);
  let newsPaused = null, wasOpen = false;
  const sync = () => {
    const nOpen = !!news()?.classList.contains('show'), open = nOpen || set.classList.contains('show');
    if (nOpen && newsPaused === null && phase === 'battle') { newsPaused = 'battle'; phase = 'paused'; }
    if (!nOpen && newsPaused) { if (phase === 'paused' && !set.classList.contains('show')) phase = newsPaused; newsPaused = null; }
    if (nOpen !== sync.nOpen) { sync.nOpen = nOpen; if (typeof refreshBgm === 'function') refreshBgm(); } // お知らせを開いたら専用の曲に
    if (open !== wasOpen) { wasOpen = open; document.documentElement.classList.toggle('panel-open', open); if (open) { window.scrollTo(0, 0); window.dispatchEvent(new Event('resize')); } }
  };
  new MutationObserver(sync).observe(set, { attributes: true, attributeFilter: ['class'] });
  new MutationObserver(() => { const n = news(); if (n && !n._obs) { n._obs = true; new MutationObserver(sync).observe(n, { attributes: true, attributeFilter: ['class'] }); sync(); } }).observe(document.body, { childList: true }); }
