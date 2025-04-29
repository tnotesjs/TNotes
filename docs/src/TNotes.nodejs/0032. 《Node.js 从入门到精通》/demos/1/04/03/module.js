function Hello() {
    var name;
    this.setName = function (thyName) {
        name = thyName;
    };
    this.sayHello = function () {
        console.log(name + '，你好');
    };
};
module.exports = Hello;
