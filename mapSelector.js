import React from 'react'
import ReactDOM from 'react-dom'
import select from 'react-select'

class mapSelector extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.state.selectedMap = props.selectedMap;
  }

  render() {
    return React.createElement(`div`, {className: 'mapSelector'},
      React.createElement('div', null, 'Pick an example'),
      React.createElement(select, {
        options: this.props.options,
        value: this.state.selectedMap,
        onChange: (selectedMap) => {
          this.setState({selectedMap})
          this.props.showMap(selectedMap)
        }
      })
    )
  }
}

export default mapSelector
