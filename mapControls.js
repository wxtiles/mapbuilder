import React from 'react'
import ReactDOM from 'react-dom'
import wxtilesTag from './mapOverlay/wxtilesTag'
import generateUrl from './mapOverlay/generateUrl'
import legends from './mapOverlay/legends'
import _ from 'lodash'

class mapControls extends React.Component {
  constructor() {
    super()
    this.state = {}
  }

  componentWillMount() {
  }

  render() {
    var layers = this.props.mapDatums.layers
    layers = _.filter(layers, (layer) => layer != null)

    var legendsDatums = _.map(layers, (layer) => {
      return {
        label: layer.label,
        url: layer.legendUrl,
        layerId: layer.id,
        instanceId: layer.instanceId
      }
    })
    var generateUrlDatums = _.map(layers, (layer) => {
      return {
        id: layer.id,
        opacity: layer.opacity
      }
    })
    return React.createElement('div', {className: 'mapControls'},
      React.createElement(wxtilesTag),
      React.createElement(generateUrl, {layers: generateUrlDatums}),
      React.createElement(legends, {legends: legendsDatums})
    )
  }
}

export default mapControls
