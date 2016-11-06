import { createStore, applyMiddleware } from 'redux'
import createSgaMiddleware from 'redux-saga'
import reducer from 'reducer'

import rootSaga from 'sagas'

const sagaMiddleware = createSgaMiddleware()

export default createStore(reducer,
  applyMiddleware(sagaMiddleware))

sagaMiddleware.run(rootSaga)
