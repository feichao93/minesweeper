import React from 'react'
import Number from 'Number'
import { Mine, Flag, QuestionMark, Cover } from 'elements'
import { Grid, View } from 'layouts'

export default class App extends React.Component {
  render() {
    return (
      <svg className="svg" width="496" height="315">
        <View border={2} x={5} y={5} width={486} height={37} />
        <View border={3} x={5} y={48} width={486} height={262}>
          <Grid />
          <Cover row={2} col={0} />
          <Cover row={2} col={1} />
          <Cover row={2} col={2} />
          <Cover row={2} col={3} />
          <Number row={0} col={0} number={1} />
          <Number row={0} col={1} number={2} />
          <Number row={0} col={2} number={3} />
          <Number row={0} col={3} number={4} />
          <Mine row={1} col={0} />
          <Mine row={1} col={1} exploded />
          <Flag row={1} col={2} />
          <QuestionMark row={1} col={3} />
          <Flag row={2} col={2} />
          <QuestionMark row={2} col={3} />
        </View>
      </svg>
    )
  }
}
