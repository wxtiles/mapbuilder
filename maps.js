import leaflet from 'leaflet'

var maps = {};
maps.leafletMap = null;
maps.googleMap = null;

maps.mountLeafletMap = () => {
  var leafletMap = leaflet.map('leafletMap', {
    zoom: 5,
    attributionControl: false,
    zoomControl: false
  }).setView([-20, 160], 2)
  leafletMap.on('moveend', (e) => {
    var centerPoint = {
      lat: leafletMap.getCenter().lat,
      lng: leafletMap.getCenter().lng
    }
    maps.onUpdateViewPort({zoom: leafletMap.getZoom(), center: centerPoint})
  })

  var baseMap = leaflet.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: 'Map tiles by <a href="https://stamen.com">Stamen Design</a>, <a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abc',
    minZoom: 0,
    maxZoom: 20,
  }).addTo(leafletMap)

  //Keep a reference to the map so we can reset it after showing and hiding.
  maps.leafletMap = leafletMap;
  return leafletMap;
}


export default maps
