import { Map, Repeat, Range } from 'immutable'
import { ROWS, COLS, COVERED, UNCOVERED } from 'constants'
import { CLICK } from 'actions'

function calculateMines(mines) {
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
            const t2 = row2 * COLS + col2
            if (mines.get(t2) === -1) {
              count += 1
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

const initialState = Map({
  // >=0 表示没有地雷, -1 表示有地雷
  mines: calculateMines(Range(0, ROWS * COLS).map(() => (
    Math.random() < 0.2 ? -1 : 0)).toList()),

  // 一开始均为"未点开的"
  modes: Repeat(COVERED, ROWS * COLS).toList(),
})

export default function reducer(state = initialState, action) {
  if (action.type === CLICK) {
    // todo 判断用户是否点到了地雷
    return state.setIn(['modes', action.t], UNCOVERED)
  } else {
    return state
  }
}
