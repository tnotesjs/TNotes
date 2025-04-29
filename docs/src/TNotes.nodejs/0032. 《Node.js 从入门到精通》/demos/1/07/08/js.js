
var fs = require("fs")
//检查demo文件夹是否存在
fs.access("demo", fs.constants.F_OK, function (err) {
    if (err) {              //如果不存在，则创建demo文件夹，反之则继续下一步
        fs.mkdir("demo", function (err) {
            if(err)
                console.log("糟糕，创建文件夹时出错了")
        })
    }
    //读取b.txt文件，该文件中保存了要批量创建的文件的名称
    var data = fs.readFileSync("b.txt", "utf8").split("\r")
    //逐个创建文件
    for (var i = 0; i < data.length; i++) {
        var title = data[i].replace("\n", "")    //去掉读取到的内容中的换行符
        fs.writeFile("demo\\" + title + ".txt", "", function (err) {
            if(err)
                console.log("创建文件失败")
        })
    }
})


