import React from 'react'
import ReactDOM from 'react-dom'
import EventEmitter from 'event-emitter'
import wxTiles from './wxtiles'
import select from 'react-select'
import _ from 'lodash'
import moment from 'moment'

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

    this.eventEmitter.on('selectedLayer', (layer) => {
      var instances = _.map(layer.instances, (instance) => {
        instance.value = instance.id
        instance.label = moment(instance.start).format('YYYY MM DD - hh mm ')
        return instance
      })
      this.setState({selectedLayer: layer, selectedInstance: instances[0], instances: instances})
    })

    this.eventEmitter.on('selectedInstance', (instance) => {
      var options = {
        layerId: this.state.selectedLayer.id,
        instanceId: instance.id,
        onSuccess: (times) => console.log(times),
        onError: (error) => console.log(error),
      }
      wxTiles.getTimesForInstance(options)
      this.setState({selectedInstance: instance})
    })

    this.eventEmitter.emit('loadLayersList')
  }

  render() {
    return React.createElement(`div`, null,
      React.createElement(`div`, null,
        React.createElement(`div`, null, `Pick a layer`),
        (this.state.loadedLayers == null) && React.createElement('div', null, 'Loading...'),
        this.state.loadedLayers && React.createElement(select, {
          options: this.state.loadedLayers,
          value: this.state.selectedLayer,
          onChange: (thing) => this.eventEmitter.emit('selectedLayer', thing)
        }),
        this.state.selectedInstance && React.createElement('div', null, 'Pick an instance'),
        this.state.selectedInstance && React.createElement(select, {
          options: this.state.instances,
          value: this.state.selectedInstance,
          onChange: (thing) => this.eventEmitter.emit('selectedInstance', thing)
        })
      )
    )
  }
}

export default root
