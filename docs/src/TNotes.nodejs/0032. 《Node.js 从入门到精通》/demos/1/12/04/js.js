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
var list=[]
var io = socketio(server);
io.sockets.on('connection', function (socket) {
    list.push(socket.id)   //有客户端连接时，将其id保存到数组中
    socket.on("only",function(data){
        io.to(list[0]).emit("toOne", data)
        })
    socket.on("all",function(data){
        io.sockets.emit("toMany",data)
    })
})