import { Map, Repeat, Record } from 'immutable'
import { COLS, MINE_COUNT, MODES, ROWS, GAME_STATUS } from './constants'
import {
  CLEAR_INDICATORS,
  GAME_ON,
  GAME_OVER_LOSE,
  GAME_OVER_WIN,
  MARK,
  RESET_TIMER,
  RESTART,
  SET_INDICATORS,
  TICK,
  UNCOVER,
  UNCOVER_MULTIPLE,
} from './actions'
import { defaultMines } from './common'

const GameRecord = Record({
  status: GAME_STATUS.IDLE,

  // >=0 表示没有地雷, -1 表示有地雷
  mines: defaultMines(ROWS * COLS, MINE_COUNT),

  // 一开始均为"未点开的"
  modes: Repeat(MODES.COVERED, ROWS * COLS).toList(),

  // 计时器数值[0-999]
  timer: 0,

  // AI反馈
  indicators: Map(),
})

export default function reducer(state = GameRecord(), action) {
  if (action.type === GAME_ON) {
    return state.set('status', GAME_STATUS.ON).set('mines', action.mines)
  } else if (action.type === UNCOVER) {
    return state.setIn(['modes', action.t], MODES.UNCOVERED)
  } else if (action.type === UNCOVER_MULTIPLE) {
    return state.update('modes', modes =>
      modes.withMutations(ms => {
        action.ts.forEach(t => {
          ms.set(t, MODES.UNCOVERED)
        })
      }),
    )
  } else if (action.type === MARK) {
    return state.setIn(['modes', action.t], action.mark)
  } else if (action.type === GAME_OVER_WIN) {
    // 玩家获胜的时候, 将所有有地雷的点 用棋子标记一下
    const { modes, mines } = state.toObject()
    const newModes = modes.withMutations(ms => {
      mines.forEach((mine, t) => {
        if (mine === -1) {
          ms.set(t, MODES.FLAG)
        }
      })
    })
    return state.merge({ status: GAME_STATUS.WIN, modes: newModes })
  } else if (action.type === RESTART) {
    return state
      .set('status', GAME_STATUS.IDLE)
      .set('mines', defaultMines(ROWS * COLS, MINE_COUNT))
      .set('modes', Repeat(MODES.COVERED, ROWS * COLS).toList())
      .set('indicators', Map())
  } else if (action.type === GAME_OVER_LOSE) {
    // 游戏失败的时候需要做以下几件事情:
    // 1. 先用find展开uncover (这个在失败之前应该已经执行)
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
      } else if (mines.get(t) === -1 && modes.get(t) === MODES.COVERED) {
        return MODES.UNCOVERED
      }
      return mode
    })
    return state.merge({ status: GAME_STATUS.LOSE, modes: newModes })
  } else if (action.type === TICK) {
    return state.update('timer', timer => (timer === 999 ? timer : timer + 1))
  } else if (action.type === RESET_TIMER) {
    return state.set('timer', 0)
  } else if (action.type === SET_INDICATORS) {
    return state.mergeIn(['indicators'], action.map)
  } else if (action.type === CLEAR_INDICATORS) {
    return state.update('indicators', indicators =>
      indicators.withMutations(inds => {
        for (const t of action.ts) {
          inds.delete(t)
        }
      }),
    )
  } else {
    return state
  }
}
