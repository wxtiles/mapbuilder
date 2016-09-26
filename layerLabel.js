import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import select from 'react-select'

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
        (!this.props.layers) && React.createElement('div', {className: 'loadingLayers'}, 'Downloading layers...'),
        (this.props.layers) && React.createElement('div', {},
          React.createElement(select, {
            options: this.props.layers,
            placeholder: 'Select a layer...',
            value: this.props.layer,
            onChange: this.props.selectLayer,
            clearable: false
          })
        ),
      ),
      React.createElement('span', {className: 'chevy glyphicon glyphicon-move'}, '')
    )
  }
}

export default layerLabel
