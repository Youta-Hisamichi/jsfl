<?php
// 無限反射のランキング API（XSERVER の PHP + MySQL で動かす）
// 置き方は README.md。DB の設定は config.php（リポジトリには入れない。config.sample.php をまねて作る）
//
// 書く：POST api.php?a=put   本文 JSON {id,key,n,st,co,ki,ev,rf,dp,ver}       … ベスト記録
//       POST api.php?a=dput  本文 JSON {id,key,n,day,c}                         … その日のクリア数
// 読む：GET  api.php?a=top&f=st&n=50 / a=dtop&day=YYYY-MM-DD&n=50
//       GET  api.php?a=above&f=st&v=123 / a=above&day=YYYY-MM-DD&v=12（自分より上の人数）
//       GET  api.php?a=near&day=YYYY-MM-DD&c=12（すぐ上・すぐ下の3人ずつ） / a=count（登録人数）
// id は端末で作る32桁の英数字、key は端末だけが知っている合言葉（サーバーには sha256 だけ残す）。
// 書き込みには署名 s（HMAC-SHA256(sign_key, a + '|' + 本文)）を付ける。config.php に sign_key があるときは、署名が合わないものを断る。
// 管理画面（admin.php）で止めた人（ban = 1）は、一覧に出さず、書き込みも黙って捨てる。

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Cache-Control: no-store');
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') { http_response_code(204); exit; }

const FIELDS = ['st', 'co', 'ki', 'ev', 'rf', 'dp'];
const TOP_MAX = 100;
const PUT_GAP_SEC = 10;      // 同じ人の書き込みは10秒に1回まで（それより早いものは読み捨てる）
const DAILY_KEEP_DAYS = 40;  // 本日のランキングは40日分だけ残す

function out($data, $code = 200) { http_response_code($code); echo json_encode($data, JSON_UNESCAPED_UNICODE); exit; }
function fail($msg, $code = 400) { out(['ok' => false, 'error' => $msg], $code); }

$cfgFile = __DIR__ . '/config.php';
if (!is_file($cfgFile)) fail('config.php がありません', 500);
$cfg = require $cfgFile;
date_default_timezone_set($cfg['tz'] ?? 'Asia/Tokyo');

try {
  if (($cfg['driver'] ?? 'mysql') === 'sqlite') {
    $db = new PDO('sqlite:' . $cfg['sqlite_path']);
    $db->exec('PRAGMA journal_mode=WAL'); $db->exec('PRAGMA busy_timeout=3000');
  } else {
    $db = new PDO("mysql:host={$cfg['host']};dbname={$cfg['dbname']};charset=utf8mb4", $cfg['user'], $cfg['pass'], [PDO::ATTR_PERSISTENT => false]);
  }
  $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (Throwable $e) { fail('DB につながりません', 500); }
$isSqlite = $db->getAttribute(PDO::ATTR_DRIVER_NAME) === 'sqlite';
if ($isSqlite) { // 手元で試すとき用：表がなければ作る
  $db->exec('CREATE TABLE IF NOT EXISTS players (id TEXT PRIMARY KEY, key_hash TEXT NOT NULL, n TEXT NOT NULL, st REAL DEFAULT 0, co REAL DEFAULT 0, ki REAL DEFAULT 0, ev REAL DEFAULT 0, rf REAL DEFAULT 0, dp REAL DEFAULT 0, ver TEXT DEFAULT "", at INTEGER DEFAULT 0, created INTEGER DEFAULT 0, ban INTEGER DEFAULT 0)');
  foreach (FIELDS as $f) $db->exec("CREATE INDEX IF NOT EXISTS ix_$f ON players($f)");
  $db->exec('CREATE TABLE IF NOT EXISTS daily (day TEXT NOT NULL, id TEXT NOT NULL, n TEXT NOT NULL, c INTEGER DEFAULT 0, at INTEGER DEFAULT 0, PRIMARY KEY(day, id))');
  $db->exec('CREATE INDEX IF NOT EXISTS ix_daily_c ON daily(day, c)');
}

// ---- 入力のチェック ----
function cleanName($v) { // タグの形だけ取り除き、25文字まで（(>_<) の < > は残す。表示する側で無害化する）
  $v = preg_replace('/<\/?[A-Za-z!][^<>]*>/u', '', (string)$v);
  $v = preg_replace('/[\x00-\x1F\x7F]/u', '', $v);
  $v = trim(preg_replace('/\s+/u', ' ', $v));
  $v = mb_substr($v, 0, 25, 'UTF-8');
  return $v === '' ? '名無しの勇者' : $v;
}
function num($v, $max) { $v = is_numeric($v) ? (float)$v : 0; if (!is_finite($v) || $v < 0) $v = 0; return min($v, $max); }
function validDay($d) { // YYYY-MM-DD で、サーバーの今日の前後1日まで（時計をずらした書き込みを防ぐ）
  if (!is_string($d) || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $d)) return false;
  $t = strtotime($d . ' 12:00:00'); return $t !== false && abs($t - strtotime(date('Y-m-d') . ' 12:00:00')) <= 86400;
}
function readDay($d) { if (!is_string($d) || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $d)) fail('day が変です'); return $d; }
function field($f) { if (!in_array($f, FIELDS, true)) fail('f が変です'); return $f; }
function limitN($n) { $n = (int)$n; return max(1, min(TOP_MAX, $n ?: 50)); }

// 本人確認：初めての id なら登録、2回目からは key が合うかを見る
function auth($db, $body, $name) {
  $id = $body['id'] ?? ''; $key = $body['key'] ?? '';
  if (!is_string($id) || !preg_match('/^[0-9a-f]{32}$/', $id)) fail('id が変です');
  if (!is_string($key) || !preg_match('/^[0-9a-f]{32,64}$/', $key)) fail('key が変です');
  $h = hash('sha256', $key);
  $st = $db->prepare('SELECT key_hash, at, ban FROM players WHERE id = ?'); $st->execute([$id]); $row = $st->fetch();
  if (!$row) {
    $db->prepare('INSERT INTO players (id, key_hash, n, st, at, created) VALUES (?, ?, ?, 1, ?, ?)')->execute([$id, $h, $name, time(), time()]);
    return [$id, 0];
  }
  if (!hash_equals($row['key_hash'], $h)) fail('key が合いません', 403);
  if ((int)$row['ban']) out(['ok' => true]); // 止めた人には、うまくいったふりをして何も書かない
  return [$id, (int)$row['at']];
}

$a = $_GET['a'] ?? '';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'POST') {
  $raw = file_get_contents('php://input', false, null, 0, 4096);
  $body = json_decode($raw, true); if (!is_array($body)) fail('本文が JSON ではありません');
  if (!empty($cfg['sign_key'])) { // 署名のチェック（アプリに入れた鍵で作ったものだけ受け付ける）
    $sig = $_GET['s'] ?? '';
    if (!is_string($sig) || !hash_equals(hash_hmac('sha256', $a . '|' . $raw, $cfg['sign_key']), $sig)) fail('署名が合いません', 403);
    if (abs(time() - (int)($body['ts'] ?? 0)) > 86400) fail('時刻がずれています', 403); // 同じ書き込みを何日もあとに使い回させない
  }
  $name = cleanName($body['n'] ?? '');
  if ($a === 'put') {
    [$id, $lastAt] = auth($db, $body, $name);
    if ($lastAt && time() - $lastAt < PUT_GAP_SEC) out(['ok' => true, 'skipped' => true]);
    $v = ['st' => num($body['st'] ?? 0, 1e12), 'co' => num($body['co'] ?? 0, 1e300), 'ki' => num($body['ki'] ?? 0, 1e15), 'ev' => num($body['ev'] ?? 0, 1e300), 'rf' => num($body['rf'] ?? 0, 1e300), 'dp' => num($body['dp'] ?? 0, 1e300)];
    $ver = mb_substr((string)($body['ver'] ?? ''), 0, 20);
    $db->prepare('UPDATE players SET n = ?, st = ?, co = ?, ki = ?, ev = ?, rf = ?, dp = ?, ver = ?, at = ? WHERE id = ?')
       ->execute([$name, $v['st'], $v['co'], $v['ki'], $v['ev'], $v['rf'], $v['dp'], $ver, time(), $id]);
    out(['ok' => true]);
  }
  if ($a === 'dput') {
    [$id] = auth($db, $body, $name);
    $day = $body['day'] ?? ''; if (!validDay($day)) fail('day が変です');
    $c = (int)num($body['c'] ?? 0, 100000);
    $sql = $isSqlite
      ? 'INSERT INTO daily (day, id, n, c, at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(day, id) DO UPDATE SET n = excluded.n, c = MAX(daily.c, excluded.c), at = excluded.at'
      : 'INSERT INTO daily (day, id, n, c, at) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE n = VALUES(n), c = GREATEST(c, VALUES(c)), at = VALUES(at)';
    $db->prepare($sql)->execute([$day, $id, $name, $c, time()]);
    $db->prepare('UPDATE players SET n = ? WHERE id = ?')->execute([$name, $id]); // 名前を変えたらベスト記録の方もすぐ変える
    if (mt_rand(1, 200) === 1) $db->prepare('DELETE FROM daily WHERE day < ?')->execute([date('Y-m-d', time() - DAILY_KEEP_DAYS * 86400)]); // ときどき古い日を消す
    out(['ok' => true]);
  }
  fail('a が変です');
}

// ---- 読む ----
$pub = fn($r) => array_merge($r, ['id' => substr($r['id'], 0, 12)]); // 他人の id は先頭だけ見せる（自分かどうかの見分けにはこれで足りる）
if ($a === 'top') {
  $f = field($_GET['f'] ?? ''); $n = limitN($_GET['n'] ?? 50);
  $rows = $db->query("SELECT id, n, st, co, ki, ev, rf, dp FROM players WHERE ban = 0 ORDER BY $f DESC, at ASC LIMIT $n")->fetchAll();
  out(['ok' => true, 'list' => array_map($pub, $rows)]);
}
if ($a === 'dtop') {
  $day = readDay($_GET['day'] ?? ''); $n = limitN($_GET['n'] ?? 50);
  $st = $db->prepare("SELECT d.id, d.n, d.c FROM daily d JOIN players p ON p.id = d.id AND p.ban = 0 WHERE d.day = ? ORDER BY d.c DESC, d.at ASC LIMIT $n"); $st->execute([$day]);
  out(['ok' => true, 'list' => array_map($pub, $st->fetchAll())]);
}
if ($a === 'above') {
  $v = (float)($_GET['v'] ?? 0);
  if (isset($_GET['day'])) { $st = $db->prepare('SELECT COUNT(*) AS k FROM daily d JOIN players p ON p.id = d.id AND p.ban = 0 WHERE d.day = ? AND d.c > ?'); $st->execute([readDay($_GET['day']), $v]); }
  else { $f = field($_GET['f'] ?? ''); $st = $db->prepare("SELECT COUNT(*) AS k FROM players WHERE ban = 0 AND $f > ?"); $st->execute([$v]); }
  out(['ok' => true, 'count' => (int)$st->fetch()['k']]);
}
if ($a === 'near') {
  $day = readDay($_GET['day'] ?? ''); $c = (int)($_GET['c'] ?? 0);
  $up = $db->prepare('SELECT d.id, d.n, d.c FROM daily d JOIN players p ON p.id = d.id AND p.ban = 0 WHERE d.day = ? AND d.c > ? ORDER BY d.c ASC LIMIT 3'); $up->execute([$day, $c]);
  $dn = $db->prepare('SELECT d.id, d.n, d.c FROM daily d JOIN players p ON p.id = d.id AND p.ban = 0 WHERE d.day = ? AND d.c < ? ORDER BY d.c DESC LIMIT 3'); $dn->execute([$day, $c]);
  out(['ok' => true, 'up' => array_map($pub, $up->fetchAll()), 'down' => array_map($pub, $dn->fetchAll())]);
}
if ($a === 'count') out(['ok' => true, 'count' => (int)$db->query('SELECT COUNT(*) AS k FROM players WHERE ban = 0')->fetch()['k']]);
fail('a が変です');
