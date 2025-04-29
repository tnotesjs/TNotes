
var path = require("path");
//数组中的第一个路径为程序入口文件
pathList = ["D:\\mydiro\\index.ejs",
    "..\\images\\a.png",
    "D:\\mydiro\\images\\b.jpg",
    "D:\\mydiro\\js\\bootstrap.min.js",
    "..\\js\\main.js",
    "D:\\mydiro\\css\\bootstrap.min.css",
    "..\\css\\main.css"
]
var text1="所有路径如下："
var text2=""
for (var i = 0; i < pathList.length; i++) {
    text1 += pathList[i] + "\t";
    if (path.isAbsolute(pathList[i])) {
        text2 += pathList[i] + " 为绝对路径，将其转换为相对路径为：" + path.relative(pathList[0], pathList[i]) + "\n"
    }
}
console.log(text1 + "\n")
console.log(text2)
