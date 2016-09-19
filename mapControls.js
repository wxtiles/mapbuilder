import React from 'react'
import ReactDOM from 'react-dom'
import wxtilesTag from './mapOverlay/wxtilesTag'

class mapControls extends React.Component {
  constructor() {
    super()
    this.state = {}
  }

  componentWillMount() {
  }

  render() {
    return React.createElement('div', {className: 'mapControls'},
      React.createElement(wxtilesTag)
    )
  }
}

export default mapControls
