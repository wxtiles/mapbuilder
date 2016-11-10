import React from 'react'
import {Map, TileLayer} from 'react-leaflet'
import wxtiles from './wxtiles'
import _ from 'lodash'
import leaflet from 'leaflet'

var get_bounds = function (bounds) {
  if (bounds.east > bounds.west && (bounds.west - bounds.east) <= 0.5) {
    // Valid
    return leaflet.latLngBounds(
        leaflet.latLng({lon: bounds.east, lat: bounds.north}),
        leaflet.latLng({lon: bounds.west, lat: bounds.south})
    )
  } else {
    // NOTE: hack workaround for layer bounds that are broken for some layers?
    // TODO: remove when GFS and MWW3 layers return valid bounds in prod
    return leaflet.latLngBounds(
        leaflet.latLng({lon: -180, lat: 90}),
        leaflet.latLng({lon: 180, lat: -90})
    )
  }
}

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
    var mapTime = mapOptions.time.clone()
    var tileLayers = []
    if (mapOptions.isAnimating) {
      tileLayers = _.map(wxtilesLayers, (wxtilesLayer) => {
        var bufferedTimeUrls = wxtilesLayer.timeUrls
        bufferedTimeUrls = _.filter(bufferedTimeUrls, (timeUrl) => {
          var timeOfTileLayer = timeUrl.time.clone()
          var startOfBuffer = mapTime.clone().add(-3, 'hours')
          var endOfBuffer = mapTime.clone().add(3, 'hour')
          if(timeOfTileLayer.isBefore(startOfBuffer)) return false
          if(timeOfTileLayer.isAfter(endOfBuffer)) return false
          return true
        })
        return _.map(bufferedTimeUrls, (timeUrl) => {
          var url = timeUrl.url
          var isVisibleUrl = wxtilesLayer.visibleUrl == url
          return {
            url: url,
            key: wxtilesLayer.key + ' ' + url,
            zIndex: wxtilesLayer.zIndex,
            opacity: isVisibleUrl ? wxtilesLayer.opacity : 0,
            bounds: get_bounds(wxtilesLayer.bounds)
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
          opacity: wxtilesLayer.opacity,
          bounds: get_bounds(wxtilesLayer.bounds)
        }
      })
    }

    var mapParams = {
      center: position,
      zoom: zoom,
      zoomControl: false,
      style: {height: '100%'},
      onMoveend: (e) => {
        var target = e.target
        mapOptions = this.props.mapOptions
        mapOptions.zoom = target.getZoom()
        mapOptions.center = {
          lat: target.getCenter().lat,
          lng: target.getCenter().lng,
        }
        this.props.updateMapOptions({mapOptions})
      }
    }
    return React.createElement('div', {className: 'mapWrapper'},
      React.createElement(Map, mapParams,
        _.map(tileLayers, (tileLayer) => {
          return React.createElement(TileLayer, {
            url: tileLayer.url,
            key: tileLayer.key,
            tms: true,
            bounds: tileLayer.bounds,
            zIndex: tileLayer.zIndex,
            opacity: tileLayer.opacity
          })
        }),
        React.createElement(TileLayer, {
          url: 'https://api.mapbox.com/styles/v1/metocean/civblde3g001c2ipkwfs17qh3/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWV0b2NlYW4iLCJhIjoia1hXZjVfSSJ9.rQPq6XLE0VhVPtcD9Cfw6A',
          zIndex: 500
        }),
        React.createElement(TileLayer, {
          url: 'http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png',
          subdomains: 'abcd',
          zIndex: 501,
          alpha: 0.8
        })
      )
    )
  }
}

export default mapWrapper
