import React from 'react'
import { Range } from 'immutable'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'
import Number from 'components/Number'
import { Mine, Flag, QuestionMark, Cover } from 'components/elements'
import { Grid, View } from 'components/layouts'
import { ROWS, COLS, COVERED, UNCOVERED, FLAG, QUESTIONED } from 'constants'
import { CLICK, RIGHT_CLICK } from 'actions'

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

  onClick = (event) => {
    // todo 计算坐标的时候 还需要算上svg的clientX和clientY
    const row = Math.floor((event.clientY - 51) / 16)
    const col = Math.floor((event.clientX - 8) / 16)
    if (row >= 0 && row < ROWS && col >= 0 && col <= COLS) {
      // console.log('user click row:', row, ' col:', col) // eslint-disable-line
      this.props.dispatch({ type: CLICK, t: row * COLS + col })
    }
  }

  onRightClick = (event) => {
    event.preventDefault()
    // todo 计算坐标的时候 还需要算上svg的clientX和clientY
    const row = Math.floor((event.clientY - 51) / 16)
    const col = Math.floor((event.clientX - 8) / 16)
    if (row >= 0 && row < ROWS && col >= 0 && col <= COLS) {
      // console.log('user click row:', row, ' col:', col) // eslint-disable-line
      this.props.dispatch({ type: RIGHT_CLICK, t: row * COLS + col })
    }
  }

  render() {
    const { mines, modes } = this.props

    const covers = []
    const elements = []

    Range(0, ROWS * COLS).forEach((t) => {
      const row = Math.floor(t / COLS)
      const col = Math.floor(t % COLS)
      switch (modes.get(t)) {
        case COVERED:
          covers.push(<Cover key={t} row={row} col={col} />)
          break
        case UNCOVERED:
          if (mines.get(t) === -1) {
            elements.push(<Mine key={t} row={row} col={col} />)
          } else if (mines.get(t) > 0) { // >= 0
            elements.push(
              <Number key={t} row={row} col={col} number={mines.get(t)} />
            )
          }
          break
        case FLAG:
          covers.push(<Cover key={t} row={row} col={col} />)
          elements.push(<Flag key={t} row={row} col={col} />)
          break
        case QUESTIONED:
          covers.push(<Cover key={t} row={row} col={col} />)
          elements.push(<QuestionMark key={t} row={row} col={col} />)
          break
        default:
          throw new Error(`Invalid mode: ${modes.get(t)}`)
      }
    })

    return (
      <svg
        className="svg"
        width="496"
        height="315"
        onClick={this.onClick}
        onContextMenu={this.onRightClick}
      >
        <View border={2} x={5} y={5} width={486} height={37}>
          {Range(0, 8).map(x =>
            <Number key={10000 + x} row={0} col={x} number={x + 1} />
          )}
          <Mine row={1} col={0} />
          <Mine row={1} col={1} exploded />
          <Mine row={1} col={2} cross />
          <Flag row={1} col={3} />
          <QuestionMark row={1} col={4} />
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
