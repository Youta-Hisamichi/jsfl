function renderSkillGacha() {
  const head = document.getElementById('skillSlotHead');
  const slots = getSkillSlots();
  const eq = getEquippedSkills();
  // サブウェポンと同じシンプルな見出し：装備数／枠数と「＋枠を増やす」だけ（スロット一覧は出さない）
  const headHtml = `<span>装備枠 <b>${eq.length} / ${slots}</b></span>` + (slots < SKILL_SLOT_MAX ? `<button class="${game.gems < getSkillSlotCost() ? 'is-disabled' : ''}" data-skill-slot-add="1">＋枠を増やす 💎${getSkillSlotCost()}</button>` : '<span class="ws-max">枠MAX</span>');
  if (head && head.dataset.html !== headHtml) { head.innerHTML = headHtml; head.dataset.html = headHtml; }
  lastSetSkill = null;
  const lvList = document.getElementById('skillLevelList');
  const lvHtml = Object.entries(SKILL_GACHA_SKILLS).map(([id, sk]) => {
    const owned = !!game.shopOwned[id];
    const lv = owned ? getSkillLevel(id) : 0;
    const maxed = lv >= SKILL_MAX_LEVEL;
    const cost = getSkillBuyCost(id);
    const on = isSkillEquipped(id);
    const coinIco = xi('x_coin') || '🟡';
    const buyLabel = !owned ? `解放 ${coinIco}${formatCoinNumber(cost)}` : maxed ? 'Lv MAX' : `Lv↑ ${coinIco}${formatCoinNumber(cost)}`;
    const equipBtn = owned ? `<button class="sk-equip ${on ? 'on' : ''} " data-skill-equip="${id}">${on ? '✓ 装備中' : eq.length >= slots ? '入れ替え' : '装備する'}</button>` : '';
    return `<div class="sk-card sk-card2 ${owned ? '' : 'locked'} ${on ? 'equipped' : ''}"><div class="sk-top">${ico(sk)}<div><div class="sk-name">${sk.name}</div><div class="sk-lv">${owned ? (maxed ? 'Lv MAX' : 'Lv' + lv) + `<span class="sk-lv-sub">（威力×${+skillPower(id).toFixed(1)}・待機 -${Math.round(skillCdCut(lv) * 100)}%）</span>` : '未解放'}</div></div></div><div class="sk-desc">${sk.desc}</div><div class="sk-btns"><button class="${maxed || game.coins < cost ? 'is-disabled' : ''}" data-skill-buy="${id}">${buyLabel}</button>${equipBtn}</div></div>`;
  }).join('');
  if (lvList && lvList.dataset.html !== lvHtml) { lvList.innerHTML = lvHtml; lvList.dataset.html = lvHtml; }
  const wList = document.getElementById('weaponList'); // サブウェポン：装備枠に入れたものだけ自動で発動
  const weq = getEquippedWeapons(), wslots = getWeaponSlots();
  const wHead = document.getElementById('weaponSlotHead');
  const wHeadHtml = `<span>装備枠 <b>${weq.length} / ${wslots}</b></span>` + (wslots < WEAPON_SLOT_MAX ? `<button class="${game.gems < getWeaponSlotCost() ? 'is-disabled' : ''}" data-weapon-slot="1">＋枠を増やす 💎${getWeaponSlotCost()}</button>` : '<span class="ws-max">枠MAX</span>');
  if (wHead && wHead.dataset.html !== wHeadHtml) { wHead.innerHTML = wHeadHtml; wHead.dataset.html = wHeadHtml; }
  const wHtml = Object.entries(WEAPONS).map(([id, W]) => {
    const lv = getWeaponLv(id), cost = getWeaponBuyCost(id), on = weq.includes(id);
    const pw = weaponDmg(1, Math.max(1, lv));
    const equipBtn = lv ? `<button class="sk-equip ${on ? 'on' : ''}" data-weapon-equip="${id}">${on ? '✓ 装備中' : weq.length >= wslots ? '入れ替え' : '装備する'}</button>` : '';
    return `<div class="sk-card wp-card ${lv ? '' : 'locked'} ${on ? 'equipped' : ''}"><div class="sk-top"><span class="item-icon">${ico(W)}</span><div><div class="sk-name">${W.name}</div><div class="sk-lv">${lv ? `Lv${lv}（威力×${+pw.toFixed(1)}）` : '未所持'}</div></div></div><div class="sk-desc">${W.desc}</div><div class="sk-btns"><button class="wp-buy ${game.coins < cost ? 'is-disabled' : ''}" data-weapon-buy="${id}">${lv ? (lv >= WEAPON_MAX_LV ? 'Lv MAX' : `Lv↑ 🟡${formatCoinNumber(cost)}`) : `入手 🟡${formatCoinNumber(cost)}`}</button>${equipBtn}</div></div>`;
  }).join('');
  if (wList && wList.dataset.html !== wHtml) { wList.innerHTML = wHtml; wList.dataset.html = wHtml; }
  updateSkillButtonVisibility();
}
const PASSIVE_SKILLS = ['skillAtkUp', 'skillRegen']; // 取得するだけで効く（スキル枠を使わない）
function updateSkillButtonVisibility() {
  let keys;
  try { keys = SKILL_BUTTON_KEYS; } catch (err) { return; } // 初期化前は何もしない
  for (const btnId in keys) {
    const btn = document.getElementById(btnId);
    if (btn) btn.style.display = isSkillEquipped(keys[btnId]) && !PASSIVE_SKILLS.includes(keys[btnId]) ? '' : 'none'; // 常時発動のスキルはボタンなし
  }
  const ssb = document.getElementById('skillSetBtn');
  if (ssb) ssb.style.display = 'none'; // ゲーム画面のスキル入れ替えボタンは使わない（スキルページで入れ替え）
}
function renderCoinShopList() {
  renderSkillGacha();
  coinShopList.innerHTML = Object.entries(COIN_SHOP_ITEMS).filter(([id]) => CLONES_ENABLED || !CLONE_ONLY_ITEMS.includes(id)).map(([id, item]) => {
    const cost = coinPrice(id === 'cloneSlot' ? item.cost * (game.coinCloneSlots + 1) : item.cost);
    const suffix = id === 'cloneSlot' ? `（上限 ${getCloneLimit()}）` : '';
    return `<button class="shop-btn coin-shop-btn ${game.coins < cost ? 'is-disabled' : ''}" data-coin-shop="${id}"><span class="item-icon">${item.icon}</span> ${item.name}<span class="shop-desc">${item.desc}${suffix}</span><span class="cost">🟡 ${formatCoinNumber(cost)}</span></button>`;
  }).join('');
  const cst = document.getElementById('coinShopTitle');
  if (cst) cst.style.display = coinShopList.innerHTML ? '' : 'none';
}
const GEM_BAG_BADGES = { 1: '初心者向け', 2: 'おすすめ', 3: '人気No.1', 4: '最もお得' };
function renderSupergemShopList() {
  const active = getActiveSub();
  const subHtml = Object.entries(SUBSCRIPTIONS).map(([id, sub]) => {
    const on = isSubActive(id);
    const covered = !on && active && active.rank > sub.rank; // 上位プラン加入中
    const days = on ? Math.ceil((game.subscriptions[id] - Date.now()) / 86400000) : 0;
    const status = on ? `✅ 加入中（残り${days}日）・タップで30日延長` : covered ? '上位の紋章で有効中' : `サブスク（${SUBSCRIPTION_DAYS}日間）`;
    return `<button class="shop-btn sub-btn sub-${id} ${covered || game.superGems < sub.cost ? 'is-disabled' : ''} ${on ? 'is-active' : ''}" data-sub-shop="${id}"><span class="sub-emblem">${xi(sub.emblem) || sub.icon}</span><span class="sub-body"><span class="sub-name">${sub.name}</span><span class="sub-desc">${sub.desc}</span><span class="sub-status">${status}</span><span class="sub-price">${sub.cost.toLocaleString('ja-JP')}<small>円 / 月</small></span></span></button>`;
  }).join('');
  supergemShopList.innerHTML = subHtml + Object.entries(SUPERGEM_SHOP_ITEMS).map(([id, item], i) => {
    const tier = i + 1, badge = GEM_BAG_BADGES[tier] ? `<span class="gb-badge">${GEM_BAG_BADGES[tier]}</span>` : '';
    return `<button class="shop-btn gb-btn gb-t${tier} ${game.superGems < item.cost ? 'is-disabled' : ''}" data-supergem-shop="${id}">${badge}<span class="gb-icons">${xi('x_gb' + tier) || '💎'.repeat(tier)}</span><span class="gb-body"><span class="gb-name">${item.name}</span><span class="gb-amount">${item.desc}</span><span class="gb-price">${item.cost.toLocaleString('ja-JP')}<small>円</small></span></span></button>`;
  }).join('');
}
let evoKind = 'atk', evoGems = 5, evoFeathers = 0;
function renderEvolutionList() {
  const el = document.getElementById('evoPanel'); if (!el) return;
  const owned = (game.ownedArtifacts && game.ownedArtifacts.evoFeather) || 0;
  evoGems = Math.max(EVO_MIN_GEMS, Math.min(evoGems, Math.max(EVO_MIN_GEMS, Math.floor(game.gems)))); evoFeathers = Math.max(0, Math.min(evoFeathers, owned));
  const odds = evoOdds(evoGems, evoFeathers), fmtRate = v => '×' + formatCoinNumber(v);
  el.innerHTML = `<div class="evo-rates"><div class="evo-rate ${evoKind === 'atk' ? 'on' : ''}" data-evo-kind="atk"><span>⚔️ 攻撃力進化</span><b>${fmtRate(getEvoRate('atk'))}</b></div><div class="evo-rate ${evoKind === 'hp' ? 'on' : ''}" data-evo-kind="hp"><span>❤️ HP進化</span><b>${fmtRate(getEvoRate('hp'))}</b></div></div>
    <div class="evo-row"><span class="evo-lbl">💎 ジェム</span><button data-evo-gems="-10">-10</button><button data-evo-gems="-1">-</button><b class="evo-val">${evoGems}</b><button data-evo-gems="1">+</button><button data-evo-gems="10">+10</button><button data-evo-gems="max">MAX</button></div>
    <div class="evo-row"><span class="evo-lbl">🪽 進化の羽</span><button data-evo-fea="-1">-</button><b class="evo-val">${evoFeathers}<small> / ${owned}</small></b><button data-evo-fea="1">+</button><button data-evo-fea="max">MAX</button></div>
    <div class="evo-odds">${EVO_TIERS.map((t, i) => `<div class="evo-odd" style="--rc:${RARITY_INFO[t.rarity].color}"><span>${rarityStars(t.rarity)}</span><b>×${t.mult}</b><i>${(odds[i] * 100).toFixed(odds[i] < 0.01 ? 2 : 1)}%</i></div>`).join('')}</div>
    <button class="evo-go ${game.gems < evoGems ? 'is-disabled' : ''}" id="evoGoBtn">✨ ${evoKind === 'atk' ? '攻撃力' : 'HP'}を進化する（💎${evoGems}${evoFeathers ? `・🪽${evoFeathers}` : ''}）</button>`;
  updateCompSummonVisibility();
}
function updateCompSummonVisibility() {
  const cgb = document.getElementById('compGachaBtn');
  if (!cgb) return;
  const full = getCompanionTotal() >= getPartyLimit();
  const cost1 = getCompSummonCost(1); // ボタンの文字（費用）は仲間ページを開いたときにも必ず入れる
  cgb.classList.toggle('is-disabled', game.coins < cost1);
  cgb.innerHTML = `<span class="cps-title">🐾 仲間召喚</span><span class="cps-cost">🟡 ${formatCoinNumber(cost1)}</span>`;
  cgb.parentElement.style.display = full ? 'none' : '';
}
function renderRebirthShopList() {
  const newTabIds = (Array.isArray(game.rebirthShopNew) ? game.rebirthShopNew : []).filter(id => REBIRTH_SHOP_ITEMS[id]).map(id => getRebirthItemCategory(REBIRTH_SHOP_ITEMS[id]));
  const tabCats = REBIRTH_SHOP_CATEGORIES.map(c => newTabIds.includes(c.id) ? { ...c, label: c.label + '<span class="rs-tab-new"></span>' } : c);
  renderSubTabs(document.getElementById('rebirthShopTabs'), tabCats, rebirthShopCategory, cat => {
    rebirthShopCategory = cat;
    renderRebirthShopList();
    rebirthShopList.scrollTop = 0;
  });
  const entries = getRebirthCategoryIds(rebirthShopCategory).map(id => [id, REBIRTH_SHOP_ITEMS[id]]);
  const newIds = Array.isArray(game.rebirthShopNew) ? game.rebirthShopNew : [];
  rebirthShopList.innerHTML = entries.map(([id, item]) => {
    const maxed = isRebirthItemMaxed(item);
    const disabled = maxed;
    const cost = getRebirthItemCost(id);
    const lockLeft = maxed ? 0 : getRebirthShopLockLeft(id);
    const short = !maxed && (game.gems < cost || isRebirthItemLocked(item) || lockLeft > 0);
    const count = game.ownedArtifacts[item.artifactId] || 0;
    const limit = ARTIFACT_STACK_LIMIT[item.artifactId];
    const isUnlockItem = item.companionId || item.unlockKey;
    const locked = !maxed && isRebirthItemLocked(item);
    const current = !isUnlockItem ? getArtifactCurrentText(item.artifactId) : '';
    const owned = lockLeft ? `🔒 あと${lockLeft}回の転生で開放` : locked ? '🔒 タックル開放が必要' : isUnlockItem ? (maxed ? '開放済み' : '未開放') : `所持 ${count}${limit ? ' / ' + limit : ''}`;
    const rar = RARITY_INFO[item.rarity];
    const icon = item.companionId ? companionIconHtml(item.companionId) : ico(item);
    const desc = item.desc.replace('（永続）', ''); // 永続であることは見出しに書いてあるので省略
    const maxCount = maxed ? 0 : getRebirthMaxCount(id);
    if (lockLeft) return `<div class="upgrade-row"><button class="modal-shop-btn is-disabled rs-shop-locked" data-rebirth-shop="${id}"><span class="rs-icon">🔒</span><span class="rs-main"><span class="rs-line"><span class="msb-name">？？？</span><span class="msb-rarity" style="color:${rar.color}">${rarityStars(item.rarity)}</span></span><span class="rs-line"><span class="msb-desc">${owned}</span></span></span></button></div>`;
    return `<div class="upgrade-row"><button class="modal-shop-btn ${short ? 'is-disabled' : ''}" data-rebirth-shop="${id}" ${disabled ? 'disabled' : ''} style="border-color:${rar.color}"><span class="rs-icon">${icon}</span><span class="rs-main"><span class="rs-line"><span class="msb-name">${newIds.includes(id) ? '<span class="rs-new">NEW!</span>' : ''}${item.name}</span><span class="msb-rarity" style="color:${rar.color}">${rarityStars(item.rarity)}</span><span class="rs-owned">${owned}</span></span><span class="rs-line"><span class="msb-desc">${desc}</span>${current ? `<span class="rs-current">現在 ${current}</span>` : ''}</span></span><span class="msb-cost">${maxed ? (isUnlockItem ? '開放済み' : '上限') : '💎 ' + cost}</span></button><button class="upgrade-max-btn ${maxCount < 1 ? 'is-disabled' : ''}" data-rebirth-max="${id}">MAX<span>${maxCount ? '×' + maxCount : '—'}</span></button></div>`;
  }).join('');
}

function getCompanionMaxLevels(id, budget = game.coins) {
  const c = COMPANIONS[id];
  let level = game.companions.level[id] || 0, coins = budget, count = 0, total = 0;
  while (count < 9999) {
    const cost = coinPrice(c.levelCostBase * (level + 1));
    if (coins < cost) break;
    coins -= cost; total += cost; level++; count++;
  }
  return { count, total };
}
function getCompanionLevelCost(id) {
  const c = COMPANIONS[id];
  return coinPrice(c.levelCostBase * (game.companions.level[id] + 1));
}
let compInfoId = null; // 未入手の仲間で詳しく表示中のもの
function renderCompanionList() {
  if (!game.companionBook) game.companionBook = {};
  for (const id in game.companions.recruited) if (game.companions.recruited[id] && COMPANIONS[id]) game.companionBook[id] = true;
  const compIds = Object.keys(COMPANIONS);
  const found = compIds.filter(id => game.companionBook[id]).length;
  const compRate = (compIds.length ? Math.floor(found / compIds.length * 1000) / 10 : 0).toFixed(1);
  document.getElementById('companionProgress').innerHTML = `${found} / ${compIds.length}<small>${compRate}%</small>`;
  document.getElementById('compBookBar').style.width = compRate + '%';
  const pc = document.getElementById('partyCount');
  if (pc) pc.innerHTML = `${getCompanionTotal()} / ${getPartyLimit()}<small>人</small>`;
  document.getElementById('partyBar').style.width = Math.min(100, getCompanionTotal() / getPartyLimit() * 100) + '%';
  updateCompSummonVisibility();
  const psb = document.getElementById('partySlotBtn');
  if (psb) {
    const lim = getPartyLimit();
    psb.innerHTML = lim >= COMPANION_PARTY_MAX
      ? `<span class="msb-name">🧑‍🤝‍🧑 パーティ枠 ${lim} / ${COMPANION_PARTY_MAX}人（最大）</span>`
      : `<span class="msb-name">➕ パーティ枠を増やす（${lim} → ${lim + 1}人）</span><span class="msb-cost">💎 ${getPartySlotCost()}</span>`;
    psb.classList.toggle('is-disabled', lim >= COMPANION_PARTY_MAX || game.gems < getPartySlotCost());
  }
  const RARITY_ORDER = { mythic: 5, legendary: 4, epic: 3, rare: 2, common: 1 };
  const owned = id => game.companions.recruited[id] ? 1 : 0;
  const sorted = Object.entries(COMPANIONS).sort((x, y) => (owned(y[0]) - owned(x[0])) || (RARITY_ORDER[y[1].rarity] - RARITY_ORDER[x[1].rarity]));
  const mine = sorted.filter(([id]) => game.companions.recruited[id]), others = sorted.filter(([id]) => !game.companions.recruited[id]);
  const mineHtml = mine.map(([id, c]) => {
    const rar = RARITY_INFO[c.rarity];
    const aw = getCompanionAwaken(id);
    const level = game.companions.level[id];
    const cost = getCompanionLevelCost(id);
    const disabled = game.coins < cost;
    const maxLv = getCompanionMaxLevels(id).count;
    const pctLv = getCompanionMaxLevels(id, game.coins * PCT_BUDGET).count;
    return `<div class="companion-card recruited" style="--rc:${rar.color}"><div class="cc-top"><div class="cc-portrait">${companionIconHtml(id)}<span class="cc-lv">Lv.${level}</span></div><div class="cc-main"><div class="cc-name">${c.name}</div><div class="cc-meta"><span class="cc-rarity">${rarityStars(c.rarity)} ${rar.label}</span><span class="cc-awaken">覚醒 ${'★'.repeat(aw)}${'☆'.repeat(COMPANION_AWAKEN_MAX - aw)}</span></div><div class="cc-chips"><span class="cc-chip atk">⚔️ ATK ${formatCoinNumber(getCompanionAtk(id))}</span><span class="cc-chip">👥 ×${getCompanionCount(id)}人</span><span class="cc-chip">${c.desc}</span></div></div></div><div class="cc-trait">${c.trait}</div><div class="cc-level-row"><button class="cc-lvup ${disabled ? 'is-disabled' : ''}" data-companion-level="${id}"><b>レベルアップ</b><span>🟡 ${formatCoinNumber(cost)}</span></button><button class="cc-max-btn cc-pct-btn ${pctLv < 1 ? 'is-disabled' : ''}" data-companion-level-pct="${id}">10% <span>+${pctLv} Lv.</span></button><button class="cc-max-btn ${maxLv < 1 ? 'is-disabled' : ''}" data-companion-level-max="${id}">MAX <span>+${maxLv} Lv.</span></button></div></div>`;
  }).join('');
  const othersHtml = others.map(([id, c]) => {
    const rar = RARITY_INFO[c.rarity];
    return `<button class="cp-tile ${isCompanionUnlocked(id) ? '' : 'sealed'} ${compInfoId === id ? 'active' : ''}" style="--rc:${rar.color}" data-comp-info="${id}"><span class="cp-tile-img">${companionIconHtml(id)}</span><span class="cp-tile-name">${c.name}</span><span class="cp-tile-stars">${rarityStars(c.rarity)}</span><span class="cp-tile-lock">${isCompanionUnlocked(id) ? '召喚で入手' : '🔒 未開放'}</span></button>`;
  }).join('');
  const info = compInfoId && COMPANIONS[compInfoId] && !game.companions.recruited[compInfoId] ? (() => {
    const c = COMPANIONS[compInfoId], rar = RARITY_INFO[c.rarity];
    return `<div class="cp-info ${isCompanionUnlocked(compInfoId) ? '' : 'sealed'}" style="--rc:${rar.color}"><div class="cp-info-head">${companionIconHtml(compInfoId)}<div><b>${c.name}</b><span style="color:${rar.color}">${rarityStars(c.rarity)} ${rar.label}</span></div></div><div class="cc-chips"><span class="cc-chip">${c.desc}（基礎+${Math.round(c.baseBonus * 100)}%）</span></div><div class="cc-trait">${c.trait}</div><div class="cp-info-lock">${isCompanionUnlocked(compInfoId) ? '🔒 未入手：仲間召喚で入手できます' : `🔒 未開放：ショップで開放（💎${COMPANION_UNLOCK_COST[c.rarity]}）`}</div></div>`;
  })() : '';
  companionList.innerHTML = (mine.length ? `<div class="cp-sec">⚔️ パーティメンバー <b>${mine.length}</b></div>${mineHtml}` : `<div class="cp-empty">まだ仲間がいません。上の「仲間召喚」で仲間を呼びましょう！</div>`)
    + (others.length ? `<div class="cp-sec">📖 未入手の仲間 <b>${others.length}</b><small>タップで詳しく</small></div>${info}<div class="cp-grid">${othersHtml}</div>` : '');
}

const COMP_GACHA_BASE_COST = 200, COMP_GACHA_COST_GROWTH = 1.1;
function getCompSummonCost(count) {
  const done = game.companionSummons || 0;
  let total = 0;
  for (let i = 0; i < count; i++) total += Math.round(COMP_GACHA_BASE_COST * Math.pow(COMP_GACHA_COST_GROWTH, done + i));
  return coinPrice(total);
}
const COMP_AWAKEN_MAX_REFUND = 20; // 覚醒MAXの仲間が出たときに返すコイン
function pickCompanionId() {
  const entries = Object.entries(COMPANIONS).filter(([id]) => isCompanionUnlocked(id)); // 未開放の仲間は出ない
  let roll = Math.random() * entries.reduce((sum, [, c]) => sum + c.weight, 0);
  for (const [id, c] of entries) { roll -= c.weight; if (roll < 0) return id; }
  return entries[0][0];
}
const COMPANION_PARTY_MAX = 8; // パーティ枠の最大（ジェムで拡張できる上限）
function getPartyLimit() { return Math.max(1, Math.min(COMPANION_PARTY_MAX, game.companionSlots || 1)); }
function getPartySlotCost() { return gemPrice(10 * Math.pow(2, getPartyLimit() - 1)); } // 10→20→40→80→160→320→640
function getCompanionCount(id) { return (game.companions.count && game.companions.count[id]) || 0; }
function getCompanionTotal() { return Object.keys(COMPANIONS).reduce((sum, id) => sum + getCompanionCount(id), 0); }
function grantCompanion(id) {
  const cp = game.companions;
  if (!cp.awaken) cp.awaken = {};
  if (!cp.count) cp.count = {};
  if (getCompanionTotal() < getPartyLimit()) {
    const isNew = !cp.recruited[id];
    cp.recruited[id] = true;
    if (!game.companionBook) game.companionBook = {};
    game.companionBook[id] = true;
    cp.count[id] = getCompanionCount(id) + 1;
    if (!cp.hp) cp.hp = {};
    if (!cp.alive) cp.alive = {};
    cp.alive[id] = true;
    cp.hp[id] = getCompanionMaxHP(id);
    if (phase === 'battle') {
      if (balls.some(ball => ball.isCompanion && ball.companionId === id)) refreshCompanionBalls();
      else balls.push(makeCompanionBall(id));
    }
    return { id, label: isNew ? 'NEW! 仲間に加入' : `仲間が増えた！（${cp.count[id]}人）` };
  }
  if (getCompanionAwaken(id) < COMPANION_AWAKEN_MAX) {
    cp.awaken[id] = getCompanionAwaken(id) + 1;
    return { id, label: `満員 → 覚醒 ★${cp.awaken[id]}` };
  }
  game.coins += COMP_AWAKEN_MAX_REFUND;
  return { id, label: `覚醒MAX → 🟡${COMP_AWAKEN_MAX_REFUND}` };
}
let compSummoning = false; // 召喚演出中は連打できない
const COMP_SUMMON_LOADING_MS = 1000;
let compSummonReveal = null; // ロード中の結果をすぐ出す関数
function runCompanionGacha(count, cost, event) {
  if (compSummoning) { if (compSummonReveal) compSummonReveal(); return; } // ロード中にもう一度押したら結果をすぐ表示
  if (game.coins < cost) { showTapError(`コインが ${formatCoinNumber(cost - Math.floor(game.coins))} 枚不足しています`, event.clientX, event.clientY); return; }
  spendCoins(cost);
  game.companionSummons = (game.companionSummons || 0) + count;
  const results = [];
  for (let i = 0; i < count; i++) results.push(grantCompanion(pickCompanionId()));
  refreshPlayerBallStats(false);
  refreshCompanionBalls();
  const box = document.getElementById('compGachaResult');
  const bestRarity = results.reduce((best, r) => RARITY_ORDER.indexOf(COMPANIONS[r.id].rarity) > RARITY_ORDER.indexOf(best) ? COMPANIONS[r.id].rarity : best, 'common');
  updateStatsUI();
  saveGame();
  compSummoning = true;
  box.style.display = 'block';
  box.style.background = '';
  box.className = 'gacha-result gacha-summoning rarity-bg-' + bestRarity;
  box.innerHTML = `<div class="gr-icon">🐾</div><div class="gr-title">召喚中……</div><div class="gr-sub">タップですぐ開封</div>`;
  playGachaSummonSound();
  const reveal = () => {
    if (!compSummoning) return;
    compSummoning = false;
    compSummonReveal = null;
    clearTimeout(revealTimer);
    box.onclick = null;
    showCompanionGachaResult(box, results, count, bestRarity);
  };
  const revealTimer = setTimeout(reveal, COMP_SUMMON_LOADING_MS);
  box.onclick = reveal; // 演出中にタップしたらすぐ開封
  compSummonReveal = reveal;
}
function showCompanionGachaResult(box, results, count, bestRarity) {
  box.style.display = 'block';
  box.className = 'gacha-result rarity-' + bestRarity;
  box.style.background = rarityBackground(bestRarity);
  const cell = r => {
    const c = COMPANIONS[r.id];
    return `<div class="gm-item gm-open rarity-${c.rarity}" style="border:1px solid ${RARITY_INFO[c.rarity].color}; background:${rarityBackground(c.rarity)}"><div class="gm-face">${companionIconHtml(r.id)}</div><span class="gm-name">${c.name}<br><b>${r.label}</b></span></div>`;
  };
  box.innerHTML = count === 1
    ? `<div class="gr-icon gr-pop">${companionIconHtml(results[0].id)}</div><div class="gr-title gr-pop" style="color:${RARITY_INFO[COMPANIONS[results[0].id].rarity].color}">${rarityStars(COMPANIONS[results[0].id].rarity)} ${COMPANIONS[results[0].id].name}</div><div class="gr-sub">${results[0].label}</div><button id="compGachaCloseBtn">閉じる</button>`
    : `<div class="gr-title gr-pop">🐾 仲間10連召喚結果</div><div class="gacha-multi-grid">${results.map(cell).join('')}</div><button id="compGachaCloseBtn">閉じる</button>`;
  document.getElementById('compGachaCloseBtn').addEventListener('click', () => { box.style.display = 'none'; });
  playGachaSound(bestRarity);
  updateStatsUI();
  updateHPUI();
}
document.getElementById('compGachaBtn').addEventListener('click', event => runCompanionGacha(1, getCompSummonCost(1), event));

function getPlayerAtk() {
  const b = computeBonuses();
  const base = 10; // 攻撃力は強化・遺物・ガチャ・仲間などでのみ上昇（ゲーム中に自然には増えない）
  const accelBonus = (Date.now() < accelEndAt) ? b.accelDmgMult : 1;
  const atkUpBonus = (game.shopOwned.skillAtkUp || Date.now() < atkUpEndAt) ? ATK_UP_MULT : 1; // 攻撃力UPスキル（取得したら転生まで常時発動）
  return safeNum(Math.max(1, Math.round(base * b.atkMult * accelBonus * atkUpBonus * getSubStatMult())));
}
function getPlayerMaxHP() {
  const b = computeBonuses();
  const base = 100;
  return safeNum(Math.max(1, Math.round(base * b.hpMult * getEarlyPlayerHpRate(game.stage) * getSubStatMult())));
}
const EARLY_PLAYER_HP_MIN_RATE = 0.4;
function getEarlyPlayerHpRate(stage) {
  if (stage >= EARLY_HP_UNTIL_STAGE) return 1;
  const t = (stage - 1) / (EARLY_HP_UNTIL_STAGE - 1);
  return EARLY_PLAYER_HP_MIN_RATE + (1 - EARLY_PLAYER_HP_MIN_RATE) * t;
}
const BOSS_HP_MULT = 8;    // ボスのHP倍率（通常敵比）の基本
// ボスは階が進むほど（インフレが進むほど）雑魚との差が開く：1階付近×8 → 100階×9 → 500階×15 → 1000階×35 前後
function bossHpMult(stage) { return BOSS_HP_MULT * Math.pow(enemyInflation(stage), 0.25); }
const BOSS_ATK_MULT = 2.2; // ボスの攻撃力倍率（通常敵比）
const EARLY_HP_MIN_RATE = 0.1;
const EARLY_HP_UNTIL_STAGE = 20;
function getEarlyHpRate(stage) {
  if (stage >= EARLY_HP_UNTIL_STAGE) return 1;
  const t = (stage - 1) / (EARLY_HP_UNTIL_STAGE - 1);
  return EARLY_HP_MIN_RATE + (1 - EARLY_HP_MIN_RATE) * t * t;
}
// 階が進むほど敵が指数的に強くなる（インフレ）。桁あふれしないよう指数は一定の階で頭打ち
const ENEMY_INFLATION = 1.006, ENEMY_INFLATION_CAP_STAGE = 20000;
function enemyInflation(stage) { return Math.pow(ENEMY_INFLATION, Math.min(Math.max(0, stage - 1), ENEMY_INFLATION_CAP_STAGE)); }
function getEnemyStats(stage) {
  const isBoss = stage % 10 === 0;
  const inf = enemyInflation(stage);
  const baseHp = Math.max(10, Math.round((80 + stage * 24) * getEarlyHpRate(stage) * inf));
  const baseAtk = Math.round((6 + stage * 2.4) * inf);
  const ms = isBoss ? getMilestoneBoss(stage) : null; // 100・1000階ごとの節目のボスは別格に強い
  return {
    hp: isBoss ? Math.round(baseHp * bossHpMult(stage) * (ms ? ms.hp : 1)) : baseHp,
    atk: isBoss ? Math.round(baseAtk * BOSS_ATK_MULT * (ms ? ms.atk : 1)) : baseAtk,
    isBoss, milestone: ms
  };
}
// 節目のボス：100階ごと・1000階ごとに、HP・攻撃力・大きさ・報酬が跳ね上がる
function getMilestoneBoss(stage) {
  if (stage % 1000 === 0) return { label: `${stage}階の覇王`, hp: 6, atk: 2.2, radius: 1.6, reward: 10 };
  if (stage % 100 === 0) return { label: `${stage}階の主`, hp: 3, atk: 1.5, radius: 1.3, reward: 4 };
  return null;
}

const SKIP_DROP_TABLE = [ // 試練の塔の遺物は★3（エピック）以上。[コモン, レア, エピック, レジェンド, ミシック]
  { minSkip: 1000, weights: [0, 0, 0, 70, 30] },
  { minSkip: 500,  weights: [0, 0, 30, 60, 10] },
  { minSkip: 200,  weights: [0, 0, 60, 36, 4] },
  { minSkip: 100,  weights: [0, 0, 80, 20, 0] },
  { minSkip: 0,    weights: [0, 0, 100, 0, 0] },
];
const RARITY_ORDER = ['common', 'rare', 'epic', 'legendary', 'mythic'];
function pickSkipDropRarity(skipped) {
  const row = SKIP_DROP_TABLE.find(t => skipped >= t.minSkip);
  let roll = Math.random() * 100;
  for (let i = 0; i < RARITY_ORDER.length; i++) {
    roll -= row.weights[i];
    if (roll < 0) return RARITY_ORDER[i];
  }
  return RARITY_ORDER[row.weights.findIndex(w => w > 0)];
}
function dropSkipArtifact(skipped) { // 中身は見せずに宝箱へ封入（宝箱ボタンから開けると分かる）
  const rarity = pickSkipDropRarity(skipped);
  const pool = ARTIFACT_POOL.filter(a => a.rarity === rarity);
  const available = pool.filter(a => !ARTIFACT_STACK_LIMIT[a.id] || (game.ownedArtifacts[a.id] || 0) < ARTIFACT_STACK_LIMIT[a.id]);
  const list = available.length ? available : pool.length ? pool : ARTIFACT_POOL;
  const pick = list[Math.floor(Math.random() * list.length)];
  if (!Array.isArray(game.rebirthChests)) game.rebirthChests = [];
  game.rebirthChests.push(pick.id); // 転生ガチャの宝箱と同じしくみ：中身は決まっているが、開けるまで秘密
  const info = RARITY_INFO[rarity];
  spawnDamageText(arena.x, arena.y - 30, `${rarityStars(rarity)}\n🎁 ${info.label}の宝箱`, info.color, TREASURE_TEXT_DECAY, true);
  for (let i = 0; i < 16; i++) {
    const a = Math.random() * Math.PI * 2, sp = 1.5 + Math.random() * 3;
    particles.push({ x: arena.x, y: arena.y - 30, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, color: info.color, decay: 0.015 });
  }
  playGachaSound(rarity);
  showNotice(`🏺 試練の塔 報酬：${rarityStars(rarity)} ${info.label}の宝箱（遺物入り）を獲得！ 左下の宝箱をタップで開封`, false, TREASURE_NOTICE_MS, true);
  renderChestTray(rarity);
  saveGame();
}

function gainArtifact(id) {
  game.ownedArtifacts[id] = (game.ownedArtifacts[id] || 0) + 1;
}
let artifactFilter = 'all';
const ARTIFACT_FILTERS = [{ id: 'all', label: 'すべて' }, ...REBIRTH_SHOP_CATEGORIES];
// 遺物だけで合計どれくらい強くなっているか（ページ上部にまとめて表示）
function renderArtifactTotal() {
  const b = applyArtifactBonuses(baseBonuses());
  const fmtMult = m => '×' + (m >= 100 ? formatCoinNumber(Math.round(m)) : (Math.round(m * 100) / 100).toString());
  const pct = v => '+' + (Math.round(v * 1000) / 10) + '%';
  const rows = [
    ['⚔️', '攻撃力', b.atkMult > 1 && fmtMult(b.atkMult)], ['❤️', '最大HP', b.hpMult > 1 && fmtMult(b.hpMult)], ['🟡', 'コイン', b.coinMult > 1 && fmtMult(b.coinMult)],
    ['🎯', '会心率', b.critChance > 0 && pct(b.critChance)], ['💥', '会心ダメージ', b.critMultBonus > 0 && pct(b.critMultBonus)], ['👑', 'ボスへのダメージ', b.bossDmg > 0 && pct(b.bossDmg)],
    ['🌟', '必殺ダメージ', b.specialDmgMult > 1 && fmtMult(b.specialDmgMult)], ['⏳', '必殺の待ち時間', b.specialCooldownMult < 1 && '-' + Math.round((1 - b.specialCooldownMult) * 100) + '%'], ['🚀', '加速ダメージ', b.accelDmgMult > 1 && fmtMult(b.accelDmgMult)],
    ['🐗', '体当たり', b.tackleMult > 1 && fmtMult(b.tackleMult)], ['🔍', '命中', b.accuracy > 0 && pct(b.accuracy)], ['🪶', '回避', b.evasion > 0 && pct(b.evasion)], ['🛡️', '反撃', b.counter > 0 && pct(b.counter)],
    ['😤', 'ピンチ時の攻撃', b.pinchAtk > 0 && pct(b.pinchAtk)], ['🚩', '仲間の攻撃', b.companionAtkMult > 1 && fmtMult(b.companionAtkMult)], ['🧿', '仲間のHP', b.companionHpMult > 1 && fmtMult(b.companionHpMult)],
    ['🧭', '跳ね返りコイン', b.bounceCoinCount > 0 && '+' + b.bounceCoinCount + '枚'], ['📅', 'ログインボーナス', b.loginBonusMult > 1 && fmtMult(b.loginBonusMult)], ['💎', '転生ジェム', b.rebirthGems > 0 && '+' + b.rebirthGems],
  ].filter(r => r[2]);
  document.getElementById('artifactTotal').innerHTML = `<div class="af-total-title">✨ 遺物の効果 合計</div>` + (rows.length
    ? `<div class="af-total-grid">${rows.map(([i, n, v]) => `<div class="af-total-item"><span>${i} ${n}</span><b>${v}</b></div>`).join('')}</div>`
    : '<div class="af-total-empty">まだ効果はありません（遺物を集めると強くなります）</div>');
}
function renderArtifactList() {
  const ownedKinds = ARTIFACT_POOL.filter(a => (game.ownedArtifacts[a.id] || 0) > 0).length;
  const total = ARTIFACT_POOL.length;
  const rate = (total ? Math.floor(ownedKinds / total * 1000) / 10 : 0).toFixed(1);
  const rarChips = ['mythic', 'legendary', 'epic', 'rare', 'common'].map(r => {
    const all = ARTIFACT_POOL.filter(a => a.rarity === r), got = all.filter(a => game.ownedArtifacts[a.id] > 0).length;
    return `<span class="af-rchip" style="--rc:${RARITY_INFO[r].color}">${rarityStars(r)} <b>${got}/${all.length}</b></span>`;
  }).join('');
  artifactProgressEl.innerHTML = `<div class="af-ring" style="--p:${rate}"><span><b>${rate}</b>%</span></div><div class="af-hero-main"><div class="af-hero-title">遺物コレクション</div><div class="af-hero-count"><b>${ownedKinds}</b> / ${total} 種類</div><div class="af-rchips">${rarChips}</div></div>`;
  renderArtifactTotal();
  renderSubTabs(document.getElementById('artifactTabs'), ARTIFACT_FILTERS, artifactFilter, cat => { artifactFilter = cat; renderArtifactList(); });
  const RANK = { mythic: 5, legendary: 4, epic: 3, rare: 2, common: 1 };
  const list = ARTIFACT_POOL.filter(a => artifactFilter === 'all' || (ARTIFACT_CATEGORY[a.id] || 'attack') === artifactFilter)
    .slice().sort((x, y) => ((game.ownedArtifacts[y.id] > 0) - (game.ownedArtifacts[x.id] > 0)) || (RANK[y.rarity] - RANK[x.rarity]));
  artifactListEl.innerHTML = list.map(a => {
    const count = game.ownedArtifacts[a.id] || 0, owned = count > 0, rar = RARITY_INFO[a.rarity];
    const limit = ARTIFACT_STACK_LIMIT[a.id];
    const cur = owned ? getArtifactCurrentText(a.id) : '';
    return `<button class="af-card r-${a.rarity} ${owned ? '' : 'not-owned'}" style="--rc:${rar.color}" data-artifact="${a.id}">
      <span class="af-icon">${owned ? ico(a) : '<span class="af-q">？</span>'}</span>${owned ? `<span class="af-count">×${count}${limit ? `<small>/${limit}</small>` : ''}</span>` : '<span class="af-count none">未入手</span>'}
      <span class="af-name">${a.name}</span>
      <span class="af-stars">${rarityStars(a.rarity)} ${rar.label}</span>
      <span class="af-desc">${a.desc}</span>
      ${cur ? `<span class="af-cur">現在 ${cur}</span>` : ''}
    </button>`;
  }).join('') || '<span class="artifact-empty">この種類の遺物はありません</span>';
}

function seededRand(seed) { let t = seed >>> 0; return () => { t += 0x6D2B79F5; let r = Math.imul(t ^ t >>> 15, 1 | t); r ^= r + Math.imul(r ^ r >>> 7, 61 | r); return ((r ^ r >>> 14) >>> 0) / 4294967296; }; }
const RIVAL_NAMES_A = ['ケン', 'ユキ', 'ソラ', 'ハル', 'ミオ', 'レン', 'アカ', 'ツバ', 'リク', 'サク', 'ヒナ', 'カイ', 'ユウ', 'ナギ', 'ルナ', 'トワ', 'マオ', 'セナ', 'コウ', 'アオ'];
const RIVAL_NAMES_B = ['タ', 'ト', 'リ', 'ラ', 'ナ', 'ヤ', 'マ', 'キ', '', 'ノ', 'ミ', 'サ'];
const RIVAL_TAGS = ['', '', '', '', '⚔️', '🔥', '★', '🌙', 'X', '_Pro', '99', '改'];
const RIVALS = (() => {
  const rnd = seededRand(20260601);
  const used = new Set();
  const list = [];
  while (list.length < 99) {
    const name = RIVAL_NAMES_A[Math.floor(rnd() * RIVAL_NAMES_A.length)] + RIVAL_NAMES_B[Math.floor(rnd() * RIVAL_NAMES_B.length)] + RIVAL_TAGS[Math.floor(rnd() * RIVAL_TAGS.length)];
    if (used.has(name)) continue;
    used.add(name);
    const skill = Math.pow(rnd(), 2.2); // 上位ほど少なくなるよう偏らせる
    list.push({ name, stageScore: 3 + Math.floor(skill * 320), dailyBase: skill });
  }
  return list;
})();
function getRivalDailyScore(r, i, dateKeyStr) {
  const rnd = seededRand([...dateKeyStr].reduce((a, c) => a * 31 + c.charCodeAt(0), i + 7) >>> 0);
  return Math.max(0, Math.round(r.dailyBase * 45 * (0.6 + rnd() * 0.8)));
}
let rankingMode = 'daily';
let lastRankInfo = null;
const SERVICE_START_DATE_KEY = '2026-06-01'; // サービス開始日（これより過去へは遡れない）
let rankingDateOffset = 0; // 0=本日, -1=前日, ...

function getRankingDateKey() {
  const d = new Date();
  d.setDate(d.getDate() + rankingDateOffset);
  return dateKey(d);
}

function getTotalUserCountDisplay() {
  const epoch = new Date(SERVICE_START_DATE_KEY + 'T00:00:00Z').getTime();
  const daysSince = Math.max(0, Math.floor((Date.now() - epoch) / 86400000));
  const wobble = Math.floor((Math.sin(daysSince * 0.7) + 1) * 40);
  return 18400 + daysSince * 37 + wobble;
}
function renderTotalUserCount() {
  if (!totalUserCountEl) return;
  const count = getTotalUserCountDisplay();
  totalUserCountEl.textContent = `👥 累計プレイヤー数：${count.toLocaleString('ja-JP')} 人`;
}

function renderRanking() {
  renderTotalUserCount();
  const isDaily = rankingMode === 'daily';
  rankDateNav.style.display = isDaily ? 'flex' : 'none';
  ensureDailyClearReset();

  const todayKey = dateKey(new Date());
  const selectedKey = getRankingDateKey();
  const atServiceStart = daysBetweenKeys(SERVICE_START_DATE_KEY, selectedKey) <= 0;
  const atToday = rankingDateOffset >= 0;
  rankPrevDayBtn.disabled = atServiceStart;
  rankPrevDayBtn.style.opacity = atServiceStart ? 0.4 : 1;
  rankNextDayBtn.disabled = atToday;
  rankNextDayBtn.style.opacity = atToday ? 0.4 : 1;
  if (rankingDateOffset === 0) rankDateLabel.textContent = '本日';
  else if (rankingDateOffset === -1) rankDateLabel.textContent = '昨日';
  else if (rankingDateOffset === -2) rankDateLabel.textContent = '一昨日';
  else rankDateLabel.textContent = selectedKey;

  rankingTitle.textContent = isDaily ? `🏆 ${rankDateLabel.textContent}のクリア数ランキング` : '🏆 到達階ランキング';
  const daysAgo = Math.max(0, daysBetweenKeys(selectedKey, todayKey));
  const rivalFactor = Math.max(0.3, 1 - daysAgo * 0.05); // 過去日ほどライバルのスコアも控えめに演出
  const entries = RIVALS.map((r, i) => ({ name: r.name, score: isDaily ? Math.round(getRivalDailyScore(r, i, selectedKey) * rivalFactor) : r.stageScore, isPlayer: false }));
  const myScore = isDaily ? getDailyClearsForDate(selectedKey) : game.bestStage;
  entries.push({ name: game.username || 'あなた', score: myScore, isPlayer: true });
  entries.sort((a, b) => b.score - a.score);
  lastRankInfo = { rank: entries.findIndex(e => e.isPlayer) + 1, total: entries.length, label: isDaily ? `${rankDateLabel.textContent}のクリア数` : '到達階', score: isDaily ? myScore + ' クリア' : myScore + ' 階' };
  const RANK_ICONS = ['🏆', '🥈', '🥉'];
  const RANK_WALLS = { 3: ['神の壁', 'w-god'], 10: ['プロゲーマーの壁', 'w-pro'], 20: ['名人の壁', 'w-master'], 50: ['クラスで上手い奴の壁', 'w-class'] }; // この順位のすぐ下に壁
  const shown = entries.slice(0, 100);
  rankingList.innerHTML = shown.map((entry, i) => {
    const wi = { 'w-god': '🔥', 'w-pro': '👑', 'w-master': '👑', 'w-class': '👑' };
    const wall = RANK_WALLS[i] && i < shown.length ? `<div class="rank-wall ${RANK_WALLS[i][1]}"><span><i>${wi[RANK_WALLS[i][1]]}</i>${RANK_WALLS[i][0]}<i>${wi[RANK_WALLS[i][1]]}</i></span></div>` : '';
    const cls = i < 3 ? `top${i + 1}` : i < 10 ? 'top10' : '';
    const no = i < 3 ? `<span class="rank-medal">${RANK_ICONS[i]}</span>` : `${i + 1}<small>位</small>`;
    return `<div class="rank-row ${cls} ${entry.isPlayer ? 'me' : ''}"><span class="rank-no">${no}</span><span class="rank-name">${entry.name}</span><span class="rank-score">${isDaily ? entry.score + ' クリア' : entry.score + ' 階'}</span></div>`.replace(/^/, wall);
  }).join('');
}

const geo = (start, mult) => lv => Math.round(start * Math.pow(mult, lv));
const listThen = (list, mult) => lv => lv < list.length ? list[lv] : Math.round(list[list.length - 1] * Math.pow(mult, lv - list.length + 1));
const RECORD_GOALS = {
  bestStage: { get: () => game.bestStage || 1, goal: listThen([10, 20, 30, 50, 75, 100, 150, 200, 300, 500], 1.5), unit: '階' },
  bestCoins: { get: () => game.bestCoins || 0, goal: geo(1000, 10), unit: '枚' },
  totalKills: { get: () => game.totalKills || 0, goal: listThen([50, 100, 300, 1000, 3000, 10000], 3), unit: '体' },
  totalTaps: { get: () => game.totalTaps || 0, goal: listThen([100, 500, 1000, 5000, 10000], 3), unit: '回' },
  totalBounces: { get: () => game.totalBounces || 0, goal: listThen([100, 500, 1000, 5000, 10000], 3), unit: '回' },
  maxBounceChain: { get: () => game.maxBounceChain || 0, goal: listThen([3, 5, 8, 10, 15], 1.5), unit: '連鎖' },
  reincarnations: { get: () => game.reincarnations || 0, goal: listThen([1, 3, 5, 10, 20, 30, 50], 1.5), unit: '回' },
  totalSpent: { get: () => game.totalCoinsSpent || 0, goal: geo(1000, 10), unit: '枚' },
  maxDamage: { get: () => game.maxDamage || 0, goal: geo(100, 10), unit: 'DMG' },
  maxDps: { get: () => game.maxDps || 0, goal: geo(100, 10), unit: 'DPS' },
  maxCombo: { get: () => game.maxCombo || 0, goal: listThen([5, 10, 20, 30, 50, 75, 100], 1.5), unit: '回' },
  bestTowerJump: { get: () => game.bestTowerJump || 0, goal: listThen([50, 100, 200, 500, 1000], 2), unit: '階' },
  playTime: { get: () => (game.playTimeMs || 0) / 3600000, goal: listThen([1, 3, 5, 10, 24, 50, 100], 2), unit: '時間' },
};
function getRecordGoalLevel(key) { return (game.recordGoals && game.recordGoals[key]) || 0; }
function getRecordGoalReward(lv) { return 1; } // どの段階も💎1つ
function isRecordGoalReady(key) { const g = RECORD_GOALS[key]; return g.get() >= g.goal(getRecordGoalLevel(key)); }
let recordGoalsSig = '';
function renderRecordGoals(force) {
  const ready = Object.keys(RECORD_GOALS).some(isRecordGoalReady);
  const tabBtn = document.querySelector('.tab-btn[data-tab="records"]');
  if (tabBtn) tabBtn.classList.toggle('has-reward', ready); // 受け取れる報酬があれば戦績タブに印
  if (getActiveTab() !== 'records' && !force) return;
  updateClaimAllBtn();
  const rows = Object.entries(RECORD_GOALS).map(([key, g]) => {
    const lv = getRecordGoalLevel(key), target = g.goal(lv), v = g.get();
    return [key, lv, target, Math.min(1, v / target), v >= target];
  });
  const sig = rows.map(r => r[1] + ':' + r[4] + ':' + Math.floor(r[3] * 50)).join('|');
  if (sig === recordGoalsSig && !force) return; // 変化がなければ描き直さない
  recordGoalsSig = sig;
  rows.forEach(([key, lv, target, pct, done]) => {
    const el = document.querySelector(`[data-goal="${key}"]`);
    if (!el) return;
    const g = RECORD_GOALS[key], reward = getRecordGoalReward(lv);
    el.innerHTML = `<div class="rg-bar"><i style="width:${(pct * 100).toFixed(1)}%"></i></div><span class="rg-text">次の目標 <b>${formatCoinNumber(target)}</b>${g.unit}</span>`
      + (done ? `<button class="rg-claim" data-goal-claim="${key}"><b>${reward}</b> 受け取る</button>` : `<span class="rg-reward">報酬 💎${reward}</span>`);
    el.parentElement.classList.toggle('goal-ready', done);
  });
}
function getAllRecordGoalRewards() { // 今受け取れる報酬の合計（1つの項目で何段も達成していればその分も）
  let total = 0, count = 0;
  for (const key in RECORD_GOALS) {
    const g = RECORD_GOALS[key], v = g.get();
    for (let lv = getRecordGoalLevel(key), n = 0; n < 200 && v >= g.goal(lv); lv++, n++) { total += getRecordGoalReward(lv); count++; }
  }
  return { total, count };
}
function updateClaimAllBtn() {
  const btn = document.getElementById('rgClaimAll'); if (!btn) return;
  const { total, count } = getAllRecordGoalRewards();
  btn.style.display = count ? '' : 'none';
  if (count) btn.innerHTML = `🎁 全部受け取る <b>💎${formatCoinNumber(total)}</b><small>（${count}件）</small>`;
}
document.getElementById('rgClaimAll').addEventListener('click', event => {
  const { total, count } = getAllRecordGoalRewards();
  if (!count) return;
  if (!game.recordGoals) game.recordGoals = {};
  for (const key in RECORD_GOALS) { const g = RECORD_GOALS[key], v = g.get(); let n = 0; while (n++ < 200 && v >= g.goal(getRecordGoalLevel(key))) game.recordGoals[key] = getRecordGoalLevel(key) + 1; }
  game.gems += total;
  playRegisterSound();
  showTapError(`💎+${formatCoinNumber(total)} まとめてゲット！`, event.clientX, event.clientY);
  updateStatsUI(); renderRecordGoals(true); saveGame();
});
function claimRecordGoal(key, x, y) {
  if (!RECORD_GOALS[key] || !isRecordGoalReady(key)) return false;
  const reward = getRecordGoalReward(getRecordGoalLevel(key));
  if (!game.recordGoals) game.recordGoals = {};
  game.recordGoals[key] = getRecordGoalLevel(key) + 1;
  game.gems += reward;
  playRegisterSound();
  showTapError(`💎+${reward} ゲット！`, x, y);
  updateStatsUI();
  renderRecordGoals(true);
  saveGame();
  return true;
}
document.addEventListener('click', event => {
  const btn = event.target.closest('[data-goal-claim]');
  if (!btn) return;
  if (consumeHoldClick()) return; // 押しっぱなしで受け取った直後のクリックは無視
  claimRecordGoal(btn.dataset.goalClaim, event.clientX, event.clientY);
});
function spendCoins(amount) {
  game.coins -= amount;
  game.totalCoinsSpent = (game.totalCoinsSpent || 0) + amount;
}
let tabBadgeAt = 0;
function updateTabBadges() {
  if (Date.now() - tabBadgeAt < 500) return;
  tabBadgeAt = Date.now();
  const canUp = Object.keys(UPGRADES).some(id => game.upgrades[id] < getUpgradeLevelCap(id) && game.coins >= getUpgradeCost(id));
  const canComp = getCompanionTotal() < getPartyLimit() && game.coins >= getCompSummonCost(1);
  const canShop = Object.entries(REBIRTH_SHOP_ITEMS).some(([id, item]) => !isRebirthItemMaxed(item) && !isRebirthItemLocked(item) && !getRebirthShopLockLeft(id) && game.gems >= getRebirthItemCost(id));
  const canEvo = game.gems >= 5;
  const set = { upgrade: canUp, companion: canComp, gemshop: canShop, gacha: canEvo };
  for (const tab in set) { const b = tabBar.querySelector(`.tab-btn[data-tab="${tab}"]`); if (b) b.classList.toggle('has-new', set[tab] && getActiveTab() !== tab); }
}
function sanitizeBigNumbers() { // 壊れた巨大な数（Infinity・NaN）をセーブ・画面に持ち込まない
  game.coins = Math.max(0, safeNum(game.coins)); game.gems = Math.max(0, safeNum(game.gems));
  if (game.upgrades) for (const k in game.upgrades) { const v = Number(game.upgrades[k]) || 0; game.upgrades[k] = Math.max(0, Math.min(1e12, Math.floor(v))); }
  if (!isFinite(game.maxDamage)) game.maxDamage = NUM_CAP;
}
function updateStatsUI() {
  sanitizeBigNumbers();
  if (typeof updateBossRetryBtn === 'function') updateBossRetryBtn();
  updateTabBadges();
  stageNumEl.textContent = formatStageNumber(game.stage); // 万・億などの単位を付ける
  superGemsNumEl.textContent = Math.floor(game.superGems).toLocaleString('ja-JP');
  rebornNumEl.textContent = formatCoinNumber(game.reincarnations);
  { const el = document.getElementById('rebirthLvNum'); if (el) { el.textContent = game.rebirthLv || 0; document.getElementById('rebirthLvBonus').textContent = `攻撃力・HP +${Math.round((game.rebirthLv || 0) * REBIRTH_LV_BONUS * 100)}%`; } }
  bestStageNumEl.textContent = formatCoinNumber(game.bestStage);
  totalKillsNumEl.textContent = formatCoinNumber(game.totalKills);
  totalTapsNumEl.textContent = formatCoinNumber(game.totalTaps);
  document.getElementById('totalBouncesNum').textContent = formatCoinNumber(game.totalBounces || 0);
  document.getElementById('maxBounceChainNum').textContent = formatCoinNumber(game.maxBounceChain || 0);
  maxDamageNumEl.textContent = formatCoinNumber(game.maxDamage || 0);
  document.getElementById('bestTowerJumpNum').textContent = (game.bestTowerJump || 0).toLocaleString('ja-JP');
  maxDpsNumEl.textContent = formatCoinNumber(game.maxDps || 0);
  maxComboNumEl.textContent = formatCoinNumber(game.maxCombo || 0);
  document.getElementById('totalSpentNum').textContent = formatCoinNumber(game.totalCoinsSpent || 0);
  const critBonuses = computeBonuses();
  const critRate = Math.min(1, CRIT_CHANCE + critBonuses.critChance); // 100%を超えても実質は必ずクリティカル
  critRateNumEl.textContent = +(critRate * 100).toFixed(1) + '%';
  critMultNumEl.textContent = '×' + +(CRIT_MULT + critBonuses.critMultBonus).toFixed(2);
  accuracyNumEl.textContent = +((PLAYER_BASE_ACCURACY + critBonuses.accuracy) * 100).toFixed(1) + '%';
  evasionNumEl.textContent = +((PLAYER_BASE_EVASION + critBonuses.evasion) * 100).toFixed(1) + '%';
  document.getElementById('bossDmgNum').textContent = '+' + +(critBonuses.bossDmg * 100).toFixed(1) + '%';
  document.getElementById('counterNum').textContent = +(Math.min(1, critBonuses.counter) * 100).toFixed(1) + '%';
  game.bestCoins = Math.max(game.bestCoins || 0, Math.floor(game.coins));
  bestCoinsNumEl.textContent = formatCoinNumber(game.bestCoins);
  headerCoinsEl.textContent = formatCoinNumber(Math.max(0, game.coins - coinDisplayHold)); // 飛んでいる途中のコインはまだ表示に足さない
  headerGemsEl.textContent = Math.floor(game.gems);
  startedAtText.textContent = new Date(game.startedAt).toLocaleString('ja-JP');
  playTimeText.textContent = formatDuration(game.playTimeMs || 0);
  renderRecordGoals();

  const stageInCycle = ((game.stage - 1) % 10) + 1;
  stageProgressText.textContent = stageInCycle + ' / 10';
  stageProgressFill.style.width = (stageInCycle / 10 * 100) + '%';
  { const p = stageInCycle / 10; stagePlayerMark.style.left = p >= 1 ? "calc(100% - 30px)" : `${p * 100}%`; } // 自キャラはゲージの先端に。ボスの階だけボスの絵と重ならないよう手前にずらす
  const BOSS_ICON_FLIP = new Set(['demon', 'blackDragon', 'blueDragon', 'livingArmor', 'b_shibaWarrior', 'b_dragonBear']); // 右を向いている絵は反転して左（自キャラ側）を向かせる
  { // ゴールのボスアイコンは、その10階で待ち構えるボスの絵（自キャラの来る左を向かせる）
    const bs = Math.ceil(Math.max(1, game.stage) / 10) * 10, em = getStageBossEmoji(bs), key = BOSS_ENEMY_SPRITE[em], el = document.getElementById('stageBossMark');
    const src = (key && ENEMY_SPRITES[key]) || ENEMY_SPRITES.demon;
    if (el && el.dataset.boss !== src) { el.dataset.boss = src; el.src = src; el.style.transform = `translate(-50%, -72%)${BOSS_ICON_FLIP.has(key) || (!key && true) ? ' scaleX(-1)' : ''}`; }
  }

  renderTabLists(); // 各ページの一覧は開いているページだけ描き直す（他は開いたときに描く）
  rebornBtn.style.display = game.stage >= 3 ? 'block' : 'none';
  stageSkipBtn.classList.toggle('challenging', !!game.skipChallenge);
  updateSkipBtnVisibility();
  const skipHtml = game.skipChallenge
    ? `<span class="bb-main">挑戦中 ${game.skipChallenge.target}階</span><span class="bb-sub">負けたら ${game.skipChallenge.origin}階へ</span>`
    : `<span class="bb-main">試練の塔</span><span class="bb-sub">TRIAL TOWER</span>`;
  if (stageSkipBtn.dataset.html !== skipHtml) { stageSkipBtn.innerHTML = skipHtml; stageSkipBtn.dataset.html = skipHtml; }
  updateSpecialButton();
  updateAccelButton();
  updateHealButton();
  updateBarrierButton();
  updatePoisonButton();
  updateParalyzeButton();
  updateAtkUpButton();
  updateRegenButton();
  updateSilenceButton();
  updateDeathButton();
  updateCoinStrikeButton();
  updateZeniButton();
  updateMysteryButton();
  updateCompRushButton();
  updateNovaButton();
  updateBlastButton();
}

const RENDER_DPR_MAX = 2; // 高解像度スマホでも描画は最大2倍まで（3倍近い端末で描く画素が半分ほどに減り軽くなる）
function renderDpr() { return Math.min(RENDER_DPR_MAX, Math.max(1, window.devicePixelRatio || 1)); }
let dpr = renderDpr();
let size = 0;
let arena = { x: 0, y: 0, radius: 0 };
// デバッグ：ゲームの容量（HTML本体・埋め込み画像・セーブデータ）を表示
const SIZE_REPORT = '@@SIZE_REPORT@@'; // ビルド時にゲーム全体のファイル容量（JSON）へ置き換わる
function getSizeReport() { try { return JSON.parse(SIZE_REPORT); } catch (err) { return null; } }
const fmtBytes = n => n >= 1048576 ? (n / 1048576).toFixed(2) + ' MB' : (n / 1024).toFixed(1) + ' KB';
function renderDebugSizeInfo() { // デバッグパネル上部に、ゲーム全体の容量をいつも表示
  const el = document.getElementById('dbgSizeInfo'); if (!el) return;
  const r = getSizeReport();
  if (!r) { el.textContent = '📦 ゲーム容量：未ビルド（tools/build.js で計測）'; return; }
  el.innerHTML = `📦 ゲーム全体：<b>${fmtBytes(r.total)}</b>（${r.files}ファイル）<br>` +
    r.groups.map(([n, v]) => `${n} ${fmtBytes(v)}`).join('　') + `<br><span style="opacity:.7">1ファイル版 ${fmtBytes(r.single)}（1MB上限の ${(r.single / 1000000 * 100).toFixed(0)}%）・計測 ${r.at}</span>`;
}
async function showGameSize() {
  const r = getSizeReport();
  let save = 0, ls = 0;
  try { save = (localStorage.getItem(SAVE_KEY) || '').length * 2; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); ls += (k.length + (localStorage.getItem(k) || '').length) * 2; } } catch (err) {}
  const lines = r ? [
    `📦 ゲーム全体の容量（PWA版 dist/）: ${r.total.toLocaleString()} バイト（${fmtBytes(r.total)}）・${r.files}ファイル`,
    ...r.groups.map(([n, v, c]) => `　${n}: ${fmtBytes(v)}（${c}ファイル・${(v / r.total * 100).toFixed(0)}%）`),
    `1ファイル版 index.html: ${fmtBytes(r.single)}（1MB上限の ${(r.single / 1000000 * 100).toFixed(0)}%。PWA版には上限なし）`,
    `計測: ${r.at}（ビルド時）`,
  ] : ['📦 未ビルドのため容量不明（tools/build.js を実行すると計測されます）'];
  lines.push(`セーブデータ: ${fmtBytes(save)}（ローカル保存全体 ${fmtBytes(ls)}）`);
  const ta = document.getElementById('dbgMonList');
  ta.value = lines.join('\n'); ta.style.display = ''; ta.rows = lines.length + 1;
  ta.scrollIntoView({ block: 'center' });
  showNotice(r ? `📦 ゲーム全体 ${fmtBytes(r.total)}` : '📦 未ビルド');
}
renderDebugSizeInfo();
// お試し：ゲームサークルを四角形（画面の横幅いっぱい）にする。デバッグの「⬛ 四角/丸」で切り替え
let ARENA_RECT = true;
try { const v = localStorage.getItem('arenaRect'); if (v !== null) ARENA_RECT = v === '1'; } catch (err) {}
document.body.classList.toggle('arena-rect', ARENA_RECT);
function arenaHalf() { return arena.radius; } // 四角のときの中心から壁までの距離
function arenaPath(scale = 1) { // サークル／四角の輪郭パス
  ctx.beginPath();
  if (ARENA_RECT) { const h = arenaHalf() * scale; ctx.rect(arena.x - h, arena.y - h, h * 2, h * 2); }
  else ctx.arc(arena.x, arena.y, arena.radius * scale, 0, Math.PI * 2);
}
function arenaContains(x, y, margin = 0) {
  if (ARENA_RECT) { const h = arenaHalf() - margin; return Math.abs(x - arena.x) <= h && Math.abs(y - arena.y) <= h; }
  return Math.hypot(x - arena.x, y - arena.y) <= arena.radius - margin;
}
function arenaClampPt(x, y, margin = 0) {
  if (ARENA_RECT) { const h = arenaHalf() - margin; return { x: Math.max(arena.x - h, Math.min(arena.x + h, x)), y: Math.max(arena.y - h, Math.min(arena.y + h, y)) }; }
  const ox = x - arena.x, oy = y - arena.y, od = Math.hypot(ox, oy), lim = arena.radius - margin;
  return od > lim ? { x: arena.x + ox / od * lim, y: arena.y + oy / od * lim } : { x, y };
}
// 壁にめり込んでいたら押し戻し、外向きの法線を返す（めり込んでいなければ null）
function arenaWallHit(ball) {
  if (ARENA_RECT) {
    const h = arenaHalf() - ball.radius - 6; // 絵が画面端で切れないよう少し内側で跳ね返る
    let nx = 0, ny = 0;
    if (ball.x < arena.x - h) { ball.x = arena.x - h; nx = -1; } else if (ball.x > arena.x + h) { ball.x = arena.x + h; nx = 1; }
    if (ball.y < arena.y - h) { ball.y = arena.y - h; ny = -1; } else if (ball.y > arena.y + h) { ball.y = arena.y + h; ny = 1; }
    if (!nx && !ny) return null;
    const l = Math.hypot(nx, ny); return { nx: nx / l, ny: ny / l };
  }
  const dx = ball.x - arena.x, dy = ball.y - arena.y, dist = Math.hypot(dx, dy) || 1;
  if (dist + ball.radius < arena.radius) return null;
  const nx = dx / dist, ny = dy / dist;
  ball.x = arena.x + nx * (arena.radius - ball.radius); ball.y = arena.y + ny * (arena.radius - ball.radius);
  return { nx, ny };
}
let animId = null;
let phase = 'battle'; // 'battle' | 'paused'
let hitStopFrames = 0; // ヒットストップ用フレームカウンター（撃破時のみ使用）
const KILL_HITSTOP_DURATION = 3; // 撃破時のヒットストップの長さ（フレーム数）
const KNOCKBACK_SHAKE_FRAMES = 12; // 撃破後、震えながら吹っ飛ぶ演出の長さ（短縮済み）
let stageAnnounceText = ''; // サークル中央に表示するステージ数
let stageAnnounceTimer = 0; // 表示残りフレーム
const STAGE_ANNOUNCE_DURATION = 180; // 「〜階」表示の長さ（約3秒・60fps）
const KNOCKBACK_SPEED = 38; // 吹っ飛ぶ初速（サークル外まで爆発的に）
const KNOCKBACK_DECEL = 0.985; // 吹っ飛び速度の減衰（ほぼ減速せず飛んでいく）

let balls = [];
let adds = [];
let particles = [];
let damageTexts = [];
let meteors = [];
let audioCtx = null;
let gameSpeed = Number(speedRange.value);
const SPECIAL_COOLDOWN = 5 * 60 * 1000;
let lastSpecialAt = Date.now() - SPECIAL_COOLDOWN;
const ACCEL_COOLDOWN = 3 * 60 * 1000;
const ACCEL_DURATION = 15 * 1000;
let lastAccelAt = Date.now() - ACCEL_COOLDOWN;
let accelEndAt = 0;
const HEAL_COOLDOWN = 90 * 1000;
const TACKLE_CHARGE_MIN_MS = 350;   // これ以上押し続けるとタメ開始
const TACKLE_CHARGE_FULL_MS = 1500; // フルチャージまでの時間
const TACKLE_MIN_MULT = 2;          // 最小タメのダメージ倍率（攻撃力比）
const TACKLE_MAX_MULT = 5;          // フルチャージのダメージ倍率
const TACKLE_CHARGE_FULL2_MS = 3200; // 2段階目のフルチャージまでの時間
const TACKLE_MAX2_MULT = 11;         // 2段階目のダメージ倍率
const WALL_TACKLE_WINDOW_MS = 300;  // 壁で跳ねてからこの時間内に離すと「壁蹴りタックル」
const WALL_TACKLE_MULT = 2;         // 壁蹴りタックルのダメージ倍率
const TACKLE_DURATION_MS = 1600;    // 体当たりが続く時間（当たらなければ終了）
const TACKLE_SPEED = 3.2 * 3.4;
const TACKLE_TURN_RATE = 0.22;
const TACKLE_STUN_MS = 600;
let tackleChargeStart = 0;
let arenaHeld = false; // サークルを押し続けているか（クールダウン明けにタメを開始するため）
let tackle = null; // { until, mult, full }
function isTackling() { return !!tackle && Date.now() < tackle.until; }
const HOLD_RUSH_MODE = true;
const MUTUAL_HIT = true; // お試し：ぶつかると敵味方の両方が同時に攻撃する
let holdRush = null;             // { id }：押している指
// 押している間は敵へ体当たり。1回ぶつかったら、指を離して押し直すまで次の体当たりはできない
let rushingNow = false;
// 体当たりは助走（押してから走った距離）が長いほど強い：サークル半径の1.6倍走ると最大 ×3
const RUSH_RUN_MAX = 3;
// タメ打ち突撃：押しっぱなしでタメ（最大 CHARGE_FULL_MS で ×RUSH_RUN_MAX）、離すと一番近い敵へ突撃
const CHARGE_MIN_MS = 200, CHARGE_FULL_MS = 1500;
let chargeHold = null; // { id, start }
// 引っ張り攻撃（モンスト風）：押したまま後ろへ引っ張った量が威力、離すと引いた向きと逆へ飛び出して壁や敵で跳ね返る
const PULL_FULL = 90, PULL_MIN = 0.12;
// 画面のどこを押してもよく、ドラッグ（＝キャラ移動）した量と向きがそのまま引っ張りになる。離すとドラッグと逆向きへ発射
function getPullVec() { return chargeHold && playerDrag ? { dx: playerDrag.jx || 0, dy: playerDrag.jy || 0 } : null; }
function getChargeLevel() { const v = getPullVec(); return v ? Math.min(1, Math.hypot(v.dx, v.dy) / PULL_FULL) : 0; }
function getPullAngle() { const v = getPullVec(); return v ? Math.atan2(-v.dy, -v.dx) : 0; }
function releaseCharge() {
  if (!chargeHold) return;
  const held = Date.now() - chargeHold.start, lv = getChargeLevel(), ang = getPullAngle(), wasAiming = !!playerDrag;
  chargeHold = null;
  if (phase !== 'battle') return;
  if (held < CHARGE_MIN_MS) { if (!playerDrag) doTapSlash(); return; } // 短いタップは切り払い（引っ張りアタック中は連打の加算も同時に入る） // 短いタップは至近距離の切り払い（突撃しない）
  if (!wasAiming || lv < PULL_MIN) return; // 引っ張りが足りなければ発射しない
  launchPull(ang, lv);
}
// 手動とAUTOの威力差：自分の指で攻撃したほうがかなり強い（AUTOは放置用に控えめ）
const MANUAL_ATK_MULT = 2, AUTO_ATK_MULT = 0.6;
// 引っ張りアタック中の連打：飛んでいる間に画面をタップするたびにダメージが上がる（その発射の間だけ）。跳ね返った回数が多いほど1タップの上がり幅も大きい
const PULL_MASH_STEP = 0.4, PULL_MASH_MAX_MULT = 25; // 1タップごとの基本の上昇・連打倍率の上限
const PULL_MASH_BOUNCE_BONUS = 0.5, PULL_MASH_BOUNCE_CAP = 8; // 跳ね返り1回ごとに上がり幅 +50%（8回まで）
const PULL_BOUNCE_ACCEL = 1.12, PULL_SPEED_MAX = 20; // 跳ね返るたびに少し加速（上限あり）
const PULL_MASH_ACCEL = 0.06, PULL_MASH_ACCEL_MAX = 0.3, PULL_MASH_SPEED_EXTRA = 6; // 連打しながら跳ね返ると追加加速（1タップ +6%、最大 +30%、上限速度も +6）
const CHAIN_SEMIS = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19]; // 連打の切り払い音の音階（1オクターブ半で頭打ち）
function pullMashMult() { return holdRush && holdRush.shot && !holdRush.auto ? Math.min(PULL_MASH_MAX_MULT, 1 + (holdRush.mashVal || 0)) : 1; }
function tryPullMashTap() { // 飛んでいる最中のタップ。数えたら true
  const r = holdRush, pl = balls.find(isMainPlayerBall);
  if (!r || !r.shot || r.auto || r.used || !rushingNow || !pl) return false;
  r.mash = (r.mash || 0) + 1; r.tapsSinceBounce = (r.tapsSinceBounce || 0) + 1;
  r.mashVal = (r.mashVal || 0) + PULL_MASH_STEP * (1 + PULL_MASH_BOUNCE_BONUS * Math.min(PULL_MASH_BOUNCE_CAP, r.bounces || 0));
  r.mashAt = Date.now();
  playPuzzleChain(r.mash); // 攻撃力アップの連鎖音
  spawnHitParticles(pl.x, pl.y, r.mash >= 15 ? '#ffb35c' : '#ffe08a');
  return true;
}
function pullMashSlashRate() { // 連打の切り払い音：叩くたびに音階が上がる（連鎖音のように）
  const r = holdRush; if (!r || !r.shot || r.auto || !rushingNow || !r.mash) return 0;
  return 0.9 * Math.pow(2, CHAIN_SEMIS[Math.min(r.mash - 1, CHAIN_SEMIS.length - 1)] / 12);
}
function drawPullMash() { // 連打倍率をキャラの頭上に1つだけ表示（叩くたびにポンと弾む）
  const r = holdRush; if (!r || !r.shot || r.auto || !r.mash || !rushingNow) return;
  const pl = balls.find(isMainPlayerBall); if (!pl) return;
  const m = pullMashMult(), pop = Math.max(0, 1 - (Date.now() - (r.mashAt || 0)) / 160);
  ctx.save(); ctx.translate(pl.x, pl.y - pl.radius - 24); ctx.scale(1 + pop * 0.35, 1 + pop * 0.35);
  ctx.font = '900 15px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(0,0,0,0.75)'; ctx.strokeText(`連打 ×${m.toFixed(1)}`, 0, 0);
  ctx.fillStyle = m >= PULL_MASH_MAX_MULT ? '#ff4f6d' : r.mash >= 15 ? '#ffb35c' : '#ffe08a'; ctx.fillText(`連打 ×${m.toFixed(1)}`, 0, 0);
  ctx.restore();
}
function launchPull(ang, lv, auto = false) { // 引っ張り攻撃の発射（ang の向きへ、威力 lv＝0〜1）
  const pl = balls.find(isMainPlayerBall); if (!pl) return;
  const dur = (900 + 1100 * lv) * (1 + 0.1 * getRunBuff('pull')), sp = 6 + 8 * lv;
  holdRush = { id: -1, dist: 0, until: Date.now() + dur, start: Date.now(), dur, charge: lv, shot: true, speed: sp, auto };
  pl.vx = Math.cos(ang) * sp; pl.vy = Math.sin(ang) * sp;
  if (Math.abs(pl.vx) > 0.5) pl.faceDir = pl.vx > 0 ? 1 : -1;
  if (lv >= 1) shakeScreenLight();
  playAccelSound();
}
function isAutoMode() { return phase === 'battle' && !chargeHold && !playerDrag && getActiveTab() === 'game' && Date.now() - lastUserInputAt >= AUTO_PULL_IDLE_MS; }
function drawAutoLabel() { // オート中は自キャラの近くに AUTO と表示
  if (!isAutoMode()) return;
  const pl = balls.find(isMainPlayerBall); if (!pl) return;
  const a = 0.75 + Math.sin(Date.now() / 300) * 0.25, x = pl.x, y = pl.y + pl.radius + 18;
  ctx.save(); ctx.globalAlpha = a; ctx.font = '900 11px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const w = ctx.measureText('AUTO').width + 10;
  ctx.fillStyle = 'rgba(20,120,255,0.85)'; ctx.beginPath(); ctx.roundRect(x - w / 2, y - 8, w, 16, 8); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.fillText('AUTO', x, y + 0.5);
  ctx.restore();
}
// 放置オート：しばらく操作がないと、ときどき勝手にランダムな向きへ引っ張り攻撃する（敵は狙わない）
const AUTO_PULL_AIM_RATE = 0.5; // オートの体当たりは2回に1回くらい敵めがけて突っ込む（残りは気まぐれな方向）
const AUTO_PULL_IDLE_MS = 4000, AUTO_PULL_GAP_MS = [2500, 5000];
let lastUserInputAt = Date.now(), nextAutoPullAt = 0;
const AUTO_AIM_MS = 650; // AUTOの体当たり：矢印を出して狙う時間
function autoAimAngle() { // 狙った敵が動いたら矢印も追いかける
  const t = autoAim && autoAim.target, pl = balls.find(isMainPlayerBall);
  if (t && pl && t.hp > 0 && !t.isDying) autoAim.ang = Math.atan2(t.y - pl.y, t.x - pl.x);
  return autoAim ? autoAim.ang : 0;
}
let autoAim = null;        // { ang, lv, start }：AUTOが狙いを付けている最中
['pointerdown', 'pointerup', 'pointermove'].forEach(t => document.addEventListener(t, ev => { if (ev.target === canvas && (t !== 'pointermove' || ev.buttons)) lastUserInputAt = Date.now(); }, true)); // AUTOが解けるのはゲームステージ（サークル）を触ったときだけ
// AUTO中、近くに敵がいるとときどき近接攻撃（タップの切り払い）を数回くり出す
const AUTO_SLASH_CHANCE = 0.25, AUTO_SLASH_CHECK_MS = 700, AUTO_SLASH_HITS = [2, 4], AUTO_SLASH_GAP_MS = 140;
let autoSlashCheckAt = 0, autoSlashLeft = 0, autoSlashNextAt = 0;
function tickAutoSlash(now) {
  if (autoAim || rushingNow) { autoSlashLeft = 0; return; }
  if (autoSlashLeft > 0) { if (now >= autoSlashNextAt) { autoSlashLeft--; autoSlashNextAt = now + AUTO_SLASH_GAP_MS; doTapSlash(true); } return; }
  if (now < autoSlashCheckAt) return;
  autoSlashCheckAt = now + AUTO_SLASH_CHECK_MS;
  const pl = balls.find(isMainPlayerBall); if (!pl) return;
  const foes = [...balls.filter(x => !x.isPlayer && !x.isDying && x.hp > 0 && !(x.spawnTimer > 0)), ...adds.filter(x => x.hp > 0)];
  const near = nearestOf(pl, foes);
  if (!near || Math.hypot(near.x - pl.x, near.y - pl.y) > pl.radius + (near.radius || 0) + SLASH_RANGE) return; // 届く距離にいるときだけ
  if (Math.random() >= AUTO_SLASH_CHANCE) return;
  autoSlashLeft = AUTO_SLASH_HITS[0] + Math.floor(Math.random() * (AUTO_SLASH_HITS[1] - AUTO_SLASH_HITS[0] + 1)); autoSlashNextAt = now;
}
function tickAutoPull() {
  const now = Date.now();
  if (phase !== 'battle' || chargeHold || playerDrag || getActiveTab() !== 'game') { autoAim = null; return; }
  if (now - lastUserInputAt < AUTO_PULL_IDLE_MS) { nextAutoPullAt = 0; autoAim = null; return; }
  tickAutoSlash(now);
  if (autoAim) { if (now - autoAim.start >= AUTO_AIM_MS) { const ang = autoAimAngle(), lv = autoAim.lv; autoAim = null; launchPull(ang, lv, true); } return; }
  if (holdRush && now < holdRush.until) return;
  if (!nextAutoPullAt) { nextAutoPullAt = now + 600; return; }
  if (now < nextAutoPullAt) return;
  nextAutoPullAt = now + AUTO_PULL_GAP_MS[0] + Math.random() * (AUTO_PULL_GAP_MS[1] - AUTO_PULL_GAP_MS[0]);
  let ang = Math.random() * Math.PI * 2, target = null;
  if (Math.random() < AUTO_PULL_AIM_RATE) { // ほとんどは一番近い敵を狙う
    const pl = balls.find(isMainPlayerBall);
    const foes = [...balls.filter(x => !x.isPlayer && !x.isDying && x.hp > 0 && !(x.spawnTimer > 0)), ...adds.filter(x => x.hp > 0)];
    const t = pl && nearestOf(pl, foes);
    if (t) { ang = Math.atan2(t.y - pl.y, t.x - pl.x); target = t; }
  }
  autoAim = { ang, target, lv: 0.45 + Math.random() * 0.55, start: now }; // すぐには飛ばず、矢印を伸ばして狙ってから発射
  thump(320, 760, 0.14, 0.04, 'triangle');
}
// タップ（連打）：自キャラが至近距離を切り払う。近くに敵がいれば実際に斬る
const SLASH_RANGE = 40, SLASH_DMG = 0.5, SLASH_HALF = 1.75, SLASH_GAP_MS = 90, SLASH_FX_MS = 170;
let slashFx = [], lastSlashAt = 0, slashSide = 1;
function doTapSlash(auto = false) {
  const now = Date.now();
  if (now - lastSlashAt < SLASH_GAP_MS) return;
  lastSlashAt = now;
  const pl = balls.find(isMainPlayerBall); if (!pl || pl.hp <= 0) return;
  const R = pl.radius + SLASH_RANGE + 6 * getRunBuff('slash');
  const foes = [...balls.filter(x => !x.isPlayer && !x.isDying && x.hp > 0 && !(x.spawnTimer > 0)), ...adds.filter(x => x.hp > 0)];
  const near = nearestOf(pl, foes);
  const ang = near && Math.hypot(near.x - pl.x, near.y - pl.y) < R * 2.2 ? Math.atan2(near.y - pl.y, near.x - pl.x) : ((pl.faceDir || 1) > 0 ? 0 : Math.PI);
  if (Math.abs(Math.cos(ang)) > 0.2) pl.faceDir = Math.cos(ang) > 0 ? 1 : -1;
  slashSide = -slashSide;
  slashFx.push({ ball: pl, ang, side: slashSide, start: now, r: R });
  const mashing = rushingNow && holdRush && holdRush.shot && !holdRush.auto && holdRush.mash; // 引っ張り連打中は連鎖音だけ鳴らす
  if (!mashing) playSnesSlash(Math.floor(Math.random() * SNES_SLASHES.length));
  let hits = 0;
  for (const en of foes) {
    const d = Math.hypot(en.x - pl.x, en.y - pl.y);
    if (d > R + en.radius) continue;
    let da = Math.atan2(en.y - pl.y, en.x - pl.x) - ang; while (da > Math.PI) da -= Math.PI * 2; while (da < -Math.PI) da += Math.PI * 2;
    if (Math.abs(da) > SLASH_HALF && d > pl.radius + en.radius) continue;
    if (playerHitEnemyBy(en, pl, SLASH_DMG * (1 + 0.3 * getRunBuff('slash')) * (auto ? AUTO_ATK_MULT : MANUAL_ATK_MULT), '#ffe08a', 1.6, pl)) hits++;
  }
  if (hits) { if (!mashing) playEnemyHitSound(); adds = adds.filter(ad => ad.hp > 0); updateHPUI(); updateStatsUI(); }
}
// 自キャラの攻撃（切り払い・武器スキル）で敵に攻撃力×mult のダメージ。命中したら true
function playerHitEnemyBy(en, pl, mult, color, knock, from) {
  if (!en || en.hp <= 0 || en.isDying) return false;
  if (!playerAttackHits(en)) { spawnMissText(en); return false; }
  const m = mult * bossWeakHit(en, from); // 隙の3倍は rollCrit の中でかかる。弱点に当たると大ダメージ
  const { dmg, crit } = rollCrit(Math.max(1, Math.round(pl.atk * m * dashDmgMult(pl))), en);
  en.hp -= dmg; trackDamage(dmg);
  spawnHitParticles(en.x, en.y, color || '#ffe08a');
  spawnAttackDamageText(en, dmg, crit, '#fff4b8', en.isAdd ? 6 : undefined);
  if (en.isAdd) {
    focusHpEnemy(en);
    if (en.hp <= 0) {
      recordBestiaryKill(en); spawnExpGems(en.x, en.y, 4);
      const coinGain = 5 + Math.floor(Math.random() * 8); game.coins += coinGain;
      spawnDamageText(en.x, en.y, '+' + formatCoinNumber(coinGain) + ' 🟡', '#ffd76b');
    }
  } else {
    onPlayerHitEnemy(en, dmg);
    if (knock) applyHitKnockback(en, pl, knock);
    if (en.hp <= 0) triggerEnemyDefeat(en, pl.x, pl.y);
  }
  return true;
}
function drawSlashFx() { // 三日月形の斬撃の軌跡
  const now = Date.now();
  slashFx = slashFx.filter(f => now - f.start < SLASH_FX_MS);
  for (const f of slashFx) {
    const k = (now - f.start) / SLASH_FX_MS, b = f.ball;
    const sweep = SLASH_HALF * 2 * Math.min(1, k * 1.8);
    const a0 = f.ang - f.side * SLASH_HALF, a1 = a0 + f.side * sweep;
    ctx.save();
    ctx.globalAlpha = 1 - k * k;
    ctx.lineCap = 'round';
    ctx.shadowColor = '#fff3b0'; ctx.shadowBlur = 10;
    for (const [w, col, rr] of [[7, 'rgba(255,230,140,0.55)', 1], [2.5, '#ffffff', 1.02]]) {
      ctx.strokeStyle = col; ctx.lineWidth = w;
      ctx.beginPath(); ctx.arc(b.x, b.y, f.r * rr, Math.min(a0, a1), Math.max(a0, a1)); ctx.stroke();
    }
    ctx.restore();
  }
}
// 武器スキル（3択パワーアップで取得・一定時間ごとに自動で発動）。Lvが上がると威力・数・範囲が増える
// 時間の単位は「フレーム（ゲーム速度1倍で約60/秒）」
const DOVE_ACCEL = 1.07, DOVE_SPEED_MAX = 16; // 鳩：時間とともに ×1.07 ずつ加速（上限あり）
const AXE_SPEED = 2.4; // 斧の飛ぶ速さ（放物線の形は同じ）
const WEAPON_MAX_LV = 9999; // スキル画面でLv上げできる（数・範囲はLv5で頭打ち、威力は伸び続ける）
const WEAPON_SHAPE_LV = 5;
const WEAPONS = {
  boomerang: { icon: '🪃', name: 'ブーメラン', desc: '弧を描いて飛び、手元に戻ってくる', cd: 110 },
  cross:     { icon: '✝️', name: '十字架', desc: 'まっすぐ飛んで減速し、反転して戻ってくる', cd: 130 },
  axe:       { icon: '🪓', name: '斧', desc: '放物線を描いて飛び、敵を貫く', cd: 120 },
  holyWater: { icon: '💧', name: '聖水', desc: '投げると割れて、しばらく燃え続ける', cd: 170 },
  knife:     { icon: '🔪', name: 'ナイフ', desc: 'まっすぐ速く飛ぶ', cd: 45 },
  shield:    { icon: '🛡️', name: '回転シールド', desc: '盾が周りを回って敵を弾き、敵の弾も防ぐ', cd: 0 },
  thunder:   { icon: '🪄', name: '雷の杖', desc: 'ランダムに雷を落とす', cd: 95 },
  dove:      { icon: '🕊️', name: '鳩', desc: '鳩が飛び立ち、敵めがけてホーミング', cd: 100 },
};
// サブウェポンの画像（一覧のアイコンと、飛んでいく弾の絵）
const WEAPON_IMGS = {};
for (const id of [...Object.keys(WEAPONS), 'buckler']) { const img = new Image(); img.src = `assets/img/weapons/${id}.webp`; WEAPON_IMGS[id] = img; if (WEAPONS[id]) WEAPONS[id].img = img.src; }
const BOLT_IMG = new Image(); BOLT_IMG.src = 'assets/img/weapons/bolts.webp'; // 雷の杖の稲妻（12本）
const BOLT_GROUPS = [[0, 1, 2, 3], [4, 5, 6, 7], [8, 4, 6], [9, 10], [11, 3, 0]]; // 同じ色の稲妻どうしで切り替える
const BOLT_MS = 420;
const BLUE_FIRE_IMG = new Image(); BLUE_FIRE_IMG.src = 'assets/img/weapons/blueFire.webp'; // 聖水の青い炎（横＝大きさ5段階、縦＝ゆらめき5コマ）
function drawWeaponImg(id, size) { const img = WEAPON_IMGS[id]; if (!img || !img.complete || !img.naturalWidth) return false; ctx.drawImage(img, -size / 2, -size / 2, size, size); return true; }
let weaponProj = [], weaponFx = [], weaponCd = {}, shieldAngle = 0, coinThrowCd = 0;
function getWeaponLv(id) { return (game.weapons && game.weapons[id]) || 0; }
// サブウェポンの装備枠（最初は1つ。ジェムで増やせて転生後も継続）
const WEAPON_SLOT_MAX = 4;
function getWeaponSlots() { return Math.max(1, Math.min(WEAPON_SLOT_MAX, game.weaponSlots || 1)); }
function getWeaponSlotCost() { return gemPrice(20 * Math.pow(2, getWeaponSlots() - 1)); } // 20→40→80
function getEquippedWeapons() {
  if (!Array.isArray(game.equippedWeapons)) game.equippedWeapons = Object.keys(WEAPONS).filter(getWeaponLv).slice(0, getWeaponSlots()); // 旧セーブは持っている物から枠の数だけ
  game.equippedWeapons = game.equippedWeapons.filter(id => WEAPONS[id] && getWeaponLv(id));
  return game.equippedWeapons;
}
function equippedWeaponLv(id) { return getEquippedWeapons().includes(id) ? getWeaponLv(id) : 0; }
function autoEquipWeapon(id) { const eq = getEquippedWeapons(); if (!eq.includes(id) && eq.length < getWeaponSlots()) eq.push(id); } // 空き枠があれば自動で装備
function weaponCount(lv) { return 1 + Math.floor((Math.min(lv, WEAPON_SHAPE_LV) - 1) / 2); } // Lv1:1 Lv3:2 Lv5:3（それ以上は増えない）
function weaponDmg(base, lv) { const n100 = Math.floor(lv / 100), n10 = Math.floor(lv / 10) - n100; return base * (1 + 0.3 * (lv - 1)) * Math.pow(1.5, n10) * Math.pow(3, n100); } // 10Lvごとに飛躍・100Lvごとに超飛躍
function getWeaponBuyCost(id) { const lv = getWeaponLv(id); return coinPrice(Math.round(400 * Math.pow(2.5, Math.min(lv, 10)) * (lv > 10 ? Math.pow(lv - 9, 2) : 1))); }
// ボスを倒した・リタイヤしたときに、まだ持っていないサブウェポンが1つ手に入る（Lvは上げない。強化はスキル画面で）
function grantRandomWeapon(reason) {
  if (!game.weapons) game.weapons = {};
  const fresh = Object.keys(WEAPONS).filter(k => !getWeaponLv(k));
  if (!fresh.length) return; // 全部持っていたら何もしない
  const id = fresh[Math.floor(Math.random() * fresh.length)];
  game.weapons[id] = 1; weaponCd[id] = 30; autoEquipWeapon(id);
  const W = WEAPONS[id];
  setTimeout(() => showNotice(`${W.icon} ${reason}サブウェポン「${W.name}」を手に入れた！${getEquippedWeapons().includes(id) ? '（装備して自動で発動）' : '（スキルページで装備できます）'}`), 1400);
  if (typeof renderCoinShopList === 'function') renderCoinShopList();
}
function weaponFoes() { return [...balls.filter(x => !x.isPlayer && !x.isDying && x.hp > 0 && !(x.spawnTimer > 0)), ...adds.filter(x => x.hp > 0)]; }
function weaponAimAngle(pl, spread) {
  const en = nearestOf(pl, weaponFoes());
  const base = en ? Math.atan2(en.y - pl.y, en.x - pl.x) : ((pl.faceDir || 1) > 0 ? 0 : Math.PI);
  return base + (spread || 0);
}
function fireWeapon(id, lv, pl) {
  const n = weaponCount(lv), W = WEAPONS[id];
  if (id === 'boomerang') {
    for (let i = 0; i < n; i++) weaponProj.push({ id, x: pl.x, y: pl.y, ang: weaponAimAngle(pl, (i - (n - 1) / 2) * 0.7), t: 0, life: 70, side: i % 2 ? -1 : 1, r: 9, dmg: weaponDmg(0.7, lv), hit: new Set() });
    playTone(500, 0.12, 'triangle', 0.05, 900);
  } else if (id === 'cross') {
    const en = nearestOf(pl, weaponFoes()), dir = en ? (en.x >= pl.x ? 1 : -1) : ((pl.faceDir || 1) > 0 ? 1 : -1); // 投げるのは真横だけ
    for (let i = 0; i < n; i++) { const a = dir > 0 ? 0 : Math.PI; weaponProj.push({ id, x: pl.x, y: pl.y + (i - (n - 1) / 2) * 22, vx: Math.cos(a) * 7.5, vy: Math.sin(a) * 7.5, ax: -Math.cos(a) * 0.17, ay: -Math.sin(a) * 0.17, t: 0, life: 150, r: 11, dmg: weaponDmg(0.9, lv), hit: new Set(), turned: false }); }
    playTone(900, 0.1, 'square', 0.04, 1300);
  } else if (id === 'axe') {
    for (let i = 0; i < n; i++) { const dir = (i % 2 ? -1 : 1) * ((pl.faceDir || 1) > 0 ? 1 : -1); weaponProj.push({ id, x: pl.x, y: pl.y, vx: dir * (1.6 + i * 0.9) * AXE_SPEED, vy: (-7.5 - i * 0.6) * AXE_SPEED, t: 0, life: Math.round(120 / AXE_SPEED), r: 17, dmg: weaponDmg(1.3, lv), hit: new Set() }); }
    playTone(220, 0.12, 'sawtooth', 0.05, 160);
  } else if (id === 'holyWater') {
    const dir = (pl.faceDir || 1) > 0 ? 1 : -1; // 敵は狙わず、向いている方へ決まった放物線で投げる（数が増えると少しずつ遠くへ）
    for (let i = 0; i < n; i++) {
      const cp = arenaClampPt(pl.x + dir * (150 + i * 55), pl.y, 20); // 遠くまで投げる
      weaponProj.push({ id, x: pl.x, y: pl.y, sx: pl.x, sy: pl.y, tx: cp.x, ty: cp.y, t: 0, dur: 38 + i * 6, life: 38 + i * 6, r: 6, lv, h: 85 + i * 12 });
    }
    playHolyWaterThrow();
  } else if (id === 'knife') {
    for (let i = 0; i < n + (lv >= 4 ? 1 : 0); i++) { const a = weaponAimAngle(pl, (i - (n - 1) / 2) * 0.16); weaponProj.push({ id, x: pl.x, y: pl.y, vx: Math.cos(a) * 13, vy: Math.sin(a) * 13, t: 0, life: 45, r: 6, dmg: weaponDmg(0.55, lv), pierce: Math.floor(lv / 3), hit: new Set() }); }
    playTone(1500, 0.05, 'triangle', 0.04, 2200);
  } else if (id === 'dove') {
    for (let i = 0; i < n + (lv >= 4 ? 1 : 0); i++) { const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.2; weaponProj.push({ id, x: pl.x, y: pl.y - 6, vx: Math.cos(a) * 1.6, vy: Math.sin(a) * 1.6, t: 0, life: 110, r: 9, dmg: weaponDmg(0.8, lv), hit: new Set(), pierce: 0 }); }
    [1400, 1800].forEach((f, i) => thump(f, f * 1.15, 0.06, 0.03, 'triangle', i * 0.07)); // パタパタ
  } else if (id === 'thunder') {
    const foes = weaponFoes().sort(() => Math.random() - 0.5);
    for (let i = 0; i < n; i++) {
      const en = foes[i], rr = arena.radius * 0.8 * Math.sqrt(Math.random()), aa = Math.random() * Math.PI * 2;
      const x = en && Math.random() < 0.75 ? en.x : arena.x + Math.cos(aa) * rr, y = en && Math.random() < 0.75 ? en.y : arena.y + Math.sin(aa) * rr;
      const R = 24 + Math.min(lv, WEAPON_SHAPE_LV) * 3;
      for (const f of weaponFoes()) if (Math.hypot(f.x - x, f.y - y) < R + f.radius) playerHitEnemyBy(f, pl, weaponDmg(1.5, lv), '#fff27a');
      weaponFx.push({ kind: 'bolt', x, y, R, start: Date.now(), seed: Math.random() * 1000 });
    }
    playThunderStrike();
  }
}
function updateWeapons(pl, speedMult) {
  if (!pl || pl.hp <= 0) { weaponProj = []; return; }
  if (isCoinStrike()) { // コイン攻撃中：敵めがけてコインを投げまくる
    coinThrowCd = (coinThrowCd || 0) - speedMult;
    const tg = nearestOf(pl, weaponFoes());
    if (tg && coinThrowCd <= 0) {
      coinThrowCd = 6;
      const a = Math.atan2(tg.y - pl.y, tg.x - pl.x) + (Math.random() - 0.5) * 0.35, sp = 9 + Math.random() * 2;
      weaponProj.push({ id: 'coin', x: pl.x, y: pl.y - 4, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, t: 0, life: 70, r: 7, dmg: 0.3, hit: new Set(), spin: Math.random() * 6 });
      if (Math.random() < 0.5) playTone(1500 + Math.random() * 500, 0.04, 'square', 0.025, 2200);
    }
  }
  for (const id in WEAPONS) {
    const lv = equippedWeaponLv(id); if (!lv || id === 'shield') continue;
    weaponCd[id] = (weaponCd[id] ?? WEAPONS[id].cd * 0.5) - speedMult;
    if (weaponCd[id] <= 0) { weaponCd[id] = WEAPONS[id].cd * (1 - 0.06 * (Math.min(lv, WEAPON_SHAPE_LV) - 1)); fireWeapon(id, lv, pl); }
  }
  const foes = weaponFoes();
  let hits = 0;
  const hitFoes = (p, mult, once) => {
    for (const f of foes) {
      if (f.hp <= 0 || p.hit.has(f) || Math.hypot(f.x - p.x, f.y - p.y) > p.r + f.radius) continue;
      p.hit.add(f);
      if (playerHitEnemyBy(f, pl, p.dmg * (mult || 1), '#ffe08a', 0, p)) hits++;
      if (once) { if (p.pierce > 0) p.pierce--; else { p.life = 0; return; } }
    }
  };
  for (const p of weaponProj) {
    p.t += speedMult; p.life -= speedMult;
    if (p.id === 'boomerang') { // 弧を描いて手元へ戻る
      const k = Math.min(1, p.t / 70), out = Math.sin(k * Math.PI) * 120, sw = Math.sin(k * Math.PI * 2) * 45 * p.side;
      p.x = pl.x + Math.cos(p.ang) * out - Math.sin(p.ang) * sw; p.y = pl.y + Math.sin(p.ang) * out + Math.cos(p.ang) * sw;
      if (k >= 0.5 && !p.turned) { p.turned = true; p.hit.clear(); }
      hitFoes(p);
    } else if (p.id === 'cross') {
      p.vx += p.ax * speedMult; p.vy += p.ay * speedMult; p.x += p.vx * speedMult; p.y += p.vy * speedMult;
      if (!p.turned && p.vx * p.ax + p.vy * p.ay > 0) { p.turned = true; p.hit.clear(); }
      hitFoes(p);
    } else if (p.id === 'axe') {
      p.vy += 0.22 * AXE_SPEED * AXE_SPEED * speedMult; p.x += p.vx * speedMult; p.y += p.vy * speedMult; // 同じ放物線のまま速く
      hitFoes(p);
    } else if (p.id === 'knife') {
      p.x += p.vx * speedMult; p.y += p.vy * speedMult;
      hitFoes(p, 1, true);
    } else if (p.id === 'coin') { // 投げたコイン：当たるとダメージ＋コインを少し獲得
      p.x += p.vx * speedMult; p.y += p.vy * speedMult;
      const before = p.life; hitFoes(p, 1, true);
      if (p.life <= 0 && before > 0) {
        const gain = Math.max(1, Math.round((3 + game.stage) * 0.25 * computeBonuses().coinMult));
        game.coins += gain; spawnDamageText(p.x, p.y - 12, '+' + formatCoinNumber(gain) + ' 🟡', '#ffd76b', 0.03);
        playTone(1800, 0.05, 'triangle', 0.04, 2400); updateStatsUI();
      }
    } else if (p.id === 'dove') { // 一番近い敵へ向きを変えながら飛ぶ
      const tg = p.t > 8 && nearestOf(p, foes.filter(f => f.hp > 0));
      const sp = Math.min(DOVE_SPEED_MAX, 1.6 * Math.pow(DOVE_ACCEL, p.t)); // ミサイルのように加速度的に速くなる
      const cur = Math.atan2(p.vy, p.vx);
      let a = cur;
      if (tg) {
        const want = Math.atan2(tg.y - p.y, tg.x - p.x);
        let d = want - cur; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2;
        const turn = 0.16 * Math.max(0.35, 1 - sp / DOVE_SPEED_MAX); // 速くなるほど曲がりにくい
        a = cur + Math.max(-turn, Math.min(turn, d)) * speedMult;
      }
      p.vx = Math.cos(a) * sp; p.vy = Math.sin(a) * sp;
      if (sp > 5 && Math.random() < 0.7 * speedMult) particles.push({ x: p.x - p.vx * 0.8, y: p.y - p.vy * 0.8, vx: -p.vx * 0.08 + (Math.random() - 0.5), vy: -p.vy * 0.08 + (Math.random() - 0.5), life: 0.6, color: sp > 10 ? 'rgba(255,220,140,0.9)' : 'rgba(255,255,255,0.85)', decay: 0.06 }); // 噴射の軌跡
      p.x += p.vx * speedMult; p.y += p.vy * speedMult;
      hitFoes(p, 1, true);
    } else if (p.id === 'holyWater') {
      const k = Math.min(1, p.t / p.dur);
      p.x = p.sx + (p.tx - p.sx) * k; p.y = p.sy + (p.ty - p.sy) * k - Math.sin(k * Math.PI) * (p.h || 50);
      if (k >= 1) { // 割れて燃える
        p.life = 0;
        weaponFx.push({ kind: 'fire', x: p.tx, y: p.ty, R: 26 + p.lv * 4, until: 70 + Math.min(p.lv, 5) * 6, // 燃える時間は短め（約1.2〜1.7秒）
          t: 0, tick: 0, dmg: weaponDmg(0.25, p.lv), start: Date.now() });
        playHolyWaterBreak();
      }
    }
    if (!arenaContains(p.x, p.y, -60) && p.id !== 'boomerang') p.life = 0;
  }
  weaponProj = weaponProj.filter(p => p.life > 0);
  for (const f of weaponFx) {
    if (f.kind !== 'fire') continue;
    f.t += speedMult; f.tick -= speedMult;
    if (f.tick <= 0) { f.tick = 12; for (const en of foes) if (en.hp > 0 && Math.hypot(en.x - f.x, en.y - f.y) < f.R + en.radius * 0.5) { if (playerHitEnemyBy(en, pl, f.dmg, '#ff9f43')) hits++; } }
  }
  weaponFx = weaponFx.filter(f => f.kind === 'fire' ? f.t < f.until : Date.now() - f.start < (f.kind === 'bolt' ? BOLT_MS : 350));
  // 回転シールド
  const slv = equippedWeaponLv('shield');
  if (slv) {
    shieldAngle += 0.06 * speedMult;
    const n = [0, 1, 2, 2, 3, 4][slv], R = pl.radius + 30;
    for (let i = 0; i < n; i++) {
      const a = shieldAngle + Math.PI * 2 * i / n, sx = pl.x + Math.cos(a) * R, sy = pl.y + Math.sin(a) * R;
      for (const en of foes) {
        if (en.hp <= 0 || Math.hypot(en.x - sx, en.y - sy) > 12 + en.radius) continue;
        if (en.shieldHitAt && Date.now() - en.shieldHitAt < 450) continue;
        en.shieldHitAt = Date.now();
        if (playerHitEnemyBy(en, pl, weaponDmg(0.4, slv), '#c7ecff', 2.2)) { hits++; playEnemyBarrierBlockSound(); }
      }
      for (const sh of enemyShots) if (sh.life > 0 && Math.hypot(sh.x - sx, sh.y - sy) < 16) { sh.life = 0; spawnHitParticles(sx, sy, '#c7ecff'); playEvadeSound(); }
    }
  }
  if (hits) { playEnemyHitSound(); adds = adds.filter(ad => ad.hp > 0); updateHPUI(); updateStatsUI(); }
}
function drawWeapons() {
  const now = Date.now(), pl = balls.find(isMainPlayerBall);
  ctx.save();
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  for (const f of weaponFx) {
    if (f.kind === 'fire') { // 燃える聖水：青い聖なる炎（5段階の大きさ×5コマのゆらめき）
      const fade = Math.min(1, (f.until - f.t) / 30);
      const g = ctx.createRadialGradient(f.x, f.y, 2, f.x, f.y, f.R);
      g.addColorStop(0, `rgba(160,230,255,${0.45 * fade})`); g.addColorStop(0.6, `rgba(50,140,255,${0.25 * fade})`); g.addColorStop(1, 'rgba(40,90,255,0)');
      ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.save(); ctx.translate(f.x, f.y); ctx.scale(1.25, 0.6); ctx.beginPath(); ctx.arc(0, 0, f.R, 0, Math.PI * 2); ctx.fill(); ctx.restore(); ctx.globalCompositeOperation = 'source-over'; // 足元の照り返し（横長）
      const atlas = BLUE_FIRE_IMG;
      if (atlas.complete && atlas.naturalWidth) {
        const age = (now - f.start) / 1000, grow = Math.min(1, age / 0.45), left = Math.min(1, (f.until - f.t) / 40); // 燃え広がり→消え際に小さく
        const stage = Math.max(0, Math.min(4, Math.round(4 * Math.min(grow, left))));
        const C = atlas.naturalWidth / 5;
        const spots = [[-0.84, 0.15, 0.62], [-0.28, 0.15, 0.62], [0.28, 0.15, 0.62], [0.84, 0.15, 0.62]]; // 横一列に並べて全体を長方形に
        const flick = 0.85 + 0.15 * Math.sin(now / 70 + f.x); // 明るさのゆらぎ
        ctx.globalCompositeOperation = 'lighter'; // 加算合成で炎らしく光らせる
        for (let pass = 0; pass < 2; pass++) { // 1回目：ふわっと大きな光のにじみ、2回目：炎本体
          for (let i = 0; i < spots.length; i++) {
            const [ox, oy, sc] = spots[i], frame = (Math.floor(now / 90) + i * 2) % 5, st = Math.max(0, stage - (i ? 1 : 0));
            const sz = f.R * 1.9 * sc * (pass ? 1 : 1.25), x = f.x + ox * f.R, y = f.y + oy * f.R * 0.6;
            ctx.globalAlpha = fade * (pass ? 0.5 : 0.14) * flick;
            ctx.drawImage(atlas, st * C, frame * C, C, C, x - sz / 2, y - sz * 0.85, sz, sz);
          }
        }
        ctx.globalCompositeOperation = 'source-over';
      }
      ctx.globalAlpha = 1;
    } else if (f.kind === 'bolt') { // 雷：素材の稲妻を加算合成で光らせ、数コマ切り替えてバリバリ光らせる
      const k = (now - f.start) / BOLT_MS;
      if (k < 0.12) { ctx.fillStyle = `rgba(230,240,255,${0.28 * (1 - k / 0.12)})`; ctx.fillRect(arena.x - arena.radius, arena.y - arena.radius, arena.radius * 2, arena.radius * 2); } // 一瞬の閃光
      const grp = BOLT_GROUPS[Math.floor(f.seed) % BOLT_GROUPS.length], fr = grp[(Math.floor((now - f.start) / 55) + Math.floor(f.seed)) % grp.length];
      const img = BOLT_IMG, H = Math.min(220, arena.radius * 1.1), C = img.naturalWidth / 12;
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      if (img.complete && img.naturalWidth) {
        const W = H * C / img.naturalHeight * 0.55, flick = k < 0.6 ? (Math.floor(now / 40) % 2 ? 1 : 0.7) : 1 - (k - 0.6) / 0.4;
        ctx.globalAlpha = 0.25 * flick; ctx.drawImage(img, fr * C, 0, C, img.naturalHeight, f.x - W * 0.6, f.y - H * 1.01, W * 1.2, H * 1.02); // 外側のにじみ
        ctx.globalAlpha = flick; ctx.drawImage(img, fr * C, 0, C, img.naturalHeight, f.x - W / 2, f.y - H, W, H);
      }
      const g = ctx.createRadialGradient(f.x, f.y, 2, f.x, f.y, f.R * (0.8 + k * 0.8)); // 落ちた所の光
      g.addColorStop(0, `rgba(255,255,255,${0.8 * (1 - k)})`); g.addColorStop(0.4, `rgba(140,200,255,${0.5 * (1 - k)})`); g.addColorStop(1, 'rgba(80,120,255,0)');
      ctx.globalAlpha = 1; ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(f.x, f.y, f.R * (0.8 + k * 0.8), f.R * (0.45 + k * 0.45), 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
  }
  for (const p of weaponProj) {
    ctx.save(); ctx.translate(p.x, p.y);
    if (p.id === 'coin') { // くるくる回る金貨
      p.spin += 0.5; const sx = Math.max(0.25, Math.abs(Math.cos(p.spin)));
      ctx.scale(sx, 1); ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI * 2); ctx.fillStyle = '#ffcf3d'; ctx.fill();
      ctx.lineWidth = 1.5; ctx.strokeStyle = '#b8860b'; ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.beginPath(); ctx.arc(-1.6, -1.6, 2.2, 0, Math.PI * 2); ctx.fill();
    } else if (p.id === 'dove') { ctx.scale(p.vx > 0 ? -1 : 1, 1); /* 画像の鳩は左向き */ ctx.rotate(Math.atan2(p.vy, Math.abs(p.vx)) * (p.vx > 0 ? -1 : 1) * 0.8 + Math.sin(p.t * 0.5) * 0.08); /* 進む向きへ機首を傾ける */ const flap = Math.sin(p.t * 1.3); ctx.translate(0, -flap * 2); ctx.scale(1 + flap * 0.06, 0.78 + 0.22 * Math.abs(flap)); /* 羽ばたき：小刻みに縦に伸び縮み＆上下 */ if (!drawWeaponImg('dove', 26)) { ctx.font = '17px sans-serif'; ctx.fillText('🕊️', 0, 0); } }
    else if (p.id === 'knife') { ctx.rotate(Math.atan2(p.vy, p.vx) + Math.PI * 0.75); if (!drawWeaponImg('knife', 36)) { ctx.font = '22px sans-serif'; ctx.fillText('🔪', 0, 0); } } // 画像の刃は左上向き
    else if (p.id === 'holyWater') { ctx.rotate(p.t * 0.3); if (!drawWeaponImg('holyWater', 42)) { ctx.font = '28px sans-serif'; ctx.fillText('🧴', 0, 0); } }
    else { ctx.rotate(p.t * (p.id === 'cross' ? 0.35 : p.id === 'axe' ? 0.4 * AXE_SPEED : 0.4)); const sz = p.id === 'boomerang' ? 26 : p.id === 'axe' ? 44 : p.id === 'cross' ? 42 : 28; if (!drawWeaponImg(p.id, sz)) { ctx.font = (p.id === 'boomerang' ? 17 : p.id === 'axe' ? 32 : p.id === 'cross' ? 28 : 19) + 'px sans-serif'; ctx.fillText(WEAPONS[p.id].icon, 0, 0); } }
    ctx.restore();
  }
  const slv = equippedWeaponLv('shield');
  if (slv && pl && pl.hp > 0) {
    const n = [0, 1, 2, 2, 3, 4][slv], R = pl.radius + 30;
    ctx.font = '17px sans-serif';
    for (let i = 0; i < n; i++) { const a = shieldAngle + Math.PI * 2 * i / n; ctx.save(); ctx.translate(pl.x + Math.cos(a) * R, pl.y + Math.sin(a) * R); if (!drawWeaponImg('buckler', 24)) ctx.fillText('🛡️', 0, 0); ctx.restore(); }
  }
  ctx.restore();
}
// 引っ張りの音：引っ張り始めた瞬間だけ、ゴムを引くような「キュッ」と短く鳴らす
let chargeHum = null; // 引っ張り中のチャージ音：ファミコン版ロックマン風（VRC6音源）。半音ずつカクカク上がる「ピロロロロ↑」、溜まりきると一番上の音で鳴り続ける
const CHARGE_SOUND_MS = 1200; // 溜まりきるまでの時間
function updateChargeHum(lv) { // lv＝溜めた時間の割合（0〜1）
  const on = lv > 0 && typeof audioCtx !== 'undefined' && audioCtx && !isBattleSfxMuted();
  if (!on) { if (chargeHum) { const t = audioCtx.currentTime, h = chargeHum; h.g.gain.cancelScheduledValues(t); h.g.gain.setValueAtTime(0.0001, t + 0.01); setTimeout(() => { try { h.oscs.forEach(o => o.stop()); } catch (e) {} }, 100); chargeHum = null; } return; } // ファミコンらしくスパッと止める
  const t = audioCtx.currentTime, v = (game.sfxVolume ?? 0.7), full = lv >= 1;
  const semi = Math.round(lv * 24); // 2オクターブを半音ずつ
  const f = 220 * Math.pow(2, semi / 12); // ラから
  if (!chargeHum) {
    const o1 = audioCtx.createOscillator(), o2 = audioCtx.createOscillator(), sw = audioCtx.createOscillator(), swg = audioCtx.createGain(), o2g = audioCtx.createGain(), g = audioCtx.createGain();
    o1.setPeriodicWave(getPceWave('vrc6pulse25')); o2.setPeriodicWave(getPceWave('vrc6pulse12'));
    o1.frequency.value = f; o2.frequency.value = f * 2; o2g.gain.value = 0.35;
    sw.type = 'square'; sw.frequency.value = 15; swg.gain.value = 0; sw.connect(swg); swg.connect(o1.frequency); swg.connect(o2.frequency); // 溜まりきったら2音を素早く行き来
    o1.connect(g); o2.connect(o2g); o2g.connect(g); g.connect(audioCtx.destination); g.gain.value = 0.0001;
    [o1, o2, sw].forEach(o => o.start());
    chargeHum = { oscs: [o1, o2, sw], o1, o2, sw, swg, g, full: false };
  }
  const h = chargeHum;
  if (full) { // 溜まりきったら一番上の音で鳴り続ける（ベルのような2音の行き来はしない）
    h.full = true;
    h.swg.gain.setValueAtTime(0, t);
    h.o1.frequency.setValueAtTime(880, t); h.o2.frequency.setValueAtTime(1760, t);
    h.g.gain.setTargetAtTime(0.03 * v, t, 0.01);
  } else {
    h.full = false;
    h.swg.gain.setValueAtTime(0, t);
    h.o1.frequency.setValueAtTime(f, t); h.o2.frequency.setValueAtTime(f * 2, t); // カクカク段階的に
    h.g.gain.setTargetAtTime((0.018 + lv * 0.012) * v, t, 0.01);
  }
}
function tickChargeSound() { // 引っ張り中のチャージ音：ロータリーエンジンの空ぶかし
  const lvNow = chargeHold && phase === 'battle' ? getChargeLevel() : 0;
  if (lvNow >= PULL_MIN && chargeHold && !chargeHold.soundStart) chargeHold.soundStart = Date.now(); // 引っ張り始めた時から溜めの時間を数える
  updateChargeHum(lvNow >= PULL_MIN && chargeHold ? Math.min(1, Math.max(0.01, (Date.now() - chargeHold.soundStart) / CHARGE_SOUND_MS)) : 0); // 音は溜めた時間で上がる
  if (!chargeHold || phase !== 'battle') return;
  const lv = lvNow; if (lv < PULL_MIN) return;
  if (!chargeHold.pullSnd) { chargeHold.pullSnd = true; thump(320, 760, 0.14, 0.05, 'triangle'); thump(640, 1500, 0.1, 0.015, 'sine', 0.01); }
}
function drawChargeRing() { // 引っ張り中：発射方向の矢印（長さ＝威力）と、引っ張っている線
  const pl = balls.find(isMainPlayerBall);
  if (!pl) return;
  if (autoAim && isAutoMode()) { const t = Math.min(1, (Date.now() - autoAim.start) / AUTO_AIM_MS); drawPullArrow(pl, autoAimAngle(), autoAim.lv * (0.25 + 0.75 * t)); return; } // AUTOも指と同じ矢印で狙いを付ける
  if (!chargeHold || !getPullVec()) return;
  drawPullArrow(pl, getPullAngle(), getChargeLevel());
}
function drawPullArrow(pl, a, lv) {
  const full = lv >= 1, now = Date.now();
  if (lv < PULL_MIN) return;
  ctx.save();
  ctx.lineCap = 'round';
  const ux = Math.cos(a), uy = Math.sin(a), col = full ? '#ff4f6d' : lv > 0.5 ? '#ffb35c' : '#ffe08a';
  // 引っ張っている側（ゴムのような線）
  ctx.setLineDash([]); ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.beginPath(); ctx.moveTo(pl.x, pl.y); ctx.lineTo(pl.x - ux * (pl.radius + 40 * lv), pl.y - uy * (pl.radius + 40 * lv)); ctx.stroke();
  // 発射方向の矢印
  const len = 40 + 110 * lv, sx = pl.x + ux * (pl.radius + 4), sy = pl.y + uy * (pl.radius + 4), ex = sx + ux * len, ey = sy + uy * len;
  if (full) { ctx.shadowColor = col; ctx.shadowBlur = 10 + Math.sin(now / 60) * 5; }
  ctx.strokeStyle = col; ctx.lineWidth = 5 + 3 * lv; ctx.setLineDash([10, 7]); ctx.lineDashOffset = -now / 20;
  ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();
  ctx.setLineDash([]); ctx.fillStyle = col;
  ctx.beginPath(); ctx.moveTo(ex + ux * 14, ey + uy * 14); ctx.lineTo(ex - uy * 10, ey + ux * 10); ctx.lineTo(ex + uy * 10, ey - ux * 10); ctx.closePath(); ctx.fill();
  ctx.shadowBlur = 0;
  // 威力の輪
  ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.beginPath(); ctx.arc(pl.x, pl.y, pl.radius + 9, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = col; ctx.beginPath(); ctx.arc(pl.x, pl.y, pl.radius + 9, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * lv); ctx.stroke();
  if (full) { ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center'; ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(0,0,0,0.7)'; ctx.strokeText('MAX', pl.x, pl.y - pl.radius - 16); ctx.fillStyle = '#ffd76b'; ctx.fillText('MAX', pl.x, pl.y - pl.radius - 16); }
  ctx.restore();
}
// レベルアップ3択の強化（転生まで）：引っ張り体当たり・近距離の切り払い
const RUN_BUFF_MAX = 5;
const RUN_BUFFS = {
  pull:  { icon: '🎯', name: '引っ張り体当たり強化', desc: '引っ張り攻撃のダメージ+25%・飛ぶ時間+10%' },
  slash: { icon: '🗡️', name: '近距離攻撃強化', desc: 'タップの切り払いのダメージ+30%・範囲+6' },
};
function getRunBuff(id) { return (game.runBuffs && game.runBuffs[id]) || 0; }
function getRushDmgMult() { return rushingNow && holdRush ? pullMashMult() * (1 + (RUSH_RUN_MAX - 1) * (holdRush.charge || 0)) * (holdRush.shot ? 1 + 0.25 * getRunBuff('pull') : 1) * (holdRush.auto ? AUTO_ATK_MULT : MANUAL_ATK_MULT) : 1; }
function getRushPierce() { return 0; } // 体当たりは貫通しない（敵を吹っ飛ばす）
const RUSH_KNOCK_SPEED = 16; // 体当たりで敵を吹っ飛ばす初速（貫きの蹄鉄1個ごとに+25%）
function rushKnockFly(en, from) {
  if (!en || en.isDying) return;
  const dx = en.x - from.x, dy = en.y - from.y, d = Math.hypot(dx, dy) || 1;
  const k = RUSH_KNOCK_SPEED * (1 + 0.25 * Math.min(3, (isArtifactShown('pierceHoof') && game.ownedArtifacts && game.ownedArtifacts.pierceHoof) || 0)) * (en.isBoss ? 0.35 : 1);
  if (Math.hypot(en.kbx || 0, en.kby || 0) >= k * 0.8) return; // 同じ当たりで重ねがけしない
  en.kbx = dx / d * k; en.kby = dy / d * k;
}
// 乱舞：連打でゲージを溜め、満タンになるとゲージが尽きるまで敵から敵へ高速で斬りかかる（跳ね返らず・反撃を受けない）
const RAMPAGE_PER_TAP = 0.12, RAMPAGE_DECAY = 0.006, RAMPAGE_FRAMES = 300, RAMPAGE_DMG = 1.5;
let rampageCharge = 0, rampageLeft = 0;
function isRampage() { return rampageLeft > 0; }
function addRampageTap() {
  if (isRampage()) return;
  rampageCharge = Math.min(1, rampageCharge + RAMPAGE_PER_TAP);
  if (rampageCharge >= 1) {
    rampageCharge = 0; rampageLeft = RAMPAGE_FRAMES;
    const pl = balls.find(isMainPlayerBall);
    if (pl) spawnDamageText(pl.x, pl.y - 50, '⚔️ 乱舞！！', '#ff4f6d', 0.02, true);
    shakeScreenLight(); playAccelSound();
  }
}
function tickRampage(speedMult) {
  if (isRampage()) rampageLeft = Math.max(0, rampageLeft - speedMult);
  else rampageCharge = Math.max(0, rampageCharge - RAMPAGE_DECAY * speedMult);
}
function moveRampage(ball, speedMult) {
  const en = nearestOf(ball, [...balls, ...adds].filter(x => !x.isPlayer && !x.isDying && x.hp > 0 && !(x.spawnTimer > 0) && !(x.hitCooldown > 0)))
    || nearestOf(ball, [...balls, ...adds].filter(x => !x.isPlayer && !x.isDying && x.hp > 0));
  if (en) {
    const a = Math.atan2(en.y - ball.y, en.x - ball.x), sp = BOUNCE_SPEED * 5.5, t = 1 - Math.pow(0.6, speedMult);
    ball.vx += (Math.cos(a) * sp - ball.vx) * t; ball.vy += (Math.sin(a) * sp - ball.vy) * t;
  }
  ball.x += ball.vx * speedMult; ball.y += ball.vy * speedMult;
  wallBounce(ball);
  ball.seekPoint = null; ball.missBounces = 0;
  if (Math.random() < 0.5 * speedMult) particles.push({ x: ball.x, y: ball.y, vx: 0, vy: 0, life: 0.6, decay: 0.05, color: '#ff8a5c' }); // 残像
}
function drawRampageGauge() {
  const pl = balls.find(isMainPlayerBall);
  if (!pl || (!isRampage() && rampageCharge <= 0)) return;
  const v = isRampage() ? rampageLeft / RAMPAGE_FRAMES : rampageCharge;
  const w = 44, h = 5, x = pl.x - w / 2, y = pl.y + pl.radius + 8;
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fillRect(x - 1, y - 1, w + 2, h + 2);
  ctx.fillStyle = isRampage() ? (Math.floor(Date.now() / 100) % 2 ? '#ff4f6d' : '#ffd76b') : '#ff9f43';
  ctx.fillRect(x, y, w * v, h);
  if (isRampage()) { ctx.strokeStyle = 'rgba(255,79,109,0.7)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(pl.x, pl.y, pl.radius + 6 + Math.sin(Date.now() / 60) * 2, 0, Math.PI * 2); ctx.stroke(); }
  ctx.restore();
}
function isRushPiercing() { return isRampage() || (rushingNow && holdRush && !holdRush.used && (holdRush.hits || 0) < getRushPierce()); }
function consumeRushHit(x, y) {
  if (isRampage()) return;
  if (!rushingNow || !holdRush || holdRush.used) return;
  if ((holdRush.hits || 0) < getRushPierce()) { // 貫通中：跳ね返らずにそのまま次の敵へ
    holdRush.hits = (holdRush.hits || 0) + 1;
    if (x !== undefined) spawnDamageText(x, y - 58, `貫通！ ${holdRush.hits}/${getRushPierce() + 1}`, '#7ee7ff', 0.022, true);
    return;
  }
  const m = getRushDmgMult();
  if (holdRush.shot) { // 引っ張り発射は時間いっぱい跳ね回って何度でも当たる
    if (!holdRush.shown && m >= 1.2 && x !== undefined) spawnDamageText(x, y - 44, `パワー ×${m.toFixed(1)}`, m >= RUSH_RUN_MAX ? '#ff4f6d' : '#ffb35c', 0.022, m >= RUSH_RUN_MAX);
    holdRush.shown = true;
    return;
  }
  if (m >= 1.2 && x !== undefined) spawnDamageText(x, y - 44, `タメ ×${m.toFixed(1)}`, m >= RUSH_RUN_MAX ? '#ff4f6d' : '#ffb35c', 0.022, m >= RUSH_RUN_MAX);
  if (m >= RUSH_RUN_MAX) shakeScreenLight();
  holdRush.used = true;
}
function tickRushGauge() { if (holdRush && holdRush.until && Date.now() > holdRush.until) holdRush.used = true; rushingNow = !!holdRush && !holdRush.used; return rushingNow; }
const HOLD_RUSH_SPEED = 5.2, HOLD_RUSH_TURN = 0.26; // 突撃の速さ（反射移動の何倍か）と、敵へ向きを合わせる速さ
function moveHoldRush(ball, speedMult) {
  if (holdRush && holdRush.shot) { // 引っ張り発射：まっすぐ飛んで壁・敵で跳ね返り、終わり際に減速
    const cur = Math.hypot(ball.vx, ball.vy) || 1, ux = ball.vx / cur, uy = ball.vy / cur;
    if (holdRush.ux !== undefined && ux * holdRush.ux + uy * holdRush.uy < 0.95) { // 壁や敵で跳ね返ったら摩擦で減速
      holdRush.bounces = (holdRush.bounces || 0) + 1;
      const taps = holdRush.tapsSinceBounce || 0; holdRush.tapsSinceBounce = 0;
      const boost = taps ? 1 + Math.min(PULL_MASH_ACCEL_MAX, PULL_MASH_ACCEL * taps) : 1; // 跳ね返るまでに連打していたら追加で加速
      holdRush.speed = Math.min(PULL_SPEED_MAX + (taps ? PULL_MASH_SPEED_EXTRA : 0), holdRush.speed * PULL_BOUNCE_ACCEL * boost); // 跳ね返るたびに少し加速（上限あり）
      if (taps) { const pl = balls.find(isMainPlayerBall); if (pl) { for (let i = 0; i < 6; i++) spawnHitParticles(pl.x, pl.y, i % 2 ? '#ffe08a' : '#ffffff'); } thump(300, 900, 0.12, 0.06, 'sawtooth'); }
    }
    holdRush.ux = ux; holdRush.uy = uy;
    const r = Math.max(0, (holdRush.until - Date.now()) / holdRush.dur), sp = holdRush.speed * (0.3 + 0.7 * Math.min(1, r * 1.6));
    ball.vx = ux * sp; ball.vy = uy * sp;
  } else {
  const en = nearestOf(ball, [...balls, ...adds].filter(x => !x.isPlayer && !x.isDying && x.hp > 0 && !(x.spawnTimer > 0)));
  if (en) {
    const a = Math.atan2(en.y - ball.y, en.x - ball.x), sp = BOUNCE_SPEED * HOLD_RUSH_SPEED;
    const t = 1 - Math.pow(1 - HOLD_RUSH_TURN, speedMult);
    ball.vx += (Math.cos(a) * sp - ball.vx) * t; ball.vy += (Math.sin(a) * sp - ball.vy) * t;
  }
  }
  ball.x += ball.vx * speedMult; ball.y += ball.vy * speedMult;
  if (holdRush) holdRush.dist = (holdRush.dist || 0) + Math.hypot(ball.vx, ball.vy) * speedMult; // 助走距離
  rushTrail.push({ x: ball.x, y: ball.y, t: Date.now() }); // ダッシュの残像
  const pvx = ball.vx, pvy = ball.vy;
  if (Math.random() < 0.5 * speedMult) particles.push({ x: ball.x - ball.vx * 1.5 + (Math.random() - 0.5) * 10, y: ball.y + ball.radius * 0.8, vx: -ball.vx * 0.15 + (Math.random() - 0.5), vy: -Math.random() * 0.8, life: 0.7, color: 'rgba(230,220,200,0.8)', decay: 0.05 }); // 足元の砂ぼこり
  wallBounce(ball);
  if (holdRush && holdRush.shot && (Math.sign(pvx) !== Math.sign(ball.vx) || Math.sign(pvy) !== Math.sign(ball.vy))) playPullWallChain(ball, holdRush);
  ball.seekPoint = null; ball.missBounces = 0;
}
// 引っ張り攻撃の壁反射音：跳ね返るたびに音階が上がる連鎖音（カキーン→キーン→…）
const PULL_WALL_SCALE = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24];
function playPullWallChain(ball, rush) {
  rush.wallChain = (rush.wallChain || 0) + 1;
  if (rush.wallChain > (game.maxBounceChain || 0)) game.maxBounceChain = rush.wallChain; // 戦歴の最大反射連鎖
  const n = rush.wallChain, f = 659 * Math.pow(2, PULL_WALL_SCALE[Math.min(n - 1, PULL_WALL_SCALE.length - 1)] / 12);
  thump(f, f * 0.98, 0.2, 0.07, 'square');
  thump(f * 2, f * 2, 0.12, 0.03, 'triangle');
  thump(f * 3.01, f * 3.01, 0.08, 0.012, 'sine', 0.01);
  spawnHitParticles(ball.x, ball.y, '#bfe8ff');
  if (n >= 2) spawnDamageText(ball.x, ball.y - ball.radius - 20, `反射 ${n}連鎖！`, n >= 5 ? '#ff4f6d' : '#7ee7ff', 0.03, n >= 5);
}
// タックル（長押しのタメ体当たり）は今の仕様では使わないので処理を空にしてある
function getTackleChargeLevel() { return -1; }
function startChargeSound() {}
function stopChargeSound() {}
function updateTackleHold() {}
function releaseTackleCharge() { arenaHeld = false; tackleChargeStart = 0; }
function steerTackle() {}
function performTackleHit() { tackle = null; }
function tackleTrade() {}
function drawTackleEffects() {}
const BOOST_MULT = 1.9;
const TAP_ACCEL_PER_TAP = 0.5;  // 1タップあたり +50%
const TAP_ACCEL_MAX = 5;        // 最大5倍速
const TAP_DMG_PER_ACCEL = 0.5;  // 連打で加速した分だけ、次に敵にぶつかったときのダメージも上がる（1タップ +25%、最大 +200%）
function getTapDmgMult(tapMult) { return 1 + Math.max(0, (tapMult || 1) - 1) * TAP_DMG_PER_ACCEL; }
let lastHealAt = Date.now() - HEAL_COOLDOWN;
const BARRIER_COOLDOWN = 4 * 60 * 1000;
const BARRIER_MAX_HITS = 5; // バリアが肩代わりできる被ダメージ回数
const BARRIER_ORB_COUNT = 3;
const BARRIER_ORBIT_RADIUS = 44;
const BARRIER_ROT_SPEED = 0.06;
let lastBarrierAt = Date.now() - BARRIER_COOLDOWN;

const HOMING_COOLDOWN = 2 * 60 * 1000;
const HOMING_MISSILE_COUNT = 6;
const HOMING_DMG_MULT = 0.8;       // 1発あたり 攻撃力 × 0.8（命中判定・クリティカルあり）
const HOMING_TURN_RATE = 0.1;      // 追尾の曲がりやすさ
const HOMING_START_SPEED = 3.5, HOMING_MAX_SPEED = 8;
const HOMING_LIFE_FRAMES = 300;
let lastHomingAt = Date.now() - HOMING_COOLDOWN;
let homingMissiles = [];
function launchHomingMissiles(player, count = HOMING_MISSILE_COUNT, dmg = null) {
  const enemy = balls.find(ball => !ball.isPlayer);
  const baseAngle = enemy ? Math.atan2(enemy.y - player.y, enemy.x - player.x) + Math.PI : Math.random() * Math.PI * 2;
  for (let i = 0; i < count; i++) {
    const angle = baseAngle + (i - (count - 1) / 2) * 0.45;
    homingMissiles.push({
      x: player.x, y: player.y,
      vx: Math.cos(angle) * HOMING_START_SPEED, vy: Math.sin(angle) * HOMING_START_SPEED,
      speed: HOMING_START_SPEED, life: HOMING_LIFE_FRAMES, trail: [], delay: i * 4, dmg
    });
  }
}
function updateHomingMissiles(speedMult) {
  if (!homingMissiles.length || phase !== 'battle') return;
  const enemy = balls.find(ball => !ball.isPlayer);
  const player = balls.find(ball => ball.isPlayer && !ball.isClone && !ball.isCompanion);
  const canHit = enemy && !enemy.isDying && !(enemy.spawnTimer > 0);
  for (const m of homingMissiles) {
    if (m.delay > 0) { m.delay -= speedMult; if (player) { m.x = player.x; m.y = player.y; } continue; }
    m.life -= speedMult;
    m.speed = Math.min(HOMING_MAX_SPEED, m.speed + 0.12 * speedMult);
    if (canHit) {
      const dx = enemy.x - m.x, dy = enemy.y - m.y;
      const dist = Math.hypot(dx, dy) || 1;
      m.vx += ((dx / dist) * m.speed - m.vx) * HOMING_TURN_RATE * speedMult;
      m.vy += ((dy / dist) * m.speed - m.vy) * HOMING_TURN_RATE * speedMult;
    }
    const cur = Math.hypot(m.vx, m.vy) || 1;
    m.vx = m.vx / cur * m.speed;
    m.vy = m.vy / cur * m.speed;
    m.trail.push({ x: m.x, y: m.y });
    if (m.trail.length > 6) m.trail.shift();
    m.x += m.vx * speedMult;
    m.y += m.vy * speedMult;
    if (canHit && !enemy.isDying && Math.hypot(enemy.x - m.x, enemy.y - m.y) < enemy.radius + 5) {
      m.hit = true;
      spawnHitParticles(m.x, m.y, '#ff8a4f');
      if (!playerAttackHits(enemy)) { spawnMissText(enemy); continue; }
      const base = m.dmg != null ? m.dmg : (player ? player.atk : getPlayerAtk()) * HOMING_DMG_MULT;
      const { dmg, crit } = rollCrit(Math.max(1, Math.round(base)), enemy);
      enemy.hp -= dmg;
      trackDamage(dmg);
      spawnAttackDamageText(enemy, dmg, crit, '#ffc3a0');
      onPlayerHitEnemy(enemy, dmg);
      playHomingHitSound();
      updateHPUI();
      if (enemy.hp <= 0) triggerEnemyDefeat(enemy, m.x, m.y);
    }
  }
  homingMissiles = homingMissiles.filter(m => !m.hit && m.life > 0);
}
const REGEN_COOLDOWN = 150 * 1000;
const REGEN_MS = 20 * 1000;
const REGEN_RATIO_PER_SEC = 0.02; // 毎秒 最大HPの2%（20秒で合計40%）
let lastRegenAt = Date.now() - REGEN_COOLDOWN;
let regenEndAt = 0;
let lastRegenTickAt = 0;
let regenHealAccum = 0; // 回復量の表示用（1秒ごとにまとめて表示）
const REGEN_PASSIVE_RATIO = 0.005; // 常時発動のリヒール：毎秒 最大HPの0.5%（控えめ）
function isRegenActive() { return !!game.shopOwned.skillRegen || Date.now() < regenEndAt; }
function updateRegen() {
  const now = Date.now();
  if (!isRegenActive()) return;
  const rate = now < regenEndAt ? REGEN_RATIO_PER_SEC : REGEN_PASSIVE_RATIO;
  const player = balls.find(ball => ball.isPlayer && !ball.isClone && !ball.isCompanion);
  const dt = Math.min(0.1, (now - (lastRegenTickAt || now)) / 1000);
  lastRegenTickAt = now;
  if (!player || player.hp <= 0 || player.hp >= player.maxHp) return;
  const heal = player.maxHp * rate * dt;
  player.hp = Math.min(player.maxHp, player.hp + heal);
  regenHealAccum += heal;
  if (regenHealAccum >= Math.max(1, player.maxHp * 0.02)) { // 最大HPの2%たまるごとにまとめて表示
    spawnDamageText(player.x, player.y - player.radius - 14, '+' + Math.round(regenHealAccum) + ' HP', '#5fe0a8', 0.012); // 約1.4秒表示
    regenHealAccum = 0;
  }
  updateHPUI();
}
function drawRegenEffects() {
  if (!isRegenActive()) return;
  const player = balls.find(ball => ball.isPlayer && !ball.isClone && !ball.isCompanion);
  if (!player) return;
  if (Math.random() < (Date.now() < regenEndAt ? 0.25 : 0.05)) { // 常時発動中は控えめに光の粒
    const a = Math.random() * Math.PI * 2;
    particles.push({ x: player.x + Math.cos(a) * player.radius, y: player.y + Math.sin(a) * player.radius, vx: 0, vy: -0.6, life: 0.8, color: '#5fe0a8', decay: 0.03 });
  }
  ctx.save();
  ctx.strokeStyle = 'rgba(95,224,168,0.6)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius + 4 + Math.sin(Date.now() / 200) * 1.5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

const SILENCE_COOLDOWN = 120 * 1000;
const SILENCE_MS = 15 * 1000;
let lastSilenceAt = Date.now() - SILENCE_COOLDOWN;
let silenceEndAt = 0;
function isSilenced() { return Date.now() < silenceEndAt; }
const SACRIFICE_COOLDOWN = 45 * 1000;
const SACRIFICE_HP_RATIO = 0.3;  // 現在HPの30%を削る
const SACRIFICE_DMG_MULT = 8;    // 攻撃力の8倍ダメージ
let lastSacrificeAt = Date.now() - SACRIFICE_COOLDOWN;
const PINCH_HP_RATIO = 0.3;      // 背水：HPがこの割合以下で発動
const SKILL_DEATH_COOLDOWN = 90 * 1000;
const DEATH_CHANCE = 0.3, DEATH_CHANCE_BOSS = 0.08; // 即死の成功率（通常／ボス）
const SKILL_COINSTRIKE_COOLDOWN = 120 * 1000;
const COIN_STRIKE_MS = 20 * 1000;
const COIN_STRIKE_KILL_MULT = 1.5; // コイン攻撃中の討伐コイン倍率
const SKILL_ZENI_COOLDOWN = 30 * 1000;
const ZENI_MIN_COINS = 10;
const ZENI_DMG_PER_COIN = 1.5;   // 投げたコイン1枚あたりのダメージ
const SKILL_MYSTERY_COOLDOWN = 60 * 1000;
let lastDeathAt = Date.now() - SKILL_DEATH_COOLDOWN;
let lastCoinStrikeAt = Date.now() - SKILL_COINSTRIKE_COOLDOWN;
let coinStrikeEndAt = 0;
let lastZeniAt = Date.now() - SKILL_ZENI_COOLDOWN;
let lastMysteryAt = Date.now() - SKILL_MYSTERY_COOLDOWN;
const SKILL_COMPRUSH_COOLDOWN = 60 * 1000;
const COMP_RUSH_DMG_MULT = 4; // 仲間1体（人数込みの攻撃力）あたりのダメージ倍率
let lastCompRushAt = Date.now() - SKILL_COMPRUSH_COOLDOWN;
const SKILL_NOVA_COOLDOWN = 40 * 1000;
const NOVA_DMG_MULT = 4; // 敵1体あたり攻撃力の何倍か
let lastNovaAt = Date.now() - SKILL_NOVA_COOLDOWN;
let novaFx = null; // 全体攻撃の衝撃波 { start }
const SKILL_BLAST_COOLDOWN = 90 * 1000;
const BLAST_DMG_MULT = 15; // 大爆発：敵1体あたり攻撃力の15倍（ボスは2割増しの手応え演出のみ）
let lastBlastAt = Date.now() - SKILL_BLAST_COOLDOWN;
let blastFx = null; // 大爆発の閃光 { start }
function isCoinStrike() { return Date.now() < coinStrikeEndAt; }
function beginSkill(event, skillKey, resetKey, cooldown, lastAt, setLast, updateFn, needEnemy = true) {
  if (!game.shopOwned[skillKey]) { showTapError('スキルページで解放・装備してください', event.clientX, event.clientY); return null; }
  const player = balls.find(ball => isMainPlayerBall(ball));
  const enemy = balls.find(ball => !ball.isPlayer && !ball.isDying);
  if (phase !== 'battle' || !player || (needEnemy && (!enemy || enemy.spawnTimer > 0))) { showTapError('今は使えません', event.clientX, event.clientY); return null; }
  if (Date.now() - lastAt < skillCd(skillKey, cooldown)) { tryGemResetSkill(resetKey, event, () => { setLast(Date.now() - cooldown); }, updateFn); return null; }
  setLast(Date.now());
  return { player, enemy };
}
