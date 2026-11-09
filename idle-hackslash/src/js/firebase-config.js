// ===== Firebase の設定（リリース版でセーブの控え・機種変更に使う） =====
// Firebase のコンソール（https://console.firebase.google.com/）でプロジェクトを作り、
// 「プロジェクトの設定 → マイアプリ → ウェブアプリ」に出る firebaseConfig の中身を、下の null の代わりに貼り付ける。
// 手順は docs/firebase-setup.md。null のままなら Firebase は使わない（claude.ai のアーティファクトでは、いつも使わない）
const FIREBASE_CONFIG = null;
/* 例（値はプロジェクトごとに違う。APIキーは公開されても大丈夫な種類のもの。守りは Firestore のルールで行う）
const FIREBASE_CONFIG = {
  apiKey: 'AIza...',
  authDomain: 'your-project.firebaseapp.com',
  projectId: 'your-project',
  storageBucket: 'your-project.appspot.com',
  messagingSenderId: '1234567890',
  appId: '1:1234567890:web:abcdef',
};
*/
