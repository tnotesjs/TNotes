// 引入模块
var http = require('http');
var fs = require('fs');
var socketio = require('socket.io');
// 创建Web服务器
var server = http.createServer(function (request, response) {
    // 读取HTMLPage.html
    fs.readFile('index.html', function (error, data) {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.end(data);
    });
}).listen(52273, function () {
    console.log('服务器监听地址在 http://127.0.0.1:52273');
});
// 创建WebSocket服务器
var io = socketio(server);
io.sockets.on('connection', function (socket) {
    // 监听客户端的事件clientData
    socket.on('receiveData', function (data) {
        // public通信类型
        console.log("客户端的消息："+data)
        io.sockets.emit('serverData', data);   //发送消息
    });
});
