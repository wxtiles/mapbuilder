import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import createTileLayer from './createTileLayer'
import dragula from 'react-dragula';

class layers extends React.Component {
  constructor() {
    super()
    this.state = {}
    this.state.layers = []
    this.state.totalLayers = 0
    this.state.shouldShowLayerMenu = true
    this.state.isMakingUrl = false
    this.drake = null

    this.addLayerSelectionRow = this.addLayerSelectionRow.bind(this)
    this.createLayer = this.createLayer.bind(this)
    this.removeLayer = this.removeLayer.bind(this)
    this.toggleLayerMenu = this.toggleLayerMenu.bind(this)
    this.setOpacityOfLayer = this.setOpacityOfLayer.bind(this)
  }

  componentDidMount() {
    var drake = dragula([document.querySelector('#testIdizzle')], {
      moves: (el, source, handle, sibling) => {
        return handle.classList.contains('glyphicon-move');
      }
    })

    drake.on('drop', (el, target, source, sibling) => {
      var layersInDom = drake.containers[0].children
      var layersState = this.state.layers
      var layers = _.map(this.state.layers, (layer) => {
        if(!layer) return undefined
        var indexOfLayer = _.findIndex(layersInDom, (layerDom) => {
          return layerDom.attributes[1].nodeValue == layer.key
        })
        layer.zIndex = layersInDom.length - indexOfLayer
        return layer
      })
      this.setState({layers: layers})
      layers.forEach((layer) => {
        if (!layer) return
        this.props.updateLayers({layerKey: layer.key, layerObject: layer})
      })
    })
    this.setState({drake}, () => {
      this.addLayerSelectionRow()
    })
  }

  //This is called when the user clicks the button to add a new layer.
  addLayerSelectionRow() {
    var allLayers = this.state.layers
    allLayers.unshift({
      key: this.state.totalLayers,
      zIndex: this.state.totalLayers
    })

    this.setState({layers: allLayers, totalLayers: this.state.totalLayers+1})
    //createLayer will be called at the end of this chain, after all the data has come back from the server.
  }

  //This is called when the use selects a time value for the layer.
  //This also happens once when the slayer selection row is first loaded, the 0th time value is auto selected for the user.
  createLayer({url, layerObject}) {
    var layers = this.state.layers
    var index = _.findIndex(layers, (layer) => {
      if (!layer) return false
      return (layer.key == layerObject.key)
    })
    layerObject.zIndex = layers[index].zIndex
    layers[index] = layerObject
    this.setState({layers: layers})
    this.props.putLayer({layerObject, url})
    this.props.updateLayers({layerKey: layerObject.key, layerObject: layerObject})
  }

  removeLayer({key}) {
    var layers = this.state.layers;
    var index = _.findIndex(layers, (layer) => {
      if (!layer) return false
      return (layer.key == key)
    })
    layers[index] = null
    this.setState({layers: layers});
    this.props.removeLayer({layerKey: key})
    this.props.updateLayers({layerObject: null})
  }

  toggleLayerMenu() {
    this.setState({shouldShowLayerMenu: !this.state.shouldShowLayerMenu}, () => {
      if (this.state.shouldShowLayerMenu)
        document.querySelector('#layerEditor').style['max-width'] = '100%'
      else
        document.querySelector('#layerEditor').style['max-width'] = '50px'
    })
  }

  setOpacityOfLayer({layerObject}) {
    this.props.setOpacityOfLayer({layerObject})
    this.props.updateLayers({layerObject})
  }

  render() {
    return React.createElement('div', {className: 'layers'},
      React.createElement('div', {},
        React.createElement('div', {className: 'addLayerRow'},
          React.createElement('div', {className: 'btn btn-success addLayer', onClick: this.addLayerSelectionRow}, 'Add a layer')
        ),
        React.createElement('div', {id: 'testIdizzle'},
          _.map(this.state.layers, (layer) =>
            layer && React.createElement('div', {className: 'layerContainer', key: layer.key, 'data-key': layer.key},
              React.createElement(createTileLayer, {layerKey: layer.key, putLayer: this.createLayer, removeLayer: this.removeLayer, setOpacityOfLayer: this.setOpacityOfLayer})
            )
          )
        )
      )
    )
  }
}

export default layers
