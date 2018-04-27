import React from 'react'
import mapButton from './mapButton'

class mapSelector extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.state.selectedMap = this.props.selectedMap
    this.changeMap = this.changeMap.bind(this)
  }

  changeMap(selectedMap) {
    this.setState({selectedMap}, this.props.showMap(selectedMap))
  }

  render() {
    return React.createElement('div', null,
      React.createElement('div', { className: 'row mapSelector' }, 'Select map technology '),
      React.createElement('div', { className: 'row btn-group col-sm-4 col-sm-offset-4' },
        this.props.mapOptions.map((mapOption) => {
          var buttonSelected = this.state.selectedMap === mapOption;
          return React.createElement(mapButton, { key: mapOption.value, mapOption: mapOption, selectMap: this.changeMap, selected: buttonSelected })
        })
      )
    )
  }
}

export default mapSelector
