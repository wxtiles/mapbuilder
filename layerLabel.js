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
    var chevron = 'glyphicon-chevron-up'
    if(this.props.isCollapsed) {
      chevron = 'glyphicon-chevron-down'
    }
    return React.createElement('div', {className: 'layerLabel'},
      React.createElement('div', {className: 'layerLabel-text'},
        React.createElement('span', {}, this.props.label)
      ),
      React.createElement('span', {className: 'glyphicon ' + chevron}, '')
    )
  }
}

export default layerLabel
