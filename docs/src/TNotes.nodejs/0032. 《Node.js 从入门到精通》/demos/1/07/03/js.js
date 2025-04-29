
var fs = require("fs")
var path = "poems.txt"
var data = "\n古诗鉴赏：这首诗描写细腻、动人。诗的情节从概括的叙述到形象的描绘，由耳闻到目睹，当晚到次晨，结构谨严。用词讲究。颇为难写的夜雨景色，却写得十分耀眼突出，使人从字里行间。呼吸到一股令人喜悦的春天气息。"
fs.appendFile(path, data, function (err) {
    if (err) {
        console.log(err)
    }
    else {
        console.log("内容追加完成")
    }
})