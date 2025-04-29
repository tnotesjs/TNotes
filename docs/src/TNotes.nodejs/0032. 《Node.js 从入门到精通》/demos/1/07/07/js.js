
fs = require("fs")
//读取demo文件夹中的文件名
fs.readdir("demo", (err,files) =>  {
    for (var i = 0; i < files.length; i++) {    //遍历文件夹中的文件
        fl="demo\\" + files[i]  //记录要重命名的文件名（包括路径）
        //读取文件，并将文件中的内容以换行符进行分割存储到数组中
        var data = fs.readFileSync(fl, "utf8").split("\n")
        //获取文件中第一行内容并去掉所有空白字符（包括空格和换行符等）
        var title = data[0].replace(/\s*/g, '')
        fs.rename(fl, "demo\\" + title + ".txt",function (err) {
            // if(err)
            //     console.error(err.message)
        })// 重命名文件
    }
})



