import React from 'react'
import { Range } from 'immutable'
import { BD_COLOR, BG_COLOR, CELL, COLS, ROWS } from '../constants'

export const BitMap = React.memo(({ x = 0, y = 0, height, width, getColor }) => (
  <g transform={`translate(${x}, ${y})`}>
    {Range(0, height * width)
      .map(point => {
        const row = Math.floor(point / width)
        const col = point % width
        const color = getColor(row, col)
        return color ? (
          <rect key={point} x={col} y={row} fill={getColor(row, col)} width="1" height="1" />
        ) : null
      })
      .filter(Boolean)}
  </g>
))

const BorderCorner = React.memo(({ x = 0, y = 0, border }) => {
  function getColor(row, col) {
    if (row + col === border - 1) {
      return BG_COLOR
    } else if (row + col < border - 1) {
      return BD_COLOR
    } else {
      return 'white'
    }
  }

  return <BitMap x={x} y={y} width={border} height={border} getColor={getColor} />
})

export const View = React.memo(({ border, x = 0, y = 0, width, height, children }) => (
  <g transform={`translate(${x}, ${y})`}>
    <g role="borders">
      <rect role="border-left" width={border} height={height} fill={BD_COLOR} />
      <rect role="border-top" width={width} height={border} fill={BD_COLOR} />
      <rect role="border-right" x={width - border} width={border} height={height} fill="white" />
      <rect role="border-bottom" y={height - border} width={width} height={border} fill="white" />
      <BorderCorner key="bottom-left" x={0} y={height - border} border={border} />
      <BorderCorner key="top-right" x={width - border} y={0} border={border} />
    </g>

    <g transform={`translate(${border}, ${border})`}>{children}</g>
  </g>
))

export const Grid = React.memo(() => (
  <g>
    {Range(0, ROWS).map(row => (
      <rect key={row} x="0" y={row * CELL} width={COLS * CELL} height="1" fill={BD_COLOR} />
    ))}
    {Range(0, COLS).map(col => (
      <rect key={col} x={col * CELL} y="0" width="1" height={ROWS * CELL} fill={BD_COLOR} />
    ))}
  </g>
))
