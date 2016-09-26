import React from 'react'
import ReactDOM from 'react-dom'
import layersEditor from './layersEditor'
import createTileLayer from './createTileLayer'
import mapSelector from './mapSelector/mapSelector'
import maps from './maps'
import leaflet from 'leaflet'
import wxTiles from './wxtiles'
import _ from 'lodash'
import mapControls from './mapControls'
import moment from 'moment'
import mapWrapper from './mapWrapper'
import root from './root'

var mapSelectorMount = document.querySelector('#mapSelector')
var currentViewBounds = {center: null, zoom: null}
var onUpdateViewPort = ({zoom, center}) => {
  currentViewBounds = {zoom, center}
}

var putLayer = () => {}

var removeLayer = () => {}


var updateMapOptions = ({mapOptions}) => {
  updateMap({mapOptions})
  mapControlsRenderer({mapOptions})
}

var oldMapOptions = {}
var updateMap = ({layers, mapOptions}) => {
  layers = layers || oldLayers
  oldLayers = layers
  mapOptions = mapOptions || oldMapOptions
  oldMapOptions = mapOptions
  var reactMount = document.querySelector('#leafletMap')
  ReactDOM.render(React.createElement(mapWrapper, {layers, mapOptions}), reactMount)
}

var oldLayerOptions = null
var updateLayerEditor = ({layers, layerOptions}) => {
  layers = layers || oldLayers
  oldLayers = layers
  layerOptions = layerOptions || oldLayerOptions
  oldLayerOptions = layerOptions
  var reactMount = document.querySelector('#layerEditor')
  ReactDOM.render(React.createElement(layersEditor, {layers, layerOptions, updateLayers}), reactMount)
}

var mapControlsRenderer = ({layers, mapOptions}) => {
  layers = layers || oldLayers
  oldLayers = layers
  mapOptions = mapOptions || oldMapOptions
  oldMapOptions = mapOptions
  layers = _.filter(layers, (layer) => layer != null)
  var mapDatums = {
    layers,
    center: currentViewBounds.center,
    zoom: currentViewBounds.zoom
  }
  var mapControlsMount = document.querySelector('#mapSibling')
  ReactDOM.render(React.createElement('div', {className: 'mapControlsContainer'},
    React.createElement(mapControls, {mapDatums, updateLayers, mapOptions, updateMapOptions})
  ), mapControlsMount)
}

ReactDOM.render(React.createElement(root), document.querySelector('#root'))
