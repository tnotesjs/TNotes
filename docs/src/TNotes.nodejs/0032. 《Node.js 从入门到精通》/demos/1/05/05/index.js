// 引入events模块
var events = require('events');
// 生成EventEmitter对象
var custom = new events.EventEmitter();
// 添加监听事件event
custom.on('event', function listener1(arg) {
    console.log(`第 1 个监听器中的事件有参数 ${arg}`);
});
// 添加监听事件event
custom.on('event', function listener1(...args) {
    parameters = args.join(', '); //连接参数
    console.log(`第 2 个监听器中的事件有参数 ${parameters}`);
});
// 主动触发监听事件event
custom.emit('event', 1, '明日','年龄：30','爱好：编程');