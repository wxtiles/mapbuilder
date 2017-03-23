import request from 'superagent'
import _ from 'lodash'

const server = 'https://api.wxtiles.com/v1'
// const server = 'http://172.16.1.50/v1';

// /<ownerID>/layer/
var getAllLayers = ({apikey, onSuccess, onError}) => {
  request
    .get(`${server}/wxtiles/layer/`)
    .set('apikey', apikey)
    .end((err, res) => {
      if (err) return onError(err)
      onSuccess(JSON.parse(res.text))
    })
}
// /<ownerID>/layer/<layerID>/instance/<instanceID>/
var getInstance = ({apikey, layerId, instanceId, onSuccess, onError}) => {
  request
    .get(`${server}/wxtiles/layer/${layerId}/instance/${instanceId}/`)
    .set('apikey', apikey)
    .end((err, res) => {
      if (err) return onError(err)
      onSuccess(res.body)
    })
}

// /<ownerID>/layer/<layerID>/style/<styleID>/
var getStyle = ({apikey, layerId, styleId, onSuccess, onError}) => {
  request
    .get(`${server}/wxtiles/layer/${layerId}/style/${styleId}/`)
    .set('apikey', apikey)
    .end((err, res) => {
      if (err) return onError(err)
      onSuccess(res.body)
    })
}

// /<ownerID>/layer/<layerID>/instance/<instanceID>/times/
var getTimesForInstance = (options) => {
  request
    .get(`${server}/wxtiles/layer/${options.layerId}/instance/${options.instanceId}/times/`)
    .set('apikey', options.apikey)
    .end((err, res) => {
      if (err) return options.onError(err)
      options.onSuccess(JSON.parse(res.text))
    })
}

// /<ownerID>/layer/<layerID>/instance/<instanceID>/levels/
var getLevelsForInstance = (options) => {
  request
    .get(`${server}/wxtiles/layer/${options.layerId}/instance/${options.instanceId}/levels/`)
    .set('apikey', options.apikey)
    .end((err, res) => {
      if (err) return options.onError(err)
      options.onSuccess(JSON.parse(res.text))
    })
}

var getAllTileLayerUrls = ({apikey, layerId, styleId, instanceId, times, level, onSuccess, onError}) => {
  var urls = []
  Promise.all(_.map(times, (time) => {
    return new Promise((resolve, reject) => {
      var scopedSuccess = (url) => {
        resolve({time, url})
      }
      getTileLayerUrl({apikey, layerId, styleId, instanceId, time, level, onSuccess: scopedSuccess, onError})
    })
  })).then((timeUrls) => {
    onSuccess(timeUrls)
  })
}

// /<ownerID>/tile/<layerID>/<styleID>/<instanceID>/<time>/<level>/<z>/<x>/<y>.<extension>
var getTileLayerUrl = ({apikey, layerId, styleId, instanceId, time, level, onSuccess, onError}) => {
  level = level || 0
  time = time || 0
  onSuccess(`${server}/wxtiles/tile/${layerId}/${styleId}/${instanceId}/${time}/${level}/{z}/{x}/{y}.png?apikey=${apikey}`)
}

// /{ownerId}/legend/{layerId}/{styleId}/{size}/{orientation}.png
var getLegendUrl = ({apikey, layerId, styleId, onSuccess, onError}) => {
  onSuccess(`${server}/wxtiles/legend/${layerId}/${styleId}/small/horizontal.png?apikey=${apikey}`)
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
