# このリポジトリでの作業ルール

このファイルは毎回の作業の最初に読み込まれる。ユーザーから受けた「ずっと守る指示」はここに書き足し、
コミットしておくこと（会話が要約・リセットされても忘れないため）。
ユーザーが「以前も伝えた」「いつも」「必ず」「〜しないで」と言った指示は、対応と同時にこのファイルへ追記する。

## やり取り
- ユーザーへの返事は必ず日本語。途中経過のひとこと（「公開中です」など）・作業の合間の短い報告も含め、チャットに出す文はすべて日本語で書く。英語で書かない（4回指摘あり）。ユーザーが「英語で」と言っても、まず打ち間違いでないか確かめる（「日本語で」の打ち間違いだったことがある）。会話が要約されて再開した直後や、作業が長く続いたあとでも英語に切り替えない。返事を送る前に、日本語になっているか必ず見直す。
- 返事はすごく短く（「長い」と指摘あり）。要点だけを数行で。「公開済み」「画面で確かめていない」などの報告は書かない。
- プルリクエストは作らない（頼まれたときだけ）。
- コミット文・コードにモデル名を書かない（コミット末尾の Co-Authored-By / Claude-Session の行は除く）。

## ゲーム（idle-hackslash/）の作り
- ソースは `idle-hackslash/src/`、`node idle-hackslash/tools/build.js` で `dist/` を作る。変更のたびにビルド→コミット→プッシュ→アーティファクト公開。
- 公開先: https://claude.ai/artifact/37J2RiVEVSBgvkdSKh3EQm （dist/index.html を root=dist で公開し、変わった dist ファイルを files に渡す）。
- テスト用のスクリーンショットや作業ファイルはリポジトリに置かない（スクラッチパッドへ）。

## Android アプリ（idle-hackslash/app/）
- Capacitor 8。パッケージ名は **com.hisashiapp.mugenhansya**（変更不可）。ゲームは `../dist` を `npx cap sync android` で取り込む。
- 組み立て：Android SDK（/opt/android-sdk、なければ dl.google.com から入れる）→ `cd idle-hackslash/app/android && ./gradlew --max-workers=1 bundleRelease`（Maven の429が出たら少し待って再実行）。
- 署名の鍵（mugenhansya-upload.jks）とパスワードは**リポジトリに入れない**（公開リポジトリ）。ユーザーが保管している。組み立てるときは鍵を受け取り、`app/android/keystore.properties`（gitignore 済み）に置く。
- GitHub Actions でも組み立てられる：`.github/workflows/android-build.yml`（Actions →「Android ビルド」→ Run workflow。鍵は Secrets の ANDROID_KEYSTORE_BASE64・ANDROID_KEYSTORE_PASSWORD・ANDROID_KEY_ALIAS・ANDROID_KEY_PASSWORD）。デバッグの一番上の「📦 Android ビルド」でその画面を開く。
- 出すたびに `app/android/app/build.gradle` の versionCode を1つ上げ、`src/js/core.js` の GAME_VERSION（設定の「Ver.」表示）も上げる。アプリの versionName は GAME_VERSION から自動で読む。

## ランキング（XSERVER）
- 本物のランキングは XSERVER の PHP + MySQL（`server/rank/`。置き方は README.md）。ゲーム側は `src/js/rank-server.js` の RANK_API_URL（空なら Firebase のまま）。
- パソコン（ブラウザ・アーティファクト）も本物のランキング。署名なしで送る（サーバーは受け付け、版に「web」が付く）。サーバーにつながらないブラウザでは見本のライバルに戻る。
- `server/rank/config.php`（DB のパスワード・署名の鍵・管理画面のパスワード）は**リポジトリに入れない**（.gitignore 済み）。
- 書き込みの署名の鍵は `app/rank-key.txt`（gitignore 済み。ユーザーが保管。この環境ではスクラッチパッドの keys/rank-key.txt に控え）。`npx cap sync` のあと tools/rank-key-copy.js が自動でアプリに入れる。ないとランキングに書き込めないアプリになるので、組み立て前に必ずあるか確かめる。GitHub Actions は Secrets の RANK_SIGN_KEY。
- 管理画面は https://hisashiapp.xsrv.jp/mugen-rank/admin.php（ありえない記録の人を止める・消す）。
- Claude のプレビュー（アーティファクト）は外へ直接つなげないので、claude.ai のコネクタ「Mugen Ranking」（server/rank/mcp.php）経由で本物のランキングを読み書きする。アーティファクトを公開し直すときは capabilities に mcp（Mugen Ranking の rank_read・rank_write）と、もとからある db（players の2つのルール）・user（scopes: ["profile"]）を必ず一緒に書く（書かないと消える）。

## iPhone アプリ（idle-hackslash/app/ios/）
- 同じ Capacitor のプロジェクト。Bundle ID は **com.hisashiapp.mugenhansya**。iPhone と iPad（TARGETED_DEVICE_FAMILY "1,2"）・縦画面のみ（iPad は全画面）。タブレットでは index.html の先頭のスクリプトで viewport の幅を狭めて画面いっぱいに拡大する。ストア画像は store/ios（iPhone）・store/ipad（iPad 2064×2752）。組み立てはユーザーの Mac の Xcode（この環境ではできない）。
- Mac では `cd idle-hackslash/app && npm install && npx cap sync ios` → `npx cap open ios`。版は Xcode の MARKETING_VERSION（GAME_VERSION と同じにする）と、出すたびに上げる CURRENT_PROJECT_VERSION（Android の versionCode と同じ数字にそろえる）。
- AdMob の iOS の ID は `src/js/admob.js` の ADMOB_IDS.ios と `ios/App/App/Info.plist` の GADApplicationIdentifier（本番の ID）。

## AdMob（動画広告）の注意（Android で10秒フリーズした件で分かったこと）
- WebView のゲームは、AdMob が画面のスレッドを使う・広告の WebView と処理を取り合うと**ゲームごと止まる**（Unity では起きなかった）。
- 立ち上げ（MobileAds.initialize）は MainActivity.java で起動時に裏のスレッドで済ませる。AndroidManifest に OPTIMIZE_INITIALIZATION・OPTIMIZE_AD_LOADING・hardwareAccelerated。
- 動画の読み込みは**戦闘中にしない**。戦闘の画面が止まっているとき（ほかのページ・一時停止・宝箱などの画面）だけ先読み（admob.js の admobIdlePrepare）。さらに最後に触ってから5秒以上・ガチャや宝箱の演出中でないときだけ（最初のスキルガチャで1秒止まった指摘あり）。まだなら動画のボタンで「読み込み中…」の間に読む。
- 広告の知らせ（コールバック）の中では画面をいじらない。報酬・ダイアログは広告が閉じてから少しあと。
- SDK を 25.4→25.5（プラグイン 8.4.2）に上げたら本番の読み込みの止まりが 2秒→0.2秒に減った。SDK・プラグインは古くしない。
- デバッグの「⏱ 本番の広告の読み込みで固まるか測る」は、本番の広告を表示せず読み込むので、くり返し押さない（表示率が下がる）。

- **リリース前はアプリ（Android・iPhone）でもデバッグのボタンを常に出す。** リリースのタイミングはユーザーが伝える。そのとき `src/js/core.js` の `HIDE_DEBUG_IN_STORE_APP` を true にする（バージョンの文字を7回押すと出せる仕組みは残る）。
- デバッグにボタンを足すときは、デバッグパネルの**一番上**に足す。
- 新しく作ったデバッグボタンは、使う前から「🕘 最近使った」にも出す（`DBG_NEW`（src/js/ui.js）の先頭に action 名を足す）。

## 見た目の指示（指摘済み・くり返さないこと）
- **ステージ・背景を暗くしない。** 雪原ステージが薄暗いと2回、花火ステージが暗すぎると指摘あり。
  - 床やイベントの色かぶせ（GIMMICKS の tint、周りの影、夜の演出）を足すときは、雪原など明るい床が暗く沈まないか必ず画面で確かめる。
  - 明るい床は `BRIGHT_FLOORS`（src/js/game.js）に登録し、イベントの暗い色かぶせを重ねない。
- ページの背景（仲間ページなど）も暗くしすぎない。文字は読みやすく（白字に黒いしっかりした縁取りなど）。
- 背景がボケて見えると指摘あり。小さい絵を引き伸ばさない。ステージイベントの1枚絵の背景（bg_village・town・ruins・graveyard・church・castle）は削除済み（起動が重くなるため）。村・町・遺跡・墓地・教会は専用の床タイル（st_village など）、王城は赤じゅうたん＋プログラムで描く王の間。戻さない。小さいドット絵のまま使うときは、ぼかさず（imageSmoothingEnabled = false）くっきり描く。
- キャラや絵を縦横比を変えて引き伸ばさない（横だけ伸ばしてキャラが歪んだ指摘あり）。
- 見本の画像をもらったら、その絵を下地にして数字やボタンだけゲーム側で重ねる。
- **穴だらけの洞窟の床（旧 floors/other.webp：黒い穴がびっしり並ぶ石の床）は使わない。**「キモい」と2回指摘あり。似た絵の床も足さない。
- ステージの背景は、ゲームの真上からの視点に合う、すっきりした絵にする。神社（森の祠）ステージは「ごちゃごちゃし過ぎ・視点がおかしい」、花火大会は「動きがもっさり」、コインの雨も削除済み。ステージイベント「ぷるぷる床」（見た目の変化がなかった）・「流れ星の夜」（薄暗い）・「シャボン玉の庭」（意味不明）も削除済み。戻さない。

## 言葉づかい
- レア度の呼び名は **N・R・SR・SSR・UR**（★1〜★5）。コモン・レア・エピック・レジェンド・ミシック・ノーマルとは書かない（宝箱・ガチャ・遺物など全部）。
- 「恩恵」は**味方バフ**（全員の攻撃力・HPを％で強める）、「絆」は**自分バフ**（ほかの仲間の力を取り込む）と呼ぶ。画面に「恩恵」「絆」とは書かない（響きが似て分かりにくいため。プログラムの名前 grace・bond はそのまま）。

## ジェムの配り方
- ジェムは基本的に**転生と動画**で稼ぐもの。紋章（サブスク）加入中は毎日配る（熟練者💎10・伝説の勇者💎50。SUBSCRIPTIONS の dailyGems）。ボス撃破やメタルスライムでは配らない（メタルスライムは進化の羽も出さない・コインだけ）。
- 自己ベストの桁が上がったとき（ステージ100・1000・1万…の初クリア）だけ少し配る（桁数−1個：100→💎2、1000→💎3…）。ミッションは デイリー💎1・ウィークリー💎3（ステージイベント図鑑のジェムはなくした）。
- レア敵は1日1回まで、初撃破💎5・2回目から💎1。初心者ミッションは全部💎1、縛りの実績は💎3（転生100回だけ💎10）。
- 記念日報酬：元日・バレンタイン・ひなまつり・こどもの日・七夕・ハロウィン・クリスマス・冒険を始めた日に遊ぶと💎1（1年1回ずつ。`ANNIVERSARIES` in src/js/compensate.js、一覧はデバッグの「記念日一覧」）。
- フレンドの挑戦状（挑戦状コード）は削除済み（本物のランキングがある）。戻さない。
- 属性（炎・水・草の相性）と株（属性相場）は削除済み。戻さない。値動きでジェムを増やす仕組みは作らない。
- 経験値・レベルアップ・3択パワーアップ、反射MAX維持・ダブル反射玉・反射倍率上昇の秘宝も削除済み。戻さない。
- ドーピングの種・金の招き猫・自キャラの変更・ステージイベント図鑑・採用ガチャ・パーティ枠・オープニング・スキル「麻痺」（雷の杖とかぶる）・宝箱の「スキルの解放」は削除済み。戻さない。スキルは最初から全部が転生の候補で、宝箱からは「スキルの初期Lv」（1つにつき最大+10）が出る。
- **まだリリース前**なので、機能を削除しても通知やジェムの返金・補填は不要（リリース後に変わったら書き直す）。
- お詫び・不具合の補填は `src/js/compensate.js` の COMPENSATIONS に足して配る。

## 音
- BGM はすべてオリジナル曲。既存の曲のメロディを真似しない。
