// 引入模块
var http = require('http');
var pug = require('pug');
var fs = require('fs');
// 创建服务器
http.createServer(function (request, response) {
    // 读取pug文件
    fs.readFile('index.pug', 'utf8', function (error, data) {
        // 调用compile方法
        var fn = pug.compile(data);
        // 向客户端返回信息
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(fn({
            month: '2023年6月',
            out:"520.10",
            in1:3370.34,
            transport:"120.00",
            shopping:"300.00",
            medical:87.10,
            other: "13.00"
        }));
    });
}).listen(52273, function () {
    console.log('服务器监听地址是 http://127.0.0.1:52273');
});