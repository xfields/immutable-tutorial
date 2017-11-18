export default class UUIDService {
  constructor (seed = 0) {
    this.seed = seed
  }

  updateSeed (seed) {
    this.seed = seed
    return this
  }

  generate () {
    this.seed += 1
    const { seed } = this
    const start = new Date(2000, 1, 1, 0, 0, 0).getTime()
    const timestamp = Math.abs(Date.now() - start)
    return timestamp * (Math.pow(10, String(seed).length)) + (seed + 1)
  }
}

