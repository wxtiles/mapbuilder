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
    return React.createElement('div', {className: 'layerLabel'},
      React.createElement('div', {className: 'removey glyphicon glyphicon-remove remove-button', onClick: this.props.deleteLayer}, ''),
      React.createElement('div', {className: 'layerLabel-text'},
        React.createElement('span', {}, this.props.label)
      ),
      React.createElement('span', {className: 'chevy glyphicon glyphicon-move'}, '')
    )
  }
}

export default layerLabel
