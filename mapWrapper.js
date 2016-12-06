import React from 'react'
import {Map, TileLayer} from 'react-leaflet'
import wxtiles from './wxtiles'
import _ from 'lodash'
import leaflet from 'leaflet'
import moment from 'moment'

var getBounds = function (bounds) {
  if (bounds.east > bounds.west && Math.abs(bounds.west - bounds.east) <= 0.5) {
    // Valid
    return leaflet.latLngBounds(
        leaflet.latLng({lon: bounds.east, lat: bounds.north}),
        leaflet.latLng({lon: bounds.west, lat: bounds.south})
    )
  } else {
    // NOTE: hack workaround for layer bounds that are broken for some layers?
    // TODO: remove when GFS and MWW3 layers return valid bounds in prod
    return leaflet.latLngBounds(
        leaflet.latLng({lon: 180, lat: 90}),
        leaflet.latLng({lon: -180, lat: -90})
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
    var mapOptions = this.props.mapOptions
    var mapTime = mapOptions.time.clone()
    var wxtilesLayers = this.props.layers
    var tileLayers = []
    var bufferLength = 5 // TODO this could be based on animation speed?
    var lowerBufferLength = 5
    if (mapOptions.isAnimating) {
      var buffer = []
      tileLayers = _.map(wxtilesLayers, (wxtilesLayer) => {
        var afterSelectedTime = _.filter(wxtilesLayer.timeUrls, (timeUrl, key) => {
          return timeUrl.time.isSameOrAfter(mapTime)
        }).slice(0, bufferLength)
        if (afterSelectedTime.length == 0) {
          // Current time is beyond upper range of layer
          // TODO tolerance time at upper edge?
          return false
        } else if (!mapTime.isSame(_.first(afterSelectedTime).time)) {
          // We're actually working with durations
          // Preprend the last time that is before the current time
          afterSelectedTime.unshift(wxtilesLayer.timeUrls[wxtilesLayer.timeUrls.indexOf(afterSelectedTime[0])-1])
        }
        var beforeSelectedTime = _.filter(wxtilesLayer.timeUrls, (timeUrl) => {
          return timeUrl.time.isBefore(mapTime)
        }).slice(0, bufferLength)//.slice(0, -1)
        if (beforeSelectedTime.length == 0) {
          // Current time is below lower range of layer
          return false
        }
        if (afterSelectedTime.length < bufferLength) {
          // Get elements from the front of the array (facilitates looping)
          buffer = afterSelectedTime.concat(beforeSelectedTime.slice(0, Math.min(lowerBufferLength, bufferLength - afterSelectedTime.length)))
        } else {
          buffer = afterSelectedTime
        }
        return _.map(buffer, (timeUrl, key) => {
          var isVisible = wxtilesLayer.visibleUrl == timeUrl.url
          return {
            url: timeUrl.url,
            key: wxtilesLayer.key + ' ' + timeUrl.url,
            zIndex: wxtilesLayer.zIndex,
            opacity: isVisible ? wxtilesLayer.opacity : 0,
            bounds: getBounds(wxtilesLayer.bounds),
            minZoom: wxtilesLayer.minNativeZoom ? wxtilesLayer.minNativeZoom : 0,
            maxNativeZoom: wxtilesLayer.maxNativeZoom ? wxtilesLayer.maxNativeZoom : null
          }
        })
      })
      tileLayers = _.flatten(tileLayers.filter(Boolean)) // TODO needed?
    }
    else if (!mapOptions.isAnimating) {
      var inRange = function(start, end) {
        return mapTime.isSameOrBefore(end) && mapTime.isSameOrAfter(start)
      }
      wxtilesLayers = _.filter(wxtilesLayers, (wxtileLayer) => {
        return (inRange(
            moment(_.first(wxtileLayer.times)),
            moment(_.last(wxtileLayer.times))
        ) && wxtileLayer.visibleUrl)
      })
      tileLayers = _.map(wxtilesLayers, (wxtilesLayer) => {
        return {
          url: wxtilesLayer.visibleUrl,
          key: wxtilesLayer.key + ' ' + wxtilesLayer.visibleUrl,
          zIndex: wxtilesLayer.zIndex,
          opacity: wxtilesLayer.opacity,
          bounds: getBounds(wxtilesLayer.bounds),
          minZoom: wxtilesLayer.minNativeZoom ? wxtilesLayer.minNativeZoom : 0,
          maxNativeZoom: wxtilesLayer.maxNativeZoom ? wxtilesLayer.maxNativeZoom : null
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
            maxNativeZoom: tileLayer.maxNativeZoom,
            minZoom: tileLayer.minZoom,
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
          alpha: 1
        })
      )
    )
  }
}

export default mapWrapper
