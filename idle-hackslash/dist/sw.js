// オフラインでも遊べるよう、ゲームのファイルを端末に保存しておく（版が変わったら入れ替え）
const CACHE = 'mugen-hansha-f7181db944';
const FILES = ["./","assets/audio/boss_finish.wav","assets/img/icons/x_gem.svg","assets/img/misc/blHero.webp","style.css","js/imgpack1.js","js/imgpack2.js","js/imgpack3.js","js/imgpack4.js","js/imgpack5.js","js/imgpack6.js","js/pause.js","js/core.js","js/menus.js","js/battle.js","js/audio.js","js/enemies.js","js/game.js","js/ui.js","js/onboard.js","js/features.js","js/gimmicks.js","js/reborn.js","js/social.js","js/events.js","js/review.js","js/rare.js","js/opening.js","js/market.js","icons/icon.svg","manifest.webmanifest","icons/icon-192.png","icons/icon-512.png","index.html"];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request)));
});
