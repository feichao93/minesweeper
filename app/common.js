import { List } from 'immutable'
import { COLS, ROWS, COVERED } from 'constants'

export function calculateMines(mines) {
  return mines.map((mine, t) => {
    const hasMine = mine === -1
    if (!hasMine) {
      const row = Math.floor(t / COLS)
      const col = t % COLS
      let count = 0
      for (const deltaRow of [-1, 0, 1]) {
        for (const deltaCol of [-1, 0, 1]) {
          if (!(deltaRow === 0 && deltaCol === 0)) {
            const row2 = row + deltaRow
            const col2 = col + deltaCol
            if (row2 >= 0 && row2 < ROWS && col2 >= 0 && col2 < COLS) {
              const t2 = row2 * COLS + col2
              if (mines.get(t2) === -1) {
                count += 1
              }
            }
          }
        }
      }
      return count
    } else {
      return -1
    }
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
            && modes.get(neighbor) === COVERED
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