const util = require('util')

console.log(
  `util.types.isBoxedPrimitive(new String('string')) =>`,
  util.types.isBoxedPrimitive(new String('string'))
)

console.log(
  `util.types.isBoxedPrimitive('string') =>`,
  util.types.isBoxedPrimitive('string')
)

console.log(
  `util.types.isAsyncFunction(async function () {}) =>`,
  util.types.isAsyncFunction(async function () {})
)

console.log(
  `util.types.isBooleanObject(new Boolean(false)) =>`,
  util.types.isBooleanObject(new Boolean(false))
)

console.log(`util.types.isDate(new Date()) =>`, util.types.isDate(new Date()))

console.log(
  `util.types.isNumberObject(new Number(8)) =>`,
  util.types.isNumberObject(new Number(8))
)

console.log(`util.types.isRegExp(/^w+$/) =>`, util.types.isRegExp(/^w+$/))

console.log(
  `util.types.isStringObject(new String('string')) =>`,
  util.types.isStringObject(new String('string'))
)

// 输出：
// util.types.isBoxedPrimitive(new String('string')) => true
// util.types.isBoxedPrimitive('string') => false
// util.types.isAsyncFunction(async function () {}) => true
// util.types.isBooleanObject(new Boolean(false)) => true
// util.types.isDate(new Date()) => true
// util.types.isNumberObject(new Number(8)) => true
// util.types.isRegExp(/^w+$/) => true
// util.types.isStringObject(new String('string')) => true
