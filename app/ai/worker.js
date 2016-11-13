/* eslint-disable no-param-reassign */
import { MINE, SAFE, UNKNOWN } from 'ai/constants'
import State from 'ai/State'

function postMines(mines) {
  postMessage(JSON.stringify({
    type: 'mine',
    value: Array.from(mines),
  }))
}

function postSafes(safes) {
  postMessage(JSON.stringify({
    type: 'safe',
    value: Array.from(safes),
  }))
}

function postDangers(dangers) {
  postMessage(JSON.stringify({
    type: 'danger',
    value: Array.from(dangers),
  }))
}

// function postClear(ts) {
//   postMessage(JSON.stringify({ type: 'clear', ts: Array.from(ts) }))
// }

onmessage = function (event) { // eslint-disable-line no-undef
  const message = JSON.parse(event.data)
  if (message.type === 'hint') {
    const state = new State(message.state, message.ROWS, message.COLS)

    // 第一步(first-search): 遍历所有的格子来寻找那些显而易见的MINE&SAFE
    const firstMines = state.findExplicitMines()
    state.apply(firstMines, MINE)
    postMines(firstMines)

    const firstSafes = state.findExplicitSafes()
    state.apply(firstSafes, SAFE)
    postSafes(firstSafes)

    let lastSafes = firstSafes
    let lastMines = null
    // eslint-disable-next-line no-constant-condition, no-labels, no-restricted-syntax
    foo: while (true) {
      // 第二步(explicit-iteraction)
      if (lastSafes) {
        const { foundMines, foundSafes } = state.explicitIterationFromSafe(lastSafes)
        postMines(foundMines)
        postSafes(foundSafes)
        lastSafes = null
      }
      if (lastMines) {
        const { foundMines, foundSafes } = state.explicitIterationFromMine(lastMines)
        postMines(foundMines)
        postSafes(foundSafes)
        lastMines = null
      }

      // 第三步(simple-guessing): 如果safeCount为0, 则尝试进行简单猜测
      if (state.countStatus(SAFE) === 0) {
        for (const part of state.splitUnknownParts()) {
          part.sort(state.sortByNearbyNumbers.bind(state))
          for (const t of part) {
            if (!state.canBeResolve(t)) {
              break
            }
            // 一旦找到一个SAFE/MINE, 则重新开始explicit-iteraction
            postDangers([t])
            const result = state.resolve(t)
            if (result !== UNKNOWN) {
              if (result === SAFE) {
                state.apply([t], SAFE)
                postSafes([t])
                lastSafes = [t]
                continue foo // eslint-disable-line no-continue, no-labels
              } else if (result === MINE) {
                state.apply([t], MINE)
                postMines([t])
                lastMines = [t]
                continue foo // eslint-disable-line no-continue, no-labels
              }
            }
          }
        }
      }
      // 如果safeCount不为0, 或是没有找到其他的SAFE/MINE. 则结束循环
      break
    }
  } else {
    throw new Error(`Invalid message type:${message.type}`)
  }
}
