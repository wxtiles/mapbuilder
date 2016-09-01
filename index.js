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

var putLayer = (layerKey, url) => {
  removeLayer({layerKey})
  activeLayers[layerKey] = { url: url };

  //Add this layer to the google map.
  var googleMapLayer = wxTiles.googleMaps.getImageMapType(activeLayers[layerKey].url);
  googleMap.overlayMapTypes.setAt(layerKey, googleMapLayer);
  activeLayers[layerKey].googleMapLayer = googleMapLayer;

  //Add this layer to the leaflet map.
  var leafletMapLayer = leaflet.tileLayer(url, {
    maxZoom: 18,
    tms: true,
    opacity: 0.8
  });
  leafletMapLayer.addTo(leafletMap);
  activeLayers[layerKey].leafletMapLayer = leafletMapLayer;

  //Add this layer to the openLayers map.
  var openLayersSource = new ol.source.XYZ();
  openLayersSource.setUrl(url.replace('{y}', '{-y}'));
  var openLayersMapLayer = new ol.layer.Tile({source: openLayersSource});
  activeLayers[layerKey].openLayersMapLayer = openLayersMapLayer;
  //We shift the layer up one level because the base map is is already a layer zero.
  openLayersMap.getLayers().insertAt(layerKey + 1, openLayersMapLayer);
}

var removeLayer = ({layerKey}) => {
  if(activeLayers[layerKey] === undefined) return;

  //This will error if the user clicks the removal button before the data has loaded. So we check if the map layers have been added before trying to remove them.
  if (googleMap.overlayMapTypes.getAt(layerKey) !== undefined) googleMap.overlayMapTypes.removeAt(layerKey);
  if (leafletMap.hasLayer(activeLayers[layerKey].leafletMapLayer)) leafletMap.removeLayer(activeLayers[layerKey].leafletMapLayer);
  openLayersMap.getLayers().remove(activeLayers[layerKey].openLayersMapLayer);

  delete activeLayers[layerKey]
}

var setOpacityOfLayer = ({layerKey, opacity}) => {
  var leafletLayer = activeLayers[layerKey].leafletMapLayer
  leafletLayer.setOpacity(opacity)

  var googleMapLayer = activeLayers[layerKey].googleMapLayer
  googleMapLayer.setOpacity(opacity)
  
}

var reactMount = document.querySelector('#layerEditor')
ReactDOM.render(React.createElement(layers, { putLayer, removeLayer, setOpacityOfLayer }), reactMount)
