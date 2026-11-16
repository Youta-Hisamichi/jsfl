# ランキング API（XSERVER）

Firebase の無料枠（1日の読み書き回数）を気にしなくてよいように、ランキングを XSERVER の PHP + MySQL で動かす。

- `api.php` … ランキングの読み書き（これだけを外に見せる）
- `config.sample.php` … DB の設定の見本。コピーして `config.php` を作る（**リポジトリに入れない**）
- `schema.sql` … 表を作る SQL
- `.htaccess` … api.php 以外を外から見えなくする

## 置き方
1. サーバーパネル →「MySQL設定」で、データベースと MySQL ユーザーを作り、ユーザーにそのデータベースの権限を付ける。
2. サーバーパネル →「phpMyAdmin」でそのデータベースを開き、「SQL」に `schema.sql` の中身を貼って実行。
3. `config.sample.php` をコピーして `config.php` を作り、MySQL のホスト名・データベース名・ユーザー名・パスワードを入れる。
4. ファイルマネージャか FTP で、`public_html/mugen-rank/` などに `api.php`・`config.php`・`.htaccess` を置く。
5. ブラウザで `https://（ドメイン）/mugen-rank/api.php?a=count` を開いて `{"ok":true,"count":0}` が出れば OK。
6. その URL を `src/js/rank-server.js` の `RANK_API_URL` に入れてビルドする（アプリは https のみ。SSL を有効にしておく）。

PHP は 7.4 以上（8 系推奨）。
