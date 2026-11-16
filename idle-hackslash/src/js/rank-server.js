// ===== ランキングを XSERVER の PHP（server/rank/api.php）で読み書きする =====
// RANK_API_URL を入れると、Firebase のかわりにこちらを使う（空なら今までどおり Firebase）。
// アプリ（Android・iPhone）だけで使う。ブラウザ・アーティファクトは見本のライバルのまま。
const RANK_API_URL = (() => { try { return localStorage.getItem('rankApiUrl') || ''; } catch (e) { return ''; } })() || 'https://hisashiapp.xsrv.jp/mugen-rank/api.php'; // 試すときは localStorage の rankApiUrl で上書きできる。本番の URL は右の文字（空にすると Firebase に戻る）
function rankIds() { // 端末ごとの id と合言葉（セーブに入れるので、クラウドの控えから戻しても同じ人のまま）
  const hex = n => { const a = new Uint8Array(n); crypto.getRandomValues(a); return [...a].map(b => b.toString(16).padStart(2, '0')).join(''); };
  if (!/^[0-9a-f]{32}$/.test(game.rankId || '')) game.rankId = hex(16);
  if (!/^[0-9a-f]{32}$/.test(game.rankKey || '')) game.rankKey = hex(16);
  return { id: game.rankId, key: game.rankKey };
}
const rankApiOn = () => !!RANK_API_URL && (!!(window.Capacitor && Capacitor.isNativePlatform && Capacitor.isNativePlatform()) || localStorage.getItem('rankApiTest') === '1');
// 送る中身に署名を付ける（HMAC-SHA256。鍵はアプリの中の rank-key.txt だけにあり、リポジトリ・ブラウザ版には入らない）。
// 1回の計算は1ミリ秒もかからない軽い処理。サーバー（api.php）は同じ鍵で確かめ、合わない書き込みは断る。
let rankSignKey = '';
const rankKeyReady = fetch('rank-key.txt').then(r => r.ok ? r.text() : '').then(t => { t = String(t || '').trim(); if (/^[0-9a-f]{64}$/.test(t)) rankSignKey = t; }).catch(() => {});
function rankSha256(bytes) { // bytes: Uint8Array → 32バイトの Uint8Array
  const K = [0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
  const H = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
  const len = bytes.length, total = ((len + 9 + 63) >> 6) << 6, m = new Uint8Array(total); m.set(bytes); m[len] = 0x80;
  const bits = len * 8; for (let i = 0; i < 8; i++) m[total - 1 - i] = i < 4 ? (bits >>> (i * 8)) & 255 : Math.floor(bits / 2 ** (i * 8)) & 255;
  const w = new Uint32Array(64), r = (x, n) => (x >>> n) | (x << (32 - n));
  for (let o = 0; o < total; o += 64) {
    for (let i = 0; i < 16; i++) w[i] = (m[o + i * 4] << 24) | (m[o + i * 4 + 1] << 16) | (m[o + i * 4 + 2] << 8) | m[o + i * 4 + 3];
    for (let i = 16; i < 64; i++) w[i] = (w[i - 16] + (r(w[i - 15], 7) ^ r(w[i - 15], 18) ^ (w[i - 15] >>> 3)) + w[i - 7] + (r(w[i - 2], 17) ^ r(w[i - 2], 19) ^ (w[i - 2] >>> 10))) >>> 0;
    let [a, b, c, d, e, f, g, h] = H;
    for (let i = 0; i < 64; i++) {
      const t1 = (h + (r(e, 6) ^ r(e, 11) ^ r(e, 25)) + ((e & f) ^ (~e & g)) + K[i] + w[i]) >>> 0, t2 = ((r(a, 2) ^ r(a, 13) ^ r(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) >>> 0;
      h = g; g = f; f = e; e = (d + t1) >>> 0; d = c; c = b; b = a; a = (t1 + t2) >>> 0;
    }
    H[0] = (H[0] + a) >>> 0; H[1] = (H[1] + b) >>> 0; H[2] = (H[2] + c) >>> 0; H[3] = (H[3] + d) >>> 0; H[4] = (H[4] + e) >>> 0; H[5] = (H[5] + f) >>> 0; H[6] = (H[6] + g) >>> 0; H[7] = (H[7] + h) >>> 0;
  }
  const out = new Uint8Array(32); H.forEach((v, i) => { out[i * 4] = v >>> 24; out[i * 4 + 1] = (v >>> 16) & 255; out[i * 4 + 2] = (v >>> 8) & 255; out[i * 4 + 3] = v & 255; }); return out;
}
function rankHmacHex(key, msg) {
  const enc = new TextEncoder(); let k = enc.encode(key); if (k.length > 64) k = rankSha256(k);
  const ip = new Uint8Array(64), op = new Uint8Array(64); for (let i = 0; i < 64; i++) { ip[i] = (k[i] || 0) ^ 0x36; op[i] = (k[i] || 0) ^ 0x5c; }
  const mb = enc.encode(msg), inner = new Uint8Array(64 + mb.length); inner.set(ip); inner.set(mb, 64);
  const ih = rankSha256(inner), outer = new Uint8Array(96); outer.set(op); outer.set(ih, 64);
  return [...rankSha256(outer)].map(b => b.toString(16).padStart(2, '0')).join('');
}
async function rankApi(a, params, body) {
  const q = new URLSearchParams({ a, ...(params || {}) }); let opt = {};
  if (!body) q.set('me', rankIds().id); // 読むとき：自分の id（シャドウバン中の本人には自分が見える）
  if (body) {
    await rankKeyReady;
    const ts = Math.floor((typeof trustNow === 'function' ? trustNow() : Date.now()) / 1000);
    const text = JSON.stringify({ ...rankIds(), ...body, ts });
    if (rankSignKey) q.set('s', rankHmacHex(rankSignKey, a + '|' + text));
    opt = { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: text, keepalive: true }; // keepalive：アプリを閉じる途中でも送り切る
  }
  const r = await fetch(RANK_API_URL + '?' + q, opt);
  const j = await r.json(); if (!j.ok) throw new Error(j.error || 'ranking api'); return j;
}
const rankNum = list => (list || []).map(d => { const o = { ...d }; for (const k of ['st', 'co', 'ki', 'ev', 'rf', 'dp', 'c']) if (k in o) o[k] = Number(o[k]) || 0; return o; }); // 数は必ず数として扱う
const rankServerApi = {
  kind: 'xserver',
  get uid() { return rankApiOn() ? rankIds().id.slice(0, 12) : null; }, // 一覧の id は先頭12文字だけ返ってくるので、それで自分を見分ける
  rankTop: async (f, n) => rankNum((await rankApi('top', { f, n })).list),
  dailyTop: async (day, n) => rankNum((await rankApi('dtop', { day, n })).list),
  rankPut: d => rankApi('put', null, d),
  dailyPut: (day, d) => rankApi('dput', null, { ...d, day }),
  rankAbove: async (f, v, day) => Number((await rankApi('above', day ? { day, v } : { f, v })).count) || 0,
  dailyNear: async (day, c) => { const j = await rankApi('near', { day, c }); return { up: rankNum(j.up), down: rankNum(j.down) }; },
  rankCount: async () => Number((await rankApi('count')).count) || 0,
};
function rankSrv() { return rankApiOn() ? rankServerApi : window.fbCloud; } // ランキングの読み書き先
