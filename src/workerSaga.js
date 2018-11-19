import { buffers, delay, eventChannel, io } from 'little-saga'
import { Map, Range, Set } from 'immutable'
import * as actions from './actions'
import { CHANGE_MODE, REVEAL } from './actions'
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
    const message = yield io.take(channel)
    const { status } = yield io.select()
    if (status !== GAME_STATUS.ON) {
      continue
    }

    if (message.type === 'mine') {
      const colorMap = Map(message.value.map(v => [v, 'mine']))
      yield io.put(actions.setIndicators(colorMap))
    } else if (message.type === 'safe') {
      if (message.value.length > 0) {
        const colorMap = Map(message.value.map(v => [v, 'safe']))
        yield io.put(actions.setIndicators(colorMap))

        if (USE_AUTO) {
          yield io.fork(function*() {
            const { modes, mines } = (yield io.select()).toObject()
            let pointSet = Set()
            message.value.forEach(point => {
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
    } else if (message.type === 'danger') {
      const colorMap = Map(message.value.map(v => [v, 'danger']))
      yield io.put(actions.setIndicators(colorMap))
    } else {
      throw new Error(`Invalid message type ${message.type} from worker`)
    }
  }
}

export default function* workerSaga() {
  const worker = new Worker()

  const channel = eventChannel(emit => {
    const listener = event => {
      emit(JSON.parse(event.data))
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
      } else if (mode === MODES.REVEALED) {
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
