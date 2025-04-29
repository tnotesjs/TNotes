// 求绝对值的方法abs
exports.abs = function (number) {
    if (0 < number) {
        return number;
    } else {
        return -number;
    }
};
// 求圆周长的方法circleArea
exports.circleArea = function (radius) {
    return radius * radius * Math.PI;
};
