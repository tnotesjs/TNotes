// 引入模块
var http = require('http');
var pug = require('pug');
var fs = require('fs');
// 创建服务器
http.createServer(function (request, response) {
    // 读取pug文件
    fs.readFile('index.pug', 'utf8', function (error, data) {
        // 调用pug模块的compile方法
        var fn = pug.compile(data);
        // 返回给客户端信息
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(fn());
    });
}).listen(52273, function () {
    console.log('服务器监听地址是 http://127.0.0.1:52273');
});