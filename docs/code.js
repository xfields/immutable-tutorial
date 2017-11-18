// 代码段

// 不可变的String
let str = 'abc'
let str2 = str.concat('d')
console.log(str)   // abc
console.log(str2)  // abcd

str.slice()
str.replace()
str.trim()
str.substr()
...

// 可变的Object
let obj = { a: 1 }
obj.b = 2 // {a: 1, b: 2}
let arr = [1, 2, 3]
arr.push(4) // [1, 2, 3, 4]

// 可变数据的问题
import func from 'somewhere'

let obj = { a: 1 }
func(obj)
console.log(obj)  // 输出什么？

let str = 'abc'
func(str)
console.log(str)  // 输出'abc'

// 场景2
let obj1 = obj
obj1.a = 2
console.log(obj.a)  // 2


// 如何使对象不可变
import cloneDeep from 'lodash/cloneDeep'

function operator (obj) {
  const newObj = cloneDeep(obj)
  newObj.xx = 'yy'
  ...
  return newObj
}

const obj = {a: 1, b: {c: 2}}
Object.freeze(obj)
const newObj = operator(obj)


let obj = {
  a: 1,
  b: { c: 2 }
}
Object.freeze(obj)
obj.a = 2        // {a: 1, b: {c: 2}}
obj.b.c = 3      // {a: 1, b: {c: 3}}

import cloneDeep from 'lodash/cloneDeep'
let obj = { a: 1 }
let obj1 = cloneDeep(obj)
obj1.a = 2
console.log(obj.a)  // 1

// Immutable.js
import Immutable from 'immutable'
// 对象
const map1 = Immutable.Map({ a: 1, b: 2, c: 3 })
const map2 = map1.set('b', 50)
map1.get('b') // 2
map2.get('b') // 50

// 数组
const list1 = Immutable.List([1, 2, 3])
const list2 = list1.push(4)
list1.size // 3
list2.size // 4

// 转换
let obj = { a: 1 }
const map = Immutable.fromJS(obj)
console.log(map.toJS()) // { a: 1 }

let arr = [1, 2, 3]
const list = Immutable.fromJS(arr)
console.log(list.toJS()) // [1, 2, 3]


import shallowEqual from 'fbjs/lib/shallowEqual'

shouldComponentUpdate(nextProps, nextState) {
  return !shallowEqual(this.props, nextProps) ||
    !shallowEqual(this.state, nextState);
}

props = {
  entities: {
    key: {
      key1: 'value1',
      key1: []
    }
  }
}

reducer (state, action) {
  const newState = {...state}
  newState.entites.key.key2.push(action.payload)
  return newState
}

reducer (state, action) {
  const entities = state.get('entities')
  entities.key.key2.push(action.payload)
  return state.set('entities', entities)
}