import React from 'react'
import { Range } from 'immutable'
import { ROWS, COLS, BD_COLOR, BG_COLOR } from 'constants'

export const BitMap = ({ x = 0, y = 0, rows, cols, getColor }) => (
  <g transform={`translate(${x}, ${y})`}>
    {Range(0, rows * cols).map((t) => {
      const row = Math.floor(t / cols)
      const col = t % cols
      return (
        <rect
          key={t}
          x={col}
          y={row}
          fill={getColor(row, col)}
          width="1"
          height="1"
        />
      )
    })}
  </g>
)
BitMap.propTypes = {
  x: React.PropTypes.number.isRequired,
  y: React.PropTypes.number.isRequired,
  rows: React.PropTypes.number.isRequired,
  cols: React.PropTypes.number.isRequired,
  getColor: React.PropTypes.func.isRequired,
}

const BorderCorner = ({ x = 0, y = 0, border }) => {
  function getColor(row, col) {
    if (row + col === border - 1) {
      return BG_COLOR
    } else if (row + col < border - 1) {
      return BD_COLOR
    } else {
      return 'white'
    }
  }

  return <BitMap x={x} y={y} rows={border} cols={border} getColor={getColor} />
}
BorderCorner.propTypes = {
  x: React.PropTypes.number.isRequired,
  y: React.PropTypes.number.isRequired,
  border: React.PropTypes.number.isRequired,
}

export const View = ({ border, x = 0, y = 0, width, height, children }) => (
  <g transform={`translate(${x}, ${y})`}>
    <g role="borders">
      <rect role="border-left" width={border} height={height} fill={BD_COLOR} />
      <rect role="border-top" width={width} height={border} fill={BD_COLOR} />
      <rect role="border-right" x={width - border} width={border} height={height} fill="white" />
      <rect role="border-bottom" y={height - border} width={width} height={border} fill="white" />
      <BorderCorner key="bottom-left" x={0} y={height - border} border={border} />
      <BorderCorner key="top-right" x={width - border} y={0} border={border} />
    </g>

    <g transform={`translate(${border}, ${border})`}>
      {children}
    </g>
  </g>
)
View.propTypes = {
  x: React.PropTypes.number.isRequired,
  y: React.PropTypes.number.isRequired,
  border: React.PropTypes.number.isRequired,
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired,
  children: React.PropTypes.node,
}

export const Grid = () => (
  <g>
    {Range(0, ROWS).map(row =>
      <rect
        key={row}
        x="0"
        y={row * 16}
        width={COLS * 16}
        height="1"
        fill={BD_COLOR}
      />
    )}
    {Range(0, COLS).map(col =>
      <rect
        key={col}
        x={col * 16}
        y="0"
        width="1"
        height={ROWS * 16}
        fill={BD_COLOR}
      />
    )}
  </g>
)
