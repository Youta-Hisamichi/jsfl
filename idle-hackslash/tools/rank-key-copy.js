// ランキングの署名の鍵（app/rank-key.txt。リポジトリには入れない）を、アプリの中のゲーム（public）に入れる。
// app/package.json の capacitor:copy:after で、npx cap sync / copy のあとに自動で動く。
const fs = require('fs'), path = require('path');
const app = path.join(__dirname, '..', 'app'), src = path.join(app, 'rank-key.txt');
if (!fs.existsSync(src)) { console.warn('⚠ app/rank-key.txt がありません：ランキングに書き込めないアプリになります'); process.exit(0); }
const key = fs.readFileSync(src, 'utf8').trim();
if (!/^[0-9a-f]{64}$/.test(key)) { console.error('✖ app/rank-key.txt は64桁の英数字（0-9a-f）にしてください'); process.exit(1); }
for (const dir of ['android/app/src/main/assets/public', 'ios/App/App/public']) {
  const d = path.join(app, dir); if (!fs.existsSync(d)) continue;
  fs.writeFileSync(path.join(d, 'rank-key.txt'), key); console.log('✔ ランキングの鍵を入れました：' + dir);
}
