# Firebase の準備（セーブの控え・機種変更）

リリース版（スマホアプリ・Webサイト）で、セーブをクラウドに置いて機種変更できるようにするための手順です。
claude.ai のアーティファクトでは使いません（今までどおり claude.ai の共有データベースを使います）。

## しくみ
1. ゲームを起動すると、Firebase に **名前なし（匿名）でログイン** します。遊ぶ人は何もしなくてよい。
2. セーブの写しを Firestore の `users/<uid>` に、3分おきとゲームを閉じたときに置きます。
3. 機種変更の前に、設定の「📱 機種変更（引き継ぎ）」で **Google か Apple のアカウントにひも付け** ます。
4. 新しい端末で同じアカウントでログインすると、前の端末の控えを読み込めます（中身を見せてから確認）。
5. 端末のセーブが消えて最初からになっていたら、起動時に「控えから復活しますか？」と聞きます。
6. アカウントを使わない「引き継ぎコード」も、今までどおり使えます。

## 手順
1. https://console.firebase.google.com/ で「プロジェクトを追加」。Google アナリティクスはなくてよい。
2. **Authentication** →「始める」→「ログイン方法」で次を有効にする
   - 匿名
   - Google
   - Apple（Apple Developer で Services ID・キーの設定が必要。iOS アプリにするなら必須）
3. **Firestore Database** →「データベースを作成」→ 本番モード → 場所は `asia-northeast1`（東京）
4. Firestore の「ルール」に、このリポジトリの `firebase/firestore.rules` の中身を貼って公開。
5. 「プロジェクトの設定」→「マイアプリ」→ ウェブアプリ（`</>`）を追加 → 出てきた `firebaseConfig` を
   `src/js/firebase-config.js` の `const FIREBASE_CONFIG = null;` の代わりに貼る。
6. Authentication →「設定」→「承認済みドメイン」に、ゲームを公開するドメインを足す（Webで出す場合）。
7. `node tools/build.js` でビルド。

## スマホアプリ（Capacitor）にする場合
- アプリの中ではポップアップのログインが使えないので、`@capacitor-firebase/authentication` を入れる。
  `npm i @capacitor-firebase/authentication` → `npx cap sync`。
  iOS は `GoogleService-Info.plist`、Android は `google-services.json` を Firebase から取り込む。
- プラグインが入っていると、ゲームは自動でそちらのログイン画面を使う（`js/firebase-sync.js` の `native()`）。
- Firebase の SDK はゲーム起動時に `www.gstatic.com` から読み込む。オフラインでも遊べるが、その間は控えを置けない。

## 費用の目安
- 無料枠（Spark プラン）：Firestore は1日あたり 読み取り5万・書き込み2万。
- 1人あたり、書き込みは3分おき（進み具合が変わったときだけ）なので、1日1〜2時間遊ぶ人で数十回。
  1日数百人までなら無料枠に収まる見込み。人数が増えたら従量課金（Blaze）にする。

## 守り
- `firestore.rules` で、`users/<uid>` は本人だけが読み書きでき、決まった項目（save など）しか書けない。
- 端末の中のデータは自分で書き換えられるので、完全な不正対策にはならない。
  ランキングを本当にほかの人と競う形にするときは、サーバー側（Cloud Functions）で記録を確かめる仕組みを足す。
