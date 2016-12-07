import request from 'superagent'
import _ from 'lodash'

// const server = 'https://api.wxtiles.com/v0'
// const server = 'http://172.16.1.16/v0';
const server = 'http://172.16.1.15/v1';

// /<ownerID>/layer/
var getAllLayers = ({onSuccess, onError}) => {
  request
    .get(`${server}/wxtiles/layer/`)
    .end((err, res) => {
      if (err) return onError(err)
      onSuccess(JSON.parse(res.text))
    })
}
// /<ownerID>/layer/<layerID>/instance/<instanceID>/
var getInstance = ({layerId, instanceId, onSuccess, onError}) => {
  request
    .get(`${server}/wxtiles/layer/${layerId}/instance/${instanceId}/`)
    .end((err, res) => {
      if (err) return onError(err)
      onSuccess(res.body)
    })
}

// /<ownerID>/layer/<layerID>/style/<styleID>/
var getStyle = ({layerId, styleId, onSuccess, onError}) => {
  request
    .get(`${server}/wxtiles/layer/${layerId}/style/${styleId}/`)
    .end((err, res) => {
      if (err) return onError(err)
      onSuccess(res.body)
    })
}

// /<ownerID>/layer/<layerID>/instance/<instanceID>/times/
var getTimesForInstance = (options) => {
  request
    .get(`${server}/wxtiles/layer/${options.layerId}/instance/${options.instanceId}/times/`)
    .end((err, res) => {
      if (err) return options.onError(err)
      options.onSuccess(JSON.parse(res.text))
    })
}

// /<ownerID>/layer/<layerID>/instance/<instanceID>/levels/
var getLevelsForInstance = (options) => {
  request
    .get(`${server}/wxtiles/layer/${options.layerId}/instance/${options.instanceId}/levels/`)
    .end((err, res) => {
      if (err) return options.onError(err)
      options.onSuccess(JSON.parse(res.text))
    })
}

var getAllTileLayerUrls = ({layerId, styleId, instanceId, times, level, onSuccess, onError}) => {
  var urls = []
  Promise.all(_.map(times, (time) => {
    return new Promise((resolve, reject) => {
      var scopedSuccess = (url) => {
        resolve({time, url})
      }
      getTileLayerUrl({layerId, styleId, instanceId, time, level, onSuccess: scopedSuccess, onError})
    })
  })).then((timeUrls) => {
    onSuccess(timeUrls)
  })
}

// /<ownerID>/tile/<layerID>/<styleID>/<instanceID>/<time>/<level>/<z>/<x>/<y>.<extension>
var getTileLayerUrl = ({layerId, styleId, instanceId, time, level, onSuccess, onError}) => {
  level = level || 0
  time = time || 0
  onSuccess(`${server}/wxtiles/tile/${layerId}/${styleId}/${instanceId}/${time}/${level}/{z}/{x}/{y}.png`)
}

// https://api.wxtiles.com/v1/{ownerId}/legend/{layerId}/{styleId}/{size}/{orientation}.png
var getLegendUrl = ({layerId, styleId, onSuccess, onError}) => {
  console.log(layerId, styleId)
  onSuccess(`${server}/wxtiles/legend/${layerId}/${styleId}/small/horizontal.png`)
}


//Call this with your url and plug the returned object into google maps, e.g.:
//var mapLayer = wxTiles.google.getImageMapType(layerTilesUrl);
//googleMap.overlayMapTypes.setAt(layerKey, mapLayer);
var googleMaps = {}
googleMaps.getImageMapType = (layerTilesUrl) => {
  return new google.maps.ImageMapType({
    getTileUrl: (coord, zoom) => {
      return layerTilesUrl.replace('{z}', zoom).replace('{x}', coord.x).replace('{y}', (Math.pow(2, zoom) - coord.y - 1));
    },
    tileSize: new google.maps.Size(256, 256),
    isPng: true
  })
}

export default {getAllLayers, getTimesForInstance, getTileLayerUrl, googleMaps, getInstance, getLegendUrl, getAllTileLayerUrls}
