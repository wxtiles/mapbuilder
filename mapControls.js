import React from 'react'
import ReactDOM from 'react-dom'
import generateUrl from './mapOverlay/generateUrl'
import legends from './mapOverlay/legends'
import _ from 'lodash'
import timeSlider from './mapOverlay/timeSlider'
import moment from 'moment'

class mapControls extends React.Component {
  constructor() {
    super()
    this.state = {}
  }

  componentWillMount() {
  }

  selectTime(time) {

  }

  render() {
    var layers = this.props.mapDatums.layers
    layers = _.filter(layers, (layer) => layer != null)

    var legendsDatums = _.map(layers, (layer) => {
      return {
        label: layer.label,
        url: layer.legendUrl,
        layerId: layer.id,
        instanceId: layer.instanceId
      }
    })
    var generateUrlDatums = {
      zoom: this.props.mapDatums.zoom,
      center: this.props.mapDatums.center,
      layers: _.map(layers, (layer) => {
        return {
          id: layer.id,
          opacity: layer.opacity,
          zIndex: layer.zIndex
        }
      })
    }

    var now = moment.utc()
    var twoDaysAgo = now.clone().add(-2, 'day',)
    var sevenDaysAhead = now.clone().add(7, 'day')
    var hardcodedTimes = [twoDaysAgo, now, sevenDaysAhead]
    var times = _.map(layers, (layer) => {
      return _.map(layer.times, (time) => {
        return moment.utc(time.value)
      })
    })
    times = _.flatten(times)
    times = _.union(times, hardcodedTimes)
    var timeSliderDatums = {times}

    return React.createElement('div', {className: 'mapControls'},
      React.createElement(generateUrl, {urlDatums: generateUrlDatums}),
      React.createElement(legends, {legends: legendsDatums}),
      React.createElement('div', {className: 'timeSliderContainer'},
        React.createElement('div', {className: 'timeSliderWrapper'},
          React.createElement(timeSlider, timeSliderDatums)
        )
      )
    )
  }
}

export default mapControls
