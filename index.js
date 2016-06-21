import leaflet from 'leaflet'
var map = leaflet.map('map', {
  zoom: 5,
  attributionControl: false
}).setView([-20, 160], 2)

var baseMap = leaflet.tileLayer('https://c.tiles.mapbox.com/v4/aj.Sketchy2/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWV0b2NlYW4iLCJhIjoia1hXZjVfSSJ9.rQPq6XLE0VhVPtcD9Cfw6A', {
    maxZoom: 18
}).addTo(map)

import React from 'react'
import ReactDOM from 'react-dom'
import root from './root'
var reactMount = document.querySelector('#interface')
ReactDOM.render(React.createElement(root), reactMount)
