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
    this.state.allLayerIds = []
    this.state.isMakingUrl = false

    this.addLayerSelectionRow = this.addLayerSelectionRow.bind(this)
    this.createLayer = this.createLayer.bind(this)
    this.removeLayer = this.removeLayer.bind(this)
    this.toggleLayerMenu = this.toggleLayerMenu.bind(this)
    this.setOpacityOfLayer = this.setOpacityOfLayer.bind(this)
  }

  componentWillMount() {
    this.addLayerSelectionRow()
  }

  componentDidMount() {
    var drake = dragula([document.querySelector('#testIdizzle')], {
      moves: (el, source, handle, sibling) => {
        return handle.classList.contains('glyphicon-move');
      }
    })

    drake.on('drop', (el, target, source, sibling) => {
      var layersInDom = drake.containers[0].children
      var layers = _.map(this.state.layers, (layer) => {
        if(!layer) return undefined
        var indexOfLayer = _.findIndex(layersInDom, (layerDom) => {
          return layerDom.attributes[1].nodeValue == layer.key
        })
        layer.zIndex = (100 - indexOfLayer)
        return layer
      })
      this.setState({layers: layers})
      layers.forEach((layer) => {
        if (!layer) return
        this.props.updateLayers({layerKey: layer.key, layerObject: layer})
      })
    })
  }

  //This is called when the user clicks the button to add a new layer.
  addLayerSelectionRow() {
    var layers = this.state.layers
    layers[this.state.totalLayers] = {
      key: this.state.totalLayers,
      zIndex: 100 - this.state.totalLayers
    }
    layers = _.sortBy(layers, (layer) => layer.zIndex)
    this.setState({layers, totalLayers: this.state.totalLayers+1})
    //createLayer will be called at the end of this chain, after all the data has come back from the server.
  }

  //This is called when the use selects a time value for the layer.
  //This also happens once when the slayer selection row is first loaded, the 0th time value is auto selected for the user.
  createLayer({layerKey, url, layerObject}) {
    var allLayerIds = this.state.allLayerIds
    allLayerIds.push(layerObject.id)
    var layers = this.state.layers
    layerObject.zIndex = layers[layerKey].zIndex
    if (!layerObject.zIndex) layerObject.zIndex = (100 - layerKey)
    layers[layerKey] = layerObject
    this.setState({allLayerIds, layers})
    this.props.putLayer(layerKey, url, layerObject.zIndex)
    this.props.updateLayers({layerKey, layerObject})
  }

  removeLayer({layerKey}) {
    var layers = this.state.layers;
    layers[layerKey] = null
    this.setState({layers: layers});
    this.props.updateLayers({layerKey, layerObject: undefined})
    this.props.removeLayer({layerKey})
  }

  toggleLayerMenu() {
    this.setState({shouldShowLayerMenu: !this.state.shouldShowLayerMenu}, () => {
      if (this.state.shouldShowLayerMenu)
        document.querySelector('#layerEditor').style['max-width'] = '100%'
      else
        document.querySelector('#layerEditor').style['max-width'] = '50px'
    })
  }

  setOpacityOfLayer({layerKey, layerObject}) {
    this.props.setOpacityOfLayer({layerKey, opacity: layerObject.opacity})
    this.props.updateLayers({layerKey, layerObject})
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
