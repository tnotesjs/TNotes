
var fs = require('fs');
fs.stat("poems.txt",function(err,stats){
    console.log("原文件大小为："+stats.size+"字节")
})
fs.truncate('poems.txt', 140, function (err) {
    if (err) console.log('对文件进行截断操作失败。');
    else {
        fs.stat('poems.txt', function (err, stats) {
            console.log('截断操作已完成\n文件大小为：' + stats.size + '字节。');
        });
    }
});
