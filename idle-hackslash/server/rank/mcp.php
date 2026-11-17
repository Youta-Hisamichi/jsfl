<?php
// Claude（claude.ai）のコネクタ用の窓口（MCP サーバー・Streamable HTTP）。
// Claude のプレビュー（アーティファクト）は外のサーバーへ直接つなげないので、コネクタ経由でランキングを読み書きする。
// 中身は api.php と同じ（このファイルは api.php を読み込んで使うだけ）。読む rank_read と書く rank_write の2つの道具がある。
// claude.ai の 設定 → コネクタ → カスタムコネクタを追加 で、名前「Mugen Ranking」・URL「https://（ドメイン）/mugen-rank/mcp.php」を登録する。
define('RANK_LIB', 1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method !== 'POST') { http_response_code(405); header('Allow: POST'); echo json_encode(['error' => 'POST only']); exit; }

$req = json_decode(file_get_contents('php://input', false, null, 0, 65536), true);
$reply = function ($id, $result = null, $err = null) {
  echo json_encode(['jsonrpc' => '2.0', 'id' => $id] + ($err ? ['error' => $err] : ['result' => $result]), JSON_UNESCAPED_UNICODE); exit;
};
if (!is_array($req) || ($req['jsonrpc'] ?? '') !== '2.0' || !isset($req['method'])) { http_response_code(400); $reply(null, null, ['code' => -32600, 'message' => 'Invalid Request']); }
$id = $req['id'] ?? null; $m = $req['method']; $p = $req['params'] ?? [];
if (!array_key_exists('id', $req)) { http_response_code(202); exit; } // お知らせ（notifications/initialized など）は返事なし

const READ_ACTIONS = ['top', 'dtop', 'above', 'near', 'count'];
const WRITE_ACTIONS = ['put', 'dput', 'fb'];

// api.php を1回だけ動かして、その結果（配列）を返す
function rank_call($http, $a, $get, $body) {
  $_SERVER['REQUEST_METHOD'] = $http;
  $_GET = array_map('strval', array_filter((array)$get, fn($v) => is_scalar($v))) + ['a' => $a];
  $_GET['a'] = $a; unset($_GET['s']); // 署名はなし（パソコン版と同じ扱い）
  $GLOBALS['RANK_RAW'] = $body === null ? '' : json_encode($body, JSON_UNESCAPED_UNICODE);
  try { (function () { require __DIR__ . '/api.php'; })(); }
  catch (RankOut $o) { return [$o->data, $o->status]; }
  return [['ok' => false, 'error' => 'no result'], 500];
}

switch ($m) {
  case 'initialize':
    $reply($id, [
      'protocolVersion' => is_string($p['protocolVersion'] ?? null) ? $p['protocolVersion'] : '2025-06-18',
      'capabilities' => ['tools' => ['listChanged' => false]],
      'serverInfo' => ['name' => 'mugen-ranking', 'version' => '1.0.0'],
      'instructions' => '放置系ハクスラ無限反射のランキングを読み書きする窓口です。',
    ]);
  case 'ping': $reply($id, (object)[]);
  case 'tools/list':
    $reply($id, ['tools' => [
      ['name' => 'rank_read', 'title' => 'ランキングを読む',
       'description' => '無限反射のランキングを読む。a: top（ベスト記録の上位。f=st|co|ki|ev|rf|dp, n, me）, dtop（本日のクリア数の上位。day=YYYY-MM-DD, n, me）, above（自分より上の人数。f と v、または day と v, me）, near（すぐ上・すぐ下。day, c, me）, count（総ユーザー数）。params に api.php と同じ問い合わせを入れる。',
       'inputSchema' => ['type' => 'object', 'properties' => ['a' => ['type' => 'string', 'enum' => READ_ACTIONS], 'params' => ['type' => 'object', 'additionalProperties' => true]], 'required' => ['a']],
       'annotations' => ['readOnlyHint' => true]],
      ['name' => 'rank_write', 'title' => 'ランキングに記録を送る',
       'description' => '無限反射のランキングに自分の記録を送る。a: put（ベスト記録。body: id, key, n, st, co, ki, ev, rf, dp, gm, rb, ver, tz, lc, ts）, dput（本日のクリア数。body: id, key, n, day, c, ts）, fb（ご意見。body: id, text, ver, platform, stage, best, reb, tz, lc, ts）。',
       'inputSchema' => ['type' => 'object', 'properties' => ['a' => ['type' => 'string', 'enum' => WRITE_ACTIONS], 'body' => ['type' => 'object', 'additionalProperties' => true]], 'required' => ['a', 'body']],
       'annotations' => ['readOnlyHint' => false, 'destructiveHint' => false]],
    ]]);
  case 'tools/call':
    $name = $p['name'] ?? ''; $args = (array)($p['arguments'] ?? []); $a = (string)($args['a'] ?? '');
    if ($name === 'rank_read' && in_array($a, READ_ACTIONS, true)) [$data, $st] = rank_call('GET', $a, $args['params'] ?? [], null);
    elseif ($name === 'rank_write' && in_array($a, WRITE_ACTIONS, true) && is_array($args['body'] ?? null)) [$data, $st] = rank_call('POST', $a, [], $args['body']);
    else $reply($id, null, ['code' => -32602, 'message' => 'unknown tool or action']);
    header('Content-Type: application/json; charset=utf-8'); http_response_code(200);
    $ok = is_array($data) && !empty($data['ok']);
    $reply($id, ['content' => [['type' => 'text', 'text' => json_encode($data, JSON_UNESCAPED_UNICODE)]], 'structuredContent' => $data, 'isError' => !$ok]);
  default:
    $reply($id, null, ['code' => -32601, 'message' => 'Method not found']);
}
