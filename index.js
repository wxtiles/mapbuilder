var request = require('superagent')
request
  .get('http://tapa01.unisys.metocean.co.nz/wxtiles/layer/')
  .end(function(err, res) {
    console.log(JSON.parse(res.text))
  })
console.log('test')
var mapboxgl = require('mapbox-gl')
mapboxgl.accessToken = 'pk.eyJ1IjoibWV0b2NlYW4iLCJhIjoia1hXZjVfSSJ9.rQPq6XLE0VhVPtcD9Cfw6A'

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/outdoors-v9',
  center: [-122.420679, 37.772537],
  zoom: 13
})

var thingy = (abc) => {
  console.log('zzzzzz zzzinside thiasdngy')
}
thingy()

console.log('is watchify working?')
