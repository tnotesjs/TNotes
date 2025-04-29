
var fs = require("fs")
//读取文件
fs.readFile("poems.txt", "utf8", function (err, data) {
    if (err) {
        console.log("读取文件失败")
        console.log(err)
    }
    else {
        console.log("读取文件成功")
        //写入文件
        fs.writeFile("poems1.txt", data, function (err) {
            if (err) {
                console.log("写入文件失败")
                console.log(err)
            }
            else {
                console.log("写入文件成功")
            }
        })

    }
})

























