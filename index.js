import React from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'
import root from './root'

ReactDOM.render(React.createElement(root, {now: moment.utc()}), document.querySelector('#root'))
