/* eslint-disable no-constant-condition, generator-star-spacing */
import { eventChannel, delay, buffers } from 'redux-saga'
import { take, put, select, fork } from 'redux-saga/effects'
import { Map, Set } from 'immutable'
import { UNCOVER, UNCOVER_MULTIPLE, SET_INDICATORS, MARK, CLEAR_INDICATORS } from 'actions'
import { MODES, COLS, ROWS, USE_AUTO } from 'constants'
import { find } from 'common'
import Worker from 'worker!ai/worker'
import * as C from 'ai/constants'

function* handleWorkerMessage(channel) {
  while (true) {
    const action = yield take(channel)
    // todo 这里需要类似于去抖动的效果
    if (action.type === 'mine') {
      const map = Map(action.value.map(v => [v, 'mine']))
      yield put({ type: SET_INDICATORS, map })
    } else if (action.type === 'safe') {
      if (action.value.length > 0) {
        const map = Map(action.value.map(v => [v, 'safe']))
        yield put({ type: SET_INDICATORS, map })

        if (USE_AUTO) {
          yield fork(function*() {
            const { modes, mines } = (yield select()).toObject()
            let ts = Set()
            action.value.forEach((t) => {
              ts = ts.union(find(modes, mines, t))
            })
            yield delay(120)
            // 这里电脑一下子点多个...有点作弊
            yield put({ type: UNCOVER_MULTIPLE, ts })
          })
        }
      }
    } else if (action.type === 'danger') {
      const map = Map(action.value.map(v => [v, 'danger']))
      yield put({ type: SET_INDICATORS, map })
    } else if (action.type === 'clear') {
      yield put({ type: CLEAR_INDICATORS, ts: action.ts })
    }
  }
}

export default function* workerSaga() {
  const worker = new Worker()

  const channel = eventChannel((emmiter) => {
    const listener = (event) => {
      emmiter(JSON.parse(event.data))
    }
    worker.addEventListener('message', listener)
    return () => worker.removeEventListener('message', listener)
  }, buffers.expanding(16))

  yield fork(handleWorkerMessage, channel)

  while (true) {
    yield take([UNCOVER, UNCOVER_MULTIPLE, MARK])
    const { modes, mines, indicators } = (yield select()).toObject()
    const array = mines.map((mine, t) => {
      const mode = modes.get(t)
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
    worker.postMessage(JSON.stringify({ type: 'hint', ROWS, COLS, array, USE_AUTO }))
  }
}
