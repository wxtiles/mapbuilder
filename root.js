import React from 'react'
import ReactDOM from 'react-dom'
import wxTiles from './wxtiles'
import _ from 'lodash'
import layersEditor from './layersEditor'
import mapWrapper from './mapWrapper'

class root extends React.Component {
  constructor() {
    super()
    this.state = {
      layers: [],
      mapOptions: {},
      layerOptions: []
    }
    this.updateLayers = this.updateLayers.bind(this)
  }

  componentWillMount() {
    wxTiles.getAllLayers({
      onSuccess: (layerOptions) => {
        layerOptions = _.map(layerOptions, (layerOption) => {
          layerOption.value = layerOption.id
          layerOption.label = layerOption.meta.name
          return layerOption
        })
        this.setState({layerOptions})
      },
      onError: (error) => console.log(error)
    })

    this.setState({layers: [{
      label: 'New layer',
      key: 0,
      opacity:0.8,
      zIndex: 0
    }]})
  }

  updateLayers({layers}) {
    this.setState({layers})
  }

  render() {
    return React.createElement('div', {className: 'root'},
      React.createElement('div', {className: 'layers-container'},
        React.createElement('a', {className: 'logo', href: 'https://wxtiles.com', target: '_blank'},
          React.createElement('img', {src: 'wxtiles-logo.png'})
        ),
        React.createElement(layersEditor, {
          layers: this.state.layers,
          layerOptions: this.state.layerOptions,
          updateLayers: this.updateLayers
        }),
      ),
      React.createElement('div', {className: 'mapContainer'},
        React.createElement(mapWrapper, {
          layers: this.state.layers,
          mapOptions: this.state.mapOptions
        })
      )
    )
  }
}

export default root
