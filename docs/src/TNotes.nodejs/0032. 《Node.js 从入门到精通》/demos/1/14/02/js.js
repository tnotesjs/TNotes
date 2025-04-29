// 引入express模块
var express = require('express');

// 创建服务器
var app = express();

// 监听请求和响应
app.use(function (request, response) {
    // 输出客户端的User-Agent
    var agent = request.header('User-Agent');

    // 判断客户端浏览器的类型
    if (agent.toLowerCase().match(/chrome/)) {
        // 响应信息
        response.send('<h1>*_*欢迎使用谷歌浏览器</h1>');
    } else {
        // 响应信息
        response.send('<h1>^_^您使用的不是谷歌浏览器，<br>当然这并不影响浏览网页</h1>');
    }
});

// 启动服务器
app.listen(52273, function () {
    console.log('服务器监听地址在 http://127.0.0.1:52273');
});