const util=require("util")
function Person() {
    this.name = '老张';
    this.age=60;
    this.showName = function() {
        return this.name;
    };
}
var man = new Person();
console.log(util.format("%d+%d=%d",50,70,50+70))
console.log(util.format("整数：%i",26.01))
console.log(util.format("小数：%f","26.01"))
console.log(util.format("百分数：%d%%","26"))
console.log(util.format("对象格式化为JSON：%j",man))
