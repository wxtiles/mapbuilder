import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import createTileLayer from './createTileLayer'
import dragula from 'react-dragula';

class layersEditor extends React.Component {
  constructor() {
    super()
    this.state = {}
    this.state.totalLayers = 1
    this.state.shouldShowLayerMenu = true
    this.state.isMakingUrl = false
    this.drake = null

    this.addLayerSelectionRow = this.addLayerSelectionRow.bind(this)
    this.createLayer = this.createLayer.bind(this)
    this.removeLayer = this.removeLayer.bind(this)
    this.toggleLayerMenu = this.toggleLayerMenu.bind(this)
  }

  componentDidMount() {
    var drake = dragula([document.querySelector('#testIdizzle')], {
      moves: (el, source, handle, sibling) => {
        return handle.classList.contains('glyphicon-move');
      }
    })

    drake.on('drop', (el, target, source, sibling) => {
      var layersInDom = drake.containers[0].children
      var layers = this.props.layers
      layers = _.map(layers, (layer) => {
        if(!layer) return undefined
        var indexOfLayer = _.findIndex(layersInDom, (layerDom) => {
          return layerDom.attributes[1].nodeValue == layer.key
        })
        layer.zIndex = layersInDom.length - indexOfLayer
        return layer
      })
      this.props.updateLayers({layers})
    })
    this.setState({drake}, () => {
    })
  }

  //This is called when the user clicks the button to add a new layer.
  addLayerSelectionRow() {
    var layers = this.props.layers
    layers.unshift({
      key: this.state.totalLayers,
      zIndex: this.state.totalLayers,
      opacity: 1
    })
    this.setState({totalLayers: this.state.totalLayers+1}, () => {
      this.props.updateLayers({layers})
    })
    //createLayer will be called at the end of this chain, after all the data has come back from the server.
  }

  //This is called when the use selects a time value for the layer.
  //This also happens once when the layer selection row is first loaded, the 0th time value is auto selected for the user.
  createLayer({layerObject}) {
    var layers = this.props.layers
    var layerIndex = _.findIndex(layers, (layer) => {
      if (!layer) return false
      return (layer.key == layerObject.key)
    })
    layers[layerIndex] = layerObject
    this.props.updateLayers({layers})
  }

  removeLayer({key}) {
    var layers = this.props.layers
    layers = _.remove(layers, (layer) => layer.key != key)
    this.props.updateLayers({layers})
  }

  toggleLayerMenu() {
    this.setState({shouldShowLayerMenu: !this.state.shouldShowLayerMenu}, () => {
      if (this.state.shouldShowLayerMenu)
        document.querySelector('#layerEditor').style['max-width'] = '100%'
      else
        document.querySelector('#layerEditor').style['max-width'] = '50px'
    })
  }

  render() {
    return React.createElement('div', {className: 'layers'},
      React.createElement('div', {},
        React.createElement('div', {className: 'addLayerRow'},
          React.createElement('div', {className: 'btn btn-success addLayer', onClick: this.addLayerSelectionRow}, 'Add a layer')
        ),
        React.createElement('div', {id: 'testIdizzle'},
          _.map(this.props.layers, (layer) =>
            layer && React.createElement('div', {className: 'layerContainer', key: layer.key, 'data-key': layer.key},
              React.createElement(createTileLayer, {layer, layerOptions: this.props.layerOptions, updateLayer: this.createLayer, removeLayer: this.removeLayer})
            )
          )
        )
      )
    )
  }
}

export default layersEditor
