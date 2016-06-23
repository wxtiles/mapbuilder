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

maps.showMap = (selectedMap) => {
  document.getElementById('leafletMap').style.display = 'none';
  document.getElementById('googleMap').style.display = 'none';
  document.getElementById('mapBoxGLMap').style.display = 'none';

  document.getElementById(`${selectedMap.value}Map`).style.display = 'block';

  //Poke the maps so they render correctly after being hidden.
  maps.leafletMap.invalidateSize()
  var center = maps.googleMap.getCenter();
  google.maps.event.trigger(googleMap, 'resize');
  maps.googleMap.setCenter(center);
}

export default maps