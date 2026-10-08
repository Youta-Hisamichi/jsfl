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
  sage: 'assets/img/companions/sage.webp', // スキルの指南役（仲間ページのギルドマスターと見分けやすいように）
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
  upgrade: [() => renderUpgradeList()],
  coinshop: [() => renderCoinShopList()],
  gemshop: [() => renderShopList(), () => renderSupergemShopList()],
  gacha: [() => renderEvolutionList()],
  companion: [() => renderCompanionList()],
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
  if (name === 'gemshop') renderRebirthShopList();
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
    if (remaining > 0) {
      const sec = Math.ceil(remaining / 1000);
      btn.dataset.html = '';
      btn.textContent = `🎬 次の動画まで ${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
    } else {
      const adHtml = isAdFree() ? `${xi('x_present')} 広告なしで ${xi('x_gem')}${REWARD_AD_GEMS} GET` : `🎬 動画を見て ${xi('x_gem')}${REWARD_AD_GEMS} GET`;
      if (btn.dataset.html !== adHtml) { btn.innerHTML = adHtml; btn.dataset.html = adHtml; }
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
  switchTab('gemshop');
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

rankDailyBtn.addEventListener('click', () => {
  rankingMode = 'daily';
  rankDailyBtn.classList.add('active'); rankDailyBtn.style.background = '#142d39';
  rankStageBtn.classList.remove('active'); rankStageBtn.style.background = 'transparent';
  renderRanking();
});
rankStageBtn.addEventListener('click', () => {
  rankingMode = 'stage';
  rankStageBtn.classList.add('active'); rankStageBtn.style.background = '#142d39';
  rankDailyBtn.classList.remove('active'); rankDailyBtn.style.background = 'transparent';
  renderRanking();
});
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

const HOW_TO_PLAY_TEXT_JA = '・円の中を自機（青）と敵が反射しながら自動で戦います。\n・サークルをタップするたびに、自機が敵に向かって加速し、次に敵にぶつかったときのダメージも上がります（1タップ+25%、最大+200%。ぶつかると元に戻ります）。\n・ショップでタックルを開放すると、サークルを長押ししてから離して敵を追尾する強力な体当たり（タメ打ち）を放てます。長く押すほど強力で、自機が壁で跳ねた瞬間に離すと「壁蹴り」で威力2倍（超タックルも開放可能）。\n・ぶつかったときにどちらが攻撃できるかは「迫り合い」の強さで決まります（強化タブで強化できます）。\n・遺物「反射のコンパス」を持っていると、壁に反射するたびにコインを獲得します。\n・敵を倒すとコインを獲得し、強化タブで自機を強化できます。\n・10階ごとに強力なボスが出現します。\n・力尽きると転生し、コイン・強化・仲間・階はリセットされますが、ランダムでアーティファクトを獲得できます。\n・強化／ショップ／仲間／ガチャなど各タブで戦力を強化していきましょう。';
const HOW_TO_PLAY_TEXT_EN = 'Your ball (blue) and the enemy automatically fight by bouncing inside the circle.\nEach tap in the arena sends your ball toward the enemy and speeds it up (the speed resets when it hits an enemy).\nAfter unlocking Tackle in the rebirth shop, press and hold the arena, then release to launch a powerful homing tackle. The longer you hold, the stronger it gets (Super Tackle can also be unlocked).\nWho gets to attack on a collision depends on your Clash power vs the enemy\'s (upgradeable).\nWith the Reflection Compass relic, each wall bounce gives a small amount of coins.\nDefeating enemies grants coins you can spend on upgrades.\nA powerful boss appears every 10 stages.\nWhen you fall, you reincarnate: coins, upgrades, allies and stage reset, but you gain a random artifact.\nStrengthen yourself using the Upgrade / Shop / Allies / Gacha tabs.';
const CONTACT_TEXT_JA = 'ご意見・不具合報告などは下記メールアドレスまでお気軽にご連絡ください。\n\n📧 hisashi.app@gmail.com';
const CONTACT_TEXT_EN = 'For feedback or bug reports, please feel free to contact us at the email address below.\n\n📧 hisashi.app@gmail.com';
const TERMS_TEXT_JA = '本アプリは無料でお楽しみいただけるブラウザゲームです。\n\n・本アプリの利用により生じたいかなる損害についても、開発者は責任を負いません。\n・ゲーム内のデータ（コイン・ジェム等）は現実の金銭的価値を持ちません。\n・不具合やバランス調整のため、予告なくゲーム内容を変更する場合があります。\n・本アプリの複製・改変・再配布は禁止します。\n・反社会的・迷惑行為（不正なデータ改ざん等）が確認された場合、利用をお断りする場合があります。\n\n本アプリを利用することで、これらの事項に同意したものとみなします。';
const TERMS_TEXT_EN = 'This app is a free browser game.\n\n・The developer is not responsible for any damages arising from the use of this app.\n・In-game data (coins, gems, etc.) has no real-world monetary value.\n・Game content may change without notice for bug fixes or balance adjustments.\n・Copying, modifying, or redistributing this app is prohibited.\n・Access may be restricted if anti-social or disruptive behavior (such as data tampering) is confirmed.\n\nBy using this app, you are considered to have agreed to these terms.';
const PRIVACY_TEXT_JA = '本アプリのプライバシーポリシーです。\n\n・本アプリはブラウザのローカルストレージにのみゲーム進行データを保存します。\n・氏名・メールアドレス等、個人を特定できる情報を収集することはありません。\n・お問い合わせでいただいたメールアドレスは、返信目的以外には使用しません。\n・第三者への情報提供は行いません。\n\nご不明な点はお問い合わせ窓口までご連絡ください。';
const PRIVACY_TEXT_EN = 'Privacy Policy for this app.\n\n・This app only saves game progress data in your browser\'s local storage.\n・We do not collect personally identifiable information such as your name or email address.\n・Any email address provided via contact will only be used to respond to your inquiry.\n・We do not share information with third parties.\n\nPlease contact us if you have any questions.';

const I18N = {
  ja: {
    tabGame: 'ゲーム', tabUpgrade: '強化', tabCompanion: '仲間', tabShop: 'スキル', tabArtifact: '遺物', tabGem: 'ショップ', tabGacha: '進化', tabRecords: '戦績', tabRanking: 'ランキング',
    settingsTitle: '⚙️ 設定', settingsSub: '音量やヘルプの設定です',
    bgmLabel: '🎵 BGM音量　', sfxLabel: '🔊 効果音音量　', vibrationLabel: '📳 振動（対応スマホのみ）',
    howToPlayBtn: '📖 遊び方', contactBtn: '✉️ お問い合わせ', termsBtn: '📜 利用規約', privacyBtn: '🔒 プライバシーポリシー',
    langLabel: '🌐 言語 / Language', devLabel: '👤 開発者', closeBtn: '閉じる',
    contactRow: 'お問い合わせ: <a href="mailto:hisashi.app@gmail.com" style="color:#7ed0ff;">hisashi.app@gmail.com</a>',
    howToPlayText: HOW_TO_PLAY_TEXT_JA, contactText: CONTACT_TEXT_JA, termsText: TERMS_TEXT_JA, privacyText: PRIVACY_TEXT_JA,
  },
  en: {
    tabGame: 'Game', tabUpgrade: 'Upgrade', tabCompanion: 'Allies', tabShop: 'Skills', tabArtifact: 'Relics', tabGem: 'Shop', tabGacha: 'Evolve', tabRecords: 'Records', tabRanking: 'Ranking',
    settingsTitle: '⚙️ Settings', settingsSub: 'Volume and help settings',
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
  ['転生すると何がなくなりますか？', 'コイン・強化・スキル・仲間・階は最初に戻ります。\n遺物・ジェム・回復ポーション・スキル枠・パーティ枠・サブスクは引き継がれます。転生するたびに遺物がもらえて、次の周回が楽になります。'],
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

const ICON_IMAGES = {"x_gb1":"assets/img/icons/x_gb1.webp","x_gb2":"assets/img/icons/x_gb2.webp","x_gb3":"assets/img/icons/x_gb3.webp","x_gb4":"assets/img/icons/x_gb4.webp","x_emb_hero":"assets/img/icons/x_emb_hero.webp","x_emb_vet":"assets/img/icons/x_emb_vet.webp","x_tower":"assets/img/icons/x_tower.webp","art_swordL":"assets/img/icons/art_swordL.webp","art_swordM":"assets/img/icons/art_swordM.webp","x_potion":"assets/img/icons/x_potion.webp","tab_game":"assets/img/icons/tab_game.webp","tab_upgrade":"assets/img/icons/tab_upgrade.webp","tab_companion":"assets/img/icons/tab_companion.webp","tab_coinshop":"assets/img/icons/tab_coinshop.webp","tab_artifact":"assets/img/icons/tab_artifact.webp","tab_gemshop":"assets/img/icons/tab_gemshop.webp","tab_gacha":"assets/img/icons/tab_gacha.webp","tab_records":"assets/img/icons/tab_records.webp","tab_ranking":"assets/img/icons/tab_ranking.webp","art_heart":"assets/img/icons/art_heart.webp","art_ring":"assets/img/icons/art_ring.webp","art_book":"assets/img/icons/art_book.webp","art_armor":"assets/img/icons/art_armor.webp","art_compass":"assets/img/icons/art_compass.webp","art_calendar":"assets/img/icons/art_calendar.webp","art_gauntlet":"assets/img/icons/art_gauntlet.webp","art_hourglass":"assets/img/icons/art_hourglass.webp","art_turbo":"assets/img/icons/art_turbo.webp","art_eye":"assets/img/icons/art_eye.webp","art_fang":"assets/img/icons/art_fang.webp","art_lens":"assets/img/icons/art_lens.webp","art_feather":"assets/img/icons/art_feather.webp","art_crest":"assets/img/icons/art_crest.webp","art_gauntletCounter":"assets/img/icons/art_gauntletCounter.webp","art_banner":"assets/img/icons/art_banner.webp","art_amulet":"assets/img/icons/art_amulet.webp","art_pinchMask":"assets/img/icons/art_pinchMask.webp","art_rebirthOrb":"assets/img/icons/art_rebirthOrb.webp","sk_skillSpecial":"assets/img/icons/sk_skillSpecial.webp","sk_skillAccel":"assets/img/icons/sk_skillAccel.webp","sk_skillHeal":"assets/img/icons/sk_skillHeal.webp","sk_skillBarrier":"assets/img/icons/sk_skillBarrier.webp","sk_skillPoison":"assets/img/icons/sk_skillPoison.webp","sk_skillParalyze":"assets/img/icons/sk_skillParalyze.webp","sk_skillAtkUp":"assets/img/icons/sk_skillAtkUp.webp","sk_skillRegen":"assets/img/icons/sk_skillRegen.webp","sk_skillSilence":"assets/img/icons/sk_skillSilence.webp","sk_skillDeath":"assets/img/icons/sk_skillDeath.webp","sk_skillCoinStrike":"assets/img/icons/sk_skillCoinStrike.webp","sk_skillZeni":"assets/img/icons/sk_skillZeni.webp","sk_skillMystery":"assets/img/icons/sk_skillMystery.webp","sk_skillCompRush":"assets/img/icons/sk_skillCompRush.webp","sk_skillNova":"assets/img/icons/sk_skillNova.webp","sk_skillBlast":"assets/img/obstacles/bomb.webp","up_atk":"assets/img/icons/up_atk.webp","up_crit":"assets/img/icons/up_crit.webp","up_critDmg":"assets/img/icons/up_critDmg.webp","up_accuracy":"assets/img/icons/up_accuracy.webp","up_bossDmg":"assets/img/icons/up_bossDmg.webp","up_hp":"assets/img/icons/up_hp.webp","up_clash":"assets/img/icons/up_clash.webp","up_evasion":"assets/img/icons/up_evasion.webp","up_coin":"assets/img/icons/up_coin.webp","up_compAtk":"assets/img/icons/up_compAtk.webp","up_rush":"assets/img/icons/up_rush.webp","g_power":"assets/img/icons/g_power.webp","g_vitality":"assets/img/icons/g_vitality.webp","g_fortune":"assets/img/icons/g_fortune.webp","g_meteor":"assets/img/icons/g_meteor.webp","g_chain":"assets/img/icons/g_chain.webp","g_critical":"assets/img/icons/g_critical.webp","g_critdmg":"assets/img/icons/g_critdmg.webp","g_aim":"assets/img/icons/g_aim.webp","g_evade":"assets/img/icons/g_evade.webp","g_slayer":"assets/img/icons/g_slayer.webp","g_counter":"assets/img/icons/g_counter.webp","g_bond":"assets/img/icons/g_bond.webp","g_pinch":"assets/img/icons/g_pinch.webp","g_guard":"assets/img/icons/g_guard.webp","g_phoenix":"assets/img/icons/g_phoenix.webp","x_reborn":"assets/img/icons/x_reborn.webp","x_book":"assets/img/icons/x_book.webp","x_gem":"assets/img/icons/x_gem.webp","x_settings":"assets/img/icons/x_settings.webp","x_chest1":"assets/img/icons/x_chest1.webp","x_chest2":"assets/img/icons/x_chest2.webp","x_chest4":"assets/img/icons/x_chest4.webp","x_chest6":"assets/img/icons/x_chest6.webp","x_heart":"assets/img/icons/x_heart.webp","x_break":"assets/img/icons/x_break.webp","x_present":"assets/img/icons/x_present.webp","x_attack":"assets/img/icons/x_attack.webp","x_up_attack":"assets/img/icons/x_up_attack.webp","x_up_defense":"assets/img/icons/x_up_defense.webp","x_up_coin":"assets/img/icons/x_up_coin.webp","x_up_companion":"assets/img/icons/x_up_companion.webp","x_lock":"assets/img/icons/x_lock.webp"};
const COIN_IMG_SRC = 'data:image/webp;base64,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'; // コインのアイコン（ファイル数を増やさないよう埋め込み）
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
// ===== 進化：攻撃力かHPを選び、ジェムと進化の羽を捧げて進化。5段階のレア度で 2・3・8・25・256倍 が出て、進化率に掛け算される =====
const EVO_TIERS = [
  { rarity: 'common', mult: 2, base: 72 }, { rarity: 'rare', mult: 3, base: 20 }, { rarity: 'epic', mult: 8, base: 6.5 },
  { rarity: 'legendary', mult: 25, base: 1.35 }, { rarity: 'mythic', mult: 256, base: 0.15 },
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
  atk: { icon: '⚔️', name: '攻撃力', desc: '+15%', baseCost: 25, group: 'attack' },
  hp: { icon: '❤️', name: '最大HP', desc: '+20%', baseCost: 25, group: 'defense' },
  cAtk: { icon: '🚩', name: '仲間の攻撃力', desc: '+15%', baseCost: 40, group: 'companion' },
  cSpd: { icon: '💨', name: '仲間の攻撃頻度', desc: '+5%', baseCost: 60, group: 'companion' },
  cHp: { icon: '🧿', name: '仲間の最大HP', desc: '+20%', baseCost: 40, group: 'companion' },
};
const UPGRADE_LEAPS = [
  { every: 1000, mult: 2, name: '超大飛躍', color: '#ff5cd6' },
  { every: 100, mult: 1.5, name: '大飛躍', color: '#e08a00' },
  { every: 10, mult: 1.1, name: 'プチ飛躍', color: '#2a9d55' },
];
// そのレベルで到達済みの飛躍倍率。どの飛躍も「足し算で積み上がる倍率」をかけ合わせる（指数的に爆発して数値があふれないように）
// 例：初めての大飛躍で×1.5、2回目で×2.0、3回目で×2.5…（超大飛躍も×2→×3→×4…）
function upgradeLeapMult(level) {
  level = Math.max(0, Math.min(1e12, Number(level) || 0));
  const n1000 = Math.floor(level / 1000), n100 = Math.floor(level / 100) - n1000, n10 = Math.floor(level / 10) - Math.floor(level / 100);
  return (1 + 0.1 * n10) * (1 + 0.5 * n100) * (1 + 1 * n1000);
}
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
SHOP_ITEMS.autoUpgrade = { icon: '🤖', name: 'オート強化', desc: 'たまったコインで攻撃力・最大HP・仲間の強化を自動で上げる（強化ページでON/OFF）', cost: 20, unlockKey: 'autoUpgradeUnlocked' };
SHOP_ITEMS.potion = { icon: '🧪', name: '回復ポーション ×3', desc: 'HPを最大値の45%回復（ゲーム画面のボタンで使用）。1回で3個手に入る', cost: 1, consumableKey: 'potions', bundle: 3 };
SHOP_ITEMS.redPotion = { icon: '<i class="ico-redpot"></i>', name: 'スキル全開の赤ポーション ×3', desc: 'すべてのスキルの待ち時間を一瞬でリセット（ゲーム画面のスキル列の左端で使用）。1回で3個手に入る', cost: 1, consumableKey: 'redPotions', bundle: 3 };
const POTION_HEAL_RATIO = 0.45;
function isShopItemOwned(id) {
  const item = SHOP_ITEMS[id];
  if (item.consumableKey) return false; // 消費アイテムは何個でも買える
  if (item.stackKey) return (game[item.stackKey] || 0) >= item.maxStack; // 重ねがけ系は上限まで買えば「所持済み」
  return item.unlockKey ? !!game[item.unlockKey] : !!game.shopOwned[id];
}
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
const SKILL_GACHA_BASE_COST = 100, SKILL_GACHA_COST_GROWTH = 1.15; // 1回ごとに値上げ（転生でリセット）
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
const WEAPON_GACHA_BASE_COST = 400, WEAPON_GACHA_COST_GROWTH = 1.15; // サブウェポンガチャも1回ごとに値上げ（転生でリセット）
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
const COMP_UP_ICONS = {"cAtk": "data:image/webp;base64,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", "cSpd": "data:image/webp;base64,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", "cHp": "data:image/webp;base64,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"};
for (const id in COMP_UP_ICONS) if (UPGRADES[id]) UPGRADES[id].img = COMP_UP_ICONS[id];
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

const COMPANIONS = {
  knight: { icon: '🛡️', name: '守護の騎士', stat: 'hp',    desc: '最大HP上昇',     rarity: 'rare', weight: 35, recruitCost: 90, baseBonus: 0.08, perLevel: 0.03, levelCostBase: 20,
            trait: '【鉄壁】受けるダメージ半減／【盾撃】当てた敵を0.8秒気絶させ大きく弾き飛ばす' },
  archer: { icon: '🏹', name: '疾風の射手', stat: 'atk',   desc: '攻撃力上昇',     rarity: 'epic', weight: 18, recruitCost: 90, baseBonus: 0.08, perLevel: 0.03, levelCostBase: 20,
            trait: '【狙撃】3秒ごとに敵を追尾する矢を自動で放つ' },
  witch:  { icon: '🧙', name: '黄金の魔女', stat: 'coin',  desc: 'コイン獲得上昇', rarity: 'epic', weight: 12, recruitCost: 130, baseBonus: 0.10, perLevel: 0.04, levelCostBase: 25,
            trait: '【錬金】攻撃を当てるたびにコイン獲得／【癒し】10秒ごとに自機のHPを8%回復' },
  sprite: { icon: '🧚', name: '俊敏の妖精', stat: 'speed', desc: '移動速度上昇',   rarity: 'rare', weight: 35, recruitCost: 80, baseBonus: 0.06, perLevel: 0.03, levelCostBase: 20,
            trait: '【急所突き】クリティカル率+30%／【追い風】当てると自機が1.5秒加速' },
  golem:  { icon: '🗿', name: '岩石ゴーレム', stat: 'hp',    desc: '最大HP上昇',     rarity: 'common', weight: 30, recruitCost: 60, baseBonus: 0.06, perLevel: 0.02, levelCostBase: 15,
            trait: '【巨体】体が大きく、HPが2倍' },
  monk:   { icon: '🥋', name: '拳聖の武僧', stat: 'atk',   desc: '攻撃力上昇',     rarity: 'rare', weight: 25, recruitCost: 90, baseBonus: 0.07, perLevel: 0.03, levelCostBase: 20,
            trait: '【連撃】攻撃が当たると、追加でもう1発（50%ダメージ）' },
  bard:   { icon: '🎸', name: '旅の吟遊詩人', stat: 'coin',  desc: 'コイン獲得上昇', rarity: 'rare', weight: 20, recruitCost: 90, baseBonus: 0.08, perLevel: 0.03, levelCostBase: 20,
            trait: '【鼓舞】仲間全員の攻撃力 +10%（吟遊詩人1人ごと）' },
  ninja:  { icon: '🥷', name: '影の忍者',   stat: 'speed', desc: '移動速度上昇',   rarity: 'epic', weight: 10, recruitCost: 130, baseBonus: 0.06, perLevel: 0.03, levelCostBase: 25,
            trait: '【毒刃】当てた敵を毒状態にする（毒スキルなしでも発動）' },
  priest: { icon: '⛪', name: '聖なる司祭', stat: 'hp',    desc: '最大HP上昇',     rarity: 'epic', weight: 10, recruitCost: 130, baseBonus: 0.08, perLevel: 0.03, levelCostBase: 25,
            trait: '【蘇生】12秒ごとに倒れた仲間を1人復活、いなければ仲間全員のHPを20%回復' },
  dragon: { icon: '🐉', name: '覇竜バハムート', stat: 'atk', desc: '攻撃力上昇',   rarity: 'legendary', weight: 2, recruitCost: 300, baseBonus: 0.15, perLevel: 0.05, levelCostBase: 50,
            trait: '【覇者の力】仲間全員の攻撃力を合わせた攻撃力で攻撃する（激レア）' },
  thief:  { icon: '🗡️', name: '身軽な盗賊', stat: 'speed', desc: '移動速度上昇',   rarity: 'rare', weight: 25, recruitCost: 90, baseBonus: 0.06, perLevel: 0.03, levelCostBase: 20,
            trait: '【盗む】当てるたびに30%の確率でコインを盗む' },
  lancer: { icon: '🔱', name: '勇猛な槍兵', stat: 'atk',   desc: '攻撃力上昇',     rarity: 'rare', weight: 25, recruitCost: 90, baseBonus: 0.07, perLevel: 0.03, levelCostBase: 20,
            trait: '【貫通】ボスへのダメージ1.5倍' },
  samurai:{ icon: '⚔️', name: '流浪の侍',   stat: 'atk',   desc: '攻撃力上昇',     rarity: 'epic', weight: 10, recruitCost: 130, baseBonus: 0.09, perLevel: 0.035, levelCostBase: 25,
            trait: '【居合】当てたとき25%で攻撃力3倍の一閃' },
  sage:   { icon: '📖', name: '叡智の賢者', stat: 'coin',  desc: 'コイン獲得上昇', rarity: 'epic', weight: 10, recruitCost: 130, baseBonus: 0.10, perLevel: 0.04, levelCostBase: 25,
            trait: '【魔導】5秒ごとに攻撃力2倍の魔法弾を放つ' },
  angel:  { icon: '👼', name: '大天使ミカエル', stat: 'hp', desc: '最大HP上昇',   rarity: 'legendary', weight: 2, recruitCost: 300, baseBonus: 0.15, perLevel: 0.05, levelCostBase: 50,
            trait: '【祝福】10秒ごとに自機と仲間全員のHPを15%回復し、倒れた仲間を全員復活（激レア）' },
  heroine:{ icon: '💠', name: '白銀の聖女リリア', stat: 'hp', desc: '最大HP上昇', rarity: 'epic', weight: 10, recruitCost: 130, baseBonus: 0.08, perLevel: 0.03, levelCostBase: 25,
            trait: '【聖光】8秒ごとに自機のHPを10%回復' },
  mage:   { icon: '🔮', name: '紫紺の魔女ノワール', stat: 'atk', desc: '攻撃力上昇', rarity: 'epic', weight: 10, recruitCost: 130, baseBonus: 0.09, perLevel: 0.035, levelCostBase: 25,
            trait: '【爆炎】6秒ごとに攻撃力3倍の火球を放つ' },
  ranger: { icon: '🏹', name: '森の狩人ロビン', stat: 'atk', desc: '攻撃力上昇', rarity: 'rare', weight: 25, recruitCost: 90, baseBonus: 0.07, perLevel: 0.03, levelCostBase: 20,
            trait: '【三連矢】4秒ごとに追尾する矢を3本放つ' },
  warrior:{ icon: '🛡️', name: '鋼の戦士ガイ', stat: 'hp', desc: '最大HP上昇', rarity: 'rare', weight: 25, recruitCost: 90, baseBonus: 0.07, perLevel: 0.03, levelCostBase: 20,
            trait: '【雄叫び】12秒ごとに自機の攻撃力を4秒間1.5倍' },
  cat:    { icon: '🐱', name: '相棒ニャンタ', stat: 'coin', desc: 'コイン獲得上昇', rarity: 'common', weight: 30, recruitCost: 60, baseBonus: 0.06, perLevel: 0.02, levelCostBase: 15,
            trait: '【拾い物】7秒ごとにコインを拾ってくる' },
  paladin:{ icon: '⚜️', name: '聖騎士パラディン', stat: 'hp', desc: '最大HP上昇', rarity: 'epic', weight: 10, recruitCost: 130, baseBonus: 0.09, perLevel: 0.035, levelCostBase: 25,
            trait: '【聖盾】10秒ごとに自機と仲間全員のHPを8%回復' },
  dragoon:{ icon: '🐲', name: '竜騎士ジーク', stat: 'atk', desc: '攻撃力上昇', rarity: 'legendary', weight: 2, recruitCost: 300, baseBonus: 0.14, perLevel: 0.05, levelCostBase: 50,
            trait: '【竜槍ジャンプ】9秒ごとに敵へ急降下し攻撃力5倍の一撃（激レア）' },
  summoner:{ icon: '🦊', name: '召喚士ミント', stat: 'atk', desc: '攻撃力上昇', rarity: 'epic', weight: 10, recruitCost: 130, baseBonus: 0.09, perLevel: 0.035, levelCostBase: 25,
            trait: '【霊獣召喚】7秒ごとに追尾する霊獣を2体放つ' },
  alchemist:{ icon: '⚗️', name: '錬金術師パラケル', stat: 'coin', desc: 'コイン獲得上昇', rarity: 'rare', weight: 25, recruitCost: 90, baseBonus: 0.08, perLevel: 0.03, levelCostBase: 20,
            trait: '【錬金】12秒ごとにコインをまとめて作り出す' },
  gunner: { icon: '🔫', name: '機工士ボルト', stat: 'atk', desc: '攻撃力上昇', rarity: 'rare', weight: 25, recruitCost: 90, baseBonus: 0.07, perLevel: 0.03, levelCostBase: 20,
            trait: '【狙撃】5秒ごとに攻撃力2.5倍の高速弾を撃つ' },
  pirate: { icon: '🏴‍☠️', name: '海賊キャプテン・レイ', stat: 'coin', desc: 'コイン獲得上昇', rarity: 'epic', weight: 10, recruitCost: 130, baseBonus: 0.10, perLevel: 0.04, levelCostBase: 25,
            trait: '【略奪】敵に当てるとたまにコインを奪う（8秒に1回まで）' }
};
const COMPANION_SPRITES = {
  heroine: 'assets/img/companions/heroine.webp',
  mage: 'assets/img/companions/mage.webp',
  ranger: 'assets/img/companions/ranger.webp',
  warrior: 'assets/img/companions/warrior.webp',
  cat: 'assets/img/companions/cat.webp',
  knight: 'assets/img/companions/knight.webp',
  archer: 'assets/img/companions/archer.webp',
  witch: 'assets/img/companions/witch.webp',
  sprite: 'assets/img/companions/sprite.webp',
  golem: 'assets/img/companions/golem.webp',
  monk: 'assets/img/companions/monk.webp',
  bard: 'assets/img/companions/bard.webp',
  ninja: 'assets/img/companions/ninja.webp',
  priest: 'assets/img/companions/priest.webp',
  dragon: 'assets/img/companions/dragon.webp',
};
Object.assign(COMPANION_SPRITES, {
  thief: 'assets/img/companions/thief.webp',
  lancer: 'assets/img/companions/lancer.webp',
  samurai: 'assets/img/companions/samurai.webp',
  sage: 'assets/img/companions/sage.webp',
  angel: 'assets/img/companions/angel.webp',
  paladin: 'assets/img/companions/paladin.webp',
  dragoon: 'assets/img/companions/dragoon.webp',
  summoner: 'assets/img/companions/summoner.webp',
  alchemist: 'assets/img/companions/alchemist.webp',
  gunner: 'assets/img/companions/gunner.webp',
  pirate: 'assets/img/companions/pirate.webp',
});
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
const COMPANION_UNLOCK_COST = { epic: 80, legendary: 200 };
function companionNeedsUnlock(id) { return !!COMPANION_UNLOCK_COST[COMPANIONS[id].rarity]; }
function isCompanionUnlocked(id) { return !companionNeedsUnlock(id) || !!(game.companionUnlocks && game.companionUnlocks[id]); }
COMPANION_IDS.filter(companionNeedsUnlock).forEach(id => {
  const c = COMPANIONS[id];
  REBIRTH_SHOP_ITEMS['comp_' + id] = { icon: c.icon, name: c.name + ' 開放', desc: '仲間召喚で出るようになる（永続）', rarity: c.rarity, cost: COMPANION_UNLOCK_COST[c.rarity], companionId: id,
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


// 転生Lv：転生前に進んだ階が深いほど多く上がる（10階ごとに+1、最低+1）。1Lvごとに攻撃力・最大HP +3%
const REBIRTH_LV_BONUS = 0.03;
function getRebirthLvGain(stage) { return 1 + Math.floor(Math.max(0, stage - 1) / 10); }
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
  b.atkMult += (up.atk || 0) * 0.15;
  b.hpMult += (up.hp || 0) * 0.20;
  b.tackleMult += (up.tackle || 0) * 0.08;
  b.companionAtkMult += (up.compAtk || 0) * 0.08;
  b.meleeMult = (1 + (up.melee || 0) * 0.10) * upgradeLeapMult(up.melee || 0); // 接近戦：ふつうの衝突ダメージ
  b.rushDmgUp = (1 + (up.rush || 0) * 0.12) * upgradeLeapMult(up.rush || 0); // 体当たり：引っぱり攻撃のダメージ
  // 強化の飛躍：10Lvごとにプチ飛躍・100Lvごとに大飛躍・1000Lvごとに超大飛躍（倍率で掛かる）
  b.atkMult *= upgradeLeapMult(up.atk || 0);
  b.hpMult *= upgradeLeapMult(up.hp || 0);
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
function renderUpgradeList() {
  const row = ([id, upgrade]) => {
    const level = game.upgrades[id];
    if (level >= getUpgradeLevelCap(id)) {
      return `<div class="upgrade-row">
      <div class="upgrade-btn upgrade-card is-disabled" data-upgrade-card="${id}"><span class="item-icon">${ico(upgrade)}</span> <b class="up-title">${upgrade.name}</b> Lv.${level}（MAX）<span class="upgrade-value">${formatUpgradeStat(id, getUpgradeStatValue(id))}</span><span class="cost">上限に達しました</span></div>
      <button class="upgrade-max-btn one-btn is-disabled" data-upgrade="${id}">+1<span>Lv.</span></button>
      <button class="upgrade-max-btn pct-btn is-disabled" data-upgrade-pct="${id}">10%<span>—</span></button>
      <button class="upgrade-max-btn is-disabled" data-upgrade-max="${id}">MAX<span>—</span></button>
    </div>`;
    }
    const cost = getUpgradeCost(id);
    const maxCount = getMaxAffordableUpgradeLevels(id, game.coins);
    const pctCount = getMaxAffordableUpgradeLevels(id, game.coins * PCT_BUDGET);
    const nl = nextUpgradeLeap(level);
    const leapTag = nl.target - level === 1 ? `<span class="upgrade-leap leap-next" style="--lc:${nl.leap.color}">✨ 次で${nl.leap.name}！（${nl.leap.every === 10 ? '+10%' : '×' + nl.leap.mult}）</span>` : ''; // あと1回で飛躍するときだけ知らせる
    const now = getUpgradeStatValue(id);
    game.upgrades[id] = level + 1;
    const next = getUpgradeStatValue(id);
    game.upgrades[id] = level;
    return `<div class="upgrade-row">
      <div class="upgrade-btn upgrade-card ${game.coins < cost ? 'is-disabled' : ''}" data-upgrade-card="${id}"><span class="item-icon">${ico(upgrade)}</span> <b class="up-title">${upgrade.name}</b> Lv.${level}<span>${upgrade.desc}</span>${leapTag}<span class="upgrade-value">${formatUpgradeStat(id, now)} → <b>${formatUpgradeStat(id, next)}</b></span><span class="cost">${COIN_ICO} ${formatCoinNumber(cost)}</span></div>
      <button class="upgrade-max-btn one-btn ${game.coins < cost ? 'is-disabled' : ''}" data-upgrade="${id}">+1<span>Lv.UP</span></button>
      <button class="upgrade-max-btn pct-btn ${pctCount < 1 ? 'is-disabled' : ''}" data-upgrade-pct="${id}">10%<span>+${pctCount} Lv.</span></button>
      <button class="upgrade-max-btn ${maxCount < 1 ? 'is-disabled' : ''}" data-upgrade-max="${id}">MAX<span>+${maxCount} Lv.</span></button>
    </div>`;
  };
  upgradeList.innerHTML = Object.entries(UPGRADES).map(row).join('');
}
function renderShopList() {
  shopList.innerHTML = Object.entries(SHOP_ITEMS).filter(([id]) => CLONES_ENABLED || !CLONE_ONLY_ITEMS.includes(id)).map(([id, item]) => {
    const owned = isShopItemOwned(id);
    const locked = !owned && item.requires && !game[item.requires];
    const gcost = gemPrice(getShopItemBaseCost(id));
    const stackNote = item.consumableKey ? `（所持 ${game[item.consumableKey] || 0}個）` : item.stackKey ?`（現在 +${((game[item.stackKey] || 0) * TACKLE_PIERCE_MS_PER_LV / 1000).toFixed(1)}秒・${game[item.stackKey] || 0}/${item.maxStack}）` : '';
    return `<button class="shop-btn ${owned || locked || game.gems < gcost ? 'is-disabled' : ''}" data-shop="${id}"><span class="shop-head"><span class="item-icon">${ico(item)}</span><span class="shop-name">${item.name}</span></span><span class="shop-desc">${owned ? (item.unlockKey ? '開放済み' : item.stackKey ? `最大（+${(item.maxStack * TACKLE_PIERCE_MS_PER_LV / 1000).toFixed(1)}秒）` : '購入済み') : locked ? '🔒 先にタックル開放が必要' : item.desc + stackNote}</span><span class="cost">${owned ? (item.unlockKey ? '✓ 開放済み' : item.stackKey ? '✓ 最大' : '✓ 所持中') : '💎 ' + gcost}</span></button>`;
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
