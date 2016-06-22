import React from 'react'
import ReactDOM from 'react-dom'
import root from './root'
import leaflet from 'leaflet'
import createTileLayer from './createTileLayer'
import mapSelector from './mapSelector'

var clearMapContainer = () => {
  //Kill the map div and replace it with a black one so we can re-mount a map into a fresh container.
  document.getElementById('map').outerHTML = "<div id='map'></div>";
}

var mountLeafletMap = () => {
  clearMapContainer()
  if (map != undefined) { map.remove(); }
  var map = leaflet.map('map', {
    zoom: 5,
    attributionControl: false
  }).setView([-20, 160], 2)

  var baseMap = leaflet.tileLayer('https://c.tiles.mapbox.com/v4/aj.Sketchy2/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWV0b2NlYW4iLCJhIjoia1hXZjVfSSJ9.rQPq6XLE0VhVPtcD9Cfw6A', {
    maxZoom: 18
  }).addTo(map)
}
var mountGoogleMap = () => {
  clearMapContainer()  
  var googleMap = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 39.50,
      lng: -98.35
    },
    zoom: 5
  });
}

var reactMount = document.querySelector('#interface')

var mapSelectorMount = document.querySelector('#mapSelector')
var examples = [
  { label: 'Leaflet', value: 'leaflet', mountMap: mountLeafletMap },
  { label: 'Google Maps', value: 'googleMaps', mountMap: mountGoogleMap },
  { label: 'Map Box GL', value: 'mapBoxGL', mountMap: () => console.log('mounting map box') },
]

ReactDOM.render(React.createElement(mapSelector, { options: examples }), mapSelectorMount)

var putLayer = (url) => {
  leaflet.tileLayer(url, {
      maxZoom: 18,
      tms: true
  }).addTo(map)
}

ReactDOM.render(React.createElement(createTileLayer, {putLayer}), reactMount)