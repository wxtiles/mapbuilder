import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'

class layerLabel extends React.Component {
  constructor() {
    super()
    this.state = {}
  }

  componentWillMount() {
  }

  render() {
    return React.createElement('div', {className: 'layerLabel'}, 'layer label')
  }
}

export default layerLabel
