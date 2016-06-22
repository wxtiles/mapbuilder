import React from 'react'
import ReactDOM from 'react-dom'
import wxTiles from './wxtiles'
import select from 'react-select'
import _ from 'lodash'

class createTileLayer extends React.Component {
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
        onSuccess: (url) => {
          console.log(this.props)
          this.setState({url})
          this.props.putLayer({url})
        },
        onError: (err) => console.log(err),
      }
      wxTiles.getTileLayerUrl(getTileLayerUrlOptions)
    })
  }

  componentWillMount() {
    this.loadLayersList()
  }

  render() {
    return React.createElement(`div`, {className: 'row createTileLayer'},
      React.createElement('div', {className: 'col-sm-1 closeButtonContainer'},
        React.createElement('span', null, 'Delete layer'),
        React.createElement('div', {className: 'btn btn-default closeButton'}, 'X')
      ),
      React.createElement('div', {className: 'col-sm-3 select-container'},
        React.createElement('span', null, 'Choose a layer'),
        React.createElement('div', {className: 'select-list'},
          (this.state.loadedLayers == null) && React.createElement('div', null, 'Downloading layers...'),
          this.state.loadedLayers && React.createElement(select, {
            options: this.state.loadedLayers,
            placeholder: 'Choose a layer...',
            value: this.state.selectedLayer,
            onChange: (thing) => this.selectLayer(thing)
          })
        )
      ),
      React.createElement('div', {className: 'col-sm-1 arrow-container'},
          React.createElement('span', {className: 'glyphicon glyphicon-arrow-right'}, '')
      ),
      React.createElement(`div`, {className: 'col-sm-3 select-container'},
        React.createElement('span', null, 'Choose an instance'),
        React.createElement('div', {className: 'select-list'},
          this.state.selectedInstance && React.createElement(select, {
            options: this.state.instances,
            placeholder: 'Choose an instance...',
            value: this.state.selectedInstance,
            onChange: (thing) => this.selectInstance(thing)
          })
        )
      ),
      React.createElement('div', {className: 'col-sm-1 arrow-container'},
        React.createElement('span', {className: 'glyphicon glyphicon-arrow-right'}, '')
      ),
      React.createElement(`div`, {className: 'col-sm-3 select-container'},
        React.createElement('span', null, 'Choose a time'),
        React.createElement('div', {className: 'select-list'},
          this.state.times && React.createElement(select, {
            options: this.state.times,
            placeholder: 'Choose an time...',
            value: this.state.selectedTime,
            onChange: (thing) => this.selectTime(thing)
          })
        )
      ),
      React.createElement('div', {className: 'col-sm-12 urlDisplay'}, this.state.url)
    )
  }
}

export default createTileLayer
