const emptyList = Immutable.List()
let list = emptyList.push(0)
let i = 1
while(i < 1500) {
  list = list.push(i++)
}
console.log(list)

const v1024 = list.get(1024)
const list2 = list.set(1023, '1023')