import { Seq, Range, List, Repeat } from 'immutable'
import { COLS, ROWS, MODES } from 'constants'

export function identity(x) {
  return x
}

function cmp(x, y) {
  return x - y
}

// 判断当前玩家是否获胜
export function win(modes, mines) {
  // mine对应>= 0(即没有地雷)的点对应的mode均为UNCOVERED的时候, 玩家获胜
  return mines.every((mine, t) => {
    if (mine >= 0) {
      return modes.get(t) === MODES.UNCOVERED
    }
    return true
  })
}

export function* neighbors(t) {
  const row = Math.floor(t / COLS)
  const col = t % COLS
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

// 用来快速生成stage为IDLE时的地雷布局
export function defaultMines(size, count) {
  return Repeat(-1, count).concat(Repeat(0, size - count)).toList()
}

// 随机生成地雷. 在[0...size-1]的范围中选出count个点放置地雷, 但在excluded处不放置地雷
export function generateMines(size, count, excluded = []) {
  const sortedExcluded = Array.from(excluded).sort(cmp)
  // size >= count + sortedExcluded.size
  const array = []
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
  let k = 0
  for (let i = 0; i < array.length; i += 1) {
    while (array[i] + k >= sortedExcluded[k]) {
      k += 1
    }
    array[i] += k
  }
  const ts = new Set(array)
  const mines = Range(0, size).map((t) => {
    if (ts.has(t)) {
      return -1
    } else {
      return 0
    }
  })

  return mines.map((mine, t) => (mine === -1
      ? -1
      : Seq(neighbors(t)).filter(neighbor => mines.get(neighbor) === -1).count()
  )).toList()
}

// todo 函数名字不太对. 重新命名一下吧. 这个函数找的不止是大于0的格子
export function find(modes, mines, start) {
  // 注意这里使用的是原生的Set
  const result = new Set()
  let visited = new Set([start])

  while (visited.size > 0) {
    const newVisited = new Set()
    for (const t of visited) {
      result.add(t)
      if (mines.get(t) === 0) {
        for (const neighbor of neighbors(t)) {
          if (!result.has(neighbor)
            && modes.get(neighbor) === MODES.COVERED
            && mines.get(neighbor) >= 0) {
            newVisited.add(neighbor)
          }
        }
      }
      visited = newVisited
    }
  }
  return List(result)
}
