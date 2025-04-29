// 引入express模块
var express = require('express');

// 创建服务器
var app = express();

// 监听请求与响应
app.use(function (request, response) {
    // 创建数据
    var output = [];
    for (var i = 0; i < 3; i++) {
        output.push({
            count: i,
            name: 'name - ' + i
        });
    }
    // 响应信息
    response.send(output);
});

// 启动服务器
app.listen(52273, function () {
    console.log('服务器监听地址在 http://127.0.0.1:52273');
});