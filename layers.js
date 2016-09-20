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
    dragula([document.querySelector('#testIdizzle')])
  }

  //This is called when the user clicks the button to add a new layer.
  addLayerSelectionRow() {
    var allLayers = this.state.layers
    allLayers[this.state.totalLayers] = {
      key: this.state.totalLayers
    }
    this.setState({layers: allLayers, totalLayers: this.state.totalLayers+1})
    console.log('doing drag on ')
    console.log(document.querySelector('#testIdizzle'))

    //createLayer will be called at the end of this chain, after all the data has come back from the server.
  }

  //This is called when the use selects a time value for the layer.
  //This also happens once when the slayer selection row is first loaded, the 0th time value is auto selected for the user.
  createLayer({layerKey, url, layerObject}) {
    var allLayerIds = this.state.allLayerIds
    allLayerIds.push(layerObject.id)
    var layers = this.state.layers
    layers[layerKey] = layerObject
    this.setState({allLayerIds, layers})
    var layerOrder = _.findIndex(this.state.allLayerIds, (id) => id == layerObject.id)
    this.props.putLayer(layerKey, url, layerOrder)
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
        React.createElement('div', {id: 'testIdizzle'},
          React.createElement('div', {className: 'addLayerRow'},
            React.createElement('div', {className: 'btn btn-success addLayer', onClick: this.addLayerSelectionRow}, 'Add a layer')
          ),
          _.map(this.state.layers, (layer) =>
            layer && React.createElement('div', {className: 'layerContainer', key: layer.key},
              React.createElement(createTileLayer, {layerKey: layer.key, putLayer: this.createLayer, removeLayer: this.removeLayer, setOpacityOfLayer: this.setOpacityOfLayer})
            )
          )
        )
      )
    )
  }
}

export default layers
