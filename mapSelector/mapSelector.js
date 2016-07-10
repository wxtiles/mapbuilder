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
      React.createElement('div', { className: 'row mapSelector' },
        React.createElement('h4', { className: 'col-sm-4 col-sm-offset-4' }, 'Edit Layers:')
      ),
      React.createElement('div', { className: 'row btn-group col-sm-4 col-sm-offset-4' },
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
