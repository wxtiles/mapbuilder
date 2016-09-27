import React from 'react'
import ReactDOM from 'react-dom'
import layersEditor from './layersEditor'
import createTileLayer from './createTileLayer'
import mapSelector from './mapSelector/mapSelector'
import maps from './maps'
import leaflet from 'leaflet'
import wxTiles from './wxtiles'
import _ from 'lodash'
import mapControls from './mapControls'
import moment from 'moment'
import mapWrapper from './mapWrapper'
import root from './root'

var mapSelectorMount = document.querySelector('#mapSelector')
var currentViewBounds = {center: null, zoom: null}
var onUpdateViewPort = ({zoom, center}) => {
  currentViewBounds = {zoom, center}
}

var now = moment.utc()
ReactDOM.render(React.createElement(root, {now}), document.querySelector('#root'))
