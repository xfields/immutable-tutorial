const list1 = Immutable.List([1, 2, 3])
const list2 = list1.push(4)

// 转换
let obj = { a: 1 }
const map = Immutable.fromJS(obj)
console.log(map.toJS()) // { a: 1 }

let arr = [1, 2, 3]
const list = Immutable.fromJS(arr)
console.log(list.toJS()) // [1, 2, 3]