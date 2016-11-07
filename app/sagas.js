import { Seq } from 'immutable'
import { takeEvery } from 'redux-saga'
import { select, put } from 'redux-saga/effects'
import { neighbors, find } from 'common'
import { LEFT_CLICK, MIDDLE_CLICK, RIGHT_CLICK, UNCOVER, UNCOVER_MULTIPLE, MARK } from 'actions'
import { COVERED, UNCOVERED, QUESTIONED, FLAG } from 'constants'

export function* handleLeftClick({ t }) {
  const { modes, mines } = (yield select()).toObject()
  if (modes.get(t) === COVERED) {
    const mine = mines.get(t)
    if (mine === -1) {
      // 用户点到了炸弹
      // todo GAME_OVER lose
      yield put({ type: UNCOVER, t })
    } else { // mine >= 0
      yield put({ type: UNCOVER_MULTIPLE, ts: find(modes, mines, t) })
      // todo Dose the player win the game?
    }
  } else {
    console.warn('用户点击了 棋子/问号/已打开 的格子')
  }
}

export function* handleMiddleClick({ t }) {
  const { modes, mines } = (yield select()).toObject()
  const mode = modes.get(t)
  const mine = mines.get(t)
  if (mode === UNCOVERED && mine > 0) {
    const neighborSeq = Seq(neighbors(t))
    const flagCount = neighborSeq.filter(neighbor => modes.get(neighbor) === FLAG).count()
    if (flagCount === mine) { // 周围旗子的数量和该位置上的数字相等 (过多/过少都不能触发点击)
      const nearbyCovered = neighborSeq.filter(neighbor => modes.get(neighbor) === COVERED)
      const ts = nearbyCovered.flatMap(covered => find(modes, mines, covered)).toSet()
      yield put({ type: UNCOVER_MULTIPLE, ts })
      // todo GAME_OVER  lose / win ?
    }
  }
}

export function* handleRightClick({ t }) {
  const { modes } = (yield select()).toObject()
  const mode = modes.get(t)
  if (mode !== UNCOVERED) {
    if (mode === COVERED) {
      yield put({ type: MARK, t, mark: FLAG })
    } else if (mode === FLAG) {
      yield put({ type: MARK, t, mark: QUESTIONED })
    } else if (mode === QUESTIONED) {
      yield put({ type: MARK, t, mark: COVERED })
    } else {
      throw new Error(`Invalid mode ${mode} for ${t}`)
    }
  } else {
    console.warn('用户点击了 棋子/问号/已打开 的格子')
  }
}

export default function* rootSaga() {
  yield takeEvery(LEFT_CLICK, handleLeftClick)
  yield takeEvery(MIDDLE_CLICK, handleMiddleClick)
  yield takeEvery(RIGHT_CLICK, handleRightClick)
}
