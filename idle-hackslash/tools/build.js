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

  // ---- PWA版（dist/）----
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(path.join(DIST, 'js'), { recursive: true });
  const files = [];
  const put = (rel, data) => { const f = path.join(DIST, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, data); files.push(rel); };
  // ---- 画像はファイル数を抑えるため、まとめて埋め込む（成果物のファイル数上限対策） ----
  //   CSS で使う画像 … style.css に data URL で埋め込む
  //   JS・HTML で使う画像 … js/imgpack*.js（パス → data URL の表）にまとめ、読み込み時に置き換える（js/ の先頭で読む）
  //   index.html に直接書いた画像 … その場で data URL に
  const IMG_RE = /assets\/img\/[A-Za-z0-9_\/.-]+\.(?:webp|png|jpg|gif)/g;
  const dataUrl = rel => `data:${mime(rel)};base64,${fs.readFileSync(path.join(SRC, rel)).toString('base64')}`;
  const allImgs = walk(path.join(SRC, 'assets/img')).map(f => path.relative(SRC, f).split(path.sep).join('/')).filter(rel => mime(rel));
  const jsHtmlText = html + jsSrc.map(([, t]) => t).join('\n');
  const inPack = () => true;
  // CSS の画像は var(--iN) に置き換え、読み込み時に :root へ data URL を入れる（CSS を軽く保ち、同じ画像を二重に持たない）
  const cssVars = {}; let cssVarN = 0;
  const cssWithVars = minCss.replace(/url\(\s*(['"]?)(assets\/img\/[A-Za-z0-9_\/.-]+\.(?:webp|png|jpg|gif))\1\s*\)/g, (m, q, rel) => {
    if (!fs.existsSync(path.join(SRC, rel))) return m;
    const v = Object.keys(cssVars).find(k => cssVars[k] === rel) || ('--i' + (cssVarN++).toString(36)); cssVars[v] = rel; return `var(${v})`;
  });
  const KEEP_FILES = ['assets/img/misc/blHero.webp']; // アプリのアイコン（icon.svg）が参照するので実ファイルも残す
  for (const f of walk(path.join(SRC, 'assets'))) { const rel = path.relative(SRC, f).split(path.sep).join('/'); if (rel.startsWith('assets/img/') && mime(rel) && !KEEP_FILES.includes(rel)) continue; put(rel, fs.readFileSync(f)); }
  put('style.css', cssWithVars);
  const packList = allImgs.filter(inPack), packs = []; let cur = [], curSize = 0;
  for (const rel of packList) { const sz = fs.statSync(path.join(SRC, rel)).size; if (curSize + sz > 2400000 && cur.length) { packs.push(cur); cur = []; curSize = 0; } cur.push(rel); curSize += sz; }
  if (cur.length) packs.push(cur);
  const packFiles = packs.map((list, i) => { const name = `js/imgpack${i + 1}.js`; put(name, 'var __IMG=window.__IMG||(window.__IMG={});\n' + list.map(rel => `__IMG[${JSON.stringify(rel)}]=${JSON.stringify(dataUrl(rel))};`).join('\n')); return name; });
  const IMG_HOOK = `(function(){var M=window.__IMG||{};var RE=/(?:https?:\\/\\/[^"'()\\s]*?\\/)?(?:\\.\\/)?(assets\\/img\\/[A-Za-z0-9_\\/.-]+\\.(?:webp|png|jpg|gif))/g;
function one(u){if(typeof u!=='string'||u.indexOf('assets/img/')<0)return u;var i=u.indexOf('assets/img/');var k=u.slice(i).split(/[?#]/)[0];return M[k]||u;}
function sub(s){return typeof s==='string'&&s.indexOf('assets/img/')>=0?s.replace(RE,function(m,k){return M[k]||m;}):s;}
function patch(o,p,f){var d=Object.getOwnPropertyDescriptor(o,p);if(!d||!d.set)return;Object.defineProperty(o,p,{configurable:true,enumerable:d.enumerable,get:d.get,set:function(v){d.set.call(this,f(v));}});}
patch(HTMLImageElement.prototype,'src',one);patch(Element.prototype,'innerHTML',sub);patch(Element.prototype,'outerHTML',sub);
var ia=Element.prototype.insertAdjacentHTML;Element.prototype.insertAdjacentHTML=function(p,h){return ia.call(this,p,sub(h));};
var sa=Element.prototype.setAttribute;Element.prototype.setAttribute=function(n,v){return sa.call(this,n,(n==='src'||n==='style'||n==='href')?sub(String(v)):v);};
var sp=CSSStyleDeclaration.prototype.setProperty;CSSStyleDeclaration.prototype.setProperty=function(n,v,p){return sp.call(this,n,sub(v),p);};
var V=${JSON.stringify(cssVars)},css=':root{';for(var k in V){if(M[V[k]])css+=k+':url("'+M[V[k]]+'");';}var st=document.createElement('style');st.textContent=css+'}';document.head.appendChild(st);
window.__imgUrl=one;})();`;
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
  const distHtml = html
    .replace(IMG_RE, p => fs.existsSync(path.join(SRC, p)) ? dataUrl(p) : p) // index.html に直接書いた画像
    .replace(`<script src="${jsFiles[0]}"></script>`, () => packFiles.map(f => `<script src="${f}"></script>`).join('\n') + `\n<script>${IMG_HOOK}</script>\n<script src="${jsFiles[0]}"></script>`)
    .replace('<link rel="stylesheet" href="style.css">', '<link rel="preload" href="style.css" as="style" onload="this.onload=null;this.rel=\'stylesheet\'"><noscript><link rel="stylesheet" href="style.css"></noscript>\n<link rel="manifest" href="manifest.webmanifest">\n<meta name="theme-color" content="#1b2140">\n<link rel="apple-touch-icon" href="icons/icon-192.png">\n<link rel="icon" href="icons/icon-192.png">\n<meta name="apple-mobile-web-app-capable" content="yes">')
    .replace('</body>', `<script>if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) { try { navigator.serviceWorker.register('sw.js'); } catch (e) {} }</script>\n</body>`);
  put('index.html', distHtml);
  // ---- 容量レポート（デバッグ画面に表示）：dist/ の実ファイルを種類ごとに集計して JS に書き込む ----
  const sizeOf = f => fs.statSync(path.join(DIST, f)).size;
  const SW_EST = 12000; // sw.js はこの後で作るので概算
  const groupOf = f => f.startsWith('js/imgpack') ? '画像（まとめ）' : f.startsWith('js/') ? 'プログラム' : f === 'style.css' ? 'CSS' : f === 'index.html' ? 'HTML' : f.startsWith('icons/') || f.endsWith('.webmanifest') ? 'アプリ設定' :
    ({ icons: 'アイコン', enemies: '敵', companions: '仲間', npc: 'NPC', floors: '床', bg: '背景', outer: '背景', obstacles: '障害物', ui: 'UI素材', misc: 'その他画像' })[f.split('/')[2]] || 'その他';
  const groups = {};
  for (const f of files) { const g = groupOf(f); groups[g] = groups[g] || [g, 0, 0]; groups[g][1] += sizeOf(f); groups[g][2]++; }
  groups['アプリ設定'] = groups['アプリ設定'] || ['アプリ設定', 0, 0]; groups['アプリ設定'][1] += SW_EST; groups['アプリ設定'][2]++;
  const report = { total: files.reduce((n, f) => n + sizeOf(f), 0) + SW_EST, files: files.length + 1, single: kb, at: new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }),
    groups: Object.values(groups).sort((x, y) => y[1] - x[1]) };
  const reportStr = JSON.stringify(JSON.stringify(report)).slice(1, -1).replace(/'/g, "\\'");
  const fill = t => t.split('@@SIZE_REPORT@@').join(reportStr);
  for (const f of files.filter(f => f.startsWith('js/'))) fs.writeFileSync(path.join(DIST, f), fill(fs.readFileSync(path.join(DIST, f), 'utf8')));
  fs.writeFileSync(path.join(ROOT, 'index.html'), fill(single));
  fs.writeFileSync(path.join(ROOT, '.build/dev.html'), fill(fs.readFileSync(path.join(ROOT, '.build/dev.html'), 'utf8')));
  const vh = crypto.createHash('sha1'); for (const f of files) { vh.update(f); vh.update(fs.readFileSync(path.join(DIST, f))); } // 中身で版を決める（同じサイズの変更でも更新される）
  const version = vh.digest('hex').slice(0, 10);
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
