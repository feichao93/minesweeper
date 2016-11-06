import { Map, Repeat, Range } from 'immutable'
import { ROWS, COLS, COVERED, UNCOVERED } from 'constants'
import { UNCOVER, UNCOVER_MULTIPLE, MARK } from 'actions'
import { calculateMines } from 'common'

const initialState = Map({
  // todo stage 用来管理游戏阶段

  // >=0 表示没有地雷, -1 表示有地雷
  mines: calculateMines(Range(0, ROWS * COLS).map(() => (
    Math.random() < 0.15 ? -1 : 0)).toList()),

  // 一开始均为"未点开的"
  modes: Repeat(COVERED, ROWS * COLS).toList(),
})

export default function reducer(state = initialState, action) {
  if (action.type === UNCOVER) {
    return state.setIn(['modes', action.t], UNCOVERED)
  } else if (action.type === UNCOVER_MULTIPLE) {
    return state.update('modes', modes => modes.withMutations((ms) => {
      action.ts.forEach((t) => {
        ms.set(t, UNCOVERED)
      })
    }))
  } else if (action.type === MARK) {
    return state.setIn(['modes', action.t], action.mark)
  } else {
    return state
  }
}
