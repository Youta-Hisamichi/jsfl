# ランキング API（XSERVER）

Firebase の無料枠（1日の読み書き回数）を気にしなくてよいように、ランキングを XSERVER の PHP + MySQL で動かす。

- `api.php` … ランキングの読み書き
- `admin.php` … 管理画面（ありえない記録の人を止める・消す・名前を消す。パスワードは config.php の admin_pass）
- `config.sample.php` … DB の設定の見本。コピーして `config.php` を作る（**リポジトリに入れない**）
- `schema.sql` … 表を作る SQL
- `.htaccess` … api.php・admin.php 以外を外から見えなくする

## 置き方
1. サーバーパネル →「MySQL設定」で、データベースと MySQL ユーザーを作り、ユーザーにそのデータベースの権限を付ける。
2. サーバーパネル →「phpMyAdmin」でそのデータベースを開き、「SQL」に `schema.sql` の中身を貼って実行。
3. `config.sample.php` をコピーして `config.php` を作り、MySQL のホスト名・データベース名・ユーザー名・パスワードを入れる。
4. ファイルマネージャか FTP で、`public_html/mugen-rank/` などに `api.php`・`config.php`・`.htaccess` を置く。
5. ブラウザで `https://（ドメイン）/mugen-rank/api.php?a=count` を開いて `{"ok":true,"count":0}` が出れば OK。
6. その URL を `src/js/rank-server.js` の `RANK_API_URL` に入れてビルドする（アプリは https のみ。SSL を有効にしておく）。

PHP は 7.4 以上（8 系推奨）。

## 署名（ずる防止）
- 書き込みには署名を付ける（HMAC-SHA256）。鍵は64桁の英数字で、**リポジトリには入れない**。
  - サーバー：config.php の `sign_key`
  - アプリ：`app/rank-key.txt`（gitignore 済み）。`npx cap sync` のあと自動でアプリの中に入る（tools/rank-key-copy.js）
  - GitHub Actions で組み立てるとき：Secrets の `RANK_SIGN_KEY`
- 鍵をなくしたら、新しい鍵を作って3か所とも入れ替える（古いアプリはランキングに書き込めなくなる）。

## 送る回数（1人あたり）
- 本日のクリア数：変わったときだけ、最短1分に1回
- ベスト記録：変わったときだけ、最短5分に1回（ランキングを開いたときは、すぐ1回）
- サーバー側でも、同じ人のベスト記録の書き込みは10秒に1回まで
