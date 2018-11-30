import { clamp } from './common'

const params = new URLSearchParams(document.location.search)
const rows = Number(params.get('rows'))
const cols = Number(params.get('cols'))
const mines = Number(params.get('mines'))

export const ROWS = isNaN(rows) || Number(rows) === 0 ? 16 : clamp(5, rows, 40)
export const COLS = isNaN(cols) || Number(cols) === 0 ? 30 : clamp(8, cols, 60)

export const USE_HINT = params.has('hint')
export const USE_AUTO = params.has('auto')

export const MINE_COUNT =
  isNaN(mines) || mines === 0
    ? ROWS * COLS * 0.20625
    : Math.floor(clamp(0.05, mines / (ROWS * COLS), 0.3) * ROWS * COLS)

history.replaceState(
  null,
  null,
  `?rows=${ROWS}&cols=${COLS}&mines=${MINE_COUNT}` +
    `${USE_HINT ? '&hint' : ''}${USE_AUTO ? '&auto' : ''}`,
)

// 当 mines.get(point) === -1 说明该位置下有地雷
export const MINE = -1

// 格子的大小
export const CELL = 16

// 样式
export const BG_COLOR = '#c0c0c0'
export const BD_COLOR = '#808080'

// 每个格子的模式
export const MODES = {
  REVEALED: 'REVEALED', // 点开
  COVERED: 'COVERED', // 没有点开
  FLAG: 'FLAG', // 加上了旗子
  QUESTIONED: 'QUESTIONED', // 加上了问号
  CROSS: 'CROSS', // 用在 game.status === LOSE 下, 表明旗子插错了
  EXPLODED: 'EXPLODED', // 用在 game.status === LOSE 下, 表明触发了地雷
}

// 游戏状态
export const GAME_STATUS = {
  IDLE: 'IDLE', // 空白
  ON: 'ON', // 正在进行游戏
  WIN: 'WIN', // 获胜
  LOSE: 'LOSE', // 失败
}
