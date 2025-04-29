// 引入模块
var fs = require('fs');
var http = require('http');

// 创建服务器
http.createServer(function (request, response) {
    // 读取html文件内容
    fs.readFile('index.html', function (error, data) {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(data);
    });
}).listen(52273, function () {
    console.log('服务器监听地址是 http://127.0.0.1:52273');
});