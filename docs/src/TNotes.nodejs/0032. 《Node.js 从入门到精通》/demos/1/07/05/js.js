// 引入模块
var fs = require("fs");
console.log("准备删除文件！");
fs.unlink('poems.txt', function (err) {
    if (err) {
        console.error(err);
    }
    console.log("文件删除成功！");
});
