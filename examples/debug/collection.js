const col = Immutable.Collection([1,2,3])
console.log(col.hashCode())
const v1 = col.get(1)
const col2 = col.reverse()
console.log(col2.hashCode())
console.log(col2.get(1))

const sum = col2.update((collection) => {
  return collection.reduce((sum, x) => sum + x, 0)
})
console.log(sum)

const col3 = col.concat(4)
const col4 = col2.concat(-1)
