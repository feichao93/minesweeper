import { Map, Repeat, Range } from 'immutable'
import { ROWS, COLS, STAGES, MODES } from 'constants'
import { UNCOVER, UNCOVER_MULTIPLE, MARK, GAME_OVER_WIN, GAME_OVER_LOSE, RESTART } from 'actions'
import { calculateMines } from 'common'

const initialState = Map({
  stage: STAGES.IDLE,

  // >=0 表示没有地雷, -1 表示有地雷
  mines: calculateMines(Range(0, ROWS * COLS).map(() => (
    Math.random() < 0.03 ? -1 : 0)).toList()),

  // 一开始均为"未点开的"
  modes: Repeat(MODES.COVERED, ROWS * COLS).toList(),
})

export default function reducer(state = initialState, action) {
  if (action.type === UNCOVER) {
    return state.setIn(['modes', action.t], MODES.UNCOVERED)
  } else if (action.type === UNCOVER_MULTIPLE) {
    return state.update('modes', modes => modes.withMutations((ms) => {
      action.ts.forEach((t) => {
        ms.set(t, MODES.UNCOVERED)
      })
    }))
  } else if (action.type === MARK) {
    return state.setIn(['modes', action.t], action.mark)
  } else if (action.type === GAME_OVER_WIN) {
    // 玩家获胜的时候, 将所有有地雷的点 用棋子标记一下
    const { modes, mines } = state.toObject()
    const newModes = modes.withMutations((ms) => {
      mines.forEach((mine, t) => {
        if (mine === -1) {
          ms.set(t, MODES.FLAG)
        }
      })
    })
    return state.merge({ stage: STAGES.WIN, modes: newModes })
  } else if (action.type === RESTART) {
    // todo 需要在用户点开第一个点的时候生成mines, 而不是在一开始
    return state.set('stage', STAGES.IDLE)
      .set('mines', calculateMines(Range(0, ROWS * COLS).map(() => (
        Math.random() < 0.15 ? -1 : 0)).toList()))
      .set('modes', Repeat(MODES.COVERED, ROWS * COLS).toList())
  } else if (action.type === GAME_OVER_LOSE) {
    // 游戏失败的时候需要做以下几件事情:
    // 1. 先用find展开uncover (这个在失败之后已经执行)
    // 2. 将出错的点标位红地雷 (action.failTs <Mine type="exploded" />)
    // 3. 原来错误的旗子的地方需要显示 <Mine type="cross" />
    // 4. 原来正确的旗子保持不变
    // 5. 显示剩余的地雷
    // 6. 当然, 将stage设置为 LOSE
    const { modes, mines } = state.toObject()
    const newModes = modes.map((mode, t) => {
      if (action.failTs.has(t)) {
        return MODES.EXPLODED
      } else if (mode === MODES.FLAG && mines.get(t) !== -1) {
        return MODES.CROSS
      } else if (mines.get(t) === -1) {
        return MODES.UNCOVERED
      }
      return mode
    })
    return state.merge({ stage: STAGES.LOSE, modes: newModes })
  } else {
    return state
  }
}
