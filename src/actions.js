export const LEFT_CLICK = 'LEFT_CLICK'
export function leftClick(t) {
  return { type: LEFT_CLICK, t }
}

export const MIDDLE_CLICK = 'MIDDLE_CLICK'
export function middleClick(t) {
  return { type: MIDDLE_CLICK, t }
}

export const RIGHT_CLICK = 'RIGHT_CLICK'
export function rightClick(t) {
  return { type: RIGHT_CLICK, t }
}

export const UNCOVER = 'UNCOVER'
export function uncover(t) {
  return { type: UNCOVER, t }
}

// TODO rename to CHANGE_MODE
export const MARK = 'MARK'
export function changeMode(t, mode) {
  return { type: MARK, t, mode }
}

export const UNCOVER_MULTIPLE = 'UNCOVER_MULTIPLE'
export function uncoverMultiple(ts) {
  return { type: UNCOVER_MULTIPLE, ts }
}

// { type: RESTART }
export const RESTART = 'RESTART'
export function restart() {
  return { type: RESTART }
}

export const GAME_OVER_WIN = 'GAME_OVER_WIN'
export function gameOverWin() {
  return { type: GAME_OVER_WIN }
}

export const GAME_OVER_LOSE = 'GAME_OVER_LOSE'
export function gameOverLose(failTs) {
  // failTs: <set-of-failed-points>
  return { type: GAME_OVER_LOSE, failTs }
}

// { type: GAME_ON, mines: <generated-mines> }
// TODO rename to GAME_START
export const GAME_ON = 'GAME_ON'
export function gameStart(mines) {
  return { type: GAME_ON, mines }
}

// { type: TICK }
export const TICK = 'TICK'
export function tick() {
  return { type: TICK }
}

export const RESET_TIMER = 'RESET_TIMER'
export function resetTimer() {
  return { type: RESET_TIMER }
}

export const SET_INDICATORS = 'SET_INDICATORS'
export function setIndicators(map) {
  // colorMap: <t -> color>
  return { type: SET_INDICATORS, map }
}

// { type: CLEAR_INDICATORS }
// todo 目前并没有什么卵用
export const CLEAR_INDICATORS = 'CLEAR_INDICATORS'
