import leaflet from 'leaflet'

var maps = {};
maps.leafletMap = null;
maps.googleMap = null;

maps.mountLeafletMap = () => {
  var leafletMap = leaflet.map('leafletMap', {
    zoom: 5,
    attributionControl: false
  }).setView([-20, 160], 2)

  var baseMap = leaflet.tileLayer('https://c.tiles.mapbox.com/v4/aj.Sketchy2/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWV0b2NlYW4iLCJhIjoia1hXZjVfSSJ9.rQPq6XLE0VhVPtcD9Cfw6A', {
    maxZoom: 18
  }).addTo(leafletMap)

  //Keep a reference to the map so we can reset it after showing and hiding.
  maps.leafletMap = leafletMap;
  return leafletMap;
}

maps.mountGoogleMap = () => {
  var googleMap = new google.maps.Map(document.getElementById('googleMap'), {
    center: {
      lat: 39.50,
      lng: -98.35
    },
    zoom: 5
  });

  //Keep a reference to the map so we can reset it after showing and hiding.
  maps.googleMap = googleMap;
  return googleMap;
}

var openLayersBaseMap = new ol.layer.Tile({
  source: new ol.source.XYZ({
    attributons: [
      new ol.Attribution({
        html: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
      })
    ],
    url: 'http://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
  })
});

maps.mountOpenLayersMap = () => {
  var openLayersMap = new ol.Map({
    target: 'openLayersMap',
    layers: [openLayersBaseMap],
    view: new ol.View({
      center: ol.proj.fromLonLat([37.41, 8.82]),
      zoom: 4
    })
  });

  //Keep a reference to the map so we can reset it after showing and hiding.
  maps.openLayersMap = openLayersMap;
  return openLayersMap;
}

maps.showMap = (selectedMap) => {
  document.getElementById('leafletMap').style.display = 'none';
  document.getElementById('googleMap').style.display = 'none';
  document.getElementById('openLayersMap').style.display = 'none';

  document.getElementById(`${selectedMap.value}Map`).style.display = 'block';

  //Poke the maps so they render correctly after being hidden.
  maps.leafletMap.invalidateSize()
  var center = maps.googleMap.getCenter();
  google.maps.event.trigger(googleMap, 'resize');
  maps.googleMap.setCenter(center);
}

export default maps