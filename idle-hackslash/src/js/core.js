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
  debugToggleBtn.textContent = open ? '🛠️ デバッグ一覧を閉じる' : '🛠️ デバッグ一覧';
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
};
const SHOPKEEPERS = {
  upgrade:   { npc: 'smith',     name: '鍛冶屋のガンツ', lines: ['いらっしゃい！ 腕も体も鍛えていきな！', 'コインがあるなら、ガンガン強化だ！', '長押しすりゃ一気に鍛えてやるぜ。', '転生したら鍛え直しだ。気にすんな！'] },
  companion: { npc: 'guild',     name: 'ギルドマスター', lines: ['頼れる仲間を紹介しよう。', '仲間が揃えば、どんな敵も怖くないぞ。', '同じ仲間を呼べば、パーティが厚くなる。', 'レアな仲間はショップで開放できるぞ。'] },
  coinshop:  { npc: 'merchant',  name: '行商人のマルコ', lines: ['へいらっしゃい！ 掘り出し物あるよ！', '好きなスキルを選んで鍛えな！', 'お代はコインで結構ですよ〜。', '戦闘中しか使えない品もあるから気をつけて！'] },
  artifact:  { npc: 'scholar',   name: '学者のリナ', lines: ['遺物の研究ならお任せください。', 'この遺物、とても興味深い力を秘めています…', '集めた遺物は、転生しても力を失いません。', '図鑑を埋めるのが楽しみですね！'] },
  gemshop:   { npc: 'princess',  name: 'エメラ姫', lines: ['ようこそ、わたくしの宝石店へ♪', 'ジェムの輝きは永遠ですわ。', 'お気に入りの品は見つかりまして？', '買った効果は転生しても続きますのよ。'] },
  gacha:     { npc: 'fortune',   name: '占い師マダム', lines: ['ふふ…あなたの運命を占ってあげる。', '水晶玉が…光っているわ…！', '10連なら、運命が動くかもしれないわね。', '欠片を集めれば、力は進化するのよ。'] },
  records:   { npc: 'elder',     name: '記録係の長老', lines: ['ほっほっ、よく戦っておるのう。', 'おぬしの戦いの記録、しっかり残しておるぞ。', '図鑑を埋めるのも冒険の楽しみじゃ。', '最高記録を更新する日が楽しみじゃわい。'] },
  ranking:   { npc: 'king',      name: 'アルス王', lines: ['よくぞ参った、勇者よ！', 'ランキングの頂点を目指すのだ！', '今日の戦果、期待しておるぞ。', '上位の者には、わしから称賛を贈ろう。'] },
  settings:  { npc: 'sister',    name: '案内係のシスター', lines: ['お困りのことはありませんか？', '音量はここで調整できますよ。', '遊び方はこちらからご覧ください。', 'ゆっくり休むことも大切ですよ。'] },
};
function renderShopkeeper(tab) {
  const info = SHOPKEEPERS[tab];
  if (!info) return;
  document.querySelectorAll(`.shopkeeper[data-npc-tab="${tab}"]`).forEach(el => {
    const line = info.lines[Math.floor(Math.random() * info.lines.length)];
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
  document.getElementById('gemShortIcon').textContent = options.icon || '💎'; // 絵文字は自動でアイコン画像に置き換わる
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
    + `<div class="cr-end">Thank you for playing!</div><div class="cr-role">© ${new Date().getFullYear()} ${DEVELOPER_NAME}</div>`;
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
  ['ジェムはどうやって手に入れますか？', 'ボス撃破、転生、帰還の反射くじ、動画視聴、メタルスライムの撃破などで手に入ります。ショップで購入することもできます。'],
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

const ICON_IMAGES = {"x_gb1":"assets/img/icons/x_gb1.webp","x_gb2":"assets/img/icons/x_gb2.webp","x_gb3":"assets/img/icons/x_gb3.webp","x_gb4":"assets/img/icons/x_gb4.webp","x_emb_hero":"assets/img/icons/x_emb_hero.webp","x_emb_vet":"assets/img/icons/x_emb_vet.webp","x_tower":"assets/img/icons/x_tower.webp","art_swordL":"assets/img/icons/art_swordL.webp","art_swordM":"assets/img/icons/art_swordM.webp","x_potion":"assets/img/icons/x_potion.webp","tab_game":"assets/img/icons/tab_game.webp","tab_upgrade":"assets/img/icons/tab_upgrade.webp","tab_companion":"assets/img/icons/tab_companion.webp","tab_coinshop":"assets/img/icons/tab_coinshop.webp","tab_artifact":"assets/img/icons/tab_artifact.webp","tab_gemshop":"assets/img/icons/tab_gemshop.webp","tab_gacha":"assets/img/icons/tab_gacha.webp","tab_records":"assets/img/icons/tab_records.webp","tab_ranking":"assets/img/icons/tab_ranking.webp","art_heart":"assets/img/icons/art_heart.webp","art_ring":"assets/img/icons/art_ring.webp","art_book":"assets/img/icons/art_book.webp","art_armor":"assets/img/icons/art_armor.webp","art_compass":"assets/img/icons/art_compass.webp","art_calendar":"assets/img/icons/art_calendar.webp","art_gauntlet":"assets/img/icons/art_gauntlet.webp","art_hourglass":"assets/img/icons/art_hourglass.webp","art_turbo":"assets/img/icons/art_turbo.webp","art_eye":"assets/img/icons/art_eye.webp","art_fang":"assets/img/icons/art_fang.webp","art_lens":"assets/img/icons/art_lens.webp","art_feather":"assets/img/icons/art_feather.webp","art_crest":"assets/img/icons/art_crest.webp","art_gauntletCounter":"assets/img/icons/art_gauntletCounter.webp","art_banner":"assets/img/icons/art_banner.webp","art_amulet":"assets/img/icons/art_amulet.webp","art_pinchMask":"assets/img/icons/art_pinchMask.webp","art_rebirthOrb":"assets/img/icons/art_rebirthOrb.webp","sk_skillSpecial":"assets/img/icons/sk_skillSpecial.webp","sk_skillAccel":"assets/img/icons/sk_skillAccel.webp","sk_skillHeal":"assets/img/icons/sk_skillHeal.webp","sk_skillBarrier":"assets/img/icons/sk_skillBarrier.webp","sk_skillPoison":"assets/img/icons/sk_skillPoison.webp","sk_skillParalyze":"assets/img/icons/sk_skillParalyze.webp","sk_skillAtkUp":"assets/img/icons/sk_skillAtkUp.webp","sk_skillRegen":"assets/img/icons/sk_skillRegen.webp","sk_skillSilence":"assets/img/icons/sk_skillSilence.webp","sk_skillDeath":"assets/img/icons/sk_skillDeath.webp","sk_skillCoinStrike":"assets/img/icons/sk_skillCoinStrike.webp","sk_skillZeni":"assets/img/icons/sk_skillZeni.webp","sk_skillMystery":"assets/img/icons/sk_skillMystery.webp","sk_skillCompRush":"assets/img/icons/sk_skillCompRush.webp","sk_skillNova":"assets/img/icons/sk_skillNova.webp","up_atk":"assets/img/icons/up_atk.webp","up_crit":"assets/img/icons/up_crit.webp","up_critDmg":"assets/img/icons/up_critDmg.webp","up_accuracy":"assets/img/icons/up_accuracy.webp","up_bossDmg":"assets/img/icons/up_bossDmg.webp","up_hp":"assets/img/icons/up_hp.webp","up_clash":"assets/img/icons/up_clash.webp","up_evasion":"assets/img/icons/up_evasion.webp","up_coin":"assets/img/icons/up_coin.webp","up_compAtk":"assets/img/icons/up_compAtk.webp","g_power":"assets/img/icons/g_power.webp","g_vitality":"assets/img/icons/g_vitality.webp","g_fortune":"assets/img/icons/g_fortune.webp","g_meteor":"assets/img/icons/g_meteor.webp","g_chain":"assets/img/icons/g_chain.webp","g_critical":"assets/img/icons/g_critical.webp","g_critdmg":"assets/img/icons/g_critdmg.webp","g_aim":"assets/img/icons/g_aim.webp","g_evade":"assets/img/icons/g_evade.webp","g_slayer":"assets/img/icons/g_slayer.webp","g_counter":"assets/img/icons/g_counter.webp","g_bond":"assets/img/icons/g_bond.webp","g_pinch":"assets/img/icons/g_pinch.webp","g_guard":"assets/img/icons/g_guard.webp","g_phoenix":"assets/img/icons/g_phoenix.webp","x_reborn":"assets/img/icons/x_reborn.webp","x_book":"assets/img/icons/x_book.webp","x_gem":"assets/img/icons/x_gem.webp","x_settings":"assets/img/icons/x_settings.webp","x_chest1":"assets/img/icons/x_chest1.webp","x_chest2":"assets/img/icons/x_chest2.webp","x_chest4":"assets/img/icons/x_chest4.webp","x_chest6":"assets/img/icons/x_chest6.webp","x_heart":"assets/img/icons/x_heart.webp","x_break":"assets/img/icons/x_break.webp","x_present":"assets/img/icons/x_present.webp","x_attack":"assets/img/icons/x_attack.webp","x_up_attack":"assets/img/icons/x_up_attack.webp","x_up_defense":"assets/img/icons/x_up_defense.webp","x_up_coin":"assets/img/icons/x_up_coin.webp","x_up_companion":"assets/img/icons/x_up_companion.webp","x_lock":"assets/img/icons/x_lock.webp"};
function xi(key, cls = 'ico-img') { return ICON_IMAGES[key] ? `<img class="${cls}" src="${ICON_IMAGES[key]}" alt="">` : ''; }
function ico(obj) { return obj && obj.img ? `<img class="ico-img" src="${obj.img}" alt="">` : (obj ? obj.icon : ''); }
const ARTIFACT_POOL = [
  { id: 'heart',  icon: '🗡️', name: '闘志の剣・小',   desc: '攻撃力 +5%', rarity: 'common' },
  { id: 'swordM', icon: '🗡️', name: '闘志の剣・中',   desc: '攻撃力 +30%', rarity: 'rare' },
  { id: 'swordL', icon: '🗡️', name: '闘志の剣・大',   desc: '攻撃力 +150%', rarity: 'epic' },
  { id: 'ring',   icon: '💰', name: '黄金の指輪',     desc: 'コイン獲得 +30%', rarity: 'common' },
  { id: 'book',   icon: '📖', name: '賢者の書',       desc: '攻撃力 +10%・最大HP +10%', rarity: 'common' },
  { id: 'armor',  icon: '🛡️', name: '鉄壁の鎧',       desc: '最大HP +25%', rarity: 'common' },
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
  { id: 'pierceHoof', icon: '🐂', name: '貫きの蹄鉄', desc: '体当たりが敵を貫通し、跳ね返らずに連続攻撃（1個ごとに+1ヒット・最大3個）', rarity: 'epic' },
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
ARTIFACT_POOL.forEach(a => ARTIFACT_BY_ID[a.id] = a);

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
function getEvolveNeed(id) {
  const level = game.evolutions[id];
  const mult = RARITY_INFO[GACHA_POOL[id].rarity].needMult;
  return (level + 1) * mult;
}

const UPGRADES = {
  atk: { icon: '⚔️', name: '攻撃力', desc: '+15%', baseCost: 25, group: 'attack' },
  hp: { icon: '❤️', name: '最大HP', desc: '+20%', baseCost: 25, group: 'defense' },
  melee: { icon: '🗡️', name: '接近戦', desc: '+10%（通常の衝突）', baseCost: 30, group: 'attack' },
  rush: { icon: '💨', name: '体当たり', desc: '+12%（引っぱり攻撃）', baseCost: 30, group: 'attack' },
  compAtk: { icon: '🐾', name: '仲間の攻撃力', desc: '+8%', baseCost: 40, group: 'companion' },
};
const UPGRADE_LEAPS = [
  { every: 1000, mult: 3, name: '超大飛躍', color: '#ff5cd6' },
  { every: 100, mult: 1.5, name: '大飛躍', color: '#e08a00' },
  { every: 10, mult: 1.1, name: 'プチ飛躍', color: '#2a9d55' },
];
// そのレベルで到達済みの飛躍倍率。プチ飛躍は+10%ずつ加算、大飛躍×1.5・超大飛躍×3は掛け算（インフレしすぎないように）
function upgradeLeapMult(level) {
  const n1000 = Math.floor(level / 1000), n100 = Math.floor(level / 100) - n1000, n10 = Math.floor(level / 10) - Math.floor(level / 100);
  return (1 + 0.1 * n10) * Math.pow(1.5, n100) * Math.pow(3, n1000);
}
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
  meteor: { icon: '☄️', name: '流星術', desc: 'メテオダメージ +50%', cost: 12 },
  fairy: { icon: '🧚', name: 'コイン妖精', desc: 'コイン獲得 +30%', cost: 10 },
  summoner: { icon: '🪄', name: '召喚の指輪', desc: '分身上限 +2', cost: 10 },
};
const TACKLE_PIERCE_MS_PER_LV = 100;
function getTacklePierceMs() { return (game.tacklePierceLv || 0) * TACKLE_PIERCE_MS_PER_LV; }
SHOP_ITEMS.potion = { icon: '🧪', name: '回復ポーション', desc: 'HPを最大値の45%回復（ゲーム画面のボタンで使用）', cost: 3, consumableKey: 'potions' };
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
  skillBarrier:  { icon: '🌀', name: 'バリア',   desc: '被ダメージを数回肩代わり' },
  skillPoison:   { icon: '☠️', name: '毒',       desc: '当てた敵を毒状態に' },
  skillParalyze: { icon: '⚡', name: '麻痺',     desc: '雷で敵を麻痺させる' },
  skillAtkUp:    { icon: '💪', name: '攻撃UP',   desc: '取得したら転生まで常に攻撃力1.5倍（セット不要）' },
  skillRegen:    { icon: '🌿', name: 'リヒール', desc: '取得したら転生まで常にHPが少しずつ自動回復（セット不要）' },
  skillSilence:  { icon: '🔇', name: '魔法封じ', desc: '15秒間 敵の魔法・弾を封じる' },
  skillDeath:    { icon: '💀', name: '即死魔法', desc: '一定確率で敵を即死させる（ボスには効きにくい）' },
  skillCoinStrike:{ icon: '🪙', name: 'コイン攻撃', desc: '20秒間 敵めがけてコインを投げまくる（当たるとコイン獲得）・討伐コイン1.5倍' },
  skillZeni:     { icon: '💰', name: 'ゼニ投げ', desc: '手持ちコインの半分を投げて大ダメージ' },
  skillMystery:  { icon: '❓', name: '謎魔法',   desc: '何が起きるかわからない' },
  skillCompRush: { icon: '🐾', name: '仲間特攻', desc: '仲間全員が敵に突撃して大ダメージ' },
  skillNova:     { icon: '💥', name: '全体攻撃', desc: 'サークル内の敵すべてに大ダメージ（大群向き）' }
};
const SKILL_MAX_LEVEL = 10;
const SKILL_CD_CUT_PER_LV = 0.06; // Lv1つごとに待機時間 -6%（Lv10で -54%）
const SKILL_GACHA_BASE_COST = 100, SKILL_GACHA_COST_GROWTH = 1.15; // 1回ごとに値上げ（転生でリセット）
function getSkillLevel(id) {
  if (!game.shopOwned[id]) return 0;
  return Math.max(1, Math.min(SKILL_MAX_LEVEL, (game.skillLevels && game.skillLevels[id]) || 1));
}
function skillCd(id, base) { return Math.round(base * (1 - SKILL_CD_CUT_PER_LV * (Math.max(1, getSkillLevel(id)) - 1))); }
function getSkillGachaCost() { return coinPrice(Math.round(SKILL_GACHA_BASE_COST * Math.pow(SKILL_GACHA_COST_GROWTH, game.skillGachaPulls || 0))); }
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
ARTIFACT_POOL.forEach(a => { a.img = ICON_IMAGES['art_' + a.id]; });
Object.keys(GACHA_POOL).forEach(id => { GACHA_POOL[id].img = ICON_IMAGES['g_' + id]; });
Object.keys(UPGRADES).forEach(id => { UPGRADES[id].img = ICON_IMAGES['up_' + id]; });
UPGRADES.compAtk.img = ICON_IMAGES.tab_companion; UPGRADES.melee.img = ICON_IMAGES.x_attack; UPGRADES.rush.img = ICON_IMAGES.up_clash; // 仲間の攻撃力は仲間タブと同じ絵
Object.keys(SKILL_GACHA_SKILLS).forEach(id => { SKILL_GACHA_SKILLS[id].img = ICON_IMAGES['sk_' + id]; });
const REBIRTH_ARTIFACT_COST = { common: 5, rare: 8, epic: 12, legendary: 40 }; // ★5（ミシック）は宝箱からしか出ない
const REBIRTH_SHOP_ITEMS = {};
ARTIFACT_POOL.forEach(a => {
  if (a.rarity === 'mythic') return;
  REBIRTH_SHOP_ITEMS[a.id] = { icon: a.icon, img: a.img, name: a.name, desc: a.desc.replace(/（最大\d+個）/, '') + '（永続）', rarity: a.rarity, cost: REBIRTH_ARTIFACT_COST[a.rarity], artifactId: a.id,
    effect: () => { gainArtifact(a.id); } };
});
REBIRTH_SHOP_ITEMS.heart.cost = 1; // 1個目の商品は初回1ジェムで買える
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
const CHEST_RARITY_ODDS = { mythic: 1 / 500, legendary: 1 / 100, epic: 1 / 32, rare: 1 / 6 };
const REBIRTH_REWARD_RARITY_WEIGHTS = { mythic: 0.2, legendary: 1, epic: 3.125, rare: 16.667, common: 79.008 };
function rollChestRarity(luck = 1, min = 'common') { // luck 倍だけ高レア度が出やすい（岩・ボスなど苦労して手に入れる宝箱用）
  const order = ['common', 'rare', 'epic', 'legendary', 'mythic'];
  let r = Math.random(), got = 'common';
  for (const k of ['mythic', 'legendary', 'epic', 'rare']) { const p = Math.min(0.9, CHEST_RARITY_ODDS[k] * luck); if (r < p) { got = k; break; } r -= p; if (r < 0) break; }
  return order.indexOf(got) < order.indexOf(min) ? min : got;
}
function pickWeightedArtifact(pool, weights) {
  const counts = {};
  pool.forEach(a => counts[a.rarity] = (counts[a.rarity] || 0) + 1);
  const w = a => (weights[a.rarity] || 0) / counts[a.rarity];
  let r = Math.random() * pool.reduce((sum, a) => sum + w(a), 0);
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
  ring: 'economy', compass: 'economy', calendar: 'economy', rebirthOrb: 'economy',
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
  pierceHoof: n => `貫通 +${n}ヒット`,
  heart: n => `攻撃力 +${5 * n}%`, swordM: n => `攻撃力 +${30 * n}%`, swordL: n => `攻撃力 +${100 * n}%`, ring: n => `コイン +${30 * n}%`, book: n => `攻撃力 +${10 * n}%・HP +${10 * n}%`, armor: n => `HP +${25 * n}%`,
  compass: n => `反射コイン ×${n}`, calendar: n => `ログボ +${40 * n}%`, gauntlet: n => `メテオ +${35 * n}%`, hourglass: n => `待機 -${15 * n}%`,
  turbo: n => `加速中 +${25 * n}%`, eye: n => `会心率 +${5 * n}%`, fang: n => `会心ダメ +${50 * n}%`, lens: n => `命中 +${3 * n}%`,
  feather: n => `回避 +${3 * n}%`, crest: n => `ボス +${25 * n}%`, gauntletCounter: n => `カウンター +${10 * n}%`, horn: n => `タックル +${30 * n}%`,
  banner: n => `仲間攻撃 +${25 * n}%`, amulet: n => `仲間HP +${25 * n}%`, pinchMask: n => `背水 +${40 * n}%`, rebirthOrb: n => `転生ジェム +${2 * n}`,
};
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
  evolutions: { power: 0, vitality: 0, fortune: 0, meteor: 0, chain: 0, critical: 0, critdmg: 0, aim: 0, evade: 0, slayer: 0, counter: 0, rush: 0, bond: 0, guard: 0, pinch: 0, phoenix: 0 },
  ownedArtifacts: {},
  rebirthBonus: { atk: 0, hp: 0, cloneSlots: 0 },
  totalCoinsSpent: 0, // 累計の消費コイン（戦績用）
  skillSlots: 1, equippedSkills: [], // スキル枠（ジェムで最大7）と装備中のスキル（転生しても残る）
  skillLevels: {}, skillGachaPulls: 0, skillGachaOffer: null, // スキルガチャ（Lv・今周回の回数・選択待ちの候補）
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
function computeBonuses() {
  const b = { atkMult: 1, coinMult: 1, hpMult: 1, speedMult: 1, bounceMult: 1, specialMult: 1, comboGrowth: 0, bounceCoinCount: 0, loginBonusMult: 1, specialDmgMult: 1, specialCooldownMult: 1, accelDmgMult: 1, critChance: 0, critMultBonus: 0, accuracy: 0, evasion: 0, bossDmg: 0, counter: 0, tackleMult: 1, companionAtkMult: 1, companionHpMult: 1, pinchAtk: 0, rebirthGems: 0 };
  for (const id in game.ownedArtifacts) { // 所持している遺物はすべて有効
    if (!ARTIFACT_BY_ID[id]) continue;
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
  if (game.shopOwned.sword) b.atkMult += 0.25;
  if (game.shopOwned.shield) b.hpMult += 0.25;
  if (game.shopOwned.fairy) b.coinMult += 0.30;

  for (const id in GACHA_POOL) {
    const level = game.evolutions[id] || 0;
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
  const base = UPGRADES[id].baseCost;
  const L = game.upgrades[id];
  const sub = getActiveSub();
  const A = base, B = base * (2 * L + 1), C = -2 * (coins / (sub ? sub.coinPriceMult : 1)) - 2 * base; // 割引分だけ多めに見積もり、下で実際の合計で調整
  let count = Math.floor((-B + Math.sqrt(B * B - 4 * A * C)) / (2 * A));
  if (!isFinite(count) || count < 0) count = 0;
  while (count > 0 && sumUpgradeCost(id, L, count) > coins) count--;
  while (sumUpgradeCost(id, L, count + 1) <= coins) count++;
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
  return 0;
}
function formatUpgradeStat(id, v) {
  if (id === 'tackle' || id === 'compAtk' || id === 'melee' || id === 'rush') return '×' + +v.toFixed(2);
  return formatCoinNumber(Math.round(v));
}
function renderUpgradeList() {
  const row = ([id, upgrade]) => {
    const level = game.upgrades[id];
    if (level >= getUpgradeLevelCap(id)) {
      return `<div class="upgrade-row">
      <button class="upgrade-btn is-disabled" data-upgrade="${id}"><span class="item-icon">${ico(upgrade)}</span> ${upgrade.name} Lv.${level}（MAX）<span class="upgrade-value">${formatUpgradeStat(id, getUpgradeStatValue(id))}</span><span class="cost">上限に達しました</span></button>
      <button class="upgrade-max-btn pct-btn is-disabled" data-upgrade-pct="${id}">10%<span>—</span></button>
      <button class="upgrade-max-btn is-disabled" data-upgrade-max="${id}">MAX<span>—</span></button>
    </div>`;
    }
    const cost = getUpgradeCost(id);
    const maxCount = getMaxAffordableUpgradeLevels(id, game.coins);
    const pctCount = getMaxAffordableUpgradeLevels(id, game.coins * PCT_BUDGET);
    const nl = nextUpgradeLeap(level);
    const leapTag = `<span class="upgrade-leap" style="color:${nl.leap.color}">次の${nl.leap.name}（${nl.leap.every === 10 ? '+10%' : '×' + nl.leap.mult}）まで あと${nl.target - level}Lv</span>`;
    const now = getUpgradeStatValue(id);
    game.upgrades[id] = level + 1;
    const next = getUpgradeStatValue(id);
    game.upgrades[id] = level;
    return `<div class="upgrade-row">
      <button class="upgrade-btn ${game.coins < cost ? 'is-disabled' : ''}" data-upgrade="${id}"><span class="item-icon">${ico(upgrade)}</span> ${upgrade.name} Lv.${level}<span>${upgrade.desc}</span>${leapTag}<span class="upgrade-value">${formatUpgradeStat(id, now)} → <b>${formatUpgradeStat(id, next)}</b></span><span class="cost">🟡 ${formatCoinNumber(cost)}</span></button>
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
function getEquippedSkills() { if (!Array.isArray(game.equippedSkills)) game.equippedSkills = []; return game.equippedSkills; }
function isSkillEquipped(id) { return getEquippedSkills().includes(id); }
const SKILL_ORDER = Object.keys(SKILL_GACHA_SKILLS);
function getSkillBasePrice(id) { return Math.round(100 * Math.pow(1.3, Math.max(0, SKILL_ORDER.indexOf(id))) / 10) * 10; }
function getSkillBuyCost(id) { return coinPrice(Math.round(getSkillBasePrice(id) * Math.pow(2.5, game.shopOwned[id] ? getSkillLevel(id) : 0))); } // 解放 → Lvアップごとに×2.5
let lastSetSkill = null; // 直前にセットしたスキル（その枠だけアニメさせる）
