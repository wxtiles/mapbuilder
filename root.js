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
    this.removeLayer = this.removeLayer.bind(this);
  }

  componentWillMount() {

  }

  addLayer() {
    var allLayers = this.state.layers
    allLayers.push(allLayers.length)
    this.setState({layers: allLayers})
  }

  removeLayer(layerKey) {
    var allLayers = this.state.layers
    //TODO: If I just remove the layer here, then this layer list will get out of sync with the layer list passed to the maps.
    //These lists should be merged.
    //May be move all the index stuff to be under here?
    this.props.removeLayer(layerKey)
  }

  createLayer({layerKey, url}) {
    this.props.putLayer(layerKey, url)
  }

  render() {
    return React.createElement('div', {className: 'root'},
      React.createElement('div', {className: 'row addLayerRow'},
        React.createElement('div', {className: 'addLayer col-sm-1'},
          React.createElement('div', {className: 'btn btn-default', onClick: this.addLayer}, '+Layer')
        )
      ),
      _.map(this.state.layers, (layerKey) =>
        React.createElement(createTileLayer, {key: layerKey, layerKey: layerKey, putLayer: this.createLayer, removeLayer: this.removeLayer})
      )
    )
  }
}

export default root
