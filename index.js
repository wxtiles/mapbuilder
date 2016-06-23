import React from 'react'
import ReactDOM from 'react-dom'
import root from './root'
import createTileLayer from './createTileLayer'
import mapSelector from './mapSelector/mapSelector'
import maps from './maps'
import leaflet from 'leaflet'
import wxTiles from './wxtiles'

//Prepare the maps.
var mapExamples = [
  { label: 'Leaflet', value: 'leaflet' },
  { label: 'Google Maps', value: 'google' },
  { label: 'Map Box GL', value: 'mapBoxGL' },
]

var leafletMap = maps.mountLeafletMap();
var googleMap = maps.mountGoogleMap();
var activeLayers = [];

var defaultMap = mapExamples[0]

var mapSelectorMount = document.querySelector('#mapSelector')
ReactDOM.render(React.createElement(mapSelector, { mapOptions: mapExamples, showMap: maps.showMap, selectedMap: defaultMap }), mapSelectorMount)

maps.showMap(defaultMap)

var putLayer = (layerKey, url) => {
  activeLayers[layerKey] = url;

  //add this layer to the google map.
  var mapLayer = wxTiles.google.getImageMapType(activeLayers[layerKey]);
  googleMap.overlayMapTypes.setAt(layerKey, mapLayer);

  leaflet.tileLayer(url, {
    maxZoom: 18,
    tms: true
  }).addTo(leafletMap)
}

var removeLayer = ({layerKey}) => {
  activeLayers[layerKey] = undefined;
  googleMap.overlayMapTypes.removeAt(layerKey);
}

var reactMount = document.querySelector('#interface')
ReactDOM.render(React.createElement(root, { putLayer, removeLayer }), reactMount)