export const LEFT_CLICK = 'LEFT_CLICK'
export function leftClick(point) {
  return { type: LEFT_CLICK, point }
}

export const MIDDLE_CLICK = 'MIDDLE_CLICK'
export function middleClick(point) {
  return { type: MIDDLE_CLICK, point }
}

export const RIGHT_CLICK = 'RIGHT_CLICK'
export function rightClick(point) {
  return { type: RIGHT_CLICK, point }
}

export const UNCOVER = 'UNCOVER'
export function uncover(point) {
  return { type: UNCOVER, point }
}

export const CHANGE_MODE = 'CHANGE_MODE'
export function changeMode(point, mode) {
  return { type: CHANGE_MODE, point, mode }
}

// TODO rename to REVEAL
export const UNCOVER_MULTIPLE = 'UNCOVER_MULTIPLE'
export function uncoverMultiple(pointSet) {
  return { type: UNCOVER_MULTIPLE, pointSet }
}

export const RESTART = 'RESTART'
export function restart() {
  return { type: RESTART }
}

export const GAME_OVER_WIN = 'GAME_OVER_WIN'
export function gameOverWin() {
  return { type: GAME_OVER_WIN }
}

export const GAME_OVER_LOSE = 'GAME_OVER_LOSE'
export function gameOverLose(failedPoints) {
  return { type: GAME_OVER_LOSE, failedPoints }
}

export const GAME_ON = 'GAME_ON'
export function gameOn(mines) {
  return { type: GAME_ON, mines }
}

export const TICK = 'TICK'
export function tick() {
  return { type: TICK }
}

export const RESET_TIMER = 'RESET_TIMER'
export function resetTimer() {
  return { type: RESET_TIMER }
}

export const SET_INDICATORS = 'SET_INDICATORS'
export function setIndicators(colorMap) {
  return { type: SET_INDICATORS, colorMap }
}

// { type: CLEAR_INDICATORS }
// todo ??目前并没有什么卵用??
export const CLEAR_INDICATORS = 'CLEAR_INDICATORS'
