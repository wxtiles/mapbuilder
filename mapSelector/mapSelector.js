import React from 'react'
import ReactDOM from 'react-dom'
import select from 'react-select'
import _ from 'lodash'
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
      React.createElement('div', { className: 'row mapSelector col-sm 6 col-sm-offset-6' }, 'Select map technology '),
      React.createElement('div', { className: 'row btn-group col-sm-6 col-sm-offset-6' },
        _.map(this.props.mapOptions, (mapOption) => {
          var buttonSelected = this.state.selectedMap === mapOption;
          return React.createElement(mapButton, { key: mapOption.value, mapOption: mapOption, selectMap: this.changeMap, selected: buttonSelected })
        }
        )
      )
    )
  }
}

export default mapSelector
