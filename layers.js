import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import createTileLayer from './createTileLayer'
import urlDialog from './urlDialog'

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
    this.makeUrl = this.makeUrl.bind(this)
    this.stopMakingUrl = this.stopMakingUrl.bind(this)
    this.setOpacityOfLayer = this.setOpacityOfLayer.bind(this)
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
  createLayer({layerKey, url, layerId}) {
    var layerIds = this.state.allLayerIds
    layerIds.push(layerId)
    this.setState({
      allLayerIds: layerIds
    })
    this.props.putLayer(layerKey, url)
  }

  removeLayer({layerKey}) {
    var allLayers = this.state.layers;
    allLayers.splice(allLayers.indexOf(layerKey), 1)
    this.setState({layers: allLayers});
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

  setOpacityOfLayer({layerKey, opacity}) {
    console.log(layerKey)
    console.log(opacity)
  }

  makeUrl() {
    this.setState({isMakingUrl: true})
  }

  stopMakingUrl() {
    this.setState({isMakingUrl: false})
  }

  render() {
    return React.createElement('div', {className: 'layers'},
      this.state.isMakingUrl && React.createElement(urlDialog, {close: this.stopMakingUrl, layerIds: this.state.allLayerIds}),
      React.createElement('div', {},
        React.createElement('ul', {},
          React.createElement('li', {className: 'addLayerRow'},
            React.createElement('div', {className: 'btn btn-primary addLayer', onClick: this.makeUrl}, 'Get Url for map')
          ),
          React.createElement('li', {className: 'addLayerRow'},
            React.createElement('div', {className: 'btn btn-success addLayer', onClick: this.addLayerSelectionRow}, 'Add a layer')
          ),
          _.map(this.state.layers, (layerKey) =>
            (layerKey !== undefined) && React.createElement(createTileLayer, {key: layerKey, layerKey: layerKey, putLayer: this.createLayer, removeLayer: this.removeLayer, setOpacityOfLayer: this.setOpacityOfLayer})
          )
        )
      )
    )
  }
}

export default layers
