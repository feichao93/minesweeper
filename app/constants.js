/* eslint-disable import/no-mutable-exports */
import queryString from 'query-string'
import { strip } from 'common'

const { rows, cols, mines } = queryString.parse(document.location.search)

let ROWS
let COLS
let MINE_COUNT
if (rows === '' || isNaN(rows)) {
  ROWS = 16
} else {
  ROWS = strip(5, rows, 40)
}

if (cols === '' || isNaN(cols)) {
  COLS = 30
} else {
  COLS = strip(8, cols, 60)
}

if (mines === '' || isNaN(mines)) {
  MINE_COUNT = ROWS * COLS * 0.2
} else {
  MINE_COUNT = Math.floor(strip(0.05, mines / (ROWS * COLS), 0.3) * ROWS * COLS)
}

history.replaceState(null, null, `?rows=${ROWS}&cols=${COLS}&mines=${MINE_COUNT}`)

export { ROWS, COLS, MINE_COUNT }

export const CELL = 16 // 格子的大小

// 样式
export const BG_COLOR = '#c0c0c0'
export const BD_COLOR = '#808080'

// 模式
export const MODES = {
  UNCOVERED: 'UNCOVERED',   // 点开
  COVERED: 'COVERED',       // 没有点开
  FLAG: 'FLAG',             // 加上了旗子
  QUESTIONED: 'QUESTIONED', // 加上了问号
  CROSS: 'CROSS',           // 用在LOSE stage下, 表明旗子插错了
  EXPLODED: 'EXPLODED',     // 用在LOSE stage下, 表明触发了地雷
}

// 游戏阶段
export const STAGES = {
  IDLE: 'IDLE', // 空白
  ON: 'ON',     // 正在进行游戏
  WIN: 'WIN',   // 获胜
  LOSE: 'LOSE', // 失败
}
