// 引入模块
var fs = require('fs');
// 创建服务器
var server = require('http').createServer();
var io = require('socket.io')(server);
// 监听request事件
server.on('request', function (request, response) {
    // 读取客户端文件
    fs.readFile('index.html', function (error, data) {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.end(data);
    });
}).listen(52273, function () {
    console.log('服务器监听地址是 http://127.0.0.1:52273');
});

// 监听connection事件
io.sockets.on('connection', function (socket) {
    //list.push[socket.id]
    // 创建房间名称
    var roomName = null;
    // 监听join事件
    //监听客户端进入group1分组
    socket.on('group1', function (data) {
        socket.join('group1');
        io.sockets.in('group1').emit('welcome1', data);
    });
    //监听客户端进入group2分组
    socket.on('group2', function (data) {
        socket.join('group2');
        io.sockets.in('group2').emit('welcome2', data);
    });
//监听客户端离开group1分组
    socket.on('leavegroup1', function (data) {
        var roomName="group1"
        socket.leave(data.room);
        io.sockets.in('group1').emit('leave1', data);
    });
    //监听客户端离开group2分组
    socket.on('leavegroup2', function (data) {
        var roomName="group2"
        socket.leave(data.room);
        io.sockets.in('group2').emit('leave2', data);
    });
});


