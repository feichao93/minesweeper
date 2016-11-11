/* eslint-disable react/prop-types */
import React from 'react'
import { BG_COLOR, CELL } from 'constants'

const numbers = {
  1: ({ dx, dy }) => (
    <path
      role="number-1"
      d={`M${dx + 8},${dy + 3}
        h2 v8 h2 v2 h-7 v-2 h2 v-4 h-2 v-1 h1 v-1 h1 v-1 h1 v-1`}
      fill="blue"
    />
  ),

  2: ({ dx, dy }) => (
    <path
      role="number-2"
      d={`M${dx + 4},${dy + 3}
        h8 v1 h1 v3 h-1 v1 h-1 v1 h-2 v1 h-2 v1 h6 v2 h-10
        v-3 h1 v-1 h2 v-1 h2 v-1 h2 v-2 h-4 v1 h-3 v-2 h1 v-1`}
      fill="#008000"
    />
  ),

  3: ({ dx, dy }) => (
    <path
      role="number-3"
      d={`M${dx + 3},${dy + 3}
        h9 v1 h1 v3 h-1 v2 h1 v3 h-1 v1 h-9 v-2 h7 v-2 h-4 v-2 h4
        v-2 h-7 v-2`}
      fill="red"
    />
  ),

  4: ({ dx, dy }) => (
    <path
      role="number-4"
      d={`M${dx + 5},${dy + 3}
        h3 v2 h-1 v2 h2 v-4 h3 v4 h1 v2 h-1 v4 h-3 v-4 h-6 v-2 h1
        v-2 h1 v-2`}
      fill="#000080"
    />
  ),

  5: ({ dx, dy }) => (
    <path
      role="number-5"
      d={`M${dx + 3},${dy + 3}
          h10 v2 h-7 v2 h6 v1 h1 v4 h-1 v1 h-9
          v-2 h7 v-2 h-7 v-6`}
      fill="#800000"
    />
  ),

  6: ({ dx, dy }) => (
    <g role="number-6" transform={`translate(${dx},${dy})`}>
      <path
        d={`M4,3
          h8 v2 h-6 v2 h6 v1 h1 v4 h-1
          v1 h-8 v-1 h-1 v-8 h1 v-1`}
        fill="#008080"
      />
      <rect x="6" y="9" width="4" height="2" fill={BG_COLOR} />
    </g>
  ),

  7: ({ dx, dy }) => (
    <path
      role="number-7"
      d={`M${dx + 3},${dy + 3}
          h10 v4 h-1 v2 h-1 v2 h-1 v2 h-3 v-2 h1
          v-2 h1 v-2 h1 v-2 h-7 v-2`}
      fill="#000000"
    />
  ),

  8: ({ dx, dy }) => (
    <g role="number-8" transform={`translate(${dx},${dy})`}>
      <path
        d={`M4,3
           h8  v1  h1  v3 h-1  v2  h1  v3 h-1  v1
          h-8 v-1 h-1 v-3  h1 v-2 h-1 v-3  h1 v-1`}
        fill="#808080"
      />
      <rect x="6" y="5" width="4" height="2" fill={BG_COLOR} />
      <rect x="6" y="9" width="4" height="2" fill={BG_COLOR} />
    </g>
  ),
}

const Number = ({ row, col, number }) => {
  const dx = CELL * col
  const dy = CELL * row
  const Element = numbers[number]
  return <Element dx={dx} dy={dy} />
}
Number.propTypes = {
  row: React.PropTypes.number.isRequired,
  col: React.PropTypes.number.isRequired,
  number: React.PropTypes.number.isRequired,
}

export default Number
