import { UNKNOWN, MINE, SAFE } from './constants'

function addAll(set, iterable) {
  for (const item of iterable) {
    set.add(item)
  }
}

function* range(start, end) {
  for (let i = start; i < end; i += 1) {
    yield i
  }
}

export default class State {
  constructor(array, ROWS, COLS) {
    this.array = array
    this.ROWS = ROWS
    this.COLS = COLS
    this.POINT_COUNT = ROWS * COLS
  }

  getRow(point) {
    return Math.floor(point / this.COLS)
  }

  getCol(point) {
    return point % this.COLS
  }

  countStatus(target) {
    let count = 0
    for (const status of this.array) {
      if (status === target) {
        count += 1
      }
    }
    return count
  }

  splitUnknownParts() {
    const disjointSet = new Array(this.array.length)
    disjointSet.fill(-1)

    function find(point) {
      if (disjointSet[point] < 0) {
        return point
      } else {
        return (disjointSet[point] = find(disjointSet[point]))
      }
    }

    function union(t1, t2) {
      const set1 = find(t1)
      const set2 = find(t2)
      if (set1 !== set2) {
        // union by size
        if (disjointSet[set1] < disjointSet[set2]) {
          disjointSet[set1] += disjointSet[set2]
          disjointSet[set2] = set1
        } else {
          disjointSet[set2] += disjointSet[set1]
          disjointSet[set1] = set2
        }
      }
    }

    function isEquivalent(s1, s2) {
      if ((s1 >= 0 || s1 === SAFE) && (s2 >= 0 || s2 === SAFE)) {
        return true
      } else {
        return s1 === s2
      }
    }

    const tryUnion = (t1, t2) => {
      if (isEquivalent(this.array[t1], this.array[t2])) {
        union(t1, t2)
      }
    }

    // todo 划分不太合理  union的条件需要放宽
    // todo 我们只关心unknown的合并, 其他元素并不需要
    for (const row of range(0, this.ROWS)) {
      for (const col of range(0, this.COLS)) {
        const point = row * this.COLS + col
        const top = point - this.COLS
        const left = point - 1
        const topLeft = point - this.COLS - 1
        if (col >= 1) {
          tryUnion(point, left)
        }
        if (row >= 1) {
          tryUnion(point, top)
        }
        if (row >= 1 && col >= 1) {
          tryUnion(point, topLeft)
        }
      }
    }

    const unknownMap = new Map()
    for (const point of range(0, this.POINT_COUNT)) {
      const s = find(point)
      if (this.array[s] === UNKNOWN) {
        if (unknownMap.has(s)) {
          unknownMap.get(s).push(point)
        } else {
          unknownMap.set(s, [point])
        }
      }
    }

    return unknownMap.values()
  }

  *neighbors(point) {
    const row = this.getRow(point)
    const col = this.getCol(point)
    for (const deltaRow of [-1, 0, 1]) {
      for (const deltaCol of [-1, 0, 1]) {
        const row2 = row + deltaRow
        const col2 = col + deltaCol
        if (row2 >= 0 && row2 < this.ROWS && col2 >= 0 && col2 < this.COLS) {
          yield row2 * this.COLS + col2
        }
      }
    }
  }

  group(points) {
    const mines = []
    const unknowns = []
    const safes = []
    const normals = []
    for (const point of points) {
      switch (this.array[point]) {
        case MINE:
          mines.push(point)
          break
        case SAFE:
          safes.push(point)
          break
        case UNKNOWN:
          unknowns.push(point)
          break
        default:
          normals.push(point)
      }
    }
    return { mines, unknowns, safes, normals }
  }

  apply(points, status) {
    for (const point of points) {
      this.array[point] = status
    }
  }

  revert(pointSet) {
    this.apply(pointSet, UNKNOWN)
  }

  check(points) {
    for (const point of points) {
      const { mines, unknowns } = this.group(this.neighbors(point))
      const min = mines.length
      const max = mines.length + unknowns.length
      if (!(min <= this.array[point] && this.array[point] <= max)) {
        return false
      }
    }
    return true
  }

  findRelated(points) {
    const related = new Set()
    for (const point of points) {
      for (const neighbor of this.neighbors(point)) {
        if (this.array[neighbor] > 0) {
          related.add(neighbor)
        }
      }
    }
    return related
  }

  findExplicitMines(lastSafes) {
    const result = new Set()
    let searchSet
    if (lastSafes) {
      searchSet = this.findRelated(lastSafes)
    } else {
      searchSet = Array.from(range(0, this.POINT_COUNT)).filter(point => this.array[point] > 0)
    }
    for (const point of searchSet) {
      const { mines, unknowns } = this.group(this.neighbors(point))
      if (this.array[point] === unknowns.length + mines.length) {
        for (const unknown of unknowns) {
          result.add(unknown)
        }
      }
    }
    return result
  }

  findExplicitSafes(lastMines) {
    const result = new Set()
    let searchSet
    if (lastMines) {
      searchSet = this.findRelated(lastMines)
    } else {
      searchSet = Array.from(range(0, this.POINT_COUNT)).filter(point => this.array[point] > 0)
    }
    for (const point of searchSet) {
      const { mines, unknowns } = this.group(this.neighbors(point))
      if (this.array[point] === mines.length) {
        for (const unknown of unknowns) {
          result.add(unknown)
        }
      }
    }
    return result
  }

  explicitIterationFromSafe(startSafes, needCheck = false) {
    const foundMines = new Set()
    const foundSafes = new Set()
    let checkFailed = false

    let safes = startSafes
    while (safes.length > 0) {
      const mines = this.findExplicitMines(safes)
      this.apply(mines, MINE)
      addAll(foundMines, mines)
      if (needCheck && !this.check(this.findRelated(mines))) {
        checkFailed = true
        break
      }

      safes = this.findExplicitSafes(mines)
      this.apply(safes, SAFE)
      addAll(foundSafes, safes)
      if (needCheck && !this.check(this.findRelated(safes))) {
        checkFailed = true
        break
      }
    }

    return { foundMines, foundSafes, checkFailed }
  }

  explicitIterationFromMine(startMines, needCheck = false) {
    const foundMines = new Set()
    const foundSafes = new Set()
    let checkFailed = false

    let mines = startMines
    while (mines.length > 0) {
      const safes = this.findExplicitSafes(mines)
      this.apply(safes, SAFE)
      addAll(foundSafes, safes)
      if (needCheck && !this.check(this.findRelated(safes))) {
        checkFailed = true
        break
      }

      mines = this.findExplicitSafes(safes)
      this.apply(mines, MINE)
      addAll(foundMines, mines)
      if (needCheck && !this.check(this.findRelated(mines))) {
        checkFailed = true
        break
      }
    }

    return { foundMines, foundSafes, checkFailed }
  }

  canBeMine(start) {
    this.array[start] = MINE
    const { foundMines, foundSafes, checkFailed } = this.explicitIterationFromMine([start], true)
    this.array[start] = UNKNOWN
    this.revert(foundMines)
    this.revert(foundSafes)
    return !checkFailed
  }

  canBeSafe(start) {
    this.array[start] = SAFE
    const { foundMines, foundSafes, checkFailed } = this.explicitIterationFromSafe([start], false)
    this.array[start] = UNKNOWN
    this.revert(foundMines)
    this.revert(foundSafes)
    return !checkFailed
  }

  canBeResolve(point) {
    return this.group(this.neighbors(point)).normals.length > 0
  }

  // todo 需要进一步的优化
  sortByNearbyNumbers(t1, t2) {
    const normals1 = this.group(this.neighbors(t1)).normals
    const normals2 = this.group(this.neighbors(t2)).normals

    // todo 还要更偏向角落 / 更偏向有效数字小的(要去掉已知的MINE)
    // todo 需要更偏向数字更多的
    return (
      normals1.reduce((r, v) => Math.min(r, this.array[v]), 9) -
      normals2.reduce((r, v) => Math.min(r, this.array[v]), 9)
    )
  }

  resolve(start) {
    if (!this.canBeMine(start)) {
      return SAFE
    }
    if (!this.canBeSafe(start)) {
      return MINE
    }
    return UNKNOWN
  }
}
