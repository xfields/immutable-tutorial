import { Map } from 'immutable'

const map = Map({a: 1})
map.get('a')                      // 1
const newMap = map.set('a', 2)    // {a: 2}

map.size                         // Object.keys().length
Map.isMap({})                    // false

delete(key)                     // 删除
deleteAll([key1, key2])         // 删除指定key

merge(anotherMap)               // 合并
mergeDeep(anotherMap)

find((v, k) => {})              // 查找value
keyOf(value)                    // 查找value对应的key

