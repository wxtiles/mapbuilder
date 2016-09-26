import React from 'react'
import ReactDOM from 'react-dom'
import layersEditor from './layersEditor'
import createTileLayer from './createTileLayer'
import mapSelector from './mapSelector/mapSelector'
import maps from './maps'
import leaflet from 'leaflet'
import wxTiles from './wxtiles'
import hideLayer from './hideLayer'
import _ from 'lodash'
import mapControls from './mapControls'
import moment from 'moment'
import mapWrapper from './mapWrapper'

ReactDOM.render(React.createElement(hideLayer), document.querySelector('#hideLayerEditor'))

var mapSelectorMount = document.querySelector('#mapSelector')
var currentViewBounds = {center: null, zoom: null}
var onUpdateViewPort = ({zoom, center}) => {
  currentViewBounds = {zoom, center}
}

var putLayer = () => {}

var removeLayer = () => {}

var updateLayers = ({layers}) => {
  updateMap({layers})
  updateLayerEditor({layers})
  mapControlsRenderer({layers})
}

var updateMap = ({layers}) => {
  var reactMount = document.querySelector('#leafletMap')
  ReactDOM.render(React.createElement(mapWrapper, {layers}), reactMount)
}

var updateLayerEditor = ({layers}) => {
  var reactMount = document.querySelector('#layerEditor')
  ReactDOM.render(React.createElement(layersEditor, {layers, updateLayers}), reactMount)
}

var updateAllLayers = () => {

}

var mapControlsRenderer = ({layers}) => {
  layers = _.filter(layers, (layer) => layer != null)
  layers = _.map(layers, (layer) => layer.layerObject)
  var mapDatums = {
    layers,
    center: currentViewBounds.center,
    zoom: currentViewBounds.zoom
  }

  var mapControlsMount = document.querySelector('#mapSibling')
  ReactDOM.render(React.createElement('div', {className: 'mapControlsContainer'},
    React.createElement(mapControls, {mapDatums, updateAllLayers})
  ), mapControlsMount)
}
updateLayers({layers: [{key: 0, opacity:0.8}]})
