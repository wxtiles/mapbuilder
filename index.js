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
var currentLayerUrl = '';

var defaultMap = mapExamples[0]

var mapSelectorMount = document.querySelector('#mapSelector')
ReactDOM.render(React.createElement(mapSelector, { mapOptions: mapExamples, showMap: maps.showMap, selectedMap: defaultMap }), mapSelectorMount)

maps.showMap(defaultMap)

var mapTiler = new google.maps.ImageMapType({ 
  getTileUrl: (coord, zoom) => {
    return currentLayerUrl.replace('{z}', zoom).replace('{x}', coord.x).replace('{y}', (Math.pow(2,zoom)-coord.y-1) ); 
    //return zoom + "/" +  + "/" + (Math.pow(2,zoom)-coord.y-1) + ".png"; 
}, 
  tileSize: new google.maps.Size(256, 256), 
  isPng: true
}); 

googleMap.overlayMapTypes.insertAt(0, mapTiler);

var putLayer = (url) => {
  console.log(url)
  currentLayerUrl = url;
  leaflet.tileLayer(url, {
      maxZoom: 18,
      tms: true
  }).addTo(leafletMap)
}

var reactMount = document.querySelector('#interface')
ReactDOM.render(React.createElement(root, {putLayer}), reactMount)
