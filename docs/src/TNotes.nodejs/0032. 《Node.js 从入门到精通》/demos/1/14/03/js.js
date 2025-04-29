
var express = require('express');
// 创建服务器
var app = express();
// 使用static中间件
app.use(express.static(__dirname + '/image'));
app.use(function (request, response) {
    // 响应信息
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end('<img src="/view.jpg" width="100%" />');
});
// 启动服务器
app.listen(52273, function () {
    console.log('服务器地址在 http://127.0.0.1:52273');
});
