const util=require("util")
function Person() {
    this.name = '老张';
    this.age=60;
    this.showName = function() {
        return this.name;
    };
}
var man = new Person();
console.log(util.inspect(man));
console.log(util.inspect(man, true));
