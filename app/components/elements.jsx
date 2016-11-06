import React from 'react'
import { BD_COLOR } from 'constants'

export const Mine = ({ row, col, exploded, cross }) => (
  <g role="mine" transform={`translate(${16 * col}, ${16 * row})`}>
    {exploded ?
      <rect x="1" y="1" width="15" height="15" fill="red" />
      : null}
    <path
      d="M8,2
           h1  v2  h2  v1  h1  v1  h1  v2  h2
           v1 h-2  v2 h-1  v1 h-1  v1 h-2  v2
          h-1 v-2 h-2 v-1 h-1 v-1 h-1 v-2 h-2
          v-1  h2 v-2  h1 v-1  h1 v-1  h2 v-2"
      fill="black"
    />
    <rect x="6" y="6" width="2" height="2" fill="white" />
    <rect x="4" y="4" width="1" height="1" fill="black" />
    <rect x="12" y="4" width="1" height="1" fill="black" />
    <rect x="4" y="12" width="1" height="1" fill="black" />
    <rect x="12" y="12" width="1" height="1" fill="black" />
    {cross ?
      <path
        d="M2,3
            h2 v1 h1 v1 h1 v1 h1 v1 h1 v1 h1
            v-1 h1 v-1 h1 v-1 h1 v-1 h1 v-1 h2
            v1 h-1 v1 h-1 v1 h-1 v1 h-1 v1 h-1 v2
            h1 v1 h1 v1 h1 v1 h1 v1 h1 v1
            h-2 v-1 h-1 v-1 h-1 v-1 h-1 v-1 h-1 v-1 h-1
            v1 h-1 v1 h-1 v1 h-1 v1 h-1 v1 h-2
            v-1 h1 v-1 h1 v-1 h1 v-1 h1 v-1 h1 v-2
            h-1 v-1 h-1 v-1 h-1 v-1 h-1 v-1 h-1 v-1"
        fill="red"
      />
      : null}
  </g>
)
Mine.propTypes = {
  row: React.PropTypes.number.isRequired,
  col: React.PropTypes.number.isRequired,
  exploded: React.PropTypes.bool,
  cross: React.PropTypes.bool,
}

export const Flag = ({ row, col }) => (
  <g role="flag" transform={`translate(${16 * col}, ${16 * row})`}>
    <path
      d="M7,3
         h2 v5 h-2 v-1 h-2 v-1 h-1 v-1 h1 v-1 h2 v-1"
      fill="red"
    />
    <path
      d="M8,8
         h1 v2 h1 v1 h2 v2 h-8 v-2 h2 v-1 h2 v-2"
      fill="black"
    />
  </g>
)
Flag.propTypes = {
  row: React.PropTypes.number.isRequired,
  col: React.PropTypes.number.isRequired,
}

export const QuestionMark = ({ row, col }) => (
  <g role="question-mark" transform={`translate(${16 * col}, ${16 * row})`}>
    <path
      d="M6,3
         h4 v1 h1 v3 h-1 v1 h-1 v2 h-2 v-2 h1 v-1 h1
         v-3 h-2 v2 h-2 v-2 h1 v-1"
      fill="black"
    />
    <rect x="7" y="11" width="2" height="2" fill="black" />
  </g>
)
QuestionMark.propTypes = {
  row: React.PropTypes.number.isRequired,
  col: React.PropTypes.number.isRequired,
}

export const Cover = ({ row, col }) => (
  <g role="cover" transform={`translate(${16 * col}, ${16 * row})`}>
    <path
      d="M0, 0 h15 v1 h-1 v1 h-12 v12 h-1 v1 h-1 v-15"
      fill="white"
    />
    <path
      d="M15,1 h1 v15 h-15 v-1 h1 v-1 h13 v-13 h1 v-1"
      fill={BD_COLOR}
    />
  </g>
)
Cover.propTypes = {
  row: React.PropTypes.number.isRequired,
  col: React.PropTypes.number.isRequired,
}
