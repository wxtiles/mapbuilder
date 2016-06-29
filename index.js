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
  activeLayers[layerKey] = { url: url };

  //add this layer to the google map.
  var googleMapLayer = wxTiles.google.getImageMapType(activeLayers[layerKey]);
  googleMap.overlayMapTypes.setAt(layerKey, googleMapLayer);
  activeLayers[layerKey].googleMapLayer = googleMapLayer;

  var leafletMapLayer = leaflet.tileLayer(url, {
    maxZoom: 18,
    tms: true
  });
  leafletMapLayer.addTo(leafletMap);
  activeLayers[layerKey].leafletMapLayer = leafletMapLayer;
}

var removeLayer = ({layerKey}) => {
  //This will error if the user clicks the removal button before the data has loaded. So we check if the map layers have been added before trying to remove them.
  if(googleMap.overlayMapTypes.getAt(layerKey) !== undefined) googleMap.overlayMapTypes.removeAt(layerKey);
  if(leafletMap.hasLayer(activeLayers[layerKey])) leafletMap.removeLayer(activeLayers[layerKey]);

  activeLayers[layerKey] = undefined;
}

var reactMount = document.querySelector('#interface')
ReactDOM.render(React.createElement(root, { putLayer, removeLayer }), reactMount)