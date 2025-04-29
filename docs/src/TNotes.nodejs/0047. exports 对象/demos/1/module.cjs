// 求绝对值的方法 abs
exports.abs = function (number) {
  if (0 < number) {
    return number
  } else {
    return -number
  }
}
// 求圆面积的方法 circleArea
exports.circleArea = function (radius) {
  return radius * radius * Math.PI
}
