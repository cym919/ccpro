<?php
$file_path = __DIR__ . 'gonggao.servertxt';

// 检查文件是否存在
if (!file_exists($file_path)) {
    http_response_code(404);
    header('Content-Type: application/json');
    echo json_encode(['code' => 404, 'msg' => '公告文件不存在']);
    exit;
}

// 输出文件内容
header('Content-Type: text/plain');
readfile($file_path);
?>