import { buffers, delay, eventChannel, io } from 'little-saga'
import { Range, Map, Set } from 'immutable'
import { CHANGE_MODE, CLEAR_INDICATORS, REVEAL, SET_INDICATORS } from './actions'
import { COLS, GAME_STATUS, MODES, ROWS, USE_AUTO } from './constants'
import { find } from './common'
import Worker from 'worker-loader!./ai/worker'
import * as C from './ai/constants'

function waitIdleCallback() {
  return io.cps(cb => {
    const handle = requestIdleCallback(() => cb(null))
    cb.cancel = () => cancelIdleCallback(handle)
  })
}

function* handleWorkerMessage(channel) {
  while (true) {
    const action = yield io.take(channel)
    const { status } = yield io.select()
    if (status !== GAME_STATUS.ON) {
      continue
    }
    // todo 这里需要类似于去抖动的效果
    if (action.type === 'mine') {
      const map = Map(action.value.map(v => [v, 'mine']))
      yield io.put({ type: SET_INDICATORS, map })
    } else if (action.type === 'safe') {
      if (action.value.length > 0) {
        const map = Map(action.value.map(v => [v, 'safe']))
        yield io.put({ type: SET_INDICATORS, map })

        if (USE_AUTO) {
          yield io.fork(function*() {
            const { modes, mines } = (yield io.select()).toObject()
            let pointSet = Set()
            action.value.forEach(point => {
              pointSet = pointSet.union(find(modes, mines, point))
            })
            yield delay(120)
            // 这里电脑一下子点多个...有点作弊
            const { status: currentStatus } = yield io.select()
            if (currentStatus === GAME_STATUS.ON) {
              // delay若干ms后, 可能游戏已经结束, 这里判断一下, 确保只在游戏进行的时候进行AI操作
              yield io.put({ type: REVEAL, pointSet })
            }
          })
        }
      }
    } else if (action.type === 'danger') {
      const map = Map(action.value.map(v => [v, 'danger']))
      yield io.put({ type: SET_INDICATORS, map })
    } else if (action.type === 'clear') {
      yield io.put({ type: CLEAR_INDICATORS, pointSet: action.pointSet })
    }
  }
}

export default function* workerSaga() {
  const worker = new Worker()

  const channel = eventChannel(emmiter => {
    const listener = event => {
      emmiter(JSON.parse(event.data))
    }
    worker.addEventListener('message', listener)
    return () => worker.removeEventListener('message', listener)
  }, buffers.expanding(16))

  yield io.fork(handleWorkerMessage, channel)

  while (true) {
    yield io.take([REVEAL, CHANGE_MODE])
    yield waitIdleCallback()

    const { modes, mines, indicators, status } = yield io.select()

    if (status !== GAME_STATUS.ON) {
      continue
    }

    const array = []

    for (const point of Range(0, ROWS * COLS)) {
      const mine = mines.get(point)
      const mode = modes.get(point)

      if (mode === MODES.FLAG) {
        array.push(C.MINE)
      } else if (mode === MODES.UNCOVERED) {
        array.push(mine)
      } else if (indicators.get(point) === 'mine') {
        array.push(C.MINE)
      } else if (indicators.get(point) === 'safe') {
        array.push(C.SAFE)
      } else if (mode === MODES.COVERED || mode === MODES.QUESTIONED) {
        array.push(C.UNKNOWN)
      } else {
        // 遇到了其他 mode, 说明当前游戏已经结束
        throw new Error(`Invalid mode ${mode}`)
      }
    }
    worker.postMessage(JSON.stringify({ type: 'hint', ROWS, COLS, array, USE_AUTO }))
  }
}
