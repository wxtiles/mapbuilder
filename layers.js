import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import createTileLayer from './createTileLayer'

class layers extends React.Component {
  constructor() {
    super()
    this.state = {}
    this.state.layers = []
    this.state.totalLayers = 0

    this.addLayerSelectionRow = this.addLayerSelectionRow.bind(this)
    this.createLayer = this.createLayer.bind(this)
    this.removeLayer = this.removeLayer.bind(this)
  }

  componentWillMount() {
    this.addLayerSelectionRow()
  }

  //This is called when the user clicks the button to add a new layer.
  addLayerSelectionRow() {
    var allLayers = this.state.layers
    allLayers.unshift(this.state.totalLayers+1)
    this.setState({layers: allLayers, totalLayers: this.state.totalLayers+1})
    //createLayer will be called at the end of this chain, after all the data has come back from the server.
  }

  //This is called when the use selects a time value for the layer.
  //This also happens once when the slayer selection row is first loaded, the 0th time value is auto selected for the user.
  createLayer({layerKey, url}) {
    this.props.putLayer(layerKey, url)
  }

  removeLayer({layerKey}) {
    var allLayers = this.state.layers;
    allLayers.splice(allLayers.indexOf(layerKey), 1)
    this.setState({layers: allLayers});
    this.props.removeLayer({layerKey})
  }

  render() {
    return React.createElement('div', {className: 'layers'},
      React.createElement('div', { className: 'paddingContainer'}, ''),
      React.createElement('ul', {},
        React.createElement('li', {className: 'addLayerRow'},
          React.createElement('div', {className: 'btn btn-success addLayer', onClick: this.addLayerSelectionRow}, 'Add a layer')
        ),
        _.map(this.state.layers, (layerKey) =>
          (layerKey !== undefined) && React.createElement(createTileLayer, {key: layerKey, layerKey: layerKey, putLayer: this.createLayer, removeLayer: this.removeLayer})
        )
      )
    )
  }
}

export default layers
