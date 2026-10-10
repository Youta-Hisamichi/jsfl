// ---- オープニング：初めて遊ぶときに流れる短い物語（タップで次へ・スキップ可）。設定・デバッグからいつでも見返せる ----
const OPENING_SCENES = [
  { bg: 'night', text: '遥か昔――\n世界は、魔法陣の光に守られていた。', art: 'circle' },
  { bg: 'red', text: 'だがある夜、魔王の封印が解け、\n無数の魔物があふれ出した。', art: 'bosses' },
  { bg: 'red', text: '草原も、森も、海も、塔も……\nすべてが魔物の群れに飲み込まれていく。', art: 'march' },
  { bg: 'dawn', text: 'その時、ひとりの少年が剣を取った。', art: 'hero' },
  { bg: 'dawn', text: '「……右腕が、疼く」', art: 'heroTalk' },
  { bg: 'sky', text: 'ぶつかって、跳ね返って、また立ち向かう。\n仲間と共に、何度でも――', art: 'party' },
  { bg: 'title', text: '', art: 'title' },
];
let openingOn = false;
function openingArt(kind) {
  const hero = `<img class="op-hero" src="${PLAYER_SPRITE}" alt="">`;
  const en = k => ENEMY_SPRITES[k] ? `<img src="${ENEMY_SPRITES[k]}" alt="">` : '';
  if (kind === 'circle') return `<img class="op-circle" src="assets/img/ui/magic_circle.webp" alt="">`;
  if (kind === 'bosses') return `<div class="op-bosses">${['b_starEater', 'b_darkWitch', 'b_fireDragon'].map((k, i) => ENEMY_SPRITES[k] ? `<img style="--i:${i}" src="${ENEMY_SPRITES[k]}" alt="">` : '').join('')}</div>`;
  if (kind === 'march') return `<div class="op-march">${['m_goblinSpear', 'm_skelSword', 'm_redBat', 'm_magmaSlime', 'm_ghostKnight', 'm_direWolf', 'm_mushSpear', 'm_icicleBat', 'm_orcKnight'].map((k, i) => `<span style="--i:${i}">${en(k)}</span>`).join('')}</div>`;
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
  let i = -1, typing = null, autoT = null;
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
    textEl.textContent = ''; textEl.dataset.full = sc.text;
    let n = 0;
    if (sc.text) typing = setInterval(() => { n++; textEl.textContent = sc.text.slice(0, n); if (n % 2 === 0) playTone(880 + Math.random() * 80, 0.02, 'square', 0.015); if (n >= sc.text.length) { clearInterval(typing); autoT = setTimeout(next, 2600); } }, 55);
    if (sc.art === 'bosses') { thump(70, 30, 0.6, 0.5); }
    if (sc.art === 'hero') { playTone(523, 0.3, 'triangle', 0.06, 1046); }
    if (sc.art === 'title') { playLoginBonusSound && playLoginBonusSound(); shakeScreenLight && shakeScreenLight(); }
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
  playOpening();
}, 900);
// 設定画面のスタッフロールの下に「オープニングを見る」
{ const cb = document.getElementById('creditsBtn');
  if (cb) { cb.insertAdjacentHTML('afterend', '<button class="modal-shop-btn" id="openingBtn"><span class="msb-name">📖 オープニングを見る</span></button>');
    document.getElementById('openingBtn').addEventListener('click', () => { const sm = document.getElementById('settingsModal'); if (sm) sm.classList.remove('show'); playOpening(); }); } }
