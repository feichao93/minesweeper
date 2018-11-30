import Immutable, { List, Range, Repeat } from 'immutable'
import { COLS, MINE, MODES, ROWS } from './constants'

export function clamp(min, value, max) {
  return Math.min(max, Math.max(min, value))
}

function cmp(x, y) {
  return x - y
}

// 判断当前玩家是否获胜
// 当没有地雷的位置均为 REVEALED 的时候, 玩家获胜
export function doesPlayerWin(modes, mines) {
  return mines.every((mine, point) => {
    if (mine !== MINE) {
      return modes.get(point) === MODES.REVEALED
    }
    return true
  })
}

export function getNeighborList(point) {
  const row = Math.floor(point / COLS)
  const col = point % COLS
  const array = []
  for (const deltaRow of [-1, 0, 1]) {
    for (const deltaCol of [-1, 0, 1]) {
      const row2 = row + deltaRow
      const col2 = col + deltaCol
      if (row2 >= 0 && row2 < ROWS && col2 >= 0 && col2 < COLS) {
        array.push(row2 * COLS + col2)
      }
    }
  }
  return List(array)
}

// 用来快速生成 game.status 为 IDLE 时的地雷布局
export function defaultMines(size, mineCount) {
  return Repeat(MINE, mineCount)
    .concat(Repeat(0, size - mineCount))
    .toList()
}

// 随机生成地雷. 在[0...size-1]的范围中选出count个点放置地雷, 但在excluded处不放置地雷
export function generateMines(size, count, excluded = []) {
  const sortedExcluded = Array.from(excluded).sort(cmp)
  // size >= count + sortedExcluded.size
  const array = []
  // 第1步: 首先在 [0, size - sortedExcluded.length)的范围中随机取count个数字(蓄水池抽样)
  for (let i = 0; i < size - sortedExcluded.length; i += 1) {
    if (i < count) {
      array.push(i)
    } else {
      const r = Math.floor(Math.random() * (i + 1)) // r的范围为: [0, i]
      if (r < count) {
        array[r] = i
      }
    }
  }
  array.sort(cmp)
  // 第2步. 根据excluded数组处理第1步中生成的数字, 使得array不包含excluded中的数字
  let k = 0
  for (let i = 0; i < array.length; i += 1) {
    while (array[i] + k >= sortedExcluded[k]) {
      k += 1
    }
    array[i] += k
  }
  const pointSet = new Set(array)

  // 第3步. 计算周围雷的数量, 生成mines
  const hasMines = Range(0, size)
    .map(point => pointSet.has(point))
    .toList()

  function countNeighboringMines(point) {
    return getNeighborList(point)
      .filter(neighbor => hasMines.get(neighbor))
      .count()
  }

  return hasMines.map((has, point) => (has ? MINE : countNeighboringMines(point)))
}

// 从 start 位置开始, reveal 周围的点(一般为8个), 如果周围的点中存在 mine = 0 的点 P, 则从点 P 处执行同样的操作.
// 返回被揭开的位置的集合
export function find(modes, mines, start) {
  // 注意这里使用的是原生的Set
  const result = new Set()
  let frontier = new Set([start])

  while (frontier.size > 0) {
    const conquer = new Set()
    for (const point of frontier) {
      result.add(point)
      if (mines.get(point) === 0) {
        for (const neighbor of getNeighborList(point)) {
          if (
            !result.has(neighbor) &&
            modes.get(neighbor) === MODES.COVERED &&
            mines.get(neighbor) !== MINE
          ) {
            conquer.add(neighbor)
          }
        }
      }
      frontier = conquer
    }
  }
  return Immutable.Set(result)
}
