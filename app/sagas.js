import { List } from 'immutable'
import { takeEvery } from 'redux-saga'
import { select, put } from 'redux-saga/effects'
import { CLICK, RIGHT_CLICK, UNCOVER, UNCOVER_MULTIPLE, MARK } from 'actions'
import { COVERED, UNCOVERED, COLS, ROWS, QUESTIONED, FLAG } from 'constants'

function* neighbors(t) {
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

// todo 函数名字不太对. 这个函数找的不止是大于0的格子
function findConnected0s(mines, start) {
  // todo 已经加了flag的点 能否加入到result中?
  // 注意这里使用的是原生的Set
  const result = new Set()
  let visited = new Set([start])

  while (visited.size > 0) {
    const newVisited = new Set()
    for (const t of visited) {
      result.add(t)
      if (mines.get(t) === 0) {
        for (const neighbor of neighbors(t)) {
          if (!result.has(neighbor) && mines.get(neighbor) >= 0) {
            newVisited.add(neighbor)
          }
        }
      }
      visited = newVisited
    }
  }
  return List(result)
}

export function* handleClick({ t }) {
  const { modes, mines } = (yield select()).toObject()
  if (modes.get(t) === COVERED) {
    const mine = mines.get(t)
    if (mine === -1) {
      // 用户点到了炸弹
      // todo GAME_OVER ? lose
      yield put({ type: UNCOVER, t })
    } else if (mine === 0) {
      yield put({ type: UNCOVER_MULTIPLE, ts: findConnected0s(mines, t) })
    } else {
      yield put({ type: UNCOVER, t })
    }
  } else {
    console.warn('用户点击了 棋子/问号/已打开 的格子')
  }
  // todo GAME_OVER ? win
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
  yield takeEvery(CLICK, handleClick)
  yield takeEvery(RIGHT_CLICK, handleRightClick)
}
