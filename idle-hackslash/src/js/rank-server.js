// ===== ランキングを XSERVER の PHP（server/rank/api.php）で読み書きする =====
// RANK_API_URL を入れると、Firebase のかわりにこちらを使う（空なら今までどおり Firebase）。
// アプリ（Android・iPhone）だけで使う。ブラウザ・アーティファクトは見本のライバルのまま。
const RANK_API_URL = (() => { try { return localStorage.getItem('rankApiUrl') || ''; } catch (e) { return ''; } })() || ''; // 試すときは localStorage の rankApiUrl で上書きできる。本番の URL は '' の中に入れる
function rankIds() { // 端末ごとの id と合言葉（セーブに入れるので、クラウドの控えから戻しても同じ人のまま）
  const hex = n => { const a = new Uint8Array(n); crypto.getRandomValues(a); return [...a].map(b => b.toString(16).padStart(2, '0')).join(''); };
  if (!/^[0-9a-f]{32}$/.test(game.rankId || '')) game.rankId = hex(16);
  if (!/^[0-9a-f]{32}$/.test(game.rankKey || '')) game.rankKey = hex(16);
  return { id: game.rankId, key: game.rankKey };
}
const rankApiOn = () => !!RANK_API_URL && (!!(window.Capacitor && Capacitor.isNativePlatform && Capacitor.isNativePlatform()) || localStorage.getItem('rankApiTest') === '1');
async function rankApi(a, params, body) {
  const q = new URLSearchParams({ a, ...(params || {}) });
  const r = await fetch(RANK_API_URL + '?' + q, body ? { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ ...rankIds(), ...body }) } : {});
  const j = await r.json(); if (!j.ok) throw new Error(j.error || 'ranking api'); return j;
}
const rankServerApi = {
  kind: 'xserver',
  get uid() { return rankApiOn() ? rankIds().id.slice(0, 12) : null; }, // 一覧の id は先頭12文字だけ返ってくるので、それで自分を見分ける
  rankTop: async (f, n) => (await rankApi('top', { f, n })).list,
  dailyTop: async (day, n) => (await rankApi('dtop', { day, n })).list,
  rankPut: d => rankApi('put', null, d),
  dailyPut: (day, d) => rankApi('dput', null, { ...d, day }),
  rankAbove: async (f, v, day) => (await rankApi('above', day ? { day, v } : { f, v })).count,
  dailyNear: async (day, c) => { const j = await rankApi('near', { day, c }); return { up: j.up, down: j.down }; },
  rankCount: async () => (await rankApi('count')).count,
};
function rankSrv() { return rankApiOn() ? rankServerApi : window.fbCloud; } // ランキングの読み書き先
