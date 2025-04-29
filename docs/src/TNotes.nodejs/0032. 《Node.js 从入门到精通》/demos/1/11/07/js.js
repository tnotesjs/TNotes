
var path=require("path")
var pa1="E:"
var pa2="media"
var pa3="a.mp4"
var pa4="..\\07"

console.log(path.resolve(pa2,pa3))
console.log(path.resolve(pa1,pa2,pa3))
console.log(path.resolve(pa4,pa2,pa3))
