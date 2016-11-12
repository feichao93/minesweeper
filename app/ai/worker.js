/* eslint-disable no-param-reassign */
import { UNKNOWN, MINE, SAFE } from 'ai/constants'

let ROWS
let COLS
let T
let state

const getRow = t => Math.floor(t / COLS)
const getCol = t => t % COLS

function* range(start, end) {
  for (let i = start; i < end; i += 1) {
    yield i
  }
}

function* findNeighbors(t) {
  const row = getRow(t)
  const col = getCol(t)
  for (const deltaRow of [-1, 0, 1]) {
    for (const deltaCol of [-1, 0, 1]) {
      const row2 = row + deltaRow
      const col2 = col + deltaCol
      if (row2 >= 0 && row2 < ROWS && col2 >= 0 && col2 < COLS) {
        yield row2 * COLS + col2
      }
    }
  }
}

function group(ts) {
  const mines = []
  const unknowns = []
  const safes = []
  const normals = []
  for (const t of ts) {
    switch (state[t]) {
      case MINE:
        mines.push(t)
        break
      case SAFE:
        safes.push(t)
        break
      case UNKNOWN:
        unknowns.push(t)
        break
      default:
        normals.push(t)
    }
  }
  return { mines, unknowns, safes, normals }
}

// 简单分割
function splitParts() {
  const disjointSet = new Array(state.length)
  disjointSet.fill(-1)

  function find(t) {
    if (disjointSet[t] < 0) {
      return t
    } else {
      // eslint-disable-next-line no-return-assign
      return disjointSet[t] = find(disjointSet[t])
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
    if ((s1 >= 0 || s1 === SAFE)
      && (s2 >= 0 || s2 === SAFE)) {
      return true
    } else {
      return s1 === s2
    }
  }

  function getSize(s) {
    return -disjointSet[find(s)]
  }

  // todo 划分不太合理  union的条件需要放宽
  // todo 我们只关心unknown的合并, 其他元素并不需要
  for (const row of range(0, ROWS)) {
    for (const col of range(0, COLS)) {
      const t = row * COLS + col
      const top = t - COLS
      const left = t - 1
      const topLeft = t - COLS - 1
      if (col >= 1 && isEquivalent(state[t], state[left])) {
        union(t, left)
      }
      if (row >= 1 && isEquivalent(state[t], state[top])) {
        union(t, top)
      }
      if (row >= 1 && col >= 1 && isEquivalent(state[t], state[topLeft])) {
        union(t, topLeft)
      }
    }
  }

  const unknownMap = new Map()
  // todo 这个representives看起来并没有什么用
  const representives = []
  for (const t of range(0, T)) {
    if (disjointSet[t] < 0) {
      representives.push(t)
    }
    const s = find(t)
    if (state[s] === UNKNOWN) {
      if (unknownMap.has(s)) {
        unknownMap.get(s).push(t)
      } else {
        unknownMap.set(s, [t])
      }
    }
  }

  return {
    representives,
    getSize,
    find,
    unknownParts: unknownMap.values(),
  }
}

// 寻找 "数字" 等于 "周围UNKNOWN数量 + 周围MINE数量" 的格子
function findExplicitMines(lastSafes) {
  const result = new Set()
  let searchSet
  if (lastSafes) {
    searchSet = new Set()
    for (const lastSafe of lastSafes) {
      for (const neighbor of findNeighbors(lastSafe)) {
        if (state[neighbor] > 0) {
          searchSet.add(neighbor)
        }
      }
    }
  } else {
    searchSet = Array.from(range(0, T)).filter(t => state[t] > 0)
  }
  for (const t of searchSet) {
    const { mines, unknowns } = group(findNeighbors(t))
    if (state[t] === unknowns.length + mines.length) {
      for (const unknown of unknowns) {
        result.add(unknown)
      }
    }
  }
  return result
}

// 寻找 "数字" 等于 "周围MINES数量" 的格子
function findExplicitSafes(lastMines) {
  const result = new Set()
  let searchSet
  if (lastMines) {
    searchSet = new Set()
    for (const lastMine of lastMines) {
      for (const neighbor of findNeighbors(lastMine)) {
        if (state[neighbor] > 0) {
          searchSet.add(neighbor)
        }
      }
    }
  } else {
    searchSet = Array.from(range(0, T)).filter(t => state[t] > 0)
  }
  for (const t of searchSet) {
    const { mines, unknowns } = group(findNeighbors(t))
    if (state[t] === mines.length) {
      for (const unknown of unknowns) {
        result.add(unknown)
      }
    }
  }
  return result
}

function postMines(mines) {
  postMessage(JSON.stringify({
    type: 'must-be-mine',
    value: mines,
  }))
}

function postSafes(safes) {
  postMessage(JSON.stringify({
    type: 'must-be-safe',
    value: safes,
  }))
}

function applySafes(safes) {
  for (const t of safes) {
    state[t] = SAFE
  }
}

function applyMines(mines) {
  for (const t of mines) {
    state[t] = MINE
  }
}

function simpleExplicitIteration() {
  const firstMines = Array.from(findExplicitMines())
  applyMines(firstMines)
  postMines(firstMines)

  const firstSafes = Array.from(findExplicitSafes())
  applySafes(firstSafes)
  postSafes(firstSafes)

  let safes = firstSafes
  while (safes.length > 0) {
    const mines = Array.from(findExplicitMines(safes))
    applyMines(mines)
    postMines(mines)

    safes = Array.from(findExplicitSafes(mines))
    applySafes(safes)
    postSafes(safes)
  }
}

function getSafeCount() {
  let safeCount = 0
  for (const s of state) {
    if (s === SAFE) {
      safeCount += 1
    }
  }
  return safeCount
}

function sortByNearbyNumbers(t1, t2) {
  const normals1 = group(findNeighbors(t1)).normals
  const normals2 = group(findNeighbors(t2)).normals

  // todo 还要更偏向角落 / 更偏向有效数字小的(要去掉已知的MINE)
  // todo 需要更偏向数字更多的
  return normals1.reduce((r, v) => Math.min(r, state[v]), 9)
    - normals2.reduce((r, v) => Math.min(r, state[v]), 9)
}

function resolve(start, depth = 0) {
  console.log(`resolve(${depth}): ${getRow(start)} ${getCol(start)}`)
  return // todo LAST-EDIT-HERE
  // 首先将该处设置为 MINE
  state[start] = MINE
  // findExplicitSafes([start])

  // 设置为初始状态
  state[start] = UNKNOWN
}

onmessage = function (event) { // eslint-disable-line no-undef
  const message = JSON.parse(event.data)
  if (message.type === 'hint') {
    COLS = message.COLS
    ROWS = message.ROWS
    T = ROWS * COLS
    state = message.state // todo 这样写虽然方便, 但不是很好

    // 第一步: 简单迭代 来寻找那些显而易见的MINE&SAFE
    simpleExplicitIteration()

    // 第二步: 如果有较小的UNKNOWN-set(size <= 20), 则尝试暴力破解
    const safeCount = getSafeCount()

    if (safeCount === 0) {
      const { unknownParts } = splitParts(state)
      for (const part of unknownParts) {
        if (part.length <= 32) {
          part.sort(sortByNearbyNumbers)
          resolve(part[0])
        }
      }
    }
  } else {
    throw new Error(`Invalid message type:${message.type}`)
  }
}
