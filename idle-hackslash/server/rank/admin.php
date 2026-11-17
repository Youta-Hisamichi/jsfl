<?php
// ランキングの管理画面：ありえない記録の人を止める（一覧から消し、書き込みも黙って捨てる）・シャドウバン（本人にだけ見える）・消す・名前を消す
// パスワードは config.php の admin_pass。ブラウザで https://（ドメイン）/mugen-rank/admin.php を開く
session_start();
header('Content-Type: text/html; charset=utf-8');
header('X-Frame-Options: DENY');
header('Cache-Control: no-store');
$cfg = require __DIR__ . '/config.php';
date_default_timezone_set($cfg['tz'] ?? 'Asia/Tokyo');
$h = fn($v) => htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8');
$pass = (string)($cfg['admin_pass'] ?? '');
if ($pass === '' || strlen($pass) < 10) exit('config.php に admin_pass（10文字以上）を入れてください');

if (isset($_POST['logout'])) { $_SESSION = []; session_destroy(); header('Location: admin.php'); exit; }
if (isset($_POST['pw'])) {
  if (hash_equals($pass, (string)$_POST['pw'])) { session_regenerate_id(true); $_SESSION['ok'] = 1; $_SESSION['csrf'] = bin2hex(random_bytes(16)); header('Location: admin.php'); exit; }
  sleep(2); $err = 'パスワードが違います';
}
if (empty($_SESSION['ok'])) {
  echo '<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><title>ランキング管理</title><body style="font-family:sans-serif;max-width:420px;margin:40px auto;padding:0 16px">';
  echo '<h2>ランキング管理</h2>' . (isset($err) ? '<p style="color:#c00">' . $h($err) . '</p>' : '');
  echo '<form method="post"><input type="password" name="pw" placeholder="パスワード" style="width:100%;padding:10px;font-size:16px"><button style="margin-top:10px;padding:10px 20px;font-size:16px">ログイン</button></form>';
  exit;
}

if (($cfg['driver'] ?? 'mysql') === 'sqlite') $db = new PDO('sqlite:' . $cfg['sqlite_path']);
else $db = new PDO("mysql:host={$cfg['host']};dbname={$cfg['dbname']};charset=utf8mb4", $cfg['user'], $cfg['pass']);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

$FIELDS = ['fb' => '📝 ご意見', 'st' => 'ベストステージ', 'co' => 'MAXコイン', 'ki' => 'MAXキル数', 'dp' => 'MAX DPS', 'ev' => 'MAX一撃進化', 'rf' => 'MAX反射倍率', 'daily' => '本日のクリア数'];
$mode = isset($FIELDS[$_GET['m'] ?? '']) ? $_GET['m'] : 'st';
$day = preg_match('/^\d{4}-\d{2}-\d{2}$/', $_GET['day'] ?? '') ? $_GET['day'] : date('Y-m-d');
$q = trim((string)($_GET['q'] ?? ''));
$cc = preg_match('/^[A-Z]{2}$/', $_GET['cc'] ?? '') ? $_GET['cc'] : '';
$onlyFlag = !empty($_GET['flag']);
$back = 'admin.php?' . http_build_query(['m' => $mode, 'day' => $day, 'q' => $q] + ($onlyFlag ? ['flag' => 1] : []) + ($cc ? ['cc' => $cc] : []));

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['act'])) { // 操作（止める・戻す・消す・名前を消す）
  if (!hash_equals($_SESSION['csrf'] ?? '', (string)($_POST['csrf'] ?? ''))) exit('もう一度開き直してください');
  $id = (string)($_POST['id'] ?? ''); if (!in_array($_POST['act'], ['fbdone', 'fbdel'], true) && !preg_match('/^[0-9a-f]{32}$/', $id)) exit('id が変です');
  switch ($_POST['act']) {
    case 'ban':   $db->prepare('UPDATE players SET ban = 1 WHERE id = ?')->execute([$id]); break;
    case 'shadow': $db->prepare('UPDATE players SET ban = 2 WHERE id = ?')->execute([$id]); break;
    case 'unban': $db->prepare('UPDATE players SET ban = 0 WHERE id = ?')->execute([$id]); break;
    case 'ok':    $db->prepare("UPDATE players SET flag = '' WHERE id = ?")->execute([$id]); break; // 要確認を消す（問題なしと確かめた）
    case 'name':  $db->prepare("UPDATE players SET n = '名無しの勇者' WHERE id = ?")->execute([$id]); $db->prepare("UPDATE daily SET n = '名無しの勇者' WHERE id = ?")->execute([$id]); break;
    case 'fbdone': $db->prepare('UPDATE feedback SET done = 1 - done WHERE fid = ?')->execute([(int)($_POST['fid'] ?? 0)]); break;
    case 'fbdel':  $db->prepare('DELETE FROM feedback WHERE fid = ?')->execute([(int)($_POST['fid'] ?? 0)]); break;
    case 'del':   $db->prepare('DELETE FROM daily WHERE id = ?')->execute([$id]); $db->prepare('DELETE FROM players WHERE id = ?')->execute([$id]); break;
  }
  header('Location: ' . $back); exit;
}

$fbRows = [];
if ($mode === 'fb') { // ご意見の一覧（新しい順）
  $fq = $q !== '' ? ' WHERE f.text LIKE ?' : ''; $st = $db->prepare("SELECT f.*, p.n FROM feedback f LEFT JOIN players p ON p.id = f.id$fq ORDER BY f.fid DESC LIMIT 300"); $st->execute($q !== '' ? ['%' . $q . '%'] : []);
  $fbRows = $st->fetchAll();
}
$where = ($q !== '' ? ' AND p.n LIKE ?' : '') . ($onlyFlag ? " AND p.flag <> ''" : '') . ($cc ? ' AND p.cc = ?' : ''); $args = array_merge($q !== '' ? ['%' . $q . '%'] : [], $cc ? [$cc] : []);
if ($mode === 'fb') { $rows = []; }
elseif ($mode === 'daily') {
  $st = $db->prepare("SELECT p.id, d.n, d.c AS score, p.ver, d.at, p.created, p.ban, p.flag, p.cc, p.tz, p.lc FROM daily d JOIN players p ON p.id = d.id WHERE d.day = ?$where ORDER BY d.c DESC LIMIT 200");
  $st->execute(array_merge([$day], $args));
} else {
  $st = $db->prepare("SELECT p.id, p.n, p.$mode AS score, p.ver, p.at, p.created, p.ban, p.flag, p.cc, p.tz, p.lc FROM players p WHERE 1 = 1$where ORDER BY p.$mode DESC LIMIT 200");
  $st->execute($args);
}
$rows = $st->fetchAll();
$total = (int)$db->query('SELECT COUNT(*) AS k FROM players')->fetch()['k'];
$banned = (int)$db->query('SELECT COUNT(*) AS k FROM players WHERE ban = 1')->fetch()['k'];
$shadow = (int)$db->query('SELECT COUNT(*) AS k FROM players WHERE ban = 2')->fetch()['k'];
$flagged = (int)$db->query("SELECT COUNT(*) AS k FROM players WHERE flag <> ''")->fetch()['k'];
$byCountry = $db->query("SELECT cc, COUNT(*) AS k FROM players WHERE ban <> 1 GROUP BY cc ORDER BY k DESC LIMIT 30")->fetchAll();
// 国コード → 国旗と日本語の国名（PHP の intl があれば国名はそれで、なければコードのまま）
$ccFlag = fn($c) => preg_match('/^[A-Z]{2}$/', (string)$c) ? mb_chr(0x1F1E6 + ord($c[0]) - 65) . mb_chr(0x1F1E6 + ord($c[1]) - 65) : '❔';
$ccName = function ($c) { if (!preg_match('/^[A-Z]{2}$/', (string)$c)) return '不明'; if (class_exists('Locale')) { $n = Locale::getDisplayRegion('-' . $c, 'ja'); if ($n && $n !== $c) return $n; } return $c; };
$BAN = [0 => '', 1 => '（停止中）', 2 => '（シャドウバン中）'];
$fmt = function ($v) { $v = (float)$v; if ($v >= 1e15) return sprintf('%.3e', $v); return number_format($v, $v == floor($v) ? 0 : 2); };
$btn = fn($id, $act, $label, $confirm) => '<form method="post" style="display:inline" onsubmit="return confirm(\'' . $confirm . '\')"><input type="hidden" name="csrf" value="' . $_SESSION['csrf'] . '"><input type="hidden" name="id" value="' . $id . '"><input type="hidden" name="act" value="' . $act . '"><button>' . $label . '</button></form>';
?><!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><title>ランキング管理</title>
<style>body{font-family:sans-serif;margin:16px}table{border-collapse:collapse;width:100%;font-size:13px}td,th{border-bottom:1px solid #ddd;padding:5px 6px;text-align:left;white-space:nowrap}tr.ban{background:#fde2e2;color:#999}tr.shadow{background:#ece4fb;color:#777}td.n{white-space:normal;max-width:220px;word-break:break-all}.top a{margin-right:8px}button{font-size:12px}form.f{margin:10px 0}</style>
<form method="post" style="float:right"><button name="logout" value="1">ログアウト</button></form>
<h2>ランキング管理</h2>
<p>登録 <?= number_format($total) ?> 人（止めている人 <?= number_format($banned) ?> 人・シャドウバン <?= number_format($shadow) ?> 人）　<a href="?<?= $h(http_build_query(['m' => $mode, 'day' => $day, 'flag' => 1])) ?>" style="color:#c60">⚠ 要確認 <?= number_format($flagged) ?> 人</a></p>
<p style="font-size:12px;color:#666">止める：一覧から消し、記録も受け付けない ／ シャドウバン：記録は受け付けて本人には今までどおり見えるが、ほかの人の一覧・人数には出さない</p>
<p style="font-size:13px">国別：<?php foreach ($byCountry as $b) echo '<a href="?' . $h(http_build_query(['m' => $mode, 'day' => $day, 'cc' => $b['cc']])) . '" style="margin-right:10px' . ($cc === $b['cc'] ? ';font-weight:bold' : '') . '">' . $ccFlag($b['cc']) . ' ' . $h($ccName($b['cc'])) . ' ' . number_format($b['k']) . '人</a>'; if ($cc) echo ' <a href="?' . $h(http_build_query(['m' => $mode, 'day' => $day])) . '">（すべての国）</a>'; ?></p>
<div class="top"><?php foreach ($FIELDS as $k => $v) echo '<a href="?' . $h(http_build_query(['m' => $k, 'day' => $day, 'q' => $q])) . '"' . ($k === $mode ? ' style="font-weight:bold"' : '') . '>' . $h($v) . '</a>'; ?></div>
<form class="f" method="get"><input type="hidden" name="m" value="<?= $h($mode) ?>"><?php if ($cc): ?><input type="hidden" name="cc" value="<?= $h($cc) ?>"><?php endif; ?><?php if ($mode === 'daily'): ?><input type="date" name="day" value="<?= $h($day) ?>"> <?php endif; ?><input name="q" value="<?= $h($q) ?>" placeholder="名前で探す"> <label><input type="checkbox" name="flag" value="1"<?= $onlyFlag ? ' checked' : '' ?>>要確認だけ</label> <button>表示</button></form>
<?php if ($mode === 'fb'): $fbBtn = fn($fid, $act, $label, $confirm) => '<form method="post" style="display:inline" onsubmit="return confirm(\'' . $confirm . '\')"><input type="hidden" name="csrf" value="' . $_SESSION['csrf'] . '"><input type="hidden" name="fid" value="' . (int)$fid . '"><input type="hidden" name="act" value="' . $act . '"><button>' . $label . '</button></form>'; ?>
<p style="font-size:12px;color:#666">レビューの「ちょっと不満がある…」から届いたご意見（新しい順・最大300件）。検索欄で本文を探せます</p>
<table><tr><th>日時</th><th>名前</th><th>ご意見</th><th>版</th><th>端末</th><th>ステージ（最高）</th><th>転生</th><th>地域</th><th></th></tr>
<?php foreach ($fbRows as $f): ?>
<tr style="<?= $f['done'] ? 'color:#aaa' : '' ?>"><td><?= date('m/d H:i', (int)$f['at']) ?></td><td class="n"><?= $h($f['n'] ?? '（未登録）') ?></td><td class="n" style="max-width:420px;white-space:pre-wrap"><?= $h($f['text']) ?></td><td><?= $h($f['ver']) ?></td><td><?= $h($f['platform']) ?></td>
<td><?= $h($fmt($f['stage'])) ?>（<?= $h($fmt($f['best'])) ?>）</td><td><?= $h($fmt($f['reb'])) ?></td><td><?= $h($f['tz'] ?: $f['lc']) ?></td>
<td><?= $fbBtn($f['fid'], 'fbdone', $f['done'] ? '未読に戻す' : '確認済み', $f['done'] ? '未読に戻しますか？' : '確認済みにしますか？') ?> <?= $fbBtn($f['fid'], 'fbdel', '消す', 'このご意見を消しますか？') ?></td></tr>
<?php endforeach; ?>
</table>
<?php else: ?>
<table><tr><th>#</th><th>名前</th><th>国</th><th>記録</th><th>版</th><th>最後の書き込み</th><th>登録</th><th>id</th><th>要確認</th><th></th></tr>
<?php foreach ($rows as $i => $r): ?>
<tr class="<?= ['', 'ban', 'shadow'][(int)$r['ban']] ?? '' ?>"><td><?= $i + 1 ?></td><td class="n"><?= $h($r['n']) ?><?= $BAN[(int)$r['ban']] ?? '' ?></td><td title="<?= $h(($r['tz'] ?? '') . ' ' . ($r['lc'] ?? '')) ?>"><?= $ccFlag($r['cc'] ?? '') ?> <?= $h($ccName($r['cc'] ?? '')) ?></td><td><?= $h($fmt($r['score'])) ?></td><td><?= $h($r['ver']) ?></td>
<td><?= $r['at'] ? date('m/d H:i', (int)$r['at']) : '' ?></td><td><?= $r['created'] ? date('Y/m/d', (int)$r['created']) : '' ?></td><td><?= $h(substr($r['id'], 0, 12)) ?></td><td class="n" style="color:#c60;font-size:11px"><?= $h($r['flag'] ?? '') ?><?= ($r['flag'] ?? '') !== '' ? ' ' . $btn($r['id'], 'ok', '確認済み', '要確認の印を消しますか？') : '' ?></td>
<td><?= $r['ban'] ? $btn($r['id'], 'unban', '戻す', 'この人を一覧に戻しますか？') : $btn($r['id'], 'shadow', 'シャドウバン', 'シャドウバンしますか？（本人には今までどおり見えますが、ほかの人からは見えなくなります）') . ' ' . $btn($r['id'], 'ban', '止める', 'この人を止めますか？（一覧から消え、記録も送れなくなります）') ?>
<?= $btn($r['id'], 'name', '名前を消す', '名前を「名無しの勇者」にしますか？') ?> <?= $btn($r['id'], 'del', '消す', 'この人の記録をすべて消しますか？（元に戻せません）') ?></td></tr>
<?php endforeach; ?>
</table>
<?php endif; ?>
