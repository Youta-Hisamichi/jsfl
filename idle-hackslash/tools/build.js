// source.html（読みやすい元のファイル）を圧縮して index.html（プレビュー・公開用）を作る
// 使い方: cd idle-hackslash/tools && npm install && node build.js
const fs = require('fs'), path = require('path');
const { minify } = require('terser'); const csso = require('csso');
(async () => {
  const dir = path.join(__dirname, '..');
  let s = fs.readFileSync(path.join(dir, 'source.html'), 'utf8');
  const scripts = [...s.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  for (const m of scripts.reverse()) {
    const r = await minify(m[1], { compress: { passes: 1 }, mangle: false });
    s = s.slice(0, m.index) + '<script>' + r.code + '</script>' + s.slice(m.index + m[0].length);
  }
  s = s.replace(/<style>([\s\S]*?)<\/style>/, (_, c) => '<style>' + csso.minify(c).css + '</style>');
  s = '<!-- このファイルは自動生成です。編集は source.html で行い、tools/build.js で作り直してください -->\n' + s;
  fs.writeFileSync(path.join(dir, 'index.html'), s);
  const kb = Buffer.byteLength(s);
  console.log('index.html', kb, 'bytes', kb >= 1000000 ? '⚠️ 1MBを超えています' : '');
})();
