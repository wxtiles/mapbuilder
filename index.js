import React from 'react'
import ReactDOM from 'react-dom'
import layers from './layers'
import createTileLayer from './createTileLayer'
import mapSelector from './mapSelector/mapSelector'
import maps from './maps'
import leaflet from 'leaflet'
import wxTiles from './wxtiles'
import hideLayer from './hideLayer'
import _ from 'lodash'
import mapControls from './mapControls'
import moment from 'moment'

ReactDOM.render(React.createElement(hideLayer), document.querySelector('#hideLayerEditor'))

//Prepare the maps.
var mapExamples = [
  { label: 'Leaflet', value: 'leaflet' },
  { label: 'Google Maps', value: 'google' },
  { label: 'Open Layers 3', value: 'openLayers' },
]

var leafletMap = maps.mountLeafletMap();
var googleMap = maps.mountGoogleMap();
var openLayersMap = maps.mountOpenLayersMap();
var activeLayers = [{
  key: 0,
  opacity: 0.8
}];

var defaultMap = mapExamples[0]

var mapSelectorMount = document.querySelector('#mapSelector')
var currentViewBounds = {center: null, zoom: null}
maps.onUpdateViewPort = ({zoom, center}) => {
  currentViewBounds = {zoom, center}
  maps.updateViewPort(currentViewBounds)
  updateLayerObjects()
}

ReactDOM.render(React.createElement(mapSelector, {mapOptions: mapExamples, showMap: maps.showMap, selectedMap: defaultMap }), mapSelectorMount)
maps.showMap(defaultMap)

var putLayer = () => {}

var removeLayer = () => {}

var updateLayer = ({layerObject}) => {
  activeLayers[layerObject.key].layerObject = layerObject
  updateLayerEditor()
  updateLayerObjects()
}

var updateLayers = ({layers}) => {
  activeLayers = layers
  updateLayerEditor()
  updateLayerObjects()
}

var updateLayerEditor = () => {
  var reactMount = document.querySelector('#layerEditor')
  ReactDOM.render(React.createElement(layers, {layers: activeLayers, updateLayer, updateLayers}), reactMount)
}

var updateAllLayers = () => {

}

var updateLayerObjects = () => {
  var mapControlsMount = document.querySelector('#mapSibling')
  var mapDatums = getMapDatums()
  ReactDOM.render(React.createElement('div', {className: 'mapControlsContainer'},
    React.createElement(mapControls, {mapDatums, updateAllLayers})
  ), mapControlsMount)
}



var getMapDatums = () => {
  var layersForStandaloneMap = activeLayers
  layersForStandaloneMap = _.filter(layersForStandaloneMap, (layer) => layer != null)
  layersForStandaloneMap = _.map(layersForStandaloneMap, (layer) => layer.layerObject)
  return {
    layers: layersForStandaloneMap,
    center: currentViewBounds.center,
    zoom: currentViewBounds.zoom
  }
}

updateLayerEditor()
updateLayerObjects()
