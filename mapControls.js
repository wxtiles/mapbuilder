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
    // console.log(this.props.layers)
    // var legendDatums = _.map(this.props.layers, (layer) => {
    //   return {
    //     layerDisplayName: layer.id
    //
    //   }
    // })
    return React.createElement('div', {className: 'mapControls'},
      React.createElement(wxtilesTag),
      React.createElement(generateUrl, {layers: this.props.layers}),
      React.createElement(legends)
    )
  }
}

export default mapControls
