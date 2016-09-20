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
var activeLayers = [];

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
var counter = 1
var putLayer = (layerKey, url, layerOrder) => {
  if (!activeLayers[layerKey]) {
    activeLayers[layerKey] = {opacity: 0.8, activeUrl: url}
  }
  var layer = activeLayers[layerKey][url]
  var layerAlreadyExists = (layer != null)
  if(layerAlreadyExists) {
    setOpacityOfLayerAndUrl({layerKey, url: activeLayers[layerKey].activeUrl, opacity: 0})
    activeLayers[layerKey].activeUrl = url
    setOpacityOfLayerAndUrl({layerKey, url: url, opacity: activeLayers[layerKey].opacity})
    return
  }
  activeLayers[layerKey][url] = {}

  //Add this layer to the google map.
  var googleMapLayer = wxTiles.googleMaps.getImageMapType(url);
  googleMap.overlayMapTypes.setAt(counter, googleMapLayer);
  counter++
  activeLayers[layerKey][url].googleMapLayer = googleMapLayer;

  //Add this layer to the leaflet map.
  var leafletMapLayer = leaflet.tileLayer(url, {
    maxZoom: 18,
    tms: true,
    zIndex: layerOrder
  });

  //Leaflet does not handle tiles failing to load.
  //This little hack will cause leaflet to reload the layer if a tile errors
  var redrawTimeout = null
  var queueRedraw = () => {
    if (!redrawTimeout) {
      redrawTimeout = setTimeout(() => {
        leafletMapLayer.redraw()
        redrawTimeout = null
      }, 2000)
    }
  }
  leafletMapLayer.on('tileerror', (errorObject) => {
    queueRedraw()
  })
  leafletMapLayer.addTo(leafletMap);
  activeLayers[layerKey][url].leafletMapLayer = leafletMapLayer;

  //Add this layer to the openLayers map.
  var openLayersSource = new ol.source.XYZ();
  openLayersSource.setUrl(url.replace('{y}', '{-y}'));
  var openLayersMapLayer = new ol.layer.Tile({source: openLayersSource});
  activeLayers[layerKey][url].openLayersMapLayer = openLayersMapLayer;
  //We shift the layer up one level because the base map is is already a layer zero.
  openLayersMap.getLayers().insertAt(counter, openLayersMapLayer);

  setOpacityOfLayer({layerKey, opacity: activeLayers[layerKey].opacity})
}

var removeLayer = ({layerKey, url}) => {
  if(activeLayers[layerKey] === undefined) return;
  Object.keys(activeLayers[layerKey]).forEach((key) => {
    //Horrible hack, please fix this someone.
    //activeLayers is becoming an overloaded global variable, such is the life of all the global variables.
    //activeLayers is including keys like 'opacity' and 'layerObject' and not just urls because urls aren't enough.
    if(_.includes(key, 'https://')) {
      //This will error if the user clicks the removal button before the data has loaded. So we check if the map layers have been added before trying to remove them.
      if (googleMap.overlayMapTypes.getAt(layerKey) !== undefined) googleMap.overlayMapTypes.removeAt(layerKey);
      if (leafletMap.hasLayer(activeLayers[layerKey][key].leafletMapLayer)) leafletMap.removeLayer(activeLayers[layerKey][key].leafletMapLayer);
      openLayersMap.getLayers().remove(activeLayers[layerKey][key].openLayersMapLayer);
    }
  })

  delete activeLayers[layerKey]
}

var setOpacityOfLayerAndUrl = ({layerKey, url, opacity}) => {
  var layerInQuestion = activeLayers[layerKey][url]

  var leafletLayer = layerInQuestion.leafletMapLayer
  leafletLayer.setOpacity(opacity)

  var googleMapLayer = layerInQuestion.googleMapLayer
  googleMapLayer.setOpacity(opacity)

  var openLayersMapLayer = layerInQuestion.openLayersMapLayer
  openLayersMapLayer.setOpacity(opacity)
}

var setOpacityOfLayer = ({layerKey, opacity}) => {
  activeLayers[layerKey].opacity = opacity
  setOpacityOfLayerAndUrl({layerKey, url: activeLayers[layerKey].activeUrl, opacity})
}

var updateLayers = ({layerKey, layerObject}) => {
  activeLayers[layerKey].layerObject = layerObject
  updateLayerObjects()
}

var updateLayerObjects = () => {
  var mapControlsMount = document.querySelector('#mapSibling')
  var mapDatums = getMapDatums()
  ReactDOM.render(React.createElement('div', {className: 'mapControlsContainer'},
    React.createElement(mapControls, {mapDatums})
  ), mapControlsMount)
}

var reactMount = document.querySelector('#layerEditor')
ReactDOM.render(React.createElement(layers, {putLayer, removeLayer, setOpacityOfLayer, updateLayers}), reactMount)

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

updateLayerObjects()
