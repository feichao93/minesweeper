import React from 'react'

const styles = {
  app: {
    display: 'flex',
    flexFlow: 'column',
    width: 600,
  },
  header: {
    height: 200,
    display: 'flex',
  },
  remaining: {
    width: 40,
  },
  timing: {
    width: 40,
    marginLeft: 'auto',
  },
  main: {},
}

export default class App extends React.Component {
  render() {
    return (
      <div style={styles.app}>
        <header style={styles.header}>
          <div style={styles.remaining} />
          <div style={styles.timing} />
        </header>
        <main style={styles.main} />
      </div>
    )
  }
}
