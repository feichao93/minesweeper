import React from 'react'
import { Range, Set } from 'immutable'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'
import Number from 'components/Number'
import { Face, Mine, Flag, QuestionMark, Cover } from 'components/elements'
import { Grid, View } from 'components/layouts'
import { neighbors } from 'common'
import { LEFT_CLICK, MIDDLE_CLICK, RIGHT_CLICK, RESTART } from 'actions'
import { ROWS, COLS, CELL_SIZE, STAGES, MODES } from 'constants'

function mapStateToProps(state) {
  return state.toObject()
}

@connect(mapStateToProps)
export default class App extends React.Component {
  static propTypes = {
    stage: React.PropTypes.string.isRequired,
    mines: ImmutablePropTypes.listOf(React.PropTypes.number).isRequired,
    modes: ImmutablePropTypes.list.isRequired,
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

  // todo 在stage不是IDLE/ON的情况下 禁用鼠标事件

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

    // 对应face
    if (x >= 235 && x <= 261 && y >= 11 && y <= 37) {
      return { row: 0, col: 0, valid: false, t: -1, isFace: true } // todo 去掉valid字段
    }

    const row = Math.floor((y - 51) / CELL_SIZE)
    const col = Math.floor((x - 8) / CELL_SIZE)
    const valid = row >= 0 && row < ROWS && col >= 0 && col <= COLS
    const t = row * COLS + col
    return { row, col, valid, t: valid ? t : -1 } // todo 返回值中去掉valid
  }

  isGameOn() {
    const { stage } = this.props
    return stage === STAGES.IDLE || stage === STAGES.ON
  }

  render() {
    const { stage, mines, modes } = this.props
    const { btn1, btn2, point, pressFace } = this.state

    // console.log('game-stage:', stage)

    let faceType = 'smiling'
    if (stage === STAGES.WIN) {
      faceType = 'sunglasses'
    } else if (stage === STAGES.LOSE) {
      faceType = 'sad'
    } else if (btn1 || btn2) {
      faceType = 'surprised'
    }

    let dontNeedCover = Set()
    if (point !== -1) {
      if (btn1) {
        dontNeedCover = Set([point])
      } else if (btn2) {
        dontNeedCover = Set(neighbors(point))
      }
    }

    const range = Range(0, ROWS * COLS)

    const covers = []
    range.forEach((t) => {
      const row = Math.floor(t / COLS)
      const col = Math.floor(t % COLS)
      const mode = modes.get(t)
      if ((mode === MODES.COVERED && !dontNeedCover.has(t))
        || mode === MODES.FLAG || mode === MODES.QUESTIONED) {
        covers.push(<Cover key={t} row={row} col={col} />)
      }
    })

    const elements = []
    range.forEach((t) => {
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

    return (
      <svg
        className="svg"
        ref={node => (this.svgNode = node)}
        width="496"
        height="315"
        onContextMenu={this.onContextMenu}
        onMouseDown={this.onMouseDown}
        onMouseMove={this.onMouseMove}
        onMouseUp={this.onMouseUp}
      >
        <View border={2} x={5} y={5} width={486} height={37}>
          {Range(0, 8).map(x =>
            <Number key={x} row={0} col={x} number={x + 1} />
          )}
          <Mine row={1} col={0} />
          <Mine row={1} col={1} exploded />
          <Mine row={1} col={2} cross />
          <Flag row={1} col={3} />
          <QuestionMark row={1} col={4} />
          <Face type={faceType} x={228} y={4} pressed={pressFace} />
        </View>
        <View border={3} x={5} y={48} width={486} height={262}>
          <Grid />
          {covers}
          {elements}
        </View>
      </svg>
    )
  }
}
