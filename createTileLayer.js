import React from 'react'
import ReactDOM from 'react-dom'
import wxTiles from './wxtiles'
import select from 'react-select'
import _ from 'lodash'
import layerLabel from './layerLabel'
import rcSlider from 'rc-slider'
import legend from './legend'
import timeSelector from './timeSelector'

class createTileLayer extends React.Component {
  constructor() {
    super()
    this.state = {}
    this.state.selectedLayer = null
    this.state.isEditing = true
    this.state.loadingInstance = false
    this.state.opacity = 0.8
    this.deleteLayer = this.deleteLayer.bind(this)
    this.edit = this.edit.bind(this)
    this.setOpacity = this.setOpacity.bind(this)
  }

  loadLayersList() {
    this.setState({loadedLayers: null})
    var onSuccess = (layers) => {
      layers = _.map(layers, (layer) => {
        layer.value = layer.id
        layer.label = layer.meta.name
        return layer
      })
      this.setState({loadedLayers: layers})
    }
    var onError = (err) => console.log(err)
    wxTiles.getAllLayers(onSuccess, onError)
  }

  selectLayer(layer) {
    var instances = _.map(layer.instances, (instance) => {
      instance.value = instance.id
      instance.label = "Instance: " + instance.displayName
      return instance
    })
    instances = _.sortBy(instances, (instance) => { return instance.displayName }).reverse(),
    this.setState({selectedLayer: layer, instances: instances, hasLegend: layer.resources.legend}, () => this.selectInstance(instances[0]))
  }

  selectInstance(instance) {
    var options = {
      layerId: this.state.selectedLayer.id,
      instanceId: instance.id,
      onSuccess: (instance) => {
        instance.times = _.map(instance.times, (time) => {
          return {value: time, label: time}
        })
        instance.times.reverse()
        this.setState({selectedInstance: instance, loadingInstance: false, selectedTime: null})
      },
      onError: (error) => console.log(error),
    }
    wxTiles.getInstance(options)
    this.setState({loadingInstance: true})
  }

  selectTime(time) {
    this.setState({selectedTime: time}, () =>{
      var getTileLayerUrlOptions = {
        layerId: this.state.selectedLayer.id,
        instanceId: this.state.selectedInstance.instance.id,
        time: this.state.selectedTime,
        level: 0,
        onSuccess: (url) => {
          this.props.putLayer({
            layerKey: this.props.layerKey,
            url,
            layerId: this.state.selectedLayer.id
          })
        },
        onError: (err) => console.log(err),
      }
      wxTiles.getTileLayerUrl(getTileLayerUrlOptions)
    })
  }

  componentWillMount() {
    this.loadLayersList()
  }

  edit() {
    if (this.state.selectedLayer == null) return
    this.setState({
      isEditing: !this.state.isEditing
    })
  }

  deleteLayer() {
    this.props.removeLayer({layerKey: this.props.layerKey})
  }

  setOpacity(opacity) {
    this.setState({
      opacity
    }, () => {
      var layerObject = {

      }
      this.props.setOpacityOfLayer({
        layerKey: this.props.layerKey,
        layerObject: {
          id: this.state.selectedLayer.id,
          opacity: this.state.opacity,
          hasLegend: this.state.hasLegend
        }
      })
    })
  }

  render() {
    var labelForLayerLabel = 'New layer'
    if (this.state.selectedLayer) {
      labelForLayerLabel = this.state.selectedLayer.label
    }
    var classesForControls = ' hideControls'
    if (this.state.isEditing) classesForControls = ''
    return React.createElement('li', {className: 'createTileLayer'},
      React.createElement('div', {className: 'select-container'},
        React.createElement('div', {className: 'select-list'},
          React.createElement('div', {onClick: this.edit},
            React.createElement(layerLabel, {deleteLayer: this.deleteLayer, label: labelForLayerLabel, isCollapsed: this.state.isEditing})
          ),
          this.state.hasLegend && React.createElement(legend, {layerId: _.get(this.state, 'selectedLayer.id', null), instanceId: _.get(this.state, 'selectedInstance.instance.id', null)}),
          React.createElement('div', {className: classesForControls},
            (this.state.loadedLayers == null) && React.createElement('div', null, 'Downloading layers...'),
            this.state.loadedLayers && React.createElement('div', {},
              React.createElement(select, {
                options: this.state.loadedLayers,
                placeholder: 'Select a layer...',
                value: this.state.selectedLayer,
                onChange: (thing) => this.selectLayer(thing)
              })
            ),
            this.state.selectedInstance && React.createElement('div', {},
              (this.state.loadingInstance == false) && React.createElement(timeSelector, {
                times: this.state.selectedInstance.times,
                selectedTime: this.state.selectedTime,
                updateTime: (thang) => this.selectTime(thang)
              }),
              (this.state.loadingInstance == false) && React.createElement('div', {className: 'transparencyContainer'},
                React.createElement('div', {}, 'Opacity'),
                React.createElement(rcSlider, {
                  defaultValue: this.state.opacity * 100,
                  onChange: (opacity) => this.setOpacity(opacity/100),
                  disabled: this.state.selectedTime == null
                })
              ),
              this.state.loadingInstance && React.createElement('div', {}, 'loading...')
            )
          )
        )
      )
    )
  }
}

export default createTileLayer
