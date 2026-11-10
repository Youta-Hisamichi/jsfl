// ===== Firebase でセーブの控え・機種変更（リリース版） =====
// js/firebase-config.js に設定を貼ると動く（null のあいだ・claude.ai のアーティファクトでは何もしない）。
//   1. 起動すると「名前なし（匿名）ログイン」を自動でする → users/<uid> にセーブの控えを3分おき・閉じるときに置く（admin.js の cloudBackup）
//   2. 機種変更するときは、設定の「📱 機種変更」で Google か Apple のアカウントにひも付ける
//   3. 新しい端末で同じアカウントでログインすると、前の端末の控えを読み込める
// スマホアプリ（Capacitor）では、ポップアップでのログインが使えないので @capacitor-firebase/authentication を入れて使う（docs/firebase-setup.md）
const FB_SDK_VER = '10.14.1';
const FB_SDK = ['app', 'auth', 'firestore'].map(n => `https://www.gstatic.com/firebasejs/${FB_SDK_VER}/firebase-${n}-compat.js`);
window.fbCloud = null;
function fbEnabled() {
  if (typeof FIREBASE_CONFIG === 'undefined' || !FIREBASE_CONFIG || !FIREBASE_CONFIG.apiKey) return false;
  if (window.claude || /(^|\.)claude\.ai$|claudeusercontent/.test(location.hostname)) return false; // アーティファクトでは claude.ai の仕組みを使う
  return true;
}
function fbLoadScript(src) { return new Promise((ok, ng) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = () => ng(new Error('load ' + src)); document.head.appendChild(s); }); }
async function fbInit() {
  if (!fbEnabled() || (typeof cloudOff === 'function' && cloudOff())) return; // 削除したあとは、名前なしのログインもしない
  try { for (const src of FB_SDK) await fbLoadScript(src); } catch (e) { console.warn('Firebase を読み込めません', e); return; }
  const fb = window.firebase; if (!fb) return;
  const app = fb.apps.length ? fb.app() : fb.initializeApp(FIREBASE_CONFIG), auth = fb.auth(app), db = fb.firestore(app);
  let checked = false;
  const native = () => { const p = window.Capacitor && window.Capacitor.Plugins; return p && p.FirebaseAuthentication ? p.FirebaseAuthentication : null; };
  const ref = () => db.doc('users/' + fbCloud.uid);
  window.fbCloud = {
    kind: 'firebase', uid: null, linked: false, provider: null, linkedName: '',
    save: d => ref().set(d, { merge: true }),
    async remove() { // クラウドの控え（users/<uid>）と、ログインの記録（アカウント）を消す
      const cur = auth.currentUser; if (!cur) throw new Error('not signed in');
      await ref().delete();
      try { await cur.delete(); }
      catch (e) {
        if (!(e && e.code === 'auth/requires-recent-login')) throw e;
        const pid = fbCloud.provider, N = native(); // ひも付けてから時間がたつと、消す前にもう一度ログインが要る
        if (N) { const r = pid === 'apple.com' ? await N.signInWithApple({ skipNativeAuth: true }) : await N.signInWithGoogle({ skipNativeAuth: true });
          await cur.reauthenticateWithCredential(pid === 'apple.com' ? new fb.auth.OAuthProvider('apple.com').credential({ idToken: r.credential.idToken, rawNonce: r.credential.nonce }) : fb.auth.GoogleAuthProvider.credential(r.credential.idToken)); }
        else await cur.reauthenticateWithPopup(pid === 'apple.com' ? new fb.auth.OAuthProvider('apple.com') : new fb.auth.GoogleAuthProvider());
        await cur.delete();
      }
      window.fbCloud = null;
    },
    load: async () => { const s = await ref().get(); return s.exists ? s.data() : null; },
    async link(providerId) { // 名前なしログインを Google / Apple にひも付ける。そのアカウントが別の端末で使われていたら、そちらに切りかえる
      const cur = auth.currentUser; if (!cur) throw new Error('not signed in');
      let cred = null;
      const N = native();
      if (N) { // スマホアプリ：端末のログイン画面を使い、その結果で Firebase にひも付ける
        const r = providerId === 'google.com' ? await N.signInWithGoogle({ skipNativeAuth: true }) : await N.signInWithApple({ skipNativeAuth: true });
        cred = providerId === 'google.com' ? fb.auth.GoogleAuthProvider.credential(r.credential.idToken) : new fb.auth.OAuthProvider('apple.com').credential({ idToken: r.credential.idToken, rawNonce: r.credential.nonce });
      }
      const provider = providerId === 'google.com' ? new fb.auth.GoogleAuthProvider() : new fb.auth.OAuthProvider('apple.com');
      try { if (cred) await cur.linkWithCredential(cred); else await cur.linkWithPopup(provider); setUser(auth.currentUser); return { switched: false }; }
      catch (e) {
        if (e && e.code === 'auth/credential-already-in-use') { // 前の端末でひも付けたアカウント → そちらでログインし直して、控えを読む
          await auth.signInWithCredential(e.credential || cred); setUser(auth.currentUser);
          return { switched: true, doc: await fbCloud.load() };
        }
        throw e;
      }
    },
  };
  function setUser(u) {
    fbCloud.uid = u.uid; fbCloud.linked = !u.isAnonymous;
    const pd = (u.providerData || []).find(p => p && p.providerId !== 'password') || null;
    fbCloud.provider = pd ? pd.providerId : null; fbCloud.linkedName = (pd && (pd.email || pd.displayName)) || u.email || u.displayName || (pd ? pd.providerId : '');
  }
  auth.onAuthStateChanged(async u => {
    if (!u) { if (typeof cloudOff === 'function' && cloudOff()) return; try { await auth.signInAnonymously(); } catch (e) { console.warn('匿名ログインできません', e); } return; }
    setUser(u);
    if (checked) return; checked = true;
    try { await cloudStartupCheck(await fbCloud.load()); } catch (e) { cloudBackupOk = true; } // 端末より進んだ控えがあれば復活を聞く
  });
}
setTimeout(fbInit, 1500);
