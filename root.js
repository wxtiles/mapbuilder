import React from 'react'
import ReactDOM from 'react-dom'
import wxTiles from './wxtiles'
import _ from 'lodash'
import layersEditor from './layersEditor'
import mapWrapper from './mapWrapper'
import mapControls from './mapControls'
import moment from 'moment'

class root extends React.Component {
  constructor() {
    super()
    this.state = {
      layers: [],
      mapOptions: {},
      layerOptions: [],
      now: null
    }
    this.updateLayers = this.updateLayers.bind(this)
    this.updateMapOptions = this.updateMapOptions.bind(this)
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

    this.setState({
      mapOptions: {
        time: this.props.now,
        displayTime: this.props.now
      }
    })
  }

  updateLayers({layers}) {
    var mapOptions = _.cloneDeep(this.state.mapOptions)
    mapOptions.layers = layers
    var times = _.map(layers, (layer) => {
      return _.map(layer.times, (time) => {
        return moment.utc(time)
      })
    })
    times = _.flatten(times)
    times.push(this.props.now)
    times = _.sortBy(times, (time) => +time)
    mapOptions.times = times
    mapOptions.earliestTime = _.first(times)
    mapOptions.latestTime = _.last(times)
    this.setState({layers, mapOptions})
  }

  updateMapOptions({mapOptions}) {
    // console.log('updating mapOptions')
    var layers = _.cloneDeep(this.state.layers)
    layers = mapOptions.layers
    this.setState({mapOptions, layers})
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
      ),
      React.createElement('div', {className: 'mapControlsContainer'},
        React.createElement(mapControls, {
          updateLayers: this.updateLayers,
          mapOptions: this.state.mapOptions,
          updateMapOptions: this.updateMapOptions
        })
      )
    )
  }
}

export default root
