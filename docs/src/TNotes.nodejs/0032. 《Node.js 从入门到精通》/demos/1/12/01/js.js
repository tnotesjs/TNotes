// 引入模块
var http = require('http');
var fs = require('fs');

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
var io = require('socket.io');
io=io(server)
io.sockets.on('connection', function (socket) {
    console.log('客户端已连接！');
     //监听客户端的事件clientData
    socket.on('clientData', function (data) {
        // 输出客户端发来的数据
        console.log('客户端发来的数据是:', data);
        // 向客户端发送serverData事件和数据
        socket.emit('serverData', "谢谢，同乐同乐");
    });
});
