import 'regenerator-runtime/runtime'
import 'mobx-react-lite/batchingForReactDom'

import React from 'react'
import ReactDOM from 'react-dom'

import {App} from './components/App'

ReactDOM.render(<App />, document.querySelector('#app'))
