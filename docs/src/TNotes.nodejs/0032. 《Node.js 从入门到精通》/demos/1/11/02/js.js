// 引入模块
var fs = require('fs');
var http = require('http');

// 创建服务器，监听52273端口
http.createServer(function (request, response) {
    // 读取图片文件
    fs.readFile('01.jpg', function (error, data) {
        response.writeHead(200, { 'Content-Type': 'image/jpeg' });
        response.end(data);
    });
}).listen(52273, function () {
    console.log('服务器监听位置是 http://127.0.0.1:52273');
});

// 创建服务器，监听52274端口
http.createServer(function (request, response) {
    // 读取视频文件
    fs.readFile('JavaScript.mp4', function (error, data) {
        response.writeHead(200, { 'Content-Type': 'audio/mp3' });
        response.end(data);
    });
}).listen(52274, function () {
    console.log('服务器监听位置是 http://127.0.0.1:52274');
});