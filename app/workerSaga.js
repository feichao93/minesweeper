/* eslint-disable no-constant-condition */
import Worker from 'worker!worker'
import { take, put, select } from 'redux-saga/effects'
import { UNCOVER, UNCOVER_MULTIPLE } from 'actions'

const worker = new Worker()

export default function* workerSaga() {
  while (true) {
    yield take([UNCOVER, UNCOVER_MULTIPLE])
    const { modes, mines } = (yield select()).toObject()
    worker.postMessage(JSON.stringify({ modes, mines }))
  }
}
