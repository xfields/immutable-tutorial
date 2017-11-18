const emptyList = Immutable.List()
// const list1 = emptyList.push(1)

const array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
array.map(v => {
  console.log('原生 Array 执行')
  return v * 2
})

const list = Immutable.Seq(array).map(v => {
  console.log('Immutable List 执行:', v)
  return v * 2
})

// const listItem = list.get(3)
const map = Immutable.Map({
  a: 1,
  b: {
    b1: 1,
    b2: 2
  }
})

console.log(map.size)

const list1 = Immutable.List([0])
const list2 = list1.push(1)
console.log(list1.toJS())          // [0]
console.log(list2.toJS())          // [0, 1]


const state = Immutable.Map({
  entities: {
    key: {
      key1: 'value1',
      key2: []
    }
  }
})

const entities = state.get('entities')
entities.key.key2.push(2)
const newState = state.set('entities', entities)
console.log(newState.toJS())