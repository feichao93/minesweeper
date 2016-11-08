import { Seq, Set } from 'immutable'
import { takeEvery } from 'redux-saga'
import { select, put } from 'redux-saga/effects'
import { neighbors, find, win, generateMines } from 'common'
import { MODES, ROWS, COLS, STAGES, MINE_COUNT } from 'constants'
import {
  LEFT_CLICK,
  MIDDLE_CLICK,
  RIGHT_CLICK,
  UNCOVER_MULTIPLE,
  MARK,
  GAME_OVER_WIN,
  GAME_OVER_LOSE,
  GAME_ON,
  TICK,
} from 'actions'

export function* handleLeftClick({ t }) {
  const state = yield select()
  const stage = state.get('stage')
  const modes = state.get('modes')
  let mines = state.get('mines')
  if (modes.get(t) === MODES.COVERED) {
    // 如果目前stage为IDLE, 那么先生成地雷布局
    if (stage === STAGES.IDLE) {
      mines = generateMines(ROWS * COLS, MINE_COUNT, [t])
      // 游戏stage跳转到ON, 计时开始
      yield put({ type: GAME_ON, mines })
    }

    const mine = mines.get(t)
    if (mine === -1) { // 用户点到了炸弹
      yield put({ type: GAME_OVER_LOSE, failTs: Set([t]) })
    } else { // mine >= 0
      yield put({ type: UNCOVER_MULTIPLE, ts: find(modes, mines, t) })
      const { modes: afterModes, mines: afterMines } = (yield select()).toObject()
      if (win(afterModes, afterMines)) {
        yield put({ type: GAME_OVER_WIN })
      }
    }
  } else {
    console.warn('用户点击了 棋子/问号/已打开 的格子') // eslint-disable-line
  }
}

export function* handleMiddleClick({ t }) {
  const { modes, mines } = (yield select()).toObject()
  const mode = modes.get(t)
  const mine = mines.get(t)
  if (mode === MODES.UNCOVERED && mine > 0) {
    const neighborSeq = Seq(neighbors(t))
    const flagCount = neighborSeq.filter(neighbor => modes.get(neighbor) === MODES.FLAG).count()
    if (flagCount === mine) { // 周围旗子的数量和该位置上的数字相等 (过多/过少都不能触发点击)
      const nearbyCovered = neighborSeq.filter(neighbor => modes.get(neighbor) === MODES.COVERED)
      const ts = nearbyCovered.flatMap(covered => find(modes, mines, covered)).toSet()
      yield put({ type: UNCOVER_MULTIPLE, ts })

      const failTs = nearbyCovered.filter(covered => mines.get(covered) === -1).toSet()
      if (failTs.size > 0) { // 用户点到了若干地雷
        yield put({ type: GAME_OVER_LOSE, failTs })
      } else {
        const { modes: afterModes, mines: afterMines } = (yield select()).toObject()
        if (win(afterModes, afterMines)) {
          yield put({ type: GAME_OVER_WIN })
        }
      }
    }
  }
}

export function* handleRightClick({ t }) {
  const { modes } = (yield select()).toObject()
  const mode = modes.get(t)
  if (mode !== MODES.UNCOVERED) {
    if (mode === MODES.COVERED) {
      yield put({ type: MARK, t, mark: MODES.FLAG })
    } else if (mode === MODES.FLAG) {
      yield put({ type: MARK, t, mark: MODES.QUESTIONED })
    } else if (mode === MODES.QUESTIONED) {
      yield put({ type: MARK, t, mark: MODES.COVERED })
    } else {
      throw new Error(`Invalid mode ${mode} for ${t}`)
    }
  } else {
    console.warn('用户点击了 棋子/问号/已打开 的格子') // eslint-disable-line
  }
}

export default function* rootSaga() {
  yield takeEvery(LEFT_CLICK, handleLeftClick)
  yield takeEvery(MIDDLE_CLICK, handleMiddleClick)
  yield takeEvery(RIGHT_CLICK, handleRightClick)
}
