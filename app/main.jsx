import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { Provider } from 'react-redux'
import store from 'store'
import App from './App.jsx'

ReactDOM.render(
  <AppContainer>
    <Provider store={store}>
      <App />
    </Provider>
  </AppContainer>,
  document.getElementById('container')
)

// hot-reload for App
if (module.hot) {
  module.hot.accept('./App.jsx', () => {
    /* eslint-disable global-require, react/require-extension */
    const NewApp = require('./App.jsx').default

    ReactDOM.render(
      <AppContainer>
        <Provider store={store}>
          <NewApp />
        </Provider>
      </AppContainer>,
      document.getElementById('container')
    )
  })
}
