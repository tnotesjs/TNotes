// 引入模块.
var socketio = require('socket.io');
var express = require('express');
var http = require('http');
var fs = require('fs');

// 声明变量
var seats = [
    [1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
];

// 创建web服务.
var app = express();
var server = http.createServer(app);

// 创建路由
app.get('/', function (request, response, next) {
    fs.readFile('HTMLPage.html', function (error, data) {
        response.send(data.toString());
    });
});
app.use(express.static('./'));
app.get('/seats', function (request, response, next) {
    response.send(seats);
});

// 启动服务器
server.listen(52273, function () {
    console.log('Server Running at http://127.0.0.1:52273');
});

// 创建socket对象
var io = socketio(server);
io.sockets.on('connection', function (socket) {
    socket.on('reserve', function (data) {
        seats[data.y][data.x] = 2;
        io.sockets.emit('reserve', data);
    });
});
