console.log('hello. This is worker.')

onmessage = function (event) { // eslint-disable-line no-undef
  console.log('receive:', event.data)
  postMessage('echo')
}
