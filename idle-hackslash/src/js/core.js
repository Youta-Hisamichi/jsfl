if (window.AudioParam && AudioParam.prototype.exponentialRampToValueAtTime) {
  const origExpRamp = AudioParam.prototype.exponentialRampToValueAtTime;
  AudioParam.prototype.exponentialRampToValueAtTime = function (value, time) {
    if (!(Math.abs(value) >= 0.0001)) value = value < 0 ? -0.0001 : 0.0001;
    return origExpRamp.call(this, value, time);
  };
}
const canvas = document.getElementById('arenaCanvas');
let ctx = canvas.getContext('2d'); // 撃破時の吹っ飛び描画の間だけオーバーレイ用に差し替える
const wrap = canvas.parentElement;

const stageNumEl = document.getElementById('stageNum');
const superGemsNumEl = document.getElementById('superGemsNum');
const bestStageNumEl = document.getElementById('bestStageNum');
const totalKillsNumEl = document.getElementById('totalKillsNum');
const totalTapsNumEl = document.getElementById('totalTapsNum');
const maxDamageNumEl = document.getElementById('maxDamageNum');
const maxDpsNumEl = document.getElementById('maxDpsNum');
const maxComboNumEl = document.getElementById('maxComboNum');
const bestCoinsNumEl = document.getElementById('bestCoinsNum');
const critRateNumEl = document.getElementById('critRateNum');
const critMultNumEl = document.getElementById('critMultNum');
const accuracyNumEl = document.getElementById('accuracyNum');
const evasionNumEl = document.getElementById('evasionNum');
const usernameInput = document.getElementById('usernameInput');
const usernameSaveBtn = document.getElementById('usernameSaveBtn');
const playTimeText = document.getElementById('playTimeText');
const rebornNumEl = document.getElementById('rebornNum');
const headerCoinsEl = document.getElementById('headerCoins');
let coinFx = [];          // 撃破で飛び散るコイン（左上のコイン数へ飛んでいく）
let coinDisplayHold = 0;  // まだヘッダーに届いていないコインの額（表示から引いておく）
const headerGemsEl = document.getElementById('headerGems');
const stageProgressText = document.getElementById('stageProgressText');
const stageProgressFill = document.getElementById('stageProgressFill');
const stagePlayerMark = document.getElementById('stagePlayerMark');
const startedAtText = document.getElementById('startedAtText');

const playerHPFill = document.getElementById('playerHPFill');
const enemyHPFill = document.getElementById('enemyHPFill');
const playerHPText = document.getElementById('playerHPText');
const enemyHPText = document.getElementById('enemyHPText');
const playerAtkNum = document.getElementById('playerAtkNum');
const enemyAtkNum = document.getElementById('enemyAtkNum');
const enemyAccNum = document.getElementById('enemyAccNum');
const playerAccNum = document.getElementById('playerAccNum');
const playerEvaNum = document.getElementById('playerEvaNum');
const enemyEvaNum = document.getElementById('enemyEvaNum');
const enemyName = document.getElementById('enemyName');
const speedRange = document.getElementById('speedRange');
const speedValue = document.getElementById('speedValue');
const upgradeList = document.getElementById('upgradeList');
const specialBtn = document.getElementById('specialBtn');
const accelBtn = document.getElementById('accelBtn');
const healBtn = document.getElementById('healBtn');
const barrierBtn = document.getElementById('barrierBtn');
const poisonBtn = document.getElementById('poisonBtn');
const paralyzeBtn = document.getElementById('paralyzeBtn');
const atkUpBtn = document.getElementById('atkUpBtn');
const regenBtn = document.getElementById('regenBtn');
const silenceBtn = document.getElementById('silenceBtn');
const deathBtn = document.getElementById('deathBtn');
const coinStrikeBtn = document.getElementById('coinStrikeBtn');
const zeniBtn = document.getElementById('zeniBtn');
const mysteryBtn = document.getElementById('mysteryBtn');
const compRushBtn = document.getElementById('compRushBtn');
const novaBtn = document.getElementById('novaBtn');
const blastBtn = document.getElementById('blastBtn');
const rebornBtn = document.getElementById('rebornBtn');
const shopList = document.getElementById('shopList');
const coinShopList = document.getElementById('coinShopList');
const supergemShopList = document.getElementById('supergemShopList');
const gachaBtn = document.getElementById('gachaBtn');
const gacha10Btn = document.getElementById('gacha10Btn');
const gachaResult = document.getElementById('gachaResult');
const evolutionList = document.getElementById('evolutionList');
const companionList = document.getElementById('companionList');
const battleNotice = document.getElementById('battleNotice');
const cloneCounter = document.getElementById('cloneCounter');
const CLONES_ENABLED = false;
const CLONE_ONLY_ITEMS = ['summoner', 'cloneSlot'];
if (!CLONES_ENABLED) cloneCounter.style.display = 'none';
const bossWarning = document.getElementById('bossWarning');

const toast = document.getElementById('toast');
const toastIcon = document.getElementById('toastIcon');
const toastBig = document.getElementById('toastBig');
const toastSub = document.getElementById('toastSub');
const continueBtn = document.getElementById('continueBtn');
const giveUpBtn = document.getElementById('giveUpBtn');
const dialogCloseBtn = document.getElementById('dialogCloseBtn');

const artifactListEl = document.getElementById('artifactList');
const artifactProgressEl = document.getElementById('artifactProgress');
const rankingList = document.getElementById('rankingList');
const totalUserCountEl = document.getElementById('totalUserCount');
const resetBtn = document.getElementById('resetBtn');
const debugRow = document.querySelector('.debug-row');
const debugToggleBtn = document.getElementById('debugToggleBtn');
function setDebugOpen(open) {
  document.getElementById('debugPanel').style.display = open ? '' : 'none';
  debugToggleBtn.classList.toggle('open', open);
  try { localStorage.setItem('circle-battle-idle-debug-open', open ? '1' : '0'); } catch (err) { /* 保存できなくても動作は続ける */ }
}
debugToggleBtn.addEventListener('click', () => setDebugOpen(document.getElementById('debugPanel').style.display === 'none'));
try { if (localStorage.getItem('circle-battle-idle-debug-open') === '1') setDebugOpen(true); } catch (err) { /* 読めなければ閉じたまま */ }

const tabBar = document.getElementById('tabBar');
const tabPages = document.querySelectorAll('.tab-page');

const rebirthShopList = document.getElementById('rebirthShopList');
const stageSkipBtn = document.getElementById('stageSkipBtn');
const stageSkipModal = document.getElementById('stageSkipModal');
const stageSkipList = document.getElementById('stageSkipList');
const stageSkipGems = document.getElementById('stageSkipGems');
const stageSkipOrigin = document.getElementById('stageSkipOrigin');
const stageSkipCloseBtn = document.getElementById('stageSkipCloseBtn');
const skipRetryModal = document.getElementById('skipRetryModal');
const skipRetryText = document.getElementById('skipRetryText');
const skipRetryBtn = document.getElementById('skipRetryBtn');
const skipGiveUpBtn = document.getElementById('skipGiveUpBtn');
const skipRetryActions = document.getElementById('skipRetryActions');
const SKIP_RETRY_BUTTON_DELAY_MS = 1000; // 連打による誤タップ防止：ボタンは少し遅れて表示
let skipRetryShownAt = 0;

const loginBonusModal = document.getElementById('loginBonusModal');
const loginBonusStreak = document.getElementById('loginBonusStreak');
const loginSlotBox = document.getElementById('loginSlotBox');
const loginSlotNum = document.getElementById('loginSlotNum');
const loginBonusReward = document.getElementById('loginBonusReward');
const loginBonusCloseBtn = document.getElementById('loginBonusCloseBtn');

const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const settingsCloseBtn = document.getElementById('settingsCloseBtn');
const bgmVolRange = document.getElementById('bgmVolRange');
const bgmVolVal = document.getElementById('bgmVolVal');
const sfxVolRange = document.getElementById('sfxVolRange');
const sfxVolVal = document.getElementById('sfxVolVal');
const vibrationBtn = document.getElementById('vibrationBtn');
const vibrationState = document.getElementById('vibrationState');
const howToPlayBtn = document.getElementById('howToPlayBtn');
const contactBtn = document.getElementById('contactBtn');
const termsBtn = document.getElementById('termsBtn');
const privacyBtn = document.getElementById('privacyBtn');
const langJaBtn = document.getElementById('langJaBtn');
const langEnBtn = document.getElementById('langEnBtn');
const infoModal = document.getElementById('infoModal');
const infoModalTitle = document.getElementById('infoModalTitle');
const infoModalBody = document.getElementById('infoModalBody');
const infoModalCloseBtn = document.getElementById('infoModalCloseBtn');

const rankDailyBtn = document.getElementById('rankDailyBtn');
const rankStageBtn = document.getElementById('rankStageBtn');
const rankDateNav = document.getElementById('rankDateNav');
const rankPrevDayBtn = document.getElementById('rankPrevDayBtn');
const rankNextDayBtn = document.getElementById('rankNextDayBtn');
const rankDateLabel = document.getElementById('rankDateLabel');
const rankingTitle = document.getElementById('rankingTitle');

function getActiveTab() {
  const page = document.querySelector('.tab-page.active');
  return page ? page.dataset.tab : 'game';
}
let battleSfx = false;
let activeTabCache = 'game';
function isBattleSfxMuted() { return battleSfx && activeTabCache !== 'game'; }
const NPC_SPRITES = {
  king: 'assets/img/npc/king.webp',
  elder: 'assets/img/npc/elder.webp',
  sister: 'assets/img/npc/sister.webp',
  smith: 'assets/img/npc/smith.webp',
  merchant: 'assets/img/npc/merchant.webp',
  scholar: 'assets/img/npc/scholar.webp',
  princess: 'assets/img/npc/princess.webp',
  fortune: 'assets/img/npc/fortune.webp',
  guild: 'assets/img/npc/guild.webp',
  sage: 'assets/img/misc/npc_sage.webp', // スキルの指南役（仲間ページのギルドマスターと見分けやすいように）
};
const SHOPKEEPERS = {
  upgrade:   { npc: 'smith',     name: '鍛冶屋のガンツ', lines: ['いらっしゃい！ 腕も体も鍛えていきな！', 'コインがあるなら、ガンガン強化だ！', '長押しすりゃ一気に鍛えてやるぜ。', '転生したら鍛え直しだ。気にすんな！'] },
  companion: { npc: 'guild',     name: 'ギルドマスター', lines: ['頼れる仲間を紹介しよう。', '仲間が揃えば、どんな敵も怖くないぞ。', '同じ仲間を呼べば、パーティが厚くなる。', 'レアな仲間はショップで開放できるぞ。'] },
  coinshop:  { npc: 'sage',      name: '魔導書の賢者ソフィア', lines: ['スキルのことなら、この魔導書におまかせを。', '好きなスキルを選んで鍛えましょう！', '修行の代金はコインでけっこうですよ。', '戦闘中しか使えない技もあるので気をつけて。', 'サブウェポンも、ここで鍛えられます。'] },
  artifact:  { npc: 'scholar',   name: '学者のリナ', lines: ['遺物の研究ならお任せください。', 'この遺物、とても興味深い力を秘めています…', '集めた遺物は、転生しても力を失いません。', '図鑑を埋めるのが楽しみですね！'] },
  gemshop:   { npc: 'princess',  name: 'エメラ姫', lines: ['ようこそ、わたくしの宝石店へ♪', 'ジェムの輝きは永遠ですわ。', 'お気に入りの品は見つかりまして？', '買った効果は転生しても続きますのよ。'] },
  gacha:     { npc: 'fortune',   name: '占い師マダム', lines: ['ふふ…あなたの力を進化させてあげる。', '水晶玉が…光っているわ…！', 'ジェムを多く捧げるほど、運命は輝くわ。', '進化の羽があれば、×256も夢じゃないわよ。'] },
  records:   { npc: 'elder',     name: '記録係の長老', lines: ['ほっほっ、よく戦っておるのう。', 'おぬしの戦いの記録、しっかり残しておるぞ。', '図鑑を埋めるのも冒険の楽しみじゃ。', '最高記録を更新する日が楽しみじゃわい。'] },
  ranking:   { npc: 'king',      name: 'アルス王', lines: ['よくぞ参った、勇者よ！', 'ランキングの頂点を目指すのだ！', '今日の戦果、期待しておるぞ。', '上位の者には、わしから称賛を贈ろう。'] },
  settings:  { npc: 'sister',    name: '案内係のシスター', lines: ['お困りのことはありませんか？', '音量はここで調整できますよ。', '遊び方はこちらからご覧ください。', 'ゆっくり休むことも大切ですよ。'] },
};
function renderShopkeeper(tab) {
  const info = SHOPKEEPERS[tab];
  if (!info) return;
  document.querySelectorAll(`.shopkeeper[data-npc-tab="${tab}"]`).forEach(el => {
    const line = info.lines[Math.floor(Math.random() * info.lines.length)];
    const oldBubble = el.querySelector('.sk-bubble');
    if (oldBubble && el.querySelector('.sk-img')) { oldBubble.innerHTML = `<span class="sk-name">${info.name}</span>${line}`; return; } // 2回目以降は絵を作り直さずセリフだけ替える（絵がちらつかない）
    el.innerHTML = `<img class="sk-img" src="${NPC_SPRITES[info.npc]}" alt="${info.name}"><div class="sk-bubble"><span class="sk-name">${info.name}</span>${line}</div>`;
    el.querySelector('.sk-img').onclick = () => { // タップすると別のセリフ
      const img = el.querySelector('.sk-img');
      img.classList.remove('hop'); void img.offsetWidth; img.classList.add('hop');
      const bubble = el.querySelector('.sk-bubble');
      let next = line; while (info.lines.length > 1 && next === bubble.lastChild.textContent) next = info.lines[Math.floor(Math.random() * info.lines.length)];
      bubble.innerHTML = `<span class="sk-name">${info.name}</span>${next}`;
    };
  });
}
const TAB_LISTS = {
  coinshop: [() => renderCoinShopList()],
  gemshop: [() => renderShopList(), () => renderSupergemShopList()],
  gacha: [() => renderEvolutionList()],
  companion: [() => renderCompanionList(), () => renderUpgradeList()], // 自キャラの強化は仲間ページにある
  ranking: [() => renderRanking()],
};
const dirtyTabLists = new Set(Object.keys(TAB_LISTS));
function renderTabLists() {
  const active = getActiveTab();
  for (const tab in TAB_LISTS) {
    if (tab === active) { TAB_LISTS[tab].forEach(fn => fn()); dirtyTabLists.delete(tab); }
    else dirtyTabLists.add(tab);
  }
}
function renderDirtyTabList(name) {
  if (!dirtyTabLists.has(name)) return;
  dirtyTabLists.delete(name);
  TAB_LISTS[name].forEach(fn => fn());
}
function switchTab(name) {
  if (name !== 'game' && typeof gameOverBgm !== 'undefined' && (gameOverBgm || (phase === 'paused' && deathFx))) return;
  if (name !== 'game' && typeof suspendGameOverForTab === 'function') suspendGameOverForTab(); // ゲームオーバー画面は他のページに持ち出さない
  activeTabCache = name;
  if (name !== 'companion') { const cgr = document.getElementById('compGachaResult'); if (cgr) cgr.style.display = 'none'; } // 仲間ガチャの結果はページを離れたら閉じる
  document.body.classList.toggle('floor-bg', name === 'game'); // 床タイルの背景はゲーム画面だけ
  if (typeof userPaused !== 'undefined' && userPaused && typeof audioCtx !== 'undefined' && audioCtx) { if (name === 'game') audioCtx.suspend(); else audioCtx.resume(); } // 一時停止は保ったまま、他のページでは音だけ鳴らす
  renderShopkeeper(name);
  renderDirtyTabList(name);
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === name));
  document.querySelectorAll('.tab-btn.has-new').forEach(b => { if (b.dataset.tab === name) b.classList.remove('has-new'); });
  tabPages.forEach(p => p.classList.toggle('active', p.dataset.tab === name));
  if (name === 'records') { renderBestiary(); renderBgmBook(); updateStatsUI(); renderRecordGoals(true); } // 戦績の目標は開いたときに必ず描く（他のページでは戦闘が止まって更新されないため）
  else if (bgmBookPreview) bgmBookPreview = null; // 戦績ページを離れたら試聴をやめる
  if (name === 'game') resizeCanvas();
  if (name === 'game' && typeof resumeGameOverForTab === 'function') resumeGameOverForTab();
  if (name === 'game' && gemShopReturn && gemShopReturn.mustResume) runGemShopReturn();
  if (name === 'gemshop') { renderRebirthShopList(); shopSortOrder = null; renderShopList(); if (typeof renderCompLockList === 'function') renderCompLockList(); } // 完売品を下へ並べ替えるのはショップを開き直したときだけ
  refreshBgm();
}
tabBar.addEventListener('click', event => {
  const btn = event.target.closest('.tab-btn');
  if (!btn) return;
  if (audioCtx && btn.dataset.tab !== getActiveTab()) playTabSound();
  switchTab(btn.dataset.tab);
});

const REWARD_AD_GEMS = 5;
const REWARD_AD_COOLDOWN = 5 * 60 * 1000;
const REWARD_AD_DURATION = 3 * 1000; // テスト用の仮の動画の長さ
const rewardAdModal = document.getElementById('rewardAdModal');
const rewardAdCount = document.getElementById('rewardAdCount');
const rewardAdProgress = document.getElementById('rewardAdProgress');
const rewardAdClaimBtn = document.getElementById('rewardAdClaimBtn');
const rewardAdCloseBtn = document.getElementById('rewardAdCloseBtn');
document.getElementById('rewardAdAmount').textContent = REWARD_AD_GEMS;
let rewardAdTimer = null;
function getRewardAdRemaining() { return Math.max(0, REWARD_AD_COOLDOWN - (Date.now() - (game.lastRewardAdAt || 0))); }
function updateRewardAdButtons() {
  const remaining = getRewardAdRemaining();
  document.querySelectorAll('[data-reward-ad]').forEach(btn => {
    btn.classList.toggle('cooling', remaining > 0);
    if (remaining > 0) btn.classList.remove('ad-art-btn');
    if (remaining > 0) {
      const sec = Math.ceil(remaining / 1000);
      btn.dataset.html = '';
      btn.textContent = `🎬 次の動画まで ${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
    } else {
      const art = !isAdFree() && REWARD_AD_GEMS === 5; // 「動画を見て💎5 GET」の絵のボタン
      const adHtml = isAdFree() ? `${xi('x_present')} 広告なしで ${xi('x_gem')}${REWARD_AD_GEMS} GET` : art ? '<img class="ad-art" src="assets/img/ui/ad_gem5.webp" alt="動画を見て ジェム5 GET">' : `🎬 動画を見て ${xi('x_gem')}${REWARD_AD_GEMS} GET`;
      if (btn.dataset.html !== adHtml) { btn.innerHTML = adHtml; btn.dataset.html = adHtml; }
      btn.classList.toggle('ad-art-btn', art);
    }
  });
}
function playRewardedVideo(onComplete, rewardText) { // rewardText：この動画で何がもらえるか（省略時はジェム）
  const startedAt = Date.now();
  document.getElementById('rewardAdText').innerHTML = `最後まで視聴すると${rewardText || ` 💎${REWARD_AD_GEMS} を獲得できます`}`;
  rewardAdClaimBtn.style.display = 'none';
  rewardAdCloseBtn.style.display = 'flex';
  rewardAdProgress.style.width = '0%';
  rewardAdModal.classList.add('show');
  clearInterval(rewardAdTimer);
  const tick = () => {
    const elapsed = Date.now() - startedAt;
    rewardAdProgress.style.width = Math.min(100, elapsed / REWARD_AD_DURATION * 100) + '%';
    if (elapsed >= REWARD_AD_DURATION) {
      clearInterval(rewardAdTimer);
      rewardAdCount.textContent = '視聴完了！';
      onComplete();
      return;
    }
    rewardAdCount.textContent = `再生中… 残り ${Math.ceil((REWARD_AD_DURATION - elapsed) / 1000)} 秒`;
  };
  tick();
  rewardAdTimer = setInterval(tick, 250);
}
document.addEventListener('click', event => {
  const btn = event.target.closest('[data-reward-ad]');
  if (!btn) return;
  if (getRewardAdRemaining() > 0) { showTapError('次の動画はまだ見られません', event.clientX, event.clientY); return; }
  if (isAdFree()) { rewardAdClaimBtn.click(); return; } // 紋章（サブスク）加入中は動画なしで即受け取り
  playRewardedVideo(() => {
    rewardAdClaimBtn.textContent = `💎${REWARD_AD_GEMS} を受け取る`;
    rewardAdClaimBtn.style.display = 'block';
    rewardAdCloseBtn.style.display = 'none'; // 視聴完了後は受け取りのみ
  });
});
rewardAdClaimBtn.addEventListener('click', () => {
  if (getRewardAdRemaining() > 0) return; // 二重受け取り防止
  game.gems += REWARD_AD_GEMS;
  game.lastRewardAdAt = Date.now(); // 視聴完了から5分後に次を視聴可能
  rewardAdModal.classList.remove('show');
  playLoginBonusSound();
  showNotice(`🎬 動画視聴ボーナス 💎${REWARD_AD_GEMS} 獲得！`);
  updateRewardAdButtons();
  if (getActiveTab() === 'gemshop') renderRebirthShopList(); // 所持ジェムとMAX個数を更新
  updateStatsUI();
  saveGame();
});
document.getElementById('debugSlotList').addEventListener('click', e => handleDebugSlotClick(e)); // 関数は後のファイルで定義
document.getElementById('debugSlotCloseBtn').addEventListener('click', () => document.getElementById('debugSlotModal').classList.remove('show'));
rewardAdCloseBtn.addEventListener('click', () => {
  clearInterval(rewardAdTimer);
  rewardAdModal.classList.remove('show'); // 途中で閉じた場合は報酬なし・クールダウンなし
});

const gemShortModal = document.getElementById('gemShortModal');
const gemShortText = document.getElementById('gemShortText');
const gemShortGoBtn = document.getElementById('gemShortGoBtn');
const gemShortCancelBtn = document.getElementById('gemShortCancelBtn');
const gemReturnBtn = document.getElementById('gemReturnBtn');
let gemShortPending = null;  // 確認中の { onLeave, returnTo }
let gemShortBtnTimer = null;
let gemShopReturn = null;    // ショップから戻る先 { fn, mustResume }
function promptGemShortage(needed, options = {}) {
  const lack = Math.max(1, Math.ceil(needed - game.gems));
  document.getElementById('gemShortTitle').textContent = options.title || 'ジェムが足りません';
  const gsIcon = document.getElementById('gemShortIcon');
  if (options.iconHtml) gsIcon.innerHTML = options.iconHtml; else gsIcon.textContent = options.icon || '💎'; // 絵文字は自動でアイコン画像に置き換わる（iconHtml は絵をそのまま出す）
  gemShortText.textContent = options.text || `ジェムが ${lack} 個不足しています。ジェム購入ショップに行きますか？`;
  gemShortPending = options;
  if (options.silent) playTone(880, 0.08, 'triangle', 0.1); else playErrorSound();
  clearTimeout(gemShortBtnTimer);
  [gemShortGoBtn, gemShortCancelBtn].forEach(btn => { btn.style.visibility = 'visible'; }); // ボタンはすぐ表示
  gemShortModal.classList.add('show');
}
function runGemShopReturn() {
  const ret = gemShopReturn;
  gemShopReturn = null;
  gemReturnBtn.style.display = 'none';
  if (ret) ret.fn();
}
gemShortGoBtn.addEventListener('click', () => {
  const opts = gemShortPending || {};
  gemShortPending = null;
  gemShortModal.classList.remove('show');
  if (opts.onLeave) opts.onLeave();
  [stageSkipModal, skipRetryModal].forEach(m => m.classList.remove('show'));
  gemShopReturn = opts.returnTo ? { fn: opts.returnTo, mustResume: !!opts.mustResume } : null;
  gemReturnBtn.style.display = gemShopReturn ? 'flex' : 'none';
  switchTab('gemshop'); showShopTab('charge');
  document.getElementById('supergemSection').scrollIntoView({ behavior: 'smooth', block: 'center' });
});
gemShortCancelBtn.addEventListener('click', () => {
  const opts = gemShortPending || {};
  gemShortPending = null;
  gemShortModal.classList.remove('show');
  if (opts.onCancel) opts.onCancel();
});
gemReturnBtn.addEventListener('click', runGemShopReturn);
function promptGemShop(options = {}) {
  promptGemShortage(0, { title: 'ジェム購入ショップ', text: `所持ジェム 💎${Math.floor(game.gems).toLocaleString('ja-JP')}\nジェム購入ショップに行きますか？`, silent: true, ...options });
}
document.querySelector('.th-item.gem').addEventListener('click', () => promptGemShop());

document.querySelectorAll('[data-rank-mode]').forEach(btn => btn.addEventListener('click', () => {
  rankingMode = btn.dataset.rankMode;
  document.querySelectorAll('[data-rank-mode]').forEach(x => x.classList.toggle('active', x === btn));
  renderRanking();
}));
rankPrevDayBtn.addEventListener('click', () => {
  rankingDateOffset -= 1;
  renderRanking();
});
rankNextDayBtn.addEventListener('click', () => {
  if (rankingDateOffset >= 0) return;
  rankingDateOffset += 1;
  renderRanking();
});

let settingsPausedPhase = null; // 設定画面を開いている間はゲームを一時停止
settingsBtn.addEventListener('click', () => { if (!settingsModal.classList.contains('show')) { settingsPausedPhase = phase === 'battle' ? 'battle' : null; if (settingsPausedPhase) phase = 'paused'; } settingsModal.classList.add('show'); renderShopkeeper('settings'); if (typeof refreshBgm === 'function') refreshBgm(); });
function closeSettingsModal() { settingsModal.classList.remove('show'); if (settingsPausedPhase && phase === 'paused') phase = settingsPausedPhase; settingsPausedPhase = null; if (typeof refreshBgm === 'function') refreshBgm(); }
settingsCloseBtn.addEventListener('click', closeSettingsModal);
settingsModal.addEventListener('click', event => { if (event.target === settingsModal) closeSettingsModal(); });

bgmVolRange.addEventListener('input', () => {
  game.bgmVolume = Number(bgmVolRange.value) / 100;
  bgmVolVal.textContent = bgmVolRange.value + '%';
  saveGame();
});
sfxVolRange.addEventListener('input', () => {
  game.sfxVolume = Number(sfxVolRange.value) / 100;
  sfxVolVal.textContent = sfxVolRange.value + '%';
  saveGame();
});

function renderVibrationSetting() {
  vibrationState.textContent = game.vibration === false ? 'OFF' : 'ON';
  vibrationBtn.classList.toggle('active', game.vibration !== false);
}
vibrationBtn.addEventListener('click', () => {
  game.vibration = game.vibration === false;
  renderVibrationSetting();
  if (game.vibration) vibrate(40); // ONにしたときの確認用
  saveGame();
});
function vibrate(pattern) {
  if (game.vibration === false) return;
  try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (err) { /* 非対応環境では無視 */ }
}

const HOW_TO_PLAY_TEXT_JA = '・円の中を自機（青）と敵が反射しながら自動で戦います。\n・サークルをタップするたびに、自機が敵に向かって加速し、次に敵にぶつかったときのダメージも上がります（1タップ+25%、最大+200%。ぶつかると元に戻ります）。\n・ショップでタックルを開放すると、サークルを長押ししてから離して敵を追尾する強力な体当たり（タメ打ち）を放てます。長く押すほど強力で、自機が壁で跳ねた瞬間に離すと「壁蹴り」で威力2倍（超タックルも開放可能）。\n・ぶつかると自機と敵が同時に攻撃し合います。\n・遺物「反射のコンパス」を持っていると、壁に反射するたびにコインを獲得します。\n・敵を倒すとコインを獲得し、強化タブで自機を強化できます。\n・10ステージごとに強力なボスが出現します。\n・力尽きると転生し、コイン・強化・仲間・ステージはリセットされますが、ランダムでアーティファクトを獲得できます。\n・強化／ショップ／仲間／ガチャなど各タブで戦力を強化していきましょう。';
const HOW_TO_PLAY_TEXT_EN = 'Your ball (blue) and the enemy automatically fight by bouncing inside the circle.\nEach tap in the arena sends your ball toward the enemy and speeds it up (the speed resets when it hits an enemy).\nAfter unlocking Tackle in the rebirth shop, press and hold the arena, then release to launch a powerful homing tackle. The longer you hold, the stronger it gets (Super Tackle can also be unlocked).\nOn collision, you and the enemy attack each other at the same time.\nWith the Reflection Compass relic, each wall bounce gives a small amount of coins.\nDefeating enemies grants coins you can spend on upgrades.\nA powerful boss appears every 10 stages.\nWhen you fall, you reincarnate: coins, upgrades, allies and stage reset, but you gain a random artifact.\nStrengthen yourself using the Upgrade / Shop / Allies / Gacha tabs.';
const CONTACT_TEXT_JA = 'ご意見・不具合報告などは下記メールアドレスまでお気軽にご連絡ください。\n\n📧 hisashi.app@gmail.com';
const CONTACT_TEXT_EN = 'For feedback or bug reports, please feel free to contact us at the email address below.\n\n📧 hisashi.app@gmail.com';
const TERMS_TEXT_JA = '本アプリは無料でお楽しみいただけるブラウザゲームです。\n\n・本アプリの利用により生じたいかなる損害についても、開発者は責任を負いません。\n・ゲーム内のデータ（コイン・ジェム等）は現実の金銭的価値を持ちません。\n・不具合やバランス調整のため、予告なくゲーム内容を変更する場合があります。\n・本アプリの複製・改変・再配布は禁止します。\n・反社会的・迷惑行為（不正なデータ改ざん等）が確認された場合、利用をお断りする場合があります。\n\n本アプリを利用することで、これらの事項に同意したものとみなします。';
const TERMS_TEXT_EN = 'This app is a free browser game.\n\n・The developer is not responsible for any damages arising from the use of this app.\n・In-game data (coins, gems, etc.) has no real-world monetary value.\n・Game content may change without notice for bug fixes or balance adjustments.\n・Copying, modifying, or redistributing this app is prohibited.\n・Access may be restricted if anti-social or disruptive behavior (such as data tampering) is confirmed.\n\nBy using this app, you are considered to have agreed to these terms.';
const PRIVACY_TEXT_JA = '本アプリのプライバシーポリシーです。\n\n・本アプリはブラウザのローカルストレージにのみゲーム進行データを保存します。\n・氏名・メールアドレス等、個人を特定できる情報を収集することはありません。\n・お問い合わせでいただいたメールアドレスは、返信目的以外には使用しません。\n・第三者への情報提供は行いません。\n\nご不明な点はお問い合わせ窓口までご連絡ください。';
const PRIVACY_TEXT_EN = 'Privacy Policy for this app.\n\n・This app only saves game progress data in your browser\'s local storage.\n・We do not collect personally identifiable information such as your name or email address.\n・Any email address provided via contact will only be used to respond to your inquiry.\n・We do not share information with third parties.\n\nPlease contact us if you have any questions.';

const I18N = {
  ja: {
    tabGame: 'ゲーム', tabUpgrade: '強化', tabCompanion: '仲間', tabShop: 'スキル', tabArtifact: '遺物', tabGem: 'ショップ', tabGacha: '進化', tabRecords: '戦績', tabRanking: 'ランキング',
    settingsTitle: '設定', settingsSub: '音量やヘルプの設定です',
    bgmLabel: '🎵 BGM音量　', sfxLabel: '🔊 効果音音量　', vibrationLabel: '📳 振動（対応スマホのみ）',
    howToPlayBtn: '📖 遊び方', contactBtn: '✉️ お問い合わせ', termsBtn: '📜 利用規約', privacyBtn: '🔒 プライバシーポリシー',
    langLabel: '🌐 言語 / Language', devLabel: '👤 開発者', closeBtn: '閉じる',
    contactRow: 'お問い合わせ: <a href="mailto:hisashi.app@gmail.com" style="color:#7ed0ff;">hisashi.app@gmail.com</a>',
    howToPlayText: HOW_TO_PLAY_TEXT_JA, contactText: CONTACT_TEXT_JA, termsText: TERMS_TEXT_JA, privacyText: PRIVACY_TEXT_JA,
  },
  en: {
    tabGame: 'Game', tabUpgrade: 'Upgrade', tabCompanion: 'Allies', tabShop: 'Skills', tabArtifact: 'Relics', tabGem: 'Shop', tabGacha: 'Evolve', tabRecords: 'Records', tabRanking: 'Ranking',
    settingsTitle: 'Settings', settingsSub: 'Volume and help settings',
    bgmLabel: '🎵 BGM Volume　', sfxLabel: '🔊 SFX Volume　', vibrationLabel: '📳 Vibration (supported phones only)',
    howToPlayBtn: '📖 How to Play', contactBtn: '✉️ Contact', termsBtn: '📜 Terms of Service', privacyBtn: '🔒 Privacy Policy',
    langLabel: '🌐 言語 / Language', devLabel: '👤 Developer', closeBtn: 'Close',
    contactRow: 'Contact: <a href="mailto:hisashi.app@gmail.com" style="color:#7ed0ff;">hisashi.app@gmail.com</a>',
    howToPlayText: HOW_TO_PLAY_TEXT_EN, contactText: CONTACT_TEXT_EN, termsText: TERMS_TEXT_EN, privacyText: PRIVACY_TEXT_EN,
  }
};
let currentLang = 'ja'; // 実際の値はloadGame()後に反映
function applyLanguage(lang) {
  currentLang = (I18N[lang] ? lang : 'ja');
  game.language = currentLang;
  document.documentElement.lang = currentLang;
  const dict = I18N[currentLang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (!dict[key]) return;
    if (key === 'contactRow') el.innerHTML = dict[key];
    else el.textContent = dict[key];
  });
  langJaBtn.classList.toggle('active', currentLang === 'ja');
  langEnBtn.classList.toggle('active', currentLang === 'en');
  saveGame();
}
langJaBtn.addEventListener('click', () => applyLanguage('ja'));
langEnBtn.addEventListener('click', () => applyLanguage('en'));

howToPlayBtn.addEventListener('click', () => {
  infoModalTitle.textContent = I18N[currentLang].howToPlayBtn;
  infoModalBody.textContent = I18N[currentLang].howToPlayText;
  infoModal.classList.add('show');
});
contactBtn.addEventListener('click', () => {
  infoModalTitle.textContent = I18N[currentLang].contactBtn;
  infoModalBody.textContent = I18N[currentLang].contactText;
  infoModal.classList.add('show');
});
termsBtn.addEventListener('click', () => {
  infoModalTitle.textContent = I18N[currentLang].termsBtn;
  infoModalBody.textContent = I18N[currentLang].termsText;
  infoModal.classList.add('show');
});
privacyBtn.addEventListener('click', () => {
  infoModalTitle.textContent = I18N[currentLang].privacyBtn;
  infoModalBody.textContent = I18N[currentLang].privacyText;
  infoModal.classList.add('show');
});
const GAME_TITLE = '放置系ハクスラ無限反射';
const GAME_VERSION = '1.0.0';
const DEVELOPER_NAME = 'ひさしApp（HisashiApp）';
document.getElementById('settingsGameVersion').textContent = `Ver. ${GAME_VERSION}　©ひさしApp`;
const CREDITS = [
  ['企画・ゲームデザイン', DEVELOPER_NAME],
  ['プログラム', DEVELOPER_NAME],
  ['グラフィック・ドット絵', DEVELOPER_NAME],
  ['サウンド（BGM・効果音）', DEVELOPER_NAME],
  ['バランス調整', DEVELOPER_NAME],
  ['テストプレイ', DEVELOPER_NAME],
  ['スペシャルサンクス', 'プレイしてくれたあなた'],
  ['開発・運営', DEVELOPER_NAME],
];
const creditsModal = document.getElementById('creditsModal');
document.getElementById('creditsBtn').addEventListener('click', () => {
  const roll = document.getElementById('creditsRoll');
  roll.innerHTML = `<div class="cr-title">${GAME_TITLE}</div><div class="cr-role">STAFF</div>`
    + CREDITS.map(([role, name]) => `<div class="cr-role">${role}</div><div class="cr-name">${name}</div>`).join('')
    + `<div class="cr-end">Thank you for playing!</div><img class="cr-logo" src="assets/img/ui/hisashiApp.webp" alt=""><div class="cr-role">© ${new Date().getFullYear()} ${DEVELOPER_NAME}</div>`;
  roll.style.animation = 'none'; void roll.offsetWidth; roll.style.animation = '';
  creditsModal.classList.add('show');
  ensureAudio(); refreshBgm();
});
function closeCredits() { creditsModal.classList.remove('show'); refreshBgm(); }
document.getElementById('creditsCloseBtn').addEventListener('click', closeCredits);
function setCreditsSpeed(rate) { document.getElementById('creditsRoll').getAnimations().forEach(a => a.playbackRate = rate); } // 押しっぱなしで早送り
creditsModal.addEventListener('pointerdown', event => { if (!event.target.closest('.credits-close')) setCreditsSpeed(6); });
['pointerup', 'pointercancel', 'pointerleave'].forEach(t => creditsModal.addEventListener(t, () => setCreditsSpeed(1)));
document.getElementById('creditsRoll').addEventListener('animationend', closeCredits);
const FAQ_LIST = [
  ['セーブデータはどこに保存されますか？', 'プレイ中のデータは、お使いのブラウザ（端末）の中に自動で保存されます。\nブラウザの履歴・キャッシュ・サイトデータを削除したり、シークレットモードで遊んだりすると、データが消えることがあります。'],
  ['機種変更・別の端末に引き継げますか？', '現在、データの引き継ぎ機能はありません。同じ端末・同じブラウザで遊んでください。'],
  ['音が鳴りません', 'ブラウザの仕組みにより、最初に画面をタップするまで音は鳴りません。\nそれでも鳴らない場合は、端末のマナーモードや音量、設定のBGM・効果音の音量を確認してください。'],
  ['転生すると何がなくなりますか？', 'コイン・強化・スキル・仲間・ステージは最初に戻ります。\n遺物・ジェム・回復ポーション・スキル枠・パーティ枠・サブスクは引き継がれます。転生するたびに遺物がもらえて、次の周回が楽になります。'],
  ['ジェムはどうやって手に入れますか？', 'ボス撃破、転生、帰還ボーナス、動画視聴、メタルスライムの撃破などで手に入ります。ショップで購入することもできます。'],
  ['ゲームが重い・カクカクします', 'ほかのアプリやタブを閉じてみてください。仲間や敵が多い場面では処理が重くなることがあります。'],
  ['購入したアイテムが反映されません', 'いったんゲーム画面を再読み込みしてください。それでも反映されない場合は、お問い合わせからご連絡ください。'],
  ['不具合を見つけました', '設定の「お問い合わせ」から、発生した画面や手順をお知らせいただけると助かります。'],
];
document.getElementById('faqBtn').addEventListener('click', () => {
  infoModalTitle.textContent = '❓ よくある質問';
  infoModalBody.innerHTML = FAQ_LIST.map(([q, a]) => `<details class="faq-item"><summary>Q. ${q}</summary><div>A. ${a}</div></details>`).join('');
  infoModal.classList.add('show');
});
const FUNDS_ACT_ROWS = [
  ['発行者の名称', DEVELOPER_NAME],
  ['前払式支払手段の名称', 'ジェム（有償で購入したもの）'],
  ['支払可能金額等', '上限なし（購入画面に表示された数量）'],
  ['有効期間', '有効期間の定めはありません（サービス終了時を除く）'],
  ['使用できる場所', '本ゲーム内（ショップ等）'],
  ['利用上の注意', '購入後の払い戻しはできません。ただし、法令に定める場合（サービスの終了など）はこの限りではありません。'],
  ['未使用残高の確認方法', 'ゲーム画面上部のジェム表示、またはショップの画面で確認できます。'],
  ['所在地', '請求があった場合には遅滞なく開示いたします。'],
  ['お問い合わせ窓口', 'hisashi.app@gmail.com（設定の「お問い合わせ」）'],
  ['利用規約', '設定の「利用規約」をご確認ください。'],
];
document.getElementById('fundsActBtn').addEventListener('click', () => {
  infoModalTitle.textContent = '💴 資金決済法に基づく表示';
  infoModalBody.innerHTML = `<table class="funds-table">${FUNDS_ACT_ROWS.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join('')}</table>`;
  infoModal.classList.add('show');
});
infoModalCloseBtn.addEventListener('click', () => { infoModal.classList.remove('show'); });
infoModal.addEventListener('click', event => { if (event.target === infoModal) infoModal.classList.remove('show'); });

const ICON_IMAGES = {"x_gb1":"assets/img/icons/x_gb1.webp","x_gb2":"assets/img/icons/x_gb2.webp","x_gb3":"assets/img/icons/x_gb3.webp","x_gb4":"assets/img/icons/x_gb4.webp","x_emb_hero":"assets/img/icons/x_emb_hero.webp","x_emb_vet":"assets/img/icons/x_emb_vet.webp","x_tower":"assets/img/icons/x_tower.webp","art_swordL":"assets/img/icons/art_swordL.webp","art_swordM":"assets/img/icons/art_swordM.webp","x_potion":"assets/img/icons/x_potion.webp","tab_game":"assets/img/icons/tab_game.webp","tab_upgrade":"assets/img/icons/tab_upgrade.webp","tab_companion":"assets/img/icons/tab_companion.webp","tab_coinshop":"assets/img/icons/tab_coinshop.webp","tab_artifact":"assets/img/icons/tab_artifact.webp","tab_gemshop":"assets/img/icons/tab_gemshop.webp","tab_gacha":"assets/img/icons/tab_gacha.webp","tab_records":"assets/img/icons/tab_records.webp","tab_ranking":"assets/img/icons/tab_ranking.webp","art_heart":"assets/img/icons/art_heart.webp","art_ring":"assets/img/icons/art_ring.webp","art_book":"assets/img/icons/art_book.webp","art_armor":"assets/img/icons/art_armor.webp","art_compass":"assets/img/icons/art_compass.webp","art_calendar":"assets/img/icons/art_calendar.webp","art_gauntlet":"assets/img/icons/art_gauntlet.webp","art_hourglass":"assets/img/icons/art_hourglass.webp","art_turbo":"assets/img/icons/art_turbo.webp","art_eye":"assets/img/icons/art_eye.webp","art_fang":"assets/img/icons/art_fang.webp","art_lens":"assets/img/icons/art_lens.webp","art_feather":"assets/img/icons/art_feather.webp","art_crest":"assets/img/icons/art_crest.webp","art_gauntletCounter":"assets/img/icons/art_gauntletCounter.webp","art_banner":"assets/img/icons/art_banner.webp","art_amulet":"assets/img/icons/art_amulet.webp","art_pinchMask":"assets/img/icons/art_pinchMask.webp","art_rebirthOrb":"assets/img/icons/art_rebirthOrb.webp","sk_skillSpecial":"assets/img/icons/sk_skillSpecial.webp","sk_skillAccel":"assets/img/icons/sk_skillAccel.webp","sk_skillHeal":"assets/img/icons/sk_skillHeal.webp","sk_skillBarrier":"assets/img/icons/sk_skillBarrier.webp","sk_skillPoison":"assets/img/icons/sk_skillPoison.webp","sk_skillParalyze":"assets/img/icons/sk_skillParalyze.webp","sk_skillAtkUp":"assets/img/icons/sk_skillAtkUp.webp","sk_skillRegen":"assets/img/icons/sk_skillRegen.webp","sk_skillSilence":"assets/img/icons/sk_skillSilence.webp","sk_skillDeath":"assets/img/icons/sk_skillDeath.webp","sk_skillCoinStrike":"assets/img/icons/sk_skillCoinStrike.webp","sk_skillZeni":"assets/img/icons/sk_skillZeni.webp","sk_skillMystery":"assets/img/icons/sk_skillMystery.webp","sk_skillCompRush":"assets/img/icons/sk_skillCompRush.webp","sk_skillNova":"assets/img/icons/sk_skillNova.webp","sk_skillBlast":"assets/img/obstacles/bomb.webp","up_atk":"assets/img/icons/up_atk.webp","up_cAtk":"assets/img/icons/up_cAtk.webp","up_cSpd":"assets/img/icons/up_cSpd.webp","up_cHp":"assets/img/icons/up_cHp.webp","up_crit":"assets/img/icons/up_crit.webp","up_critDmg":"assets/img/icons/up_critDmg.webp","up_hp":"assets/img/icons/up_hp.webp","up_evasion":"assets/img/icons/up_evasion.webp","up_coin":"assets/img/icons/up_coin.webp","up_compAtk":"assets/img/icons/up_compAtk.webp","up_rush":"assets/img/icons/up_rush.webp","g_power":"assets/img/icons/g_power.webp","g_vitality":"assets/img/icons/g_vitality.webp","g_fortune":"assets/img/icons/g_fortune.webp","g_meteor":"assets/img/icons/g_meteor.webp","g_chain":"assets/img/icons/g_chain.webp","g_critical":"assets/img/icons/g_critical.webp","g_critdmg":"assets/img/icons/g_critdmg.webp","g_aim":"assets/img/icons/g_aim.webp","g_evade":"assets/img/icons/g_evade.webp","g_slayer":"assets/img/icons/g_slayer.webp","g_counter":"assets/img/icons/g_counter.webp","g_bond":"assets/img/icons/g_bond.webp","g_pinch":"assets/img/icons/g_pinch.webp","g_guard":"assets/img/icons/g_guard.webp","g_phoenix":"assets/img/icons/g_phoenix.webp","x_reborn":"assets/img/icons/x_reborn.webp","x_book":"assets/img/icons/x_book.webp","x_gem":"assets/img/icons/x_gem.svg","x_settings":"assets/img/icons/x_settings.webp","x_chest1":"assets/img/icons/x_chest1.webp","x_chest2":"assets/img/icons/x_chest2.webp","x_chest4":"assets/img/icons/x_chest4.webp","x_chest6":"assets/img/icons/x_chest6.webp","x_heart":"assets/img/icons/x_heart.webp","x_break":"assets/img/icons/x_break.webp","x_present":"assets/img/icons/x_present.webp","x_attack":"assets/img/icons/x_attack.webp","x_up_attack":"assets/img/icons/x_up_attack.webp","x_up_defense":"assets/img/icons/x_up_defense.webp","x_up_coin":"assets/img/icons/x_up_coin.webp","x_up_companion":"assets/img/icons/x_up_companion.webp","x_lock":"assets/img/icons/x_lock.webp"};
const COIN_IMG_SRC = 'data:image/webp;base64,UklGRsoHAABXRUJQVlA4WAoAAAAQAAAAPwAAPwAAQUxQSLcCAAABoLVtmyFJVv9GfDEza9u2bdu2jSPbtr17ZvvItm3bY9SHd1mIiIgJQD9TyQBm2/KM+978fvjo4T+8/cAZm80EQDKqTAJg0aOf+IPd//LQPjMAIhUIMNFOjzvJMPMIRrhZkPz9miWAJGkwSVD2/5CkWrD7MCP1rnUAyCAE2PQN0izYz1CSz+46DCn3rWCa60lz9j0syPd3B6RPBat8RnMO1o18bDFIP5Jg3/FUDt6No/dDTj0lwUkMZ5VGXoqceik4hxqsNJQ3Q1J3BadSWXGHN6Kkbgr2p0ZN7PBslC4Ea4YFqw7l1pD/yXnab8JZufvvs+f8X4L7qKxeeS/kPwQ7UtmgcUMIgJSn/s69jTdyBiC4kMomjZtAkNOcoz0aiceRIbicykZD50XGzCMiWlEeg4IjaGzV+DRSebuh4J8zY4UItuvcBidSGzKejidpTd0723BGQ853NmGw4eC3x9HaGnlbW2TneXpbYz9mtDXq17aCPw5vy/nGH20ZH27u/K/acm73Cr2h4Pj5H6Q15HxDzm5K4wJsS2/IuS7mG8doxvnFsJReoTejPAMF51BbiejMj4yV6a0ob4Eg5TfDGnFfDIKCQ6ltKG+CAClN9XN4C+EjZk0ZgOAoagvKwyAAkPIkn4XXZ3w6S/oXBBtRq3MfPicy/ltwFbWyUG4Nwf8mGfYKta4Oj0JBlxmzfkOtqcPLUNC1YJEfqdWE8nKU1B0EC3/OTiXuvACS0KtglicZVoPSD4Ek9C6Qs53mg3Ljl+ujoK85YdVnSLcYgCt56/Qo6LcAO71E0tX740a+vzUg6H9OwHo3/UTS1XsIV5KfHz4xcsJABcDUm1/7BUm6efzb3ZwkXzpockAwcBEAE6914bvGrke/cNZyACShxiQFwJBlD77+kQ9+/OW3b157+Jwd5geQSkI/AQBWUDgg7AQAAPAVAJ0BKkAAQAA+PRqLQ6IhoRQKBqggA8S2AFqNgmML2b8d+h34K8C8kQYPsunFeJB0jfMB+vPq9+gn0AP6b/kus69ADyxf23+Dr9u/2k+AT9iP//GFjCG0mMCV5TS/Hv9GewX+q3V29En9ZjxyzA3XsPvSjfafkXLq3Nw1Q6v60o0cVNpwKm3l2PYoxWQJM8KqHD0YPNTY+eOHuATS9bnhc1jbOQ+HHs60RctWUcdH2cv6wpZoGAAA/v/xLP9k3T6Zb6WH9ZZbO1/+3s1i2v8YvYV9mjYHFf/zj/c8OKcChrZQM4yRdVodIbEnfvz26buGwBUP/i5T+XjW9suZan/i3lXOf98txeh03dq0p4cZ0jAOJSUTmUZmM92Ak/ETt51/9ZYSRz1TKmyn5U8bfosl8A60EBbeMLNL8NV+iCk/mum7F9Rm9WzbfKAEdHhx//y1JAHAPQT4APKLaaCV9NG53wTrbjwfKtyHHCxIFtw/qOx1+KQQpl1rK8syvjx+tZpKOQeyTVQXC6FSF1PvLO4htaLa0/dCdPqMmkQfh+Sbpd6dGeuCEzhlwA0eK7HTFKBvd8QiQ98LmcDHSG9eqrVxxpgyEXgdBAG+x3TKZO328kM23751mqvohq7i3uqliy676/rIBfcldrb11DxBAt1Zy7hd5NzN8ecvnIDXrOTfZLP76J56pDS+kiyQmttElFYAd0pzveZJFkp4j6udfYoyMGhr/8dNKBM1dgDm4c6S2373r9U/H298QUsQa1TWDocjIWbGvGjqqvo699l2hUU7I5Z7877Rc57C6Ri+YNl1tv9BG2fTdjp4Trzipx7QcBcEddlqF8fCMCSd6j2OX4NduMUWt/2zpkjZrJ1yL2z7h8JYVC5uENA8F9eWnAYgBTM5BmdktDDhILNSH6bJX9DA/8zOi+rHaxBQP6KHdNA0syPOXB1CsMgHHVI4v5h8g/LrKLZrVvgfX/8TEPDgH//hmJ+9e+kydHNGjIYqMpcBRPntFFXRgdacLk6nsFgF0Pe6PRsGMZQEKe59n5Xg2oVBufqmcG9Zp+cAlb61cMZ2zb+1zAl3QZ6SSakQB2CWbegDFLalfkBhJ/geAyakFaZqQTym7BpWxyfM7AZQfXjhEq7G6+bms10+Fzs99i+fIVfLtrMvLFWzTrTDAq3PLPHX2qZxua4NpMthVXmlEAoQbF6qMSYIt1GTutBmYr7n9GhOWByp2nuhJJ8p0ySoraXjsSx8mqapjOvH+vWUpPylALUBDp61PIBpz+WwY09zuvYa9noWmzeUQzvGgD2epdZMhCfqwqnIt5imbBf+Z1Fo6TnI/cjTqU7Vb+SJ9VacPVbpRiAfi77Jfm8ROd0/zMvZqJeY9cWdjwyPp+zoeBR9mITmf3spMR6wt01ZbR/fFTVGvngPsXDfANUZZPP5dUK72lMOckBiVBpd6TIB0gDx/wfFFbpNV7RNJrQznzvyfqsSET0mVHs4YkJrOJZ8dtvZMFkSz0ZbvM9bRs93Qaf+TNlMqKh5qb0WY4nQ0Sn5kCzQfAzns/s1OCVK2iKscq6hsPLXBtNdmrlk9KxLwAmtFnOXRbl/omgelUg8MGGPbgRTXI39IepVXEGkFC2qiL9xtK0IPtRPp7cVs19Q3sxMaJmUMvDlQ2H2uRrTxa6nCIRgiZl00/U27UUAAA=='; // コインのアイコン（ファイル数を増やさないよう埋め込み）
ICON_IMAGES.x_coin = COIN_IMG_SRC;
const COIN_ICO = '<i class="coin-ico"></i>'; // 文章の中のコインマーク
const COIN_IMG = new Image(); COIN_IMG.src = COIN_IMG_SRC; // ゲーム画面の「+◯ 🟡」用
function xi(key, cls = 'ico-img') { return ICON_IMAGES[key] ? `<img class="${cls}" src="${ICON_IMAGES[key]}" alt="">` : ''; }
function ico(obj) { return obj && obj.img ? `<img class="ico-img" src="${obj.img}" alt="">` : (obj ? obj.icon : ''); }
const ARTIFACT_ALL = [
  { id: 'heart',  icon: '🗡️', name: '闘志の剣・小',   desc: '攻撃力 +5%', rarity: 'common' },
  { id: 'swordM', icon: '🗡️', name: '闘志の剣・中',   desc: '攻撃力 +30%', rarity: 'rare' },
  { id: 'swordL', icon: '🗡️', name: '闘志の剣・大',   desc: '攻撃力 +150%', rarity: 'epic' },
  { id: 'ring',   icon: '💰', name: '黄金の指輪',     desc: 'コイン獲得 +30%', rarity: 'common' },
  { id: 'book',   icon: '📖', name: '賢者の書',       desc: '攻撃力 +10%・最大HP +10%', rarity: 'common' },
  { id: 'armor',  icon: '🛡️', name: '鉄壁の鎧',       desc: '最大HP +25%', rarity: 'common' },
  { id: 'evoFeather', icon: '🪽', name: '進化の羽', desc: '進化の素材。進化に使うと高いレア度が出やすくなる（使うと減る）', rarity: 'common' },
  { id: 'compass', icon: '🧭', name: '反射のコンパス', desc: '壁反射でコインを獲得（重複で増加）', rarity: 'rare' },
  { id: 'calendar', icon: '📅', name: '忠誠のカレンダー', desc: 'ログインボーナス +40%', rarity: 'rare' },
  { id: 'gauntlet', icon: '👊', name: '闘魂のガントレット', desc: 'メテオダメージ +60%', rarity: 'epic' },
  { id: 'hourglass', icon: '⏳', name: '刹那の砂時計', desc: 'メテオの待機時間 -20%（最大3個）', rarity: 'epic' },
  { id: 'turbo', icon: '🚀', name: '加速のブースター', desc: '加速中のダメージ +40%（最大3個）', rarity: 'epic' },
  { id: 'eye', icon: '🎯', name: '鷹の眼', desc: 'クリティカル率 +8%（最大6個）', rarity: 'legendary' },
  { id: 'fang', icon: '💥', name: '会心の牙', desc: 'クリティカルダメージ +80%（最大6個）', rarity: 'legendary' },
  { id: 'lens', icon: '🔭', name: '千里眼のレンズ', desc: '命中率 +3%（最大5個）', rarity: 'rare' },
  { id: 'feather', icon: '🪶', name: '風切りの羽', desc: '回避率 +3%（最大5個）', rarity: 'rare' },
  { id: 'crest', icon: '👑', name: '覇王の紋章', desc: 'ボスへのダメージ +40%（最大4個）', rarity: 'epic' },
  { id: 'gauntletCounter', icon: '🔄', name: '反撃の籠手', desc: 'カウンター率 +15%（最大4個）', rarity: 'epic' },
  { id: 'banner', icon: '🚩', name: '絆の軍旗', desc: '仲間の攻撃力 +40%（最大5個）', rarity: 'epic' },
  { id: 'amulet', icon: '🧿', name: '守護の護符', desc: '仲間の最大HP +40%（最大5個）', rarity: 'epic' },
  { id: 'pinchMask', icon: '👺', name: '背水の仮面', desc: 'HP30%以下のとき攻撃力 +60%（最大3個）', rarity: 'epic' },
  { id: 'rebirthOrb', icon: '🔮', name: '輪廻の宝珠', desc: '転生時にもらえるジェム +2（最大5個）', rarity: 'rare' },
  { id: 'pierceHoof', icon: '🐂', name: '吹っ飛ばしの蹄鉄', desc: '体当たりで敵をさらに遠くへ吹っ飛ばす（1個ごとに+25%・最大3個）', rarity: 'epic' },
  { id: 'swordX', icon: '⚔️', name: '闘志の剣・極', desc: '攻撃力 +400%', rarity: 'legendary' },
  { id: 'aegis', icon: '🛡️', name: '不壊の大盾', desc: '最大HP +400%', rarity: 'legendary' },
  { id: 'ragnarok', icon: '🌟', name: '神剣ラグナロク', desc: '攻撃力 +1500%', rarity: 'mythic' },
  { id: 'yggdrasil', icon: '🌳', name: '世界樹の雫', desc: '最大HP +1500%・コイン獲得 +300%', rarity: 'mythic' },
  { id: 'starCrown', icon: '👑', name: '星々の王冠', desc: '攻撃力・最大HP +800%・クリティカル率 +15%', rarity: 'mythic' },
];
const EARLY_REBIRTH_COUNT = 5; // この回数目までの転生報酬は攻撃力・HP系の遺物のみ
const EARLY_REBIRTH_ARTIFACTS = ['heart', 'book', 'armor']; // 闘志の剣・小・賢者の書・鉄壁の鎧
const ARTIFACT_STACK_LIMIT = { pierceHoof: 3, hourglass: 3, turbo: 3, eye: 6, fang: 6, lens: 5, feather: 5, crest: 4, gauntletCounter: 4, horn: 5, banner: 5, amulet: 5, pinchMask: 3, rebirthOrb: 5 };
const ARTIFACT_BY_ID = {};
ARTIFACT_ALL.forEach(a => ARTIFACT_BY_ID[a.id] = a);
const ARTIFACT_SHOWN = ['evoFeather']; // 一旦これ以外の遺物は隠す（入手・表示・効果なし。所持数はセーブに残す）
const isArtifactShown = id => ARTIFACT_SHOWN.includes(id);
const ARTIFACT_POOL = ARTIFACT_ALL.filter(a => isArtifactShown(a.id));

const RARITY_INFO = {
  common:    { label: 'コモン',     stars: 1, color: '#9aa0b4', needMult: 3 },
  rare:      { label: 'レア',       stars: 2, color: '#64e8ff', needMult: 2 },
  epic:      { label: 'エピック',   stars: 3, color: '#c792ea', needMult: 2 },
  legendary: { label: 'レジェンド', stars: 4, color: '#ffd76b', needMult: 1 },
  mythic:    { label: 'ミシック',   stars: 5, color: '#ff5cd6', needMult: 1 },
};
const RARITY_BG_ALPHA = { common: ['30', '10'], rare: ['44', '14'], epic: ['55', '18'], legendary: ['70', '22'], mythic: ['80', '2a'] };
function rarityBackground(rarity) {
  const c = RARITY_INFO[rarity].color;
  const [a1, a2] = RARITY_BG_ALPHA[rarity];
  return `linear-gradient(160deg, ${c}${a1}, ${c}${a2})`;
}
function rarityStars(rarity) { return '★'.repeat(RARITY_INFO[rarity].stars) + '☆'.repeat(5 - RARITY_INFO[rarity].stars); }
const GACHA_POOL = {
  power:    { icon: '⚔️', name: '闘気の欠片',   rarity: 'common',    desc: '攻撃力 +10%/Lv',        bonus: { atk: 0.10 },               weight: 26 },
  vitality: { icon: '❤️', name: '生命の欠片',   rarity: 'common',    desc: '最大HP +10%/Lv',        bonus: { hp: 0.10 },                weight: 26 },
  fortune:  { icon: '🍀', name: '幸運の欠片',   rarity: 'rare',      desc: 'コイン獲得 +15%/Lv',    bonus: { coin: 0.15 },              weight: 16 },
  meteor:   { icon: '☄️', name: '隕星の欠片',   rarity: 'epic',      desc: 'メテオダメージ +20%/Lv', bonus: { special: 0.20 },           weight: 9 },
  chain:    { icon: '🔗', name: '連鎖の欠片',   rarity: 'epic',      desc: '連鎖ダメージ +5%/Lv',   bonus: { combo: 0.05 },             weight: 4 },
  critical: { icon: '🎯', name: '会心の欠片',   rarity: 'epic',      desc: 'クリティカル率 +1%/Lv', bonus: { crit: 0.01 },              weight: 5 },
  critdmg:  { icon: '💥', name: '剛撃の欠片',   rarity: 'epic',      desc: 'クリティカルダメージ +10%/Lv', bonus: { critDmg: 0.10 },    weight: 5 },
  aim:      { icon: '🔍', name: '照準の欠片',   rarity: 'rare',      desc: '命中率 +1%/Lv',         bonus: { accuracy: 0.01 },          weight: 7 },
  evade:    { icon: '🍃', name: '幻影の欠片',   rarity: 'rare',      desc: '回避率 +1%/Lv',         bonus: { evasion: 0.01 },           weight: 7 },
  slayer:   { icon: '🗡️', name: '討伐の欠片',   rarity: 'epic',      desc: 'ボスへのダメージ +5%/Lv', bonus: { bossDmg: 0.05 },         weight: 5 },
  counter:  { icon: '🔁', name: '反撃の欠片',   rarity: 'rare',      desc: 'カウンター率 +2%/Lv',   bonus: { counter: 0.02 },           weight: 7 },
  bond:     { icon: '🤝', name: '絆の欠片',     rarity: 'rare',      desc: '仲間の攻撃力 +10%/Lv',  bonus: { companionAtk: 0.10 },      weight: 7 },
  pinch:    { icon: '🩹', name: '背水の欠片',   rarity: 'rare',      desc: 'HP30%以下で攻撃力 +10%/Lv', bonus: { pinchAtk: 0.10 },   weight: 7 },
  guard:    { icon: '🫶', name: '守護の欠片',   rarity: 'rare',      desc: '仲間の最大HP +10%/Lv',  bonus: { companionHp: 0.10 },       weight: 7 },
  phoenix:  { icon: '🔥', name: '不死鳥の欠片', rarity: 'legendary', desc: '攻撃力+20%・HP+15%/Lv', bonus: { atk: 0.20, hp: 0.15 },      weight: 1 },
};
function pickGachaId() {
  const total = Object.values(GACHA_POOL).reduce((s, i) => s + i.weight, 0);
  let r = Math.random() * total;
  for (const id in GACHA_POOL) {
    r -= GACHA_POOL[id].weight;
    if (r <= 0) return id;
  }
  return Object.keys(GACHA_POOL)[0];
}
// ===== 進化：攻撃力かHPを選び、ジェムと進化の羽を捧げて進化。5段階のレア度で 1.1・1.2・1.5・2・3倍 が出て、進化率に掛け算される =====
const EVO_TIERS = [
  { rarity: 'common', mult: 1.1, base: 72 }, { rarity: 'rare', mult: 1.2, base: 20 }, { rarity: 'epic', mult: 1.5, base: 6.5 },
  { rarity: 'legendary', mult: 2, base: 1.35 }, { rarity: 'mythic', mult: 3, base: 0.15 },
];
const EVO_MIN_GEMS = 5, EVO_RATE_CAP = 1e150;
function getEvoRate(kind) { const v = Number(game.evoRate && game.evoRate[kind]) || 1; return Math.max(1, Math.min(EVO_RATE_CAP, v)); }
function getEvoBoost() { return 1; } // 旧仕様（進化の羽で効果アップ）は廃止
function evoLuck(gems, feathers) { return Math.max(0, Math.log2(Math.max(EVO_MIN_GEMS, gems) / EVO_MIN_GEMS)) * 0.35 + feathers * 0.3; } // ジェムを多く・羽を多く捧げるほど高レア度が出やすい
function evoOdds(gems, feathers) {
  const L = evoLuck(gems, feathers), w = EVO_TIERS.map((t, i) => t.base * Math.pow(1 + L, i * 1.2)), sum = w.reduce((a, b) => a + b, 0);
  return w.map(x => x / sum);
}
function rollEvoTier(gems, feathers) { const o = evoOdds(gems, feathers); let r = Math.random(); for (let i = 0; i < o.length; i++) { r -= o[i]; if (r < 0) return i; } return 0; }
function getEvolveNeed(id) {
  const level = game.evolutions[id];
  const mult = RARITY_INFO[GACHA_POOL[id].rarity].needMult;
  return (level + 1) * mult;
}

const UPGRADES = {
  atk: { icon: '⚔️', name: '攻撃力', desc: 'Lvが上がるほど伸びる', baseCost: 2, group: 'attack' },
  hp: { icon: '❤️', name: '最大HP', desc: 'Lvが上がるほど伸びる', baseCost: 2, group: 'defense' },
  cAtk: { icon: '🚩', name: '仲間の攻撃力', desc: '+15%', baseCost: 3, group: 'companion' },
  cSpd: { icon: '💨', name: '仲間の攻撃頻度', desc: '+5%', baseCost: 4, group: 'companion' },
  cHp: { icon: '🧿', name: '仲間の最大HP', desc: '+20%', baseCost: 3, group: 'companion' },
};
const UPGRADE_LEAPS = [
  { every: 1000, mult: 1.5, name: '超大飛躍', color: '#ff5cd6' },
  { every: 100, mult: 1.2, name: '大飛躍', color: '#e08a00' },
  { every: 10, mult: 1.03, name: 'プチ飛躍', color: '#2a9d55' },
];
// そのレベルで到達済みの飛躍倍率。どの飛躍も「足し算で積み上がる倍率」をかけ合わせる（指数的に爆発して数値があふれないように）
// 例：初めての大飛躍で×1.5、2回目で×2.0、3回目で×2.5…（超大飛躍も×2→×3→×4…）
function upgradeLeapMult(level) {
  level = Math.max(0, Math.min(1e12, Number(level) || 0));
  const n1000 = Math.floor(level / 1000), n100 = Math.floor(level / 100) - n1000, n10 = Math.floor(level / 10) - Math.floor(level / 100);
  return (1 + 0.03 * n10) * (1 + 0.2 * n100) * (1 + 0.5 * n1000);
}
// 攻撃力・最大HPの強化：Lv^1.2 で伸びる（＋飛躍）。数値がなだらかに増えるように
const UPGRADE_POW = 1.2;
function upgradeLvMult(level) { level = Math.max(0, Number(level) || 0); return Math.pow(level + 1, UPGRADE_POW) * upgradeLeapMult(level); }
const NUM_CAP = 1e300; // これ以上は扱わない（Infinity・NaN でフリーズしないための安全柵）
function safeNum(v) { v = Number(v); return isFinite(v) ? Math.max(-NUM_CAP, Math.min(NUM_CAP, v)) : (v > 0 ? NUM_CAP : v < 0 ? -NUM_CAP : 0); }
// from→to のレベルアップで到達した最大の飛躍（なければ null）
function crossedUpgradeLeap(from, to) {
  return UPGRADE_LEAPS.find(l => Math.floor(to / l.every) > Math.floor(from / l.every)) || null;
}
function nextUpgradeLeap(level) {
  const target = (Math.floor(level / 10) + 1) * 10;
  return { target, leap: UPGRADE_LEAPS.find(l => target % l.every === 0) };
}
function newUpgradeLevels() { const o = {}; for (const id in UPGRADES) o[id] = 0; return o; }
function getUpgradeLevelCap(id) { return UPGRADES[id].max || Infinity; }
const SHOP_ITEMS = {
  sword: { icon: '🗡️', name: '星砕きの剣', desc: '攻撃力 +25%', cost: 8 },
  shield: { icon: '🛡️', name: '月光の盾', desc: '最大HP +25%', cost: 8 },
  meteor: { icon: '<span class="ico-flipv">☄️</span>', name: '流星術', desc: 'メテオダメージ 2倍', cost: 12 }, // 絵文字のほうき星は上向きなので上下反転して落ちてくる向きに
  fairy: { icon: '🧚', name: 'コイン妖精', desc: 'コイン獲得 +30%', cost: 10 },
  summoner: { icon: '🪄', name: '召喚の指輪', desc: '分身上限 +2', cost: 10 },
};
const TACKLE_PIERCE_MS_PER_LV = 100;
function getTacklePierceMs() { return (game.tacklePierceLv || 0) * TACKLE_PIERCE_MS_PER_LV; }
SHOP_ITEMS.autoUpgrade = { icon: '🤖', name: 'オート強化', desc: 'たまったコインで攻撃力・最大HPを自動で上げる（仲間ページの自キャラ強化でON/OFF）', cost: 20, unlockKey: 'autoUpgradeUnlocked' };
SHOP_ITEMS.upPct = { icon: '📈', name: '10%まとめ強化', desc: '手持ちコインの10%ぶん一気にLvアップする「10%」ボタンが使えるように（自キャラ・仲間。転生しても残る）', cost: 10, unlockKey: 'upPctUnlocked' };
SHOP_ITEMS.upMax = { icon: '⏫', name: 'MAXまとめ強化', desc: '買えるだけ一気にLvアップする「MAX」ボタンが使えるように（自キャラ・仲間。転生しても残る）', cost: 15, unlockKey: 'upMaxUnlocked' };
// 10%・MAXボタンはショップで買うと使える。買う前は🔒つきで、押すとショップのその商品へ
function bulkUpLocked(isPct) { return !game[isPct ? 'upPctUnlocked' : 'upMaxUnlocked']; }
function bulkUpLockedBtn(isPct) { return `${isPct ? '10%' : 'MAX'}<span>🔒</span>`; }
function goShopItem(id, msg) { switchTab('gemshop'); showShopTab('item'); const it = document.querySelector(`[data-shop="${id}"]`); if (it) it.scrollIntoView({ block: 'center' }); if (msg) showNotice(msg); }
function openBulkUpShop(isPct) { // いきなりショップへ飛ばさず、まず何のボタンかを説明する
  const id = isPct ? 'upPct' : 'upMax', item = SHOP_ITEMS[id];
  simpleChoice({ icon: item.icon, title: item.name,
    text: isPct ? '手持ちコインの<b>10%ぶん</b>で、一気に何Lvも上げられるボタンです。' : 'コインで<b>買えるだけ</b>、一気にLvを上げられるボタンです。',
    sub: `ショップで <b>💎${item.cost}</b> で購入すると、自キャラと仲間の強化で使えるようになります（転生しても残ります）。`,
    yes: '🛒 ショップで見る', no: 'あとで', onYes: () => goShopItem(id) });
}
function simpleChoice(o) { // 軽い2択ダイアログ
  const ov = document.createElement('div'); ov.className = 'modal-overlay show'; ov.style.zIndex = 80;
  ov.innerHTML = `<div class="modal-panel sc-panel"><div class="sc-icon">${o.icon || ''}</div><div class="sc-title">${o.title}</div><div class="sc-text">${o.text}</div>${o.sub ? `<div class="sc-sub">${o.sub}</div>` : ''}<div class="sc-btns"><button class="modal-close-btn sc-yes">${o.yes || 'OK'}</button><button class="modal-shop-btn sc-no">${o.no || 'キャンセル'}</button></div></div>`;
  document.body.appendChild(ov);
  const close = () => ov.remove();
  ov.querySelector('.sc-no').addEventListener('click', close);
  ov.querySelector('.sc-yes').addEventListener('click', () => { close(); if (o.onYes) o.onYes(); });
  ov.addEventListener('click', e => { if (e.target === ov) close(); });
  playTone(880, 0.08, 'triangle', 0.08);
}
SHOP_ITEMS.potion = { icon: '🧪', name: '回復ポーション ×3', desc: 'HPを最大値の45%回復（ゲーム画面のボタンで使用）。1回で3個手に入る', cost: 1, consumableKey: 'potions', bundle: 3 };
SHOP_ITEMS.redPotion = { icon: '<i class="ico-redpot"></i>', name: 'スキル全快ポーション ×3', desc: 'すべてのスキルの待ち時間を一瞬でリセット（ゲーム画面のスキル列の左端で使用）。1回で3個手に入る', cost: 1, consumableKey: 'redPotions', bundle: 3 };
SHOP_ITEMS.hireTicket = { icon: '🎫', name: 'ピックアップ採用券', desc: '★4・★5の仲間を1人、転生・ステージの条件なしで採用できるように（ショップの仲間タブで未解放の仲間を押して使う）', cost: 300, consumableKey: 'hireTickets' };
SHOP_ITEMS.partySlot = { icon: '🐾', name: 'パーティ枠 +1', desc: '一緒に戦える仲間の人数が1人増える（転生しても残る）', slot: { label: 'パーティ枠', unit: '人', cur: () => getPartyLimit(), max: () => COMPANION_PARTY_MAX, cost: () => getPartySlotCost(), buy: () => { game.companionSlots = getPartyLimit() + 1; renderCompanionList(); } } };
SHOP_ITEMS.skillSlot = { icon: '🎒', name: 'スキル枠 +1', desc: '装備できるスキルが1つ増える', slot: { label: 'スキル枠', unit: '枠', cur: () => getSkillSlots(), max: () => SKILL_SLOT_MAX, cost: () => getSkillSlotCost(), buy: () => { game.skillSlots = getSkillSlots() + 1; renderCoinShopList(); } } };
SHOP_ITEMS.weaponSlot = { icon: '⚔️', name: 'サブウェポン枠 +1', desc: '装備できるサブウェポンが1つ増える', slot: { label: 'サブウェポン枠', unit: '枠', cur: () => getWeaponSlots(), max: () => WEAPON_SLOT_MAX, cost: () => getWeaponSlotCost(), buy: () => { game.weaponSlots = getWeaponSlots() + 1; renderCoinShopList(); } } };
const POTION_HEAL_RATIO = 0.45;
function isShopItemOwned(id) {
  const item = SHOP_ITEMS[id];
  if (item.slot) return item.slot.cur() >= item.slot.max(); // 枠増やしは最大まで買えば売り切れ
  if (item.action) return false;
  if (item.consumableKey) return false; // 消費アイテムは何個でも買える
  if (item.stackKey) return (game[item.stackKey] || 0) >= item.maxStack; // 重ねがけ系は上限まで買えば「所持済み」
  return item.unlockKey ? !!game[item.unlockKey] : !!game.shopOwned[id];
}
function getShopItemGemCost(id) { const item = SHOP_ITEMS[id]; return item.slot ? item.slot.cost() : gemPrice(getShopItemBaseCost(id)); }
function getShopItemBaseCost(id) { const item = SHOP_ITEMS[id]; return item.stackKey ? item.cost * ((game[item.stackKey] || 0) + 1) : item.cost; }
const COIN_SHOP_ITEMS = {
  cloneSlot: { icon: '👥', name: '増員指令', desc: '分身上限 +1', cost: 45 }
};
const SKILL_GACHA_SKILLS = {
  skillSpecial:  { icon: '☄️', name: 'メテオ',   desc: '隕石を落として大ダメージ' },
  skillAccel:    { icon: '⏩', name: '加速',     desc: 'しばらく2.5倍速' },
  skillHeal:     { icon: '💗', name: '回復',     desc: 'HPを回復' },
  skillPoison:   { icon: '☠️', name: '毒',       desc: '当てた敵を毒状態に' },
  skillParalyze: { icon: '⚡', name: '麻痺',     desc: '雷で敵を麻痺させる' },
  skillAtkUp:    { icon: '💪', name: '攻撃UP',   desc: '取得したら転生まで常に攻撃力1.5倍（セット不要）' },
  skillDeath:    { icon: '💀', name: '即死魔法', desc: '一定確率で敵を即死させる（ボスには効きにくい）' },
  skillCoinStrike:{ icon: '🪙', name: 'コイン攻撃', desc: '20秒間 敵めがけてコインを投げまくる（当たるとコイン獲得）・討伐コイン1.5倍' },
  skillZeni:     { icon: '💰', name: 'ゼニ投げ', desc: '手持ちコインの半分を投げて大ダメージ' },
  skillMystery:  { icon: '❓', name: '謎魔法',   desc: '何が起きるかわからない' },
  skillCompRush: { icon: '🐾', name: '仲間特攻', desc: '仲間全員が敵に突撃して大ダメージ' },
  skillBlast:    { icon: '💣', name: '大爆発', desc: '画面全体を吹き飛ばす大爆発！敵すべてに超特大ダメージ（待機長め）' }
};
const REMOVED_SKILLS = ['skillBarrier', 'skillSilence', 'skillNova', 'skillRegen']; // 削除したスキル（古いセーブからも外す）
const SKILL_MAX_LEVEL = 9999; // インフレ放置ゲー寄り：上限は実質なし
const SKILL_CD_CUT_PER_LV = 0.06; // Lv1つごとに待機時間 -6%（Lv10で -54%）
const SKILL_GACHA_BASE_COST = 10, SKILL_GACHA_COST_GROWTH = 1.15; // 1回ごとに値上げ（転生でリセット）
function getSkillLevel(id) {
  if (!game.shopOwned[id]) return 0;
  return Math.max(1, Math.min(SKILL_MAX_LEVEL, (game.skillLevels && game.skillLevels[id]) || 1));
}
// 待機時間：Lv10までは -6%ずつ（Lv10で -54%）、その先はゆるやかに減って最大 -85%
function skillCdCut(lv) { return lv <= 10 ? SKILL_CD_CUT_PER_LV * (lv - 1) : 0.54 + 0.31 * (1 - Math.pow(0.985, lv - 10)); }
function skillCd(id, base) { return Math.round(base * (1 - skillCdCut(Math.max(1, getSkillLevel(id))))); }
// スキルの威力：Lvごとに+10%、10Lvごとに飛躍（×1.5）、100Lvごとに超飛躍（×3）
function skillPower(id) {
  const lv = game.shopOwned && game.shopOwned[id] ? getSkillLevel(id) : 1;
  const n100 = Math.floor(lv / 100), n10 = Math.floor(lv / 10) - n100;
  return (1 + 0.1 * (lv - 1)) * Math.pow(1.5, n10) * Math.pow(3, n100);
}
function getSkillGachaCost() { return coinPrice(Math.round(SKILL_GACHA_BASE_COST * Math.pow(SKILL_GACHA_COST_GROWTH, game.skillGachaPulls || 0))); }
const WEAPON_GACHA_BASE_COST = 40, WEAPON_GACHA_COST_GROWTH = 1.15; // サブウェポンガチャも1回ごとに値上げ（転生でリセット）
function getWeaponGachaCost() { return coinPrice(Math.round(WEAPON_GACHA_BASE_COST * Math.pow(WEAPON_GACHA_COST_GROWTH, game.weaponGachaPulls || 0))); }
function getSkillGachaPool() { return Object.keys(SKILL_GACHA_SKILLS).filter(id => getSkillLevel(id) < SKILL_MAX_LEVEL); }
const SUPERGEM_SHOP_ITEMS = {
  small: { icon: '💎', name: 'ジェム小袋', desc: 'ジェム +20', cost: 198 },
  medium: { icon: '💎', name: 'ジェム中袋', desc: 'ジェム +110', cost: 980 },
  large: { icon: '💎', name: 'ジェム大袋', desc: 'ジェム +605', cost: 4800 },
  huge: { icon: '💎', name: 'ジェム超大袋', desc: 'ジェム +1331', cost: 9980 }
};
const SUBSCRIPTIONS = {
  hero: { emblem: 'x_emb_hero', icon: '👑', name: '伝説の勇者の紋章', desc: '広告オフ＆全能力3倍＆全ショップ半額', cost: 2980, statMult: 3, coinPriceMult: 0.5, gemPriceMult: 0.5, rank: 2 },
  veteran: { emblem: 'x_emb_vet', icon: '🎖️', name: '熟練者の紋章', desc: '広告オフ＆全能力2倍＆コイン系ショップ3割引', cost: 980, statMult: 2, coinPriceMult: 0.7, gemPriceMult: 1, rank: 1 },
};
const SUBSCRIPTION_DAYS = 30;
function isSubActive(id) { return !!(game.subscriptions && game.subscriptions[id] > Date.now()); }
function getActiveSub() { return isSubActive('hero') ? SUBSCRIPTIONS.hero : isSubActive('veteran') ? SUBSCRIPTIONS.veteran : null; }
function isAdFree() { return !!getActiveSub(); }
function getSubStatMult() { const s = getActiveSub(); return s ? s.statMult : 1; }
function coinPrice(cost) { const s = getActiveSub(); return s ? Math.max(1, Math.ceil(cost * s.coinPriceMult)) : cost; }
function gemPrice(cost) { const s = getActiveSub(); return s && s.gemPriceMult < 1 ? Math.max(1, Math.ceil(cost * s.gemPriceMult)) : cost; }
ARTIFACT_ALL.forEach(a => { a.img = ICON_IMAGES['art_' + a.id]; });
Object.keys(GACHA_POOL).forEach(id => { GACHA_POOL[id].img = ICON_IMAGES['g_' + id]; });
Object.keys(UPGRADES).forEach(id => { UPGRADES[id].img = ICON_IMAGES['up_' + id]; });
// 強化の仲間系3つのアイコン：仲間タブの絵＋それぞれの強化の絵（ファイル数を増やさないよう埋め込み）
 // 体当たりはタックルの絵 // 仲間の攻撃力は仲間タブと同じ絵
Object.keys(SKILL_GACHA_SKILLS).forEach(id => { SKILL_GACHA_SKILLS[id].img = ICON_IMAGES['sk_' + id]; });
const REBIRTH_ARTIFACT_COST = { common: 5, rare: 8, epic: 12, legendary: 40 }; // ★5（ミシック）は宝箱からしか出ない
const REBIRTH_SHOP_ITEMS = {};
ARTIFACT_POOL.forEach(a => {
  if (a.rarity === 'mythic') return;
  REBIRTH_SHOP_ITEMS[a.id] = { icon: a.icon, img: a.img, name: a.name, desc: a.desc.replace(/（最大\d+個）/, '') + '（永続）', rarity: a.rarity, cost: REBIRTH_ARTIFACT_COST[a.rarity], artifactId: a.id,
    effect: () => { gainArtifact(a.id); } };
});
if (REBIRTH_SHOP_ITEMS.heart) REBIRTH_SHOP_ITEMS.heart.cost = 1; // 1個目の商品は初回1ジェムで買える
delete REBIRTH_SHOP_ITEMS.swordM; delete REBIRTH_SHOP_ITEMS.swordL;
const REBIRTH_COST_GROWTH = 1.25;
function getRebirthItemCost(id) {
  const item = REBIRTH_SHOP_ITEMS[id];
  const n = (game.rebirthShopBuys && game.rebirthShopBuys[id]) || 0;
  return gemPrice(Math.max(item.cost + n, Math.round(item.cost * Math.pow(REBIRTH_COST_GROWTH, n))));
}
function getRebirthMaxCount(id) {
  const item = REBIRTH_SHOP_ITEMS[id];
  if (isRebirthItemMaxed(item) || isRebirthItemLocked(item) || getRebirthShopLockLeft(id)) return 0;
  if (item.companionId || item.unlockKey) return game.gems >= getRebirthItemCost(id) ? 1 : 0;
  const limit = ARTIFACT_STACK_LIMIT[item.artifactId];
  const room = limit ? limit - (game.ownedArtifacts[item.artifactId] || 0) : Infinity;
  const base = (game.rebirthShopBuys && game.rebirthShopBuys[id]) || 0;
  let gems = game.gems, count = 0;
  while (count < room && count < 999) {
    const n = base + count;
    const cost = gemPrice(Math.max(item.cost + n, Math.round(item.cost * Math.pow(REBIRTH_COST_GROWTH, n))));
    if (gems < cost) break;
    gems -= cost; count++;
  }
  return count;
}
// 宝箱のレア度の出る確率：★5=1/500、★4=1/100、★3=1/32、★2=1/6、残りが★1
const CHEST_RARITY_ODDS = (() => { const w = [1, 0.1, 0.01, 0.001, 0.0001], t = w.reduce((a, b) => a + b, 0); return { rare: w[1] / t, epic: w[2] / t, legendary: w[3] / t, mythic: w[4] / t }; })(); // レア度が1つ上がるごとに1/10（コモン約90%・レア9%・エピック0.9%・レジェンド0.09%・ミシック0.009%）
const REBIRTH_REWARD_RARITY_WEIGHTS = { mythic: 0.2, legendary: 1, epic: 3.125, rare: 16.667, common: 79.008 };
function rollChestRarity(luck = 1, min = 'common') { // luck 倍だけ高レア度が出やすい（岩・ボスなど苦労して手に入れる宝箱用）
  const order = ['common', 'rare', 'epic', 'legendary', 'mythic'];
  let r = Math.random(), got = 'common';
  for (const k of ['mythic', 'legendary', 'epic', 'rare']) { const p = Math.min(0.9, CHEST_RARITY_ODDS[k] * luck); if (r < p) { got = k; break; } r -= p; if (r < 0) break; }
  return order.indexOf(got) < order.indexOf(min) ? min : got;
}
function pickWeightedArtifact(pool, weights) {
  if (!pool.length) pool = ARTIFACT_POOL; // 隠している遺物しか該当しないときは出せる遺物から
  const counts = {};
  pool.forEach(a => counts[a.rarity] = (counts[a.rarity] || 0) + 1);
  const w = a => (weights[a.rarity] || 0) / counts[a.rarity];
  const total = pool.reduce((sum, a) => sum + w(a), 0);
  if (!(total > 0)) return pool[Math.floor(Math.random() * pool.length)]; // そのレア度の遺物が無い
  let r = Math.random() * total;
  for (const a of pool) { r -= w(a); if (r <= 0) return a; }
  return pool[pool.length - 1];
}
const REBIRTH_SHOP_CATEGORIES = [ // タブのアイコンは強化ページと同じ画像
  { id: 'attack', label: `${xi('x_up_attack')} 攻撃` },
  { id: 'defense', label: `${xi('x_up_defense')} 防御` },
  { id: 'economy', label: `${xi('x_up_coin')} 経済` },
  { id: 'companion', label: `${xi('x_up_companion')} 仲間` },
];
const ARTIFACT_CATEGORY = {
  heart: 'attack', swordM: 'attack', swordL: 'attack', gauntlet: 'attack', hourglass: 'attack', turbo: 'attack', eye: 'attack', fang: 'attack', lens: 'attack', crest: 'attack', horn: 'attack', pinchMask: 'attack', gauntletCounter: 'attack',
  book: 'defense', armor: 'defense', feather: 'defense',
  ring: 'economy', compass: 'economy', calendar: 'economy', rebirthOrb: 'economy', evoFeather: 'economy',
  banner: 'companion', amulet: 'companion', pierceHoof: 'attack',
};
function getRebirthItemCategory(item) {
  if (item.category) return item.category;
  if (item.companionId) return 'companion';
  return ARTIFACT_CATEGORY[item.artifactId] || 'attack';
}
let rebirthShopCategory = 'attack';
function renderSubTabs(el, cats, current, onPick) {
  el.innerHTML = cats.map(c => `<button class="sub-tab-btn ${c.id === current ? 'active' : ''}" data-subtab="${c.id}">${c.label}</button>`).join('');
  el.onclick = ev => { const btn = ev.target.closest('[data-subtab]'); if (btn) onPick(btn.dataset.subtab); };
}
const ARTIFACT_CURRENT = {
  pierceHoof: n => `吹っ飛ばし +${n*25}%`,
  heart: n => `攻撃力 +${5 * n}%`, swordM: n => `攻撃力 +${30 * n}%`, swordL: n => `攻撃力 +${100 * n}%`, ring: n => `コイン +${30 * n}%`, book: n => `攻撃力 +${10 * n}%・HP +${10 * n}%`, armor: n => `HP +${25 * n}%`,
  compass: n => `反射コイン ×${n}`, calendar: n => `ログボ +${40 * n}%`, gauntlet: n => `メテオ +${35 * n}%`, hourglass: n => `待機 -${15 * n}%`,
  evoFeather: n => `進化の素材 ${n}枚`, turbo: n => `加速中 +${25 * n}%`, eye: n => `会心率 +${5 * n}%`, fang: n => `会心ダメ +${50 * n}%`, lens: n => `命中 +${3 * n}%`,
  feather: n => `回避 +${3 * n}%`, crest: n => `ボス +${25 * n}%`, gauntletCounter: n => `カウンター +${10 * n}%`, horn: n => `タックル +${30 * n}%`,
  banner: n => `仲間攻撃 +${25 * n}%`, amulet: n => `仲間HP +${25 * n}%`, pinchMask: n => `背水 +${40 * n}%`, rebirthOrb: n => `転生ジェム +${2 * n}`,
};
function artifactTextFor(id, count) { // 指定した所持数のときの効果の文
  const cap = ARTIFACT_STACK_LIMIT[id] ? Math.min(count, ARTIFACT_STACK_LIMIT[id]) : count;
  return ARTIFACT_CURRENT[id] && cap > 0 ? ARTIFACT_CURRENT[id](cap) : '';
}
function artifactTransitionHtml(id, beforeCount) { // 宝箱開封時の「前 → 後」の効果の推移
  const after = game.ownedArtifacts[id] || 0, b = artifactTextFor(id, beforeCount), a = artifactTextFor(id, after);
  if (!a) return '';
  if (b === a) return `<div class="cl-trans">${a}（上限）</div>`;
  return `<div class="cl-trans">${b ? `<s>${b}</s> → ` : ''}<b>${a}</b></div>`;
}
function getArtifactCurrentText(id) {
  const count = game.ownedArtifacts[id] || 0;
  const cap = ARTIFACT_STACK_LIMIT[id] ? Math.min(count, ARTIFACT_STACK_LIMIT[id]) : count;
  return ARTIFACT_CURRENT[id] && cap > 0 ? ARTIFACT_CURRENT[id](cap) : '';
}
function isRebirthItemLocked(item) { return !!item.requires && !game[item.requires]; } // 前提の開放がまだ
const REBIRTH_SHOP_FIRST_OPEN = 2;
function getRebirthShopOpenCount() { return REBIRTH_SHOP_FIRST_OPEN - 1 + Math.max(1, game.rebirthShopVisits || 0); }
const REBIRTH_SHOP_EARLY = {};
function getRebirthCategoryIds(cat) {
  const ids = Object.keys(REBIRTH_SHOP_ITEMS).filter(k => getRebirthItemCategory(REBIRTH_SHOP_ITEMS[k]) === cat && !(k in REBIRTH_SHOP_EARLY));
  Object.entries(REBIRTH_SHOP_EARLY).sort((a, b) => a[1] - b[1]).forEach(([id, pos]) => {
    if (REBIRTH_SHOP_ITEMS[id] && getRebirthItemCategory(REBIRTH_SHOP_ITEMS[id]) === cat) ids.splice(Math.min(pos, ids.length), 0, id);
  });
  return ids;
}
function getRebirthShopLockLeft(id) {
  const item = REBIRTH_SHOP_ITEMS[id];
  const idx = getRebirthCategoryIds(getRebirthItemCategory(item)).indexOf(id);
  const left = idx - getRebirthShopOpenCount() + 1;
  if (left <= 0) return 0;
  if ((game.rebirthShopBuys && game.rebirthShopBuys[id]) || isRebirthItemMaxed(item) || (item.artifactId && game.ownedArtifacts[item.artifactId])) return 0;
  return left;
}
function isRebirthItemMaxed(item) {
  if (item.unlockKey) return !!game[item.unlockKey];
  if (item.companionId) return isCompanionUnlocked(item.companionId);
  if (!item.artifactId) return false;
  const limit = ARTIFACT_STACK_LIMIT[item.artifactId];
  return !!limit && (game.ownedArtifacts[item.artifactId] || 0) >= limit;
}

const COMPANIONS = { // 職業の仲間（kind：どの能力の仕組みを使うか）
  villager: { icon: '🧑‍🌾', name: '村人', stat: 'coin', desc: 'コイン獲得上昇', rarity: 'common', kind: 'cat', weight: 30, recruitCost: 60, baseBonus: 0.06, perLevel: 0.02, levelCostBase: 2,
    trait: '【畑の恵み】7秒ごとにコインを拾ってくる' },
  merchant: { icon: '💰', name: '商人', stat: 'coin', desc: 'コイン獲得上昇', rarity: 'common', kind: 'alchemist', weight: 30, recruitCost: 60, baseBonus: 0.06, perLevel: 0.02, levelCostBase: 2,
    trait: '【商売上手】12秒ごとにコインをまとめて稼いでくる' },
  hobbit: { icon: '🍀', name: 'ホビット', stat: 'speed', desc: '移動速度上昇（全体で最大+60%）', rarity: 'common', kind: 'sprite', weight: 30, recruitCost: 60, baseBonus: 0.06, perLevel: 0.02, levelCostBase: 2,
    trait: '【小さな幸運】クリティカル率+30%／当てると自機が1.5秒加速' },
  dog: { icon: '🐕', name: '犬', stat: 'speed', desc: '移動速度上昇（全体で最大+60%）', rarity: 'common', kind: 'monk', weight: 30, recruitCost: 60, baseBonus: 0.06, perLevel: 0.02, levelCostBase: 2,
    trait: '【かみつき】当たると、追加でもう1回かみつく（50%ダメージ）' },
  penguin: { icon: '🐧', name: 'ペンギン兵', stat: 'hp', desc: '最大HP上昇', rarity: 'common', kind: 'gunner', weight: 30, recruitCost: 60, baseBonus: 0.06, perLevel: 0.02, levelCostBase: 2,
    trait: '【氷つぶて】5秒ごとに攻撃力2.5倍の高速弾を撃つ' },
  hamster: { icon: '🐹', name: 'ハムスター兵', stat: 'atk', desc: '攻撃力上昇', rarity: 'common', kind: 'archer', weight: 30, recruitCost: 60, baseBonus: 0.06, perLevel: 0.02, levelCostBase: 2,
    trait: '【豆鉄砲】3秒ごとに敵を追尾する弾を撃つ' },
  cat: { icon: '🐱', name: '相棒ニャンタ', stat: 'coin', desc: 'コイン獲得上昇', rarity: 'common', kind: 'cat', weight: 30, recruitCost: 60, baseBonus: 0.06, perLevel: 0.02, levelCostBase: 2,
    trait: '【拾い物】7秒ごとにコインを拾ってくる' },
  warrior: { icon: '⚔️', name: '戦士', stat: 'atk', desc: '攻撃力上昇', rarity: 'rare', kind: 'warrior', weight: 25, recruitCost: 90, baseBonus: 0.07, perLevel: 0.03, levelCostBase: 2,
    trait: '【雄叫び】12秒ごとに自機の攻撃力を4秒間1.5倍' },
  mage: { icon: '🔮', name: '魔法使い', stat: 'atk', desc: '攻撃力上昇', rarity: 'rare', kind: 'mage', weight: 25, recruitCost: 90, baseBonus: 0.07, perLevel: 0.03, levelCostBase: 2,
    trait: '【爆炎】6秒ごとに攻撃力3倍の火球を放つ' },
  priest: { icon: '⛪', name: '僧侶', stat: 'hp', desc: '最大HP上昇', rarity: 'rare', kind: 'priest', weight: 25, recruitCost: 90, baseBonus: 0.07, perLevel: 0.03, levelCostBase: 2,
    trait: '【蘇生】12秒ごとに倒れた仲間を1人復活、いなければ仲間全員のHPを20%回復' },
  monk: { icon: '🥋', name: '武道家', stat: 'atk', desc: '攻撃力上昇', rarity: 'rare', kind: 'monk', weight: 25, recruitCost: 90, baseBonus: 0.07, perLevel: 0.03, levelCostBase: 2,
    trait: '【連撃】攻撃が当たると、追加でもう1発（50%ダメージ）' },
  archer: { icon: '🏹', name: '弓兵', stat: 'atk', desc: '攻撃力上昇', rarity: 'rare', kind: 'archer', weight: 25, recruitCost: 90, baseBonus: 0.07, perLevel: 0.03, levelCostBase: 2,
    trait: '【狙撃】3秒ごとに敵を追尾する矢を自動で放つ' },
  thief: { icon: '🗡️', name: '盗賊', stat: 'speed', desc: '移動速度上昇（全体で最大+60%）', rarity: 'rare', kind: 'thief', weight: 25, recruitCost: 90, baseBonus: 0.07, perLevel: 0.03, levelCostBase: 2,
    trait: '【盗む】当てるたびに30%の確率でコインを盗む' },
  dancer: { icon: '💃', name: '踊り子', stat: 'speed', desc: '移動速度上昇（全体で最大+60%）', rarity: 'rare', kind: 'bard', weight: 25, recruitCost: 90, baseBonus: 0.07, perLevel: 0.03, levelCostBase: 2,
    trait: '【魅惑の舞】仲間全員の攻撃力 +10%（踊り子1人ごと）' },
  bard: { icon: '🎸', name: '吟遊詩人', stat: 'coin', desc: 'コイン獲得上昇', rarity: 'rare', kind: 'bard', weight: 25, recruitCost: 90, baseBonus: 0.07, perLevel: 0.03, levelCostBase: 2,
    trait: '【鼓舞の歌】仲間全員の攻撃力 +10%（吟遊詩人1人ごと）' },
  lancer: { icon: '🔱', name: '槍兵', stat: 'atk', desc: '攻撃力上昇', rarity: 'rare', kind: 'lancer', weight: 25, recruitCost: 90, baseBonus: 0.07, perLevel: 0.03, levelCostBase: 2,
    trait: '【貫通】ボスへのダメージ1.5倍' },
  alchemist: { icon: '⚗️', name: '錬金術師', stat: 'coin', desc: 'コイン獲得上昇', rarity: 'rare', kind: 'witch', weight: 25, recruitCost: 90, baseBonus: 0.07, perLevel: 0.03, levelCostBase: 2,
    trait: '【錬金】当てるたびにコイン獲得／【調合薬】10秒ごとに自機のHPを8%回復' },
  musketeer: { icon: '🔫', name: 'マスケット兵', stat: 'atk', desc: '攻撃力上昇', rarity: 'rare', kind: 'gunner', weight: 25, recruitCost: 90, baseBonus: 0.07, perLevel: 0.03, levelCostBase: 2,
    trait: '【一斉射撃】5秒ごとに攻撃力2.5倍の高速弾を撃つ' },
  bunny: { icon: '🐰', name: '遊び人', stat: 'speed', desc: '移動速度上昇（全体で最大+60%）', rarity: 'rare', kind: 'sprite', weight: 25, recruitCost: 90, baseBonus: 0.07, perLevel: 0.03, levelCostBase: 2,
    trait: '【気まぐれ】クリティカル率+30%／当てると自機が1.5秒加速' },
  golem: { icon: '🗿', name: 'ゴーレム兵', stat: 'hp', desc: '最大HP上昇', rarity: 'rare', kind: 'golem', weight: 25, recruitCost: 90, baseBonus: 0.07, perLevel: 0.03, levelCostBase: 2,
    trait: '【巨体】体が大きく、HPが2倍' },
  tamer: { icon: '🐺', name: '魔物使い', stat: 'atk', desc: '攻撃力上昇', rarity: 'epic', kind: 'ranger', weight: 10, recruitCost: 130, baseBonus: 0.09, perLevel: 0.035, levelCostBase: 2,
    trait: '【けしかけ】4秒ごとに追尾する魔獣の牙を3本放つ' },
  heavy: { icon: '🛡️', name: '重戦士', stat: 'hp', desc: '最大HP上昇', rarity: 'epic', kind: 'knight', weight: 10, recruitCost: 130, baseBonus: 0.09, perLevel: 0.035, levelCostBase: 2,
    trait: '【鉄壁】受けるダメージ半減／【盾撃】当てた敵を0.8秒気絶させ大きく弾き飛ばす' },
  cavalry: { icon: '🐎', name: '騎兵', stat: 'atk', desc: '攻撃力上昇', rarity: 'epic', kind: 'lancer', weight: 10, recruitCost: 130, baseBonus: 0.09, perLevel: 0.035, levelCostBase: 2,
    trait: '【突撃槍】ボスへのダメージ1.5倍' },
  samurai: { icon: '🎌', name: '侍', stat: 'atk', desc: '攻撃力上昇', rarity: 'epic', kind: 'samurai', weight: 10, recruitCost: 130, baseBonus: 0.09, perLevel: 0.035, levelCostBase: 2,
    trait: '【居合】当てたとき25%で攻撃力3倍の一閃' },
  summoner: { icon: '👻', name: '召喚士', stat: 'atk', desc: '攻撃力上昇', rarity: 'epic', kind: 'summoner', weight: 10, recruitCost: 130, baseBonus: 0.09, perLevel: 0.035, levelCostBase: 2,
    trait: '【霊獣召喚】7秒ごとに追尾する霊獣を2体放つ' },
  sage: { icon: '📖', name: '賢者', stat: 'coin', desc: 'コイン獲得上昇', rarity: 'epic', kind: 'sage', weight: 10, recruitCost: 130, baseBonus: 0.09, perLevel: 0.035, levelCostBase: 2,
    trait: '【魔導】5秒ごとに攻撃力2倍の魔法弾を放つ' },
  fortune: { icon: '🔮', name: '占い師', stat: 'coin', desc: 'コイン獲得上昇', rarity: 'epic', kind: 'sage', weight: 10, recruitCost: 130, baseBonus: 0.09, perLevel: 0.035, levelCostBase: 2,
    trait: '【水晶の導き】5秒ごとに攻撃力2倍の魔法弾を放つ' },
  ninja: { icon: '🥷', name: '忍者', stat: 'speed', desc: '移動速度上昇（全体で最大+60%）', rarity: 'epic', kind: 'ninja', weight: 10, recruitCost: 130, baseBonus: 0.09, perLevel: 0.035, levelCostBase: 2,
    trait: '【毒刃】当てた敵を毒状態にする（毒スキルなしでも発動）' },
  pirate: { icon: '🏴‍☠️', name: '海賊', stat: 'coin', desc: 'コイン獲得上昇', rarity: 'epic', kind: 'pirate', weight: 10, recruitCost: 130, baseBonus: 0.09, perLevel: 0.035, levelCostBase: 2,
    trait: '【略奪】敵に当てるとたまにコインを奪う（8秒に1回まで）' },
  paladin: { icon: '⚜️', name: '聖騎士パラディン', stat: 'hp', desc: '最大HP上昇', rarity: 'epic', kind: 'paladin', weight: 10, recruitCost: 130, baseBonus: 0.09, perLevel: 0.035, levelCostBase: 2,
    trait: '【聖盾】10秒ごとに自機と仲間全員のHPを8%回復' },
  princess: { icon: '👸', name: '姫', stat: 'hp', desc: '最大HP上昇', rarity: 'epic', kind: 'heroine', weight: 10, recruitCost: 130, baseBonus: 0.09, perLevel: 0.035, levelCostBase: 2,
    trait: '【癒しの祈り】8秒ごとに自機のHPを10%回復' },
  dragon: { icon: '🐉', name: 'ドラゴン', stat: 'atk', desc: '攻撃力上昇', rarity: 'epic', kind: 'mage', weight: 10, recruitCost: 130, baseBonus: 0.09, perLevel: 0.035, levelCostBase: 2,
    trait: '【火炎の息】6秒ごとに攻撃力3倍の火球を吐く' },
  dragoon: { icon: '🐲', name: '竜騎士', stat: 'atk', desc: '攻撃力上昇', rarity: 'legendary', kind: 'dragoon', weight: 2, recruitCost: 300, baseBonus: 0.15, perLevel: 0.05, levelCostBase: 5,
    trait: '【竜槍ジャンプ】9秒ごとに敵へ急降下し攻撃力5倍の一撃（★4 レジェンド）' },
  pegasus: { icon: '🦄', name: 'ペガサスナイト', stat: 'atk', desc: '攻撃力上昇', rarity: 'legendary', kind: 'dragoon', weight: 2, recruitCost: 300, baseBonus: 0.15, perLevel: 0.05, levelCostBase: 5,
    trait: '【天翔ける槍】9秒ごとに敵へ急降下し攻撃力5倍の一撃（★4 レジェンド）' },
  king: { icon: '👑', name: '王様', stat: 'coin', desc: 'コイン獲得上昇', rarity: 'legendary', kind: 'paladin', weight: 2, recruitCost: 300, baseBonus: 0.15, perLevel: 0.05, levelCostBase: 5,
    trait: '【王の号令】仲間全員の攻撃力 +30%／10秒ごとに自機と仲間全員のHPを8%回復（★4 レジェンド）' },
  archangel: { icon: '👼', name: '大天使ミカエルン', stat: 'hp', desc: '最大HP上昇', rarity: 'mythic', kind: 'angel', weight: 1, recruitCost: 300, baseBonus: 0.15, perLevel: 0.05, levelCostBase: 5,
    trait: '【祝福】10秒ごとに自機と仲間全員のHPを15%回復し、倒れた仲間を全員復活（★5 ミシック）' },
  bahamut: { icon: '🐉', name: '覇龍バハムート', stat: 'atk', desc: '攻撃力上昇', rarity: 'mythic', kind: 'dragon', weight: 1, recruitCost: 300, baseBonus: 0.15, perLevel: 0.05, levelCostBase: 5,
    trait: '【覇者の力】仲間全員の攻撃力を合わせた攻撃力で攻撃する（★5 ミシック）' },
};
function compKind(id) { return (COMPANIONS[id] && COMPANIONS[id].kind) || id; } // 能力の種類（同じ能力を別の職業でも使い回す）
const COMPANION_SPRITES = {};
Object.keys(COMPANIONS).forEach(id => { COMPANION_SPRITES[id] = `assets/img/companions/${id}.webp`; });
const PLAYER_SPRITE = document.getElementById('blHero').src; // 画像の本体は起動画面の<img>にある（二重に持たない）
const playerSpriteImg = new Image();
playerSpriteImg.src = PLAYER_SPRITE;
stagePlayerMark.src = PLAYER_SPRITE; // ステージ進行ゲージの自キャラアイコン
document.getElementById('playerHpIco').src = PLAYER_SPRITE; // 下のHPパネルの自キャラアイコン
const companionSpriteImgs = {};
for (const id in COMPANION_SPRITES) { const img = new Image(); img.src = COMPANION_SPRITES[id]; companionSpriteImgs[id] = img; }
function companionIconHtml(id) {
  return COMPANION_SPRITES[id] ? `<img class="comp-sprite" src="${COMPANION_SPRITES[id]}" alt="">` : COMPANIONS[id].icon;
}
const COMPANION_IDS = Object.keys(COMPANIONS);
// 属性（炎・水・草の三すくみ）：炎→草→水→炎 の順に強い。有利なら与ダメージ2倍、不利なら0.5倍
const ELEMENTS = { fire: { icon: '🔥', name: '炎', color: '#ff6b4a' }, water: { icon: '💧', name: '水', color: '#3aa8ff' }, grass: { icon: '🌿', name: '草', color: '#3cbf5f' } };
const ELEMENT_BEATS = { fire: 'grass', grass: 'water', water: 'fire' };
const ELEMENT_ADV = 2, ELEMENT_DIS = 0.5;
let lastElementHitAt = 0;
function noteElementHit(attEl, target) { // 有利な属性で当てたら「こうかばつぐん！」（出しすぎないよう少し間をあける）
  if (!target || elementMult(attEl, getEnemyElement(target)) <= 1) return;
  const now = Date.now(); if (now - lastElementHitAt < 900) return;
  lastElementHitAt = now;
  if (typeof obFlag === 'function') obFlag('superEff');
  spawnDamageText(target.x, target.y - (target.radius || 12) - 46, 'こうかばつぐん！', '#ffe14f', 0.018, true);
}
const COMPANION_ELEMENT = {};
[['fire', 'merchant warrior monk mage musketeer alchemist bunny lancer heavy samurai dragon dragoon bahamut'],
 ['water', 'penguin priest dancer bard princess fortune sage ninja pirate paladin pegasus archangel'],
 ['grass', 'villager hobbit dog cat hamster archer thief golem tamer summoner cavalry king']].forEach(([el, ids]) => ids.split(' ').forEach(id => { COMPANION_ELEMENT[id] = el; }));
function elementMult(att, def) { return !att || !def ? 1 : ELEMENT_BEATS[att] === def ? ELEMENT_ADV : ELEMENT_BEATS[def] === att ? ELEMENT_DIS : 1; }
function elemBadge(el, cls = '') { return el && ELEMENTS[el] ? `<span class="el-badge el-${el} ${cls}">${ELEMENTS[el].icon}${ELEMENTS[el].name}</span>` : ''; }
// 自キャラ：仲間の中から選べる（見た目と属性が変わる）。未選択なら勇者（属性なし）
function isCharSummoned(id) { return !!(game.companionBook && game.companionBook[id]) && isCharObtained(id); } // 一度でも招集して仲間にしたことがある
function getHeroChar() { return game.heroChar && COMPANIONS[game.heroChar] && isCharSummoned(game.heroChar) ? game.heroChar : null; }
function compElement(id) { return id === getHeroChar() ? null : COMPANION_ELEMENT[id]; } // 自キャラと交代した仲間は勇者が代わりに出るので属性なし
const braveImg = new Image(); braveImg.src = PLAYER_SPRITE; // 交代で仲間に入った勇者の絵
// 自キャラのタイプ：仲間の得意分野で決まり、長所はレア度が高いほど大きい。短所は固定。勇者は補正なし・属性なし（相性の不利も受けない）
const HERO_TYPES = {
  atk:   { icon: '⚔️', name: 'アタッカー', up: p => `攻撃力 +${p}%`, down: '最大HP -20%', mods: p => ({ atk: 1 + p / 100, hp: 0.8 }) },
  hp:    { icon: '🛡️', name: 'タンク', up: p => `最大HP +${p * 2}%`, down: '攻撃力 -15%', mods: p => ({ hp: 1 + p * 2 / 100, atk: 0.85 }) },
  speed: { icon: '💨', name: 'スピード', up: p => `移動速度 +${Math.round(p / 2)}%・溜め時間 -${Math.min(40, Math.round(p / 2))}%`, down: '最大HP -15%', mods: p => ({ speed: 1 + p / 200, charge: 1 - Math.min(0.4, p / 200), hp: 0.85 }) },
  coin:  { icon: '💰', name: 'トレジャー', up: p => `コイン +${p * 2}%`, down: '攻撃力 -15%', mods: p => ({ coin: 1 + p * 2 / 100, atk: 0.85 }) },
};
const HERO_TYPE_PCT = { common: 15, rare: 25, epic: 40, legendary: 60, mythic: 100 };
function heroTypeInfo(id) { // { type, pct, up, down } または勇者なら null
  const c = id && COMPANIONS[id]; if (!c || !HERO_TYPES[c.stat]) return null;
  const t = HERO_TYPES[c.stat], pct = HERO_TYPE_PCT[c.rarity] || 15;
  return { key: c.stat, t, pct, up: t.up(pct), down: t.down };
}
let heroModsCache = { id: undefined, v: null };
function heroCharMods() {
  const id = getHeroChar();
  if (heroModsCache.id === id && heroModsCache.v) return heroModsCache.v;
  const info = heroTypeInfo(id), m = info ? info.t.mods(info.pct) : {};
  const v = { atk: m.atk || 1, hp: m.hp || 1, coin: m.coin || 1, speed: m.speed || 1, charge: m.charge || 1 };
  heroModsCache = { id, v }; return v;
}
function getHeroElement() { const h = getHeroChar(); return h ? COMPANION_ELEMENT[h] : null; }
const COMPANION_UNLOCK_COST = { epic: 80, legendary: 200 };
function isCharObtained(id) { return !!COMPANIONS[id]; } // 採用ガチャは廃止：どのキャラも最初から採用・解雇できる
function companionNeedsUnlock(id) { return false; } // 永続ショップ廃止：仲間は最初から全員召喚に出る（出したくない仲間は「解雇」で外す）
function isCompanionUnlocked(id) { return !companionNeedsUnlock(id) || !!(game.companionUnlocks && game.companionUnlocks[id]); }
COMPANION_IDS.filter(companionNeedsUnlock).forEach(id => {
  const c = COMPANIONS[id];
  REBIRTH_SHOP_ITEMS['comp_' + id] = { icon: c.icon, name: c.name + ' 開放', desc: '仲間招集で出るようになる（永続）', rarity: c.rarity, cost: COMPANION_UNLOCK_COST[c.rarity], companionId: id,
    effect: () => { if (!game.companionUnlocks) game.companionUnlocks = {}; game.companionUnlocks[id] = true; renderCompanionList(); } };
});
function companionMap(value) { const m = {}; COMPANION_IDS.forEach(id => m[id] = value); return m; }
const GOLEM_HP_MULT = 2;
const MONK_EXTRA_HIT_RATIO = 0.5;
const BARD_ATK_BONUS = 0.1;
const PRIEST_INTERVAL_MS = 12000;
const PRIEST_REVIVE_RATIO = 0.5;
const PRIEST_HEAL_RATIO = 0.2;
const KNIGHT_DAMAGE_TAKEN_MULT = 0.5;
const KNIGHT_STUN_MS = 800;
const ARCHER_SHOT_INTERVAL_MS = 3000;
const WITCH_HEAL_INTERVAL_MS = 10000;
const WITCH_HEAL_RATIO = 0.08;
const SPRITE_CRIT_BONUS = 0.3;
const SPRITE_TAILWIND_MS = 1500;

const game = {
  stage: 1, coins: 0, gems: 0, superGems: 0,
  reincarnations: 0, rebirthLv: 0, bossLoop: 0, bossLoopClears: 0, autoBossRetry: true, autoUpgrade: false, bestStage: 1, totalKills: 0, totalTaps: 0, maxCombo: 0, bestCoins: 0, username: '',
  upgrades: newUpgradeLevels(),
  coinCloneSlots: 0,
  shopOwned: {},
  gachaShards: { power: 0, vitality: 0, fortune: 0, meteor: 0, chain: 0, critical: 0, critdmg: 0, aim: 0, evade: 0, slayer: 0, counter: 0, rush: 0, bond: 0, guard: 0, pinch: 0, phoenix: 0 },
  evoRate: { atk: 1, hp: 1 }, // 進化率（攻撃力・HPに掛け算）
  evolutions: { power: 0, vitality: 0, fortune: 0, meteor: 0, chain: 0, critical: 0, critdmg: 0, aim: 0, evade: 0, slayer: 0, counter: 0, rush: 0, bond: 0, guard: 0, pinch: 0, phoenix: 0 },
  ownedArtifacts: {},
  rebirthBonus: { atk: 0, hp: 0, cloneSlots: 0 },
  totalCoinsSpent: 0, // 累計の消費コイン（戦績用）
  skillSlots: 1, equippedSkills: [], weaponSlots: 1, // サブウェポン枠（ジェムで最大4・転生しても残る）
  // スキル枠（ジェムで最大7）と装備中のスキル（転生しても残る）
  skillLevels: {}, skillGachaPulls: 0, weaponGachaPulls: 0, skillGachaOffer: null, // スキルガチャ（Lv・今周回の回数・選択待ちの候補）
  bestiary: {}, // 敵図鑑 { key: { kills, firstStage } }（転生しても残る）
  bgmBook: {}, // BGM図鑑 { 曲キー: 登録したステージ }（転生しても残る）
  tackleUnlocked: false, superTackleUnlocked: false, // 転生ショップで開放（転生しても残る）
  tacklePierceLv: 0, // ジェムショップ「貫きの蹄鉄」の購入数（タックルのヒット後持続 +0.1秒ずつ）
  companionSlots: 1, // 仲間のパーティ枠（ジェムで最大8まで。転生しても残る）
  subscriptions: {}, // サブスク（紋章）の有効期限 { hero: 時刻, veteran: 時刻 }
  rebirthOfferSlots: 3, // 転生ショップの商品枠（ジェムで最大10まで増やせる。転生しても残る）
  rebirthSeenItems: {}, rebirthShopNew: [], rebirthRerolls: 0, // 転生ショップ：一度並んだ商品 / 今回のNEW / 今回の引き直し回数
  rebirthShopOffer: null, rebirthOfferStage: 1, // 今のラインナップを決めたときの到達ステージ（枠追加時の抽選に使う） // 転生ショップのランダム3択（今回のラインナップのID）
  rebirthShopBuys: {}, // 転生ショップの商品ごとの購入回数（値上がり用。転生しても残る）
  companionUnlocks: {}, // 転生ショップで開放した仲間 { id: true }（転生しても残る）
  companionBook: {}, // 仲間図鑑 { id: true }（一度でも仲間にしたことがある。転生しても残る）
  companionSummons: 0, // 今回の周回で仲間召喚した回数（召喚費用の上昇に使う）
  companions: { recruited: {}, awaken: {}, count: {}, level: companionMap(0), hp: companionMap(0), alive: companionMap(true) },
  startedAt: Date.now(),
  playTimeMs: 0, // 実プレイ時間（ゲーム画面が表示されている間だけ加算）
  lastLoginDate: null,
  loginStreak: 0,
  maxDamage: 0,
  bestTowerJump: 0, // 試練の塔で突破した最大のステージジャンプ数
  maxDps: 0,
  dailyClearDate: null,
  dailyClears: 0,
  dailyClearHistory: {},
  sfxVolume: 0.7,
  bgmVolume: 0.7,
  vibration: true,
  skipChallenge: null, // ステージスキップのボス挑戦中 { origin, target }
  lastRewardAdAt: 0    // 最後にリワード動画の報酬を受け取った時刻
};


// 転生Lv：転生前に進んだ階が深いほど多く上がる（10ステージごとに+1、最低+1）。1Lvごとに攻撃力・最大HP +3%
const REBIRTH_LV_BONUS = 0.03;
function getRebirthLvGain(stage) { return 1 + Math.floor(Math.max(0, stage - 1) / 10); }
const REBORN_UNLOCK_STAGE = 101, TOWER_UNLOCK_STAGE = 51; // 転生したことがなければ、転生・試練の塔はこのステージに着いてから
function canShowReborn() { return (game.stage >= 3 || !!game.dbgRebornAlways) && isRebornUnlocked(); } // デバッグの「転生ボタン常時表示」ならステージに関係なく出す
function isRebornUnlocked() { return !!game.dbgRebornAlways || (game.reincarnations || 0) > 0 || (game.bestStage || 1) >= REBORN_UNLOCK_STAGE; }
function isTowerUnlocked() { return (game.reincarnations || 0) > 0 || (game.bestStage || 1) >= TOWER_UNLOCK_STAGE || !!game.skipChallenge; }
const SPEED_MULT_CAP = 1.6;
function baseBonuses() { return { atkMult: 1, coinMult: 1, hpMult: 1, speedMult: 1, bounceMult: 1, specialMult: 1, comboGrowth: 0, bounceCoinCount: 0, loginBonusMult: 1, specialDmgMult: 1, specialCooldownMult: 1, accelDmgMult: 1, critChance: 0, critMultBonus: 0, accuracy: 0, evasion: 0, bossDmg: 0, counter: 0, tackleMult: 1, companionAtkMult: 1, companionHpMult: 1, pinchAtk: 0, rebirthGems: 0 }; }
function applyArtifactBonuses(b) {
  for (const id in game.ownedArtifacts) { // 所持している遺物はすべて有効
    if (!ARTIFACT_BY_ID[id] || !isArtifactShown(id)) continue; // 隠している遺物は効果なし
    const count = game.ownedArtifacts[id] || 0;
    const cap = ARTIFACT_STACK_LIMIT[id] ? Math.min(count, ARTIFACT_STACK_LIMIT[id]) : count;
    if (id === 'heart') b.atkMult += 0.05 * count;     // 闘志の剣（小・中・大）
    if (id === 'swordM') b.atkMult += 0.3 * count;
    if (id === 'swordL') b.atkMult += 1.5 * count;
    if (id === 'swordX') b.atkMult += 4 * count;
    if (id === 'aegis') b.hpMult += 4 * count;
    if (id === 'ragnarok') b.atkMult += 15 * count;
    if (id === 'yggdrasil') { b.hpMult += 15 * count; b.coinMult += 3 * count; }
    if (id === 'starCrown') { b.atkMult += 8 * count; b.hpMult += 8 * count; b.critChance += 0.15 * count; }
    if (id === 'ring') b.coinMult += 0.3 * count;
    if (id === 'book') { b.atkMult += 0.1 * count; b.hpMult += 0.1 * count; }
    if (id === 'armor') b.hpMult += 0.25 * count;
    if (id === 'compass') b.bounceCoinCount = count;
    if (id === 'calendar') b.loginBonusMult += 0.4 * count;
    if (id === 'gauntlet') b.specialDmgMult += 0.6 * count;
    if (id === 'hourglass') b.specialCooldownMult -= 0.2 * cap;
    if (id === 'turbo') b.accelDmgMult += 0.4 * cap;
    if (id === 'eye') b.critChance += 0.08 * cap;
    if (id === 'fang') b.critMultBonus += 0.8 * cap;
    if (id === 'lens') b.accuracy += 0.03 * cap;
    if (id === 'feather') b.evasion += 0.03 * cap;
    if (id === 'crest') b.bossDmg += 0.4 * cap;
    if (id === 'gauntletCounter') b.counter += 0.15 * cap;
    if (id === 'horn') b.tackleMult += 0.30 * cap;
    if (id === 'banner') b.companionAtkMult += 0.4 * cap;
    if (id === 'amulet') b.companionHpMult += 0.4 * cap;
    if (id === 'pinchMask') b.pinchAtk += 0.6 * cap;
    if (id === 'rebirthOrb') b.rebirthGems += 2 * cap;
  }
  return b;
}
function computeBonuses() {
  const b = applyArtifactBonuses(baseBonuses());
  const up = game.upgrades;
  b.tackleMult += (up.tackle || 0) * 0.08;
  b.companionAtkMult += (up.compAtk || 0) * 0.08;
  b.meleeMult = (1 + (up.melee || 0) * 0.10) * upgradeLeapMult(up.melee || 0); // 接近戦：ふつうの衝突ダメージ
  b.rushDmgUp = (1 + (up.rush || 0) * 0.12) * upgradeLeapMult(up.rush || 0); // 体当たり：引っぱり攻撃のダメージ
  // 強化の飛躍：10Lvごとにプチ飛躍・100Lvごとに大飛躍・1000Lvごとに超大飛躍（倍率で掛かる）
  b.atkMult *= upgradeLvMult(up.atk || 0);
  b.hpMult *= upgradeLvMult(up.hp || 0);
  b.companionAtkMult *= upgradeLeapMult(up.compAtk || 0);
  // 強化：仲間の攻撃力・攻撃頻度・最大HP（飛躍も効く）
  b.companionAtkMult *= (1 + (up.cAtk || 0) * 0.15) * upgradeLeapMult(up.cAtk || 0);
  b.companionHpMult *= (1 + (up.cHp || 0) * 0.20) * upgradeLeapMult(up.cHp || 0);
  b.companionSpeedMult = (1 + (up.cSpd || 0) * 0.05) * upgradeLeapMult(up.cSpd || 0);
  if (game.shopOwned.sword) b.atkMult += 0.25;
  if (game.shopOwned.shield) b.hpMult += 0.25;
  if (game.shopOwned.fairy) b.coinMult += 0.30;

  const evoBoost = getEvoBoost(); // 遺物「進化の羽」：進化の効果アップ
  for (const id in GACHA_POOL) {
    const level = 0; // 旧方式の進化（欠片）は廃止：効果なし
    if (!level) continue;
    const bonus = GACHA_POOL[id].bonus;
    if (bonus.atk) b.atkMult += bonus.atk * level;
    if (bonus.hp) b.hpMult += bonus.hp * level;
    if (bonus.coin) b.coinMult += bonus.coin * level;
    if (bonus.special) b.specialMult += bonus.special * level;
    if (bonus.combo) b.comboGrowth += bonus.combo * level;
    if (bonus.crit) b.critChance += bonus.crit * level;
    if (bonus.critDmg) b.critMultBonus += bonus.critDmg * level;
    if (bonus.accuracy) b.accuracy += bonus.accuracy * level;
    if (bonus.evasion) b.evasion += bonus.evasion * level;
    if (bonus.bossDmg) b.bossDmg += bonus.bossDmg * level;
    if (bonus.counter) b.counter += bonus.counter * level;
    if (bonus.tackle) b.tackleMult += bonus.tackle * level;
    if (bonus.companionAtk) b.companionAtkMult += bonus.companionAtk * level;
    if (bonus.companionHp) b.companionHpMult += bonus.companionHp * level;
    if (bonus.pinchAtk) b.pinchAtk += bonus.pinchAtk * level;
  }

  for (const id in COMPANIONS) {
    if (!game.companions.recruited[id]) continue;
    const c = COMPANIONS[id];
    const level = game.companions.level[id] || 0;
    const bonus = c.baseBonus + level * c.perLevel;
    if (c.stat === 'hp') b.hpMult += bonus;
    if (c.stat === 'atk') b.atkMult += bonus;
    if (c.stat === 'coin') b.coinMult += bonus;
    if (c.stat === 'speed') b.speedMult += bonus;
  }

  b.atkMult += game.rebirthBonus.atk;
  b.hpMult += game.rebirthBonus.hp;
  const rlv = game.rebirthLv || 0; // 転生Lv：転生するたびに上がり、キャラの基礎能力がずっと強くなる
  b.atkMult += rlv * REBIRTH_LV_BONUS; b.hpMult += rlv * REBIRTH_LV_BONUS;
  b.atkMult *= getEvoRate('atk'); b.hpMult *= getEvoRate('hp'); // 進化率は最後に掛け算
  if (typeof applyComboBonuses === 'function') applyComboBonuses(b); // 仲間の組み合わせボーナス
  { const hm = heroCharMods(); b.atkMult *= hm.atk; b.hpMult *= hm.hp; b.coinMult *= hm.coin; } // 自キャラのタイプ補正（長所と短所）
  b.speedMult = Math.min(SPEED_MULT_CAP, b.speedMult) * heroCharMods().speed; // 移動速度の仲間を育てすぎても超高速にならないよう上限（スピード型の自キャラはその上に上乗せ）
  return b;
}

function getCloneLimit() {
  return 3 + game.coinCloneSlots + (game.shopOwned.summoner ? 2 : 0) + game.rebirthBonus.cloneSlots;
}
const PCT_BUDGET = 0.1; // 「10%」ボタン：手持ちコインの10%分だけまとめてレベルアップ
function getUpgradeCost(id) { return coinPrice(UPGRADES[id].baseCost * (game.upgrades[id] + 1)); }
function sumUpgradeCost(id, fromLevel, count) {
  const base = UPGRADES[id].baseCost;
  const s = getActiveSub();
  const total = base * count * (2 * fromLevel + count + 1) / 2;
  return s ? Math.ceil(total * s.coinPriceMult) : total;
}
function getMaxAffordableUpgradeLevels(id, coins) {
  coins = Math.max(0, safeNum(coins));
  const base = UPGRADES[id].baseCost;
  const L = game.upgrades[id];
  const sub = getActiveSub();
  const A = base, B = base * (2 * L + 1), C = -2 * (coins / (sub ? sub.coinPriceMult : 1)) - 2 * base; // 割引分だけ多めに見積もり、下で実際の合計で調整
  let count = Math.floor((-B + Math.sqrt(B * B - 4 * A * C)) / (2 * A));
  if (!isFinite(count) || count < 0) count = 0;
  count = Math.min(count, 1e12);
  // 誤差の補正は回数を決めて二分探索（大きな数でも無限ループしない）
  let lo = 0, hi = Math.max(1, count * 2 + 2);
  for (let i = 0; i < 80 && lo < hi; i++) { const mid = Math.floor((lo + hi + 1) / 2); if (mid === lo) break; if (sumUpgradeCost(id, L, mid) <= coins) lo = mid; else hi = mid - 1; }
  count = lo;
  return Math.max(0, Math.min(count, getUpgradeLevelCap(id) - L)); // 上限レベルを超えない
}

function getUpgradeStatValue(id) {
  if (id === 'atk') return getPlayerAtk();
  if (id === 'hp') return getPlayerMaxHP();
  const b = computeBonuses();
  if (id === 'tackle') return b.tackleMult;
  if (id === 'melee') return b.meleeMult;
  if (id === 'rush') return b.rushDmgUp;
  if (id === 'compAtk') return b.companionAtkMult;
  const L = game.upgrades[id] || 0; // 仲間の強化は、この強化だけの倍率を見せる
  if (id === 'cAtk') return (1 + L * 0.15) * upgradeLeapMult(L);
  if (id === 'cHp') return (1 + L * 0.20) * upgradeLeapMult(L);
  if (id === 'cSpd') return (1 + L * 0.05) * upgradeLeapMult(L);
  return 0;
}
function formatUpgradeStat(id, v) {
  if (id === 'tackle' || id === 'compAtk' || id === 'melee' || id === 'rush' || id === 'cAtk' || id === 'cHp' || id === 'cSpd') return '×' + (v >= 1000 ? formatCoinNumber(Math.round(v)) : +v.toFixed(2));
  return formatCoinNumber(Math.round(v));
}
const UPGRADE_SHOWN = ['atk', 'hp']; // 仲間全体の強化（cAtk・cSpd・cHp）は廃止（今のLvの効果は転生まで残る）
function renderUpgradeList() {
  const row = ([id, upgrade]) => {
    const level = game.upgrades[id];
    if (level >= getUpgradeLevelCap(id)) {
      return `<div class="upgrade-row">
      <div class="upgrade-btn upgrade-card is-disabled" data-upgrade-card="${id}"><span class="item-icon">${ico(upgrade)}</span> <b class="up-title">${upgrade.name}</b> Lv.${formatCoinNumber(level)}（MAX）<span class="upgrade-value">${formatUpgradeStat(id, getUpgradeStatValue(id))}</span><span class="cost">上限に達しました</span></div>
      <button class="upgrade-max-btn one-btn is-disabled" data-upgrade="${id}">+1<span>Lv.</span></button>
      <button class="upgrade-max-btn pct-btn is-disabled" data-upgrade-pct="${id}">10%<span>—</span></button>
      <button class="upgrade-max-btn is-disabled" data-upgrade-max="${id}">MAX<span>—</span></button>
    </div>`;
    }
    const cost = getUpgradeCost(id);
    const maxCount = getMaxAffordableUpgradeLevels(id, game.coins);
    const pctCount = getMaxAffordableUpgradeLevels(id, game.coins * PCT_BUDGET);
    const nl = nextUpgradeLeap(level);
    const leapTag = nl.target - level === 1 ? `<span class="upgrade-leap leap-next" style="--lc:${nl.leap.color}">✨ 次で${nl.leap.name}！（${nl.leap.every === 10 ? '+3%' : '×' + nl.leap.mult}）</span>` : ''; // あと1回で飛躍するときだけ知らせる
    const now = getUpgradeStatValue(id);
    game.upgrades[id] = level + 1;
    const next = getUpgradeStatValue(id);
    game.upgrades[id] = level;
    return `<div class="upgrade-row">
      <div class="upgrade-btn upgrade-card ${game.coins < cost ? 'is-disabled' : ''}" data-upgrade-card="${id}"><span class="item-icon">${ico(upgrade)}</span> <b class="up-title">${upgrade.name}</b> Lv.${formatCoinNumber(level)}<span>${upgrade.desc}</span>${leapTag}<span class="upgrade-value">${formatUpgradeStat(id, now)} → <b>${formatUpgradeStat(id, next)}</b></span><span class="cost">${COIN_ICO} ${formatCoinNumber(cost)}</span></div>
      <button class="upgrade-max-btn one-btn ${game.coins < cost ? 'is-disabled' : ''}" data-upgrade="${id}">+1<span>Lv.UP</span></button>
      ${bulkUpLocked(true) ? `<button class="upgrade-max-btn pct-btn is-disabled bulk-locked" data-upgrade-pct="${id}">${bulkUpLockedBtn(true)}</button>` : `<button class="upgrade-max-btn pct-btn ${pctCount < 1 ? 'is-disabled' : ''}" data-upgrade-pct="${id}">10%<span>+${formatCoinNumber(pctCount)} Lv.</span></button>`}
      ${bulkUpLocked(false) ? `<button class="upgrade-max-btn is-disabled bulk-locked" data-upgrade-max="${id}">${bulkUpLockedBtn(false)}</button>` : `<button class="upgrade-max-btn ${maxCount < 1 ? 'is-disabled' : ''}" data-upgrade-max="${id}">MAX<span>+${formatCoinNumber(maxCount)} Lv.</span></button>`}
    </div>`;
  };
  upgradeList.innerHTML = Object.entries(UPGRADES).filter(([id]) => UPGRADE_SHOWN.includes(id)).map(row).join('');
}
var shopSortOrder = null;
const SHOP_ITEM_ART = { sword: 'sword', shield: 'shield', meteor: 'meteor', fairy: 'fairy', autoUpgrade: 'auto', potion: 'bluepot', redPotion: 'redpot', partySlot: 'party', skillSlot: 'book', weaponSlot: 'axe', summoner: 'emblem' }; // ショップの絵のアイコン
function renderShopList() {
  const ids = Object.keys(SHOP_ITEMS).filter(id => CLONES_ENABLED || !CLONE_ONLY_ITEMS.includes(id));
  const sold = {}; ids.forEach(id => { sold[id] = isShopItemOwned(id); });
  if (!shopSortOrder) shopSortOrder = [...ids].sort((x, y) => sold[x] - sold[y]); // 買い切ったアイテムは下へ（ショップを開いたときに並べ替える）
  ids.sort((x, y) => shopSortOrder.indexOf(x) - shopSortOrder.indexOf(y));
  shopList.innerHTML = ids.map(id => {
    const item = SHOP_ITEMS[id], owned = sold[id];
    const locked = !owned && item.requires && !game[item.requires];
    const gcost = item.action ? 0 : getShopItemGemCost(id);
    const note = item.consumableKey ? `（所持 ${game[item.consumableKey] || 0}個）` : item.slot ? `（現在 ${item.slot.cur()}${item.slot.unit} / 最大 ${item.slot.max()}${item.slot.unit}）` : item.stackKey ? `（現在 +${((game[item.stackKey] || 0) * TACKLE_PIERCE_MS_PER_LV / 1000).toFixed(1)}秒・${game[item.stackKey] || 0}/${item.maxStack}）` : '';
    const costTxt = owned ? (item.unlockKey ? '✓ 開放済み' : item.slot || item.stackKey ? '✓ 最大' : '✓ 購入済み') : item.action ? '開く' : '💎 ' + gcost;
    const art = SHOP_ITEM_ART[id], left = owned || item.consumableKey || item.action ? 0 : item.slot ? item.slot.max() - item.slot.cur() : item.stackKey ? item.maxStack - (game[item.stackKey] || 0) : 1; // 残り何回買えるか
    const icon = art ? `<span class="sr-ico su-i_${art}"></span>` : `<span class="sr-ico sr-ico-emoji"><span class="item-icon">${ico(item)}</span></span>`;
    const price = owned || item.action ? `<span class="cost sr-price-txt">${costTxt}</span>` : `<span class="cost sr-price su-price"><b>${gcost}</b></span>`;
    return `<button class="shop-btn shop-row ${owned ? 'sold-out' : ''} ${owned || locked || (!item.action && game.gems < gcost) ? 'is-disabled' : ''}" data-shop="${id}">${icon}<span class="sr-main"><span class="shop-name sr-name su-name">${item.name}</span><span class="shop-desc">${locked ? '🔒 先にタックル開放が必要' : item.desc + note}</span></span><span class="sr-side">${left > 0 ? `<span class="sr-badge su-badge">残り ${left}回</span>` : ''}${price}</span></button>`;
  }).join('');
}
const SKILL_SLOT_MAX = 7;
function getSkillSlots() { return Math.max(1, Math.min(SKILL_SLOT_MAX, game.skillSlots || 1)); }
function getSkillSlotCost() { return gemPrice(20 * Math.pow(2, getSkillSlots() - 1)); } // 20→40→80→160→320→640
function getEquippedSkills() { if (!Array.isArray(game.equippedSkills)) game.equippedSkills = []; if (game.equippedSkills.some(id => !SKILL_GACHA_SKILLS[id])) game.equippedSkills = game.equippedSkills.filter(id => SKILL_GACHA_SKILLS[id]); return game.equippedSkills; }
function isSkillEquipped(id) { return getEquippedSkills().includes(id); }
const SKILL_ORDER = Object.keys(SKILL_GACHA_SKILLS);
function getSkillBasePrice(id) { return Math.round(100 * Math.pow(1.3, Math.max(0, SKILL_ORDER.indexOf(id))) / 10) * 10; }
function getSkillBuyCost(id) { // 解放 → Lv10まではLvアップごとに×2.5、その先は多項式でゆるやかに増える（高Lvまで届くように）
  const lv = game.shopOwned[id] ? getSkillLevel(id) : 0;
  const mult = Math.pow(2.5, Math.min(lv, 10)) * (lv > 10 ? Math.pow(lv - 9, 2) : 1);
  return coinPrice(Math.round(getSkillBasePrice(id) * mult));
}
let lastSetSkill = null; // 直前にセットしたスキル（その枠だけアニメさせる）
