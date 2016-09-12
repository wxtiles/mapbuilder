import React from 'react'
import ReactDOM from 'react-dom'
import layers from './layers'
import createTileLayer from './createTileLayer'
import mapSelector from './mapSelector/mapSelector'
import maps from './maps'
import leaflet from 'leaflet'
import wxTiles from './wxtiles'
import hideLayer from './hideLayer'

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
ReactDOM.render(React.createElement(mapSelector, { mapOptions: mapExamples, showMap: maps.showMap, selectedMap: defaultMap }), mapSelectorMount)

maps.showMap(defaultMap)
var counter = 1
var putLayer = (layerKey, tileLayerUrls) => {
  if (!activeLayers[layerKey]) {
    activeLayers[layerKey] = {opacity: 0.8, tileLayerUrls: tileLayerUrls}
  }
  var layer = activeLayers[layerKey][tileLayerUrls.key]
  var layerAlreadyExists = (layer != null)
  if(layerAlreadyExists) {
    setOpacityOfLayerAndUrl({layerKey, activeTileLayerUrls: activeLayers[layerKey].tileLayerUrls, opacity: 0})
    activeLayers[layerKey].activeTileLayerUrls = tileLayerUrls
    setOpacityOfLayerAndUrl({layerKey, activeTileLayerUrls: tileLayerUrls, opacity: activeLayers[layerKey].opacity})
    return
  }
  activeLayers[layerKey][tileLayerUrls.key] = {}

  //Add this layer to the google map.
  var googleMapLayer = wxTiles.googleMaps.getImageMapType(tileLayerUrls.googleMapsUrl);
  googleMap.overlayMapTypes.setAt(counter, googleMapLayer);
  counter++
  activeLayers[layerKey][tileLayerUrls.key].googleMapLayer = googleMapLayer;

  //Add this layer to the leaflet map.
  var leafletMapLayer = leaflet.tileLayer(tileLayerUrls.leafletUrl, {
    maxZoom: 18,
    tms: true,
    subdomains: tileLayerUrls.subdomains
  });
  leafletMapLayer.addTo(leafletMap);
  activeLayers[layerKey][tileLayerUrls.key].leafletMapLayer = leafletMapLayer;

  //Add this layer to the openLayers map.
  var openLayersSource = new ol.source.XYZ();
  openLayersSource.setUrl(tileLayerUrls.openLayersUrl);
  var openLayersMapLayer = new ol.layer.Tile({source: openLayersSource});
  activeLayers[layerKey][tileLayerUrls.key].openLayersMapLayer = openLayersMapLayer;
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

var setOpacityOfLayerAndUrl = ({layerKey, activeTileLayerUrls, opacity}) => {
  var layerInQuestion = activeLayers[layerKey][activeTileLayerUrls.key]

  var leafletLayer = layerInQuestion.leafletMapLayer
  leafletLayer.setOpacity(opacity)

  var googleMapLayer = layerInQuestion.googleMapLayer
  googleMapLayer.setOpacity(opacity)

  var openLayersMapLayer = layerInQuestion.openLayersMapLayer
  openLayersMapLayer.setOpacity(opacity)
}

var setOpacityOfLayer = ({layerKey, opacity}) => {
  activeLayers[layerKey].opacity = opacity
  setOpacityOfLayerAndUrl({layerKey, activeTileLayerUrls: activeLayers[layerKey].tileLayerUrls, opacity})
}

var reactMount = document.querySelector('#layerEditor')
ReactDOM.render(React.createElement(layers, { putLayer, removeLayer, setOpacityOfLayer }), reactMount)
