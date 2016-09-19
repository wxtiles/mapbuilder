import React from 'react'
import ReactDOM from 'react-dom'
import layers from './layers'

class root extends React.Component {
  constructor() {
    super()
    this.state = {}
  }

  componentWillMount() {
  }

  render() {
    return React.createElement('div', {className: 'root'},
      React.createElement(layers, {putLayer: this.props.putLayer, removeLayer: this.props.removeLayer, setOpacityOfLayer: this.props.setOpacityOfLayer})
    )
  }
}

export default root
