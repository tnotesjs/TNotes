
var fs = require("fs")
fs.copyFile("poems.txt", "poems1.txt", function (err) {
    if (err) {
        console.log("复制文件失败")     //提示复制失败
        console.log(err)               // 显示错误信息
    }
    else {
        console.log("复制文件成功")    //提示复制成功
    }
})























