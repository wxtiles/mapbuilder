import React from 'react'
import ReactDOM from 'react-dom'
import wxTiles from './wxtiles'
import select from 'react-select'
import _ from 'lodash'

class root extends React.Component {
  constructor() {
    super()
    this.state = {}
    this.state.selectedLayer = null
  }

  loadLayersList() {
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
  }

  selectLayer(layer) {
    var instances = _.map(layer.instances, (instance) => {
      instance.value = instance.id
      instance.label = instance.id
      return instance
    })
    this.setState({selectedLayer: layer, instances: instances}, () => this.selectInstance(instances[0]))
  }

  selectInstance(instance) {
    var options = {
      layerId: this.state.selectedLayer.id,
      instanceId: instance.id,
      onSuccess: (times) => {
        times = _.map(times, (time) => {
          return {value: time, label: time}
        })
        this.setState({times}, () => this.selectTime(times[0]))
      },
      onError: (error) => console.log(error),
    }
    wxTiles.getTimesForInstance(options)
    this.setState({selectedInstance: instance})
  }

  selectTime(time) {
    this.setState({selectedTime: time}, () =>{
      // var getTileUrl = ({layerId, instanceId, time, level, onSuccess, onError}) => {
      var getTileLayerUrlOptions = {
        layerId: this.state.selectedLayer.id,
        instanceId: this.state.selectedInstance.id,
        time: this.state.selectedTime.value,
        level: 0,
        onSuccess: (url) => this.props.putLayer(url),
        onError: (err) => console.log(err),
      }
      wxTiles.getTileLayerUrl(getTileLayerUrlOptions)
    })
  }

  componentWillMount() {
    this.loadLayersList()
  }

  render() {
    return React.createElement(`div`, null,
      React.createElement(`div`, null,
        React.createElement(`div`, null, `Pick a layer`),
        (this.state.loadedLayers == null) && React.createElement('div', null, 'Loading...'),
        this.state.loadedLayers && React.createElement(select, {
          options: this.state.loadedLayers,
          value: this.state.selectedLayer,
          onChange: (thing) => this.selectLayer(thing)
        }),
        this.state.selectedInstance && React.createElement('div', null, 'Pick an instance'),
        this.state.selectedInstance && React.createElement(select, {
          options: this.state.instances,
          value: this.state.selectedInstance,
          onChange: (thing) => this.selectInstance(thing)
        }),
        this.state.times && React.createElement('div', null, 'Pick a time'),
        this.state.times && React.createElement(select, {
          options: this.state.times,
          value: this.state.selectedTime,
          onChange: (thing) => this.selectTime(thing)
        }),
        this.state.tileUrl && React.createElement('div', null, this.state.tileUrl)
      )
    )
  }
}

export default root
