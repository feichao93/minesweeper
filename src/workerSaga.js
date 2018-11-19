import { buffers, delay, eventChannel, io } from 'little-saga'
import { Map, Set } from 'immutable'
import { CLEAR_INDICATORS, CHANGE_MODE, SET_INDICATORS, UNCOVER, UNCOVER_MULTIPLE } from './actions'
import { COLS, MODES, ROWS, GAME_STATUS, USE_AUTO } from './constants'
import { find } from './common'
import Worker from 'worker-loader!./ai/worker'
import * as C from './ai/constants'

function* handleWorkerMessage(channel) {
  while (true) {
    const action = yield io.take(channel)
    const state = yield io.select()
    const { status } = state.toObject()
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
            if ((yield io.select()).get('status') === GAME_STATUS.ON) {
              // delay若干ms后, 可能游戏已经结束, 这里判断一下, 确保只在游戏进行的时候进行AI操作
              yield io.put({ type: UNCOVER_MULTIPLE, pointSet })
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
    yield io.take([UNCOVER, UNCOVER_MULTIPLE, CHANGE_MODE])
    const { modes, mines, indicators } = (yield io.select()).toObject()
    let gameOn = true
    const array = mines.map((mine, point) => {
      const mode = modes.get(point)
      if (mode === MODES.FLAG) {
        return C.MINE
      } else if (mode === MODES.UNCOVERED) {
        return mine
      } else if (indicators.get(point) === 'mine') {
        return C.MINE
      } else if (indicators.get(point) === 'safe') {
        return C.SAFE
      } else if (mode === MODES.COVERED || mode === MODES.QUESTIONED) {
        return C.UNKNOWN
      } else {
        gameOn = false // 遇到了无法识别的 mode, 说明当前游戏已经结束
        return C.UNKNOWN
      }
    })
    if (gameOn) {
      worker.postMessage(JSON.stringify({ type: 'hint', ROWS, COLS, array, USE_AUTO }))
    }
  }
}
