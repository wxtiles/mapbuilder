import leaflet from 'leaflet'
var mymap = leaflet.map('map').setView([51.505, -0.09], 13);

import React from 'react'
import ReactDOM from 'react-dom'
import root from './root'
var reactMount = document.querySelector('#interface')
ReactDOM.render(React.createElement(root), reactMount)
