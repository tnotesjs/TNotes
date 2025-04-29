
var path = require("path")
var fs = require('fs');
var text = "media文件夹中的图片有"
fs.readdir('media', function (err, files) {      //读取media文件夹中的所有文件
    if (err) console.log('读取目录操作失败。');    //读取错误时的返回内容
    else {
        for (var i = 0; i < files.length; i++) {       //通过for循环遍历每文件夹中的文件
            if (path.extname(files[i]) == ".jpg" || path.extname(files[i]) == ".png") {    //判断文件的扩展名
                text += path.basename(files[i]) + "、"
            }
        }
        console.log(text)     // 输出结果
    }
});
