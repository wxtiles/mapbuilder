import React from 'react'
import ReactDOM from 'react-dom'
import wxTiles from './wxtiles'
import select from 'react-select'
import _ from 'lodash'
import layerLabel from './layerLabel'
import rcSlider from 'rc-slider'
import legend from './legend'
import timeSelector from './timeSelector'

var createLayerObject = (id, key, label, opacity, legendUrl, instanceId, times, urls, visibleUrl) => {
  return {id, key, label, opacity, legendUrl, instanceId, times, urls, visibleUrl}
}

class createTileLayer extends React.Component {
  constructor() {
    super()
    this.state = {}
    this.state.selectedLayer = null
    this.state.loadingInstance = false
    this.selectLayer = this.selectLayer.bind(this)
    this.deleteLayer = this.deleteLayer.bind(this)
    this.setOpacity = this.setOpacity.bind(this)
  }

  selectLayer(selectingLayer) {
    var instances = _.map(selectingLayer.instances, (instance) => {
      instance.value = instance.id
      instance.label = "Instance: " + instance.displayName
      return instance
    })
    instances = _.sortBy(instances, (instance) => { return instance.displayName }).reverse()
    var layer = _.cloneDeep(this.props.layer)
    layer.id = selectingLayer.id
    layer.instances = instances
    layer.instanceId = instances[0].id
    layer.label = selectingLayer.label
    wxTiles.getInstance({
      layerId: layer.id,
      instanceId: layer.instanceId,
      onSuccess: (instanceObject) => {
        layer.times = instanceObject.times
        layer.time = instanceObject.times[2]
        wxTiles.getAllTileLayerUrls({
          layerId: layer.id,
          instanceId: layer.instanceId,
          times: layer.times,
          level: 0,
          onSuccess: (urls) => {
            layer.urls = urls
            wxTiles.getTileLayerUrl({
              layerId: layer.id,
              instanceId: layer.instanceId,
              time: layer.time,
              level: 0,
              onSuccess: (visibleUrl) => {
                layer.visibleUrl = visibleUrl
                this.props.updateLayer({layerObject: layer})
              }
            })
          }
        })
      },
      onError: (error) => {
        console.log(error)
      }
    })
  }

  selectInstance(instance) {
    var layer = _.cloneDeep(this.props.layer)
  }

  componentWillMount() {
    console.log(this.props)
  }

  deleteLayer() {
    this.props.removeLayer({key: this.props.layerKey})
  }

  setOpacity(opacity) {
    var layerObject = _.cloneDeep(this.props.layer)
    layerObject.opacity = opacity
    this.props.updateLayer({layerObject})
  }

  render() {
    var layer = _.cloneDeep(this.props.layer)
    console.log(layer)
    return React.createElement('div', {className: 'createTileLayer'},
      React.createElement('div', {className: 'select-container'},
        React.createElement('div', {className: 'select-list'},
          React.createElement(layerLabel, {
            deleteLayer: this.deleteLayer,
            layers: this.props.layerOptions,
            selectLayer: this.selectLayer,
            layer: layer.id
          }),
          React.createElement('div', {className: 'controls'},
            React.createElement('div', {className: 'transparencyContainer'},
              React.createElement('div', {}, 'Opacity'),
              React.createElement(rcSlider, {
                defaultValue: layer.opacity * 100,
                onChange: (opacity) => this.setOpacity(opacity/100)
              })
            )
          )
        )
      )
    )
  }
}

export default createTileLayer
