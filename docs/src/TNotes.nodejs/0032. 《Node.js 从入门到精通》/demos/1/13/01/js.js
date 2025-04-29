// 引入模块
var http = require('http');
var fs = require('fs');
var ejs = require('ejs');
// 创建服务器
http.createServer(function (request, response) {
    // 读取ejs模板文件
    response.writeHead(200, {'Content-Type': 'text/html'});
    ejs.renderFile('index.ejs', 'utf8', function (error, data) {
        response.end(data);
    });
}).listen(52273, function () {
    console.log('服务器监听端口是 http://127.0.0.1:52273');
});
