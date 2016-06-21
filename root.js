import React from 'react'
import ReactDOM from 'react-dom'
import EventEmitter from 'event-emitter'
import wxTiles from './wxtiles'
import select from 'react-select'
import _ from 'lodash'

class root extends React.Component {
  constructor() {
    super()
    this.state = {}
    this.state.selectedLayer = null
    this.eventEmitter = EventEmitter({})
  }

  componentWillMount() {
    this.eventEmitter.on('loadLayersList', () => {
      this.setState({loadedLayers: null})
      var onSuccess = (layers) => {
        layers = _.map(layers, (layer) => {
          layer.value = layer.id
          layer.label = layer.meta.name
          return layer
        })
        this.setState({loadedLayers: layers})
      }
      var onError = (err) => console.log(err)
      wxTiles.getAllLayers(onSuccess, onError)
    })

    this.eventEmitter.on('selectedLayer', (layerId) => {
      this.setState({selectedLayer: layerId})
    })

    this.eventEmitter.emit('loadLayersList')
  }

  render() {
    console.log(this.state)

    return React.createElement(`div`, null,
      React.createElement(`div`, null,
        React.createElement(`div`, null, `Pick a layer`),
        (this.state.loadedLayers == null) && React.createElement('div', null, 'Loading...'),
        this.state.loadedLayers && React.createElement(select, {
          options: this.state.loadedLayers,
          value: this.state.selectedLayer,
          onChange: (thing) => this.eventEmitter.emit('selectedLayer', thing)
        })
      )
    )
  }
}

export default root
