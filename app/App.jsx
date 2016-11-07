import React from 'react'
import { Range, Set } from 'immutable'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'
import Number from 'components/Number'
import { Face, Mine, Flag, QuestionMark, Cover } from 'components/elements'
import { Grid, View } from 'components/layouts'
import { neighbors } from 'common'
import { ROWS, COLS, COVERED, UNCOVERED, FLAG, QUESTIONED, CELL_SIZE } from 'constants'
import { LEFT_CLICK, MIDDLE_CLICK, RIGHT_CLICK } from 'actions'

function mapStateToProps(state) {
  return state.toObject()
}

@connect(mapStateToProps)
export default class App extends React.Component {
  static propTypes = {
    mines: ImmutablePropTypes.listOf(React.PropTypes.number).isRequired,
    modes: ImmutablePropTypes.list.isRequired,
    // callbacks
    dispatch: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.svg = null
    this.state = {
      btn1: false, // 左键是否被按下
      btn2: false, // 中间是否被按下
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
      if (!btn1) {
        this.setState({ btn1: true, btn2: false, point: result.t })
      }
    } else if (event.button === 1) { // middle-button
      if (!btn2) {
        this.setState({ btn1: false, btn2: true, point: result.t })
      }
    } else if (event.button === 2) { // right-button
      if (result.valid) {
        this.props.dispatch({ type: RIGHT_CLICK, t: result.t })
      }
    } // else other button, ignore
  }

  onMouseMove = (event) => {
    const { btn1, btn2 } = this.state
    if (btn1 || btn2) {
      const result = this.calculate(event)
      if (result.valid) {
        this.setState({ point: result.t })
      }
    }
  }

  onMouseUp = (event) => {
    // console.log('mouse-up:', this.calculate(event))
    const { btn1, btn2 } = this.state
    if (event.button === 0) {
      if (btn1) {
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
    const svgRect = this.svg.getBoundingClientRect()
    const row = Math.floor((clientY - svgRect.top - 51) / CELL_SIZE)
    const col = Math.floor((clientX - svgRect.left - 8) / CELL_SIZE)
    const valid = row >= 0 && row < ROWS && col >= 0 && col <= COLS
    const t = row * COLS + col
    return { row, col, valid, t: valid ? t : -1 } // todo 返回值中去掉valid
  }

  render() {
    const { mines, modes } = this.props
    const { btn1, btn2, point } = this.state

    let faceType = 'smiling' // todo faceType管理
    if (btn1 || btn2) {
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
      if ((mode === COVERED && !dontNeedCover.has(t))
        || mode === FLAG || mode === QUESTIONED) {
        covers.push(<Cover key={t} row={row} col={col} />)
      }
    })

    const elements = []
    range.forEach((t) => {
      const row = Math.floor(t / COLS)
      const col = Math.floor(t % COLS)
      const mode = modes.get(t)
      if (mode === UNCOVERED) {
        if (mines.get(t) === -1) {
          elements.push(<Mine key={t} row={row} col={col} />)
        } else if (mines.get(t) > 0) { // >= 0
          elements.push(
            <Number key={t} row={row} col={col} number={mines.get(t)} />
          )
        }
      } else if (mode === FLAG) {
        elements.push(<Flag key={t} row={row} col={col} />)
      } else if (mode === QUESTIONED) {
        elements.push(<QuestionMark key={t} row={row} col={col} />)
      }
    })

    return (
      <div>
        <svg
          className="svg"
          ref={node => (this.svg = node)}
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
            <Face type={faceType} x={228} y={4} />
          </View>
          <View border={3} x={5} y={48} width={486} height={262}>
            <Grid />
            {covers}
            {elements}
          </View>
        </svg>
        <div>
          <p>btn1: {String(btn1)}</p>
          <p>btn2: {String(btn2)}</p>
          <p>point: {String(point)}</p>
        </div>
      </div>
    )
  }
}
