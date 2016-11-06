/* eslint-disable react/prop-types */
import React from 'react'

const elements = {
  1: ({ dx, dy }) => (
    <path
      d={`M${dx + 8},${dy + 3}
        h2 v8 h2 v2 h-7 v-2 h2 v-4 h-2 v-1 h1 v-1 h1 v-1 h1 v-1`}
      fill="blue"
    />
  ),

  2: ({ dx, dy }) => (
    <path
      d={`M${dx + 4},${dy + 3}
        h8 v1 h1 v3 h-1 v1 h-1 v1 h-2 v1 h-2 v1 h6 v2 h-10
        v-3 h1 v-1 h2 v-1 h2 v-1 h2 v-2 h-4 v1 h-3 v-2 h1 v-1`}
      fill="#008000"
    />
  ),

  3: ({ dx, dy }) => (
    <path
      d={`M${dx + 3},${dy + 3}
        h9 v1 h1 v3 h-1 v2 h1 v3 h-1 v1 h-9 v-2 h7 v-2 h-4 v-2 h4
        v-2 h-7 v-2`}
      fill="red"
    />
  ),

  4: ({ dx, dy }) => (
    <path
      d={`M${dx + 5},${dy + 3}
        h3 v2 h-1 v2 h2 v-4 h3 v4 h1 v2 h-1 v4 h-3 v-4 h-6 v-2 h1
        v-2 h1 v-2`}
      fill="#000080"
    />
  ),

  // todo 5,6,7,8
}

const Number = ({ row, col, number }) => {
  const dx = 16 * col
  const dy = 16 * row
  const Element = elements[number]
  return <Element dx={dx} dy={dy} />
}
Number.propTypes = {
  row: React.PropTypes.number.isRequired,
  col: React.PropTypes.number.isRequired,
  number: React.PropTypes.number.isRequired,
}

export default Number
