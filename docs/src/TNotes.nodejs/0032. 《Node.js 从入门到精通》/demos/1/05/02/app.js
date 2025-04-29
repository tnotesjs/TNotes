// 引入rint模块
var rint = require('./rint.js');
// 添加监听事件
rint.timer.on('tick', function (code) {
    console.log(`执行第 ${code} 次监听事件`);
});
