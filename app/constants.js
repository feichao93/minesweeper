// 扫雷配置 TODO 变为可配置的, 而不是固定的
export const ROWS = 16
export const COLS = 30
export const MINE_COUNT = 99
export const CELL_SIZE = 16 // 格子的大小

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
