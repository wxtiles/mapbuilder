import request from 'superagent'

const server = 'http://tapa01.unisys.metocean.co.nz'

// /<ownerID>/layer/
var getAllLayers = (onSuccess, onError) => {
  request
    .get(`${server}/wxtiles/layer/`)
    .end((err, res) => {
      if (err) return onError(err)
      onSuccess(JSON.parse(res.text))
    })
}

// /<ownerID>/layer/<layerID>/<instanceID>/times/
var getTimesForInstance = (options) => {
  request
    .get(`${server}/wxtiles/layer/${options.layerId}/${options.instanceId}/times`)
    .end((err, res) => {
      if (err) return options.onError(err)
      options.onSuccess(JSON.parse(res.text))
    })
}

export default {getAllLayers, getTimesForInstance}
