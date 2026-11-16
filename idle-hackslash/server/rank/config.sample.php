<?php
// これをコピーして config.php を作り、XSERVER のサーバーパネル「MySQL設定」で作ったデータベースの情報を入れる。
// config.php はリポジトリに入れない（.gitignore 済み）。サーバーにだけ置く。
return [
  'driver' => 'mysql',
  'host'   => 'localhost',          // XSERVER の MySQL ホスト名（例：mysql○○○.xserver.jp。パネルの MySQL 設定に出ている）
  'dbname' => 'xxxx_mugen',         // データベース名
  'user'   => 'xxxx_mugen',         // MySQL ユーザー名
  'pass'   => 'ここにパスワード',
  'tz'     => 'Asia/Tokyo',
];
