import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import createTileLayer from './createTileLayer'

class root extends React.Component {
  constructor() {
    super()
    this.state = {}
    this.state.layers = [0]

    this.addLayer = this.addLayer.bind(this);
    this.createLayer = this.createLayer.bind(this);
  }

  componentWillMount() {

  }

  addLayer() {
    var allLayers = this.state.layers
    allLayers.push(allLayers.length)
    this.setState({layers: allLayers})
  }

  createLayer({url}) {
    this.props.putLayer(url)
  }

  render() {
    return React.createElement('div', {className: 'root'},
      React.createElement('div', {className: 'row addLayerRow'},
        React.createElement('div', {className: 'addLayer col-sm-1'},
          React.createElement('div', {className: 'btn btn-default', onClick: this.addLayer}, '+Layer')
        )
      ),
      _.map(this.state.layers, (layerKey) =>
        React.createElement(createTileLayer, {key: layerKey, putLayer: this.createLayer})
      )
    )
  }
}

export default root
