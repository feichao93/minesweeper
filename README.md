# minesweeper
Minesweeper game built with React, Redux and Redux-saga.

## Play

[Play online](http://shinima.pw/minesweeper/?rows=16&cols=30&mines=99)

[Play with hints](http://shinima.pw/minesweeper/?rows=16&cols=30&mines=99&ai)

[Let AI play the game!](http://shinima.pw/minesweeper/?rows=16&cols=30&mines=99&auto)

As you can see, you could configure the game via the URL. Enjoy yourself.

## Introduction

> Minesweeper is a single-player puzzle video game. The objective of the game is to clear a rectangular board containing hidden "mines" or bombs without detonating any of them, with help from clues about the number of neighboring mines in each field.

The user interface of minesweeper game is quite straightforward: there are 480(30 * 16, advanced level) tiles and each tile is covered or uncovered. Every covered tile may or may not have a mine under it. Every uncovered tile shows the number of mines around that tile. Our task is to find all the safe tile among the tiles while avoiding mines.

Data structure of the game state is not hard to design and implement. But when we play the game, the game state changes a lot and the UI changes a lot. It is straightforward to manipulate data but it's trivial to sync UI with state. This is a very suitable case for React, because React can sync you UI with the data according the Function that define.

## Framework

This project uses [React](https://facebook.github.io/react/) to draw the UI, [Redux](http://redux.js.org/) to manage the state of the game, [immutable](https://facebook.github.io/immutable-js/) as the data structure utilities, and [redux-saga](https://redux-saga.js.org/) to handle the complexity of user interactions. Other used packages can be viewed in *package.json*. If you are familiar with these packages, then it is easy to figure out how the game runs.

## File structure

As the project is small, the file structure is clear.

* The entry file of the application is *app/main.jsx*.
* The UI is rendered by component `App` in *app/App.jsx*.
* Sub-components are defined in folder *app/components*.
* Game state is defined and manipulated in *app/reducer.js.*

## Data structure

By default, the game contains 480(30*16) tiles.

We use array `mines` of length 480 to store whether there is a mine under tile. Tile at row `row` and col `col` corresponds to array index `row * 30 + col`. A `-1` in the array means there is a mine. A non-negative number `x` means there is no mine under the tile and there are `x` mines around this tile.

We use another array `modes` to store the mode of each tile. Each tile has one of the following modes:

* `COVERED`  means it is covered now. (Initial mode).
* `UNCOVERED` means it is uncovered now. (After user clicks the tile or cover propagation).
* `FLAG`  means that player right-clicks the tile and marks there's a mine under the tile.
* `QUESTIONED` means that player double-right-clicks and marks there may be a mine under the tile.
* `CROSS` means that player mark the wrong flags when game fails.
* `EXPLODED` means that this tile with a mine leads to game fail.

And `stage` keeps the game state/stage. Game stage is one of the following 4 choices: `IDLE`, `ON`, `WIN`, `LOSE` whose meaning is indicated by the name.

`timer` keeps the number of seconds since game start.

`indicators` is used for AI auto playing the game. See the code for more information.

### Render logic

`stage`, `mines`, `modes` and `time`, the four variables are sufficient to describe the total game state.

One of the tasks of `App#render` is to render the 480 tiles. For each tile, if the mode of the tile is `COVERED` then we simply render with a simple gray rectangle (indeed it is two \<path/> ). If the mode is not `UNCOVERD`, then we need render with an element. An element is one of the following: 

* a `<Number />`
* a `<Flag />`
* a `<Mine />`

The props of element can be calculated from `modes` and `mines`. The render detail can be viewed in `App#renderCover` and `App#renderElements` in *app/App.jsx*.

`stage` influences the player interactions and some other UI. Only in `ON` stage game handle the click at tile.

# TODO

* how the game handle left-click, middle-click and right-click
* how the game generates mines according to ensure first click could make a uncover propagation.
* components compositon: BitMap -> Segment -> SevenSegmentDisplay -> LED
* brief of redux-saga related code logic
* the simple AI and web worker