// 引入模块
var http = require('http');
var fs = require('fs');
var socketio = require('socket.io');

// 创建web服务器
var server = http.createServer(function (request, response) {
  // 读取文件
  fs.readFile('HTMLPage.html', function (error, data) {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end(data);
  });
}).listen(52273, function () {
  console.log('Server Running at http://127.0.0.1:52273');
});

// 创建WebSocket
var io = socketio(server);
io.sockets.on('connection', function (socket) {
  // 监听事件
  socket.on('message', function (data) {
    // 发送事件
    io.sockets.emit('message', data);
  });
});