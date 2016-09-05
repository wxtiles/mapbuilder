import React from 'react'
import ReactDOM from 'react-dom'
import layers from './layers'
import createTileLayer from './createTileLayer'
import mapSelector from './mapSelector/mapSelector'
import maps from './maps'
import leaflet from 'leaflet'
import wxTiles from './wxtiles'

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
ReactDOM.render(React.createElement(mapSelector, { mapOptions: mapExamples, showMap: maps.showMap, selectedMap: defaultMap }), mapSelectorMount)

maps.showMap(defaultMap)
var counter = 1
var putLayer = (layerKey, url) => {
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
    tms: true
  });
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
    //This will error if the user clicks the removal button before the data has loaded. So we check if the map layers have been added before trying to remove them.
    if (googleMap.overlayMapTypes.getAt(layerKey) !== undefined) googleMap.overlayMapTypes.removeAt(layerKey);
    if (leafletMap.hasLayer(activeLayers[layerKey][key].leafletMapLayer)) leafletMap.removeLayer(activeLayers[layerKey][key].leafletMapLayer);
    openLayersMap.getLayers().remove(activeLayers[layerKey][key].openLayersMapLayer);
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
}

var reactMount = document.querySelector('#layerEditor')
ReactDOM.render(React.createElement(layers, { putLayer, removeLayer, setOpacityOfLayer }), reactMount)
