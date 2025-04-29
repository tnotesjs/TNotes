// 引入events模块
var events = require('events');
// 生成EventEmitter对象
var custom = new events.EventEmitter();
function onUncaughtException(error) {
    // 输出异常内容
    console.log('发生异常，请多加小心 !');
}
// 添加监听事件event
custom.once('event', onUncaughtException);
// 主动触发监听事件event
setInterval(function () {
    custom.emit('event');
    }, 1000);