// ===== 機種変更（引き継ぎ） =====
// 設定の「📱 機種変更（引き継ぎ）」から開く。2つの方法がある
//   ・クラウド：同じ claude.ai のアカウントでサインインしていれば、前の端末で「クラウドに保存」→ 新しい端末で「クラウドから読み込む」
//   ・引き継ぎコード：セーブを縮めた文字列にして写す（アカウントが違っても使える）。前の端末でコピー → 新しい端末で貼り付け
const XFER_PREFIX_Z = 'MH3-', XFER_PREFIX_RAW = 'MH2-'; // 3・2：書き換え防止のしるし付き（前の 1・0 は受け付けない）
const XFER_SALT = 'mugen-hansha-xfer-v1';
function xferSum(raw) { let h = 0x811c9dc5; const t = XFER_SALT + raw + XFER_SALT; for (let i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(36); } // セーブの中身から作るしるし（中身を書き換えると合わなくなる）
function xferB64(bytes) { let s = ''; for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000)); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
function xferUnB64(t) { t = t.replace(/-/g, '+').replace(/_/g, '/'); while (t.length % 4) t += '='; const s = atob(t), b = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) b[i] = s.charCodeAt(i); return b; }
async function xferPipe(bytes, stream) { return new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(stream)).arrayBuffer()); }
async function makeTransferCode() {
  saveGame(); const raw0 = localStorage.getItem(SAVE_KEY) || '', raw = xferSum(raw0) + '.' + raw0, bytes = new TextEncoder().encode(raw);
  if (typeof CompressionStream === 'function') { try { return XFER_PREFIX_Z + xferB64(await xferPipe(bytes, new CompressionStream('deflate'))); } catch (e) {} }
  return XFER_PREFIX_RAW + xferB64(bytes);
}
async function readTransferCode(code) { // コード → セーブの文字列（読めなければ null）
  code = (code || '').replace(/\s+/g, '');
  try {
    let raw;
    if (code.startsWith(XFER_PREFIX_Z)) raw = new TextDecoder().decode(await xferPipe(xferUnB64(code.slice(4)), new DecompressionStream('deflate')));
    else if (code.startsWith(XFER_PREFIX_RAW)) raw = new TextDecoder().decode(xferUnB64(code.slice(4)));
    else return null;
    const dot = raw.indexOf('.'); if (dot < 1) return null; const sum = raw.slice(0, dot); raw = raw.slice(dot + 1);
    if (xferSum(raw) !== sum) return null; // 書き換えられたコードは受け付けない
    const d = JSON.parse(raw); return d && d.game ? raw : null;
  } catch (e) { return null; }
}
function xferSummary(raw) { try { const g = JSON.parse(raw).game; return `自己ベスト ステージ${formatStageNumber(g.bestStage || 1)}・転生${g.reincarnations || 0}回・💎${Math.floor(g.gems || 0)}`; } catch (e) { return ''; } }
function xferApply(raw) { // このセーブに置きかえて読み込み直す
  try { window.__noSave = true; localStorage.setItem(SAVE_KEY, raw); localStorage.removeItem(SAVE_BACKUP_KEY); } catch (e) {}
  location.reload();
}
function openTransferDialog() {
  let ov = document.getElementById('xferOv');
  if (!ov) { ov = document.createElement('div'); ov.id = 'xferOv'; ov.className = 'xfer-ov'; document.body.appendChild(ov); }
  const P = typeof cloudProvider === 'function' ? cloudProvider() : null, signed = !!P, fb = P && P.kind === 'firebase';
  ov.innerHTML = `<div class="xfer-panel"><div class="xfer-h"><b>📱 機種変更（引き継ぎ）</b><button class="xfer-x" data-x="close">✕</button></div>
    <div class="xfer-now">この端末：${xferSummary(localStorage.getItem(SAVE_KEY) || '{}') || '—'}</div>
    <section><h3>☁️ クラウド（同じアカウントの端末どうし）</h3>
      ${cloudOff() ? `<p>🗑 クラウドのデータとアカウントを削除したため、いまはクラウドを使っていません（セーブはこの端末の中だけにあります）。</p>
      <div class="xfer-row"><button data-x="cloudResume">☁️ クラウドを使う（再開）</button></div></section>` : `${fb ? `<p>${P.linked ? `✅ <b>${P.linkedName}</b> でログイン中。新しい端末でも同じアカウントでログインすると、自動で引き継げます。` : '🔸 いまは<b>名前なしのログイン</b>です（この端末でだけ使える）。機種変更する前に、下のボタンで Google か Apple のアカウントにひも付けてください。新しい端末でも同じアカウントでログインすると、セーブを読み込めます。'}</p>
      <div class="xfer-row"><button data-x="linkGoogle">${P.linked && P.provider === 'google.com' ? '✅ Google' : 'G Googleでログイン'}</button><button data-x="linkApple">${P.linked && P.provider === 'apple.com' ? '✅ Apple' : ' Appleでログイン'}</button></div>`
      : `<p>前の端末で「クラウドに保存」→ 新しい端末で同じ claude.ai のアカウントで開いて「クラウドから読み込む」。${signed ? '' : '<br><b class="xfer-warn">いまはクラウドを使えません（ログインしていない）。下の引き継ぎコードを使ってください。</b>'}</p>`}
      <div class="xfer-row"><button data-x="cloudSave" ${signed ? '' : 'disabled'}>☁️ クラウドに保存</button><button data-x="cloudLoad" ${signed ? '' : 'disabled'}>☁️ クラウドから読み込む</button></div>
      <div class="xfer-msg" data-msg="cloud"></div></section>`}
    <section><h3>🔑 引き継ぎコード（アカウントが違ってもOK）</h3>
      <p>前の端末で「コードを作る」→ コピーして、新しい端末の下の欄に貼り付けて「このコードで引き継ぐ」。</p>
      <div class="xfer-row"><button data-x="make">🔑 コードを作る</button><button data-x="copy" disabled>📋 コピー</button></div>
      <textarea class="xfer-out" readonly placeholder="ここにコードが出ます"></textarea>
      <textarea class="xfer-in" placeholder="新しい端末：ここに引き継ぎコードを貼り付け"></textarea>
      <div class="xfer-row"><button data-x="import">⬇️ このコードで引き継ぐ</button></div>
      <div class="xfer-msg" data-msg="code"></div></section>
    <p class="xfer-note">引き継ぐと、この端末のいまのセーブは上書きされます。</p></div>`;
  ov.classList.add('show');
  const msg = (k, t, bad) => { const m = ov.querySelector(`[data-msg="${k}"]`); m.textContent = t; m.classList.toggle('bad', !!bad); };
  const confirmApply = (raw, from) => simpleChoice({ icon: '📱', title: `${from}から引き継ぎますか？`, text: `<b>${xferSummary(raw)}</b>`, sub: 'この端末のいまのセーブは上書きされます', yes: '引き継ぐ', no: 'やめる', onYes: () => xferApply(raw) });
  ov.onclick = async e => {
    const b = e.target.closest('[data-x]'); if (!b) { if (e.target === ov) ov.classList.remove('show'); return; }
    const x = b.dataset.x;
    if (x === 'close') ov.classList.remove('show');
    else if (x === 'cloudResume') { try { localStorage.removeItem(CLOUD_OFF_KEY); } catch (er) {} saveGame(); location.reload(); }
    else if (x === 'linkGoogle' || x === 'linkApple') {
      if (P.linked) { msg('cloud', `${P.linkedName} でログイン中です`); return; }
      msg('cloud', 'ログイン中…');
      try { const r = await P.link(x === 'linkGoogle' ? 'google.com' : 'apple.com'); if (r && r.switched && r.doc) { msg('cloud', '前に使っていたアカウントでログインしました'); if (r.doc.save) confirmApply(r.doc.save, 'クラウド'); } else { msg('cloud', '✅ ひも付けました。新しい端末でも同じアカウントでログインしてください'); cloudLastRaw = null; await cloudBackup(); } setTimeout(openTransferDialog, 1200); }
      catch (er) { msg('cloud', 'ログインできませんでした（' + (er && (er.code || er.message) || 'error') + '）', true); }
    }
    else if (x === 'cloudSave') { msg('cloud', '保存中…'); cloudBackupOk = true; cloudLastRaw = null; await cloudBackup(); msg('cloud', cloudLastRaw ? `✅ クラウドに保存しました（${new Date().toLocaleString('ja-JP')}）` : '保存できませんでした。少し待ってもう一度押してください', !cloudLastRaw); }
    else if (x === 'cloudLoad') {
      msg('cloud', '読み込み中…');
      try { const d = await P.load();
        if (!d || !d.save) { msg('cloud', 'クラウドに保存されたセーブがありません', true); return; }
        msg('cloud', `見つかりました（${new Date(d.saveAt || 0).toLocaleString('ja-JP')} に保存）`); confirmApply(d.save, 'クラウド');
      } catch (er) { msg('cloud', '読み込めませんでした（' + (er && er.code || 'error') + '）', true); }
    }
    else if (x === 'make') { msg('code', '作成中…'); const c = await makeTransferCode(); ov.querySelector('.xfer-out').value = c; ov.querySelector('[data-x="copy"]').disabled = false; msg('code', `コードを作りました（${c.length.toLocaleString('ja-JP')}文字）。コピーして新しい端末に送ってください`); }
    else if (x === 'copy') { const t = ov.querySelector('.xfer-out'); try { await navigator.clipboard.writeText(t.value); msg('code', '📋 コピーしました'); } catch (er) { t.select(); try { document.execCommand('copy'); msg('code', '📋 コピーしました'); } catch (e2) { msg('code', 'コピーできませんでした。欄を長押しして全部選んでコピーしてください', true); } } }
    else if (x === 'import') { const raw = await readTransferCode(ov.querySelector('.xfer-in').value); if (!raw) { msg('code', 'コードが読めません。最初から最後まで全部貼り付けたか確かめてください', true); return; } confirmApply(raw, '引き継ぎコード'); }
  };
}
document.getElementById('transferBtn')?.addEventListener('click', () => { openTransferDialog(); if (typeof playTone === 'function') playTone(880, 0.06, 'triangle', 0.05); });
// ===== クラウドのデータとアカウントを削除（設定のボタン） =====
// クラウドの控え（セーブの写し）と、ログインの記録（名前なしのID・ひも付けた Google / Apple）を消す。端末の中のセーブはそのまま残る。
// 消したあとは、クラウドに何も置かない（CLOUD_OFF_KEY）。機種変更の画面の「クラウドを使う（再開）」で、新しいIDで再開できる
async function deleteCloudData() {
  const P = typeof cloudProvider === 'function' ? cloudProvider() : null;
  const done = t => simpleChoice({ icon: '🗑', title: t, text: 'この端末の中のセーブは、そのまま残っています。', sub: 'もう一度クラウドを使うときは、設定の「📱 機種変更」から再開できます', yes: '閉じる', no: false });
  if (cloudOff() && !P) { done('クラウドのデータは削除済みです'); return; }
  if (!P || !P.remove) { simpleChoice({ icon: '⚠️', title: 'いまはクラウドにつながっていません', text: 'ネットにつながっているか確かめて、少し待ってからもう一度押してください。', yes: '閉じる', no: false }); return; }
  try { localStorage.setItem(CLOUD_OFF_KEY, '1'); } catch (e) {} // 先に止める（消した直後に、新しい名前なしログインと控えを作らないように）
  try { await P.remove(); cloudLastRaw = null; done('クラウドのデータとアカウントを削除しました'); }
  catch (e) {
    try { localStorage.removeItem(CLOUD_OFF_KEY); } catch (e2) {}
    simpleChoice({ icon: '⚠️', title: '削除できませんでした', text: `（${(e && (e.code || e.message)) || 'error'}）<br>ネットにつながっているか確かめて、もう一度お試しください。`, yes: '閉じる', no: false });
  }
}
document.getElementById('cloudDeleteBtn')?.addEventListener('click', () => {
  if (typeof playTone === 'function') playTone(660, 0.06, 'triangle', 0.05);
  const P = typeof cloudProvider === 'function' ? cloudProvider() : null, who = P && P.linked ? `（${P.linkedName} とのひも付けも消えます）` : '';
  simpleChoice({ icon: '🗑', title: 'クラウドのデータとアカウントを削除しますか？', text: `クラウドに置いてあるセーブの控えと、ログインの記録を消します${who}。<br><b>消したものは元に戻せません。</b>機種変更でクラウドから読み込むこともできなくなります。`,
    sub: 'この端末の中のセーブは消えません（引き続き遊べます）', yes: '削除する', no: 'やめる', onYes: deleteCloudData });
});
