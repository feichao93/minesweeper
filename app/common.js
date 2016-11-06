import { COLS, ROWS } from 'constants'

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
