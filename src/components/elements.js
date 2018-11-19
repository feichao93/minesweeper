import React from 'react'
import { BD_COLOR, CELL } from '../constants'
import { BitMap } from './layouts'

export const Mine = ({ row, col, exploded, cross }) => (
  <g role="mine" transform={`translate(${CELL * col}, ${CELL * row})`}>
    {exploded ? <rect x="1" y="1" width="15" height="15" fill="red" /> : null}
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
    {cross ? (
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
    ) : null}
  </g>
)

export const Flag = ({ row, col }) => (
  <g role="flag" transform={`translate(${CELL * col}, ${CELL * row})`}>
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

export const QuestionMark = ({ row, col }) => (
  <g role="question-mark" transform={`translate(${CELL * col}, ${CELL * row})`}>
    <path
      d="M6,3
         h4 v1 h1 v3 h-1 v1 h-1 v2 h-2 v-2 h1 v-1 h1
         v-3 h-2 v2 h-2 v-2 h1 v-1"
      fill="black"
    />
    <rect x="7" y="11" width="2" height="2" fill="black" />
  </g>
)

export const Cover = ({ row, col }) => (
  <g role="cover" transform={`translate(${CELL * col}, ${CELL * row})`}>
    <path d="M0, 0 h15 v1 h-1 v1 h-12 v12 h-1 v1 h-1 v-15" fill="white" />
    <path d="M15,1 h1 v15 h-15 v-1 h1 v-1 h13 v-13 h1 v-1" fill={BD_COLOR} />
  </g>
)

const smilingEyesAndMouth = (
  <g>
    <rect x="10" y="10" width="2" height="2" fill="black" />
    <rect x="15" y="10" width="2" height="2" fill="black" />
    <path
      d="M9,15
      h1 v1 h1 v1 h5 v-1 h1 v-1 h1
      v1 h-1 v1 h-1 v1 h-5 v-1 h-1 v-1 h-1 v-1"
      fill="black"
    />
  </g>
)

function getColor1(row, col) {
  return (row === 0 || row === 2) && (col === 0 || col === 2) ? '#808080' : 'black'
}
const surprisedEyesAndMouth = (
  <g>
    <BitMap x={9} y={9} width={3} height={3} getColor={getColor1} />
    <BitMap x={15} y={9} width={3} height={3} getColor={getColor1} />
    <g transform="translate(11,14)">
      <rect x="0" y="1" width="5" height="3" fill="#808000" />
      <rect x="1" y="0" width="3" height="5" fill="black" />
      <rect x="0" y="2" width="5" height="1" fill="black" />
      <rect x="1" y="2" width="3" height="1" fill="yellow" />
      <rect x="2" y="1" width="1" height="3" fill="yellow" />
    </g>
  </g>
)

function getColor2(row, col) {
  return (row + col) % 2 === 0 ? 'black' : 'yellow'
}
const sadEyesAndMouth = (
  <g>
    <BitMap x={9} y={9} width={3} height={3} getColor={getColor2} />
    <BitMap x={15} y={9} width={3} height={3} getColor={getColor2} />
    <path
      d="M11,15
       h5 v1 h1 v1 h1 v1 h-1 v-1 h-1 v-1 h-5 v1 h-1 v1 h-1 v-1 h1 v-1 h1"
      fill="black"
    />
  </g>
)

const sunglassesEyesAndMouth = (
  <g>
    <path
      d="M9,10
        h9 v1 h1 v1 h1 v1 h1 v1 h-1 v-1 h-1 v-1 h-1
        v1 h-1 v1 h-2 v-1 h-1 v-2 h-1 v2 h-1 v1 h-2
        v-1 h-1 v-1 h-1 v1 h-1 v1 h-1 v-1 h1 v-1 h1 v-1 h1 v-1"
      fill="black"
    />
    <rect x="9" y="13" width="1" height="1" fill="#808000" />
    <rect x="17" y="13" width="1" height="1" fill="#808000" />
    <path
      d="M10,16
        h1 v1 h5 v-1 h1 v1 h-1 v1 h-5 v-1 h-1 v-1"
      fill="black"
    />
  </g>
)

export const Face = ({ x, y, type, pressed }) => (
  <g transform={`translate(${x}, ${y})`}>
    {/* 边框 */}
    {pressed ? (
      <g>
        <path d="M0,0 h25 v2 h-23 v23 h-2 v-25" fill={BD_COLOR} />
        <path d="M25,1 h1 v25 h-25 v-1 h24 v-24" fill={BD_COLOR} />
      </g>
    ) : (
      <g>
        <path d="M0,0 h25 v1 h-24 v24 h-1 v-25" fill={BD_COLOR} />
        <path d="M1,1 h23 v1 h-1 v1 h-20 v20 h-1 v1 h-1 v-23" fill="white" />
        <path d="M23,3 h1 v-1 h1 v-1 h1 v25 h-25 v-1 h1 v-1 h1 v-1 h20 v-20" fill={BD_COLOR} />
      </g>
    )}

    <g transform={pressed ? 'translate(1,1)' : ''}>
      {/* 脸的外轮廓 */}
      <path
        d="M11,5
         h5  v1  h2  v1  h1  v1  h1  v1  h1  v2  h1
         v5 h-1  v2 h-1  v1 h-1  v1 h-1  v1 h-2  v1
        h-5 v-1 h-2 v-1 h-1 v-1 h-1 v-1 h-1 v-2 h-1
        v-5  h1 v-2  h1 v-1  h1 v-1  h1 v-1  h2 v-1"
        fill="black"
      />

      {/* 脸的内轮廓 */}
      <path
        d="M11,6
         h5  v1  h2  v1  h1  v1  h1  v2  h1
         v5 h-1  v2 h-1  v1 h-1  v1 h-2  v1
        h-5 v-1 h-2 v-1 h-1 v-1 h-1 v-2 h-1
        v-5  h1 v-2  h1 v-1  h1 v-1  h2 v-1"
        fill="yellow"
      />

      {type === 'smiling' ? smilingEyesAndMouth : null}
      {type === 'surprised' ? surprisedEyesAndMouth : null}
      {type === 'sad' ? sadEyesAndMouth : null}
      {type === 'sunglasses' ? sunglassesEyesAndMouth : null}
    </g>
  </g>
)

function segmentBackgroundForA(row, col) {
  const black = (row + col) % 2 === 1 || (row === 2 && col === 0) || (row === 2 && col === 6)
  return black ? null : '#800000'
}

function segmentBackgroundForBC(row, col) {
  const black = (row + col) % 2 === 1 || (row === 0 && col === 0) || (row === 8 && col === 0)
  return black ? null : '#800000'
}

function segmentBackgroundForD(row, col) {
  const black = (row + col) % 2 === 1 || (row === 0 && col === 0) || (row === 0 && col === 6)
  return black ? null : '#800000'
}

function segmentBackgroundForEF(row, col) {
  const black = (row + col) % 2 === 1 || (row === 0 && col === 2) || (row === 8 && col === 2)
  return black ? null : '#800000'
}

function segmentBackgroundForG(row, col) {
  return (row + col) % 2 === 1 ? '#800000' : null
}

function getBit(x, t) {
  return x & (1 << t)
}

// Positions of the 7 segments:
//     a
//   -----
// f|     |b
//  |  g  |
//   -----
// e|     |c
//  |  d  |
//   -----
export const SevenSegmentDisplay = ({ x, y, number }) => {
  // number为-1的话, 显示一个负号. number在[0-9]之间的话, 显示正常的数字
  const bits =
    number === -1 ? 0x40 : [0x3f, 0x06, 0x5b, 0x4f, 0x66, 0x6d, 0x7d, 0x07, 0x7f, 0x6f][number]
  const a = getBit(bits, 0)
  const b = getBit(bits, 1)
  const c = getBit(bits, 2)
  const d = getBit(bits, 3)
  const e = getBit(bits, 4)
  const f = getBit(bits, 5)
  const g = getBit(bits, 6)
  return (
    <g transform={`translate(${x},${y})`}>
      {a ? (
        <path d="M1,0 h9 v1 h-1 v1 h-1 v1 h-5 v-1 h-1 v-1 h-1 v-1" fill="red" />
      ) : (
        <BitMap x={2} y={0} width={7} height={3} getColor={segmentBackgroundForA} />
      )}
      {b ? (
        <path d="M10,1 h1 v9 h-1 v-1 h-1 v-1 h-1 v-5 h1 v-1 h1 v-1" fill="red" />
      ) : (
        <BitMap x={8} y={1} width={3} height={9} getColor={segmentBackgroundForBC} />
      )}
      {c ? (
        <path d="M10,11 h1 v9 h-1 v-1 h-1 v-1 h-1 v-5 h1 v-1 h1 v-1" fill="red" />
      ) : (
        <BitMap x={8} y={11} width={3} height={9} getColor={segmentBackgroundForBC} />
      )}
      {d ? (
        <path d="M3,18 h5 v1 h1 v1 h1 v1 h-9 v-1 h1 v-1 h1 v-1" fill="red" />
      ) : (
        <BitMap x={2} y={18} width={7} height={3} getColor={segmentBackgroundForD} />
      )}
      {e ? (
        <path d="M0,11 h1 v1 h1 v1 h1 v5 h-1 v1 h-1 v1 h-1 v-9" fill="red" />
      ) : (
        <BitMap x={0} y={11} width={3} height={9} getColor={segmentBackgroundForEF} />
      )}
      {f ? (
        <path d="M0,1 h1 v1 h1 v1 h1 v5 h-1 v1 h-1 v1 h-1 v-9" fill="red" />
      ) : (
        <BitMap x={0} y={1} width={3} height={9} getColor={segmentBackgroundForEF} />
      )}
      {g ? (
        <path d="M3,9 h5 v1 h1 v1 h-1 v1 h-5 v-1 h-1 v-1 h1 v-1" fill="red" />
      ) : (
        <BitMap x={2} y={9} width={7} height={3} getColor={segmentBackgroundForG} />
      )}
    </g>
  )
}

export const LED = ({ x, y, number }) => (
  <g transform={`translate(${x},${y})`}>
    <g role="border">
      <rect x="0" y="0" width="40" height="1" fill={BD_COLOR} />
      <rect x="0" y="0" width="1" height="24" fill={BD_COLOR} />
      <rect x="40" y="1" width="1" height="24" fill="white" />
      <rect x="1" y="24" width="40" height="1" fill="white" />
    </g>

    <rect role="background" x="1" y="1" width="39" height="23" fill="black" />
    <SevenSegmentDisplay x={2} y={2} number={number < 0 ? -1 : Math.floor(number / 100)} />
    <SevenSegmentDisplay x={15} y={2} number={Math.floor((Math.abs(number) % 100) / 10)} />
    <SevenSegmentDisplay x={28} y={2} number={Math.abs(number) % 10} />
  </g>
)
