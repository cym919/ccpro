<?php
header('Content-Type: application/json');

// 检查请求方法
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['code' => 405, 'msg' => '仅支持POST请求']);
    exit;
}

// 检查必要参数
if (!isset($_POST['content']) || !isset($_POST['uc'])) {
    http_response_code(400);
    echo json_encode(['code' => 400, 'msg' => '缺少必要参数']);
    exit;
}

// 验证UC
$uc_file = __DIR__ . 'uc.servertxt';
if (!file_exists($uc_file)) {
    http_response_code(500);
    echo json_encode(['code' => 500, 'msg' => '验证文件不存在']);
    exit;
}

$correct_uc = trim(file_get_contents($uc_file));
if ($_POST['uc'] !== $correct_uc) {
    http_response_code(403);
    echo json_encode(['code' => 403, 'msg' => '无权限']);
    exit;
}

// 更新公告文件
$gonggao_file = __DIR__ . 'tips.servertxt';
$result = file_put_contents($gonggao_file, $_POST['content']);

if ($result === false) {
    http_response_code(500);
    echo json_encode(['code' => 500, 'msg' => '公告更新失败']);
} else {
    echo json_encode(['code' => 200, 'msg' => '公告更新成功']);
}
?>