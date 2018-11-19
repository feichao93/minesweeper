# minesweeper
Minesweeper game built with React, Redux and Redux-saga.

## Play

[Play online](http://shinima.pw/minesweeper/?rows=16&cols=30&mines=99)

[Play with hints](http://shinima.pw/minesweeper/?rows=16&cols=30&mines=99&ai)

[Let AI play the game!](http://shinima.pw/minesweeper/?rows=16&cols=30&mines=99&auto)

As you can see, you could configure the game via the URL. Enjoy yourself.

## Introduction

> Minesweeper is a single-player puzzle video game. The objective of the game is to clear a rectangular board containing hidden "mines" or bombs without detonating any of them, with help from clues about the number of neighboring mines in each field.

![screenshot](docs/screenshot.bmp)

The UI of minesweeper game is quite straightforward: there are 480(30 * 16, advanced level default) tiles and each tile is covered or uncovered. Every covered tile may or may not have a mine under it. Every uncovered tile shows the number of neighboring mines. Our task is to clear/open all the tiles while avoiding mines.

Data structure of the game state is not hard to design and implement. But when we play the game, the game state changes a lot and the UI changes a lot. It is straightforward to manipulate data but it's trivial to synchronize the UI with state. It is a very suitable case for React, because React can synchronize the UI with the data according the render function that we define.

## Framework

This project uses [React](https://facebook.github.io/react/) to draw the UI, [Redux](http://redux.js.org/) to manage the state of the game, [immutable](https://facebook.github.io/immutable-js/) as the data structure utilities, and [redux-saga](https://redux-saga.js.org/) to handle the complexity of player interactions. Other used packages can be viewed in *package.json*. If you are familiar with these packages, then it is easy to figure out how the game runs.

## Data

### Data structure design

By default, the game contains 480(30*16) tiles.

We use array `mines` of length 480 to store whether there is a mine under tile. Tile at row `row` and col `col` corresponds to array index `row * 30 + col`. `-1` in the array means there is a mine. A non-negative number `x` means there is no mine under the tile and there are `x`  neighboring mines.

We use another array `modes` to store the mode of each tile. Each tile has one of the following modes:

* `COVERED`  means it is covered now. (Initial mode).
* `UNCOVERED` means it is uncovered now. (After player clicks the tile or open propagation).
* `FLAG`  means that player right-clicks the tile and marks there's a mine under the tile.
* `QUESTIONED` means that player right-clicks the tile twice and marks there may be a mine under the tile.
* `CROSS` means that player mark the wrong flags when game fails.
* `EXPLODED` means that this tile with a mine leads to game fail.

And `status` keeps the game state/status. Game status is one of the following 4 choices: *IDLE*, *ON*, *WIN*, *LOSE*

In *IDLE* status, all tiles are covered and the timer is stopped, and when player click one tile timer will start and status will become *ON*. In *ON* status, there are some tiles uncovered and timer is counting which means the game is running. Once player clears all tiles or detonates a mine, then status becomes *WIN* or *LOSE*.

`timer` keeps the number of seconds since game start.

`indicators` is used for AI auto playing the game. See the code for detail.

### Using the data structure to render the tiles

`status`, `mines`, `modes` and `timer`, the four variables together are sufficient to describe the total game state.

The render loginc of the 480 tiles are defined in `App#renderElements` in *app/App.js*. For each tile at `row`-th row `col`-th column that corresponds to array index `i = row * 30 + col`, we examine `modes[i]` and `mines[i]` to determine what should be rendered as follows:

1. If `modes[i]` is `UNCOVERD`, then a `<Mine />` or `<Number number={x} />` should be rendered according to `mines[i]`;
2. If `modes[i]` is `FLAG` or `QUESTIONED`, then a `<Flag />` or `<QuestionMark />`is renderd;
3. If `modes[i]` is `CROSS` OR `EXPLODED`, then a `<Mine />` with properties corss/exploded set should be renderd;
4. Else `modes[i]` is `COVERED`, render nothing.

### Data structure and interactions

`status` indicates global game state and influences the player interactions. Only in `IDLE`/`ON` status should game handle click actions. On `WIN`/`LOSE` status it is supposed that player must click the face to restart the game.

Besides left-click, we needs to handle middle-click (uncover neighboring tiles) and right-click (toggle among `COVERD`, `FLAG`, `QUESTIONED`). The game supports mouse movement with left-button or middle-button pressed, so wee need to track the mouse state. Because mouse state is not related with global game state, we puts the mouse state in `App#state`.

In `App#state`, field `btn1`/`btn2` records whether left-button/middle-button is pressed now. Field `point` records the array index of the tile under the mouse. We add event listeners at svg element to manipulate these fields. The event listeners are `App#onContextMenu`, `App#onMouseDown`, `App#onMouseMove` and `App#onMouseUp`.

In `onMouseDown`, if the game is not running, then the mouse down event is ignored, which is equivalent to disabling interactions. We do not add `onClick` event listener. The click actions are dispatched in `onMouseUp` after checking the mouse state. Is this way we implements mouse interactions that allow click behavior and allow mouse movement when the button is pressed.

The mouse interactions will be translated to three kinds of redux actions: `LEFT_CLICK`, `MIDDLE_CLICK` and `RIGHT_CLICK`. The action describes which button is clicked and the corresponding tile array index. There three kinds of actions are processed by saga in *app/sagas.js* which will translate them into more detailed actions like `UNCOVER_MULTIPLE` or `GAME_ON` for reducers.

Detailed logic could be viewed in *app/App.js* and *app/sagas.js*.

## Sagas and reducers

The game main loop is managed by sagas and reducers. The root saga in *app/sagas.js* starts several other sagas.

Saga `handleXxxClick` handles click actions and translate them into more detailed actions which will be processed by reducers. 

Saga `timerHandler` watches for `GAME_OVER_WIN` / `GAME_OVER_LOSE` / `RESTART` actions and then reset timer. This saga also forks a `tickEmitter` to emit a tick action every second when the game status is `ON`.

Saga `watchUncover` watches for uncover actions. If player clears all tiles then this saga dispatch a `GAME_OVER_WIN` action; If player detonates a mine then this saga dispatch `GAME_OVER_LOSE`.

Saga `handleLeftClick` handles `LEFT_CLICK` actions. A `LEFT_CLICK` action describes that player click one tile and wants to open/uncover it. If we generates mines before player's first click , then the first click may encounter a mine and it is frustrating. So we generates mines after the first click and ensure first click can make a open propagation. When handling click actions in `IDLE` status, the left click must be the first left click; In `ON` status, it is not the first click. 

Since in `IDLE` status mines have not been generated, `defaultMines` is used (in *app/common.js*). Function `generateMines` (in *app/common*) uses reservoir sampling algothrim and could generate random mines.

Saga `handleMiddleClick` handles `MIDDLE_CLICK` actions. It first checks the number at the tile (the tile is uncovered, so it has a number) is equal to the number of neighboring flags. If the two numbers are equals, it means that neighboring covered tiles are supported to be safe, so it will uncover all the safe tiles at once.

Saga `handleRightClick` handles `RIGHT_CLICK` actions and dispatch `MARK` actions.

Most logic is implemented in sagas. Reducers is somewhat light and is not covered here.

## Components

![components](docs/components.bmp)

Components are listed in the above image. The first line contains an `<LED />`, four `<Face />` with different facial expressions. The `<LED />` contains three `<SevenSegmentDisplay />` and a border. The second line contains several `<Number />`. The third line contains `<Mine />`, `<Flag />`, `<QuestionMark />` and `<Cover />`.
