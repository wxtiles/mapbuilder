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
    wxtilesLayers = _.filter(wxtilesLayers, (wxtileLayer) => wxtileLayer.visibleUrl)
    var mapOptions = this.props.mapOptions
    var tileLayers = []
    if (mapOptions.isAnimating) {
      tileLayers = _.map(wxtilesLayers, (wxtilesLayer) => {
        return _.map(wxtilesLayer.urls, (url) => {
          var isVisibleUrl = wxtilesLayer.visibleUrl == url
          return {
            url: url,
            key: wxtilesLayer.key + ' ' + url,
            zIndex: wxtilesLayer.zIndex,
            opacity: isVisibleUrl ? wxtilesLayer.opacity : 0
          }
        })
      })
      tileLayers = _.flatten(tileLayers)
    }
    if (!mapOptions.isAnimating) {
      tileLayers = _.map(wxtilesLayers, (wxtilesLayer) => {
        return {
          url: wxtilesLayer.visibleUrl,
          key: wxtilesLayer.key + ' ' + wxtilesLayer.visibleUrl,
          zIndex: wxtilesLayer.zIndex,
          opacity: wxtilesLayer.opacity
        }
      })
    }

    return React.createElement('div', {className: 'mapWrapper'},
      React.createElement(Map, {center: position, zoom: zoom, style: {height: '100%'}},
        _.map(tileLayers, (tileLayer) => {
          return React.createElement(TileLayer, {
            url: tileLayer.url,
            key: tileLayer.key,
            tms: true,
            zIndex: tileLayer.zIndex,
            opacity: tileLayer.opacity
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
