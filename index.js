import React from 'react'
import ReactDOM from 'react-dom'
import root from './root'
import createTileLayer from './createTileLayer'
import mapSelector from './mapSelector/mapSelector'
import maps from './maps'
import leaflet from 'leaflet'

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

var mapTilerGenerator = (layerKey) => {
  return new google.maps.ImageMapType({
    getTileUrl: (coord, zoom) => {
      return activeLayers[layerKey].replace('{z}', zoom).replace('{x}', coord.x).replace('{y}', (Math.pow(2, zoom) - coord.y - 1));
    },
    tileSize: new google.maps.Size(256, 256),
    isPng: true
  });
}

var putLayer = (layerKey, url) => {
  activeLayers[layerKey] = url;

  //add this layer to the google map.
  googleMap.overlayMapTypes.setAt(layerKey, mapTilerGenerator(layerKey));

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
