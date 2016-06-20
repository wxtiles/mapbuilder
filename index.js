import leaflet from 'leaflet'

var mymap = leaflet.map('map').setView([51.505, -0.09], 13);
// make_map = (layers, mapdiv) ->
//   # Create a leaflet map centred over New Zealand with two tile layers
//   mapdiv = if mapdiv? then mapdiv else 'map'
//   map = new L.Map mapdiv,
//   	layers: layers
//   	center: new L.LatLng 39.50, -98.35
//   	zoom: 5
//   	attributionControl: no
//   return map

import React from 'react'
import ReactDOM from 'react-dom'
import root from './root'
var reactMount = document.querySelector('#interface')
ReactDOM.render(React.createElement(root), reactMount)
