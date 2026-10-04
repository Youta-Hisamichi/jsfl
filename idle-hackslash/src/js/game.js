function step() {
  const a = balls.find(ball => ball.isPlayer && !ball.isClone && !ball.isCompanion);
  if (!a) return;
  const b = computeBonuses();
  const speedMult = getEffectiveSpeed();
  tickObstacles();
  tickAutoPull();
  tickRampage(speedMult);
  updateWeapons(a, speedMult);
  updateExpGems(speedMult);
  a.atk = getPlayerAtk(); // 加速中ボーナス等を毎フレーム反映
  a.inPinch = b.pinchAtk > 0 && a.hp > 0 && a.hp <= a.maxHp * PINCH_HP_RATIO;
  if (a.inPinch) a.atk = Math.max(1, Math.round(a.atk * (1 + b.pinchAtk)));
  const e = balls.find(ball => !ball.isPlayer);
  updateBarrierOrbs(a, e, speedMult, b);

  if (!e) {
    movePlayerSideBalls(balls, speedMult, b);
    return;
  }

  if (e.isDying) {
    e.shakeTimer = Math.max(0, e.shakeTimer - speedMult); // 吹っ飛びの移動は updateFlyouts で行う
    const swarm = !e.isBoss && isSwarmStage(game.stage);
    const swarmLeft = adds.filter(ad => ad.hp > 0 && (swarm || ad.isSplit)).length;
    if (swarmLeft > 0) {
      movePlayerSideBalls([...balls, ...adds], speedMult, b);
      if (!e.swarmNotified) { e.swarmNotified = true; showNotice(`残りの敵を全部倒せ！（あと ${swarmLeft} 体）`); }
      processAdds(a);
      return;
    }
    movePlayerSideBalls(balls, speedMult, b); // 演出中も自機側は動かし続ける
    if (e.shakeTimer <= 0) onStageClear();
    return;
  }

  let battleEnded = false;
  if (e.spawnTimer > 0) {
    e.spawnTimer = Math.max(0, e.spawnTimer - speedMult);
    const t = 1 - e.spawnTimer / 24;
    e.radius = Math.max(4, e.baseRadius * t);
    e.hitCooldown = Math.max(e.hitCooldown || 0, 10); // 出現中は無敵気味に
    if (e.spawnTimer > 0) { movePlayerSideBalls(balls, speedMult, b); return; } // 完全出現までは攻撃判定なし
  }

  const swarm = !e.isBoss && isSwarmStage(game.stage);
  if (swarm && !e.swarmStarted) { // 大群ステージ：開始時にまとめて出現し、減ったら補充
    e.swarmStarted = true;
    for (let i = 0; i < SWARM_ADDS; i++) adds.push(makeAddEnemy(e));
    showNotice('⚠️ 大群の階層！ 敵を全部倒すと次の階層へ');
    playSwarmSound();
  }
  const freeAdds = adds.filter(ad => !ad.mergeOwner).length;
  if (!e.isBoss && !swarm && freeAdds < MAX_FREE_ADDS && Math.random() < 0.0005) { // 大群ステージは補充しない（全滅させたらクリア）
    adds.push(makeAddEnemy(e));
  }

  movePlayerSideBalls([...balls, ...adds], speedMult, b);
  if (updateEnemyTraits(a, e, speedMult)) { onPlayerDeath(); return; }
  if (updateEnemyTelegraph(a, e, speedMult)) { onPlayerDeath(); return; }
  tickEnemyAtkPhase(e, speedMult);

  const piercing = isTackling() && getTacklePierceMs() > 0;
  const rushPierce = isRushPiercing(); // 貫きの蹄鉄：体当たりが跳ね返らずに貫通する
  const collided = (piercing || rushPierce) ? Math.hypot(e.x - a.x, e.y - a.y) < a.radius + e.radius : resolveBallCollision(a, e);
  const rushMult = collided ? getRushDmgMult() : 1; // 助走が長いほど体当たりが強い
  const stunMult = collided && isTelegraphStunned(e) ? TG_STUN_DMG : 1; // 攻撃後の隙は大ダメージ
  const tapDmgMult = getTapDmgMult(a.tapSpeedMult) * rushMult * (isRampage() ? RAMPAGE_DMG : 1) * stunMult;
  if (stunMult > 1 && a.hitCooldown === 0 && e.hitCooldown === 0) spawnDamageText(e.x, e.y - e.radius - 40, `スキあり！×${TG_STUN_DMG}`, '#ffd76b', 0.02, true); // リセット前の連打ボーナスでダメージを計算する
  if (collided && (!rushPierce || (a.hitCooldown === 0 && e.hitCooldown === 0))) consumeRushHit(e.x, e.y - e.radius); // 貫通中は実際に攻撃が入ったときだけ数える
  if (collided && !piercing) a.tapSpeedMult = 1; // 敵に衝突したらタップ加速をリセット
  if (collided && isTackling()) {
    if (tackle.hits && e.hitCooldown > 0) { /* 持続中・連続ヒット待ち */ } else {
    performTackleHit(a, e, b);
    if (e.isBoss && e.emoji === TACKLE_TRADE_BOSS && Math.random() < TACKLE_TRADE_CHANCE) tackleTrade(a, e);
    if (e.hp <= 0 && a.hp > 0) { triggerEnemyDefeat(e, a.x, a.y); battleEnded = true; }
    else if (a.hp <= 0) { onPlayerDeath(); return; }
    }
  } else if (collided && a.hitCooldown === 0 && e.hitCooldown === 0) {
    a.hitCooldown = HIT_LOCK_FRAMES; e.hitCooldown = HIT_LOCK_FRAMES;
    const combo = registerHit();
    const comboMult = getComboMultiplier(b.comboGrowth);
    if (combo >= 2) playChainSound(combo);

    // お試し：ぶつかったら敵味方が同時に攻撃する（麻痺・眠り中の敵は反撃できない）
    if (!MUTUAL_HIT) {
      const enemyIsHit = isDisabled(e) || Math.random() < getClashWinChance(e);
      if (enemyIsHit && !playerAttackHits(e)) {
        spawnMissText(e);
      } else if (enemyIsHit) {
        const { dmg, crit } = rollCrit(Math.max(1, Math.round(a.atk * comboMult * tapDmgMult)), e);
        e.hp -= dmg;
        trackDamage(dmg);
        spawnHitParticles((a.x + e.x) / 2, (a.y + e.y) / 2, '#ffb35c');
        spawnAttackDamageText(e, dmg, crit, '#fff4b8');
        if (tapDmgMult > 1 && rushMult === 1) spawnDamageText(e.x, e.y - e.radius - 34, `連打ボーナス +${Math.round((tapDmgMult - 1) * 100)}%`, '#ff9f43', 0.022, tapDmgMult >= 2);
        onPlayerHitEnemy(e, dmg);
        playEnemyHitSound();
        applyHitKnockback(e, a, 3.2);
      } else if (!enemyAttackHits(e)) {
        spawnEvadeText(a); // 回避したらバリアも消費しない
      } else if (absorbWithBarrier(a)) {
        applyHitKnockback(a, e, 3.2);
      } else {
        const { dmg, crit } = rollEnemyCrit(e, Math.max(1, Math.round(e.atk * comboMult)));
        a.hp -= dmg;
        spawnHitParticles((a.x + e.x) / 2, (a.y + e.y) / 2, '#5cc8ff');
        spawnReceivedDamageText(a, dmg, crit, e);
        playPlayerHitSound();
        applyHitKnockback(a, e, 3.2);
        if (a.hp > 0 && Math.random() < computeBonuses().counter) {
          const counter = rollCrit(Math.max(1, Math.round(a.atk * COUNTER_DMG_MULT)), e);
          e.hp -= counter.dmg;
          trackDamage(counter.dmg);
          spawnDamageText(e.x, e.y - e.radius - 30, 'COUNTER!', '#64e8ff', 0.014, true);
          spawnAttackDamageText(e, counter.dmg, counter.crit, '#b4f6ff');
          spawnHitParticles(e.x, e.y, '#64e8ff');
          onPlayerHitEnemy(e, counter.dmg);
          playCounterSound();
        }
      }
    } else {
      if (!playerAttackHits(e)) spawnMissText(e);
      else {
        const { dmg, crit } = rollCrit(Math.max(1, Math.round(a.atk * comboMult * tapDmgMult)), e);
        e.hp -= dmg;
        trackDamage(dmg);
        spawnHitParticles((a.x + e.x) / 2, (a.y + e.y) / 2, '#ffb35c');
        spawnAttackDamageText(e, dmg, crit, '#fff4b8');
        if (tapDmgMult > 1 && rushMult === 1) spawnDamageText(e.x, e.y - e.radius - 34, `連打ボーナス +${Math.round((tapDmgMult - 1) * 100)}%`, '#ff9f43', 0.022, tapDmgMult >= 2);
        onPlayerHitEnemy(e, dmg);
        playEnemyHitSound();
        applyHitKnockback(e, a, 3.2);
      }
      if (!isDisabled(e) && !isRampage() && isEnemyAttacking(e)) { // 敵が攻撃フェーズのときだけ、ぶつかると反撃される
        if (!enemyAttackHits(e)) spawnEvadeText(a);
        else if (absorbWithBarrier(a)) applyHitKnockback(a, e, 3.2);
        else {
          const { dmg, crit } = rollEnemyCrit(e, Math.max(1, Math.round(e.atk * comboMult)));
          a.hp -= dmg;
          spawnHitParticles((a.x + e.x) / 2, (a.y + e.y) / 2, '#5cc8ff');
          spawnReceivedDamageText(a, dmg, crit, e);
          playPlayerHitSound();
          applyHitKnockback(a, e, 3.2);
          if (a.hp > 0 && Math.random() < computeBonuses().counter) {
            const counter = rollCrit(Math.max(1, Math.round(a.atk * COUNTER_DMG_MULT)), e);
            e.hp -= counter.dmg;
            trackDamage(counter.dmg);
            spawnDamageText(e.x, e.y - e.radius - 30, 'COUNTER!', '#64e8ff', 0.014, true);
            spawnAttackDamageText(e, counter.dmg, counter.crit, '#b4f6ff');
            spawnHitParticles(e.x, e.y, '#64e8ff');
            onPlayerHitEnemy(e, counter.dmg);
            playCounterSound();
          }
        }
      }
    }
    updateHPUI();

    if (e.hp <= 0 && a.hp > 0) { triggerEnemyDefeat(e, a.x, a.y); battleEnded = true; }
    else if (a.hp <= 0) { onPlayerDeath(); return; }
  }

  if (!battleEnded) {
    const clones = balls.filter(ball => ball.isClone);
    for (const clone of clones) {
      if (resolveBallCollision(clone, e)) {
        const combo = registerHit();
        const comboMult = getComboMultiplier(b.comboGrowth);
        if (combo >= 2) playChainSound(combo);
        const cloneX = clone.x, cloneY = clone.y;
        balls = balls.filter(ball => ball !== clone); // 外しても分身は消滅
        if (!playerAttackHits(e)) { spawnMissText(e); continue; }
        const { dmg, crit } = rollCrit(Math.max(1, Math.round(clone.atk * comboMult)), e);
        e.hp -= dmg;
        trackDamage(dmg);
        spawnHitParticles(clone.x, clone.y, '#ffb35c');
        spawnAttackDamageText(e, dmg, crit, '#fff4b8');
        onPlayerHitEnemy(e, dmg);
        playEnemyHitSound();
        updateHPUI();
        if (e.hp <= 0) { triggerEnemyDefeat(e, cloneX, cloneY); battleEnded = true; break; }
      }
    }
  }

  if (!battleEnded) {
    const companionsInPlay = balls.filter(ball => ball.isCompanion && ball.hp > 0);
    for (const comp of companionsInPlay) {
      if (comp.hitCooldown > 0) continue;
      if (resolveBallCollision(comp, e)) {
        comp.hitCooldown = 30;
        const combo = registerHit();
        const comboMult = getComboMultiplier(b.comboGrowth);
        if (combo >= 2) playChainSound(combo);

        if (playerAttackHits(e)) {
          const cid = comp.companionId;
          let hitMult = 1, hitLabel = '';
          if (cid === 'lumber' && Math.random() < 0.25) { hitMult = 2; hitLabel = '大振り！'; }
          if (cid === 'lancer' && e.isBoss) hitMult = 1.5;
          if (cid === 'samurai' && Math.random() < 0.25) { hitMult = 3; hitLabel = '居合・一閃！'; }
          const { dmg, crit } = rollCrit(Math.max(1, Math.round(comp.atk * comboMult * hitMult)), e, cid === 'sprite' ? SPRITE_CRIT_BONUS : 0);
          if (hitLabel) spawnDamageText(e.x, e.y - e.radius - 30, hitLabel, COMPANION_COLORS[cid], 0.02);
          e.hp -= dmg;
          trackDamage(dmg);
          spawnHitParticles(comp.x, comp.y, comp.color);
          spawnAttackDamageText(e, dmg, crit, '#fff4b8');
          onPlayerHitEnemy(e, dmg);
          playEnemyHitSound();
          if (cid === 'knight') {
            applyHitKnockback(e, comp, 7);
            if (!e.isDying) { e.stunnedUntil = Date.now() + KNIGHT_STUN_MS; spawnDamageText(e.x, e.y + e.radius + 18, '💫 気絶', '#ffd76b'); }
          } else {
            applyHitKnockback(e, comp, 3.2);
          }
          if (cid === 'witch') {
            const coin = Math.max(1, Math.round((3 + game.stage * 0.5) * computeBonuses().coinMult));
            game.coins += coin;
            spawnDamageText(comp.x, comp.y - comp.radius - 10, '+' + formatCoinNumber(coin) + ' 🟡', '#ffd76b');
          }
          if (cid === 'monk' && !e.isDying && e.hp > 0) {
            const extra = Math.max(1, Math.round(dmg * MONK_EXTRA_HIT_RATIO));
            e.hp -= extra;
            trackDamage(extra);
            spawnDamageText(e.x + 14, e.y - e.radius - 24, '連撃 ' + formatCoinNumber(extra), '#ff8a5c');
          }
          if (cid === 'thief' && Math.random() < 0.3) {
            const coin = Math.max(1, Math.round((5 + game.stage * 1.5) * computeBonuses().coinMult));
            game.coins += coin;
            spawnDamageText(comp.x, comp.y - comp.radius - 10, '盗んだ！ +' + formatCoinNumber(coin) + ' 🟡', '#ffd76b');
          }
          if (cid === 'pirate' && Math.random() < 0.5 && !(comp.lootCdUntil > Date.now())) {
            comp.lootCdUntil = Date.now() + 8000;
            const coin = Math.max(1, Math.round((12 + game.stage * 3) * computeBonuses().coinMult));
            game.coins += coin;
            spawnDamageText(comp.x, comp.y - comp.radius - 10, '略奪！ +' + formatCoinNumber(coin) + ' 🟡', '#ffd76b');
          }
          if (cid === 'ninja') {
            applyPoison(e, true);
          }
          if (cid === 'dragon') {
            spawnHitParticles(e.x, e.y, '#ff4f7b');
          }
          if (cid === 'sprite') {
            const pl = balls.find(ball => ball.isPlayer && !ball.isClone && !ball.isCompanion);
            if (pl) { pl.boostUntil = Date.now() + SPRITE_TAILWIND_MS; spawnHitParticles(pl.x, pl.y, '#64e8ff'); }
          }
        } else {
          spawnMissText(e);
        }

        if (isDisabled(e)) {
        } else if (enemyAttackHits(e)) {
          const { dmg: rawEnemyDmg, crit: enemyCrit } = rollEnemyCrit(e, Math.max(1, Math.round(e.atk * comboMult)));
          const enemyDmg = comp.companionId === 'knight' ? Math.max(1, Math.round(rawEnemyDmg * KNIGHT_DAMAGE_TAKEN_MULT)) : rawEnemyDmg;
          comp.hp -= enemyDmg;
          spawnHitParticles(comp.x, comp.y, '#5cc8ff');
          spawnReceivedDamageText(comp, enemyDmg, enemyCrit, e);
          applyHitKnockback(comp, e, 3.2);
        } else {
          spawnEvadeText(comp);
        }

        if (comp.hp <= 0) {
          game.companions.alive[comp.companionId] = false;
          game.companions.hp[comp.companionId] = 0;
          spawnDamageText(comp.x, comp.y, '倒れた', '#ff9999');
        }

        updateHPUI();
        if (e.hp <= 0) { triggerEnemyDefeat(e, comp.x, comp.y); battleEnded = true; break; }
      }
    }
  }

  if (!battleEnded) {
    for (const meteor of meteors) {
      const mdx = e.x - meteor.x, mdy = e.y - meteor.y;
      const distance = Math.hypot(mdx, mdy) || 1;
      meteor.x += (mdx / distance) * meteor.speed * speedMult;
      meteor.y += (mdy / distance) * meteor.speed * speedMult;
      if (distance < meteor.radius + e.radius) {
        const meteorDmg = Math.max(1, Math.round(meteor.damage * bossDamageMult(e)));
        e.hp -= meteorDmg;
        trackDamage(meteorDmg);
        meteor.hit = true;
        spawnHitParticles(e.x, e.y, '#ffbc5c');
        spawnDamageText(e.x, e.y - e.radius - 16, 'METEOR ' + meteorDmg, '#ffd76b');
        playMeteorImpactSound();
        updateHPUI();
        if (e.hp <= 0) { triggerEnemyDefeat(e, meteor.x, meteor.y); battleEnded = true; break; }
      }
    }
  }
  meteors = meteors.filter(meteor => !meteor.hit);

  processAdds(a);
}
function processAdds(a) {
  if (adds.length) {
    const attackers = balls.filter(ball => ball.isPlayer && !(ball.isCompanion && ball.hp <= 0)); // 倒れた仲間は攻撃しない
    for (const add of adds) {
      if (add.hp <= 0) continue;
      for (const atk of attackers) {
        if (atk === a && isRushPiercing() ? Math.hypot(add.x - a.x, add.y - a.y) < a.radius + add.radius && !(add.hitCooldown > 0) : resolveBallCollision(atk, add)) {
          if (atk === a && isRushPiercing()) add.hitCooldown = HIT_LOCK_FRAMES;
          const rm = atk === a ? getRushDmgMult() : 1;
          if (atk === a) { a.tapSpeedMult = 1; consumeRushHit(add.x, add.y - add.radius); } // 雑魚敵に衝突してもタップ加速をリセット
          const { dmg, crit } = rollCrit(Math.max(1, Math.round((atk.atk || 1) * rm)));
          add.hp -= dmg;
          trackDamage(dmg);
          focusHpEnemy(add);
          updateHPUI();
          spawnHitParticles(add.x, add.y, '#ffb35c');
          spawnAttackDamageText(add, dmg, crit, '#ffd9a0', 6);
          playEnemyHitSound();
          if (add.hp <= 0) {
            recordBestiaryKill(add);
            spawnExpGems(add.x, add.y, 4);
            const coinGain = 5 + Math.floor(Math.random() * 8);
            game.coins += coinGain;
            if (Math.random() < 0.3) game.gems += 1;
            spawnDamageText(add.x, add.y, '+' + formatCoinNumber(coinGain) + ' 🟡', '#ffd76b');
            updateStatsUI();
            break;
          }
        }
      }
    }
    adds = adds.filter(add => add.hp > 0);
    if (hpFocusEnemy && hpFocusEnemy.hp <= 0) updateHPUI(); // 表示中の敵を倒したら次の敵に切り替え
  }
}
function updateBattleFx() {
  for (const p of particles) { p.x += p.vx; p.y += p.vy; p.vy += p.g || 0; p.life -= (p.decay || 0.04); }
  particles = particles.filter(p => p.life > 0);
  for (const d of damageTexts) { d.y += d.vy; d.life -= (d.decay || 0.018); }
  damageTexts = damageTexts.filter(d => d.life > 0);
}

let hpFocusEnemy = null;
function getHpDisplayEnemy() {
  const main = balls.find(b => !b.isPlayer);
  const alive = e => e && e.hp > 0 && !e.isDying && (e === main || adds.includes(e));
  if (main && main.isDying && !main.isBoss && adds.some(ad => ad.isSplit && ad.hp > 0)) return alive(hpFocusEnemy) ? hpFocusEnemy : adds.find(ad => ad.isSplit && ad.hp > 0);
  if (!main || main.isBoss || !isSwarmStage(game.stage)) return main;
  if (alive(hpFocusEnemy)) return hpFocusEnemy;
  if (main.isDying) return adds.find(ad => ad.hp > 0) || main; // 本体を倒した後は残りの雑魚を表示
  return main;
}
function focusHpEnemy(enemy) {
  const main = balls.find(b => !b.isPlayer);
  if (!isSwarmStage(game.stage) && !(main && main.isDying && enemy.isSplit)) return;
  if (hpFocusEnemy !== enemy) { hpFocusEnemy = enemy; updateHPUI(); }
}
function updateHPUI() {
  const p = balls.find(b => b.isPlayer && !b.isClone && !b.isCompanion);
  const en = getHpDisplayEnemy();
  if (!p || !en) return;
  playerHPFill.style.width = Math.max(0, p.hp / p.maxHp * 100) + '%';
  const hpRatio = p.hp / p.maxHp;
  document.body.classList.toggle('player-pinch', p.hp > 0 && hpRatio <= PINCH_HP_RATIO);
  document.body.classList.toggle('player-critical', p.hp > 0 && hpRatio <= PINCH_HP_RATIO / 2);
  enemyHPFill.style.width = Math.max(0, en.hp / en.maxHp * 100) + '%';
  playerHPText.textContent = Math.max(0, Math.round(p.hp));
  enemyHPText.textContent = en.megaPhase && en.megaPhase !== 'mega' ? '∞' : Math.max(0, Math.round(en.hp));
  playerAtkNum.textContent = p.atk;
  playerAccNum.textContent = +(getPlayerAccuracy() * 100).toFixed(1) + '%';
  playerEvaNum.textContent = +(getPlayerEvasion() * 100).toFixed(1) + '%';
  enemyAtkNum.textContent = en.atk;
  enemyAccNum.textContent = +(getEnemyAccuracy(en) * 100).toFixed(1) + '%';
  enemyEvaNum.textContent = +(getEnemyEvasion(en) * 100).toFixed(1) + '%';
  const bookEntry = ENEMY_BOOK_BY_KEY[getEnemyBookKey(en)];
  const enName = bookEntry ? bookEntry.name : '敵';
  const enIcon = bookEntry && bookEntry.sprite ? enemySpriteHtml(bookEntry.sprite, 'enemy-name-sprite') : (bookEntry && bookEntry.icon ? bookEntry.icon : '🔴');
  const enTrait = getEnemyTrait(en);
  const traitTag = (en.isGiant ? ` <span style="font-size:0.7em;color:#ff5c6c;font-weight:900;">［激デカ］</span>` : '') + (enTrait ? ` <span style="font-size:0.7em;color:#ffb35c;">［${ENEMY_TRAIT_LABELS[enTrait]}］</span>` : '');
  enemyName.innerHTML = (en.isBoss ? (game.skipChallenge ? `👑 ${enIcon} ${enName}（試練の塔）` : `👑 ${enIcon} ${enName}`) : `${enIcon} ${enName}`) + traitTag;
  renderEnemyTraitBadge(en, enTrait);
}
// ステージ右上に、今の敵の特徴をアイコン＋短い文字で小さく表示
const ENEMY_TRAIT_ICONS = { berserk: '😡', stack: '🍡', jumbo: '🫧', charge: '💨', spinGuard: '🛡️', split: '✂️', splitMany: '✂️', grow: '📈', attackMagic: '🔥', healMagic: '💚', homing: '🎯', mines: '🔥', deathMagic: '💀', merge: '🧩', megaSlime: '🫧' };
const ENEMY_TRAIT_LABELS_EXTRA = { megaSlime: '叩くと分裂→合体' };
function renderEnemyTraitBadge(en, trait) {
  const el = document.getElementById('enemyTraitBadge'); if (!el) return;
  const tags = [];
  if (en && !en.isDying && phase !== 'gameover') {
    if (en.isBoss) tags.push([en.milestone && !game.skipChallenge ? `👑 ${en.milestone.label}` : '👑 ボス', 'warn']);
    if (en.isGiant) tags.push(['⬆️ 激デカ', 'warn']);
    if (isMetalEnemy(en)) tags.push(['🪨 硬い（ダメージ減）', '']);
    if (trait) tags.push([`${ENEMY_TRAIT_ICONS[trait] || '✨'} ${ENEMY_TRAIT_LABELS[trait] || ENEMY_TRAIT_LABELS_EXTRA[trait] || trait}`, MAGIC_TRAITS[trait] || trait === 'charge' || trait === 'deathMagic' || trait === 'berserk' ? 'warn' : '']);
    if (en.berserk) tags.push(['🔥 発狂中！防御ダウン', 'warn']);
    if (isSwarmStage(game.stage) && !en.isBoss) tags.push(['👥 大群', '']);
  }
  const key = en && getEnemySpriteKey(en), img = key && ENEMY_SPRITES[key];
  const head = tags.length ? `<span class="etb-head">${img ? `<img src="${img}" alt="">` : '👾'}敵の特徴</span>` : ''; // 誰の情報か分かるよう、敵の顔つきの見出し
  const html = head + tags.map(([t, c]) => `<span class="${c}">${t}</span>`).join('');
  if (el.dataset.html !== html) { el.innerHTML = html; el.dataset.html = html; }
}

const statModal = document.getElementById('statModal');
let statModalTimer = null;
function renderStatModal() {
  const p = balls.find(b => isMainPlayerBall(b));
  const en = getHpDisplayEnemy();
  const b = computeBonuses();
  const pct = v => +(v * 100).toFixed(1) + '%';
  const row = (k, v) => `<div class="st-row"><span>${k}</span><b>${v}</b></div>`;
  let html = `<div class="st-sec">${xi('x_heart')} プレイヤー</div><div class="st-grid">`;
  if (p) html += row('HP', `${Math.max(0, Math.round(p.hp))} / ${p.maxHp}`) + row('攻撃力', p.atk);
  html += row('命中', pct(getPlayerAccuracy())) + row('回避', pct(getPlayerEvasion())) + row('迫り合い', +getPlayerClash().toFixed(1))
    + row('会心率', pct(CRIT_CHANCE + b.critChance)) + row('会心ダメージ', '×' + +(CRIT_MULT + b.critMultBonus).toFixed(2))
    + row('ボス特攻', '+' + pct(b.bossDmg)) + (game.tackleUnlocked ? row('タックル威力', '×' + +b.tackleMult.toFixed(2)) : '') + row('反撃率', pct(b.counter || 0)) + '</div>';
  if (en) {
    const bookEntry = ENEMY_BOOK_BY_KEY[getEnemyBookKey(en)];
    const trait = getEnemyTrait(en);
    html += `<div class="st-sec">🔴 ${bookEntry ? bookEntry.name : '敵'}${en.isBoss ? '（ボス）' : ''}${en.isGiant ? '［激デカ］' : ''}</div><div class="st-grid">`
      + row('HP', `${Math.max(0, Math.round(en.hp))} / ${en.maxHp}`) + row('攻撃力', en.atk)
      + row('命中', pct(getEnemyAccuracy(en))) + row('回避', pct(getEnemyEvasion(en))) + row('迫り合い', +getEnemyClash(en).toFixed(1))
      + row('迫り合い勝率', pct(getClashWinChance(en))) + '</div>';
    html += `<div class="st-trait">${trait ? `<b>特性：${ENEMY_TRAIT_LABELS[trait]}</b><br>${ENEMY_TRAIT_DESCS[trait] || ''}` : '特性なし'}</div>`;
  }
  html += '<div class="st-note">迫り合い：ぶつかったとき、どちらが攻撃できるかを決める強さ（強化タブで上昇）</div>';
  document.getElementById('statModalBody').innerHTML = html;
}
document.getElementById('statHelpBtn').addEventListener('click', () => {
  renderStatModal();
  statModal.classList.add('show');
  clearInterval(statModalTimer);
  statModalTimer = setInterval(() => { if (statModal.classList.contains('show')) renderStatModal(); else clearInterval(statModalTimer); }, 500);
});
document.getElementById('statModalCloseBtn').addEventListener('click', () => { statModal.classList.remove('show'); clearInterval(statModalTimer); });
statModal.addEventListener('click', event => { if (event.target === statModal) { statModal.classList.remove('show'); clearInterval(statModalTimer); } });

function onStageClear() {
  if (BATTLE_BGM_KEYS[currentBgmType]) unlockBgmBook(currentBgmType); // 流れていた戦闘曲をBGM図鑑に登録
  const b = computeBonuses();
  const isBossStage = game.stage % 10 === 0;
  const defeated = balls.find(ball => !ball.isPlayer);
  const isMetal = !!defeated && !defeated.isBoss && defeated.emoji === '👾'; // メタルスライムは討伐コインが大幅アップ
  const msBoss = isBossStage && !game.skipChallenge ? getMilestoneBoss(game.stage) : null; // 節目のボスは報酬も大きい
  const coinGain = Math.round((30 + game.stage * 8) * b.coinMult * (isBossStage ? 3 : 1) * (msBoss ? msBoss.reward : 1) * (isCoinStrike() ? COIN_STRIKE_KILL_MULT : 1) * (isMetal ? METAL_SLIME_COIN_MULT : 1));
  if (isMetal) {
    const metalGems = METAL_SLIME_GEM_MIN + Math.floor(Math.random() * (METAL_SLIME_GEM_MAX - METAL_SLIME_GEM_MIN + 1));
    game.gems += metalGems;
    spawnDamageText(arena.x, arena.y - 40, '✨ メタルボーナス！ ×' + METAL_SLIME_COIN_MULT, '#e0e6f0', 0.01, true);
    spawnDamageText(arena.x, arena.y - 12, '+' + metalGems + ' 💎', '#64e8ff', 0.01, true);
  }
  game.coins += coinGain;
  const giantKill = !!(defeated && defeated.isGiant);
  if (isBossStage) game.gems += (giantKill ? 5 * GIANT_BOSS_REWARD_MULT : 5) * (msBoss ? msBoss.reward : 1);
  if (msBoss) { spawnDamageText(arena.x, arena.y - 80, `👑 ${msBoss.label}を撃破！ 報酬×${msBoss.reward}`, '#ffd76b', 0.008, true); dropTreasureChest(game.stage % 1000 === 0 ? 'legendary' : 'epic'); }
  if (giantKill) {
    game.coins += coinGain * (GIANT_BOSS_REWARD_MULT - 1);
    spawnDamageText(arena.x, arena.y - 60, `👑 激デカボス撃破！ 報酬×${GIANT_BOSS_REWARD_MULT}`, '#ffd76b', 0.01, true);
  }
  if (isBossStage) { playBossClearSound(); showBossClearFx(game.stage); nextNormalBgm(); nextBossBgm(); } else playStageClearSound(); // ボスを倒したら通常戦闘BGMを次の曲へ
  const richDrop = isBossStage || isMetal || giantKill || isSwarmStage(game.stage);
  spawnCoinBurst(arena.x, arena.y - 10, coinGain, richDrop ? 9 : 3);
  if (isBossStage) spawnDamageText(arena.x, arena.y, `+${5 * (msBoss ? msBoss.reward : 1)} 💎`, '#64e8ff');
  if (isBossStage && Math.random() < 0.35) {
    setTimeout(() => dropTreasureChest(), 3300); // ボス撃破のお祝い演出が終わってから
  }
  game.totalKills++;
  checkPowerUp(isBossStage);
  ensureDailyClearReset();
  game.dailyClears++;
  resetCombo();
  if (game.skipChallenge) {
    showNotice(`🏰 試練の塔 突破！ ${game.stage}階層 のボスを撃破`);
    const skipped = game.skipChallenge.target - game.skipChallenge.origin;
    if (skipped > (game.bestTowerJump || 0)) { game.bestTowerJump = skipped; setTimeout(() => showNotice(`🏆 試練の塔 自己ベスト更新！ +${skipped}階層`), 2400); }
    game.skipChallenge = null;
    setTimeout(() => dropSkipArtifact(skipped), 1200); // 成功表示の後に遺物をドロップ
  }
  if (!filmMode) game.stage++; // 撮影モード中は同じステージ（同じ敵）を繰り返す
  game.bestStage = Math.max(game.bestStage, game.stage);
  stageAnnounceText = game.stage + '階層' + (isSwarmStage(game.stage) && game.stage % 10 !== 0 ? ' 大群！' : '');
  stageAnnounceTimer = STAGE_ANNOUNCE_DURATION;
  meteors = []; adds = []; clearEnemyTraitObjects();
  for (const id in COMPANIONS) {
    if (game.companions.recruited[id]) {
      game.companions.alive[id] = true;
      game.companions.hp[id] = getCompanionMaxHP(id);
    }
  }
  const nextIsBoss = game.stage % 10 === 0;
  if (nextIsBoss) {
    spawnBossWithWarning();
  } else {
    spawnNextEnemy();
    refreshPlayerBallStats(false); // 敵を倒しても自機のHPは回復しない
    startBgm('normal');
  }
  updateStatsUI();
  updateHPUI();
  saveGame();
}

const DEATH_FX_MS = 1600;
let deathFx = null; // { start, ball }
let deathFxTimer = null;
function startDeathFx() {
  const player = balls.find(ball => ball.isPlayer && !ball.isClone && !ball.isCompanion);
  deathFx = { start: Date.now(), ball: player };
  if (player) {
    const foe = nearestOf(player, [...balls, ...adds].filter(x => !x.isPlayer && !x.isDying));
    const ang = foe ? Math.atan2(player.y - foe.y, player.x - foe.x) : Math.random() * Math.PI * 2;
    player.vx = Math.cos(ang) * KNOCKBACK_SPEED * 0.8;
    player.vy = Math.sin(ang) * KNOCKBACK_SPEED * 0.8;
    startFlyout(player);
    spawnDamageText(player.x, player.y - player.radius - 18, 'やられた…', '#ff6b7a', 0.012, true);
    for (let i = 0; i < 26; i++) {
      const a = Math.random() * Math.PI * 2, sp = 1 + Math.random() * 3.5;
      particles.push({ x: player.x, y: player.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, color: i % 3 === 0 ? '#ffffff' : (i % 3 === 1 ? '#4fa8ff' : '#ff6b7a'), decay: 0.018 });
    }
  }
  shakeScreen();
  playDeathSound();
}
function updateDeathFx() {
  if (!deathFx) return;
  for (const p of particles) { p.x += p.vx; p.y += p.vy; p.vx *= 0.97; p.vy *= 0.97; p.vy += p.g || 0; p.life -= (p.decay || 0.04); }
  particles = particles.filter(p => p.life > 0);
  for (const d of damageTexts) { d.y += d.vy; d.life -= (d.decay || 0.018); }
  damageTexts = damageTexts.filter(d => d.life > 0);
}
function getDeathFxProgress() { return deathFx ? Math.min(1, (Date.now() - deathFx.start) / DEATH_FX_MS) : 0; }
function drawDeathDim() {
  if (!deathFx) return;
  const t = getDeathFxProgress();
  ctx.save();
  arenaPath();
  ctx.fillStyle = `rgba(10,6,20,${0.45 * t})`;
  ctx.fill();
  ctx.restore();
}
function endDeathFx() {
  clearTimeout(deathFxTimer);
  deathFx = null;
}
function onPlayerDeath(forceRebirth = false, skipFx = false) {
  if (filmMode && !forceRebirth) { const p = balls.find(isMainPlayerBall); if (p) { p.hp = p.maxHp; updateHPUI(); } return; } // 撮影モード中はやられない
  homingMissiles = [];
  if (game.skipChallenge && !forceRebirth) { failSkipChallenge(); return; }
  if (deathFx && !skipFx) return; // 演出中の二重呼び出しを防ぐ
  phase = 'paused';
  meteors = []; adds = []; clearEnemyTraitObjects();
  resetCombo();
  if (forceRebirth) { endDeathFx(); completeReincarnation(); return; }
  if (!skipFx) {
    startDeathFx();
    clearTimeout(deathFxTimer);
    deathFxTimer = setTimeout(() => showContinuePrompt(), DEATH_FX_MS);
    return;
  }
  showContinuePrompt();
}
function showContinuePrompt() {
  if (phase !== 'paused') return;
  if (getActiveTab() !== 'game') switchTab('game'); // 他のページを開いていたらゲーム画面に戻してからコンテニューを出す
  gameOverBgm = true; updateSkipBtnVisibility();
  refreshBgm();
  continueDeadline = Date.now() + 10000;
  continueStopped = false;
  continueBtn.style.display = 'block';
  continueBtn.querySelector('.cb-cost').textContent = '💎 ' + getContinueCost();
  giveUpBtn.style.display = 'block';
  toastIcon.style.display = 'block';
  toastIcon.innerHTML = '<img class="go-banner" src="assets/img/ui/gameOver.webp" alt="GAME OVER">';
  toastBig.textContent = 'コンテニュー？';
  toastBig.className = 'big reborn';
  toast.classList.add('show');
  startContinueCountdown();
}
let gameOverTipsHtml = '';
function buildGameOverTips() {
  const tips = [];
  const eq = getEquippedSkills();
  const ownedSkills = Object.keys(SKILL_GACHA_SKILLS).filter(id => game.shopOwned[id]);
  const cheapestSkill = Object.keys(SKILL_GACHA_SKILLS).filter(id => !game.shopOwned[id]).map(getSkillBuyCost).sort((a, b) => a - b)[0];
  const atkLv = getMaxAffordableUpgradeLevels('atk', game.coins), hpLv = getMaxAffordableUpgradeLevels('hp', game.coins);
  if (!(game.potions > 0) && game.gems >= gemPrice(SHOP_ITEMS.potion.cost)) tips.push('🧪 ショップで回復ポーションを買っておくと、ピンチをしのげます');
  else if (game.potions > 0) tips.push('🧪 ピンチになったらサークル左上の回復ポーションを早めに使おう');
  if (atkLv + hpLv >= 2) tips.push(`⚔️ 強化で攻撃力・HPを上げよう（今のコインで 攻撃力+${atkLv}Lv / HP+${hpLv}Lv）`);
  if (ownedSkills.length > eq.length && eq.length < getSkillSlots()) tips.push('✨ 解放済みのスキルを装備しよう（スキルページ）');
  else if (!ownedSkills.length && cheapestSkill && game.coins >= cheapestSkill) tips.push('✨ スキルを解放して装備しよう（回復やバリアがおすすめ）');
  if (getCompanionTotal() < getPartyLimit() && game.coins >= getCompSummonCost(1)) tips.push('🐾 仲間を召喚して一緒に戦おう');
  if (game.stage % 10 === 0) tips.push('👑 ボスは強力。HPを上げるか、回復・バリアのスキルで粘ろう');
  if (game.stage >= 3) tips.push('🌌 「転生」を選ぶと遺物がもらえて、次の周回が楽になります');
  if (!tips.length) tips.push('⚔️ コインを貯めて強化タブで攻撃力を上げよう');
  return `<div class="gameover-tips">${tips.slice(0, 1).map(t => `<div>${t.replace(/（[^）]*）/g, '')}</div>`).join('')}</div>`; // 小カッコの補足は表示しない
}
let continueStopped = false;
function renderContinueStopped() {
  toastSub.innerHTML = `<span class="continue-count">⏸ カウント停止中</span>\n💎 ${getContinueCost()} で現在の階層をリトライ${gameOverTipsHtml}`;
}
function stopContinueCountdown() {
  if (continueStopped || !continueTimer || phase !== 'paused' || continueBtn.style.display === 'none') return;
  continueStopped = true;
  clearInterval(continueTimer); continueTimer = null;
  renderContinueStopped();
}
document.addEventListener('pointerdown', stopContinueCountdown, true);
function startContinueCountdown() {
  clearInterval(continueTimer);
  if (!gameOverTipsHtml || !continueStopped) gameOverTipsHtml = buildGameOverTips();
  if (continueStopped) { continueTimer = null; renderContinueStopped(); return; }
  let lastTickSec = null;
  const updateContinue = () => {
    const seconds = Math.max(0, Math.ceil((continueDeadline - Date.now()) / 1000));
    if (seconds !== lastTickSec && seconds > 0) { lastTickSec = seconds; playCountdownTick(seconds); }
    toastSub.innerHTML = `<span class="continue-count">残り <b>${seconds}</b> 秒</span>\n💎 ${getContinueCost()} で現在の階層をリトライ${gameOverTipsHtml}`;
    if (seconds <= 0) { clearInterval(continueTimer); reincarnateAfterAd(); }
  };
  updateContinue();
  continueTimer = setInterval(updateContinue, 200);
}

const INTERSTITIAL_WAIT_SEC = 0; // この秒数が経つと閉じるボタンが押せる（0ならすぐ閉じられる）
const INTERSTITIAL_ADS = [
  { icon: '🎮', title: '新作ゲーム配信中！', text: '今すぐダウンロードして遊ぼう' },
  { icon: '🍜', title: 'あったか新メニュー登場', text: 'お近くの店舗でお試しください' },
  { icon: '📱', title: '最新スマホが今なら特価', text: '期間限定キャンペーン実施中' },
  { icon: '✈️', title: '週末は旅に出よう', text: '人気ツアーが最大50%OFF' },
];
let interstitialTimer = null;
function showInterstitialAd(onClose) {
  const ad = INTERSTITIAL_ADS[Math.floor(Math.random() * INTERSTITIAL_ADS.length)];
  document.getElementById('interstitialIcon').textContent = ad.icon;
  document.getElementById('interstitialTitle').textContent = ad.title;
  document.getElementById('interstitialText').textContent = ad.text;
  const box = document.getElementById('interstitialAd');
  const closeBtn = document.getElementById('interstitialCloseBtn');
  let left = INTERSTITIAL_WAIT_SEC;
  closeBtn.disabled = left > 0;
  closeBtn.textContent = left > 0 ? left : '✕';
  box.classList.add('show');
  clearInterval(interstitialTimer);
  if (left > 0) interstitialTimer = setInterval(() => {
    left--;
    if (left > 0) { closeBtn.textContent = left; return; }
    clearInterval(interstitialTimer);
    closeBtn.disabled = false;
    closeBtn.textContent = '✕';
  }, 1000);
  closeBtn.onclick = () => {
    if (closeBtn.disabled) return;
    closeBtn.onclick = null;
    box.classList.remove('show');
    onClose();
  };
}
const INTERSTITIAL_ENABLED = false; // 一旦停止中。true に戻すとゲームオーバー時の広告が復活する
function reincarnateAfterAd() {
  clearInterval(continueTimer);
  continueBtn.style.display = 'none';
  giveUpBtn.style.display = 'none';
  if (!INTERSTITIAL_ENABLED || isAdFree()) { completeReincarnation(); return; }
  showInterstitialAd(() => completeReincarnation());
}

// 転生報酬のジェム：基本2＋到達ステージ10ごとに+1＋遺物「輪廻の宝珠」。セルフ転生は動画で3倍にできる
let rebirthGemMult = 1;
function getRebirthGemGain() { return 2 + Math.floor(game.stage / 10) + computeBonuses().rebirthGems; }
function completeReincarnation() {
  gameOverBgm = false; rebirthFlow = true; updateSkipBtnVisibility();
  rebirthRewardBgm = true; refreshBgm();
  endDeathFx();
  clearInterval(continueTimer);
  game.skipChallenge = null;
  continueBtn.style.display = 'none';
  giveUpBtn.style.display = 'none';
  const gemBase = getRebirthGemGain(); // ステージを戻す前に計算
  const lvGain = getRebirthLvGain(game.stage);
  game.rebirthLv = (game.rebirthLv || 0) + lvGain;
  const earlyRebirth = game.reincarnations < EARLY_REBIRTH_COUNT;
  const rebirthPool = earlyRebirth ? ARTIFACT_POOL.filter(x => EARLY_REBIRTH_ARTIFACTS.includes(x.id)) : ARTIFACT_POOL;
  const pick = pickWeightedArtifact(rebirthPool, REBIRTH_REWARD_RARITY_WEIGHTS);
  if (!Array.isArray(game.rebirthChests)) game.rebirthChests = [];
  game.rebirthChests.push(pick.id); // 転生ガチャの宝箱は開けずに左下へストック（中身は抽選済み）
  game.coins = 0; game.stage = 1;
  game.pLv = 1; game.pExp = 0; expGems = []; // レベルは周回ごと
  game.puSlots = 0; // 3択の追加枠も転生まで
  if (!document.getElementById('powerUpModal').classList.contains('show')) powerUpPending = false;
  renderLvGauge(); // ゲージの長さもすぐ0に戻す
  coinFx = []; coinDisplayHold = 0; // 飛んでいる途中のコインも転生で消える
  game.upgrades = newUpgradeLevels(); game.coinCloneSlots = 0;
  game.rebirthBonus = { atk: 0, hp: 0, cloneSlots: 0 };
  game.companionSummons = 0;
  game.skillGachaPulls = 0;
  for (const id in SKILL_GACHA_SKILLS) delete game.shopOwned[id];
  game.skillLevels = {}; game.equippedSkills = []; game.weapons = {}; game.runBuffs = {}; weaponProj = []; weaponFx = [];
  barrierHits = 0; barrierOrbs = [];
  game.companions = { recruited: {}, awaken: {}, count: {}, level: companionMap(0), hp: companionMap(0), alive: companionMap(true) };
  balls = balls.filter(ball => !ball.isCompanion);
  renderCompanionList();
  const rebirthGemGain = gemBase * rebirthGemMult; rebirthGemMult = 1;
  game.gems += rebirthGemGain; game.reincarnations++;
  renderArtifactList();
  updateStatsUI();
  saveGame();
  playRebirthSound();
  toastIcon.style.display = 'block';
  toastIcon.innerHTML = xi(CHEST_ICON[pick.rarity]) || '🎁'; // 宝箱のレア度は転生時にわかる（中身は開けるまでお楽しみ）
  toastIcon.className = 'artifact-icon chest-shake';
  toast.classList.add('rebirth-reward'); // 背景に魔法陣
  toast.style.removeProperty('--chest-glow');
  toastBig.textContent = '輪廻転生……';
  toastBig.className = 'big reborn';
  toastSub.innerHTML = `転生 ${game.reincarnations}回目！ +${rebirthGemGain} 💎\n✨ 転生Lv +${lvGain} → Lv${game.rebirthLv}（攻撃力・最大HP +${Math.round(game.rebirthLv * REBIRTH_LV_BONUS * 100)}%）\n<span class="chest-rarity" style="color:${RARITY_INFO[pick.rarity].color}">${rarityStars(pick.rarity)} ${RARITY_INFO[pick.rarity].label}の宝箱</span>を手に入れた！\n（画面左下の宝箱からいつでも開けられます）`;
  toast.classList.add('show');
  clearTimeout(rebirthTimer);
  rebirthChest = null; rebirthChestFromTray = false;
  rebirthSkippable = true;
  rebirthTimer = setTimeout(finishRebirth, 2800);
  renderChestTray(pick.rarity);
}
// 左下にストックした転生ガチャの宝箱を開ける（戦闘は止めて、開封演出→中身を獲得）
let rebirthChestFromTray = false, rebirthTrayPausedPhase = null;
function openStockedRebirthChest(rarity) {
  if (!Array.isArray(game.rebirthChests) || phase !== 'battle') return;
  const i = game.rebirthChests.findIndex(id => ARTIFACT_BY_ID[id] && ARTIFACT_BY_ID[id].rarity === rarity); if (i < 0) return;
  const pick = ARTIFACT_BY_ID[game.rebirthChests.splice(i, 1)[0]];
  renderChestTray();
  if (!pick) { saveGame(); return; }
  gainArtifact(pick.id); renderArtifactList(); updateStatsUI(); saveGame();
  rebirthTrayPausedPhase = phase; phase = 'paused'; rebirthChestFromTray = true;
  toastIcon.style.display = 'block';
  toastIcon.innerHTML = xi({ common: 'x_chest1', rare: 'x_chest2', epic: 'x_chest4', legendary: 'x_chest6' }[pick.rarity] || 'x_chest1');
  toastIcon.className = 'artifact-icon chest-shake';
  toast.classList.add('rebirth-reward');
  toast.style.removeProperty('--chest-glow');
  toastBig.textContent = '転生ガチャ';
  toastBig.className = 'big reborn';
  toastSub.textContent = '宝箱を開けています…（タップで開封）';
  toast.classList.add('show');
  rebirthSkippable = false;
  clearTimeout(rebirthTimer);
  rebirthChest = { pick, rebirthGemGain: 0 };
  rebirthTimer = setTimeout(openRebirthChest, pick.rarity === 'legendary' ? REBIRTH_CHEST_MS : REBIRTH_CHEST_SHORT_MS); // レジェンドはじっくり、それ以外は一瞬だけ宝箱を見せる
}
const REBIRTH_CHEST_MS = 1400, REBIRTH_CHEST_SHORT_MS = 1100;
const REBIRTH_LEGEND_LOCK_MS = 3000; // レジェンドが出たら、この間は結果画面を閉じられない
let rebirthChest = null;
// 宝箱を開ける音：留め金が外れる「カチャッ」→ ふたがきしんで開く「ギィ…」→ 光があふれる「パァッ」
function playChestOpenSound() {
  if (!audioCtx || isBattleSfxMuted()) return;
  filteredNoise(0, 0.04, 0.3, 3200, 2, 'bandpass'); thump(1800, 1400, 0.05, 0.05, 'square');   // カチャッ
  filteredNoise(0.06, 0.05, 0.25, 2600, 2, 'bandpass');
  thump(180, 260, 0.22, 0.12, 'sawtooth', 0.12); filteredNoise(0.12, 0.2, 0.1, 600, 4, 'bandpass'); // ギィ…
  thump(90, 50, 0.18, 0.3, 'sine', 0.3);                                                     // ふたが開き切る「ゴトッ」
  [1047, 1319, 1568, 2093].forEach((f, i) => thump(f, f, 0.35, 0.03, 'triangle', 0.32 + i * 0.04)); // パァッ（光）
}
function openRebirthChest() {
  if (!rebirthChest) return;
  const { pick, rebirthGemGain } = rebirthChest;
  rebirthChest = null;
  clearTimeout(rebirthTimer);
  toastIcon.innerHTML = ico(pick);
  toastIcon.className = 'artifact-icon chest-open';
  toastIcon.style.setProperty('--chest-glow', RARITY_INFO[pick.rarity].color);
  toast.style.setProperty('--chest-glow', RARITY_INFO[pick.rarity].color); // 開封したらレア度の色に光る
  const rar = RARITY_INFO[pick.rarity];
  toastSub.innerHTML = `<span class="chest-rarity" style="color:${rar.color}">${rarityStars(pick.rarity)} ${rar.label}</span>\n` + pick.name + ' を獲得！\n（' + pick.desc + '）' + (rebirthGemGain ? '\n+' + rebirthGemGain + ' 💎' : '');
  const dx = toast.clientWidth / 2 - (toastIcon.offsetLeft + toastIcon.offsetWidth / 2), dy = toast.clientHeight / 2 - (toastIcon.offsetTop + toastIcon.offsetHeight / 2);
  toastIcon.style.transition = 'none'; toastIcon.style.translate = `${dx}px ${dy}px`; // 魔法陣の中心から
  void toastIcon.offsetWidth;
  toastIcon.style.transition = 'translate 0.9s cubic-bezier(.2,.8,.3,1)'; toastIcon.style.translate = '0px 0px'; // せり上がって定位置へ
  playChestOpenSound(); setTimeout(() => playGachaSound(pick.rarity), 260); // 宝箱が開く「ガチャッ…パカッ」→ レア度の音
  rebirthSkippable = pick.rarity !== 'legendary';
  if (!rebirthSkippable) setTimeout(() => { rebirthSkippable = true; }, REBIRTH_LEGEND_LOCK_MS); // レジェンドはしばらく余韻を味わえるよう、タップで閉じられない
  rebirthTimer = setTimeout(finishRebirth, 6500);
}

function finishRebirth() {
  if (!rebirthSkippable) return;
  rebirthSkippable = false;
  clearTimeout(rebirthTimer);
  toast.classList.remove('show');
  toastIcon.className = 'artifact-icon'; // 宝箱演出のクラスを戻す
  toastIcon.style.translate = ''; toastIcon.style.transition = '';
  toast.classList.remove('rebirth-reward');
  if (rebirthChestFromTray) { rebirthChestFromTray = false; if (phase === 'paused') phase = rebirthTrayPausedPhase || 'battle'; renderChestTray(); return; } // 左下の宝箱を開けただけなら戦闘に戻る
  rebirthRewardBgm = false;
  advanceRebirthShopVisit();
  startNextRun();
}

const rebirthShopMsg = document.getElementById('rebirthShopMsg');
function showRebirthPurchasePop(item, x, y, count = 1) {
  const icon = item.companionId ? COMPANIONS[item.companionId].icon : ico(item);
  const cur = item.artifactId ? getArtifactCurrentText(item.artifactId) : '';
  const el = document.createElement('div');
  el.className = 'levelup-pop purchase-pop';
  el.innerHTML = `${icon} ${item.companionId || item.unlockKey ? '開放！' : (count > 1 ? `×${count} 購入！` : '購入！')}${cur ? `<small>${cur}</small>` : ''}`;
  el.style.left = (x || window.innerWidth / 2) + 'px';
  el.style.top = (y || window.innerHeight / 2) + 'px';
  if (RARITY_INFO[item.rarity]) el.style.textShadow = `0 0 8px ${RARITY_INFO[item.rarity].color}, 0 2px 0 #5a3a00, 0 0 2px #000`; // レア度の色で光らせる
  document.body.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
}
function showRebirthPurchaseMessage(item) {
  const limit = ARTIFACT_STACK_LIMIT[item.artifactId];
  const owned = item.companionId || item.unlockKey ? '' : `（所持 ${game.ownedArtifacts[item.artifactId]}${limit ? ' / ' + limit : ''}）`;
  rebirthShopMsg.innerHTML = `✅ ${ico(item)} ${item.name} を購入！<br><span style="color:#2ea043;">${item.desc}${owned}</span>`;
  rebirthShopMsg.classList.remove('show');
  void rebirthShopMsg.offsetWidth; // 連続購入でもアニメーションを再生
  rebirthShopMsg.classList.add('show');
}
function advanceRebirthShopVisit() {
  if (game.rebirthShopVisits == null) game.rebirthShopVisits = Math.max(0, (game.reincarnations || 1) - 1);
  game.rebirthShopVisits++;
  const openCount = getRebirthShopOpenCount();
  game.rebirthShopNew = game.rebirthShopVisits > 1 ? REBIRTH_SHOP_CATEGORIES.map(c => getRebirthCategoryIds(c.id)[openCount - 1]).filter(Boolean) : [];
  saveGame();
}
function startNextRun() { // 転生後、次の周回を始める
  gameOverBgm = false; rebirthFlow = false; updateSkipBtnVisibility();
  battleBgmType = game.stage % 10 === 0 ? 'boss' : 'normal';
  refreshBgm();
  playRunStartSound();
  balls = spawnBattleBalls();
  refreshPlayerBallStats(true);
  updateHPUI();
  phase = 'battle';
}

const STAGE_SKIP_OPTIONS = [
  { skip: 50, cost: 10 },
  { skip: 100, cost: 25 },
  { skip: 200, cost: 50 },
  { skip: 500, cost: 120 },
  { skip: 1000, cost: 250 },
];
function getCustomSkipCost(distance) {
  const d = Math.max(0, distance);
  const pts = [[0, 0], ...STAGE_SKIP_OPTIONS.map(o => [o.skip, o.cost])];
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
    if (d <= x1) return Math.max(1, Math.ceil(y0 + (y1 - y0) * (d - x0) / (x1 - x0)));
  }
  const [xl, yl] = pts[pts.length - 1];
  return Math.ceil(yl + (d - xl) * 0.25);
}
function getSkipTargetStage(skip) {
  return Math.ceil((game.stage + skip) / 10) * 10; // 基準ステージ数先の、最初のボスステージ
}
function renderStageSkipList() {
  updateCustomSkip();
  stageSkipGems.textContent = Math.floor(game.gems);
  stageSkipOrigin.textContent = game.stage;
  document.getElementById('towerBestJump').textContent = game.bestTowerJump ? `+${game.bestTowerJump.toLocaleString('ja-JP')}階層` : 'まだ突破なし';
  stageSkipList.innerHTML = STAGE_SKIP_OPTIONS.map((opt, i) => {
    const target = getSkipTargetStage(opt.skip);
    const es = getEnemyStats(target);
    const short = game.gems < opt.cost;
    return `<button class="modal-shop-btn tower-floor ${short ? 'is-disabled' : ''}" data-stage-skip="${i}"><span><span class="msb-name"><span class="tf-no">${target}F</span>👑 ${target}階層 のボス</span><span class="msb-desc">+${opt.skip}階層（${target - game.stage}階層先）　HP ${formatCoinNumber(es.hp)} / ATK ${formatCoinNumber(es.atk)}</span></span><span class="msb-cost">💎 ${opt.cost}</span></button>`;
  }).reverse().join('');
}
function spawnNextEnemy() {
  const player = balls.find(ball => ball.isPlayer && !ball.isClone && !ball.isCompanion);
  if (!player) { balls = spawnBattleBalls(); return; }
  const allies = balls.filter(ball => ball.isPlayer);
  for (const comp of allies) {
    if (!comp.isCompanion) continue;
    comp.maxHp = getCompanionBallMaxHP(comp.companionId);
    comp.hp = comp.maxHp;
  }
  balls = [...allies, makeBall(false)];
}
function spawnBossWithWarning() {
  showBossWarning();
  balls = balls.filter(ball => ball.isPlayer); // 敵だけ先に消しておく
  setTimeout(() => {
    spawnNextEnemy();
    const bossBall = balls.find(ball => ball.isBoss);
    if (bossBall) { bossBall.spawnTimer = 24; bossBall.baseRadius = bossBall.radius; }
    refreshPlayerBallStats(false); // ボス出現時（スキップ挑戦含む）も自機のHPは回復しない
    updateHPUI();
    startBgm('boss');
  }, 1850);
}
function startSkipChallenge(challenge) {
  const { target, cost } = challenge;
  game.gems -= cost;
  game.towerBgmNext = ((game.towerBgmNext || 0) + 1) % TOWER_BOSS_SONGS.length;
  game.skipChallenge = { origin: game.stage, target, cost, bgm: game.towerBgmNext };
  game.stage = target;
  playTowerStepsSound();
  meteors = []; adds = []; clearEnemyTraitObjects();
  resetCombo();
  stageAnnounceText = target + '階層';
  stageAnnounceTimer = STAGE_ANNOUNCE_DURATION;
  spawnBossWithWarning();
  showNotice(`⏭️ ${target}階層 のボスに挑戦！`);
  updateStatsUI();
  updateHPUI();
  saveGame();
}
function failSkipChallenge() {
  const { origin, target, cost } = game.skipChallenge;
  game.skipChallenge.lost = true; // リロードしても無料で再挑戦できないよう記録
  saveGame();
  phase = 'paused';
  meteors = []; adds = []; clearEnemyTraitObjects();
  resetCombo();
  playDeathSound();
  const retryCost = cost || 0;
  skipRetryText.innerHTML = `${target}階層 のボスに敗北しました。<br>もう一度挑戦しますか？（所持ジェム: 💎${Math.floor(game.gems)}）`;
  skipRetryBtn.innerHTML = `<span class="msb-name">🔁 💎${retryCost} でリトライ</span>`;
  skipRetryBtn.classList.toggle('is-disabled', game.gems < retryCost);
  skipGiveUpBtn.innerHTML = `<span class="msb-name">🏳️ あきらめて ${origin}階層 に戻る</span>`;
  skipRetryActions.style.visibility = 'hidden';
  const shownAt = skipRetryShownAt = Date.now();
  setTimeout(() => { if (skipRetryShownAt === shownAt) skipRetryActions.style.visibility = 'visible'; }, SKIP_RETRY_BUTTON_DELAY_MS);
  skipRetryModal.classList.add('show');
}
function skipRetryButtonsReady() {
  return skipRetryModal.classList.contains('show') && Date.now() - skipRetryShownAt >= SKIP_RETRY_BUTTON_DELAY_MS;
}
const REVIVE_INVINCIBLE_FRAMES = 90; // 復活直後の無敵時間（即死防止）
function revivePlayerInPlace() {
  gameOverBgm = false; updateSkipBtnVisibility();
  refreshBgm();
  endDeathFx();
  const player = balls.find(ball => ball.isPlayer && !ball.isClone && !ball.isCompanion);
  const enemy = balls.find(ball => !ball.isPlayer);
  if (!player || !enemy) { balls = spawnBattleBalls(); refreshPlayerBallStats(true); return; }
  flyouts = flyouts.filter(f => f !== player);
  const spot = farSpawnPointFrom(enemy, 0.6);
  player.x = spot.x; player.y = spot.y; player.vx = 0; player.vy = 0;
  refreshPlayerBallStats(true);
  player.hitCooldown = REVIVE_INVINCIBLE_FRAMES;
  spawnHitParticles(player.x, player.y, '#7ee787');
  spawnDamageText(player.x, player.y - player.radius - 12, 'REVIVE!', '#7ee787');
  playHealSound();
}
function retrySkipChallenge() {
  const { target, cost } = game.skipChallenge;
  game.gems -= cost || 0;
  game.skipChallenge.lost = false;
  skipRetryModal.classList.remove('show');
  revivePlayerInPlace();
  phase = 'battle';
  showNotice(`🔁 ${target}階層 のボスに再挑戦！`);
  updateStatsUI();
  updateHPUI();
  saveGame();
}
function giveUpSkipChallenge() {
  const { origin, target } = game.skipChallenge;
  skipRetryModal.classList.remove('show');
  game.skipChallenge = null;
  game.stage = origin;
  phase = 'battle';
  spawnNextEnemy();
  refreshPlayerBallStats(true);
  stageAnnounceText = origin + '階層';
  stageAnnounceTimer = STAGE_ANNOUNCE_DURATION;
  showNotice(`🏳️ ${target}階層 への挑戦をあきらめ、${origin}階層 に戻りました`, true);
  startBgm(origin % 10 === 0 ? 'boss' : 'normal');
  updateStatsUI();
  updateHPUI();
  saveGame();
}
stageSkipBtn.addEventListener('click', event => {
  if (game.skipChallenge) { showTapError('ボスに挑戦中です', event.clientX, event.clientY); return; }
  if (phase !== 'battle' || !balls.some(ball => !ball.isPlayer)) { showTapError('今は塔に挑めません', event.clientX, event.clientY); return; }
  playTowerGateSound();
  renderStageSkipList();
  stageSkipModal.classList.add('show');
});
stageSkipList.addEventListener('click', event => {
  const button = event.target.closest('[data-stage-skip]');
  if (!button) return;
  const opt = STAGE_SKIP_OPTIONS[Number(button.dataset.stageSkip)];
  if (game.gems < opt.cost) { promptGemShortage(opt.cost, { returnTo: () => { switchTab('game'); renderStageSkipList(); stageSkipModal.classList.add('show'); } }); return; }
  if (game.skipChallenge || phase !== 'battle' || !balls.some(ball => !ball.isPlayer)) { stageSkipModal.classList.remove('show'); return; }
  stageSkipModal.classList.remove('show');
  startSkipChallenge({ target: getSkipTargetStage(opt.skip), cost: opt.cost });
});

const customSkipInput = document.getElementById('customSkipInput');
const customSkipBtn = document.getElementById('customSkipBtn');
const customSkipCost = document.getElementById('customSkipCost');
const customSkipInfo = document.getElementById('customSkipInfo');
function getCustomSkipInput() {
  const v = Math.floor(Number(customSkipInput.value));
  return v > game.stage ? v : null;
}
function getCustomSkipTarget() {
  const v = getCustomSkipInput();
  return v ? Math.ceil(v / 10) * 10 : null; // 入力したステージ以降で最初のボスステージ
}
function updateCustomSkip() {
  const target = getCustomSkipTarget();
  customSkipInfo.classList.remove('error');
  if (!customSkipInput.value) {
    customSkipCost.textContent = '💎 -';
    customSkipInfo.textContent = `${game.stage + 1}階層 以降を入力（ボスの階層に切り上げ）`;
    customSkipBtn.classList.add('is-disabled');
    return;
  }
  if (!target) {
    customSkipCost.textContent = '💎 -';
    customSkipInfo.textContent = `現在の ${game.stage}階層 より先を入力してください`;
    customSkipInfo.classList.add('error');
    customSkipBtn.classList.add('is-disabled');
    return;
  }
  const cost = getCustomSkipCost(getCustomSkipInput() - game.stage);
  const es = getEnemyStats(target);
  customSkipCost.textContent = '💎 ' + cost.toLocaleString('ja-JP');
  customSkipInfo.textContent = `👑 ${target}階層 のボス（${target - game.stage}階層先）HP ${formatCoinNumber(es.hp)} / ATK ${formatCoinNumber(es.atk)}`;
  customSkipBtn.classList.toggle('is-disabled', game.gems < cost);
}
customSkipInput.addEventListener('input', updateCustomSkip);
// 手持ちMAX：今のジェムで行ける一番遠いステージを入れる
document.getElementById('customSkipMaxBtn').addEventListener('click', event => {
  if (game.gems < getCustomSkipCost(1)) { showTapError('ジェムが足りません', event.clientX, event.clientY); return; }
  let lo = 1, hi = 1;
  while (getCustomSkipCost(hi * 2) <= game.gems && hi < 1e7) hi *= 2;
  hi *= 2;
  while (lo < hi) { const mid = Math.ceil((lo + hi) / 2); if (getCustomSkipCost(mid) <= game.gems) lo = mid; else hi = mid - 1; }
  customSkipInput.value = game.stage + lo;
  updateCustomSkip();
});
customSkipInput.addEventListener('keydown', event => { if (event.key === 'Enter') customSkipBtn.click(); });
customSkipBtn.addEventListener('click', event => {
  const target = getCustomSkipTarget();
  if (!target) { customSkipInput.focus(); updateCustomSkip(); return; }
  const cost = getCustomSkipCost(getCustomSkipInput() - game.stage);
  if (game.gems < cost) { promptGemShortage(cost, { returnTo: () => { switchTab('game'); renderStageSkipList(); stageSkipModal.classList.add('show'); } }); return; }
  if (game.skipChallenge || phase !== 'battle' || !balls.some(ball => !ball.isPlayer)) { stageSkipModal.classList.remove('show'); return; }
  stageSkipModal.classList.remove('show');
  startSkipChallenge({ target, cost });
});
stageSkipCloseBtn.addEventListener('click', () => stageSkipModal.classList.remove('show'));
skipRetryBtn.addEventListener('click', event => {
  if (!game.skipChallenge || !skipRetryButtonsReady()) return;
  if (game.gems < (game.skipChallenge.cost || 0)) { promptGemShortage(game.skipChallenge.cost, { returnTo: () => { switchTab('game'); failSkipChallenge(); }, mustResume: true }); return; }
  retrySkipChallenge();
});
skipGiveUpBtn.addEventListener('click', () => {
  if (!game.skipChallenge || !skipRetryButtonsReady()) return;
  giveUpSkipChallenge();
});
document.querySelectorAll('.modal-overlay').forEach(m => {
  let open = m.classList.contains('show');
  new MutationObserver(() => {
    const now = m.classList.contains('show');
    if (now !== open && audioCtx && m !== stageSkipModal) (now ? playModalOpenSound : playModalCloseSound)(); // 塔は門・足音の専用効果音
    open = now;
  }).observe(m, { attributes: true, attributeFilter: ['class'] });
});
document.addEventListener('pointerdown', event => {
  const btn = event.target.closest && event.target.closest('button');
  if (!btn || !audioCtx || btn.disabled || btn.classList.contains('is-disabled') || btn.closest('#tabBar')) return;
  playUiTapSound();
}, true);
new MutationObserver(() => refreshBgm()).observe(stageSkipModal, { attributes: true, attributeFilter: ['class'] }); // 塔の画面の開け閉めで BGM を切り替える
stageSkipModal.addEventListener('click', event => { if (event.target === stageSkipModal) stageSkipModal.classList.remove('show'); });

const SKILL_RESET_COST = { special: 5, accel: 3, heal: 2, barrier: 4, homing: 3, poison: 3, paralyze: 3, sleep: 3, atkup: 4, regen: 3, silence: 3, sacrifice: 3, death: 5, coinStrike: 3, zeni: 3, mystery: 3, compRush: 3, nova: 3 };
const SKILL_RESET_CONFIRM_MS = 3000;
let pendingSkillReset = null; // 誤タップ防止：一度目のタップで確認状態にし、もう一度タップで消費
let pendingSkillResetUntil = 0;
function isSkillResetPending(key) {
  return pendingSkillReset === key && Date.now() < pendingSkillResetUntil;
}
function cooldownLabel(key, label, remaining) {
  if (isSkillResetPending(key)) return `💎${SKILL_RESET_COST[key]} 消費で\nリセット？`;
  const totalSec = Math.ceil(remaining / 1000); // 「4:60」表記にならないよう秒単位に切り上げてから分解
  const minutes = Math.floor(totalSec / 60);
  const seconds = String(totalSec % 60).padStart(2, '0');
  return `${label} ${minutes}:${seconds}\n💎${SKILL_RESET_COST[key]}でリセット`;
}
function tryGemResetSkill(key, event, resetCooldown, updateButton) {
  const cost = SKILL_RESET_COST[key];
  if (!isSkillResetPending(key)) {
    pendingSkillReset = key;
    pendingSkillResetUntil = Date.now() + SKILL_RESET_CONFIRM_MS;
    showNotice(`もう一度タップで 💎${cost} 消費してクールダウンをリセット`);
    updateButton();
    setTimeout(updateButton, SKILL_RESET_CONFIRM_MS + 50);
    return;
  }
  pendingSkillReset = null;
  if (game.gems < cost) { updateButton(); promptGemShortage(cost, { returnTo: () => switchTab('game') }); return; }
  game.gems -= cost;
  resetCooldown();
  playUpgradeSound();
  showNotice(`💎${cost} でクールダウンをリセットしました！`);
  updateStatsUI();
  saveGame();
}

function getSpecialCooldown() {
  const b = computeBonuses();
  return Math.round(skillCd('skillSpecial', SPECIAL_COOLDOWN) * Math.max(0.4, b.specialCooldownMult));
}
function updateSpecialButton() {
  if (!game.shopOwned.skillSpecial) {
    specialBtn.disabled = false;
    specialBtn.classList.add('is-disabled');
    specialBtn.textContent = '🔒 メテオ';
    return;
  }
  const cooldown = getSpecialCooldown();
  const remaining = Math.max(0, cooldown - (Date.now() - lastSpecialAt));
  if (remaining === 0) {
    specialBtn.disabled = false;
    specialBtn.classList.toggle('is-disabled', phase !== 'battle');
    specialBtn.textContent = '☄️ メテオ　READY';
    return;
  }
  specialBtn.disabled = false;
  specialBtn.classList.toggle('is-disabled', !isSkillResetPending('special'));
  specialBtn.textContent = cooldownLabel('special', '☄️ メテオ', remaining);
}

function updateAccelButton() {
  if (!game.shopOwned.skillAccel) {
    accelBtn.disabled = false;
    accelBtn.classList.add('is-disabled');
    accelBtn.textContent = '🔒 加速';
    speedValue.textContent = gameSpeed.toFixed(1) + '×';
    return;
  }
  const now = Date.now();
  if (now < accelEndAt) {
    const remainingSec = Math.ceil((accelEndAt - now) / 1000);
    accelBtn.disabled = true;
    accelBtn.classList.add('is-disabled');
    accelBtn.textContent = `⏩ 加速中 ${remainingSec}s`;
    speedValue.textContent = '2.5×（加速中）';
    return;
  }
  speedValue.textContent = gameSpeed.toFixed(1) + '×';
  const remaining = Math.max(0, skillCd('skillAccel', ACCEL_COOLDOWN) - (now - lastAccelAt));
  if (remaining === 0) {
    accelBtn.disabled = false;
    accelBtn.classList.toggle('is-disabled', phase !== 'battle');
    accelBtn.textContent = '⏩ 加速（2.5倍）';
    return;
  }
  accelBtn.disabled = false;
  accelBtn.classList.toggle('is-disabled', !isSkillResetPending('accel'));
  accelBtn.textContent = cooldownLabel('accel', '⏩ 加速', remaining);
}

function updateHealButton() {
  if (!game.shopOwned.skillHeal) {
    healBtn.disabled = false;
    healBtn.classList.add('is-disabled');
    healBtn.textContent = '🔒 回復';
    return;
  }
  const remaining = Math.max(0, skillCd('skillHeal', HEAL_COOLDOWN) - (Date.now() - lastHealAt));
  if (remaining === 0) {
    healBtn.disabled = false;
    healBtn.classList.toggle('is-disabled', phase !== 'battle');
    healBtn.textContent = '💗 回復　READY';
    return;
  }
  healBtn.disabled = false;
  healBtn.classList.toggle('is-disabled', !isSkillResetPending('heal'));
  healBtn.textContent = cooldownLabel('heal', '💗 回復', remaining);
}

function updateAtkUpButton() {
  atkUpBtn.classList.remove('buffing');
  if (atkUpEndAt && Date.now() >= atkUpEndAt) {
    atkUpEndAt = 0;
    const player = balls.find(ball => ball.isPlayer && !ball.isClone && !ball.isCompanion);
    if (player) player.atk = getPlayerAtk();
    updateHPUI();
  }
  if (!game.shopOwned.skillAtkUp) {
    atkUpBtn.disabled = false;
    atkUpBtn.classList.add('is-disabled');
    atkUpBtn.textContent = '🔒 攻撃UP';
    return;
  }
  const now = Date.now();
  if (now < atkUpEndAt) {
    atkUpBtn.disabled = true;
    atkUpBtn.classList.remove('is-disabled');
    atkUpBtn.classList.add('buffing');
    atkUpBtn.textContent = `💪 攻撃UP中\n${Math.ceil((atkUpEndAt - now) / 1000)}s`;
    return;
  }
  const remaining = Math.max(0, skillCd('skillAtkUp', ATK_UP_COOLDOWN) - (now - lastAtkUpAt));
  if (remaining === 0) {
    atkUpBtn.disabled = false;
    atkUpBtn.classList.toggle('is-disabled', phase !== 'battle');
    atkUpBtn.textContent = '💪 攻撃UP\nREADY';
    return;
  }
  atkUpBtn.disabled = false;
  atkUpBtn.classList.toggle('is-disabled', !isSkillResetPending('atkup'));
  atkUpBtn.textContent = cooldownLabel('atkup', '💪 攻撃UP', remaining);
}
function renderSkillButton(btn, skillKey, resetKey, label, cooldown, lastAt, activeEndAt, activeLabel) {
  btn.classList.remove('buffing');
  if (!game.shopOwned[skillKey]) {
    btn.disabled = false;
    btn.classList.add('is-disabled');
    btn.textContent = '🔒 ' + label.replace(/^\S+\s/, '');
    return;
  }
  const now = Date.now();
  if (activeEndAt && now < activeEndAt) {
    btn.disabled = true;
    btn.classList.remove('is-disabled');
    btn.classList.add('buffing');
    btn.textContent = `${activeLabel}\n${Math.ceil((activeEndAt - now) / 1000)}s`;
    return;
  }
  const remaining = Math.max(0, skillCd(skillKey, cooldown) - (now - lastAt));
  if (remaining === 0) {
    btn.disabled = false;
    btn.classList.toggle('is-disabled', phase !== 'battle');
    btn.textContent = label + '\nREADY';
    return;
  }
  btn.disabled = false;
  btn.classList.toggle('is-disabled', !isSkillResetPending(resetKey));
  btn.textContent = cooldownLabel(resetKey, label, remaining);
}
function updateDeathButton() { renderSkillButton(deathBtn, 'skillDeath', 'death', '💀 即死魔法', SKILL_DEATH_COOLDOWN, lastDeathAt); }
function updateCoinStrikeButton() { renderSkillButton(coinStrikeBtn, 'skillCoinStrike', 'coinStrike', '🪙 コイン攻撃', SKILL_COINSTRIKE_COOLDOWN, lastCoinStrikeAt, coinStrikeEndAt, '🪙 コイン攻撃中'); }
function updateZeniButton() { renderSkillButton(zeniBtn, 'skillZeni', 'zeni', '💰 ゼニ投げ', SKILL_ZENI_COOLDOWN, lastZeniAt); }
function updateNovaButton() { renderSkillButton(novaBtn, 'skillNova', 'nova', '💥 全体攻撃', SKILL_NOVA_COOLDOWN, lastNovaAt); }
function updateCompRushButton() { renderSkillButton(compRushBtn, 'skillCompRush', 'compRush', '🐾 仲間特攻', SKILL_COMPRUSH_COOLDOWN, lastCompRushAt); }
function updateMysteryButton() { renderSkillButton(mysteryBtn, 'skillMystery', 'mystery', '❓ 謎魔法', SKILL_MYSTERY_COOLDOWN, lastMysteryAt); }
function updateSilenceButton() {
  silenceBtn.classList.remove('buffing');
  if (!game.shopOwned.skillSilence) {
    silenceBtn.disabled = false;
    silenceBtn.classList.add('is-disabled');
    silenceBtn.textContent = '🔒 魔法封じ';
    return;
  }
  const now = Date.now();
  if (now < silenceEndAt) {
    silenceBtn.disabled = true;
    silenceBtn.classList.remove('is-disabled');
    silenceBtn.classList.add('buffing');
    silenceBtn.textContent = `🔇 封印中\n${Math.ceil((silenceEndAt - now) / 1000)}s`;
    return;
  }
  const remaining = Math.max(0, skillCd('skillSilence', SILENCE_COOLDOWN) - (now - lastSilenceAt));
  if (remaining === 0) {
    silenceBtn.disabled = false;
    silenceBtn.classList.toggle('is-disabled', phase !== 'battle');
    silenceBtn.textContent = '🔇 魔法封じ\nREADY';
    return;
  }
  silenceBtn.disabled = false;
  silenceBtn.classList.toggle('is-disabled', !isSkillResetPending('silence'));
  silenceBtn.textContent = cooldownLabel('silence', '🔇 魔法封じ', remaining);
}
function updateRegenButton() {
  regenBtn.classList.remove('buffing');
  if (!game.shopOwned.skillRegen) {
    regenBtn.disabled = false;
    regenBtn.classList.add('is-disabled');
    regenBtn.textContent = '🔒 リヒール';
    return;
  }
  const now = Date.now();
  if (now < regenEndAt) {
    regenBtn.disabled = true;
    regenBtn.classList.remove('is-disabled');
    regenBtn.classList.add('buffing');
    regenBtn.textContent = `🌿 リヒール中\n${Math.ceil((regenEndAt - now) / 1000)}s`;
    return;
  }
  const remaining = Math.max(0, skillCd('skillRegen', REGEN_COOLDOWN) - (now - lastRegenAt));
  if (remaining === 0) {
    regenBtn.disabled = false;
    regenBtn.classList.toggle('is-disabled', phase !== 'battle');
    regenBtn.textContent = '🌿 リヒール\nREADY';
    return;
  }
  regenBtn.disabled = false;
  regenBtn.classList.toggle('is-disabled', !isSkillResetPending('regen'));
  regenBtn.textContent = cooldownLabel('regen', '🌿 リヒール', remaining);
}
function updateParalyzeButton() {
  if (!game.shopOwned.skillParalyze) {
    paralyzeBtn.disabled = false;
    paralyzeBtn.classList.add('is-disabled');
    paralyzeBtn.textContent = '🔒 麻痺';
    return;
  }
  const remaining = Math.max(0, skillCd('skillParalyze', PARALYZE_COOLDOWN) - (Date.now() - lastParalyzeAt));
  if (remaining === 0) {
    paralyzeBtn.disabled = false;
    paralyzeBtn.classList.toggle('is-disabled', phase !== 'battle');
    paralyzeBtn.textContent = '⚡ 麻痺\nREADY';
    return;
  }
  paralyzeBtn.disabled = false;
  paralyzeBtn.classList.toggle('is-disabled', !isSkillResetPending('paralyze'));
  paralyzeBtn.textContent = cooldownLabel('paralyze', '⚡ 麻痺', remaining);
}
function updatePoisonButton() {
  poisonBtn.classList.remove('buffing');
  if (!game.shopOwned.skillPoison) {
    poisonBtn.disabled = false;
    poisonBtn.classList.add('is-disabled');
    poisonBtn.textContent = '🔒 毒';
    return;
  }
  const now = Date.now();
  if (now < poisonBuffEndAt) {
    poisonBtn.disabled = true;
    poisonBtn.classList.remove('is-disabled');
    poisonBtn.classList.add('buffing');
    poisonBtn.textContent = `☠️ 毒付与中\n${Math.ceil((poisonBuffEndAt - now) / 1000)}s`;
    return;
  }
  const remaining = Math.max(0, skillCd('skillPoison', POISON_COOLDOWN) - (now - lastPoisonAt));
  if (remaining === 0) {
    poisonBtn.disabled = false;
    poisonBtn.classList.toggle('is-disabled', phase !== 'battle');
    poisonBtn.textContent = '☠️ 毒\nREADY';
    return;
  }
  poisonBtn.disabled = false;
  poisonBtn.classList.toggle('is-disabled', !isSkillResetPending('poison'));
  poisonBtn.textContent = cooldownLabel('poison', '☠️ 毒', remaining);
}
function updateBarrierButton() {
  if (!game.shopOwned.skillBarrier) {
    barrierBtn.disabled = false;
    barrierBtn.classList.add('is-disabled');
    barrierBtn.textContent = '🔒 バリア';
    return;
  }
  const now = Date.now();
  if (barrierHits > 0) {
    barrierBtn.disabled = true;
    barrierBtn.classList.add('is-disabled');
    barrierBtn.textContent = `🌀 展開中 残り${barrierHits}回`;
    return;
  }
  const remaining = Math.max(0, skillCd('skillBarrier', BARRIER_COOLDOWN) - (now - lastBarrierAt));
  if (remaining === 0) {
    barrierBtn.disabled = false;
    barrierBtn.classList.toggle('is-disabled', phase !== 'battle');
    barrierBtn.textContent = '🌀 バリア　READY';
    return;
  }
  barrierBtn.disabled = false;
  barrierBtn.classList.toggle('is-disabled', !isSkillResetPending('barrier'));
  barrierBtn.textContent = cooldownLabel('barrier', '🌀 バリア', remaining);
}

const SPRITE_FACING = {
  hero: -1, heroine: 0, mage: 0, ranger: 0, warrior: 0, cat: 0, knight: 0, archer: 0, witch: 0, sprite: 1, golem: 1, monk: 0, bard: 0, ninja: 0, priest: 0, dragon: 1, lumber: 0, thief: 0, lancer: 0, samurai: 0, sage: 0, angel: 1,
  paladin: 0, dragoon: 0, summoner: 0, alchemist: 0, gunner: 0, pirate: 0, darkKnight: -1,
  slime: 0, metalSlime: 0, goblin: 1, skeleton: 1, zombie: 1, livingArmor: 1, pumpkin: 0, ghost: 0, bat: 0, demon: 0,
  worm: 1, cobra: 1, salamander: 1, flameWisp: 0, lich: 1, 
  blueDragon: 1, blackDragon: 1, wyvern: 1, 
  vampire: 0, werewolf: 0, franken: 0, slimeGirl: 0, reaper: 0, demonKing: 0,
  goblinSlime: 0, witchSlime: 0, vikingSlime: 0, knifeGoblin: 0, darkMage: 0, slimeBlack: -1, slimeGray: -1, slimePinkS: -1, slimeBlueS: -1, fatDragon: 0, slimeGold: -1, slimeGreenS: -1, fishman: 0, longSlime: 0, cucumber: 0, swordLizard: 0, crabGirl: 0, slimeSilver: -1, slimeRainbow: -1, slimeYellow: -1, blueBat: 0, fireSpirit: 0, succubus: 0, ironKnight: 0, wolfSword: 0, stagKnight: 0, muscleSlime: 0, flameBear: 1, scorpion: 0, marmot: -1, eyeGirl: 0, spiderGirl: 0, wellGhost: 0, gorillaTaur: 0,
  slimeKing: 0, penguinMage: 0, jellyDiva: 0, barrelCat: 0, 
};
const isSlimeSprite = key => /slime/i.test(key) && key !== 'slimeGirl'; // スライム系（プヨプヨ揺らす）
function drawFacingSprite(img, ball, key, cx, cy, sz) {
  const squishy = !ball.isPlayer && isSlimeSprite(key);
  if (!ball.isDying && !squishy) {
    const sp = Math.hypot(ball.vx || 0, ball.vy || 0);
    ball.walkPhase = (ball.walkPhase || 0) + Math.min(sp, 4) * 0.16;
    cy -= Math.abs(Math.sin(ball.walkPhase)) * Math.min(3, sp * 1.4);
  }
  const base = SPRITE_FACING[key] || 0;
  let flip = false;
  if (base !== 0) {
    const candidates = ball.isPlayer
      ? [...balls, ...adds].filter(b => !b.isPlayer && !b.isDying && b.hp > 0)
      : balls.filter(b => b.isPlayer && b.hp > 0);
    let target = null, best = Infinity;
    for (const c of candidates) {
      const d = (c.x - ball.x) ** 2 + (c.y - ball.y) ** 2;
      if (d < best) { best = d; target = c; }
    }
    if (playerDrag && isMainPlayerBall(ball)) { // ドラッグ移動中は進行方向を向く
      const dx = playerDrag.jx || 0;
      if (Math.abs(dx) > 4) ball.faceDir = dx > 0 ? 1 : -1;
    } else if (target) {
      const dx = target.x - ball.x;
      if (Math.abs(dx) > 6) ball.faceDir = dx > 0 ? 1 : -1;
    }
    flip = (ball.faceDir || base) !== base;
  }
  if (ball.berserk) { // 発狂中：赤い怒りのオーラを背負い、小刻みに震える
    const p = 0.75 + Math.sin(Date.now() / 90) * 0.25, g = ctx.createRadialGradient(cx, cy, sz * 0.1, cx, cy, sz * 0.75);
    g.addColorStop(0, `rgba(255,40,40,${0.55 * p})`); g.addColorStop(0.6, `rgba(255,90,30,${0.3 * p})`); g.addColorStop(1, 'rgba(255,0,0,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, sz * 0.75, 0, Math.PI * 2); ctx.fill();
    cx += (Math.random() - 0.5) * 3; cy += (Math.random() - 0.5) * 2;
  }
  ctx.imageSmoothingEnabled = sz * dpr < (img.naturalWidth || img.width || 64);
  if (squishy) { // 足元を支点に、横に広がる⇔縦に伸びるを繰り返してプヨプヨ（動くと大きく弾む）
    if (ball.squishSeed === undefined) ball.squishSeed = Math.random() * 10;
    const sp = Math.min(4, Math.hypot(ball.vx || 0, ball.vy || 0)), hit = ball.hitCooldown > 0 ? 0.06 : 0;
    const w = Math.sin(Date.now() / (150 - sp * 12) + ball.squishSeed) * (0.06 + sp * 0.015 + hit);
    ctx.save();
    ctx.translate(cx, cy + sz / 2);
    ctx.scale((flip ? -1 : 1) * (1 + w), 1 - w);
    ctx.drawImage(img, -sz / 2, -sz, sz, sz);
    ctx.restore();
    ctx.imageSmoothingEnabled = true;
    return;
  }
  if (!flip) { ctx.drawImage(img, cx - sz / 2, cy - sz / 2, sz, sz); ctx.imageSmoothingEnabled = true; return; }
  ctx.save();
  ctx.translate(cx, cy);
  if (flip) ctx.scale(-1, 1);
  ctx.drawImage(img, -sz / 2, -sz / 2, sz, sz);
  ctx.restore();
  ctx.imageSmoothingEnabled = true;
}
function isMainPlayerBall(ball) { return ball.isPlayer && !ball.isClone && !ball.isCompanion; }
function drawBall(ball) {
  const enemySprite = ball.isPlayer ? null : getEnemySpriteImg(ball);
  const shape = enemySprite ? 'emoji' : ball.shape;
  ctx.save();
  if (deathFx && ball === deathFx.ball) {
    const t = getDeathFxProgress();
    const shake = 6 * (1 - t);
    ctx.translate((Math.random() - 0.5) * 2 * shake, (Math.random() - 0.5) * 2 * shake + t * 10);
    const scale = Math.max(0.05, 1 - t * 0.9);
    ctx.translate(ball.x, ball.y); ctx.scale(scale, scale); ctx.translate(-ball.x, -ball.y);
    ctx.globalAlpha = Math.max(0, 1 - t * 0.95) * (Math.floor(Date.now() / 90) % 2 ? 1 : 0.55);
    if (!ball.baseColor) ball.baseColor = ball.color;
    ball.color = Math.floor(Date.now() / 90) % 2 ? '#ff4f6b' : ball.baseColor;
  } else if (ball.baseColor) {
    ball.color = ball.baseColor; delete ball.baseColor;
  }
  if (ball.isDying) {
    const intensity = 7 * (ball.shakeTimer / KNOCKBACK_SHAKE_FRAMES);
    ctx.translate((Math.random() - 0.5) * 2 * intensity, (Math.random() - 0.5) * 2 * intensity);
  }
  ctx.save();
  ctx.shadowColor = ball.glow;
  ctx.shadowBlur = 14;
  ctx.beginPath();
  if (!ball.isPlayer && shape === 'diamond') {
    ctx.moveTo(ball.x, ball.y - ball.radius); ctx.lineTo(ball.x + ball.radius, ball.y); ctx.lineTo(ball.x, ball.y + ball.radius); ctx.lineTo(ball.x - ball.radius, ball.y); ctx.closePath();
  } else if (!ball.isPlayer && shape === 'square') {
    ctx.rect(ball.x - ball.radius * .8, ball.y - ball.radius * .8, ball.radius * 1.6, ball.radius * 1.6);
  } else if (!ball.isPlayer && shape === 'star') {
    const points = shape === 'star' ? 10 : 6;
    for (let i = 0; i < points; i++) {
      const angle = -Math.PI / 2 + i * Math.PI * 2 / points;
      const r = shape === 'star' && i % 2 ? ball.radius * .48 : ball.radius;
      const px = ball.x + Math.cos(angle) * r, py = ball.y + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
  } else if (!ball.isPlayer && (shape === 'spike' || shape === 'emoji')) {
    const spikes = shape === 'emoji' ? 12 : 8;
    const rot = (ball.spinAngle = (ball.spinAngle || 0) + 0.01);
    for (let i = 0; i < spikes * 2; i++) {
      const angle = rot - Math.PI / 2 + i * Math.PI / spikes;
      const rr = i % 2 === 0 ? ball.radius * (shape === 'emoji' ? 1.18 : 1.12) : ball.radius * (shape === 'emoji' ? 0.86 : 0.62);
      const px = ball.x + Math.cos(angle) * rr, py = ball.y + Math.sin(angle) * rr;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
  } else {
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  }
  if (enemySprite) {
  } else if (shape === 'emoji') {
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    ctx.strokeStyle = ball.color;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  } else {
    ctx.fillStyle = ball.color;
    if ((ball.isCompanion && COMPANION_SPRITES[ball.companionId]) || isMainPlayerBall(ball)) ctx.globalAlpha = 0.35; // ドット絵のキャラは丸を薄くして絵を見やすく
    ctx.fill();
  }
  ctx.restore();

  if (!ball.isPlayer && shape !== 'emoji') {
    const er = ball.radius;
    ctx.save();
    ctx.fillStyle = '#ffffff';
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.ellipse(ball.x + side * er * 0.3, ball.y - er * 0.02, er * 0.17, er * 0.2, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#1a1020';
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.arc(ball.x + side * er * 0.27, ball.y + er * 0.03, er * 0.09, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = '#1a1020';
    ctx.lineWidth = Math.max(1.5, er * 0.1);
    ctx.lineCap = 'round';
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(ball.x + side * er * 0.5, ball.y - er * 0.3);
      ctx.lineTo(ball.x + side * er * 0.12, ball.y - er * 0.14);
      ctx.stroke();
    }
    ctx.restore();
  }

  if (enemySprite && ball.stack && ball.stack.length > 1) {
    const base = ball.radius * ENEMY_SPRITE_SCALE * 0.78;
    const sizes = ball.stack.map((_, i) => base * Math.pow(0.8, i));
    const step = sizes.map(sz => sz * 0.46);
    const totalH = step.slice(0, -1).reduce((a, b) => a + b, 0);
    let y = ball.y + totalH / 2;
    ball.stack.forEach((key, i) => {
      const img = enemySpriteImgs[key];
      if (img && img.complete && img.naturalWidth) drawFacingSprite(img, ball, key, ball.x, y, sizes[i]);
      y -= step[i];
    });
  } else if (enemySprite) {
    const sz = ball.radius * ENEMY_SPRITE_SCALE;
    drawFacingSprite(enemySprite, ball, getEnemySpriteKey(ball), ball.x, ball.y, sz);
  } else if (shape === 'emoji') {
    ctx.save();
    ctx.font = `${Math.round(ball.radius * 1.5)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(ball.emoji, ball.x, ball.y + 1);
    ctx.restore();
  }

  if (isMainPlayerBall(ball) && playerSpriteImg.complete && playerSpriteImg.naturalWidth) {
    const sz = ball.radius * 2.9;
    drawFacingSprite(playerSpriteImg, ball, 'hero', ball.x, ball.y - ball.radius * 0.15, sz);
  }

  if (ball.isCompanion) {
    const img = companionSpriteImgs[ball.companionId];
    ctx.save();
    if (img && img.complete && img.naturalWidth) {
      const sz = Math.max(ball.radius, COMPANION_SPRITE_MIN_RADIUS) * 2.9; // 丸より少し大きめに。小さい仲間も自機と同じ大きさで描く
      drawFacingSprite(img, ball, ball.companionId, ball.x, ball.y - ball.radius * 0.15, sz);
      const cnt = getCompanionCount(ball.companionId);
      if (cnt >= 2) { // 人数バッジ
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(0,0,0,0.75)';
        ctx.strokeText('×' + cnt, ball.x + sz * 0.36, ball.y + sz * 0.3);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('×' + cnt, ball.x + sz * 0.36, ball.y + sz * 0.3);
      }
    } else {
      ctx.font = `${Math.round(ball.radius * 1.3)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(ball.icon, ball.x, ball.y + 1);
    }
    ctx.restore();
  }

  if (!ball.isClone && !ball.isCompanion && !ball.isDying) {
    const barWidth = ball.radius * 2;
    const barHeight = 5;
    const barX = ball.x - ball.radius;
    const barY = enemySprite ? ball.y - ball.radius * ENEMY_SPRITE_SCALE / 2 - 6 : ball.y - ball.radius - 10; // 大きめのドット絵の上に出す
    ctx.fillStyle = '#080b12';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    ctx.strokeStyle = 'rgba(255,255,255,0.65)';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barWidth, barHeight);
    const hpRate = ball.hp / ball.maxHp; // 自キャラは緑（突進ゲージの水色と区別）、残り少ないと黄→赤
    ctx.fillStyle = ball.isPlayer ? (hpRate <= 0.25 ? '#ff5c5c' : hpRate <= 0.5 ? '#ffd24f' : '#5fd47a') : (ball.isBoss ? '#d39cff' : '#ff7b87');
    ctx.fillRect(barX, barY, barWidth * Math.max(0, ball.hp / ball.maxHp), barHeight);

  }

  if (ball.isCompanion && ball.maxHp) {
    const drawR = COMPANION_SPRITES[ball.companionId] ? Math.max(ball.radius, COMPANION_SPRITE_MIN_RADIUS) : ball.radius; // ドット絵の大きさに合わせる
    const barWidth = drawR * 2;
    const barHeight = 4;
    const barX = ball.x - drawR;
    const barY = ball.y - drawR - 10;
    ctx.fillStyle = '#080b12';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    ctx.strokeStyle = 'rgba(200,200,200,0.5)';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(barX, barY, barWidth, barHeight);
    if (ball.hp <= 0) {
      ctx.fillStyle = '#666666';
    } else {
      ctx.fillStyle = COMPANION_COLORS[ball.companionId] || '#ffffff';
    }
    ctx.fillRect(barX, barY, barWidth * Math.max(0, ball.hp / ball.maxHp), barHeight);
  }
  ctx.restore(); // 震えtranslate用
}

const flyoutCanvas = document.getElementById('flyoutCanvas');
const flyoutCtx = flyoutCanvas.getContext('2d');
let flyouts = [];
const FLYOUT_FRAMES = 60;
function startFlyout(enemy) {
  if (flyouts.includes(enemy)) return;
  enemy.flyLife = FLYOUT_FRAMES;
  enemy.flySpin = 0;
  enemy.flySpinSpeed = (Math.random() < 0.5 ? -1 : 1) * (0.25 + Math.random() * 0.2);
  flyouts.push(enemy);
}
function updateFlyouts() {
  if (!flyouts.length || hitStopFrames > 0) return;
  const speedMult = getEffectiveSpeed();
  for (const f of flyouts) {
    f.x += f.vx * speedMult;
    f.y += f.vy * speedMult;
    f.vx *= KNOCKBACK_DECEL;
    f.vy *= KNOCKBACK_DECEL;
    f.flySpin += f.flySpinSpeed * speedMult;
    f.flyLife -= speedMult;
  }
  const far = Math.max(window.innerWidth, window.innerHeight) * 1.5;
  flyouts = flyouts.filter(f => f.flyLife > 0 && Math.hypot(f.x - arena.x, f.y - arena.y) < far);
}
function drawFlyouts() {
  const dprNow = Math.max(1, window.devicePixelRatio || 1);
  const w = Math.round(window.innerWidth * dprNow), h = Math.round(window.innerHeight * dprNow);
  if (flyoutCanvas.width !== w || flyoutCanvas.height !== h) { flyoutCanvas.width = w; flyoutCanvas.height = h; }
  flyoutCtx.setTransform(1, 0, 0, 1, 0, 0);
  flyoutCtx.clearRect(0, 0, w, h);
  if (!flyouts.length && !damageTexts.length && !coinFx.length) return;
  const rect = canvas.getBoundingClientRect();
  if (rect.width < 10 || !size) return; // ゲームタブが非表示のときは描かない
  const k = rect.width / size;
  flyoutCtx.setTransform(dprNow * k, 0, 0, dprNow * k, rect.left * dprNow, rect.top * dprNow);
  const mainCtx = ctx;
  ctx = flyoutCtx;
  try {
    for (const f of flyouts) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, f.flyLife / 15);
      ctx.translate(f.x, f.y); ctx.rotate(f.flySpin); ctx.translate(-f.x, -f.y);
      drawBall(f);
      ctx.restore();
    }
    drawCoinFx();
    drawDamageTexts();
  } finally {
    ctx = mainCtx;
  }
}

function drawTapBonus() {
  const pl = balls.find(ball => isMainPlayerBall(ball));
  if (!pl || !(pl.tapSpeedMult > 1)) return;
  const m = getTapDmgMult(pl.tapSpeedMult), lv = Math.min(1, (pl.tapSpeedMult - 1) / (TAP_ACCEL_MAX - 1));
  const pulse = 1 + 0.08 * Math.sin(Date.now() / 70);
  ctx.save();
  ctx.font = `900 ${Math.round((12 + lv * 8) * pulse)}px sans-serif`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
  ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(0,0,0,0.65)';
  ctx.fillStyle = lv >= 1 ? '#ff3b4a' : lv > 0.5 ? '#ff7a2b' : '#ffb35c';
  const txt = `ATK +${Math.round((m - 1) * 100)}%` + (lv >= 1 ? ' MAX' : '');
  const y = pl.y - pl.radius * ENEMY_SPRITE_SCALE / 2 - 12; // HPバーの少し上
  ctx.strokeText(txt, pl.x, y); ctx.fillText(txt, pl.x, y);
  ctx.restore();
}
const FLOOR_TILES = { // 床タイル
  lawn: 'assets/img/floors/lawn.webp',
  dirt: 'assets/img/floors/dirt.webp',
  desert: 'assets/img/floors/desert.webp',
  mossStone: 'assets/img/floors/mossStone.webp',
  town: 'assets/img/floors/town.webp',
  snow: 'assets/img/floors/snow.webp',
  market: 'assets/img/floors/market.webp',
  woodFloor: 'assets/img/floors/woodFloor.webp',
  ruins: 'assets/img/floors/ruins.webp',
  tower: 'assets/img/floors/tower.webp',
  redCarpet: 'assets/img/floors/redCarpet.webp',
  dryCrack: 'assets/img/floors/dryCrack.webp',
  panel: 'assets/img/floors/panel.webp',
  blueTile: 'assets/img/floors/blueTile.webp',
  wasteland: 'assets/img/floors/wasteland.webp',
  sea: 'assets/img/floors/sea.webp',
  brick: 'assets/img/floors/brick.webp',
  dungeon2: 'assets/img/floors/dungeon2.webp',
  other: 'assets/img/floors/other.webp',
  mystic: 'assets/img/floors/mystic.webp',
  dungeon: 'assets/img/floors/dungeon.webp'
};
const FLOOR_NORMAL = ['lawn', 'dirt', 'desert', 'mossStone', 'town', 'snow', 'market', 'woodFloor', 'ruins', 'tower']; // 通常ステージの床（エリア＝10ステージごとに次へ）
const FLOOR_BOSS = ['redCarpet', 'dryCrack', 'panel', 'blueTile', 'wasteland', 'brick', 'sea', 'dungeon2', 'mystic', 'dungeon', 'other']; // ボスステージの床
const FLOOR_TILE_PX = 42;
const FLOOR_SPAN = { lawn: 3, dirt: 3, desert: 3, mossStone: 3, woodFloor: 3, redCarpet: 4, dryCrack: 3, panel: 3, blueTile: 3, wasteland: 3, sea: 3, brick: 3 }; // 1枚の画像が床タイル何枚分か（マップチップは大きめ）
const floorImgs = {};
for (const k in FLOOR_TILES) { const img = new Image(); img.src = FLOOR_TILES[k]; floorImgs[k] = img; }
function getFloorKey(stage) {
  const cycle = Math.floor((Math.max(1, stage) - 1) / 10);
  return stage % 10 === 0 ? FLOOR_BOSS[cycle % FLOOR_BOSS.length] : FLOOR_NORMAL[cycle % FLOOR_NORMAL.length];
}
// サークルの外の背景：バトル背景の一枚絵（cover）か、繰り返しタイル
const OUTER_TILES = {
  stone: { src: 'assets/img/outer/stone.webp', w: 46, h: 34 },
  meadow: { src: 'assets/img/bg/meadow.webp', cover: true },
  badlands: { src: 'assets/img/bg/badlands.webp', cover: true },
  forest: { src: 'assets/img/bg/forest.webp', cover: true },
  snowfield: { src: 'assets/img/bg/snowfield.webp', cover: true },
  crystal: { src: 'assets/img/bg/crystal.webp', cover: true },
  ruins: { src: 'assets/img/bg/ruins.webp', cover: true },
  lava: { src: 'assets/img/bg/lava.webp', cover: true },
  hall: { src: 'assets/img/bg/hall.webp', cover: true },
  throne: { src: 'assets/img/bg/throne.webp', cover: true },
  sky: { src: 'assets/img/bg/sky.webp', cover: true }
};
const OUTER_FOR_FLOOR = { lawn: 'meadow', dirt: 'forest', desert: 'badlands', mossStone: 'ruins', town: 'stone', snow: 'snowfield', market: 'meadow', woodFloor: 'sky', ruins: 'ruins', tower: 'throne',
  redCarpet: 'throne', dryCrack: 'lava', panel: 'hall', blueTile: 'crystal', wasteland: 'badlands', brick: 'hall', sea: 'sky', dungeon2: 'crystal', other: 'hall', mystic: 'sky', dungeon: 'lava' };
function applyOuterBackground(floorKey) {
  const t = OUTER_TILES[OUTER_FOR_FLOOR[floorKey] || 'stone'];
  document.body.style.setProperty('--floor-bg', `url(${t.src})`);
  document.body.style.setProperty('--floor-bg-size', t.cover ? 'cover' : `${Math.round(t.w * 1.6)}px ${Math.round(t.h * 1.6)}px`);
  document.body.style.setProperty('--floor-bg-repeat', t.cover ? 'no-repeat' : 'repeat');
  document.body.style.setProperty('--floor-bg-render', t.cover ? 'auto' : 'pixelated'); // 一枚絵は拡大が大きいのでなめらかに
}
let floorPattern = null, floorPatternKey = '', floorPatternCtx = null;
function drawArenaFloor() {
  const key = getFloorKey(game.stage), img = floorImgs[key];
  if (!img || !img.complete || !img.naturalWidth) return;
  if (floorPatternKey !== key || floorPatternCtx !== ctx) {
    floorPattern = ctx.createPattern(img, 'repeat'); floorPatternKey = key; floorPatternCtx = ctx;
    applyOuterBackground(key); // 画面の背景（サークルの外）は床に合った景色（壁・森・崖など）
  }
  const tilePx = Math.max(24, arena.radius / 5); // 1枚の大きさ（サークルの大きさに合わせる）
  floorPattern.setTransform(new DOMMatrix().translate(arena.x, arena.y).scale(tilePx * (FLOOR_SPAN[key] || 1) / (img.naturalWidth || FLOOR_TILE_PX)));
  ctx.save();
  arenaPath(); ctx.clip();
  ctx.imageSmoothingEnabled = false;
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = floorPattern; ctx.fillRect(arena.x - arena.radius, arena.y - arena.radius, arena.radius * 2, arena.radius * 2);
  ctx.globalAlpha = 1;
  const g = ctx.createRadialGradient(arena.x, arena.y, arena.radius * 0.2, arena.x, arena.y, arena.radius);
  g.addColorStop(0, 'rgba(0,0,0,0.12)'); g.addColorStop(1, 'rgba(0,0,0,0.5)');
  ctx.fillStyle = g; ctx.fillRect(arena.x - arena.radius, arena.y - arena.radius, arena.radius * 2, arena.radius * 2);
  ctx.restore();
  ctx.imageSmoothingEnabled = true;
}
function drawPinchAura() {
  const pl = balls.find(ball => isMainPlayerBall(ball));
  if (!pl || pl.hp <= 0 || pl.hp / pl.maxHp > PINCH_HP_RATIO) return;
  const crit = pl.hp / pl.maxHp <= PINCH_HP_RATIO / 2;
  const a = 0.35 + 0.3 * Math.sin(Date.now() / (crit ? 70 : 140));
  const r = pl.radius * 2.2;
  const g = ctx.createRadialGradient(pl.x, pl.y, pl.radius * 0.4, pl.x, pl.y, r);
  g.addColorStop(0, `rgba(255,50,70,${a})`); g.addColorStop(1, 'rgba(255,50,70,0)');
  ctx.save(); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(pl.x, pl.y, r, 0, Math.PI * 2); ctx.fill(); ctx.restore();
}
