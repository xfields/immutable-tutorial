const emptyList = Immutable.List()
const list1 = emptyList.push(1)

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