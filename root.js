import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import createTileLayer from './createTileLayer'

class root extends React.Component {
  constructor() {
    super()
    this.state = {}
    this.state.layers = [0]

    this.addLayerSelectionRow = this.addLayerSelectionRow.bind(this);
    this.createLayer = this.createLayer.bind(this);
    this.removeLayer = this.removeLayer.bind(this);
  }

  //This is called when the user clicks the button to add a new layer.
  addLayerSelectionRow() {
    var allLayers = this.state.layers
    allLayers.push(allLayers.length)
    this.setState({layers: allLayers})
    //createLayer will be called at the end of this chain, after all the data has come back from the server.
  }
  
  //This is called when the use selects a time value for the layer.
  //This also happens once when the layer selection row is first loaded, the 0th time value is auto selected for the user.
  createLayer({layerKey, url}) {
    this.props.putLayer(layerKey, url)
  }

  removeLayer({layerKey}) {
    var allLayers = this.state.layers;
    allLayers[layerKey] = undefined;
    this.setState({layers: allLayers});

    this.props.removeLayer({layerKey})
  }

  render() {
    return React.createElement('div', {className: 'root'},
      React.createElement('div', {className: 'row addLayerRow'},
        React.createElement('div', {className: 'addLayer col-sm-1'},
          React.createElement('div', {className: 'btn btn-default', onClick: this.addLayerSelectionRow}, 'Add a layer')
        )
      ),
      _.map(this.state.layers, (layerKey) =>
        (layerKey !== undefined) && React.createElement(createTileLayer, {key: layerKey, layerKey: layerKey, putLayer: this.createLayer, removeLayer: this.removeLayer})
      )
    )
  }
}

export default root