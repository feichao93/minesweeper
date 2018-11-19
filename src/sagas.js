import { List } from 'immutable'
import { delay, io, takeEvery } from 'little-saga'
import { find, generateMines, neighbors, doesPlayerWin } from './common'
import { COLS, GAME_STATUS, MINE_COUNT, MODES, ROWS, USE_AI, USE_AUTO } from './constants'
import workerSaga from './workerSaga'
import * as actions from './actions'
import {
  GAME_ON,
  GAME_OVER_LOSE,
  GAME_OVER_WIN,
  LEFT_CLICK,
  MIDDLE_CLICK,
  RESTART,
  RIGHT_CLICK,
  TICK,
  REVEAL,
} from './actions'

export function* handleLeftClick({ point }) {
  const state = yield io.select()
  const { status, modes } = state.toObject()
  let mines = state.get('mines')
  if (modes.get(point) === MODES.COVERED) {
    // 如果目前 game.status 为 IDLE, 那么先生成地雷布局
    if (status === GAME_STATUS.IDLE) {
      mines = generateMines(ROWS * COLS, MINE_COUNT, [point, ...neighbors(point)])
      // 游戏 status 跳转到 ON, 计时开始
      yield io.put(actions.gameOn(mines))
    }
    yield io.put(actions.reveal(find(modes, mines, point)))
  }
}

export function* handleMiddleClick({ point }) {
  const { modes, mines } = (yield io.select()).toObject()
  const mode = modes.get(point)
  const mine = mines.get(point)
  if (mode === MODES.UNCOVERED && mine > 0) {
    const neighborList = List(neighbors(point))
    const flagCount = neighborList.filter(neighbor => modes.get(neighbor) === MODES.FLAG).count()
    if (flagCount === mine) {
      // 周围旗子的数量和该位置上的数字相等 (过多/过少都不能触发点击)
      const nearbyCovered = neighborList.filter(neighbor => modes.get(neighbor) === MODES.COVERED)
      const pointSet = nearbyCovered.flatMap(covered => find(modes, mines, covered)).toSet()
      yield io.put(actions.reveal(pointSet))
    }
  }
}

export function* handleRightClick({ point }) {
  const { modes } = (yield io.select()).toObject()
  const mode = modes.get(point)
  if (mode !== MODES.UNCOVERED) {
    if (mode === MODES.COVERED) {
      yield io.put(actions.changeMode(point, MODES.FLAG))
    } else if (mode === MODES.FLAG) {
      yield io.put(actions.changeMode(point, MODES.QUESTIONED))
    } else if (mode === MODES.QUESTIONED) {
      yield io.put(actions.changeMode(point, MODES.COVERED))
    } else {
      throw new Error(`Invalid mode ${mode} for ${point}`)
    }
  }
}

function* tickEmitter() {
  while (true) {
    yield io.put({ type: TICK })
    yield delay(1000)
  }
}

// 计时器逻辑: take到GAME_ON之后, 开始计时(每隔1秒钟put一个TICK)
// take到GAME_OVER_WIN或GAME_OVER_LOSE则暂停计时
// take到RESTART暂停计时且put一个RESET_TIMER
export function* timerHandler() {
  while (true) {
    const action1 = yield io.take([GAME_ON, RESTART])
    if (action1.type === GAME_ON) {
      const task = yield io.fork(tickEmitter)
      const action2 = yield io.take([GAME_OVER_WIN, GAME_OVER_LOSE, RESTART])
      task.cancel()
      if (action2.type === RESTART) {
        yield io.put(actions.resetTimer())
      }
    } else {
      // action1.type === RESTART
      yield io.put(actions.resetTimer())
    }
  }
}

export function* watchReveal({ pointSet }) {
  const state = yield io.select()
  const { modes, mines } = state.toObject()
  // 先看看用户是否点击到了地雷, 如果点击到了地雷, 则游戏失败
  const failedPoints = pointSet.filter(point => mines.get(point) === -1)
  if (failedPoints.size > 0) {
    yield io.put(actions.gameOverLose(failedPoints))
  } else if (doesPlayerWin(modes, mines)) {
    yield io.put(actions.gameOverWin())
  }
}

export default function* rootSaga() {
  yield takeEvery(LEFT_CLICK, handleLeftClick)
  yield takeEvery(MIDDLE_CLICK, handleMiddleClick)
  yield takeEvery(RIGHT_CLICK, handleRightClick)
  yield takeEvery(REVEAL, watchReveal)
  yield io.fork(timerHandler)
  if (USE_AI || USE_AUTO) {
    yield io.fork(workerSaga)
  }
}
