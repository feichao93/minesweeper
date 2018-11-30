import React, { useRef, useState } from 'react'
import { Range, Set } from 'immutable'
import Number from './components/Number'
import { Cover, Face, Flag, LED, Mine, QuestionMark } from './components/elements'
import { Grid, View } from './components/layouts'
import Indicators from './components/Indicators'
import * as actions from './actions'
import { CELL, COLS, GAME_STATUS, MINE, MODES, ROWS } from './constants'
import useSaga from '@little-saga/use-saga'
import rootSaga from './sagas'
import reducer, { GameRecord } from './reducer'
import { getNeighborList } from './common'

const LEFT_BUTTON = 0
const MIDDLE_BUTTON = 1
const RIGHT_BUTTON = 2

function preventDefault(e) {
  e.preventDefault()
}

function CoverContainer({ modes, btn1, btn2, point }) {
  let dontNeedCover = Set()

  if (point !== -1) {
    if (btn1) {
      dontNeedCover = Set([point])
    } else if (btn2) {
      dontNeedCover = Set(getNeighborList(point))
    }
  }
  const covers = []
  Range(0, ROWS * COLS).forEach(point => {
    const row = Math.floor(point / COLS)
    const col = Math.floor(point % COLS)
    const mode = modes.get(point)
    if (
      (mode === MODES.COVERED && !dontNeedCover.has(point)) ||
      mode === MODES.FLAG ||
      mode === MODES.QUESTIONED
    ) {
      covers.push(<Cover key={point} row={row} col={col} />)
    }
  })
  return covers
}

function ElementContainer({ modes, mines }) {
  const elements = []
  Range(0, ROWS * COLS).forEach(point => {
    const row = Math.floor(point / COLS)
    const col = Math.floor(point % COLS)
    const mode = modes.get(point)
    if (mode === MODES.REVEALED) {
      if (mines.get(point) === MINE) {
        elements.push(<Mine key={point} row={row} col={col} />)
      } else if (mines.get(point) > 0) {
        elements.push(<Number key={point} row={row} col={col} number={mines.get(point)} />)
      }
    } else if (mode === MODES.FLAG) {
      elements.push(<Flag key={point} row={row} col={col} />)
    } else if (mode === MODES.QUESTIONED) {
      elements.push(<QuestionMark key={point} row={row} col={col} />)
    } else if (mode === MODES.CROSS) {
      elements.push(<Mine key={point} row={row} col={col} cross />)
    } else if (mode === MODES.EXPLODED) {
      elements.push(<Mine key={point} row={row} col={col} exploded />)
    }
  })
  return elements
}

export default function App() {
  const [{ status, mines, modes, timer, indicators }, dispatch] = useSaga({
    saga: rootSaga,
    reducer,
    initialState: GameRecord(),
  })

  const [leftPressed, setLeftPressed] = useState(false)
  const [middlePressed, setMiddlePressed] = useState(false)
  const [facePressed, setFacePressed] = useState(false)
  // 鼠标当前的位置，仅在 左键按下 或是 中键按下的情况下有效
  const [point, setPoint] = useState(-1)

  const svgRef = useRef()

  const isGameOn = status === GAME_STATUS.IDLE || status === GAME_STATUS.ON
  const mineCount = mines.filter(mine => mine === MINE).count()
  const flagCount = modes.filter(mode => mode === MODES.FLAG).count()

  return (
    <svg
      className="svg"
      ref={svgRef}
      width={COLS * CELL + 16}
      height={59 + 16 * ROWS}
      onContextMenu={preventDefault}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      <View border={2} x={5} y={5} width={COLS * CELL + 6} height={37}>
        <LED x={5} y={4} number={mineCount - flagCount} />
        {renderFace()}
        <LED x={CELL * COLS - 46} y={4} number={timer} />
      </View>
      <View border={3} x={5} y={48} width={COLS * CELL + 6} height={ROWS * CELL + 6}>
        <Grid />
        <ElementContainer modes={modes} mines={mines} />
        <CoverContainer modes={modes} btn1={leftPressed} btn2={middlePressed} point={point} />
        <Indicators
          indicators={indicators.filter((_, point) => modes.get(point) === MODES.COVERED)}
        />
      </View>
    </svg>
  )

  // region
  function onMouseDown(event) {
    const result = calculate(event)
    if (event.button === LEFT_BUTTON) {
      if (result.isFace) {
        setFacePressed(true)
      } else if (isGameOn && !leftPressed) {
        setLeftPressed(true)
        setMiddlePressed(false)
        setPoint(result.point)
      }
    } else if (event.button === MIDDLE_BUTTON) {
      event.preventDefault()
      if (isGameOn && !middlePressed) {
        setLeftPressed(false)
        setMiddlePressed(true)
        setPoint(result.point)
      }
    } else if (event.button === RIGHT_BUTTON) {
      if (isGameOn && result.valid) {
        dispatch(actions.rightClick(result.point))
      }
    }
  }

  function onMouseMove(event) {
    if (leftPressed || middlePressed) {
      const result = calculate(event)
      if (result.valid) {
        setPoint(result.point)
      }
    }
  }

  function onMouseUp(event) {
    if (event.button === LEFT_BUTTON) {
      if (facePressed) {
        setFacePressed(false)
        dispatch(actions.restart())
      } else if (leftPressed) {
        setLeftPressed(false)
        const result = calculate(event)
        if (result.valid) {
          dispatch(actions.leftClick(result.point))
        }
      }
    } else if (event.button === MIDDLE_BUTTON) {
      if (middlePressed) {
        setMiddlePressed(false)
        const result = calculate(event)
        if (result.valid) {
          dispatch(actions.middleClick(result.point))
        }
      }
    } // else other button, ignore
  }

  function calculate({ clientX, clientY }) {
    const svgRect = svgRef.current.getBoundingClientRect()
    const x = clientX - svgRect.left
    const y = clientY - svgRect.top

    // 判断是否点击到了face
    const faceSize = 26
    const faceOffsetX = 7
    const faceOffsetY = 7
    const faceLeft = (CELL / 2) * COLS - 12 + faceSize / 2
    if (
      faceLeft <= x + faceOffsetX &&
      x + faceOffsetX <= faceLeft + faceSize &&
      y >= 4 + faceOffsetY &&
      y <= 4 + faceOffsetY + faceSize
    ) {
      return { row: 0, col: 0, valid: false, point: -1, isFace: true }
    }

    const row = Math.floor((y - 51) / CELL)
    const col = Math.floor((x - 8) / CELL)
    const valid = row >= 0 && row < ROWS && col >= 0 && col < COLS
    const point = row * COLS + col
    return { row, col, valid, point: valid ? point : -1 }
  }

  function renderFace() {
    let faceType = 'smiling'
    if (status === GAME_STATUS.WIN) {
      faceType = 'sunglasses'
    } else if (status === GAME_STATUS.LOSE) {
      faceType = 'sad'
    } else if (leftPressed || middlePressed) {
      faceType = 'surprised'
    }
    return <Face type={faceType} x={(CELL / 2) * COLS - 12} y={4} pressed={facePressed} />
  }
  // endregion
}
