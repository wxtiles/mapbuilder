import request from 'superagent'

const server = 'http://tapa01.unisys.metocean.co.nz'

var getAllLayers = (callback) => {
  console.log('get all layers')
  request
    .get(`${server}/wxtiles/layer/`)
    .end((err, res) => {
      callback(err, JSON.parse(res.text))
    })
}

var getLayer = (id, callback) => {
  console.log(`get layer ${id}`)
  request
    .get(`${server}/wxtiles/layer/${id}/`)
    .end((err, res) => {
      callback(err, JSON.parse(res.text))
    })
}

export default {getAllLayers, getLayer}
