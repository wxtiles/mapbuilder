import React from 'react'
import ReactDOM from 'react-dom'
import root from './root'
import leaflet from 'leaflet'
import createTileLayer from './createTileLayer'
import mapSelector from './mapSelector'

var leafletMap, googleMap;

var mountLeafletMap = () => {
  leafletMap = leaflet.map('leafletMap', {
    zoom: 5,
    attributionControl: false
  }).setView([-20, 160], 2)

  var baseMap = leaflet.tileLayer('https://c.tiles.mapbox.com/v4/aj.Sketchy2/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWV0b2NlYW4iLCJhIjoia1hXZjVfSSJ9.rQPq6XLE0VhVPtcD9Cfw6A', {
    maxZoom: 18
  }).addTo(leafletMap)
}
var mountGoogleMap = () => {
  googleMap = new google.maps.Map(document.getElementById('googleMap'), {
    center: {
      lat: 39.50,
      lng: -98.35
    },
    zoom: 5
  });
}

var showMap = (selectedMap) => {
  document.getElementById('leafletMap').style.display = 'none';
  document.getElementById('googleMap').style.display = 'none';
  document.getElementById('mapBoxGLMap').style.display = 'none';

  document.getElementById(`${selectedMap.value}Map`).style.display = 'block';

  //Poke the maps so they render correctly after being hidden.
  leafletMap.invalidateSize()
  var center = googleMap.getCenter();
  google.maps.event.trigger(googleMap, 'resize');
  googleMap.setCenter(center);
}

var reactMount = document.querySelector('#interface')

var mapSelectorMount = document.querySelector('#mapSelector')
var examples = [
  { label: 'Leaflet', value: 'leaflet' },
  { label: 'Google Maps', value: 'google' },
  { label: 'Map Box GL', value: 'mapBoxGL' },
]

var defaultMap = examples[0]
ReactDOM.render(React.createElement(mapSelector, { options: examples, showMap: showMap, selectedMap: defaultMap }), mapSelectorMount)

//Prepare the maps.
mountLeafletMap()
mountGoogleMap()
showMap(defaultMap)


var putLayer = (url) => {
  console.log(url)
  leaflet.tileLayer(url, {
      maxZoom: 18,
      tms: true
  }).addTo(leafletMap)
}

ReactDOM.render(React.createElement(root, {putLayer}), reactMount)
