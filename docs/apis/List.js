import { List } from 'immutable'

const list = List([0])
list.get(0)       // 0
list.set(1, 1)    // [0, 1]

List.size         // array.length
List.of(1, 2, 3)  // [1, 2, 3]
List.isList([])   // false

// 与Array同类操作
forEach, map, every, some, indexOf,
includes, push/pop, shift/unshift...

// 特殊操作
delete, insert, clear, max...
