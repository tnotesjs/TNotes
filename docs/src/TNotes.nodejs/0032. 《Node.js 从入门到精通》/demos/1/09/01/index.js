function  fooA() {
    return 1
}
function  fooB(a) {
    return 2 + a
}
//fooA是个函数，但它又作为一个参数在fooB函数中被调用
c = fooB(fooA())
console.log(c)
