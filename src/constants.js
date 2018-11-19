import { clamp } from './common'

const params = new URLSearchParams(document.location.search)

const rows = params.get('rows')
const cols = params.get('cols')
const mines = params.get('mines')

export const USE_AI = params.has('ai')
export const USE_AUTO = params.has('auto')

let ROWS
let COLS
let MINE_COUNT
if (isNaN(rows) || Number(rows) === 0) {
  ROWS = 16
} else {
  ROWS = clamp(5, rows, 40)
}

if (isNaN(cols) || Number(cols) === 0) {
  COLS = 30
} else {
  COLS = clamp(8, cols, 60)
}

if (isNaN(mines) || Number(mines) === 0) {
  MINE_COUNT = ROWS * COLS * 0.20625
} else {
  MINE_COUNT = Math.floor(clamp(0.05, mines / (ROWS * COLS), 0.3) * ROWS * COLS)
}

history.replaceState(
  null,
  null,
  `?rows=${ROWS}&cols=${COLS}&mines=${MINE_COUNT}${USE_AI ? '&ai' : ''}${USE_AUTO ? '&auto' : ''}`,
)

export { ROWS, COLS, MINE_COUNT }

export const CELL = 16 // 格子的大小

// 样式
export const BG_COLOR = '#c0c0c0'
export const BD_COLOR = '#808080'

// 模式
export const MODES = {
  UNCOVERED: 'UNCOVERED', // 点开
  COVERED: 'COVERED', // 没有点开
  FLAG: 'FLAG', // 加上了旗子
  QUESTIONED: 'QUESTIONED', // 加上了问号
  CROSS: 'CROSS', // 用在 game.status === LOSE 下, 表明旗子插错了
  EXPLODED: 'EXPLODED', // 用在 game.status === LOSE 下, 表明触发了地雷
}

// 游戏阶段
export const GAME_STATUS = {
  IDLE: 'IDLE', // 空白
  ON: 'ON', // 正在进行游戏
  WIN: 'WIN', // 获胜
  LOSE: 'LOSE', // 失败
}
