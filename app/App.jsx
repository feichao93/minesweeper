import React from 'react'
import { Range, Set } from 'immutable'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'
import Number from 'components/Number'
import { Face, Mine, Flag, QuestionMark, Cover, LED } from 'components/elements'
import { Grid, View } from 'components/layouts'
import Indicators from 'components/Indicators'
import { neighbors } from 'common'
import { LEFT_CLICK, MIDDLE_CLICK, RIGHT_CLICK, RESTART } from 'actions'
import { ROWS, COLS, CELL, STAGES, MODES } from 'constants'

function mapStateToProps(state) {
  return state.toObject()
}

@connect(mapStateToProps)
export default class App extends React.Component {
  static propTypes = {
    stage: React.PropTypes.string.isRequired,
    mines: ImmutablePropTypes.listOf(React.PropTypes.number).isRequired,
    modes: ImmutablePropTypes.list.isRequired,
    timer: React.PropTypes.number.isRequired,
    indicators: ImmutablePropTypes.mapOf(React.PropTypes.string).isRequired,
    // callbacks
    dispatch: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.svgNode = null
    this.state = {
      btn1: false, // 左键是否被按下
      btn2: false, // 中间是否被按下
      pressFace: false, // face是否被按下
      point: -1, // 鼠标所在的位置(只在鼠标按下的情况下有效).
    }
  }

  onContextMenu = (event) => {
    event.preventDefault()
  }

  onMouseDown = (event) => {
    const { btn1, btn2 } = this.state
    const result = this.calculate(event)
    if (event.button === 0) { // left-button
      if (result.isFace) {
        this.setState({ pressFace: true })
      } else if (this.isGameOn() && !btn1) {
        this.setState({ btn1: true, btn2: false, point: result.t })
      }
    } else if (event.button === 1) { // middle-button
      event.preventDefault()
      if (this.isGameOn() && !btn2) {
        this.setState({ btn1: false, btn2: true, point: result.t })
      }
    } else if (event.button === 2) { // right-button
      if (this.isGameOn() && result.valid) {
        this.props.dispatch({ type: RIGHT_CLICK, t: result.t })
      }
    } // else other button, ignore
  }

  onMouseMove = (event) => {
    const { btn1, btn2 } = this.state
    if (btn1 || btn2) {
      const result = this.calculate(event)
      // todo pressFace时, 如果鼠标移开了face的位置, 则不会触发restart
      if (result.valid) {
        this.setState({ point: result.t })
      }
    }
  }

  onMouseUp = (event) => {
    const { btn1, btn2, pressFace } = this.state
    if (event.button === 0) {
      if (pressFace) {
        this.setState({ pressFace: false })
        this.props.dispatch({ type: RESTART })
      } else if (btn1) {
        this.setState({ btn1: false })
        const result = this.calculate(event)
        if (result.valid) {
          this.props.dispatch({ type: LEFT_CLICK, t: result.t })
        }
      }
    } else if (event.button === 1) {
      if (btn2) {
        this.setState({ btn2: false })
        const result = this.calculate(event)
        if (result.valid) {
          this.props.dispatch({ type: MIDDLE_CLICK, t: result.t })
        }
      }
    } // else other button, ignore
  }

  calculate({ clientX, clientY }) {
    const svgRect = this.svgNode.getBoundingClientRect()
    const x = clientX - svgRect.left
    const y = clientY - svgRect.top

    // 判断是否点击到了face
    const faceSize = 26
    const faceOffsetX = 7
    const faceOffsetY = 7
    const faceLeft = CELL / 2 * COLS - 12 + faceSize / 2
    if (faceLeft <= x + faceOffsetX && x + faceOffsetX <= faceLeft + faceSize
      && y >= 4 + faceOffsetY && y <= 4 + faceOffsetY + faceSize) {
      return { row: 0, col: 0, valid: false, t: -1, isFace: true }
    }

    const row = Math.floor((y - 51) / CELL)
    const col = Math.floor((x - 8) / CELL)
    const valid = row >= 0 && row < ROWS && col >= 0 && col <= COLS
    const t = row * COLS + col
    return { row, col, valid, t: valid ? t : -1 }
  }

  isGameOn() {
    const { stage } = this.props
    return stage === STAGES.IDLE || stage === STAGES.ON
  }

  renderFace() {
    const { stage } = this.props
    const { btn1, btn2, pressFace } = this.state

    let faceType = 'smiling'
    if (stage === STAGES.WIN) {
      faceType = 'sunglasses'
    } else if (stage === STAGES.LOSE) {
      faceType = 'sad'
    } else if (btn1 || btn2) {
      faceType = 'surprised'
    }
    return <Face type={faceType} x={CELL / 2 * COLS - 12} y={4} pressed={pressFace} />
  }

  renderCovers() {
    const { modes } = this.props
    const { btn1, btn2, point } = this.state
    let dontNeedCover = Set()

    if (point !== -1) {
      if (btn1) {
        dontNeedCover = Set([point])
      } else if (btn2) {
        dontNeedCover = Set(neighbors(point))
      }
    }
    const covers = []
    Range(0, ROWS * COLS).forEach((t) => {
      const row = Math.floor(t / COLS)
      const col = Math.floor(t % COLS)
      const mode = modes.get(t)
      if ((mode === MODES.COVERED && !dontNeedCover.has(t))
        || mode === MODES.FLAG || mode === MODES.QUESTIONED) {
        covers.push(<Cover key={t} row={row} col={col} />)
      }
    })
    return covers
  }

  renderElements() {
    const { mines, modes } = this.props

    const elements = []
    Range(0, ROWS * COLS).forEach((t) => {
      const row = Math.floor(t / COLS)
      const col = Math.floor(t % COLS)
      const mode = modes.get(t)
      if (mode === MODES.UNCOVERED) {
        if (mines.get(t) === -1) {
          elements.push(<Mine key={t} row={row} col={col} />)
        } else if (mines.get(t) > 0) { // >= 0
          elements.push(
            <Number key={t} row={row} col={col} number={mines.get(t)} />
          )
        }
      } else if (mode === MODES.FLAG) {
        elements.push(<Flag key={t} row={row} col={col} />)
      } else if (mode === MODES.QUESTIONED) {
        elements.push(<QuestionMark key={t} row={row} col={col} />)
      } else if (mode === MODES.CROSS) {
        elements.push(<Mine key={t} row={row} col={col} cross />)
      } else if (mode === MODES.EXPLODED) {
        elements.push(<Mine key={t} row={row} col={col} exploded />)
      }
    })
    return elements
  }

  render() {
    const { mines, modes, timer, indicators } = this.props

    const filterdIndicators = indicators.filter((_, t) => modes.get(t) === MODES.COVERED)

    const mineCount = mines.filter(mine => mine === -1).count()
    const flagCount = modes.filter(mode => mode === MODES.FLAG).count()

    return (
      <svg
        className="svg"
        ref={node => (this.svgNode = node)}
        width={COLS * CELL + 16}
        height={59 + 16 * ROWS}
        onContextMenu={this.onContextMenu}
        onMouseDown={this.onMouseDown}
        onMouseMove={this.onMouseMove}
        onMouseUp={this.onMouseUp}
      >
        <View border={2} x={5} y={5} width={COLS * CELL + 6} height={37}>
          <LED x={5} y={4} number={mineCount - flagCount} />
          {this.renderFace()}
          <LED x={CELL * COLS - 46} y={4} number={timer} />
        </View>
        <View border={3} x={5} y={48} width={COLS * CELL + 6} height={ROWS * CELL + 6}>
          <Grid />
          {this.renderElements()}
          {this.renderCovers()}
          <Indicators indicators={filterdIndicators} />
        </View>
      </svg>
    )
  }
}
