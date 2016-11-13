/* eslint-disable no-constant-condition */
import { eventChannel, delay, buffers } from 'redux-saga'
import { take, put, select, fork } from 'redux-saga/effects'
import { Map } from 'immutable'
import { UNCOVER, UNCOVER_MULTIPLE, SET_INDICATORS, MARK, CLEAR_INDICATORS } from 'actions'
import { MODES, COLS, ROWS } from 'constants'
import Worker from 'worker!ai/worker'
import * as C from 'ai/constants'

function* handleWorkerMessage(channel) {
  while (true) {
    const action = yield take(channel)
    if (action.type === 'mine') {
      const map = Map(action.value.map(v => [v, 'mine']))
      yield put({ type: SET_INDICATORS, map })
    } else if (action.type === 'safe') {
      const map = Map(action.value.map(v => [v, 'safe']))
      yield put({ type: SET_INDICATORS, map })
    } else if (action.type === 'danger') {
      const map = Map(action.value.map(v => [v, 'danger']))
      yield put({ type: SET_INDICATORS, map })
    } else if (action.type === 'clear') { // todo 这里需要类似于去抖动的效果
      yield put({ type: CLEAR_INDICATORS, ts: action.ts })
    }
  }
}

async function test() {
  await Promise.resolve(123)
  return 1
}
console.log(test())

export default function* workerSaga() {
  const worker = new Worker()

  const channel = eventChannel((emmiter) => {
    worker.onmessage = (event) => {
      emmiter(JSON.parse(event.data))
    }
    return () => (worker.onmessage = null)
  }, buffers.expanding(16))

  yield fork(handleWorkerMessage, channel)

  while (true) {
    yield take([UNCOVER, UNCOVER_MULTIPLE, MARK])
    const { modes, mines, indicators } = (yield select()).toObject()
    const state = mines.map((mine, t) => {
      const mode = modes.get(t)
      // todo 不应该颜色来区分indicator
      if (mode === MODES.FLAG) {
        return C.MINE
      } else if (mode === MODES.UNCOVERED) {
        return mine
      } else if (indicators.get(t) === 'mine') {
        return C.MINE
      } else if (indicators.get(t) === 'safe') {
        return C.SAFE
      } else if (mode === MODES.COVERED || mode === MODES.QUESTIONED) {
        return C.UNKNOWN
      } else {
        throw new Error(`Invalid mode: ${mode} for point: ${t}`)
      }
    })
    worker.postMessage(JSON.stringify({ type: 'hint', ROWS, COLS, state }))
  }
}
