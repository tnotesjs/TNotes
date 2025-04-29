const path = require('path')

console.log(
  path.win32.resolve(
    path.format({
      root: 'C:\\',
      dir: 'D:\\demo\\images',
      base: 'a.png',
      name: 'b',
      ext: '.jpg',
    })
  )
) // => D:\demo\images\a.png

console.log(
  path.win32.resolve(
    path.format({
      dir: 'D:\\demo\\images',
      base: 'a.png',
    })
  )
) // => D:\demo\images\a.png

console.log(
  path.format({
    root: 'C:\\',
    name: 'a',
    ext: '.png',
  })
) // => C:\a.png

// 优先级：
// dir 属性高于 root 属性，所以同时出现 dir 属性和 root 属性时，忽略 root 属性。
// base 属性高于 name 属性和 ext 属性，所以当 base 属性出现时，忽略 name 属性和 ext 属性。
