var util = require('util');
function par() {
    this.name = '老张';
    this.age = 60;
    this.say = function () {
        console.log(this.name + "今年" + this.age + "岁");
    };
}
par.prototype.showName = function () {
    console.log("我是" + this.name);
};
function ch() {
    this.name = '小张';
}
util.inherits(ch, par);
var objBase = new par();
objBase.showName();
objBase.say();
console.log(objBase);
var objSub = new ch();
objSub.showName();
console.log(objSub);

