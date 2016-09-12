import request from 'superagent'

//const server = 'http://localhost:6060'
const server = 'https://api.wxtiles.com/v0';
const subdomains = ['a', 'b']


// /<ownerID>/layer/
var getAllLayers = (onSuccess, onError) => {
  request
    .get(`${server}/wxtiles/layer/`)
    .end((err, res) => {
      if (err) return onError(err)
      onSuccess(JSON.parse(res.text))
    })
}

var getInstance = ({layerId, instanceId, onSuccess, onError}) => {
  request
    .get(`${server}/wxtiles/layer/${layerId}/instance/${instanceId}/`)
    .end((err, res) => {
      if (err) return onError(err)
      onSuccess(res.body)
    })
}

// /<ownerID>/layer/<layerID>/<instanceID>/times/
var getTimesForInstance = (options) => {
  request
    .get(`${server}/wxtiles/layer/${options.layerId}/instance/${options.instanceId}/times/`)
    .end((err, res) => {
      if (err) return options.onError(err)
      options.onSuccess(JSON.parse(res.text))
    })
}

// /<ownerID>/layer/<layerID>/<instanceID>/levels/
var getLevelsForInstance = (options) => {
  request
    .get(`${server}/wxtiles/layer/${options.layerId}/instance/${options.instanceId}/levels/`)
    .end((err, res) => {
      if (err) return options.onError(err)
      options.onSuccess(JSON.parse(res.text))
    })
}

// /<ownerID>/tile/<layerID>/<instanceID>/<time>/<level>/<z>/<x>/<y>.<extension>
var getTileLayerUrl = ({layerId, instanceId, time, level, onSuccess, onError}) => {
  level = level || 0
  onSuccess({
    key: `layerId:${layerId}-instanceId:${instanceId}-time:${time}-level:${level}`,
    subdomains: subdomains,
    leafletUrl: `https://{s}-api.wxtiles.com/v0/wxtiles/tile/${layerId}/${instanceId}/${time}/${level}/{z}/{x}/{y}.png`,
    googleMapsUrl: `https://api.wxtiles.com/v0/wxtiles/tile/${layerId}/${instanceId}/${time}/${level}/{z}/{x}/{y}.png`,
    openLayersUrl: `https://{${subdomains[0]}-${subdomains[subdomains.length-1]}}-api.wxtiles.com/v0/wxtiles/tile/${layerId}/${instanceId}/${time}/${level}/{z}/{x}/{-y}.png`
  })
}

var getLegendUrl = ({layerId, instanceId, onSuccess, onError}) => {
  onSuccess(`${server}/wxtiles/legend/${layerId}/${instanceId}/small/horizontal.png`)
}

//Call this with your url and plug the returned object into google maps.
//E.G:
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

export default {getAllLayers, getTimesForInstance, getTileLayerUrl, googleMaps, getInstance, getLegendUrl}
