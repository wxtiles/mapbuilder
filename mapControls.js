import React from 'react'
import ReactDOM from 'react-dom'
import wxtilesTag from './mapOverlay/wxtilesTag'
import generateUrl from './mapOverlay/generateUrl'
import legends from './mapOverlay/legends'

class mapControls extends React.Component {
  constructor() {
    super()
    this.state = {}
  }

  componentWillMount() {
  }

  render() {
    return React.createElement('div', {className: 'mapControls'},
      React.createElement(wxtilesTag),
      React.createElement(generateUrl, {getMapDatums: this.props.getMapDatums}),
      React.createElement(legends)
    )
  }
}

export default mapControls
