// ---- オープニング：初めて遊ぶときに流れる短い物語（タップで次へ・スキップ可）。設定・デバッグからいつでも見返せる ----
const OPENING_SCENES = [
  { bg: 'night', text: '遥か昔――\n世界は、魔法陣の光に守られていた。', art: 'circle' },
  { bg: 'red', text: 'だがある夜、魔王の封印が解け、\n無数の魔物があふれ出した。', art: 'bosses' },
  { bg: 'red', text: '草原も、森も、海も、塔も……\nすべてが魔物の群れに飲み込まれていく。', art: 'march' },
  { bg: 'dawn', text: 'その時、あなたは神の啓示を聞き、剣を取った。', art: 'hero' },
  { bg: 'dawn', text: '「俺の反射タックルは\u3000\u200b\n\u3000誰にも止められないぜ！」', art: 'heroTalk' },
  { bg: 'sky', text: 'ぶつかって、跳ね返って、また立ち向かう。\n仲間と共に、何度でも――\n\n無限の進化を活かして生き残れ！', art: 'party' },
  { bg: 'title', text: '', art: 'title' },
];
let openingOn = false;
function openingArt(kind) {
  const hero = `<img class="op-hero" src="${PLAYER_SPRITE}" alt="">`;
  const en = k => ENEMY_SPRITES[k] ? `<img src="${ENEMY_SPRITES[k]}" alt="">` : '';
  if (kind === 'circle') return `<img class="op-circle" src="assets/img/ui/magic_circle.webp" alt=""><div class="op-circle-flash"></div>`; // 途中で魔法陣がまばゆく光る
  if (kind === 'bosses') return `<div class="op-bosses">${['b_starEater', 'b_darkWitch', 'b_fireDragon'].map((k, i) => ENEMY_SPRITES[k] ? `<img style="--i:${i}" src="${ENEMY_SPRITES[k]}" alt="">` : '').join('')}</div>`;
  if (kind === 'march') { // 魔物の大群が奥から次々に押し寄せる（ザコの絵からランダムに40体）
    const keys = Object.keys(ENEMY_SPRITES).filter(k => !k.startsWith('b_')).sort(() => Math.random() - 0.5).slice(0, 40);
    return `<div class="op-horde">${keys.map((k, i) => `<span style="--x:${(Math.random() * 78).toFixed(1)}%;--d:${(2.2 + Math.random() * 1.4).toFixed(2)}s;--dl:${(-Math.random() * 3.6).toFixed(2)}s;z-index:${i}"><img src="${ENEMY_SPRITES[k]}" alt=""></span>`).join('')}</div>`;
  }
  if (kind === 'hero') return `<div class="op-light"></div>${hero}`;
  if (kind === 'heroTalk') return `<div class="op-light"></div>${hero}<div class="op-aura"></div>`;
  if (kind === 'party') return `<div class="op-party">${['cat', 'warrior', 'mage', 'priest', 'archer', 'dragon'].map((id, i) => `<img style="--i:${i}" src="${COMPANION_SPRITES[id]}" alt="">`).join('')}</div>${hero}`;
  if (kind === 'title') return `<img class="op-circle spin" src="assets/img/ui/magic_circle.webp" alt=""><div class="op-title"><small>放置系ハクスラ</small><b>無限反射</b><span>― INFINITE REFLECTION ―</span></div>${hero}<div class="op-tap">TAP TO START</div>`;
  return '';
}
function playOpening(onEnd) {
  if (openingOn) return;
  openingOn = true;
  const prevPhase = phase; phase = 'paused';
  const ov = document.createElement('div'); ov.id = 'openingOv'; ov.className = 'op-ov';
  ov.innerHTML = `<div class="op-stage"></div><div class="op-text"></div><button class="op-skip">スキップ ▶▶</button>`;
  document.body.appendChild(ov);
  try { ensureAudio(); refreshBgm(); } catch (e) {}
  const stage = ov.querySelector('.op-stage'), textEl = ov.querySelector('.op-text');
  let i = -1, typing = null, autoT = null, heroAt = 0;
  const finish = () => {
    clearInterval(typing); clearTimeout(autoT);
    ov.classList.add('out'); setTimeout(() => ov.remove(), 600);
    openingOn = false; game.openingSeen = true; phase = prevPhase === 'paused' ? 'battle' : prevPhase;
    try { refreshBgm(); } catch (e) {} saveGame();
    if (onEnd) onEnd();
  };
  const next = () => {
    clearInterval(typing); clearTimeout(autoT);
    if (i >= 0 && textEl.dataset.full && textEl.textContent.length < textEl.dataset.full.length) { textEl.textContent = textEl.dataset.full; autoT = setTimeout(next, 2600); return; } // 文字送り中なら全文を出すだけ
    i++;
    if (i >= OPENING_SCENES.length) { finish(); return; }
    const sc = OPENING_SCENES[i];
    ov.dataset.bg = sc.bg;
    stage.innerHTML = openingArt(sc.art); stage.classList.remove('in'); void stage.offsetWidth; stage.classList.add('in');
    if (sc.art === 'hero') heroAt = performance.now();
    const cont = sc.art === 'heroTalk' && i > 0 && OPENING_SCENES[i - 1].art === 'hero'; // 勇者の場面からはそのまま続ける（出し直さない）
    stage.classList.toggle('cont', cont); if (cont) stage.style.setProperty('--fd', -((performance.now() - heroAt) / 1000).toFixed(2) + 's'); // ふわふわの揺れも途切れないように
    const txt = sc.art === 'heroTalk' ? sc.text.replace(/「([\s\S]*)」/, (m0, t) => '「' + heroSay(t) + '」') : sc.text; // 勇者のセリフは語尾付き
    textEl.textContent = ''; textEl.dataset.full = txt;
    let n = 0, pause = 0;
    if (txt) typing = setInterval(() => { if (pause > 0) { pause--; return; } n++; if (txt.slice(n, n + 2) === '\n\n') pause = 20; /* 空行の前で少し間をおく */ textEl.textContent = txt.slice(0, n); if (n % 2 === 0) playTone(880 + Math.random() * 80, 0.02, 'square', 0.015); if (n >= txt.length) { clearInterval(typing); autoT = setTimeout(next, 2600); } }, 55);
    try { opSfx(sc.art); } catch (e) {} // 場面ごとの効果音
    if (sc.art === 'heroTalk') opHeroBounce(ov, stage);
    if (sc.art === 'title') { shakeScreenLight && shakeScreenLight(); }
  };
  ov.addEventListener('click', e => { if (e.target.closest('.op-skip')) { finish(); return; } next(); });
  next();
}
// 曲：オープニング中は壮大なスタッフロールの曲
{ const orig = refreshBgm; refreshBgm = function () { if (openingOn && typeof playBgmTrack === 'function' && audioCtx) { playBgmTrack('battle31'); return; } return orig.apply(this, arguments); }; }
// 初めて遊ぶとき（まだ何も進めていない）に自動で流す
setTimeout(() => {
  if (game.openingSeen) return;
  if ((game.bestStage || 1) > 1 || (game.reincarnations || 0) > 0) { game.openingSeen = true; return; } // 既存のセーブには出さない
  playOpening(() => setTimeout(() => openFinalGoal(true), 400)); // オープニングのあと最終目標を見せる（キャラエディットは廃止）
}, 900);
// 設定画面のスタッフロールの下に「オープニングを見る」
{ const cb = document.getElementById('creditsBtn');
  if (cb) { cb.insertAdjacentHTML('afterend', '<button class="modal-shop-btn" id="openingBtn"><span class="msb-name">📖 オープニングを見る</span></button>');
    document.getElementById('openingBtn').addEventListener('click', () => { const sm = document.getElementById('settingsModal'); if (sm) sm.classList.remove('show'); playOpening(); }); } }

// ===== ゲームの最終目標：ステージ100万（魔王の玉座） =====
const FINAL_GOAL_STAGE = 1000000;
OPENING_SCENES.splice(OPENING_SCENES.length - 1, 0, { bg: 'red', text: '魔王が待つのは、遥か彼方――\nステージ100万。', art: 'goal' });
{ const orig = openingArt; openingArt = function (kind) {
  if (kind === 'goal') return `<div class="op-goal"><small>最終目標</small><b>STAGE</b><strong>1,000,000</strong><span>👑 魔王の玉座</span></div><img class="op-goal-boss" src="assets/img/misc/op_darkWitch.webp" alt="">`;
  return orig.apply(this, arguments);
}; }
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
// すでに遊んでいる人にも一度だけ見せる（ほかのダイアログが開いていないとき）
{ let tries = 0; const t = setInterval(() => {
  if (game.finalGoalSeen || ++tries > 40) { clearInterval(t); return; }
  if (!game.openingSeen || openingOn || document.querySelector('.modal-overlay.show, .op-ov')) return;
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
function heroName() { return game.username || '勇者'; }
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
function openCharEdit(first, onDone) {
  let ov = document.getElementById('charEditOv');
  if (ov) ov.remove();
  ov = document.createElement('div'); ov.id = 'charEditOv'; ov.className = 'ce-ov';
  const look = heroLook(); let ending = 0, endingText = game.heroEndingText || '';
  const esc = t => String(t).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  const sw = part => HERO_COLORS[part].map(([n, , col], i) => `<button class="ce-sw" data-ce-part="${part}" data-ce-i="${i}" style="--c:${col}" title="${n}"><i></i><span>${n}</span></button>`).join('');
  ov.innerHTML = `<div class="ce-panel"><div class="ce-title">🎨 キャラエディット</div>${first ? '<div class="ce-sub">冒険に出る勇者の姿を決めよう！（あとから設定で変えられます）</div>' : ''}
    <div class="ce-stage"><img class="ce-hero" alt=""><button class="ce-rand" title="ランダム">🎲 ランダム</button></div>
    <div class="ce-say"></div>
    <label class="ce-name"><span>名前</span><input type="text" maxlength="12" placeholder="名無しの勇者" value="${esc(game.username || '')}"></label>
    <div class="ce-sec">性別</div><div class="ce-opts ce-gender"><button data-ce-gender="male">♂ 男の子</button><button data-ce-gender="female">♀ 女の子</button></div>
    <div class="ce-sec" style="display:none">語尾</div><div class="ce-opts ce-ending" style="display:none">${HERO_ENDINGS.map(([n], i) => `<button data-ce-end="${i}">${n}</button>`).join('')}</div>
    <label class="ce-name ce-endtext" style="display:none !important"><span>語尾</span><input type="text" maxlength="6" placeholder="例：でござる" value="${esc(endingText)}"></label>
    <div class="ce-sec">見た目プリセット</div><div class="ce-presets">${HERO_PRESETS.map((p, i) => `<button class="ce-pre" data-ce-pre="${i}">${p.name}</button>`).join('')}</div>
    <div class="ce-sec">髪の色</div><div class="ce-row">${sw('hair')}</div>
    <div class="ce-sec">服の色</div><div class="ce-row">${sw('outfit')}</div>
    <div class="ce-sec">マントの色</div><div class="ce-row">${sw('cape')}</div>
    <div class="ce-btns">${first ? '' : '<button class="ce-cancel">やめる</button>'}<button class="ce-ok">${first ? 'この姿で冒険へ！' : '決定'}</button></div></div>`;
  document.body.appendChild(ov);
  const heroImg = ov.querySelector('.ce-hero'), nameIn = ov.querySelector('.ce-name input'), endIn = ov.querySelector('.ce-endtext input');
  const curEnding = () => ending === 4 ? endIn.value.trim().slice(0, 6) : HERO_ENDINGS[ending][1];
  const SAMPLE = ['よし、行くぞ！', '今日もがんばる。', 'この剣で世界を救う！'];
  let sampleI = 0;
  const refresh = (img = true) => {
    if (img) heroImg.src = recolorHero(look);
    ov.querySelectorAll('.ce-sw').forEach(b => b.classList.toggle('on', look[b.dataset.cePart] === +b.dataset.ceI));
    ov.querySelectorAll('.ce-pre').forEach(b => { const p = HERO_PRESETS[+b.dataset.cePre]; b.classList.toggle('on', p.hair === look.hair && p.outfit === look.outfit && p.cape === look.cape); });
    ov.querySelectorAll('[data-ce-gender]').forEach(b => b.classList.toggle('on', b.dataset.ceGender === look.gender));
    ov.querySelectorAll('[data-ce-end]').forEach(b => b.classList.toggle('on', +b.dataset.ceEnd === ending));
    ov.querySelector('.ce-endtext').style.display = ending === 4 ? '' : 'none';
    ov.querySelector('.ce-say').innerHTML = `<b>${esc(nameIn.value.trim() || '勇者')}</b>「${esc(heroSay(SAMPLE[sampleI], curEnding()))}」`;
  };
  const hop = () => { heroImg.classList.remove('hop'); void heroImg.offsetWidth; heroImg.classList.add('hop'); };
  refresh();
  requestAnimationFrame(() => ov.classList.add('show'));
  nameIn.addEventListener('input', () => refresh(false)); endIn.addEventListener('input', () => refresh(false));
  ov.addEventListener('click', ev => {
    const s = ev.target.closest('[data-ce-part]'), p = ev.target.closest('[data-ce-pre]'), g = ev.target.closest('[data-ce-gender]'), e = ev.target.closest('[data-ce-end]');
    if (s) { look[s.dataset.cePart] = +s.dataset.ceI; playTone(988, 0.05, 'square', 0.04); refresh(); hop(); return; }
    if (p) { const pr = HERO_PRESETS[+p.dataset.cePre]; look.hair = pr.hair; look.outfit = pr.outfit; look.cape = pr.cape; playTone(1175, 0.06, 'square', 0.04); refresh(); hop(); return; }
    if (g) { look.gender = g.dataset.ceGender; playTone(1047, 0.06, 'square', 0.04); refresh(); hop(); return; }
    if (e) { ending = +e.dataset.ceEnd; sampleI = (sampleI + 1) % SAMPLE.length; playTone(880, 0.05, 'square', 0.04); refresh(false); if (ending === 4) endIn.focus(); return; }
    if (ev.target.closest('.ce-rand')) { // ランダム：性別・名前・語尾・色をまとめて決める
      const r = n => Math.floor(Math.random() * n);
      look.gender = Math.random() < 0.5 ? 'male' : 'female';
      look.hair = r(HERO_COLORS.hair.length); look.outfit = r(HERO_COLORS.outfit.length); look.cape = r(HERO_COLORS.cape.length);
      const names = HERO_RANDOM_NAMES[look.gender]; nameIn.value = names[r(names.length)];
      ending = 0; sampleI = r(SAMPLE.length);
      playTone(660, 0.05, 'square', 0.05); setTimeout(() => playTone(990, 0.08, 'square', 0.05), 60);
      refresh(); hop(); return;
    }
    if (ev.target.closest('.ce-cancel')) { ov.classList.remove('show'); setTimeout(() => ov.remove(), 250); if (onDone) onDone(); return; }
    if (ev.target.closest('.ce-ok')) {
      game.heroLook = { ...look }; game.charEditSeen = true;
      game.heroEnding = ending; game.heroEndingText = endIn.value.trim().slice(0, 6);
      if (ending === 4 && !game.heroEndingText) game.heroEnding = 0; // 空なら普通
      game.username = nameIn.value.trim().slice(0, 12);
      if (typeof usernameInput !== 'undefined' && usernameInput) usernameInput.value = game.username;
      applyHeroLook(); saveGame();
      if (typeof renderRanking === 'function') try { renderRanking(); } catch (err) {}
      if (typeof playRegisterSound === 'function') playRegisterSound();
      ov.classList.remove('show'); setTimeout(() => ov.remove(), 250);
      if (onDone) onDone();
    }
  });
}
// 設定画面に「キャラエディット」
{ const ob = document.getElementById('openingBtn');
  if (ob) { ob.insertAdjacentHTML('beforebegin', '<button class="modal-shop-btn" id="charEditBtn" style="display:none !important"><span class="msb-name">🎨 キャラエディット（名前・見た目）</span></button>');
    document.getElementById('charEditBtn').addEventListener('click', () => { const sm = document.getElementById('settingsModal'); if (sm && typeof closeSettingsModal === 'function') closeSettingsModal(); openCharEdit(false); }); } }
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
    const IC = { howToPlayBtn: 'howto', contactBtn: 'contact', termsBtn: 'terms', privacyBtn: 'privacy', faqBtn: 'faq', creditsBtn: 'credits', charEditBtn: 'chara', openingBtn: 'opening', fundsActBtn: 'funds' }; // 項目アイコンの絵
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

// ===== オープニングの効果音（場面ごと。どれもその場で合成） =====
function opOut() { const g = audioCtx.createGain(); g.gain.value = Math.max(0.0001, game.sfxVolume == null ? 1 : game.sfxVolume); g.connect(audioCtx.destination); return g; }
function opOsc(at, dur, type, f0, f1, vol, out, opt = {}) { // 音程つきの音（f1へ滑る）。opt.lp でこもらせる、opt.vib でビブラート
  const t0 = audioCtx.currentTime + at, o = audioCtx.createOscillator(), g = audioCtx.createGain(); o.type = type;
  o.frequency.setValueAtTime(f0, t0); if (f1 && f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol, t0 + (opt.atk || 0.02)); g.gain.setValueAtTime(vol, t0 + dur * (opt.hold || 0.3)); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  let node = o; if (opt.lp) { const f = audioCtx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = opt.lp; f.Q.value = opt.q || 1; o.connect(f); node = f; }
  if (opt.vib) { const l = audioCtx.createOscillator(), lg = audioCtx.createGain(); l.frequency.value = opt.vibHz || 6; lg.gain.value = opt.vib; l.connect(lg); lg.connect(o.frequency); l.start(t0); l.stop(t0 + dur + 0.05); }
  node.connect(g); g.connect(out); o.start(t0); o.stop(t0 + dur + 0.05);
}
function opNoise(at, dur, vol, freq, out, opt = {}) { // ノイズ（風・足音・炎・歓声のもと）
  const t0 = audioCtx.currentTime + at, n = Math.max(1, Math.floor(audioCtx.sampleRate * dur));
  const buf = audioCtx.createBuffer(1, n, audioCtx.sampleRate), d = buf.getChannelData(0); for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
  const src = audioCtx.createBufferSource(); src.buffer = buf;
  const f = audioCtx.createBiquadFilter(); f.type = opt.type || 'bandpass'; f.Q.value = opt.q || 1; f.frequency.setValueAtTime(freq, t0); if (opt.f1) f.frequency.exponentialRampToValueAtTime(opt.f1, t0 + dur);
  const g = audioCtx.createGain(); g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol, t0 + (opt.atk || 0.01)); g.gain.setValueAtTime(vol, t0 + dur * (opt.hold || 0.2)); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(f); f.connect(g); g.connect(out); src.start(t0); src.stop(t0 + dur + 0.02);
}
function opVoice(at, dur, vowel, p0, p1, vol, out, vib = 5) { // 母音の声（声援・鳴き声・歌声）
  const t0 = audioCtx.currentTime + at, o = audioCtx.createOscillator(), env = audioCtx.createGain(); o.type = 'sawtooth';
  o.frequency.setValueAtTime(p0, t0); o.frequency.exponentialRampToValueAtTime(p1, t0 + dur);
  const l = audioCtx.createOscillator(), lg = audioCtx.createGain(); l.frequency.value = 5.5; lg.gain.value = vib; l.connect(lg); lg.connect(o.frequency);
  env.gain.setValueAtTime(0.0001, t0); env.gain.exponentialRampToValueAtTime(vol, t0 + Math.min(0.08, dur / 3)); env.gain.setValueAtTime(vol, t0 + dur * 0.6); env.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  VOWEL_F[vowel].forEach((fq, k) => { const f = audioCtx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = fq * (p0 > 600 ? 1.15 : 1); f.Q.value = 8 - k * 2; const g = audioCtx.createGain(); g.gain.value = [3, 1.5, 0.7][k]; o.connect(f); f.connect(g); g.connect(env); });
  env.connect(out); o.start(t0); l.start(t0); o.stop(t0 + dur + 0.05); l.stop(t0 + dur + 0.05);
}
function opSfx(art) {
  if (!audioCtx) return; const out = opOut();
  if (art === 'circle') { // 魔法陣が光る：映画館のロゴのような、地の底から湧き上がる重低音（光る1.6秒後に頂点）
    [[41, 0], [55, -6], [82, 5], [110, -4], [165, 7], [220, -8]].forEach(([f, dt]) => { opOsc(0.1, 3.6, 'sawtooth', f * 0.94, f * Math.pow(2, dt / 1200), 0.03, out, { lp: 900, q: 2, atk: 1.5, hold: 0.7, vib: 0.6, vibHz: 0.4 }); });
    opOsc(0.1, 3.8, 'sine', 32, 41, 0.22, out, { atk: 1.5, hold: 0.7 }); // 体に響く超低音
    opNoise(0.2, 3.4, 0.03, 120, out, { type: 'lowpass', f1: 600, atk: 1.4, hold: 0.7 });
  }
  if (art === 'bosses') { // ドラゴンの咆哮 → 女王の妖しい歌声
    opOsc(0.15, 1.6, 'sawtooth', 150, 62, 0.35, out, { lp: 700, q: 4, vib: 18, vibHz: 23, atk: 0.12, hold: 0.45 });
    opOsc(0.15, 1.6, 'square', 75, 40, 0.18, out, { lp: 300, vib: 10, vibHz: 31, atk: 0.12, hold: 0.45 });
    opNoise(0.15, 1.6, 0.3, 520, out, { q: 2, f1: 260, atk: 0.12, hold: 0.45 });
    opOsc(0.1, 0.9, 'sine', 70, 30, 0.45, out, { atk: 0.01, hold: 0.1 }); // 地響き
    [[880, 0.55], [988, 0.4], [831, 0.55], [740, 1.1]].reduce((t, [f, d]) => { opVoice(t, d + 0.15, 'a', f, f * 0.995, 0.09, out, 9); return t + d; }, 1.9);
  }
  if (art === 'march') { // 魔物の大群の足音：ゴゴゴ…と地鳴りが続き、ドスドスと無数の足音が重なる
    opNoise(0.05, 4.2, 0.28, 90, out, { type: 'lowpass', q: 0.8, atk: 0.8, hold: 0.8 });
    opOsc(0.05, 4.2, 'sine', 38, 34, 0.22, out, { atk: 0.8, hold: 0.8, vib: 3, vibHz: 7 });
    for (let k = 0; k < 70; k++) { const t = 0.1 + Math.random() * 4, f = 55 + Math.random() * 45; opOsc(t, 0.16, 'sine', f, f * 0.5, 0.08 + Math.random() * 0.1, out, { atk: 0.004, hold: 0.05 }); opNoise(t, 0.08, 0.06, 160 + Math.random() * 140, out, { type: 'lowpass', atk: 0.003, hold: 0.05 }); }
  }
  if (art === 'hero') { // パワーアップ：駆け上がる音とキラッ
    [262, 330, 392, 523, 659, 784, 1047].forEach((f, i) => opOsc(0.1 + i * 0.06, 0.18, 'square', f, f, 0.05, out, { lp: 3000, atk: 0.005 }));
    opOsc(0.1, 0.6, 'sawtooth', 200, 1600, 0.05, out, { lp: 2500, atk: 0.05, hold: 0.6 });
    opNoise(0.55, 0.6, 0.06, 5000, out, { q: 3, f1: 9000 }); [1568, 2093].forEach((f, i) => opOsc(0.6 + i * 0.08, 0.7, 'sine', f, f, 0.06, out, { atk: 0.005, hold: 0.05 }));
  }
  if (art === 'heroTalk') { // 覚醒：重い衝撃 → オーラが渦を巻いて立ち上がる
    opOsc(0.05, 1.2, 'sine', 90, 28, 0.5, out, { atk: 0.005, hold: 0.1 }); opNoise(0.05, 0.5, 0.25, 900, out, { type: 'lowpass', f1: 120 });
    opNoise(0.3, 2.0, 0.16, 300, out, { q: 5, f1: 4000, atk: 0.6, hold: 0.7 });
    opOsc(0.3, 2.0, 'sawtooth', 110, 440, 0.06, out, { lp: 1800, vib: 6, vibHz: 7, atk: 0.4, hold: 0.7 });
    [220, 277, 330, 440].forEach(f => opOsc(1.2, 1.4, 'triangle', f, f, 0.05, out, { atk: 0.05, hold: 0.4, vib: 2 }));
  }
  if (art === 'party') { // 仲間が並ぶたびに、ピロリン♪とレベルアップ音が連続で上がっていく
    for (let k = 0; k < 6; k++) { const t = 0.3 + k * 0.15 + 0.1, base = 523 * Math.pow(2, k * 2 / 12);
      [1, 1.26, 1.5, 2].forEach((m, n) => opOsc(t + n * 0.045, 0.16, 'square', base * m, base * m, 0.045, out, { lp: 4000, atk: 0.004, hold: 0.3 })); }
    [1047 * 1.5, 1047 * 2].forEach((f, n) => opOsc(1.35 + n * 0.08, 0.6, 'triangle', f, f, 0.06, out, { atk: 0.005, hold: 0.1 }));
  }
  if (art === 'goal') { // 鼓動：ドクン、ドクン…
    for (let i = 0; i < 5; i++) { const t = 0.2 + i * 0.85; opOsc(t, 0.22, 'sine', 70, 38, 0.55, out, { atk: 0.005, hold: 0.1 }); opOsc(t + 0.2, 0.25, 'sine', 60, 32, 0.4, out, { atk: 0.005, hold: 0.1 }); }
  }
  if (art === 'title') { // スーパーパワーアップ：力がぐんぐん溜まって、ドンと弾けてキラキラ輝く
    opOsc(0, 1.0, 'sawtooth', 110, 1760, 0.05, out, { lp: 3500, atk: 0.05, hold: 0.85 });
    opNoise(0, 1.0, 0.12, 300, out, { q: 3, f1: 8000, atk: 0.4, hold: 0.85 });
    [262, 330, 392, 523, 659, 784, 1047, 1319, 1568, 2093].forEach((f, k) => opOsc(0.08 * k, 0.12, 'square', f, f, 0.04, out, { lp: 5000, atk: 0.003 }));
    opOsc(1.0, 1.2, 'sine', 140, 32, 0.6, out, { atk: 0.003, hold: 0.05 }); opNoise(1.0, 0.6, 0.3, 3000, out, { type: 'lowpass', f1: 300 });
    [523, 659, 784, 1047].forEach(f => { opOsc(1.0, 2.2, 'triangle', f, f, 0.05, out, { atk: 0.01, hold: 0.4, vib: 4, vibHz: 6 }); opOsc(1.0, 1.4, 'square', f * 2, f * 2, 0.012, out, { lp: 6000, atk: 0.01, hold: 0.3 }); });
    for (let k = 0; k < 12; k++) { const f = 2000 + Math.random() * 3000; opOsc(1.1 + k * 0.1, 0.4, 'sine', f, f, 0.035, out, { atk: 0.003, hold: 0.05 }); } // キラキラ
  }
}

// 勇者のセリフの場面：引っ張って放つと、画面中を反射しながら飛び回る（ゲームの引っ張りアタックと同じ動き）
function opHeroBounce(ov, stage) {
  const hero = stage.querySelector('.op-hero'); if (!hero) return;
  const t0 = performance.now();
  setTimeout(() => {
    if (!hero.isConnected) return;
    const r = hero.getBoundingClientRect(), W = ov.clientWidth, H = ov.clientHeight, w = Math.min(r.width, 120), h = w * (r.height / r.width || 1);
    hero.style.animation = 'none'; hero.style.transition = 'transform 0.45s ease-in';
    hero.style.transform = 'translate(0, 26px) scale(1.15, 0.85)'; // ぐっと引っ張る
    try { if (audioCtx) { const out = opOut(); opOsc(0, 0.45, 'sawtooth', 300, 120, 0.04, out, { lp: 1200, atk: 0.02, hold: 0.6 }); } } catch (e) {}
    setTimeout(() => {
      if (!hero.isConnected) return;
      const img = document.createElement('img'); img.src = hero.src; img.className = 'op-bounce'; img.style.width = w + 'px';
      let x = r.left + (r.width - w) / 2, y = r.top + (r.height - h) / 2, vx = 760 * (Math.random() < 0.5 ? -1 : 1), vy = -980, spin = 0, last = performance.now(), trail = 0;
      hero.style.visibility = 'hidden'; ov.appendChild(img);
      try { if (audioCtx) opNoise(0, 0.35, 0.18, 800, opOut(), { f1: 4000, q: 1.2 }); } catch (e) {} // ビュンッ
      const step = now => {
        if (!stage.isConnected || !hero.isConnected || !ov.isConnected) { img.remove(); return; }
        const dt = Math.min(0.04, (now - last) / 1000); last = now;
        x += vx * dt; y += vy * dt; spin += (vx > 0 ? 1 : -1) * 900 * dt;
        let hit = false;
        if (x < 0) { x = 0; vx = Math.abs(vx); hit = true; } else if (x > W - w) { x = W - w; vx = -Math.abs(vx); hit = true; }
        if (y < 0) { y = 0; vy = Math.abs(vy); hit = true; } else if (y > H - h) { y = H - h; vy = -Math.abs(vy); hit = true; }
        if (hit) { try { if (audioCtx) { const out = opOut(); opOsc(0, 0.12, 'square', 520, 260, 0.05, out, { lp: 2500, atk: 0.003, hold: 0.1 }); opNoise(0, 0.08, 0.12, 1800, out, { q: 1.5 }); } } catch (e) {}
          const f = document.createElement('div'); f.className = 'op-bounce-hit'; f.style.left = (x + w / 2) + 'px'; f.style.top = (y + h / 2) + 'px'; ov.appendChild(f); setTimeout(() => f.remove(), 400); }
        img.style.transform = `translate(${x}px, ${y}px) rotate(${spin}deg)`;
        if (++trail % 3 === 0) { const g = img.cloneNode(); g.className = 'op-bounce op-bounce-ghost'; ov.insertBefore(g, img); setTimeout(() => g.remove(), 350); }
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, 470);
  }, 700);
}
