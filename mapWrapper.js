import React from 'react'
import {Map, TileLayer} from 'react-leaflet'
import wxtiles from './wxtiles'
import _ from 'lodash'

class mapWrapper extends React.Component {
  constructor() {
    super()
    this.state = {
      lat: -2,
      lng: 160,
      zoom: 2,
    }
  }

  componentWillMount() {
  }

  render() {
    var position = [this.state.lat, this.state.lng]
    var zoom = this.state.zoom

    var wxtilesLayers = this.props.layers

    return React.createElement('div', {className: 'mapWrapper'},
      React.createElement(Map, {center: position, zoom: zoom, style: {height: '100%'}},
        _.map(wxtilesLayers, (layer) => {
          if (!layer.urls) return null
          return _.map(layer.urls, (url) => {
            var opacity = 0
            if (url == layer.visibleUrl) opacity = layer.opacity
            return React.createElement(TileLayer, {
              url,
              key: layer.key + ' ' + url,
              tms: true,
              zIndex: 100,
              opacity
            })
          })
        }),
        React.createElement(TileLayer, {
          url: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
          subdomains: 'abcd'
        })
      )
    )
  }
}

export default mapWrapper
