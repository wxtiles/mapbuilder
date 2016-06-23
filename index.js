import React from 'react'
import ReactDOM from 'react-dom'
import root from './root'
import createTileLayer from './createTileLayer'
import mapSelector from './mapSelector/mapSelector'
import maps from './maps'

//Prepare the maps.
var mapExamples = [
  { label: 'Leaflet', value: 'leaflet' },
  { label: 'Google Maps', value: 'google' },
  { label: 'Map Box GL', value: 'mapBoxGL' },
]

var leafletMap = maps.mountLeafletMap();
var googleMap = maps.mountGoogleMap();

var defaultMap = mapExamples[0]

var mapSelectorMount = document.querySelector('#mapSelector')
ReactDOM.render(React.createElement(mapSelector, { mapOptions: mapExamples, showMap: maps.showMap, selectedMap: defaultMap }), mapSelectorMount)

maps.showMap(defaultMap)

var putLayer = (url) => {
  console.log(url)
  leaflet.tileLayer(url, {
      maxZoom: 18,
      tms: true
  }).addTo(leafletMap)
}

var reactMount = document.querySelector('#interface')
ReactDOM.render(React.createElement(root, {putLayer}), reactMount)
