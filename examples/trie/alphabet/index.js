/**
 * 字典树
 * http://blog.csdn.net/lisonglisonglisong/article/details/45584721
 */

class Node {
  constructor () {
    this.count = 0
    this.children = new Array(26)
    this._charCodeOfa = 'a'.charCodeAt(0)
  }

  code (letter) {
    return letter.charCodeAt(0) - this._charCodeOfa
  }

  insertWord (word) {
    const len = word.length
    let node = this
    for (let i = 0; i < len; i++) {
      const code = this.code(word[i])
      if (node.children[code] === undefined) {
        node.children[code] = new Node()
      }
      node = node.children[code]
    }
    node.count += 1
  }

  search (word) {
    let node = this
    const len = word.length
    for (let i = 0; i < len && node !== undefined; i++) {
      const code = this.code(word[i])
      node = node.children[code]
    }
    if (node === undefined) {
      return 0
    } else {
      return node.count
    }
  }
}

function main () {
  const words = ["the", "a", "there", "answer", "any", "by", "bye", "their"]

  // 创建树
  const trie = new Node()
  for (let i = 0; i < words.length; i++) {
    trie.insertWord(words[i])
  }

  // 检索
  const IN_TRIE = 'in the trie'
  const NOT_IN_TRIE = 'not in the trie'
  ;['the', 'these', 'their', 'thaw'].forEach(word => {
    const result = trie.search(word)
    console.log(`${word} - ${result ? IN_TRIE : NOT_IN_TRIE} - ${result}`)
  })

  // 词频统计
  // TODO 怎么做深度优先搜索
}

main()