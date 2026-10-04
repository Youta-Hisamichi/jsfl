// ゲームの組み立て（使い方: cd idle-hackslash/tools && npm install && node build.js）
//
// 元ファイル: src/index.html（画面の骨組み）, src/style.css, src/js/*.js（機能別）, src/assets/img/**（画像）
// 出力:
//   dist/        … PWA版（ファイル分割・画像は外部ファイル・オフライン対応）。サーバーに置いて公開する本番用
//   index.html   … 1ファイル版（CSS/JS/画像をすべて埋め込み）。プレビュー用
//   .build/dev.html … 圧縮しない1ファイル版（テスト用・git管理外）
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const { minify } = require('terser'); const csso = require('csso');
const ROOT = path.join(__dirname, '..'), SRC = path.join(ROOT, 'src'), DIST = path.join(ROOT, 'dist');
const read = f => fs.readFileSync(path.join(SRC, f), 'utf8');
const mime = f => ({ '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.gif': 'image/gif' })[path.extname(f)];
function walk(dir) { return fs.readdirSync(dir, { withFileTypes: true }).flatMap(d => d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)]); }

(async () => {
  const html = read('index.html');
  const jsFiles = [...html.matchAll(/<script src="(js\/[^"]+)"><\/script>/g)].map(m => m[1]);
  const css = read('style.css');
  const jsSrc = jsFiles.map(f => [f, read(f)]);

  // ---- 1ファイル版（プレビュー・テスト用）：画像パスを base64 に置き換えて全部埋め込む ----
  const inlineAssets = text => text.replace(/assets\/img\/[A-Za-z0-9_\/.-]+\.(?:webp|png|jpg|gif)/g, p => {
    const f = path.join(SRC, p); if (!fs.existsSync(f)) return p;
    return `data:${mime(f)};base64,${fs.readFileSync(f).toString('base64')}`;
  });
  const bundle = (cssText, jsText) => html
    .replace('<link rel="stylesheet" href="style.css">', () => `<style>\n${cssText}\n</style>`)
    .replace(new RegExp(jsFiles.map(f => `<script src="${f}"></script>`).join('\\n')), () => `<script>\n${jsText}\n</script>`);
  const devJs = jsSrc.map(([f, t]) => `// ===== ${f} =====\n${t}`).join('\n');
  fs.mkdirSync(path.join(ROOT, '.build'), { recursive: true });
  fs.writeFileSync(path.join(ROOT, '.build/dev.html'), inlineAssets(bundle(css, devJs)));

  const minJs = {};
  for (const [f, t] of jsSrc) minJs[f] = (await minify(t, { compress: { passes: 1 }, mangle: false, toplevel: false })).code;
  const minCss = csso.minify(css).css;
  const minHtml = h => h.replace(/<script>([\s\S]*?)<\/script>/g, (m, c) => m); // 小さな埋め込みスクリプトはそのまま
  let single = inlineAssets(bundle(minCss, jsFiles.map(f => minJs[f]).join(';\n')));
  single = '<!-- このファイルは自動生成です。編集は src/ で行い、tools/build.js で作り直してください -->\n' + minHtml(single);
  const kb = Buffer.byteLength(single);
  single = single.split('@@BUILD_SIZE@@').join(String(kb).padStart('@@BUILD_SIZE@@'.length, '0'));
  fs.writeFileSync(path.join(ROOT, 'index.html'), single);

  // ---- PWA版（dist/）----
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(path.join(DIST, 'js'), { recursive: true });
  const files = [];
  const put = (rel, data) => { const f = path.join(DIST, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, data); files.push(rel); };
  for (const f of walk(path.join(SRC, 'assets'))) put(path.relative(SRC, f).split(path.sep).join('/'), fs.readFileSync(f));
  put('style.css', minCss);
  for (const f of jsFiles) put(f, minJs[f]);
  // アプリのアイコン（主人公のドット絵を拡大）
  put('icons/icon.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#1b2140"/><image href="../assets/img/misc/blHero.webp" x="4" y="4" width="56" height="56" style="image-rendering:pixelated"/></svg>`);
  const manifest = {
    name: '放置系ハクスラ無限反射', short_name: '無限反射', start_url: './', scope: './', display: 'standalone', orientation: 'portrait',
    background_color: '#0c0e16', theme_color: '#1b2140', lang: 'ja',
    icons: ['192', '512'].map(s => ({ src: `icons/icon-${s}.png`, sizes: `${s}x${s}`, type: 'image/png', purpose: 'any maskable' })),
  };
  put('manifest.webmanifest', JSON.stringify(manifest, null, 2));
  const pngIcons = path.join(ROOT, 'tools/icons'); // tools/make-icons.py で作った PNG アイコン
  for (const s of ['192', '512']) { const f = path.join(pngIcons, `icon-${s}.png`); if (fs.existsSync(f)) put(`icons/icon-${s}.png`, fs.readFileSync(f)); }
  const version = crypto.createHash('sha1').update(files.map(f => f + fs.statSync(path.join(DIST, f)).size).join('|') + minJs[jsFiles[0]].length).digest('hex').slice(0, 10);
  const distHtml = html
    .replace('<link rel="stylesheet" href="style.css">', '<link rel="stylesheet" href="style.css">\n<link rel="manifest" href="manifest.webmanifest">\n<meta name="theme-color" content="#1b2140">\n<link rel="apple-touch-icon" href="icons/icon-192.png">\n<link rel="icon" href="icons/icon-192.png">\n<meta name="apple-mobile-web-app-capable" content="yes">')
    .replace('</body>', `<script>if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) { try { navigator.serviceWorker.register('sw.js'); } catch (e) {} }</script>\n</body>`)
    .split('@@BUILD_SIZE@@').join('00000000000000');
  put('index.html', distHtml);
  const precache = ['./', ...files.filter(f => f !== 'sw.js')];
  put('sw.js', `// オフラインでも遊べるよう、ゲームのファイルを端末に保存しておく（版が変わったら入れ替え）
const CACHE = 'mugen-hansha-${version}';
const FILES = ${JSON.stringify(precache)};
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request)));
});
`);
  const distSize = files.reduce((n, f) => n + fs.statSync(path.join(DIST, f)).size, 0);
  console.log('index.html', kb, 'bytes', kb >= 1000000 ? '⚠️ 1MBを超えています（1ファイルのプレビュー版のみ。dist/ は制限なし）' : '');
  console.log('dist/', files.length, 'files', distSize, 'bytes', 'version', version);
})();
