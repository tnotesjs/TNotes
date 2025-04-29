// 引入模块
var http = require('http');
var fs = require('fs');
// 创建服务器
http.createServer(function (request, response) {
    if (request.method == 'GET') {
        // GET请求
        fs.readFile('login.html', function (error, data) {
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end(data);
        });
    } else if (request.method == 'POST') {
        // POST请求
        request.on('data', function (data) {
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end('<h1>' + data + '</h1>');
        });
    }
}).listen(52273, function () {
    console.log('服务器监听地址是 http://127.0.0.1:52273');
});