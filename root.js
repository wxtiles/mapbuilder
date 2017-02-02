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
      now: null
    }
    this.updateLayers = this.updateLayers.bind(this)
    this.updateMapOptions = this.updateMapOptions.bind(this)
  }

  componentWillMount() {
    var layers = [{
      label: '',
      key: 0,
      opacity:1,
      zIndex: 0
    }]
    this.setState({
      layers,
      mapOptions: {
        time: this.props.now,
        displayTime: this.props.now,
        layers,
        marks: {}
      }
    })
  }

  updateLayers({layers}) {
    var mapOptions = this.state.mapOptions
    mapOptions.layers = layers
    var times = _.map(layers, (layer) => {
      return _.map(layer.times, (time) => {
        return moment.utc(time)
      })
    })
    times = _.flatten(times)
    // times.push(this.props.now)
    times = _.sortBy(times, (time) => +time)
    mapOptions.marks = {}
    _.forEach(times, (time) => {
      mapOptions.marks[+time] = ''
    })
    var arrowStyle = {}
    if (+this.props.now < +_.first(times)) {
      mapOptions.marks[+_.first(times)] = {
        'style': arrowStyle,
        'label': "\u21E6"
      }
    } else if (+this.props.now > +_.last(times)) {
      mapOptions.marks[+_.last(times)] = {
        'style': arrowStyle,
        'label': "\u21E8"
      }
    } else {
      mapOptions.marks[+this.props.now] = {
        'style': arrowStyle,
        'label': "\u21E7"
      }
    }
    mapOptions.times = times
    mapOptions.earliestTime = _.first(times)
    mapOptions.latestTime = _.last(times)
    this.setState({layers, mapOptions})
  }

  updateMapOptions({mapOptions}) {
    var layers = this.state.layers
    layers = mapOptions.layers
    this.setState({layers, mapOptions})
  }

  render() {
    return React.createElement('div', {className: 'root'},
      React.createElement('div', {className: 'layers-container'},
        React.createElement('a', {className: 'logo', href: 'https://wxtiles.com', target: '_blank'},
          React.createElement('img', {src: 'wxtiles-logo.png'})
        ),
        React.createElement(layersEditor, {
          layers: this.state.layers,
          updateLayers: this.updateLayers
        })
      ),
      React.createElement('div', {className: 'mapContainer'},
        React.createElement(mapWrapper, {
          layers: this.state.layers,
          mapOptions: this.state.mapOptions,
          updateMapOptions: this.updateMapOptions
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
