// { type: LEFT_CLICK, t: <point> }
export const LEFT_CLICK = 'LEFT_CLICK'

// { type: MIDDLE_CLICK, t: <point> }
export const MIDDLE_CLICK = 'MIDDLE_CLICK'

// { type: RIGHT_CLICK, t: <point> }
export const RIGHT_CLICK = 'RIGHT_CLICK'

// { type: UNCOVER, t: <point> }
export const UNCOVER = 'UNCOVER'

// { type: MARK, mark: <mark>, t: <point> }
export const MARK = 'MARK'

// { type: UNCOVER_MULTIPLE, ts: <point-list> }
export const UNCOVER_MULTIPLE = 'UNCOVER_MULTIPLE'

// { type: RESTART }
export const RESTART = 'RESTART'

// { type: GAME_OVER_WIN }
export const GAME_OVER_WIN = 'GAME_OVER_WIN'

// { type: GAME_OVER_LOSE, failTs: <set-of-failed-points> }
export const GAME_OVER_LOSE = 'GAME_OVER_LOSE'

// { type: GAME_ON, mines: <generated-mines> }
export const GAME_ON = 'GAME_ON'

// { type: TICK }
export const TICK = 'TICK'

// { type: RESET_TIMER }
export const RESET_TIMER = 'RESET_TIMER'

// { type: SET_INDICATORS, map: <t -> color> }
export const SET_INDICATORS = 'SET_INDICATORS'

// { type: CLEAR_INDICATORS }
// todo 目前并没有什么卵用
export const CLEAR_INDICATORS = 'CLEAR_INDICATORS'
