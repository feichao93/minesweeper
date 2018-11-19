import Immutable, { Seq, Range, Repeat } from 'immutable'
import { COLS, ROWS, MODES } from './constants'

export function clamp(min, value, max) {
  return Math.min(max, Math.max(min, value))
}

function cmp(x, y) {
  return x - y
}

// 判断当前玩家是否获胜
export function doesPlayerWin(modes, mines) {
  // mine对应>= 0(即没有地雷)的点对应的mode均为UNCOVERED的时候, 玩家获胜
  return mines.every((mine, point) => {
    if (mine >= 0) {
      return modes.get(point) === MODES.UNCOVERED
    }
    return true
  })
}

export function* neighbors(point) {
  const row = Math.floor(point / COLS)
  const col = point % COLS
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

// 用来快速生成 game.status 为IDLE时的地雷布局
export function defaultMines(size, count) {
  return Repeat(-1, count)
    .concat(Repeat(0, size - count))
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
  const mines = Range(0, size).map(point => {
    if (pointSet.has(point)) {
      return -1
    } else {
      return 0
    }
  })

  return mines
    .map((mine, point) =>
      mine === -1
        ? -1
        : Seq(neighbors(point))
            .filter(neighbor => mines.get(neighbor) === -1)
            .count(),
    )
    .toList()
}

// 从start位置开始, uncover周围的点(一般为8个), 如果周围的点中存在mine = 0的点P, 则从点P处执行同样的操作.
// 该函数用于计算 uncover start的时候应当同时uncover的点的集合
export function find(modes, mines, start) {
  // 注意这里使用的是原生的Set
  const result = new Set()
  let visited = new Set([start])

  while (visited.size > 0) {
    const newVisited = new Set()
    for (const point of visited) {
      result.add(point)
      if (mines.get(point) === 0) {
        for (const neighbor of neighbors(point)) {
          if (
            !result.has(neighbor) &&
            modes.get(neighbor) === MODES.COVERED &&
            mines.get(neighbor) >= 0
          ) {
            newVisited.add(neighbor)
          }
        }
      }
      visited = newVisited
    }
  }
  return Immutable.Set(result)
}
