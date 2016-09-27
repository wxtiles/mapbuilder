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

    var wxtilesLayers = _.cloneDeep(this.props.layers)
    wxtilesLayers = _.filter(wxtilesLayers, (wxtileLayer) => wxtileLayer.visibleUrl)
    var mapOptions = _.cloneDeep(this.props.mapOptions)
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

    var mapParams = {
      center: position,
      zoom: zoom,
      zoomControl: false,
      style: {height: '100%'},
      onMoveend: (e) => {
        var target = e.target
        mapOptions = _.cloneDeep(this.props.mapOptions)
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
