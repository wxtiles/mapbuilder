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
    this.state.shouldShowLayerMenu = true

    this.addLayerSelectionRow = this.addLayerSelectionRow.bind(this)
    this.createLayer = this.createLayer.bind(this)
    this.removeLayer = this.removeLayer.bind(this)
    this.toggleLayerMenu = this.toggleLayerMenu.bind(this)
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

  toggleLayerMenu() {
    this.setState({shouldShowLayerMenu: !this.state.shouldShowLayerMenu}, () => {
      if (this.state.shouldShowLayerMenu)
        document.querySelector('#layerEditor').style['max-width'] = '100%'
      else
        document.querySelector('#layerEditor').style['max-width'] = '50px'
    })
  }

  render() {
    var pullyTabDirection = 'left'
    var layersClassName = ''
    if (this.state.shouldShowLayerMenu == false) {
      pullyTabDirection = 'right'
      layersClassName = 'shouldHide'
    }
    return React.createElement('div', {className: 'layers'},
      React.createElement('div', {className: layersClassName},
        React.createElement('div', { className: 'paddingContainer'},
          React.createElement('img', {src:'wxtiles-logo.png'})
        ),
        React.createElement('ul', {},
          React.createElement('li', {className: 'addLayerRow'},
            React.createElement('div', {className: 'btn btn-success addLayer', onClick: this.addLayerSelectionRow}, 'Add a layer')
          ),
          _.map(this.state.layers, (layerKey) =>
            (layerKey !== undefined) && React.createElement(createTileLayer, {key: layerKey, layerKey: layerKey, putLayer: this.createLayer, removeLayer: this.removeLayer, setOpacityOfLayer: this.props.setOpacityOfLayer})
          )
        )
      ),
      React.createElement('div', {className: 'pullyTab'},
        React.createElement('div', {className: 'glyphicon glyphicon-menu-'+pullyTabDirection, onClick: this.toggleLayerMenu}, '')
      )
    )
  }
}

export default layers
