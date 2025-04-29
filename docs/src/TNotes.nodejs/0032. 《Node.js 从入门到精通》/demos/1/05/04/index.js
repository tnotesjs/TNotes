// 引入events模块
var events = require('events');
// 生成EventEmitter对象
var custom = new events.EventEmitter();
// 添加监听事件event
custom.on('event', function listener() {
    console.log('触发监听事件！');
});
// 主动触发监听事件event
custom.emit('event');