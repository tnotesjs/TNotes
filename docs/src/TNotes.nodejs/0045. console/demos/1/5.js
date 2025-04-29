function test() {
  console.count('test called')
}

test()
test()
test()
test()
test()

// 输出：
// test called: 1
// test called: 2
// test called: 3
// test called: 4
// test called: 5
